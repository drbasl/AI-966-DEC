import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Trash2, Sparkles, Copy, Check, Bot, User, Lightbulb, Code, BookOpen, Zap } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// اقتراحات سريعة
const quickSuggestions = [
  {
    icon: Lightbulb,
    text: "اشرح لي مفهوم معقد بطريقة بسيطة",
    prompt: "اشرح لي مفهوم الذكاء الاصطناعي بطريقة بسيطة ومفهومة"
  },
  {
    icon: Code,
    text: "ساعدني في كتابة كود برمجي",
    prompt: "اكتب لي مثال على كود Python بسيط"
  },
  {
    icon: BookOpen,
    text: "لخص لي موضوع معين",
    prompt: "لخص لي أهم النقاط في موضوع التعلم الآلي"
  },
  {
    icon: Zap,
    text: "أعطني أفكار إبداعية",
    prompt: "أعطني 5 أفكار إبداعية لمشروع تقني جديد"
  }
];

export default function AIChat() {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatMutation = trpc.chat.publicChat.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // تحميل البرومبت من localStorage
  useEffect(() => {
    const savedPrompt = localStorage.getItem('chatRaqimPrompt');
    if (savedPrompt) {
      setInput(savedPrompt);
      localStorage.removeItem('chatRaqimPrompt');
      toast.success("تم تحميل البرومبت! 🎉", {
        description: "يمكنك الآن إرساله مباشرة",
      });
      inputRef.current?.focus();
    }
  }, []);

  const handleCopy = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      toast.success("تم النسخ! ✓");
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error("فشل النسخ");
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const conversationHistory = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const result = await chatMutation.mutateAsync({
        message: input.trim(),
        conversationHistory: conversationHistory.slice(0, -1),
      });

      setIsTyping(false);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: result.response,
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      setIsTyping(false);
      toast.error("حدث خطأ في الاتصال", {
        description: "يرجى المحاولة مرة أخرى",
      });
      console.error(error);
    }
  };

  const handleClear = () => {
    setMessages([]);
    toast.success("تم مسح المحادثة");
  };

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#0F1115]' : 'bg-[#F0F4F9]'
    }`}>
      {/* خلفية متحركة */}
      {theme === 'dark' && (
        <div className="fixed inset-0 pointer-events-none z-0"
             style={{
               background: `
                 radial-gradient(circle at 15% 15%, rgba(232, 122, 82, 0.06), transparent 40%),
                 radial-gradient(circle at 85% 85%, rgba(11, 87, 208, 0.04), transparent 40%)
               `,
               filter: 'blur(60px)',
             }}
        />
      )}

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-[#E87A52] to-[#FFB088]'
                  : 'bg-gradient-to-br from-[#0B57D0] to-[#00C6FF]'
              } shadow-lg`}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-cairo">
                  ChatRaqim
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-[#9B9C9E]' : 'text-[#4B5563]'}`}>
                  {language === 'ar' ? 'محادثة ذكية مع AI' : 'Smart AI Conversation'}
                </p>
              </div>
            </div>

            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className={`${
                  theme === 'dark'
                    ? 'border-[#2A2D35] hover:border-[#E87A52] hover:text-[#E87A52]'
                    : 'border-[#E5E7EB] hover:border-[#0B57D0] hover:text-[#0B57D0]'
                }`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                مسح
              </Button>
            )}
          </div>
        </div>

        {/* Chat Container */}
        <Card className={`shadow-2xl border-2 overflow-hidden ${
          theme === 'dark'
            ? 'bg-[#181A20] border-[#2A2D35]'
            : 'bg-white border-[#E5E7EB]'
        }`}>
          {/* Messages Area */}
          <div className="h-[calc(100vh-320px)] overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-[#E87A52]/10'
                    : 'bg-[#0B57D0]/10'
                }`}>
                  <Bot className={`w-10 h-10 ${
                    theme === 'dark' ? 'text-[#E87A52]' : 'text-[#0B57D0]'
                  }`} />
                </div>
                <h3 className="text-xl font-bold mb-2 font-cairo">
                  {language === 'ar' ? 'مرحباً بك في ChatRaqim' : 'Welcome to ChatRaqim'}
                </h3>
                <p className={`text-sm mb-6 max-w-md ${
                  theme === 'dark' ? 'text-[#9B9C9E]' : 'text-[#4B5563]'
                }`}>
                  {language === 'ar'
                    ? 'ابدأ محادثة ذكية مع AI. اسأل أي شيء، واحصل على إجابات دقيقة ومفيدة'
                    : 'Start a smart conversation with AI. Ask anything and get accurate answers'}
                </p>

                {/* اقتراحات سريعة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {quickSuggestions.map((suggestion, i) => {
                    const Icon = suggestion.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion.prompt)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-right ${
                          theme === 'dark'
                            ? 'bg-[#1F2127] border-[#2A2D35] hover:border-[#E87A52] hover:bg-[#E87A52]/5'
                            : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#0B57D0] hover:bg-[#0B57D0]/5'
                        }`}
                      >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${
                          theme === 'dark' ? 'text-[#E87A52]' : 'text-[#0B57D0]'
                        }`} />
                        <span className="text-sm font-medium">{suggestion.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} group`}
                  >
                    {/* Avatar */}
                    <Avatar className={`w-10 h-10 flex-shrink-0 ${
                      msg.role === "assistant"
                        ? theme === 'dark'
                          ? 'bg-gradient-to-br from-[#E87A52] to-[#FFB088]'
                          : 'bg-gradient-to-br from-[#0B57D0] to-[#00C6FF]'
                        : theme === 'dark'
                          ? 'bg-[#2A2D35]'
                          : 'bg-[#E5E7EB]'
                    }`}>
                      <AvatarFallback className="bg-transparent">
                        {msg.role === "assistant" ? (
                          <Bot className="w-5 h-5 text-white" />
                        ) : (
                          <User className={`w-5 h-5 ${theme === 'dark' ? 'text-[#EDEDED]' : 'text-[#111827]'}`} />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    {/* Message Content */}
                    <div className={`flex-1 ${msg.role === "user" ? "flex justify-end" : ""}`}>
                      <div className={`max-w-[85%] md:max-w-[75%]`}>
                        {/* Message Bubble */}
                        <div className={`rounded-2xl p-4 shadow-sm ${
                          msg.role === "user"
                            ? theme === 'dark'
                              ? 'bg-gradient-to-br from-[#E87A52] to-[#F09268] text-white'
                              : 'bg-gradient-to-br from-[#0B57D0] to-[#4285F4] text-white'
                            : theme === 'dark'
                              ? 'bg-[#1F2127] border border-[#2A2D35]'
                              : 'bg-[#F9FAFB] border border-[#E5E7EB]'
                        }`}>
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        </div>

                        {/* Message Footer */}
                        <div className={`flex items-center gap-2 mt-2 px-2 ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}>
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-[#9B9C9E]' : 'text-[#9CA3AF]'
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString("ar-SA", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(msg.content, i)}
                            className={`h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                              copiedIndex === i ? 'opacity-100' : ''
                            }`}
                          >
                            {copiedIndex === i ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* مؤشر الكتابة */}
                {isTyping && (
                  <div className="flex gap-3">
                    <Avatar className={`w-10 h-10 flex-shrink-0 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-[#E87A52] to-[#FFB088]'
                        : 'bg-gradient-to-br from-[#0B57D0] to-[#00C6FF]'
                    }`}>
                      <AvatarFallback className="bg-transparent">
                        <Bot className="w-5 h-5 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div className={`rounded-2xl p-4 ${
                      theme === 'dark'
                        ? 'bg-[#1F2127] border border-[#2A2D35]'
                        : 'bg-[#F9FAFB] border border-[#E5E7EB]'
                    }`}>
                      <div className="flex gap-1">
                        <div className={`w-2 h-2 rounded-full animate-bounce ${
                          theme === 'dark' ? 'bg-[#E87A52]' : 'bg-[#0B57D0]'
                        }`} style={{ animationDelay: '0ms' }} />
                        <div className={`w-2 h-2 rounded-full animate-bounce ${
                          theme === 'dark' ? 'bg-[#E87A52]' : 'bg-[#0B57D0]'
                        }`} style={{ animationDelay: '150ms' }} />
                        <div className={`w-2 h-2 rounded-full animate-bounce ${
                          theme === 'dark' ? 'bg-[#E87A52]' : 'bg-[#0B57D0]'
                        }`} style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className={`border-t p-4 ${
            theme === 'dark' ? 'border-[#2A2D35] bg-[#1F2127]' : 'border-[#E5E7EB] bg-[#F9FAFB]'
          }`}>
            <div className="flex gap-3">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={language === 'ar'
                  ? "اكتب رسالتك هنا... (اضغط Enter للإرسال)"
                  : "Type your message... (Press Enter to send)"}
                className={`min-h-[60px] max-h-[200px] resize-none text-base ${
                  theme === 'dark'
                    ? 'bg-[#181A20] border-[#2A2D35] focus:border-[#E87A52]'
                    : 'bg-white border-[#E5E7EB] focus:border-[#0B57D0]'
                }`}
                disabled={chatMutation.isPending}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
                className={`h-[60px] w-[60px] rounded-2xl shadow-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-[#E87A52] to-[#FFB088] hover:shadow-[0_10px_30px_rgba(232,122,82,0.3)]'
                    : 'bg-gradient-to-r from-[#0B57D0] to-[#00C6FF] hover:shadow-[0_10px_30px_rgba(11,87,208,0.25)]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Send className="w-5 h-5 text-white" />
              </Button>
            </div>

            {/* Hint */}
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className={`text-xs ${
                theme === 'dark'
                  ? 'border-[#2A2D35] text-[#9B9C9E]'
                  : 'border-[#E5E7EB] text-[#6B7280]'
              }`}>
                <Sparkles className="w-3 h-3 mr-1" />
                Powered by RAQIM AI
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
