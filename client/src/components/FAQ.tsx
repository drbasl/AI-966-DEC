import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Lightbulb } from "lucide-react";

const faqs = [
  {
    question: "ما هو البرومبت (Prompt)؟",
    answer: "البرومبت هو التعليمات أو الأوامر النصية التي تُعطى لنماذج الذكاء الاصطناعي (مثل ChatGPT، Claude، Gemini) لتوليد محتوى معين. كلما كان البرومبت أكثر وضوحاً وتفصيلاً، كانت النتائج أفضل وأدق."
  },
  {
    question: "كيف أكتب برومبت فعال؟",
    answer: "لكتابة برومبت فعال:\n\n1. **كن واضحاً ومحدداً**: حدد بالضبط ما تريد\n2. **أضف السياق**: اشرح الخلفية والهدف\n3. **حدد الشكل المطلوب**: (قائمة، مقال، جدول، إلخ)\n4. **استخدم أمثلة**: قدم نماذج للنتيجة المرغوبة\n5. **حدد الطول**: كم كلمة أو فقرة تريد\n\n**مثال ضعيف**: \"اكتب عن الذكاء الاصطناعي\"\n**مثال قوي**: \"اكتب مقال 500 كلمة عن تأثير الذكاء الاصطناعي على التعليم في السعودية، مع 3 أمثلة عملية وخاتمة\"",
    example: true
  },
  {
    question: "هل يحتاج البرومبت إلى ذكر تفاصيل كثيرة؟",
    answer: "نعم ولا! يعتمد على الهدف:\n\n**نعم - للمهام المعقدة**:\n- كتابة مقالات طويلة\n- تحليلات تفصيلية\n- كود برمجي متقدم\n\n**لا - للمهام البسيطة**:\n- تغريدات\n- أفكار سريعة\n- أسئلة مباشرة\n\n**القاعدة الذهبية**: كلما كانت النتيجة المطلوبة أكثر تعقيداً، كان البرومبت بحاجة لمزيد من التفاصيل."
  },
  {
    question: "كيف أجعل البرومبت أكثر تحديداً؟",
    answer: "استخدم هذه العناصر:\n\n1. **الدور**: \"أنت خبير في...\"\n2. **المهمة**: \"اكتب/حلل/صمم...\"\n3. **السياق**: \"للجمهور المستهدف...\"\n4. **القيود**: \"بحد أقصى 300 كلمة\"\n5. **الشكل**: \"في شكل قائمة مرقمة\"\n6. **الأسلوب**: \"بلهجة رسمية/ودية\"\n\n**مثال**: \"أنت خبير تسويق رقمي. اكتب 5 تغريدات جذابة عن فوائد القراءة للشباب السعودي، كل تغريدة 280 حرف، بأسلوب محفز ومشجع\"",
    example: true
  },
  {
    question: "ما الفرق بين البرومبت الجيد والسيء؟",
    answer: "**البرومبت السيء**:\n- غامض وعام\n- بدون سياق\n- بدون تحديد الشكل\n- مثال: \"اكتب شيء عن الرياضة\"\n\n**البرومبت الجيد**:\n- واضح ومحدد\n- يحتوي على سياق\n- يحدد الشكل والطول\n- مثال: \"اكتب مقال 400 كلمة عن فوائد المشي اليومي للصحة، موجه للمبتدئين، مع 5 نصائح عملية وخاتمة تحفيزية\"\n\n**النتيجة**: البرومبت الجيد يوفر وقتك ويعطيك نتائج دقيقة من المحاولة الأولى!"
  },
  {
    question: "هل يمكن استخدام البرومبتات مع أي نموذج AI؟",
    answer: "نعم! البرومبتات تعمل مع جميع نماذج الذكاء الاصطناعي، لكن قد تختلف النتائج قليلاً:\n\n- **ChatGPT** (OpenAI): ممتاز للمحادثات والكتابة الإبداعية\n- **Claude** (Anthropic): قوي في التحليل والمهام المعقدة\n- **Gemini** (Google): متميز في البحث والمعلومات\n- **Llama** (Meta): مفتوح المصدر ومجاني\n\n**نصيحة**: جرب نفس البرومبت على أكثر من نموذج واختر الأفضل!"
  }
];

export default function FAQ() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-bold">
          ❓ أسئلة شائعة عن البرومبتات
        </h3>
        <p className="text-muted-foreground">
          دليل شامل للمبتدئين لفهم وكتابة برومبتات فعالة
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border border-primary/20 rounded-lg px-6 bg-card/50"
          >
            <AccordionTrigger className="text-right hover:no-underline py-5">
              <div className="flex items-start gap-3 text-base font-semibold">
                <span className="text-primary text-xl">{index + 1}.</span>
                <span>{faq.question}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
              <div className="pr-8 space-y-3">
                {faq.answer.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('**') ? 'font-semibold text-foreground' : ''}>
                    {line.replace(/\*\*/g, '')}
                  </p>
                ))}
                {faq.example && (
                  <div className="mt-4 p-4 bg-primary/5 border-r-4 border-primary rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">أمثلة عملية</span>
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
