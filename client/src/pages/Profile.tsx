import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  BookMarked,
  Calendar,
  Heart,
  Mail,
  Sparkles,
  Star,
  TrendingUp,
  User,
} from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { data: stats } = trpc.dashboard.stats.useQuery();

  if (!user) {
    return null;
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">الملف الشخصي</h1>
          <p className="text-muted-foreground mt-2">
            معلوماتك الشخصية وإحصائيات استخدامك
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* User Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>المعلومات الشخصية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>الاسم</span>
                  </div>
                  <p className="font-medium">{user.name || "غير محدد"}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>البريد الإلكتروني</span>
                  </div>
                  <p className="font-medium text-sm break-all">
                    {user.email || "غير محدد"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>تاريخ الانضمام</span>
                  </div>
                  <p className="font-medium text-sm">{joinDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
            {/* Total Prompts */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <BookMarked className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">إجمالي البرومبتات</p>
                    <p className="text-2xl font-bold">{stats?.totalPrompts || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Favorites */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المفضلة</p>
                    <p className="text-2xl font-bold">{stats?.favoritePrompts || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* This Month */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">هذا الشهر</p>
                    <p className="text-2xl font-bold">{stats?.thisMonthPrompts || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Star className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">التصنيفات</p>
                    <p className="text-2xl font-bold">{stats?.totalCategories || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              ملخص النشاط
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">متوسط البرومبتات</p>
                <p className="text-xl font-bold">
                  {stats?.totalPrompts
                    ? (stats.totalPrompts / 30).toFixed(1)
                    : "0"}
                  <span className="text-sm text-muted-foreground mr-1">/ يوم</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">معدل المفضلة</p>
                <p className="text-xl font-bold">
                  {stats?.totalPrompts && stats?.favoritePrompts
                    ? ((stats.favoritePrompts / stats.totalPrompts) * 100).toFixed(0)
                    : "0"}
                  <span className="text-sm text-muted-foreground mr-1">%</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">الأكثر استخداماً</p>
                <p className="text-sm font-medium">سوشيال ميديا</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">آخر نشاط</p>
                <p className="text-sm font-medium">اليوم</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
