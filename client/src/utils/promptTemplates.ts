/**
 * نظام القوالب الاحترافية + المحرك الذكي لدمج الخيارات
 * Professional Template System + Smart Option Merging Engine
 *
 * يعمل كنظام احتياطي عند تعطل API
 * Works as fallback system when API fails
 */

// أنواع الاستخدام المدعومة
export type UsageType =
  | "social"      // تغريدات / سوشيال ميديا
  | "code"        // كود وبرمجة
  | "education"   // تعليم ومذاكرة
  | "crypto"      // كريبتو وتداول
  | "article"     // كتابة مقالات
  | "exam";       // أسئلة امتحانات

// خيارات التخصيص
export interface EnhancementOptions {
  humanTone: boolean;      // لهجة بشرية طبيعية
  examples: boolean;       // أمثلة عملية
  keyPoints: boolean;      // نقاط رئيسية + ملخص
  engaging: boolean;       // أسلوب جدلي أو محفّز للتفاعل
  complexity: "simple" | "medium" | "advanced";  // درجة التعقيد
}

// القوالب الاحترافية الأساسية لكل نوع استخدام
const professionalTemplates: Record<UsageType, (basePrompt: string) => string> = {

  // 📱 تغريدات / سوشيال ميديا
  social: (basePrompt: string) => `
قم بإنشاء محتوى سوشيال ميديا احترافي وجذاب بناءً على الطلب التالي:

${basePrompt}

متطلبات المحتوى:
- الطول: مناسب للمنصة (تويتر: 280 حرف، إنستغرام: أطول قليلاً)
- الأسلوب: جذاب، مختصر، ومباشر
- استخدم الهاشتاقات المناسبة
- اجعل المحتوى قابل للمشاركة والتفاعل
- ركز على القيمة المضافة للقارئ
`.trim(),

  // 💻 كود وبرمجة
  code: (basePrompt: string) => `
بصفتك مطور برمجيات خبير، قم بتنفيذ الطلب التالي:

${basePrompt}

المتطلبات التقنية:
- اكتب كود نظيف وقابل للصيانة
- اتبع أفضل الممارسات (Best Practices)
- أضف تعليقات توضيحية للأجزاء المعقدة
- تأكد من معالجة الأخطاء بشكل صحيح
- قدم شرح مختصر للكود إذا لزم الأمر
`.trim(),

  // 📚 تعليم ومذاكرة
  education: (basePrompt: string) => `
بصفتك معلم خبير، قم بشرح الموضوع التالي بطريقة تعليمية:

${basePrompt}

منهجية الشرح:
- ابدأ بمقدمة بسيطة وواضحة
- استخدم أسلوب تدريجي من البسيط للمعقد
- وضح المفاهيم الأساسية قبل التفاصيل
- اربط المعلومات بالواقع العملي
- اختم بملخص للنقاط الرئيسية
`.trim(),

  // 💰 كريبتو وتداول
  crypto: (basePrompt: string) => `
بصفتك محلل مالي متخصص في العملات الرقمية، قم بتحليل:

${basePrompt}

متطلبات التحليل:
- قدم تحليل موضوعي ومبني على البيانات
- اذكر المخاطر المحتملة بوضوح
- استخدم المصطلحات التقنية الدقيقة
- قدم وجهات نظر متعددة عند الإمكان
- تجنب النصائح المالية المباشرة (هذا تحليل فقط)

تنويه: هذا المحتوى لأغراض تعليمية فقط وليس نصيحة استثمارية.
`.trim(),

  // ✍️ كتابة مقالات / محتوى طويل
  article: (basePrompt: string) => `
اكتب مقال احترافي ومتكامل حول:

${basePrompt}

بنية المقال:
- مقدمة جذابة تشد القارئ
- عرض منظم للأفكار الرئيسية
- استخدم عناوين فرعية واضحة
- دعم الأفكار بالحقائق والمعلومات
- خاتمة قوية تلخص الموضوع
- اجعل الأسلوب سلس وسهل القراءة
`.trim(),

  // 📝 أسئلة امتحانات / مراجعة
  exam: (basePrompt: string) => `
قم بإنشاء أسئلة امتحانات شاملة ومتنوعة حول:

${basePrompt}

معايير الأسئلة:
- تنوع في مستويات الصعوبة (سهل، متوسط، صعب)
- أنواع مختلفة (اختيار متعدد، صح/خطأ، مقالي)
- تغطية شاملة للموضوع
- وضوح في الصياغة
- تقديم الإجابات النموذجية
`.trim(),
};

// المحرك الذكي لدمج الخيارات مع القالب الأساسي
export function enhanceWithOptions(
  baseTemplate: string,
  options: EnhancementOptions
): string {
  let enhanced = baseTemplate;

  // 1️⃣ إضافة طلب الأمثلة العملية
  if (options.examples) {
    enhanced += `\n\nأمثلة عملية:
- قدم على الأقل 2-3 أمثلة توضيحية
- اجعل الأمثلة واقعية وقابلة للتطبيق
- استخدم سيناريوهات متنوعة`;
  }

  // 2️⃣ تعديل اللهجة لتكون بشرية طبيعية
  if (options.humanTone) {
    enhanced += `\n\nأسلوب الكتابة:
- استخدم لغة طبيعية وودية
- تجنب الأسلوب الآلي أو الرسمي الزائد
- اجعل المحتوى قريب من طريقة حديث الإنسان
- استخدم تعبيرات واقعية ومألوفة`;
  }

  // 3️⃣ إضافة هيكل النقاط الرئيسية والملخص
  if (options.keyPoints) {
    enhanced += `\n\nالهيكل المطلوب:
- ابدأ بذكر النقاط الرئيسية في البداية
- قدم تفصيل لكل نقطة
- اختم بملخص شامل ومركز
- استخدم نقاط وترقيم واضح`;
  }

  // 4️⃣ جعل الأسلوب جدلي ومحفز للتفاعل
  if (options.engaging) {
    enhanced += `\n\nطابع المحتوى:
- استخدم أسئلة استفزازية أو تحفز التفكير
- قدم وجهات نظر مثيرة للجدل بطريقة محترمة
- شجع القارئ على التفاعل والمشاركة
- استخدم عبارات تحفيزية وملهمة`;
  }

  // 5️⃣ تعديل حسب درجة التعقيد
  switch (options.complexity) {
    case "simple":
      enhanced += `\n\nمستوى التعقيد: بسيط
- استخدم لغة سهلة ومباشرة
- تجنب المصطلحات المعقدة
- اشرح أي مفهوم تقني ببساطة
- اجعل المحتوى مناسب للمبتدئين`;
      break;

    case "medium":
      enhanced += `\n\nمستوى التعقيد: متوسط
- استخدم مزيج من البساطة والعمق
- قدم بعض المصطلحات التقنية مع شرحها
- اجعل المحتوى مناسب لمن لديه معرفة أساسية`;
      break;

    case "advanced":
      enhanced += `\n\nمستوى التعقيد: متقدم
- استخدم مصطلحات تقنية متخصصة
- تعمق في التفاصيل الدقيقة
- افترض معرفة مسبقة بالموضوع
- قدم رؤى متقدمة وتحليل عميق`;
      break;
  }

  return enhanced;
}

// الدالة الرئيسية: توليد برومبت باستخدام نظام القوالب (Fallback)
export function generateFallbackPrompt(
  basePrompt: string,
  usageType: UsageType,
  options: EnhancementOptions
): string {
  // 1️⃣ الحصول على القالب الأساسي المناسب
  const templateGenerator = professionalTemplates[usageType];
  const baseTemplate = templateGenerator(basePrompt);

  // 2️⃣ تحسين القالب بناءً على خيارات المستخدم
  const enhancedPrompt = enhanceWithOptions(baseTemplate, options);

  // 3️⃣ إضافة رأس توضيحي للمستخدم
  const header = `⚡ تم توليد هذا البرومبت باستخدام النظام الاحتياطي الذكي\n\n`;

  return header + enhancedPrompt;
}

// دالة مساعدة: التحقق من توفر API
export async function isApiAvailable(): Promise<boolean> {
  try {
    // يمكن إضافة فحص حقيقي للـ API هنا
    // const response = await fetch('/api/health');
    // return response.ok;
    return true; // افتراضياً نفترض أن API متاح
  } catch (error) {
    return false;
  }
}

// دالة مساعدة: الحصول على اسم نوع الاستخدام بالعربية
export function getUsageTypeName(usageType: UsageType, language: "ar" | "en" = "ar"): string {
  const names: Record<UsageType, { ar: string; en: string }> = {
    social: { ar: "تغريدات / سوشيال ميديا", en: "Tweets / Social Media" },
    code: { ar: "كود وبرمجة", en: "Code & Programming" },
    education: { ar: "تعليم ومذاكرة", en: "Education & Study" },
    crypto: { ar: "كريبتو وتداول", en: "Crypto & Trading" },
    article: { ar: "كتابة مقالات", en: "Articles" },
    exam: { ar: "أسئلة امتحانات", en: "Exam Questions" },
  };

  return names[usageType][language];
}
