import { Card } from "@/components/ui/card";
import { Flame, Zap, Users, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function LiveStats() {
  // Simulated live counters
  const [promptsToday, setPromptsToday] = useState(1234);
  const [activeUsers, setActiveUsers] = useState(47);
  const [totalPrompts, setTotalPrompts] = useState(15678);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Random increment for prompts today (0-3)
      setPromptsToday(prev => prev + Math.floor(Math.random() * 4));
      
      // Random change for active users (-2 to +3)
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 6) - 2;
        const newValue = prev + change;
        return Math.max(35, Math.min(65, newValue)); // Keep between 35-65
      });
      
      // Increment total prompts
      setTotalPrompts(prev => prev + Math.floor(Math.random() * 2));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: <Flame className="w-8 h-8 text-orange-500" />,
      label: "تم توليد اليوم",
      value: promptsToday.toLocaleString('ar-SA'),
      suffix: "برومبت",
      color: "from-orange-500/20 to-red-500/20",
      pulse: true
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      label: "مستخدم نشط الآن",
      value: activeUsers.toLocaleString('ar-SA'),
      suffix: "مستخدم",
      color: "from-yellow-500/20 to-orange-500/20",
      pulse: true
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      label: "إجمالي البرومبتات",
      value: totalPrompts.toLocaleString('ar-SA'),
      suffix: "+",
      color: "from-green-500/20 to-emerald-500/20",
      pulse: false
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      label: "مستخدم مسجل",
      value: "2,500",
      suffix: "+",
      color: "from-blue-500/20 to-cyan-500/20",
      pulse: false
    }
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              <span className="neon-text">🔥 رقيم AI في الوقت الفعلي</span>
            </h2>
            <p className="text-muted-foreground">
              شاهد نشاط المستخدمين والبرومبتات المولدة الآن
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className={`p-6 bg-gradient-to-br ${stat.color} border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 relative overflow-hidden`}
              >
                {/* Pulse Animation for Live Stats */}
                {stat.pulse && (
                  <div className="absolute top-2 left-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>

                {/* Value */}
                <div className="text-center mb-2">
                  <div className="text-3xl md:text-4xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-semibold">
                    {stat.suffix}
                  </div>
                </div>

                {/* Label */}
                <div className="text-center text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>

          {/* Live Indicator */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-primary/30 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm text-muted-foreground">
                البيانات محدثة في الوقت الفعلي
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
