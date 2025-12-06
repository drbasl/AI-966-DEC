import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Header
    "nav.home": "الرئيسية",
    "nav.generator": "مولّد البرومبتات",
    "nav.worksheets": "مولد أوراق العمل",
    "nav.templates": "مكتبة القوالب",
    "nav.popular": "البرومبتات الشعبية",
    "nav.examples": "أمثلة حية",
    "nav.analyzer": "محلل البرومبتات",
    "nav.login": "تسجيل الدخول",
    "nav.dashboard": "لوحة التحكم",
    "nav.library": "مكتبتي",
    "nav.logout": "تسجيل الخروج",

    // Home Page
    "home.title": "رقيم AI 966",
    "home.subtitle": "مولّد البرومبتات بالذكاء الاصطناعي",
    "home.description": "حسّن برومبتاتك واحصل على نتائج أفضل من الذكاء الاصطناعي",
    "home.startTour": "ابدأ الجولة التعريفية",
    "home.version": "رقم الإصدار:",
    "home.heroTitle": "رقيم AI 966",
    "home.heroSubtitle": "مولّد البرومبتات بالذكاء الاصطناعي",
    "home.heroDesc1": "تعبت من كتابة برومبتات ما تعطيك النتيجة اللي تبيها؟",
    "home.heroDesc2": "رقيم AI يحل المشكلة!",
    "home.heroDesc3": "احصل على برومبتات احترافية مصممة خصيصاً لاحتياجك",
    "home.heroDesc4": "من كتابة المحتوى للبرمجة والتصميم - كل شيء بدقة وذكاء",
    "home.startNow": "ابدأ الآن مجاناً",
    "home.howItWorks": "كيف يعمل؟",
    "home.stat1": "+10",
    "home.stat1Desc": "أنواع استخدام متنوعة",
    "home.stat2": "AI",
    "home.stat2Desc": "تحسين ذكي للبرومبتات",
    "home.stat3": "100%",
    "home.stat3Desc": "مجاني بالكامل",
    "home.popularTitle": "البرومبتات الأكثر شعبية",
    "home.popularSubtitle": "البرومبتات الأعلى تقييماً واستخداماً من المجتمع",
    "home.topRated": "الأعلى تقييماً",
    "home.liveExamplesTitle": "أمثلة حية من الواقع",
    "home.liveExamplesSubtitle": "شاهد كيف تحول البرومبتات المحسّنة إلى نتائج فعلية من نماذج AI مختلفة",
    "home.analyzerTitle": "محلل البرومبتات الذكي",
    "home.analyzerSubtitle": "احصل على تحليل مفصّل لجودة برومبتك مع اقتراحات للتحسين",
    "home.footerCopyright": "رقيم AI 966 © 2025 | الذكاء الاصطناعي السعودي",
    "home.telegram": "تيليجرام",
    "home.twitter": "تويتر",

    // Prompt Generator
    "generator.title": "حوّل أفكارك إلى برومبتات احترافية",
    "generator.subtitle": "أدخِل فكرتك البسيطة، واحصل على برومبت احترافي جاهز للاستخدام",
    "generator.quickExamples": "جرّب الأمثلة السريعة:",
    "generator.basePrompt": "البرومبت الأساسي",
    "generator.placeholder": "اكتب طلبك هنا... مثال: اكتب لي مقال عن الذكاء الاصطناعي",
    "generator.usageType": "نوع الاستخدام",
    "generator.options": "خيارات إضافية",
    "generator.humanTone": "لهجة بشرية طبيعية",
    "generator.examples": "أمثلة عملية",
    "generator.keyPoints": "نقاط رئيسية + ملخص",
    "generator.engaging": "أسلوب جدلي أو محفّز للتفاعل",
    "generator.complexity": "درجة التعقيد",
    "generator.simple": "بسيط",
    "generator.medium": "متوسط",
    "generator.advanced": "متقدم",
    "generator.generate": "توليد البرومبت المحسَّن الآن",
    "generator.generating": "جاري التوليد...",
    "generator.result": "البرومبت النهائي المقترح",
    "generator.copy": "نسخ",
    "generator.save": "حفظ",
    "generator.regenerate": "إعادة",
    "generator.export": "تصدير",
    "generator.exportWord": "تصدير Word",
    "generator.exportText": "تصدير نص عادي",

    // Usage Types
    "usage.social": "تغريدات / سوشيال ميديا",
    "usage.code": "كود وبرمجة",
    "usage.education": "تعليم ومذاكرة",
    "usage.crypto": "كريبتو وتداول",
    "usage.article": "كتابة مقالات / محتوى طويل",
    "usage.exam": "أسئلة امتحانات / مراجعة",

    // Worksheets
    "worksheets.title": "مولد أوراق العمل التعليمية",
    "worksheets.subtitle": "أنشئ أوراق عمل تعليمية مخصصة بسهولة باستخدام الذكاء الاصطناعي",
    "worksheets.details": "تفاصيل ورقة العمل",
    "worksheets.method": "طريقة التوليد",
    "worksheets.byTitle": "إنشاء باستخدام عنوان الدرس",
    "worksheets.byText": "باستخدام نص",
    "worksheets.questionType": "نوع الأسئلة",
    "worksheets.questionCount": "عدد الأسئلة",
    "worksheets.language": "لغة الورقة",
    "worksheets.gradeLevel": "المرحلة الدراسية",
    "worksheets.lessonTitle": "عنوان الدرس",
    "worksheets.teacherName": "اسم المعلم/ة (اختياري)",
    "worksheets.schoolName": "اسم المدرسة (اختياري)",
    "worksheets.generate": "توليد ورقة العمل",
    "worksheets.generated": "ورقة العمل المولدة",

    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
    "common.success": "تم بنجاح",
    "common.cancel": "إلغاء",
    "common.confirm": "تأكيد",
    "common.close": "إغلاق",
    "common.next": "التالي",
    "common.prev": "السابق",
    "common.finish": "إنهاء",
    "common.skip": "تخطي",

    // Tour
    "tour.welcome.title": "مرحباً بك في رقيم AI 966!",
    "tour.welcome.content": "دعنا نأخذك في جولة سريعة لاكتشاف كيفية استخدام الموقع.",
    "tour.generator.title": "مولّد البرومبتات",
    "tour.generator.content": "هنا يمكنك كتابة فكرتك الأساسية وتحويلها إلى برومبت احترافي. اكتب طلبك في الخانة واختر نوع الاستخدام.",
    "tour.generateButton.title": "زر التوليد",
    "tour.generateButton.content": "بعد كتابة طلبك، اضغط على زر 'توليد البرومبت المحسَّن' وانتظر ثوانٍ قليلة للحصول على النتيجة.",
    "tour.copyExport.title": "النسخ والتصدير",
    "tour.copyExport.content": "بعد التوليد، يمكنك نسخ البرومبت أو تصديره كملف Word أو نص عادي باستخدام أزرار النسخ والتصدير.",
    "tour.worksheets.title": "أوراق العمل",
    "tour.worksheets.content": "هنا يمكنك إنشاء أوراق عمل تعليمية. أدخل عنوان الدرس واختر نوع الأسئلة ثم اضغط توليد!",
    "tour.templates.title": "مكتبة القوالب",
    "tour.templates.content": "استكشف قوالب جاهزة للاستخدام في مختلف المجالات. اضغط على أي قالب لاستخدامه مباشرة.",
    "tour.finish.title": "أنت جاهز!",
    "tour.finish.content": "الآن يمكنك البدء في إنشاء برومبتات احترافية. استمتع!",
  },
  en: {
    // Header
    "nav.home": "Home",
    "nav.generator": "Prompt Generator",
    "nav.worksheets": "Worksheet Generator",
    "nav.templates": "Template Library",
    "nav.popular": "Popular Prompts",
    "nav.examples": "Live Examples",
    "nav.analyzer": "Prompt Analyzer",
    "nav.login": "Login",
    "nav.dashboard": "Dashboard",
    "nav.library": "My Library",
    "nav.logout": "Logout",

    // Home Page
    "home.title": "Raqim AI 966",
    "home.subtitle": "AI-Powered Prompt Generator",
    "home.description": "Improve your prompts and get better results from AI",
    "home.startTour": "Start Tour",
    "home.version": "Version:",
    "home.heroTitle": "Raqim AI 966",
    "home.heroSubtitle": "AI-Powered Prompt Generator",
    "home.heroDesc1": "Tired of writing prompts that don't give you the results you want?",
    "home.heroDesc2": "Raqim AI solves the problem!",
    "home.heroDesc3": "Get professional prompts designed specifically for your needs",
    "home.heroDesc4": "From content writing to programming and design - everything with precision and intelligence",
    "home.startNow": "Start Now for Free",
    "home.howItWorks": "How it works?",
    "home.stat1": "+10",
    "home.stat1Desc": "Various usage types",
    "home.stat2": "AI",
    "home.stat2Desc": "Smart prompt enhancement",
    "home.stat3": "100%",
    "home.stat3Desc": "Completely free",
    "home.popularTitle": "Most Popular Prompts",
    "home.popularSubtitle": "Top rated and most used prompts from the community",
    "home.topRated": "Top Rated",
    "home.liveExamplesTitle": "Real Live Examples",
    "home.liveExamplesSubtitle": "See how enhanced prompts transform into actual results from different AI models",
    "home.analyzerTitle": "Smart Prompt Analyzer",
    "home.analyzerSubtitle": "Get detailed analysis of your prompt quality with improvement suggestions",
    "home.footerCopyright": "Raqim AI 966 © 2025 | Saudi AI",
    "home.telegram": "Telegram",
    "home.twitter": "Twitter",

    // Prompt Generator
    "generator.title": "From Simple Idea to Professional Prompt",
    "generator.subtitle": "Tell us what you want, and let us create the perfect prompt for you",
    "generator.quickExamples": "Try quick examples:",
    "generator.basePrompt": "Base Prompt",
    "generator.placeholder": "Write your request here... Example: Write an article about artificial intelligence",
    "generator.usageType": "Usage Type",
    "generator.options": "Additional Options",
    "generator.humanTone": "Natural human tone",
    "generator.examples": "Practical examples",
    "generator.keyPoints": "Key points + summary",
    "generator.engaging": "Engaging or provocative style",
    "generator.complexity": "Complexity Level",
    "generator.simple": "Simple",
    "generator.medium": "Medium",
    "generator.advanced": "Advanced",
    "generator.generate": "Generate Enhanced Prompt Now",
    "generator.generating": "Generating...",
    "generator.result": "Final Suggested Prompt",
    "generator.copy": "Copy",
    "generator.save": "Save",
    "generator.regenerate": "Regenerate",
    "generator.export": "Export",
    "generator.exportWord": "Export Word",
    "generator.exportText": "Export Text",

    // Usage Types
    "usage.social": "Tweets / Social Media",
    "usage.code": "Code & Programming",
    "usage.education": "Education & Study",
    "usage.crypto": "Crypto & Trading",
    "usage.article": "Articles / Long Content",
    "usage.exam": "Exam Questions / Review",

    // Worksheets
    "worksheets.title": "Educational Worksheet Generator",
    "worksheets.subtitle": "Create custom educational worksheets easily using AI",
    "worksheets.details": "Worksheet Details",
    "worksheets.method": "Generation Method",
    "worksheets.byTitle": "Create using lesson title",
    "worksheets.byText": "Using text",
    "worksheets.questionType": "Question Type",
    "worksheets.questionCount": "Number of Questions",
    "worksheets.language": "Worksheet Language",
    "worksheets.gradeLevel": "Grade Level",
    "worksheets.lessonTitle": "Lesson Title",
    "worksheets.teacherName": "Teacher Name (optional)",
    "worksheets.schoolName": "School Name (optional)",
    "worksheets.generate": "Generate Worksheet",
    "worksheets.generated": "Generated Worksheet",

    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.close": "Close",
    "common.next": "Next",
    "common.prev": "Previous",
    "common.finish": "Finish",
    "common.skip": "Skip",

    // Tour
    "tour.welcome.title": "Welcome to Raqim AI 966!",
    "tour.welcome.content": "Let us take you on a quick tour to discover how to use the site.",
    "tour.generator.title": "Prompt Generator",
    "tour.generator.content": "Here you can write your basic idea and transform it into a professional prompt. Write your request and choose the usage type.",
    "tour.generateButton.title": "Generate Button",
    "tour.generateButton.content": "After writing your request, click the 'Generate Enhanced Prompt' button and wait a few seconds for the result.",
    "tour.copyExport.title": "Copy & Export",
    "tour.copyExport.content": "After generation, you can copy the prompt or export it as Word or plain text file using the copy and export buttons.",
    "tour.worksheets.title": "Worksheets",
    "tour.worksheets.content": "Here you can create educational worksheets. Enter the lesson title, choose question type, then click generate!",
    "tour.templates.title": "Template Library",
    "tour.templates.content": "Explore ready-to-use templates in various fields. Click any template to use it directly.",
    "tour.finish.title": "You're Ready!",
    "tour.finish.content": "Now you can start creating professional prompts. Enjoy!",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language");
      return (saved as Language) || "ar";
    }
    return "ar";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
