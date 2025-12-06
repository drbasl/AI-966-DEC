import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  BookOpen,
  Clock,
  Heart,
  Plus,
  Share2,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.stats.useQuery();
  const { data: recentPrompts, isLoading: promptsLoading } = trpc.dashboard.recentPrompts.useQuery({ limit: 5 });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">لوحة التحكم</h1>
            <p className="text-muted-foreground text-sm mt-1">
              مرحباً بك في لوحة التحكم
            </p>
          </div>
          <Button asChild>
            <Link href="/">
              <Plus className="w-4 h-4 ml-2" />
              إنشاء برومبت
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">البرومبتات</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalPrompts || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">المفضلة</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.favoritePrompts || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">هذا الشهر</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.thisMonthPrompts || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">المشاركات</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalShares || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Button asChild variant="outline" className="h-auto py-3">
                <Link href="/">
                  <div className="flex flex-col items-center gap-1.5">
                    <Plus className="w-5 h-5" />
                    <span className="text-sm">إنشاء برومبت</span>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-3">
                <Link href="/library">
                  <div className="flex flex-col items-center gap-1.5">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-sm">المكتبة</span>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-3">
                <Link href="/analyzer">
                  <div className="flex flex-col items-center gap-1.5">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm">التحليل</span>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">النشاط الأخير</CardTitle>
          </CardHeader>
          <CardContent>
            {promptsLoading ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                جاري التحميل...
              </div>
            ) : recentPrompts && recentPrompts.length > 0 ? (
              <div className="space-y-3">
                {recentPrompts.map((prompt: any) => (
                  <div
                    key={prompt.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{prompt.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {prompt.content}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {prompt.category && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {prompt.category}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(prompt.createdAt).toLocaleDateString("ar-SA")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                لا توجد برومبتات محفوظة
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
