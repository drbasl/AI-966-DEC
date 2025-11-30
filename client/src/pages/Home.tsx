import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sparkles, Zap, TrendingUp, Send, Moon, Sun, Menu, Globe, Save } from "lucide-react";
import PromptGenerator from "@/components/PromptGenerator";
import PopularPrompts from "@/components/PopularPrompts";
import SpecializedTemplates from "@/components/SpecializedTemplates";
import FAQ from "@/components/FAQ";
import LiveStats from "@/components/LiveStats";
import BeforeAfter from "@/components/BeforeAfter";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

type Template = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  usageType: "social" | "code" | "education" | "crypto" | "article" | "exam";
  basePrompt: string;
  options: {
    humanTone: boolean;
    examples: boolean;
    keyPoints: boolean;
    complexity: string;
    engaging: boolean;
  };
};

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const scrollToGenerator = () => {
    const element = document.getElementById('generator');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSpecializedTemplateSelect = (template: { title: string; basePrompt: string; usageType: "social" | "code" | "education" | "crypto" | "article" | "exam" }) => {
    // Convert specialized template to regular template format
    const convertedTemplate: Template = {
      id: template.title.toLowerCase().replace(/\s+/g, '-'),
      title: template.title,
      description: template.basePrompt,
      icon: <Sparkles className="w-6 h-6" />,
      basePrompt: template.basePrompt,
      usageType: template.usageType,
      options: {
        humanTone: false,
        examples: false,
        keyPoints: false,
        complexity: "متوسط" as const,
        engaging: false,
      }
    };
    setSelectedTemplate(convertedTemplate);
    scrollToGenerator();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container">
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              {/* Logo removed as requested */}
            </div>
            
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              <a href="#generator" className="text-sm hover:text-primary transition-colors">
                {t("nav.generator")}
              </a>
              <a href="#popular" className="text-sm hover:text-primary transition-colors">
                {t("nav.popular")}
              </a>
              <a href="/worksheets" className="text-sm hover:text-primary transition-colors">
                {t("nav.worksheets")}
              </a>
              
              {/* Language Toggle Button */}
              <button
                onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                className="flex items-center gap-1 px-3 py-2 hover:bg-primary/10 rounded-lg transition-all duration-300 group border border-primary/20"
                aria-label="تبديل اللغة"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {language === "ar" ? "EN" : "عربي"}
                </span>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-primary/10 rounded-lg transition-all duration-300 group"
                aria-label="تبديل الوضع"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-primary group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <Moon className="w-5 h-5 text-primary group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>
            </div>
            
            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={language === "ar" ? "right" : "left"} className="w-[280px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    <a href="#generator" className="text-base hover:text-primary transition-colors py-2">
                      {t("nav.generator")}
                    </a>
                    <a href="#popular" className="text-base hover:text-primary transition-colors py-2">
                      {t("nav.popular")}
                    </a>
                    <a href="/worksheets" className="text-base hover:text-primary transition-colors py-2">
                      {t("nav.worksheets")}
                    </a>
                    <div className="border-t border-border my-2" />
                    <button
                      onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                      className="flex items-center gap-2 text-base hover:text-primary transition-colors py-2"
                    >
                      <Globe className="w-5 h-5" />
                      {language === "ar" ? "English" : "العربية"}
                    </button>
                    <button
                      onClick={toggleTheme}
                      className="flex items-center gap-2 text-base hover:text-primary transition-colors py-2"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="w-5 h-5" />
                          {language === "ar" ? "الوضع الفاتح" : "Light Mode"}
                        </>
                      ) : (
                        <>
                          <Moon className="w-5 h-5" />
                          {language === "ar" ? "الوضع الداكن" : "Dark Mode"}
                        </>
                      )}
                    </button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section - الشعار فقط */}
      <section className="relative py-8 md:py-12 overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <svg width="160" height="160" viewBox="0 0 400 400" className="md:w-[200px] md:h-[200px]">
                  <defs>
                    <linearGradient id="hex-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#1e40af' }}>
                        <animate attributeName="stop-color" values="#1e40af;#06b6d4;#3b82f6;#1e40af" dur="8s" repeatCount="indefinite"/>
                      </stop>
                      <stop offset="100%" style={{ stopColor: '#06b6d4' }}>
                        <animate attributeName="stop-color" values="#06b6d4;#3b82f6;#1e40af;#06b6d4" dur="8s" repeatCount="indefinite"/>
                      </stop>
                    </linearGradient>
                    <filter id="hex-blue-glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <g transform="translate(200, 200)">
                    <polygon points="0,-120 104,-60 104,60 0,120 -104,60 -104,-60" 
                             fill="none" stroke="url(#hex-blue-grad)" strokeWidth="4" filter="url(#hex-blue-glow)">
                      <animateTransform attributeName="transform" type="rotate" 
                                        from="0" to="360" dur="30s" repeatCount="indefinite"/>
                    </polygon>
                    <polygon points="0,-90 78,-45 78,45 0,90 -78,45 -78,-45" 
                             fill="rgba(30, 64, 175, 0.05)" stroke="url(#hex-blue-grad)" 
                             strokeWidth="3" filter="url(#hex-blue-glow)">
                      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite"/>
                      <animateTransform attributeName="transform" type="rotate" 
                                        from="360" to="0" dur="25s" repeatCount="indefinite"/>
                    </polygon>
                    <path d="M -30,-40 L -30,40 M -30,-40 L 10,-40 Q 30,-40 30,-20 Q 30,0 10,0 L -30,0 M 10,0 L 30,40" 
                          stroke="url(#hex-blue-grad)" strokeWidth="6" fill="none" strokeLinecap="round" filter="url(#hex-blue-glow)"/>
                    <text x="-15" y="-55" fontSize="28" fontWeight="bold" fill="url(#hex-blue-grad)" filter="url(#hex-blue-glow)">9</text>
                    <text x="40" y="0" fontSize="28" fontWeight="bold" fill="url(#hex-blue-grad)" filter="url(#hex-blue-glow)">6</text>
                    <text x="-15" y="65" fontSize="28" fontWeight="bold" fill="url(#hex-blue-grad)" filter="url(#hex-blue-glow)">6</text>
                    <circle cx="0" cy="-45" r="4" fill="#1e40af" filter="url(#hex-blue-glow)">
                      <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="35" cy="10" r="4" fill="#06b6d4" filter="url(#hex-blue-glow)">
                      <animate attributeName="r" values="4;6;4" dur="2.3s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="0" cy="55" r="4" fill="#3b82f6" filter="url(#hex-blue-glow)">
                      <animate attributeName="r" values="4;6;4" dur="1.8s" repeatCount="indefinite"/>
                    </circle>
                  </g>
                </svg>
              </div>
            </div>
            
            {/* Version badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-primary/30 text-sm">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{t("home.version")}</span>
              <span className="font-semibold text-primary">RaqimAI 966 – v1.0</span>
            </div>

            {/* Hero Content */}
            <div className="space-y-4 mt-6">
              {/* Main Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="text-primary">رقيم</span>{" "}
                <span className="neon-text">AI 966</span>
              </h1>

              {/* Subtitle */}
              <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-primary">
                {language === "ar"
                  ? "ولّد برومبتات احترافية للذكاء الاصطناعي، برومبتات ذكية لكل أدوات الـ AI"
                  : "Generate professional AI prompts, smart prompts for all AI tools"}
              </h2>

              {/* Description with AI Tool Logos */}
              <div className="space-y-4">
                <p className="text-base md:text-lg text-muted-foreground">
                  {language === "ar"
                    ? "صمم برومبتات احترافية لأدوات الذكاء الاصطناعي"
                    : "Design professional prompts for AI tools"}
                </p>

                {/* AI Tools Logos */}
                <div className="flex items-center justify-center gap-6 flex-wrap">
                  {/* ChatGPT */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/50 hover:border-primary/50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
                    </svg>
                    <span className="text-sm font-medium">ChatGPT</span>
                  </div>

                  {/* Gemini */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/50 hover:border-primary/50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M12 24C12 24 12 12 24 12C12 12 12 0 12 0C12 0 12 12 0 12C12 12 12 24 12 24Z" fill="url(#gemini-gradient)"/>
                      <defs>
                        <linearGradient id="gemini-gradient" x1="0" y1="12" x2="24" y2="12" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#4285F4"/>
                          <stop offset="0.5" stopColor="#9B72CB"/>
                          <stop offset="1" stopColor="#D96570"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="text-sm font-medium">Gemini</span>
                  </div>

                  {/* Claude */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/50 hover:border-primary/50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    <span className="text-sm font-medium">Claude</span>
                  </div>

                  {/* HUMAIN */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/50 hover:border-primary/50 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="6" width="4" height="12" fill="currentColor"/>
                      <rect x="8" y="6" width="4" height="12" fill="currentColor"/>
                      <rect x="2" y="10" width="10" height="4" fill="currentColor"/>
                    </svg>
                    <span className="text-sm font-medium">HUMAIN</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Generator Section - مباشرة بعد الشعار */}
      <section id="generator" className="py-8 bg-card/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <PromptGenerator
              initialPrompt={selectedTemplate?.basePrompt}
              initialUsageType={selectedTemplate?.usageType}
              initialOptions={selectedTemplate?.options}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "ar" ? "✨ لماذا رقيم AI 966؟" : "✨ Why RaqimAI 966?"}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {language === "ar"
                ? "نقدم لك أدوات احترافية لتحسين تجربتك مع الذكاء الاصطناعي"
                : "We provide professional tools to enhance your AI experience"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {language === "ar" ? "توليد فوري" : "Instant Generation"}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {language === "ar"
                  ? "احصل على برومبتات محسّنة في ثوانٍ معدودة بفضل تقنيات الذكاء الاصطناعي المتطورة"
                  : "Get enhanced prompts in seconds with advanced AI technology"}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {language === "ar" ? "تخصيص شامل" : "Full Customization"}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {language === "ar"
                  ? "خيارات متعددة للتحكم في اللهجة، الأمثلة، والتعقيد حسب احتياجاتك"
                  : "Multiple options to control tone, examples, and complexity"}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {language === "ar" ? "متوافق مع كل الأدوات" : "Universal Compatibility"}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {language === "ar"
                  ? "يعمل مع ChatGPT، Gemini، Claude، وجميع أدوات الذكاء الاصطناعي الأخرى"
                  : "Works with ChatGPT, Gemini, Claude, and all AI tools"}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Save className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {language === "ar" ? "حفظ ومشاركة" : "Save & Share"}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {language === "ar"
                  ? "احفظ برومبتاتك المفضلة وشاركها مع الآخرين بكل سهولة"
                  : "Save your favorite prompts and share them easily"}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {language === "ar" ? "نتائج أفضل" : "Better Results"}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {language === "ar"
                  ? "احصل على إجابات أكثر دقة وشمولية من أدوات الذكاء الاصطناعي"
                  : "Get more accurate and comprehensive AI responses"}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Moon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {language === "ar" ? "تجربة مريحة" : "Comfortable Experience"}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {language === "ar"
                  ? "واجهة نظيفة مع دعم الوضع الداكن والفاتح والتصميم المتجاوب"
                  : "Clean interface with dark/light modes and responsive design"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Prompts Section */}
      <section id="popular" className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold">{t("home.topRated")}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "ar" && "🔥 "}{t("home.popularTitle")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("home.popularSubtitle")}
            </p>
          </div>
          
          <PopularPrompts onUsePrompt={(prompt) => {
            setGeneratorKey(prev => prev + 1);
            setTimeout(() => {
              const textarea = document.querySelector('textarea[placeholder*="اكتب"]') as HTMLTextAreaElement;
              if (textarea) {
                textarea.value = prompt;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }, 100);
          }} />
        </div>
      </section>

      {/* Specialized Templates Section */}
      <section id="specialized-templates" className="py-16 bg-muted/30">
        <div className="container max-w-6xl">
          <SpecializedTemplates onSelectTemplate={handleSpecializedTemplateSelect} />
        </div>
      </section>

      {/* Before After Section */}
      <BeforeAfter />

      {/* FAQ Section */}
      <section id="faq" className="py-16">
        <div className="container max-w-4xl">
          <FAQ />
        </div>
      </section>

      {/* Live Stats Section */}
      <LiveStats />

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-16 bg-muted/20">
        <div className="container">
          <div className="text-center space-y-6">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2">
              <img src="/logo.svg" alt={t("home.heroTitle")} className="w-8 h-8" />
              <span className="font-bold text-primary">{t("home.heroTitle")}</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10"
                onClick={() => window.open('https://t.me/dr_basl', '_blank')}
              >
                <Send className="w-4 h-4" />
                {t("home.telegram")}
              </Button>
              <Button
                variant="default"
                size="sm"
                className="gap-2"
                onClick={() => window.open('https://x.com/hzbr_al?s=21', '_blank')}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                {t("home.twitter")}
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>{t("home.footerCopyright")}</p>
              <p className="mt-1 text-xs text-primary/70">RaqimAI 966 – v1.0</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
