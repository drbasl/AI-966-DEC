import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Sparkles,
  GraduationCap,
  Briefcase,
  Code,
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
      path: "/workspace",
      icon: Briefcase
    },
    {
      name: "مركز المطورين",
      nameEn: "Developers Hub",
      path: "/developers-hub",
      icon: Code
    }
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  return (
    <header className="border-b border-border/50 backdrop-blur-md sticky top-0 z-50 bg-background/95 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  رقيم AI 966
                </h1>
                <p className="text-xs text-muted-foreground">
                  منصة الذكاء الاصطناعي
                </p>
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link key={item.path} href={item.path}>
                  <a
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      text-sm font-medium transition-all duration-200
                      ${active
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'hover:bg-accent hover:text-accent-foreground'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{language === "ar" ? item.name : item.nameEn}</span>
                  </a>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="hidden sm:flex"
            >
              <Globe className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold">رقيم AI 966</h2>
                      <p className="text-xs text-muted-foreground">
                        منصة الذكاء الاصطناعي
                      </p>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <Link key={item.path} href={item.path}>
                        <a
                          onClick={() => setMobileOpen(false)}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg
                            transition-all duration-200
                            ${active
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'hover:bg-accent'
                            }
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">
                            {language === "ar" ? item.name : item.nameEn}
                          </span>
                        </a>
                      </Link>
                    );
                  })}

                  {/* Mobile Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      {language === "ar" ? "English" : "عربي"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={toggleTheme}
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
          </div>
        </nav>
      </div>
    </header>
  );
}
