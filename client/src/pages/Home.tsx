import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, ArrowUpRight } from "lucide-react";
import PromptGenerator from "@/components/PromptGenerator";
import PopularPrompts from "@/components/PopularPrompts";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

// --- Custom Animations & Styles Component ---
const GlobalStyles = () => (
  <style>{`
    @keyframes orbit-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes breathe {
      0% { opacity: 0.5; transform: scale(1); }
      100% { opacity: 1; transform: scale(1.05); }
    }
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.25; transform: scale(1); }
      50% { opacity: 0.45; transform: scale(1.1); }
    }
    .hero-text-gradient {
      background: linear-gradient(135deg, #00C6FF 0%, #0072FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .dark .hero-text-gradient {
      background: linear-gradient(135deg, #E87A52 0%, #FFB088 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `}</style>
);

// --- Hexagon Logo Component ---
const HexagonLogo = () => {
  const { theme } = useTheme();
  // تحديد الألوان بناءً على الثيم
  const colors = theme === 'dark'
    ? { primary: '#E87A52', secondary: '#F09268', tertiary: '#FFB088', border: '#2A2D35', text: '#EDEDED' }
    : { primary: '#0B57D0', secondary: '#4285F4', tertiary: '#00C6FF', border: '#E5E7EB', text: '#111827' };

  return (
    <div className="relative w-[180px] h-[180px] mb-4">
      {/* Background Glow */}
      <div className="absolute inset-[-30px] rounded-full blur-[50px] opacity-30 animate-[pulse-glow_5s_ease-in-out_infinite]"
           style={{ background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.tertiary} 100%)` }} />

      <svg width="100%" height="100%" viewBox="0 0 200 200" className="relative z-10">
        <defs>
          <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="50%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor={colors.tertiary} stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer Hexagon */}
        <polygon points="100,17 171.7,58.5 171.7,141.5 100,183 28.3,141.5 28.3,58.5"
                 fill="none"
                 stroke={colors.border}
                 strokeWidth="1.5"
                 strokeDasharray="8 5"
                 opacity="0.5"/>

        {/* Rotating Dots */}
        <g style={{ animation: 'orbit-slow 20s linear infinite', transformOrigin: '100px 100px' }}>
             <circle cx="100" cy="35" r="3.5" fill={colors.secondary} opacity="0.7"/>
             <circle cx="155.6" cy="132.5" r="3" fill={colors.tertiary} opacity="0.6"/>
             <circle cx="44.4" cy="132.5" r="3.5" fill={colors.primary} opacity="0.7"/>
        </g>

        {/* Inner Hexagon */}
        <polygon points="100,31 160.2,66 160.2,134 100,169 39.8,134 39.8,66"
                 fill="none"
                 stroke={colors.border}
                 strokeWidth="1"
                 opacity="0.3"/>

        {/* Text */}
        <text x="100" y="108" fontFamily="'Outfit', sans-serif" textAnchor="middle" fill={colors.text} style={{ transition: 'fill 0.3s' }}>
            <tspan fontWeight="900" fontSize="34">RAQIM</tspan>
            <tspan fontWeight="600" fontSize="34" dx="4" opacity="0.7">AI</tspan>
        </text>

        {/* Sparkles */}
        <g style={{ animation: 'orbit-slow 15s linear infinite', transformOrigin: '100px 100px', opacity: 0.6 }}>
            <circle cx="57" cy="43" r="2" fill={colors.tertiary}>
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="143" cy="157" r="2" fill={colors.secondary}>
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite"/>
            </circle>
        </g>
      </svg>
    </div>
  );
};

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
    complexity: "بسيط" | "متوسط" | "متقدم";
    engaging: boolean;
  };
};

export default function Home() {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [selectedTemplate] = useState<Template | null>(null);

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden font-sans
      ${theme === 'dark' ? 'bg-[#0F1115] text-[#EDEDED]' : 'bg-[#F0F4F9] text-[#111827]'}`}>

      <GlobalStyles />

      {/* Ambient Background for Dark Mode */}
      {theme === 'dark' && (
        <div className="fixed inset-0 pointer-events-none z-0"
             style={{
               background: `
                 radial-gradient(circle at 15% 15%, rgba(232, 122, 82, 0.08), transparent 40%),
                 radial-gradient(circle at 85% 85%, rgba(11, 87, 208, 0.06), transparent 40%)
               `,
               filter: 'blur(80px)',
               animation: 'breathe 10s ease-in-out infinite alternate'
             }}
        />
      )}

      {/* Main Content */}
      <main className="relative z-10">

        {/* Hero Section */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 flex flex-col items-center text-center px-4">
          <HexagonLogo />

          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 font-cairo">
            {language === 'ar' ? 'أهلاً، أنا' : 'Hello, I am'} <span className="hero-text-gradient font-[Outfit]">RAQIM AI</span>
          </h1>

          <p className="max-w-2xl text-base md:text-lg opacity-80 leading-relaxed mb-6 font-cairo font-light">
            {language === 'ar'
              ? 'واجهة ذكاء اصطناعي هجينة تجمع نقاء تجربة Gemini في النهار، ودفء هوية راقم في الليل؛ تصميم نظيف، مساحات هادئة، وتركيز على ما يهم: سؤالك فقط.'
              : 'A hybrid AI interface combining the purity of Gemini by day and the warmth of Raqim identity by night; clean design, quiet spaces, focused on what matters: your question.'}
          </p>

          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border mb-8
            ${theme === 'dark'
              ? 'bg-gradient-to-r from-[#E87A52]/10 to-[#FFB088]/10 border-[#2A2D35] text-[#9B9C9E]'
              : 'bg-gradient-to-r from-[#00C6FF]/10 to-[#0072FF]/10 border-[#E5E7EB] text-[#4B5563]'}`}>
            <Sparkles className="w-3 h-3" />
            <span>{t("home.version")} v1.0</span>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              className={`rounded-full h-12 px-8 text-base font-bold shadow-lg transition-all hover:-translate-y-1
                ${theme === 'dark'
                  ? 'bg-gradient-to-r from-[#E87A52] to-[#FFB088] text-white hover:shadow-[0_10px_30px_rgba(232,122,82,0.3)]'
                  : 'bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white hover:shadow-[0_10px_30px_rgba(11,87,208,0.25)]'}`}
              onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {language === 'ar' ? 'ابدأ جلسة جديدة' : 'Start New Session'}
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              className={`rounded-full h-12 px-8 text-base font-semibold border transition-all hover:bg-transparent
                ${theme === 'dark'
                  ? 'border-[#2A2D35] text-[#9B9C9E] hover:border-[#E87A52] hover:text-[#E87A52]'
                  : 'border-[#E5E7EB] text-[#4B5563] hover:border-[#0B57D0] hover:text-[#0B57D0]'}`}
            >
              {language === 'ar' ? 'شاهد القدرات' : 'Watch Demo'}
              <div className="w-2 h-2 rounded-full bg-current ml-2 animate-pulse" />
            </Button>
          </div>
        </section>

        {/* Generator Section (Replaces Input Engine visually) */}
        <section id="generator" className="container pb-20">
          <div className="max-w-4xl mx-auto">
             <PromptGenerator
               initialPrompt={selectedTemplate?.basePrompt}
               initialUsageType={selectedTemplate?.usageType}
               initialOptions={selectedTemplate?.options}
             />
          </div>
        </section>

        {/* Popular Prompts */}
        <section id="popular" className={`py-16 ${theme === 'dark' ? 'bg-[#181A20]/50' : 'bg-[#FFFFFF]/50'}`}>
          <div className="container">
            <PopularPrompts onUsePrompt={() => {
              const element = document.getElementById('generator');
              element?.scrollIntoView({ behavior: 'smooth' });
            }} />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border/10 py-8 text-center text-sm opacity-60">
        <div className="container flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <a href="https://t.me/dr_basl" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors"><Send className="w-4 h-4" /></a>
            <a href="https://x.com/hzbr_al?s=21" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Twitter</a>
          </div>
          <p>© 2025 RAQIM AI. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
