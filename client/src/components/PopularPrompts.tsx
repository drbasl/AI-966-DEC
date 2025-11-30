import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Heart, Eye, Copy, Star } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface PopularPromptsProps {
  onUsePrompt?: (prompt: string) => void;
}

// البرومتات الشعبية - AI 966
const staticPrompts = [
  {
    id: 1,
    title: "كتابة كود نظيف وموثق",
    description: "برومبت لكتابة أكواد برمجية احترافية مع أفضل الممارسات",
    prompt: "اكتب كود [اللغة البرمجية] لـ [الوظيفة المطلوبة] باتباع أفضل الممارسات. تأكد من: 1) كود نظيف وقابل للقراءة 2) تعليقات توضيحية لكل دالة ومقطع معقد 3) معالجة الأخطاء المحتملة 4) اختبارات وحدة (Unit Tests) 5) أمثلة استخدام واضحة 6) توثيق كامل للمعاملات والمخرجات. اتبع معايير [PEP 8 / Clean Code / etc.] واشرح القرارات التصميمية المهمة.",
    category: "برمجة",
    rating: 49,
    usageCount: 2400,
    likesCount: 600,
  },
  {
    id: 2,
    title: "شرح مفاهيم البرمجة للمبتدئين",
    description: "قالب تعليمي مثالي لشرح المفاهيم البرمجية بطريقة مبسطة",
    prompt: "اشرح مفهوم [المفهوم البرمجي] للمبتدئين بطريقة مبسطة وواضحة. اتبع هذا الهيكل: 1) تعريف بسيط بلغة يومية 2) تشبيه من الحياة الواقعية 3) مثال برمجي بسيط مع شرح كل سطر 4) الأخطاء الشائعة وكيفية تجنبها 5) تمرين عملي للتطبيق. استخدم أمثلة عملية ومرئية قدر الإمكان.",
    category: "تعليم",
    rating: 47,
    usageCount: 2100,
    likesCount: 520,
  },
  {
    id: 3,
    title: "كتابة محتوى سوشيال ميديا جذاب",
    description: "برومبت احترافي لإنشاء منشورات تفاعلية ومؤثرة",
    prompt: "اكتب منشور سوشيال ميديا احترافي عن [الموضوع] يحقق أقصى تفاعل. اتبع هذه المعايير: 1) افتتاحية قوية تجذب الانتباه في أول 3 ثوان 2) محتوى قيّم يحل مشكلة أو يقدم فائدة واضحة 3) أسلوب محادثة طبيعي وودي 4) دعوة واضحة للتفاعل (Call to Action) 5) هاشتاقات مدروسة (3-5 فقط) 6) إيموجي مناسب بدون مبالغة. الطول المثالي: 150-250 كلمة.",
    category: "تسويق",
    rating: 46,
    usageCount: 1800,
    likesCount: 450,
  },
  {
    id: 4,
    title: "مراجعة شاملة للامتحانات",
    description: "قالب متقدم لإعداد أسئلة امتحانات متنوعة ومتدرجة",
    prompt: "أعد مراجعة شاملة لموضوع [الموضوع] للمرحلة [التعليمية]. قدم: 1) ملخص للنقاط الرئيسية (5-7 نقاط) 2) 10 أسئلة اختيار من متعدد (متدرجة الصعوبة) 3) 5 أسئلة مقالية قصيرة 4) سؤالين تحليليين متقدمين 5) الإجابات النموذجية مع شرح مختصر 6) نصائح للمذاكرة الفعالة. رتب الأسئلة من الأسهل للأصعب.",
    category: "تعليم",
    rating: 45,
    usageCount: 1600,
    likesCount: 410,
  },
  {
    id: 5,
    title: "كتابة سيرة ذاتية احترافية",
    description: "برومبت متكامل لإنشاء CV يلفت انتباه مسؤولي التوظيف",
    prompt: "اكتب سيرة ذاتية احترافية لشخص يعمل في مجال [المجال] ولديه خبرة [عدد السنوات] سنوات. اتبع هذا الهيكل: 1) ملخص مهني قوي (3-4 أسطر) يبرز القيمة المضافة 2) المهارات الأساسية (تقنية وشخصية) 3) الخبرات العملية بصيغة الإنجازات (استخدم أرقام ونسب) 4) التعليم والشهادات 5) المشاريع البارزة 6) كلمات مفتاحية ATS للوظيفة المستهدفة.",
    category: "مهني",
    rating: 48,
    usageCount: 3200,
    likesCount: 890,
  },
  {
    id: 6,
    title: "خطة تسويقية رقمية شاملة",
    description: "برومبت استراتيجي لبناء خطة تسويق متكاملة",
    prompt: "أنشئ خطة تسويق رقمية شاملة لـ [المنتج/الخدمة] تستهدف [الجمهور المستهدف]. قدم: 1) تحليل SWOT سريع 2) تحديد الأهداف SMART 3) استراتيجية المحتوى (أنواع + تقويم نشر) 4) القنوات الرقمية المناسبة وميزانية كل قناة 5) استراتيجية الإعلانات المدفوعة 6) مؤشرات الأداء KPIs 7) خطة التنفيذ الشهرية.",
    category: "تسويق",
    rating: 47,
    usageCount: 2800,
    likesCount: 720,
  },
  {
    id: 7,
    title: "خطة عمل مشروع ناشئ",
    description: "برومبت متكامل لبناء Business Plan احترافي",
    prompt: "أنشئ خطة عمل شاملة لمشروع [اسم/فكرة المشروع] في قطاع [القطاع]. اشمل: 1) الملخص التنفيذي 2) وصف المشروع والقيمة المقدمة 3) تحليل السوق والجمهور المستهدف 4) تحليل المنافسة 5) نموذج العمل ومصادر الإيرادات 6) خطة التسويق والمبيعات 7) التوقعات المالية (3 سنوات) 8) المخاطر وخطط التخفيف.",
    category: "ريادة أعمال",
    rating: 49,
    usageCount: 3500,
    likesCount: 920,
  },
  {
    id: 8,
    title: "مقابلة عمل تحضيرية",
    description: "برومبت للاستعداد الكامل لمقابلات العمل",
    prompt: "جهزني لمقابلة عمل لوظيفة [المسمى الوظيفي] في شركة [نوع/اسم الشركة]. قدم: 1) أسئلة المقابلة المتوقعة (15-20 سؤال) مع إجابات نموذجية 2) أسئلة سلوكية STAR مع أمثلة 3) أسئلة تقنية للمجال 4) أسئلة ذكية لطرحها على المحاور 5) نقاط قوة يجب إبرازها 6) كيفية التعامل مع الأسئلة الصعبة.",
    category: "مهني",
    rating: 48,
    usageCount: 3100,
    likesCount: 850,
  },
  {
    id: 9,
    title: "تصميم تجربة مستخدم UX",
    description: "برومبت متخصص في تحسين واجهات المستخدم",
    prompt: "صمم تجربة مستخدم محسنة لـ [التطبيق/الموقع] الذي يهدف لـ [الهدف الرئيسي]. قدم: 1) تحليل رحلة المستخدم (User Journey) 2) نقاط الألم الحالية والحلول المقترحة 3) هيكل المعلومات Information Architecture 4) wireframes وصفية للشاشات الرئيسية 5) مبادئ التصميم المتبعة 6) معايير الوصولية Accessibility.",
    category: "تصميم",
    rating: 46,
    usageCount: 1900,
    likesCount: 510,
  },
  {
    id: 10,
    title: "كتابة بريد إلكتروني مقنع",
    description: "برومبت لصياغة رسائل بريد تحقق نتائج",
    prompt: "اكتب بريد إلكتروني [نوع البريد: مبيعات/متابعة/تقديم/اعتذار] لـ [الجهة المستهدفة] بخصوص [الموضوع]. اتبع: 1) سطر موضوع جذاب (أقل من 50 حرف) 2) افتتاحية شخصية ومباشرة 3) القيمة المقدمة في أول فقرة 4) محتوى مختصر ومنظم (3 فقرات كحد أقصى) 5) دعوة واضحة للإجراء CTA 6) توقيع احترافي.",
    category: "أعمال",
    rating: 45,
    usageCount: 2500,
    likesCount: 640,
  },
  {
    id: 11,
    title: "إنشاء دورة تدريبية",
    description: "برومبت لتصميم محتوى تعليمي منظم ومتكامل",
    prompt: "صمم دورة تدريبية شاملة عن [الموضوع] للمستوى [مبتدئ/متوسط/متقدم] بمدة [عدد الساعات]. قدم: 1) أهداف التعلم الواضحة 2) المتطلبات المسبقة 3) هيكل الدورة (وحدات ودروس) 4) محتوى كل درس مع النقاط الرئيسية 5) تمارين وأنشطة تفاعلية 6) مشاريع تطبيقية 7) اختبارات تقييمية.",
    category: "تعليم",
    rating: 48,
    usageCount: 2700,
    likesCount: 750,
  },
  {
    id: 12,
    title: "كتابة سكريبت فيديو يوتيوب",
    description: "برومبت لإنتاج محتوى فيديو احترافي وجذاب",
    prompt: "اكتب سكريبت فيديو يوتيوب عن [الموضوع] بطول [المدة] دقائق لقناة [نوع القناة]. اشمل: 1) Hook قوي في أول 5 ثوان 2) مقدمة تعريفية سريعة 3) إعلان عن محتوى الفيديو (ماذا سيتعلم المشاهد) 4) المحتوى الرئيسي مقسم لأجزاء واضحة 5) CTA للاشتراك في منتصف الفيديو 6) ملخص وخاتمة.",
    category: "محتوى",
    rating: 46,
    usageCount: 2400,
    likesCount: 670,
  },
];

export default function PopularPrompts({ onUsePrompt }: PopularPromptsProps) {
  const [likedPrompts, setLikedPrompts] = useState<number[]>([]);

  const handleCopy = async (prompt: string) => {
    await navigator.clipboard.writeText(prompt);
    toast.success("تم نسخ البرومبت!");
  };

  const handleUse = (id: number, prompt: string) => {
    if (onUsePrompt) {
      onUsePrompt(prompt);
      // Scroll to generator
      const generator = document.getElementById("generator");
      generator?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLike = (id: number) => {
    if (!likedPrompts.includes(id)) {
      setLikedPrompts([...likedPrompts, id]);
      toast.success("شكراً لإعجابك!");
    }
  };

  const prompts = staticPrompts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {prompts.map((prompt) => (
        <Card
          key={prompt.id}
          className="p-6 bg-card/50 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg group"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                  {prompt.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {prompt.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{(prompt.rating / 10).toFixed(1)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{prompt.usageCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                <span>{prompt.likesCount.toLocaleString()}</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                {prompt.category}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {prompt.prompt}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => handleUse(prompt.id, prompt.prompt)}
              >
                <TrendingUp className="ml-2 w-4 h-4" />
                استخدم الآن
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(prompt.prompt)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLike(prompt.id)}
                disabled={likedPrompts.includes(prompt.id)}
                className={likedPrompts.includes(prompt.id) ? "text-red-500" : ""}
              >
                <Heart className={`w-4 h-4 ${likedPrompts.includes(prompt.id) ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
