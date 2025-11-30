import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Stethoscope, 
  Landmark, 
  GraduationCap, 
  Gamepad2, 
  Briefcase, 
  Palette, 
  Smartphone, 
  ShoppingCart 
} from "lucide-react";

interface TemplateItem {
  title: string;
  basePrompt: string;
  usageType: "social" | "code" | "education" | "crypto" | "article" | "exam";
}

interface Field {
  id: string;
  name: string;
  icon: React.ReactNode;
  templates: TemplateItem[];
}

const fields: Field[] = [
  {
    id: "medical",
    name: "طبي",
    icon: <Stethoscope className="w-8 h-8" />,
    templates: [
      {
        title: "نصائح صحية",
        basePrompt: "قدم نصائح صحية عملية عن [الموضوع] مع الأدلة",
        usageType: "education"
      },
      {
        title: "شرح طبي مبسط",
        basePrompt: "اشرح [المرض/الحالة] بطريقة مبسطة للمرضى",
        usageType: "education"
      },
      {
        title: "برنامج غذائي",
        basePrompt: "صمم برنامج غذائي صحي لـ [الهدف] مع السعرات",
        usageType: "article"
      }
    ]
  },
  {
    id: "finance",
    name: "مالي",
    icon: <Landmark className="w-8 h-8" />,
    templates: [
      {
        title: "تحليل مالي شامل",
        basePrompt: "قم بتحليل مالي شامل لـ [الشركة/المشروع] مع التوصيات",
        usageType: "article"
      },
      {
        title: "نصائح استثمارية",
        basePrompt: "قدم نصائح استثمارية عملية في [المجال] للمبتدئين",
        usageType: "education"
      },
      {
        title: "دراسة جدوى",
        basePrompt: "أنشئ دراسة جدوى تفصيلية لـ [المشروع] مع الأرقام",
        usageType: "article"
      }
    ]
  },
  {
    id: "education",
    name: "تعليمي",
    icon: <GraduationCap className="w-8 h-8" />,
    templates: [
      {
        title: "شرح درس تفاعلي",
        basePrompt: "اشرح [الموضوع] بطريقة بسيطة مع أمثلة عملية للطلاب",
        usageType: "education"
      },
      {
        title: "أسئلة امتحان",
        basePrompt: "أنشئ 10 أسئلة امتحان متنوعة عن [المادة] مع الإجابات",
        usageType: "exam"
      },
      {
        title: "ملخص دراسي",
        basePrompt: "لخص [الفصل/الوحدة] في نقاط رئيسية سهلة الحفظ",
        usageType: "education"
      }
    ]
  },
  {
    id: "gaming",
    name: "ألعاب",
    icon: <Gamepad2 className="w-8 h-8" />,
    templates: [
      {
        title: "استراتيجية لعبة",
        basePrompt: "اكتب استراتيجية متقدمة للفوز في [اسم اللعبة]",
        usageType: "article"
      },
      {
        title: "مراجعة لعبة",
        basePrompt: "اكتب مراجعة شاملة للعبة [الاسم] مع التقييم",
        usageType: "article"
      },
      {
        title: "نصائح للاعبين",
        basePrompt: "قدم 10 نصائح احترافية للاعبين الجدد في [اللعبة]",
        usageType: "social"
      }
    ]
  },
  {
    id: "business",
    name: "أعمال",
    icon: <Briefcase className="w-8 h-8" />,
    templates: [
      {
        title: "خطة عمل",
        basePrompt: "أنشئ خطة عمل تفصيلية لمشروع [الوصف]",
        usageType: "article"
      },
      {
        title: "استراتيجية تسويق",
        basePrompt: "صمم استراتيجية تسويق رقمي لـ [المنتج/الخدمة]",
        usageType: "article"
      },
      {
        title: "تحليل منافسين",
        basePrompt: "قم بتحليل المنافسين في مجال [الصناعة]",
        usageType: "article"
      }
    ]
  },
  {
    id: "creative",
    name: "إبداعي",
    icon: <Palette className="w-8 h-8" />,
    templates: [
      {
        title: "قصة قصيرة",
        basePrompt: "اكتب قصة قصيرة مشوقة عن [الموضوع]",
        usageType: "article"
      },
      {
        title: "أفكار محتوى",
        basePrompt: "اقترح 20 فكرة محتوى إبداعي لـ [المنصة/المجال]",
        usageType: "social"
      },
      {
        title: "سيناريو فيديو",
        basePrompt: "اكتب سيناريو فيديو جذاب عن [الموضوع] مدته 3 دقائق",
        usageType: "article"
      }
    ]
  },
  {
    id: "tech",
    name: "تقني",
    icon: <Smartphone className="w-8 h-8" />,
    templates: [
      {
        title: "كود برمجي",
        basePrompt: "اكتب كود [اللغة] لـ [الوظيفة] مع التعليقات",
        usageType: "code"
      },
      {
        title: "شرح تقني",
        basePrompt: "اشرح [التقنية/المفهوم] بطريقة بسيطة للمبتدئين",
        usageType: "education"
      },
      {
        title: "حل مشكلة تقنية",
        basePrompt: "قدم حلول تفصيلية لمشكلة [الوصف]",
        usageType: "article"
      }
    ]
  },
  {
    id: "ecommerce",
    name: "تجارة",
    icon: <ShoppingCart className="w-8 h-8" />,
    templates: [
      {
        title: "وصف منتج",
        basePrompt: "اكتب وصف تسويقي جذاب لمنتج [الاسم]",
        usageType: "social"
      },
      {
        title: "إعلان ترويجي",
        basePrompt: "صمم إعلان ترويجي مقنع لـ [المنتج/الخدمة]",
        usageType: "social"
      },
      {
        title: "استراتيجية مبيعات",
        basePrompt: "ضع استراتيجية مبيعات فعالة لـ [المتجر/المنتج]",
        usageType: "article"
      }
    ]
  }
];

interface SpecializedTemplatesProps {
  onSelectTemplate: (template: TemplateItem) => void;
}

export default function SpecializedTemplates({ onSelectTemplate }: SpecializedTemplatesProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const handleFieldClick = (fieldId: string) => {
    setSelectedField(selectedField === fieldId ? null : fieldId);
  };

  const selectedFieldData = fields.find(f => f.id === selectedField);

  return (
    <div className="space-y-8">
      {/* Field Selection */}
      <div>
        <h3 className="text-xl font-bold mb-6 text-center">
          🏭 اختر مجالك التخصصي
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {fields.map((field) => (
            <Card
              key={field.id}
              className={`p-6 cursor-pointer transition-all hover:scale-105 border-2 ${
                selectedField === field.id
                  ? "border-primary bg-primary/10 neon-glow"
                  : "border-primary/20 hover:border-primary/50"
              }`}
              onClick={() => handleFieldClick(field.id)}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className={`${selectedField === field.id ? "text-primary" : "text-muted-foreground"}`}>
                  {field.icon}
                </div>
                <span className="font-semibold text-sm">{field.name}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Templates Display */}
      {selectedFieldData && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h4 className="text-lg font-bold mb-4 text-center">
            قوالب {selectedFieldData.name}
          </h4>
          <div className="grid md:grid-cols-3 gap-4">
            {selectedFieldData.templates.map((template, index) => (
              <Card
                key={index}
                className="p-5 border-primary/30 hover:border-primary/60 transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="space-y-3">
                  <h5 className="font-semibold text-base">{template.title}</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {template.basePrompt}
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => onSelectTemplate(template)}
                  >
                    استخدم هذا القالب
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
