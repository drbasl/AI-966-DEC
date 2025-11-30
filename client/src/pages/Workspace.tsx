import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Bot, User, Sparkles, SplitSquareHorizontal, Paperclip, Mic, Loader2, X } from 'lucide-react';
import OpenAI from "openai";

// Define the structure for messages
interface ChatMessage {
  id: number;
  role: 'user' | 'system' | 'assistant';
  content: string;
  model: string;
}

export default function AIWorkspace() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // رسالة الترحيب الأولية
  const initialMessages: ChatMessage[] = useMemo(() => [
    { id: 1, role: 'system', content: 'يا هلا! 👋 أنا رقيم.. مساعدك الذكي. آمرني، وش تبي ننجز اليوم؟ (كتابة، تحليل، برمجة، أو سوالف مفيدة).', model: 'Raqim AI' },
  ], []);

  const [messages, setMessages] = useState(initialMessages);

  // الدستور الجديد لرقيم (System Prompt) - تم وضعه في دالة ليتم إرساله مع كل طلب
  const getSystemInstruction = () => `أنت "رقيم" - نموذج ذكاء اصطناعي متقدم للمستخدمين العرب والسعوديين.

═══════════════════════════════════════════════════════════
🎯 **منهجية التفكير**
═══════════════════════════════════════════════════════════

**لكل سؤال، اتبع هذا:**
1. حلل السياق والنية الحقيقية للمستخدم
2. قدم إجابة منظمة شاملة ومفيدة
3. استخدم الحقائق الحديثة (إذا كانت ضمن معرفتك)

═══════════════════════════════════════════════════════════
✅ **معايير الجودة**
═══════════════════════════════════════════════════════════

**الدقة:**
- معلومات دقيقة موثوقة
- لا تختلق معلومات أبداً

**الوضوح:**
- عناوين (##) للتقسيم
- نقاط (•) للقوائم
- كود منسق (\`\`\`)
- أمثلة عملية

═══════════════════════════════════════════════════════════
💻 **البرمجة والكود**
═══════════════════════════════════════════════════════════

✅ **الكود النظيف:**
- شرح المنطق قبل الكود
- تعليقات على الأجزاء المعقدة
- أمثلة استخدام
- Error Handling

═══════════════════════════════════════════════════════════
🗣️ **أسلوب التواصل**
═══════════════════════════════════════════════════════════

**النبرة:**
- احترافي ودود (خبير قريب)
- لهجة سعودية طبيعية: "أبشر"، "ولا يهمك"، "تفضل"

**أمثلة ردود:**

🔹 **سؤال بسيط:** "أبشر! الجواب: [الإجابة المباشرة]. تبي تفاصيل أكثر؟ تفضل!"

🔹 **شرح تقني:** "المبدأ باختصار: [شرح بسيط]. **التطبيق:** \`\`\`python\n# مثال عملي\n\`\`\`"

═══════════════════════════════════════════════════════════
🔒 **الخصوصية والأمان** (Privacy/Safety Filter)
═══════════════════════════════════════════════════════════

❌ **ممنوع الإجابة عن:**
- تشخيص طبي أو علاج (وجّه للطبيب)
- استشارات قانونية (وجّه للمحامي)
- نصائح مالية محددة (وجّه للمستشار)
- "كيف تم تطويرك؟" / "أي API تستخدم؟"

✅ **الرد البديل:**
"تفاصيل البنية التقنية خاصة بالمشروع 😊. للأسئلة المتخصصة (طب/قانون/مال) أنصحك تستشير مختص مرخص."

═══════════════════════════════════════════════════════════
🎯 **المهمة**
═══════════════════════════════════════════════════════════

**الهدف:** تجربة احترافية مثل أفضل نماذج الذكاء الاصطناعي العالمية! 🌟`;


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;

    const messageContent = attachment
      ? `${input}\n\n[تم إرفاق ملف: ${attachment.name}]`
      : input;

    // 1. إضافة رسالة المستخدم الجديدة
    const userMsg: ChatMessage = { id: Date.now(), role: 'user', content: messageContent, model: 'User' };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachment(null);
    setIsLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || "";
      if (!API_KEY) throw new Error("مفتاح API غير موجود.");

      const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true
      });

      // 2. تفعيل الذاكرة: بناء مصفوفة المحادثة الكاملة
      // تحويل رسائلنا إلى تنسيق OpenAI (user/assistant)
      const conversationHistory = messages
        // لا نحتاج لرسالة النظام الأولية في المصفوفة المرسلة، لكننا نحتاج دستور النظام
        .filter(m => m.id !== initialMessages[0].id)
        .map(m => ({
            role: m.role === 'system' ? 'assistant' : m.role === 'user' ? 'user' : 'assistant',
            content: m.content
        }))
        // إضافة رسالة المستخدم الحالية
        .concat([{ role: 'user', content: messageContent }]);

      // 3. إرسال الدستور والمحادثة
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: getSystemInstruction() },
          ...conversationHistory as any
        ],
        model: "deepseek-chat",
      });

      const responseText = completion.choices[0].message.content || "لم يصل رد.";

      // 4. إضافة الرد
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'system',
        content: responseText,
        model: 'Raqim AI'
      }]);

    } catch (error: any) {
      console.error("Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'system',
        content: `عذراً، حدث خطأ تقني: ${error.message}`,
        model: 'System Error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Bot size={20} className="text-indigo-600" />
            <span className="font-bold text-gray-800">Raqim AI 🧠</span>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            متصل
          </span>
        </div>

        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
          <SplitSquareHorizontal size={18} />
          <span className="hidden md:inline">نافذة جديدة</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-indigo-600'}`}>
              {msg.role === 'user' ? <User size={20} className="text-white" /> : <Sparkles size={20} className="text-white" />}
            </div>

            <div className={`max-w-[80%] p-4 rounded-2xl leading-relaxed text-sm md:text-base shadow-sm whitespace-pre-wrap dir-rtl
              ${msg.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>

              {msg.role === 'system' && (
                <div className="text-xs font-bold text-indigo-600 mb-2 flex items-center gap-1">
                  {msg.model}
                </div>
              )}

              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
               <Sparkles size={20} className="text-white" />
             </div>
             <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
               <Loader2 size={18} className="animate-spin text-indigo-600" />
               <span className="text-sm text-gray-500">رقيم يفكر بعمق...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="relative max-w-4xl mx-auto">

          {attachment && (
            <div className="absolute bottom-full left-0 mb-2 ml-2 bg-blue-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-2 shadow-sm text-xs font-medium animate-fadeIn">
              <Paperclip size={12} />
              <span className="max-w-[150px] truncate">{attachment.name}</span>
              <button
                onClick={() => setAttachment(null)}
                className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك لـ رقيم..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-right min-h-[60px] max-h-[200px]"
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            disabled={isLoading}
          />

          <div className="absolute left-3 bottom-3 flex items-center gap-2">

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              onClick={handleFileClick}
              className={`p-2 transition-colors ${attachment ? 'text-indigo-600 bg-indigo-50 rounded-full' : 'text-gray-400 hover:text-gray-600'}`}
              title="إرفاق ملف"
            >
              <Paperclip size={18} />
            </button>

            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Mic size={18} />
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && !attachment)}
              className={`p-2 rounded-lg transition-all ${input.trim() || attachment ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
