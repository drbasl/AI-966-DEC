import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import {
  Calendar,
  Copy,
  Download,
  FileText,
  Heart,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import { useState } from "react";
import { toast } from "sonner";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { data: prompts, isLoading, refetch } = trpc.savedPrompts.list.useQuery();
  const deleteMutation = trpc.savedPrompts.delete.useMutation();
  const toggleFavoriteMutation = trpc.savedPrompts.toggleFavorite.useMutation();
  const exportMutation = trpc.savedPrompts.exportPrompts.useQuery(
    { format: "json" },
    { enabled: false }
  );

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا البرومبت؟")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("تم حذف البرومبت بنجاح");
      refetch();
    } catch (error) {
      toast.error("فشل حذف البرومبت");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("تم نسخ البرومبت");
  };

  const handleExport = async (format: "json" | "txt") => {
    try {
      const { data } = await trpc.savedPrompts.exportPrompts.useQuery({ format });
      if (!data) return;

      const blob = new Blob([data.data], {
        type: format === "json" ? "application/json" : "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prompts.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("تم تصدير البرومبتات");
    } catch (error) {
      toast.error("فشل تصدير البرومبتات");
    }
  };

  const handleToggleFavorite = async (id: number) => {
    try {
      await toggleFavoriteMutation.mutateAsync({ id });
      refetch();
    } catch (error) {
      toast.error("فشل تحديث المفضلة");
    }
  };

  const filteredPrompts = prompts?.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.enhancedPrompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all" || prompt.usageType === filterType;
    const matchesFavorite = !showFavoritesOnly || prompt.isFavorite === 1;
    return matchesSearch && matchesType && matchesFavorite;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">مكتبة البرومبتات</h1>
            <p className="text-muted-foreground mt-1">
              جميع البرومبتات المحفوظة لديك
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("json")}
            >
              <Download className="w-4 h-4 ml-2" />
              تصدير JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("txt")}
            >
              <Download className="w-4 h-4 ml-2" />
              تصدير TXT
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث في البرومبتات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="تصفية حسب النوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              <SelectItem value="social">سوشيال ميديا</SelectItem>
              <SelectItem value="code">كود برمجي</SelectItem>
              <SelectItem value="education">تعليمي</SelectItem>
              <SelectItem value="crypto">كريبتو</SelectItem>
              <SelectItem value="article">مقال</SelectItem>
              <SelectItem value="exam">امتحان</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="gap-2"
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? "fill-current" : ""}`} />
            المفضلة فقط
          </Button>
        </div>

        {/* Prompts Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">جاري التحميل...</p>
          </div>
        ) : filteredPrompts && filteredPrompts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">
                          {prompt.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {prompt.usageType}
                          </span>
                        </div>
                      </div>
                      <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                    </div>

                    {/* Content Preview */}
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {prompt.enhancedPrompt}
                    </p>

                    {/* Tags */}
                    {prompt.tags && (() => {
                      try {
                        const parsedTags = JSON.parse(prompt.tags);
                        if (Array.isArray(parsedTags) && parsedTags.length > 0) {
                          return (
                            <div className="flex flex-wrap gap-1">
                              {parsedTags.map((tag: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
                                >
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          );
                        }
                      } catch {
                        return null;
                      }
                      return null;
                    })()}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(prompt.createdAt).toLocaleDateString(
                            "ar-SA"
                          )}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFavorite(prompt.id)}
                          disabled={toggleFavoriteMutation.isPending}
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              prompt.isFavorite === 1
                                ? "fill-red-500 text-red-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(prompt.enhancedPrompt)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <ShareButtons
                          promptId={prompt.id}
                          promptTitle={prompt.title}
                          promptText={prompt.enhancedPrompt}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(prompt.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">لا توجد برومبتات</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterType !== "all"
                  ? "لم يتم العثور على نتائج مطابقة"
                  : "ابدأ بإنشاء برومبت جديد من الصفحة الرئيسية"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
