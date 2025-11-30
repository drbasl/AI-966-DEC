import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Sparkles, Send, Trash2, Bot, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Workspace() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.chat.publicChat.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) {
      toast.error(language === "ar" ? "الرجاء إدخال رسالة" : "Please enter a message");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const result = await chatMutation.mutateAsync({
        message: input.trim(),
        conversationHistory: messages,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: result.response,
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      toast.error(language === "ar" ? "فشل في الحصول على الرد" : "Failed to get response");
      console.error(error);
    }
  };

  const handleClear = () => {
    setMessages([]);
    toast.success(language === "ar" ? "تم مسح المحادثة" : "Chat cleared");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-violet-500 to-purple-500">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {language === "ar" ? "ChatRaqim" : "ChatRaqim"}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {language === "ar"
            ? "دردشة ذكية مباشرة مع رقيم - مساعدك الشخصي بالذكاء الاصطناعي"
            : "Smart chat directly with Raqim - Your personal AI assistant"}
        </p>
      </div>

      {/* Chat Card */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {language === "ar" ? "محادثة مباشرة" : "Live Chat"}
            </CardTitle>
            <CardDescription>
              {language === "ar"
                ? "اكتب رسالتك واحصل على رد فوري من رقيم"
                : "Type your message and get instant response from Raqim"}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={messages.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {language === "ar" ? "مسح" : "Clear"}
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  {language === "ar" ? "ابدأ محادثة جديدة" : "Start a new conversation"}
                </p>
                <p className="text-sm mt-2">
                  {language === "ar"
                    ? "اكتب رسالتك في الأسفل للبدء"
                    : "Type your message below to start"}
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-violet-500 text-white"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white rounded-tr-sm"
                        : "bg-violet-100 dark:bg-violet-900/30 text-foreground rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {chatMutation.isPending && (
              <div className="flex justify-start animate-in slide-in-from-bottom-2">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-violet-100 dark:bg-violet-900/30 rounded-tl-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        {language === "ar" ? "رقيم يكتب..." : "Raqim is typing..."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === "ar" ? "اكتب رسالتك هنا..." : "Type your message here..."}
              className="min-h-[80px] resize-none"
              disabled={chatMutation.isPending}
            />
            <Button
              onClick={handleSend}
              disabled={chatMutation.isPending || !input.trim()}
              size="lg"
              className="self-end min-w-[100px]"
            >
              {chatMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {language === "ar" ? "إرسال" : "Send"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="border-violet-200 dark:border-violet-800">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              {language === "ar" ? "ذكي ومتطور" : "Smart & Advanced"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {language === "ar"
                ? "تقنية ذكاء اصطناعي متقدمة لردود دقيقة"
                : "Advanced AI technology for accurate responses"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              {language === "ar" ? "سياق المحادثة" : "Conversation Context"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {language === "ar"
                ? "يتذكر السياق الكامل للمحادثة"
                : "Remembers full conversation context"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-600" />
              {language === "ar" ? "ردود فورية" : "Instant Responses"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {language === "ar"
                ? "احصل على ردود سريعة ودقيقة"
                : "Get fast and accurate responses"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
