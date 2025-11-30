import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Copy, RefreshCw, Loader2, Save, Share2, FileText, Code, Palette, TrendingUp, BookOpen, MessageSquare, Download, FileDown } from "lucide-react";
import { Twitter, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useEffect } from "react";

interface PromptGeneratorProps {
  initialPrompt?: string;
  initialUsageType?: "social" | "code" | "education" | "crypto" | "article" | "exam";
  initialOptions?: {
    humanTone: boolean;
    examples: boolean;
    keyPoints: boolean;
    complexity: "بسيط" | "متوسط" | "متقدم";
    engaging: boolean;
  };
}

export default function PromptGenerator({ 
  initialPrompt, 
  initialUsageType, 
  initialOptions 
}: PromptGeneratorProps = {}) {
  const [basePrompt, setBasePrompt] = useState(initialPrompt || "");
  const [usageType, setUsageType] = useState<"social" | "code" | "education" | "crypto" | "article" | "exam">(initialUsageType || "social");
  const [options, setOptions] = useState(initialOptions || {
    humanTone: false,
    examples: false,
    keyPoints: false,
    complexity: "متوسط" as "بسيط" | "متوسط" | "متقدم",
    engaging: false,
  });
  const [isAnimating, setIsAnimating] = useState(false);

  // Update state when props change
  useEffect(() => {
    if (initialPrompt) setBasePrompt(initialPrompt);
    if (initialUsageType) setUsageType(initialUsageType);
    if (initialOptions) setOptions(initialOptions);
  }, [initialPrompt, initialUsageType, initialOptions]);

  const generateMutation = trpc.prompt.generate.useMutation({
    onSuccess: (data) => {
      toast.success("تم توليد البرومبت بنجاح!");
    },
    onError: (error) => {
      toast.error("حدث خطأ في توليد البرومبت");
      console.error(error);
    },
  });

  const handleGenerate = () => {
    if (!basePrompt.trim()) {
      toast.error("الرجاء كتابة البرومبت الأساسي");
      return;
    }
    if (!usageType) {
      toast.error("الرجاء اختيار نوع الاستخدام");
      return;
    }

    if (usageType) {
      generateMutation.mutate({
        basePrompt,
        usageType,
        options,
      });
    }
  };

  const handleCopy = async () => {
    if (generateMutation.data?.enhancedPrompt) {
      await navigator.clipboard.writeText(generateMutation.data.enhancedPrompt);
      toast.success("تم نسخ البرومبت!");
    }
  };

  const handleRegenerate = () => {
    if (basePrompt && usageType) {
      generateMutation.mutate({
        basePrompt,
        usageType,
        options,
      });
    }
  };

  const savePromptMutation = trpc.savedPrompts.create.useMutation({
    onSuccess: () => {
      toast.success("تم حفظ البرومبت في مكتبتك الشخصية!");
    },
    onError: (error) => {
      if (error.message.includes("UNAUTHORIZED")) {
        toast.error("يجب تسجيل الدخول لحفظ البرومبتات");
      } else {
        toast.error("حدث خطأ في حفظ البرومبت");
      }
    },
  });

  const handleSave = () => {
    if (generateMutation.data?.enhancedPrompt) {
      const title = basePrompt.slice(0, 50) + (basePrompt.length > 50 ? "..." : "");
      savePromptMutation.mutate({
        title,
        basePrompt,
        enhancedPrompt: generateMutation.data.enhancedPrompt,
        usageType,
      });
    }
  };

  const handleExportText = () => {
    if (generateMutation.data?.enhancedPrompt) {
      const content = `البرومبت الأساسي:\n${basePrompt}\n\n${"─".repeat(50)}\n\nالبرومبت المحسّن:\n${generateMutation.data.enhancedPrompt}`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "prompt.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("تم تصدير البرومبت كملف نصي!");
    }
  };

  const handleExportWord = () => {
    if (generateMutation.data?.enhancedPrompt) {
      const content = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><title>برومبت</title></head>
        <body dir="rtl" style="font-family: Arial, sans-serif;">
          <h2 style="color: #0ea5e9;">البرومبت الأساسي</h2>
          <p>${basePrompt}</p>
          <hr/>
          <h2 style="color: #0ea5e9;">البرومبت المحسّن</h2>
          <p style="white-space: pre-wrap;">${generateMutation.data.enhancedPrompt}</p>
          <hr/>
          <p style="color: #888; font-size: 12px;">تم التوليد بواسطة رقيم AI 966</p>
        </body>
        </html>
      `;
      const blob = new Blob([content], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "prompt.doc";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("تم تصدير البرومبت كملف Word!");
    }
  };

  return (
    <Card className="p-6 md:p-8 neon-glow bg-card border-primary/30">
      <div className="space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold neon-text">
            ⚡ من فكرة بسيطة إلى برومبت احترافي
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            أخبرنا بما تريد، ودعنا نصنع لك البرومبت المثالي<br />
            اختر نوع المهمة، أضف تفاصيلك، واحصل على نتيجة احترافية خلال ثوانٍ ⚡
          </p>
        </div>

        {/* Quick Examples */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>جرّب الأمثلة السريعة:</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {/* مقال تقني */}
            <button
              onClick={() => {
                setIsAnimating(true);
                setBasePrompt("اكتب مقالاً شاملاً عن الذكاء الاصطناعي في التعليم");
                setUsageType("article");
                toast.success("تم تعبئة المثال! ⚡");
                setTimeout(() => setIsAnimating(false), 400);
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <FileText className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="text-sm font-semibold">📝 مقال تقني</div>
                <div className="text-xs text-muted-foreground">كتابة محتوى</div>
              </div>
            </button>

            {/* كود برمجي */}
            <button
              onClick={() => {
                setBasePrompt("اكتب دالة Python لحساب الأعداد الأولية");
                setUsageType("code");
                toast.success("تم تعبئة المثال! ⚡");
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <Code className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="text-sm font-semibold">💻 كود برمجي</div>
                <div className="text-xs text-muted-foreground">برمجة</div>
              </div>
            </button>

            {/* تصميم شعار */}
            <button
              onClick={() => {
                setBasePrompt("اقترح 5 أفكار لشعار شركة تقنية");
                setUsageType("article");
                toast.success("تم تعبئة المثال! ⚡");
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <Palette className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="text-sm font-semibold">🎨 تصميم شعار</div>
                <div className="text-xs text-muted-foreground">تصميم</div>
              </div>
            </button>

            {/* تسويق */}
            <button
              onClick={() => {
                setBasePrompt("اكتب حملة تسويقية لمنتج تقني جديد");
                setUsageType("social");
                toast.success("تم تعبئة المثال! ⚡");
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <TrendingUp className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="text-sm font-semibold">📈 تسويق</div>
                <div className="text-xs text-muted-foreground">إعلانات</div>
              </div>
            </button>

            {/* تعليم */}
            <button
              onClick={() => {
                setBasePrompt("اشرح مفهوم البلوكتشين بطريقة مبسطة");
                setUsageType("education");
                toast.success("تم تعبئة المثال! ⚡");
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <BookOpen className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="text-sm font-semibold">📚 تعليم</div>
                <div className="text-xs text-muted-foreground">شرح مبسط</div>
              </div>
            </button>

            {/* سوشيال ميديا */}
            <button
              onClick={() => {
                setBasePrompt("اكتب 10 تغريدات جذابة عن الذكاء الاصطناعي");
                setUsageType("social");
                toast.success("تم تعبئة المثال! ⚡");
              }}
              className="flex items-center gap-2 p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all group"
            >
              <MessageSquare className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-right">
                <div className="text-sm font-semibold">📱 سوشيال ميديا</div>
                <div className="text-xs text-muted-foreground">تغريدات</div>
              </div>
            </button>
          </div>
        </div>

        {/* Base Prompt Input */}
        <div className="space-y-2">
          <Label htmlFor="base-prompt" className="text-base font-semibold">
            البرومبت الأساسي
          </Label>
          <Textarea
            id="base-prompt"
            placeholder="اكتب طلبك هنا... مثال: اكتب لي مقال عن الذكاء الاصطناعي"
            value={basePrompt}
            onChange={(e) => setBasePrompt(e.target.value)}
            className={`min-h-[120px] text-base resize-none bg-input border-primary/20 focus:border-primary/50 ${isAnimating ? 'animate-fill-pulse' : ''}`}
          />
        </div>

        {/* Usage Type */}
        <div className="space-y-2">
          <Label htmlFor="usage-type" className="text-base font-semibold">
            نوع الاستخدام
          </Label>
          <Select value={usageType} onValueChange={(value) => setUsageType(value as typeof usageType)}>
            <SelectTrigger id="usage-type" className="bg-input border-primary/20">
              <SelectValue placeholder="اختر نوع الاستخدام" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="social">تغريدات / سوشيال ميديا</SelectItem>
              <SelectItem value="code">كود وبرمجة</SelectItem>
              <SelectItem value="education">تعليم ومذاكرة</SelectItem>
              <SelectItem value="crypto">كريبتو وتداول</SelectItem>
              <SelectItem value="article">كتابة مقالات / محتوى طويل</SelectItem>
              <SelectItem value="exam">أسئلة امتحانات / مراجعة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">خيارات إضافية</Label>
          
          <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-primary/10">
            <div className="flex items-center gap-3">
              <Checkbox
                id="human-tone"
                checked={options.humanTone}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, humanTone: checked as boolean })
                }
              />
              <Label htmlFor="human-tone" className="cursor-pointer font-normal">
                لهجة بشرية طبيعية
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="examples"
                checked={options.examples}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, examples: checked as boolean })
                }
              />
              <Label htmlFor="examples" className="cursor-pointer font-normal">
                أمثلة عملية
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="key-points"
                checked={options.keyPoints}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, keyPoints: checked as boolean })
                }
              />
              <Label htmlFor="key-points" className="cursor-pointer font-normal">
                نقاط رئيسية + ملخص
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="engaging"
                checked={options.engaging}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, engaging: checked as boolean })
                }
              />
              <Label htmlFor="engaging" className="cursor-pointer font-normal">
                أسلوب جدلي أو محفّز للتفاعل
              </Label>
            </div>

            {/* Complexity Level */}
            <div className="pt-2 space-y-2">
              <Label className="text-sm font-semibold">درجة التعقيد</Label>
              <div className="flex gap-2">
                {(["بسيط", "متوسط", "متقدم"] as const).map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={options.complexity === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOptions({ ...options, complexity: level })}
                    className="flex-1"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          size="lg"
          className="w-full text-lg py-6 neon-glow hover:shadow-lg hover:shadow-primary/50 transition-all"
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="ml-2 w-5 h-5 animate-spin" />
              جاري التوليد...
            </>
          ) : (
            <>
              <Sparkles className="ml-2 w-5 h-5" />
              توليد البرومبت المحسَّن الآن
            </>
          )}
        </Button>

        {/* Result Box */}
        {generateMutation.data && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Label className="text-base font-semibold">البرومبت النهائي المقترح</Label>
            <div className="relative">
              <div className="bg-muted/50 p-4 rounded-lg border border-primary/30 min-h-[150px] max-h-[400px] overflow-y-auto">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {generateMutation.data.enhancedPrompt}
                </p>
              </div>
              
              <div className="space-y-2 mt-3">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-primary/30 hover:bg-primary/10"
                    onClick={handleCopy}
                  >
                    <Copy className="ml-2 w-4 h-4" />
                    نسخ
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 border-primary/30 hover:bg-primary/10"
                    onClick={handleSave}
                    disabled={savePromptMutation.isPending}
                  >
                    <Save className="ml-2 w-4 h-4" />
                    حفظ
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 border-primary/30 hover:bg-primary/10"
                    onClick={handleRegenerate}
                    disabled={generateMutation.isPending}
                  >
                    <RefreshCw className="ml-2 w-4 h-4" />
                    إعادة
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 border-primary/30 hover:bg-primary/10"
                      >
                        <Download className="ml-2 w-4 h-4" />
                        تصدير
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleExportWord}>
                        <FileText className="ml-2 w-4 h-4" />
                        تصدير Word
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportText}>
                        <FileDown className="ml-2 w-4 h-4" />
                        تصدير نص عادي
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Social Share Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-primary/30 hover:bg-primary/10"
                    onClick={() => {
                      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
                      const text = `🔥 اكتشف رقيم AI 966 - مولّد البرومبتات الذكي!\n\nحسّن برومبتاتك واحصل على نتائج أفضل من الذكاء الاصطناعي\n\n${siteUrl}\n\n#رقيم_AI #AI #البرومبتات #السعودية`;
                      navigator.clipboard.writeText(text);
                      toast.success("تم نسخ النص للمشاركة على تويتر");
                    }}
                  >
                    <Twitter className="ml-2 w-4 h-4" />
                    تويتر
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-primary/30 hover:bg-primary/10"
                    onClick={() => {
                      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
                      const text = `🔥 اكتشف رقيم AI 966 - مولّد البرومبتات الذكي!\n\nحسّن برومبتاتك واحصل على نتائج أفضل من الذكاء الاصطناعي\n\n${siteUrl}`;
                      window.open(`https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(text)}`, '_blank');
                    }}
                  >
                    <Send className="ml-2 w-4 h-4" />
                    تيليجرام
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-primary/30 hover:bg-primary/10"
                    onClick={() => {
                      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
                      const text = `🔥 اكتشف رقيم AI 966 - مولّد البرومبتات الذكي!\n\nحسّن برومبتاتك واحصل على نتائج أفضل من الذكاء الاصطناعي\n\n${siteUrl}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                    }}
                  >
                    <Share2 className="ml-2 w-4 h-4" />
                    واتساب
                  </Button>
                </div>

                {/* Share Website Button */}
                <Button
                  variant="default"
                  className="w-full"
                  onClick={async () => {
                    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
                    const shareData = {
                      title: "رقيم AI 966 - مولّد البرومبتات الذكي",
                      text: "🔥 اكتشف رقيم AI 966 - حسّن برومبتاتك واحصل على نتائج أفضل من الذكاء الاصطناعي!",
                      url: siteUrl,
                    };

                    // Try Web Share API first (mobile-friendly)
                    if (navigator.share) {
                      try {
                        await navigator.share(shareData);
                        toast.success("تمت المشاركة بنجاح!");
                      } catch (err) {
                        // User cancelled or error
                        if ((err as Error).name !== 'AbortError') {
                          navigator.clipboard.writeText(siteUrl);
                          toast.success(`تم نسخ الرابط: ${siteUrl}`);
                        }
                      }
                    } else {
                      // Fallback: copy URL
                      await navigator.clipboard.writeText(siteUrl);
                      toast.success(`تم نسخ الرابط: ${siteUrl}`);
                    }
                  }}
                >
                  <Share2 className="ml-2 w-4 h-4" />
                  مشاركة الموقع
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
