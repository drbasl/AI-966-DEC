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
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } =
    trpc.dashboard.stats.useQuery();
  const { data: recentPrompts, isLoading: promptsLoading } =
    trpc.dashboard.recentPrompts.useQuery({ limit: 5 });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">لوحة التحكم</h1>
            <p className="text-muted-foreground mt-1">
              مرحباً بك في لوحة التحكم الخاصة بك
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/">
              <Plus className="w-5 h-5 ml-2" />
              إنشاء برومبت جديد
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي البرومبتات
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalPrompts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                جميع البرومبتات المحفوظة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المفضلة</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.favoritePrompts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                البرومبتات المفضلة لديك
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التصنيفات</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalCategories || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                عدد التصنيفات المستخدمة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">هذا الشهر</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.thisMonthPrompts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                برومبتات جديدة هذا الشهر
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المشاركات</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalShares || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                مرة مشاركة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button asChild variant="outline" className="h-auto py-4">
                <Link href="/">
                  <div className="flex flex-col items-center gap-2">
                    <Plus className="w-6 h-6" />
                    <span>إنشاء برومبت جديد</span>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4">
                <Link href="/library">
                  <div className="flex flex-col items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    <span>تصفح المكتبة</span>
                  </div>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4">
                <Link href="/analyzer">
                  <div className="flex flex-col items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    <span>تحليل برومبت</span>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>النشاط الأخير</CardTitle>
          </CardHeader>
          <CardContent>
            {promptsLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                جاري التحميل...
              </div>
            ) : recentPrompts && recentPrompts.length > 0 ? (
              <div className="space-y-4">
                {recentPrompts.map((prompt: any) => (
                  <div
                    key={prompt.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{prompt.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {prompt.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {prompt.category && (
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {prompt.category}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(prompt.createdAt).toLocaleDateString(
                            "ar-SA"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد برومبتات محفوظة بعد
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
