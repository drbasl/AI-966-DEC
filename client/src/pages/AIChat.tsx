import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Send, Trash2, Download, Settings2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState<"deepseek" | "openai" | "gemini">("deepseek");
  const [model, setModel] = useState("deepseek-chat");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState("أنت مساعد ذكي متخصص في اللغة العربية.");
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMutation = trpc.chat.send.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const apiMessages = [
        { role: "system" as const, content: systemPrompt },
        ...newMessages,
      ];

      const result = await chatMutation.mutateAsync({
        messages: apiMessages as any,
        provider,
        model,
      });

      const responseContent = typeof result.response === 'string'
        ? result.response
        : (result.response as any).choices?.[0]?.message?.content || "No response";

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: typeof responseContent === 'string' ? responseContent : JSON.stringify(responseContent),
        },
      ]);
    } catch (error) {
      toast.error("حدث خطأ في إرسال الرسالة");
      console.error(error);
    }
  };

  const handleClear = () => {
    setMessages([]);
    toast.success("تم مسح المحادثة");
  };

  const handleExport = () => {
    const content = messages
      .map((m) => `**${m.role === "user" ? "أنت" : "المساعد"}:**\n${m.content}`)
      .join("\n\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("تم تصدير المحادثة");
  };

  const modelOptions: Record<string, string[]> = {
    deepseek: ["deepseek-chat", "deepseek-reasoner"],
    openai: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
    gemini: ["gemini-2.5-flash", "gemini-1.5-pro"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              محادثة AI متقدمة
            </h1>
            <p className="text-muted-foreground mt-1">
              تحدث مع نماذج الذكاء الاصطناعي المتقدمة
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings2 className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleExport}>
              <Download className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleClear}>
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {showSettings && (
          <Card className="p-6 mb-6 space-y-4">
            <h3 className="font-semibold text-lg">الإعدادات المتقدمة</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>المزود (Provider)</Label>
                <Select value={provider} onValueChange={(v: any) => setProvider(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek">DeepSeek</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>النموذج (Model)</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions[provider].map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>System Prompt</Label>
              <Textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="min-h-[80px]"
                placeholder="تعليمات النظام للمساعد..."
              />
            </div>

            <div className="space-y-2">
              <Label>Temperature: {temperature}</Label>
              <Slider
                value={[temperature]}
                onValueChange={(v) => setTemperature(v[0])}
                min={0}
                max={2}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Tokens: {maxTokens}</Label>
              <Slider
                value={[maxTokens]}
                onValueChange={(v) => setMaxTokens(v[0])}
                min={256}
                max={8192}
                step={256}
              />
            </div>
          </Card>
        )}

        <Card className="flex flex-col h-[calc(100vh-280px)]">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>ابدأ محادثة جديدة مع المساعد الذكي</p>
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4">
                  <Spinner className="h-5 w-5" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="اكتب رسالتك هنا... (Enter للإرسال)"
                className="min-h-[60px] resize-none"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
