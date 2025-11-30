import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCode, MessageSquare, GraduationCap, TrendingUp, FileText, ClipboardCheck } from "lucide-react";

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  usageType: "social" | "code" | "education" | "crypto" | "article" | "exam";
  basePrompt: string;
  options: {
    humanTone: boolean;
    examples: boolean;
    keyPoints: boolean;
    complexity: "بسيط" | "متوسط" | "متقدم";
    engaging: boolean;
  };
}

const templates: Template[] = [
  {
    id: "crypto-tweet",
    title: "تغريدات كريبتو احترافية",
    description: "قالب لكتابة تغريدات تحليلية عن العملات الرقمية والأسواق",
    icon: <TrendingUp className="w-6 h-6" />,
    usageType: "crypto",
    basePrompt: "اكتب تغريدة تحليلية عن حركة البيتكوين في السوق مع توقعات قصيرة المدى",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متوسط",
      engaging: true,
    },
  },
  {
    id: "student-explanation",
    title: "شرح دروس للطلاب",
    description: "قالب لشرح المفاهيم التعليمية بطريقة مبسطة وواضحة",
    icon: <GraduationCap className="w-6 h-6" />,
    usageType: "education",
    basePrompt: "اشرح مفهوم الجاذبية للطلاب في المرحلة المتوسطة بطريقة سهلة ومبسطة",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "بسيط",
      engaging: true,
    },
  },
  {
    id: "code-generator",
    title: "كتابة كود برمجي",
    description: "قالب لطلب كتابة أكواد برمجية موثقة واحترافية",
    icon: <FileCode className="w-6 h-6" />,
    usageType: "code",
    basePrompt: "اكتب دالة بلغة Python لحساب الأعداد الأولية حتى رقم معين مع التوثيق الكامل",
    options: {
      humanTone: false,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: false,
    },
  },
  {
    id: "social-post",
    title: "منشورات سوشيال ميديا",
    description: "قالب لكتابة منشورات جذابة ومؤثرة على وسائل التواصل",
    icon: <MessageSquare className="w-6 h-6" />,
    usageType: "social",
    basePrompt: "اكتب منشور تحفيزي عن أهمية التعلم المستمر وتطوير الذات",
    options: {
      humanTone: true,
      examples: false,
      keyPoints: false,
      complexity: "بسيط",
      engaging: true,
    },
  },
  {
    id: "article-writer",
    title: "مقالات شاملة",
    description: "قالب لكتابة مقالات طويلة ومفصلة بأسلوب احترافي",
    icon: <FileText className="w-6 h-6" />,
    usageType: "article",
    basePrompt: "اكتب مقال شامل عن تأثير الذكاء الاصطناعي على سوق العمل في المستقبل",
    options: {
      humanTone: true,
      examples: true,
      keyPoints: true,
      complexity: "متقدم",
      engaging: false,
    },
  },
  {
    id: "exam-questions",
    title: "أسئلة امتحانات",
    description: "قالب لإعداد أسئلة امتحانات ومراجعات تعليمية",
    icon: <ClipboardCheck className="w-6 h-6" />,
    usageType: "exam",
    basePrompt: "أعد 10 أسئلة اختيار من متعدد عن الثورة الصناعية للمرحلة الثانوية",
    options: {
      humanTone: false,
      examples: true,
      keyPoints: true,
      complexity: "متوسط",
      engaging: false,
    },
  },
];

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  return (
    <section id="templates" className="py-16 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold neon-text">
            مكتبة القوالب الجاهزة
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            اختر من مجموعة متنوعة من القوالب الجاهزة لتسريع عملية إنشاء البرومبتات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="p-6 bg-card/50 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10 cursor-pointer group"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/30 transition-colors">
                  {template.icon}
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/30 hover:bg-primary/10 group-hover:border-primary/50"
                >
                  استخدم هذا القالب
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { templates };
export type { Template };
