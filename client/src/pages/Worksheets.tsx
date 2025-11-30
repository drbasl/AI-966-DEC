import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Link } from "wouter";
import WorksheetGenerator from "@/components/WorksheetGenerator";
import { APP_LOGO } from "@/const";

export default function Worksheets() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container">
          <nav className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={APP_LOGO} alt="رقيم AI 966" className="w-10 h-10" />
              <span className="font-bold text-lg">رقيم AI 966</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  العودة للرئيسية
                </Button>
              </Link>
              
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
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold neon-text">
            ✨ مولد أوراق العمل التعليمية
          </h1>
          <p className="text-muted-foreground text-lg">
            أنشئ أوراق عمل تعليمية مخصصة بسهولة باستخدام الذكاء الاصطناعي
          </p>
        </div>

        <WorksheetGenerator />
      </div>
    </div>
  );
}
