import { Card } from "@/components/ui/card";
import { X, Check, ArrowRight } from "lucide-react";

export default function BeforeAfter() {
  const examples = [
    {
      category: "كتابة المحتوى",
      before: {
        text: "اكتب لي مقال عن الذكاء الاصطناعي",
        problems: ["غير محدد", "بدون سياق", "نتيجة عامة"]
      },
      after: {
        text: "أنت كاتب محتوى تقني محترف متخصص في الذكاء الاصطناعي. اكتب مقالاً شاملاً (1500 كلمة) عن تطبيقات الذكاء الاصطناعي في التعليم، مع التركيز على: 1) التعلم الشخصي 2) تقييم الطلاب الآلي 3) المساعدين الافتراضيين. استخدم أسلوباً واضحاً مع أمثلة عملية وإحصائيات حديثة.",
        benefits: ["محدد ودقيق", "سياق واضح", "نتيجة احترافية"]
      }
    },
    {
      category: "البرمجة",
      before: {
        text: "اكتب لي كود بايثون لقراءة ملف",
        problems: ["غامض", "بدون تفاصيل", "كود بسيط"]
      },
      after: {
        text: "أنت مبرمج Python خبير. اكتب كود Python احترافي لقراءة ملف CSV يحتوي على بيانات مبيعات (التاريخ، المنتج، الكمية، السعر)، ثم: 1) تنظيف البيانات من القيم المفقودة 2) حساب إجمالي المبيعات لكل منتج 3) إنشاء رسم بياني باستخدام matplotlib. أضف معالجة للأخطاء وتعليقات توضيحية.",
        benefits: ["تفاصيل كاملة", "متطلبات واضحة", "كود احترافي"]
      }
    },
    {
      category: "التصميم",
      before: {
        text: "صمم لي شعار لشركتي",
        problems: ["بدون معلومات", "غير موجه", "نتيجة عشوائية"]
      },
      after: {
        text: "أنت مصمم جرافيك محترف. صمم شعاراً عصرياً لشركة تقنية ناشئة اسمها 'TechFlow' متخصصة في حلول الذكاء الاصطناعي. المتطلبات: 1) أسلوب minimalist 2) ألوان أزرق وأخضر 3) يعكس الابتكار والتكنولوجيا 4) مناسب للاستخدام الرقمي والطباعة. قدم 3 مفاهيم مختلفة مع شرح الفكرة وراء كل تصميم.",
        benefits: ["هوية واضحة", "متطلبات محددة", "تصميم مميز"]
      }
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="neon-text">قبل وبعد رقيم AI</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              شاهد الفرق بين البرومبتات العادية والبرومبتات المحسّنة
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-8">
            {examples.map((example, index) => (
              <Card key={index} className="p-6 md:p-8 bg-card/50 border-primary/20 hover:border-primary/30 transition-colors">
                {/* Category Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6">
                  <span className="text-sm font-semibold text-primary">{example.category}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Before */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <X className="w-6 h-6 text-red-500" />
                      <h3 className="text-xl font-bold text-red-500">قبل رقيم AI</h3>
                    </div>

                    <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed">
                        "{example.before.text}"
                      </p>
                    </div>

                    <div className="space-y-2">
                      {example.before.problems.map((problem, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-red-500">
                          <X className="w-4 h-4" />
                          <span>{problem}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden lg:flex items-center justify-center">
                    <ArrowRight className="w-12 h-12 text-primary animate-pulse" />
                  </div>
                  <div className="lg:hidden flex items-center justify-center my-4">
                    <ArrowRight className="w-12 h-12 text-primary rotate-90 animate-bounce" />
                  </div>

                  {/* After */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Check className="w-6 h-6 text-green-500" />
                      <h3 className="text-xl font-bold text-green-500">بعد رقيم AI</h3>
                    </div>

                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed">
                        "{example.after.text}"
                      </p>
                    </div>

                    <div className="space-y-2">
                      {example.after.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-green-500">
                          <Check className="w-4 h-4" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-3">
                جاهز لتحسين برومبتاتك؟
              </h3>
              <p className="text-muted-foreground mb-6">
                ابدأ الآن واحصل على نتائج احترافية من الذكاء الاصطناعي
              </p>
              <button
                onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
              >
                <Check className="w-5 h-5" />
                جرّب رقيم AI مجاناً
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
