import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight, Sparkles, FileText, BookOpen, CheckCircle, Copy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

interface TourStep {
  id: string;
  titleKey: string;
  contentKey: string;
  icon: React.ReactNode;
  target?: string;
  action?: "scroll" | "navigate";
  navigateTo?: string;
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    titleKey: "tour.welcome.title",
    contentKey: "tour.welcome.content",
    icon: <Sparkles className="w-8 h-8 text-primary" />,
  },
  {
    id: "generator",
    titleKey: "tour.generator.title",
    contentKey: "tour.generator.content",
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    target: "#generator",
    action: "scroll",
  },
  {
    id: "generate-button",
    titleKey: "tour.generateButton.title",
    contentKey: "tour.generateButton.content",
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    target: "#generator",
    action: "scroll",
  },
  {
    id: "copy-export",
    titleKey: "tour.copyExport.title",
    contentKey: "tour.copyExport.content",
    icon: <Copy className="w-8 h-8 text-primary" />,
    target: "#generator",
    action: "scroll",
  },
  {
    id: "worksheets",
    titleKey: "tour.worksheets.title",
    contentKey: "tour.worksheets.content",
    icon: <FileText className="w-8 h-8 text-primary" />,
    action: "navigate",
    navigateTo: "/worksheets",
  },
  {
    id: "templates",
    titleKey: "tour.templates.title",
    contentKey: "tour.templates.content",
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    target: "#templates",
    action: "scroll",
  },
  {
    id: "finish",
    titleKey: "tour.finish.title",
    contentKey: "tour.finish.content",
    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
    action: "navigate",
    navigateTo: "/",
  },
];

interface OnboardingTourProps {
  onComplete?: () => void;
}

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      // Show tour after a short delay
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Navigate or scroll when step changes
  useEffect(() => {
    if (!isOpen) return;

    const step = tourSteps[currentStep];

    if (step.action === "navigate" && step.navigateTo) {
      setLocation(step.navigateTo);
      // Wait for navigation then scroll to top
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else if (step.action === "scroll" && step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentStep, isOpen, setLocation]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("hasSeenTour", "true");
    setIsOpen(false);
    setLocation("/");
    onComplete?.();
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenTour", "true");
    setIsOpen(false);
    setLocation("/");
  };

  const startTour = () => {
    setCurrentStep(0);
    setLocation("/");
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={startTour}
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50 gap-2 shadow-lg border-primary/30 hover:bg-primary/10"
      >
        <Sparkles className="w-4 h-4" />
        {t("home.startTour")}
      </Button>
    );
  }

  const step = tourSteps[currentStep];
  const isRtl = language === "ar";

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-50 animate-in fade-in duration-300" />

      {/* Tour Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 bg-card border-primary/30 shadow-2xl animate-in zoom-in-95 duration-300">
          {/* Close Button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Step Indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">{step.icon}</div>
            <h3 className="text-xl font-bold">{t(step.titleKey)}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {t(step.contentKey)}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="gap-2"
            >
              {isRtl ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
              {t("common.prev")}
            </Button>

            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              {t("common.skip")}
            </Button>

            <Button onClick={handleNext} className="gap-2">
              {currentStep === tourSteps.length - 1 ? (
                t("common.finish")
              ) : (
                <>
                  {t("common.next")}
                  {isRtl ? (
                    <ChevronLeft className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
