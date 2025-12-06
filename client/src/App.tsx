import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import OnboardingTour from "./components/OnboardingTour";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import Analyzer from "./pages/Analyzer";
import MyLibrary from "./pages/MyLibrary";
import Profile from "./pages/Profile";
import History from "./pages/History";
import SharedPrompt from "./pages/SharedPrompt";
import Worksheets from "./pages/Worksheets";
import Workspace from "./pages/Workspace";
import AIChat from "./pages/AIChat";
import CreativeStudio from "./pages/CreativeStudio";
import TeachersZone from "./pages/TeachersZone";
import DevelopersHub from "./pages/DevelopersHub";
import MainNav from "./components/MainNav";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <>
      <MainNav />
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/library" component={Library} />
      <Route path="/analyzer" component={Analyzer} />
      <Route path={"/my-library"} component={MyLibrary} />
      <Route path="/profile" component={Profile} />
      <Route path="/history" component={History} />
      <Route path="/share/:token" component={SharedPrompt} />
      <Route path="/worksheets" component={Worksheets} />
      <Route path="/workspace" component={Workspace} />
      <Route path="/ai-chat" component={AIChat} />
      <Route path="/creative-studio" component={CreativeStudio} />
      <Route path="/teachers-zone" component={TeachersZone} />
      <Route path="/developers-hub" component={DevelopersHub} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
      </Switch>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  // Theme toggle logic
  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    if (isDark) {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
    localStorage.setItem("theme", isDark ? "light" : "dark");
  };

  // Load theme from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider
          defaultTheme="light"
          switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
            <OnboardingTour />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
