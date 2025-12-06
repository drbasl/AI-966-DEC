import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Sparkles,
  GraduationCap,
  MessageSquare,
  Menu,
  Moon,
  Sun,
  Globe
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export default function MainNav() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      name: "الرئيسية",
      nameEn: "Home",
      path: "/",
      icon: Home
    },
    {
      name: "استوديو الإبداع",
      nameEn: "Creative Studio",
      path: "/creative-studio",
      icon: Sparkles
    },
    {
      name: "منطقة المعلمين",
      nameEn: "Teachers Zone",
      path: "/teachers-zone",
      icon: GraduationCap
    },
    {
      name: "ChatRaqim",
      nameEn: "ChatRaqim",
      path: "/ai-chat",
      icon: MessageSquare
    }
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/10 bg-background/95">
      <div className="container mx-auto px-3 md:px-4 lg:px-6">
        <nav className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group flex-shrink-0 hover:opacity-80 transition-opacity">
            <div className="font-[Outfit] font-black text-base md:text-lg lg:text-xl tracking-wider">
              RAQIM
            </div>
            <span className={`text-[0.55rem] md:text-[0.6rem] font-medium px-1.5 md:px-2 py-0.5 rounded-full border transition-all whitespace-nowrap
              ${theme === 'dark'
                ? 'bg-gradient-to-br from-[#E87A52]/10 to-[#FFB088]/10 border-[#2A2D35] text-[#9B9C9E]'
                : 'bg-gradient-to-br from-[#00C6FF]/10 to-[#0072FF]/10 border-[#E5E7EB] text-[#4B5563]'}`}>
              AI HYBRID
            </span>
          </Link>

          {/* Desktop Navigation - All in one row */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-nowrap">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${active
                      ? theme === 'dark'
                        ? 'bg-[#E87A52]/10 text-[#E87A52] border border-[#E87A52]/20'
                        : 'bg-[#0B57D0]/10 text-[#0B57D0] border border-[#0B57D0]/20'
                      : 'hover:bg-foreground/5'
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                  <span className="hidden lg:inline">{language === "ar" ? item.name : item.nameEn}</span>
                </Link>
              );
            })}

            <div className="h-4 w-px bg-border/20 mx-1"></div>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="flex items-center gap-1 px-2 lg:px-2.5 py-1.5 rounded-full hover:bg-foreground/5 transition-all text-xs lg:text-sm font-medium whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden lg:inline">{language === "ar" ? "EN" : "ع"}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center border transition-all shadow-sm flex-shrink-0
                ${theme === 'dark'
                  ? 'bg-[#181A20] border-[#2A2D35] hover:border-[#E87A52]'
                  : 'bg-white border-[#E5E7EB] hover:border-[#0B57D0]'}`}
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              ) : (
                <Moon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={language === "ar" ? "right" : "left"} className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                {/* Logo in Mobile */}
                <div className="flex items-center gap-2 pb-4 border-b">
                  <div className="font-[Outfit] font-black text-xl tracking-wider">
                    RAQIM
                  </div>
                  <span className={`text-[0.6rem] font-medium px-2 py-0.5 rounded-full border
                    ${theme === 'dark'
                      ? 'bg-gradient-to-br from-[#E87A52]/10 to-[#FFB088]/10 border-[#2A2D35] text-[#9B9C9E]'
                      : 'bg-gradient-to-br from-[#00C6FF]/10 to-[#0072FF]/10 border-[#E5E7EB] text-[#4B5563]'}`}>
                    AI HYBRID
                  </span>
                </div>

                {/* Mobile Navigation Links */}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                        ${active
                          ? theme === 'dark'
                            ? 'bg-[#E87A52]/10 text-[#E87A52] border border-[#E87A52]/20'
                            : 'bg-[#0B57D0]/10 text-[#0B57D0] border border-[#0B57D0]/20'
                          : 'hover:bg-foreground/5'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">
                        {language === "ar" ? item.name : item.nameEn}
                      </span>
                    </Link>
                  );
                })}

                {/* Mobile Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setLanguage(language === "ar" ? "en" : "ar");
                      setMobileOpen(false);
                    }}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {language === "ar" ? "English" : "عربي"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      toggleTheme();
                      setMobileOpen(false);
                    }}
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-4 w-4 mr-2" />
                        فاتح
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 mr-2" />
                        داكن
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
