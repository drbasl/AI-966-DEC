import { Card } from "@/components/ui/card";
import { FileText, Sparkles, CheckCircle, ArrowDown } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FileText className="w-12 h-12 text-primary" />,
      title: "خطوة 1: اختر نوع المهمة",
      description: "حدد نوع المحتوى الذي تريد إنشاءه: مقال، كود برمجي، محتوى تسويقي، أو أي شيء آخر",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: <Sparkles className="w-12 h-12 text-primary" />,
      title: "خطوة 2: أدخل تفاصيل بسيطة",
      description: "اكتب فكرتك الأساسية أو ما تريد تحقيقه، واختر الخيارات المناسبة لاحتياجك",
      color: "from-cyan-500/20 to-blue-500/20"
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-primary" />,
      title: "خطوة 3: احصل على برومبت احترافي",
      description: "سيقوم الذكاء الاصطناعي بتوليد برومبت محسّن جاهز للاستخدام مع أي نموذج AI",
      color: "from-blue-500/20 to-purple-500/20"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-muted/30">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="neon-text">كيف يعمل رقيم AI؟</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ثلاث خطوات بسيطة للحصول على برومبتات احترافية في ثوانٍ
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting Lines (hidden on mobile) */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-1/2 z-0" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className={`p-8 bg-gradient-to-br ${step.color} border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20`}>
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="p-4 rounded-full bg-primary/10 border border-primary/30">
                        {step.icon}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 text-center">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {step.description}
                    </p>
                  </Card>

                  {/* Arrow (hidden on last item and mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -left-4 -translate-y-1/2 z-20">
                      <ArrowDown className="w-8 h-8 text-primary rotate-[-90deg] animate-pulse" />
                    </div>
                  )}

                  {/* Mobile Arrow */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center my-4">
                      <ArrowDown className="w-8 h-8 text-primary animate-bounce" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-4">
              جاهز لتجربة رقيم AI؟
            </p>
            <button
              onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
            >
              <Sparkles className="w-5 h-5" />
              ابدأ الآن مجاناً
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
