import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowLeft } from "lucide-react";

interface Example {
  id: number;
  title: string;
  prompt: string;
  result: string;
  model: string;
  category: string;
}

const examples: Example[] = [
  {
    id: 1,
    title: "تحليل سوق البيتكوين",
    prompt: "قم بتحليل شامل لسوق البيتكوين خلال آخر 24 ساعة مع التركيز على المؤشرات الفنية والأخبار المؤثرة",
    result: "تحليل سوق البيتكوين - آخر 24 ساعة\n\nالمؤشرات الفنية:\n- السعر الحالي: $42,350 (+2.3%)\n- RSI: 58 (منطقة محايدة)\n- MACD: إشارة إيجابية\n- مستوى الدعم: $41,000\n- مستوى المقاومة: $43,500\n\nالأخبار المؤثرة:\n- موافقة SEC على صناديق البيتكوين الفورية\n- تصريحات إيجابية من مؤسسات مالية كبرى\n\nالتوقعات:\nاحتمالية اختراق مستوى $43,500 في حال استمرار الزخم الإيجابي",
    model: "GPT-4",
    category: "تداول",
  },
  {
    id: 2,
    title: "شرح مفهوم الـ Recursion",
    prompt: "اشرح مفهوم Recursion في البرمجة للمبتدئين بطريقة مبسطة مع تشبيه من الحياة الواقعية ومثال برمجي بسيط",
    result: "ما هو الـ Recursion؟\n\nالـ Recursion هو عندما تستدعي دالة نفسها لحل مشكلة معقدة عن طريق تقسيمها لمشاكل أصغر.\n\nتشبيه من الحياة:\nتخيل أنك تبحث عن مفتاحك في صندوق كبير فيه صناديق أصغر. تفتح كل صندوق، وإذا وجدت صندوق آخر بداخله، تكرر نفس العملية حتى تجد المفتاح.\n\nمثال برمجي (حساب المضروب):\ndef factorial(n):\n    if n == 0:  # الحالة الأساسية\n        return 1\n    return n * factorial(n-1)  # استدعاء ذاتي",
    model: "Claude",
    category: "تعليم",
  },
  {
    id: 3,
    title: "منشور سوشيال ميديا عن الإنتاجية",
    prompt: "اكتب منشور سوشيال ميديا احترافي عن زيادة الإنتاجية يحقق أقصى تفاعل مع افتتاحية قوية ودعوة واضحة للتفاعل",
    result: "⏰ هل تشعر أن يومك ينتهي وأنت لم تنجز شيئاً؟\n\nالمشكلة ليست في الوقت... المشكلة في كيفية إدارته!\n\n✨ 3 خطوات بسيطة غيّرت حياتي:\n\n1️⃣ قاعدة الـ 2 دقيقة: أي مهمة تأخذ أقل من دقيقتين، افعلها فوراً\n2️⃣ تقنية Pomodoro: 25 دقيقة تركيز + 5 دقائق راحة\n3️⃣ قائمة المهام الثلاث: حدد 3 مهام رئيسية فقط يومياً\n\nالنتيجة؟ إنتاجية أعلى بـ 3 أضعاف مع ضغط أقل! 🚀\n\n💬 ما هي تقنيتك المفضلة لزيادة الإنتاجية؟ شاركنا في التعليقات!",
    model: "GPT-4",
    category: "تسويق",
  },
  {
    id: 4,
    title: "كود Python لمعالجة البيانات",
    prompt: "اكتب كود Python نظيف وموثق لقراءة ملف CSV ومعالجة البيانات وحساب المتوسطات مع معالجة الأخطاء",
    result: "import pandas as pd\nimport sys\n\ndef process_csv_data(file_path):\n    # قراءة ملف CSV ومعالجة البيانات\n    try:\n        df = pd.read_csv(file_path)\n        if df.empty:\n            raise ValueError('الملف فارغ')\n        \n        # حساب المتوسطات للأعمدة الرقمية\n        numeric_cols = df.select_dtypes(include=['number'])\n        averages = numeric_cols.mean().to_dict()\n        return averages\n    except FileNotFoundError:\n        print(f'خطأ: الملف {file_path} غير موجود')\n        sys.exit(1)",
    model: "GPT-4",
    category: "برمجة",
  },
];

export default function LiveExamples() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {examples.map((example) => (
        <Card
          key={example.id}
          className="p-6 bg-card/50 border-primary/20 hover:border-primary/40 transition-all"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">{example.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {example.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Sparkles className="w-3 h-3" />
                    <span>{example.model}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span>البرومبت:</span>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg border-r-2 border-primary/50">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {example.prompt}
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 text-primary rotate-[-90deg]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span>النتيجة:</span>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {example.result}
                </pre>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
