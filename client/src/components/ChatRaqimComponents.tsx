/**
 * React Components جاهزة لـ ChatRaqim المحسّن
 * تدعم: Streaming + Context Management + Smart Prompts
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

// ===========================================
// 1️⃣ Hook للـ Streaming Chat
// ===========================================

interface UseStreamingChatOptions {
  onChunkReceived?: (chunk: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: string) => void;
}

export function useStreamingChat(options: UseStreamingChatOptions = {}) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const streamMessage = useCallback(
    async (
      message: string,
      history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
      mode?: 'code' | 'education' | 'creative' | 'analysis' | 'general'
    ) => {
      setIsStreaming(true);
      setCurrentResponse('');
      setError(null);

      try {
        // استخدام mutation للحصول على الـ generator
        const mutation = trpc.chat.publicChatStream.useMutation();
        const generator = await mutation.mutateAsync({
          message,
          conversationHistory: history,
          mode,
        });
        
        // معالجة الـ chunks من الـ generator
        for await (const chunk of generator) {
          if (chunk.type === 'content' && 'content' in chunk) {
            setCurrentResponse(prev => prev + chunk.content);
            options.onChunkReceived?.(chunk.content);
          } else if (chunk.type === 'done' && 'fullContent' in chunk) {
            options.onComplete?.(chunk.fullContent);
          } else if (chunk.type === 'error' && 'error' in chunk) {
            setError(chunk.error);
            options.onError?.(chunk.error);
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'فشل في الحصول على الرد';
        setError(errorMsg);
        options.onError?.(errorMsg);
      } finally {
        setIsStreaming(false);
      }
    },
    [options]
  );

  return {
    streamMessage,
    isStreaming,
    currentResponse,
    error,
    reset: () => {
      setCurrentResponse('');
      setError(null);
    },
  };
}

// ===========================================
// 2️⃣ Hook للـ Regular Chat (بدون streaming)
// ===========================================

interface UseRaqimChatOptions {
  mode?: 'code' | 'education' | 'creative' | 'analysis' | 'general';
  responseLength?: 'short' | 'medium' | 'detailed';
  formalityLevel?: 'casual' | 'professional' | 'formal';
}

export function useRaqimChat(options: UseRaqimChatOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = trpc.chat.publicChat.useMutation({
    onSuccess: () => setIsLoading(false),
    onError: (err) => {
      setError(err.message);
      setIsLoading(false);
    },
  });

  const sendMessage = useCallback(
    async (
      message: string,
      history: Array<{ role: 'user' | 'assistant'; content: string }> = []
    ) => {
      setIsLoading(true);
      setError(null);

      const response = await mutation.mutateAsync({
        message,
        conversationHistory: history,
        mode: options.mode || 'general',
        userPreferences: {
          responseLength: options.responseLength || 'medium',
          formalityLevel: options.formalityLevel || 'professional',
        },
      });

      return response.response;
    },
    [options, mutation]
  );

  return {
    sendMessage,
    isLoading,
    error,
  };
}

// ===========================================
// 3️⃣ Component: ChatRaqim الأساسي
// ===========================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatRaqimBasic() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage, isLoading } = useRaqimChat({
    mode: 'general',
    responseLength: 'medium',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await sendMessage(
        userMessage.content,
        messages.map(m => ({ role: m.role, content: m.content }))
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-lg shadow-lg">
        <h1 className="text-2xl font-bold">💬 ChatRaqim</h1>
        <p className="text-sm opacity-90">مساعدك الذكي المتطور</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-xl font-semibold mb-2">مرحباً بك في ChatRaqim</h2>
            <p>كيف يمكنني مساعدتك اليوم؟</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white border border-gray-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className="text-xs opacity-70 mt-2">
                {msg.timestamp.toLocaleTimeString('ar-SA', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// 4️⃣ Component: ChatRaqim مع Streaming
// ===========================================

export function ChatRaqimStreaming() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { streamMessage, isStreaming, currentResponse } = useStreamingChat({
    onComplete: (fullResponse) => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, currentResponse]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    await streamMessage(
      userMessage.content,
      messages.map(m => ({ role: m.role, content: m.content }))
    );
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4" dir="rtl">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 rounded-t-lg shadow-lg">
        <h1 className="text-2xl font-bold">⚡ ChatRaqim Streaming</h1>
        <p className="text-sm opacity-90">ردود فورية وتدريجية</p>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-white border border-gray-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isStreaming && currentResponse && (
          <div className="flex justify-start">
            <div className="bg-white border border-purple-200 rounded-lg p-4 max-w-[80%]">
              <div className="whitespace-pre-wrap">{currentResponse}</div>
              <span className="inline-block w-2 h-4 bg-purple-600 animate-pulse ml-1"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isStreaming}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {isStreaming ? 'جارٍ الإرسال...' : 'إرسال'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// 5️⃣ Component: ChatRaqim متقدم مع أوضاع
// ===========================================

export function ChatRaqimAdvanced() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'general' | 'code' | 'education' | 'creative'>('general');
  
  const { sendMessage, isLoading } = useRaqimChat({ 
    mode,
    responseLength: 'medium',
  });

  const modeConfig = {
    general: { icon: '💬', name: 'عام', color: 'bg-blue-500' },
    code: { icon: '💻', name: 'برمجة', color: 'bg-green-500' },
    education: { icon: '📚', name: 'تعليم', color: 'bg-purple-500' },
    creative: { icon: '🎨', name: 'إبداع', color: 'bg-pink-500' },
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await sendMessage(
        userMessage.content,
        messages.map(m => ({ role: m.role, content: m.content }))
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4" dir="rtl">
      <div className={`${modeConfig[mode].color} text-white p-4 rounded-t-lg shadow-lg`}>
        <h1 className="text-2xl font-bold">
          {modeConfig[mode].icon} ChatRaqim - {modeConfig[mode].name}
        </h1>
        
        {/* Mode Selector */}
        <div className="flex gap-2 mt-3">
          {(Object.keys(modeConfig) as Array<keyof typeof modeConfig>).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                mode === m
                  ? 'bg-white text-gray-800 font-semibold'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {modeConfig[m].icon} {modeConfig[m].name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                msg.role === 'user'
                  ? `${modeConfig[mode].color} text-white`
                  : 'bg-white border border-gray-200'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-t p-4 rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب رسالتك..."
            className="flex-1 border rounded-lg px-4 py-2"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`${modeConfig[mode].color} text-white px-6 py-2 rounded-lg disabled:opacity-50`}
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// 6️⃣ Export All
// ===========================================

export default {
  ChatRaqimBasic,
  ChatRaqimStreaming,
  ChatRaqimAdvanced,
  useRaqimChat,
  useStreamingChat,
};
