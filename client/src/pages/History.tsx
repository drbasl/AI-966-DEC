import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import {
  BookMarked,
  Clock,
  Heart,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function History() {
  const [filterAction, setFilterAction] = useState<string>("all");
  const { data: activities, isLoading } = trpc.activity.list.useQuery();

  const getActionIcon = (action: string) => {
    switch (action) {
      case "generate":
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      case "save":
        return <BookMarked className="w-4 h-4 text-green-500" />;
      case "favorite":
        return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
      case "unfavorite":
        return <Heart className="w-4 h-4 text-gray-500" />;
      case "delete":
        return <Trash2 className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case "generate":
        return "توليد برومبت";
      case "save":
        return "حفظ برومبت";
      case "favorite":
        return "إضافة للمفضلة";
      case "unfavorite":
        return "إزالة من المفضلة";
      case "delete":
        return "حذف برومبت";
      case "update":
        return "تحديث برومبت";
      default:
        return action;
    }
  };

  const filteredActivities = activities?.filter((activity) => {
    if (filterAction === "all") return true;
    return activity.action === filterAction;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">تاريخ النشاط</h1>
            <p className="text-muted-foreground mt-2">
              سجل كامل بجميع أنشطتك على المنصة
            </p>
          </div>

          {/* Filter */}
          <Select value={filterAction} onValueChange={setFilterAction}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="تصفية حسب النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنشطة</SelectItem>
              <SelectItem value="generate">توليد</SelectItem>
              <SelectItem value="save">حفظ</SelectItem>
              <SelectItem value="favorite">مفضلة</SelectItem>
              <SelectItem value="delete">حذف</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity Timeline */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">جاري التحميل...</p>
          </div>
        ) : filteredActivities && filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              let details = null;
              try {
                if (activity.details) {
                  details = JSON.parse(activity.details);
                }
              } catch {}

              return (
                <Card key={activity.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        {getActionIcon(activity.action)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium">
                              {getActionText(activity.action)}
                            </p>
                            {details?.title && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {details.title}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(activity.createdAt).toLocaleString("ar-SA", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">لا يوجد نشاط</h3>
              <p className="text-muted-foreground">
                {filterAction !== "all"
                  ? "لم يتم العثور على أنشطة مطابقة"
                  : "ابدأ باستخدام المنصة لرؤية نشاطك هنا"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
