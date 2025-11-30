import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "محمد العتيبي",
      role: "مطور برامج",
      avatar: "👨‍💻",
      rating: 5,
      text: "رقيم وفّر علي ساعات من التجربة والخطأ! الآن أحصل على أكواد دقيقة من أول محاولة",
      highlight: "وفّر علي ساعات من التجربة والخطأ!"
    },
    {
      name: "سارة الأحمد",
      role: "كاتبة محتوى",
      avatar: "✍️",
      rating: 5,
      text: "أداة رائعة لكل من يعمل مع الذكاء الاصطناعي. البرومبتات المولدة احترافية جداً ودقيقة",
      highlight: "البرومبتات المولدة احترافية جداً"
    },
    {
      name: "خالد المطيري",
      role: "مصمم جرافيك",
      avatar: "🎨",
      rating: 5,
      text: "استخدمه يومياً لتوليد أفكار إبداعية. النتائج دائماً تفوق توقعاتي!",
      highlight: "النتائج دائماً تفوق توقعاتي!"
    },
    {
      name: "نورة السالم",
      role: "طالبة جامعية",
      avatar: "👩‍🎓",
      rating: 5,
      text: "ساعدني كثيراً في أبحاثي الجامعية. أحصل على برومبتات منظمة وواضحة",
      highlight: "ساعدني كثيراً في أبحاثي الجامعية"
    },
    {
      name: "عبدالله الشمري",
      role: "رائد أعمال",
      avatar: "💼",
      rating: 5,
      text: "أستخدمه لكتابة محتوى تسويقي لمشروعي. النتائج مذهلة والوقت المُوفر لا يُقدر بثمن",
      highlight: "الوقت المُوفر لا يُقدر بثمن"
    },
    {
      name: "ريم القحطاني",
      role: "معلمة",
      avatar: "👩‍🏫",
      rating: 5,
      text: "أداة مثالية لإنشاء خطط دروس وأنشطة تعليمية. سهلة الاستخدام ونتائجها ممتازة",
      highlight: "أداة مثالية لإنشاء خطط دروس"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="neon-text">ماذا يقول مستخدمونا؟</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              آلاف المستخدمين يثقون برقيم AI لتحسين تجربتهم مع الذكاء الاصطناعي
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="p-6 bg-card/50 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10 relative overflow-hidden"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-16 h-16 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
                  "{testimonial.text}"
                </p>

                {/* Highlight Quote */}
                <div className="bg-primary/10 border-r-4 border-primary px-4 py-2 mb-4 rounded">
                  <p className="text-sm font-semibold text-primary">
                    "{testimonial.highlight}"
                  </p>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/30 rounded-full">
              <Star className="w-5 h-5 fill-primary text-primary" />
              <span className="font-semibold">تقييم 5/5 من أكثر من 1000+ مستخدم</span>
              <Star className="w-5 h-5 fill-primary text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
