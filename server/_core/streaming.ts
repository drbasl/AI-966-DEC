/**
 * نظام Streaming للردود التدريجية - ChatRaqim
 * يوفر تجربة مستخدم محسنة مع ردود فورية
 */

import { invokeLLM } from "./llm";
import { buildSystemPrompt } from "./systemPrompt";
import { prepareMessagesForLLM } from "./contextManager";

/**
 * تيب للرسائل المتدفقة
 */
export type StreamChunk = 
  | { type: 'content'; content: string }
  | { type: 'done'; fullContent: string }
  | { type: 'error'; error: string };

/**
 * دالة streaming للمحادثة
 * ملاحظة: DeepSeek API قد لا يدعم streaming حالياً
 * هذه نسخة تجريبية للتوافق المستقبلي
 */
export async function* streamChat(params: {
  message: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  mode?: 'code' | 'education' | 'creative' | 'analysis' | 'general';
  userPreferences?: {
    responseLength?: 'short' | 'medium' | 'detailed';
    formalityLevel?: 'casual' | 'professional' | 'formal';
  };
}): AsyncGenerator<StreamChunk, void, unknown> {
  try {
    // 1. بناء System Prompt
    const systemPrompt = buildSystemPrompt({
      mode: params.mode,
      userPreferences: params.userPreferences,
    });

    // 2. إدارة السياق
    const optimizedMessages = prepareMessagesForLLM(
      params.conversationHistory || [],
      params.message,
      systemPrompt,
      {
        maxTokens: 4000,
        maxMessages: 20,
        preserveRecent: 6,
        summarizeOld: true,
      }
    );

    // 3. استدعاء LLM بدون streaming (حتى يتم دعمه)
    const response = await invokeLLM({
      messages: optimizedMessages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    // 4. محاكاة streaming بتقسيم الرد إلى أجزاء
    const content = response.choices?.[0]?.message?.content;
    const fullContent = typeof content === 'string' ? content : JSON.stringify(content);

    // تقسيم النص إلى كلمات لمحاكاة streaming
    const words = fullContent.split(' ');
    let currentText = '';
    
    for (const word of words) {
      currentText += (currentText ? ' ' : '') + word;
      yield { type: 'content', content: word + ' ' };
      
      // إضافة تأخير صغير لمحاكاة streaming
      await new Promise(resolve => setTimeout(resolve, 30));
    }

    // 5. إشارة انتهاء
    yield { type: 'done', fullContent };

  } catch (error) {
    console.error('Streaming error:', error);
    yield { 
      type: 'error', 
      error: error instanceof Error ? error.message : 'حدث خطأ في الحصول على الرد' 
    };
  }
}

/**
 * دالة مساعدة لتحويل stream إلى نص كامل
 */
export async function streamToString(
  stream: AsyncGenerator<StreamChunk, void, unknown>
): Promise<string> {
  let result = '';
  
  for await (const chunk of stream) {
    if (chunk.type === 'content') {
      result += chunk.content;
    } else if (chunk.type === 'done') {
      return chunk.fullContent;
    } else if (chunk.type === 'error') {
      throw new Error(chunk.error);
    }
  }
  
  return result;
}

/**
 * Hook helper للاستخدام في Frontend (مرجع فقط)
 */
export const FRONTEND_STREAMING_EXAMPLE = `
// في React Component:
import { useState } from 'react';

function useStreamingChat() {
  const [response, setResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  const streamMessage = async (message: string, history: any[]) => {
    setIsStreaming(true);
    setResponse('');
    
    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationHistory: history }),
      });
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\\n').filter(Boolean);
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'content') {
              setResponse(prev => prev + data.content);
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
    } finally {
      setIsStreaming(false);
    }
  };
  
  return { response, streamMessage, isStreaming };
}
`;
