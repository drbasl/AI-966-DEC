import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { BookMarked, Calendar, Copy, Eye, Share2 } from "lucide-react";
import { useEffect } from "react";
import { useRoute } from "wouter";
import { toast } from "sonner";

export default function SharedPrompt() {
  const [, params] = useRoute("/share/:token");
  const token = params?.token || "";
  
  const { user } = useAuth();
  const { data: prompt, isLoading, error } = trpc.share.getByToken.useQuery(
    { token },
    { enabled: !!token }
  );

  const savePromptMutation = trpc.savedPrompts.create.useMutation();

  useEffect(() => {
    if (prompt) {
      document.title = `${prompt.title} - ${APP_TITLE}`;
    }
  }, [prompt]);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt.enhancedPrompt);
      toast.success("تم نسخ البرومبت");
    }
  };

  const handleSave = async () => {
    if (!prompt) return;
    
    try {
      await savePromptMutation.mutateAsync({
        title: prompt.title,
        basePrompt: prompt.basePrompt,
        enhancedPrompt: prompt.enhancedPrompt,
        usageType: prompt.usageType,
        tags: prompt.tags || undefined,
      });
      toast.success("تم حفظ البرومبت في مكتبتك");
    } catch (error) {
      toast.error("فشل حفظ البرومبت");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">البرومبت غير موجود</h2>
            <p className="text-muted-foreground mb-6">
              عذراً، الرابط الذي تحاول الوصول إليه غير صحيح أو تم حذف البرومبت
            </p>
            <Button onClick={() => window.location.href = "/"}>
              العودة للصفحة الرئيسية
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10 rounded-lg" />
              <div>
                <h1 className="font-bold text-lg">{APP_TITLE}</h1>
                <p className="text-xs text-muted-foreground">مولّد البرومبتات الذكي</p>
              </div>
            </div>
            <Button onClick={() => window.location.href = "/"} variant="outline">
              انتقل للموقع
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Title & Meta */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-3xl font-bold">{prompt.title}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                  <Eye className="w-4 h-4" />
                  <span>{prompt.viewCount || 0} مشاهدة</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(prompt.createdAt).toLocaleDateString("ar-SA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {prompt.usageType}
                </span>
              </div>
            </div>

            {/* Tags */}
            {prompt.tags && (() => {
              try {
                const parsedTags = JSON.parse(prompt.tags);
                if (Array.isArray(parsedTags) && parsedTags.length > 0) {
                  return (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {parsedTags.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  );
                }
              } catch {}
              return null;
            })()}

            {/* Prompt Content */}
            <div className="space-y-6">
              {/* Base Prompt */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  البرومبت الأساسي
                </h3>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {prompt.basePrompt}
                  </p>
                </div>
              </div>

              {/* Enhanced Prompt */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  البرومبت المحسّن
                </h3>
                <div className="bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-lg p-4 border border-green-500/20">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {prompt.enhancedPrompt}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border">
              <Button onClick={handleCopy} className="gap-2">
                <Copy className="w-4 h-4" />
                نسخ البرومبت
              </Button>
              {user && (
                <Button
                  onClick={handleSave}
                  variant="outline"
                  className="gap-2"
                  disabled={savePromptMutation.isPending}
                >
                  <BookMarked className="w-4 h-4" />
                  {savePromptMutation.isPending ? "جاري الحفظ..." : "احفظ في مكتبتي"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        {!user && (
          <Card className="mt-6 bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <h3 className="font-bold text-xl mb-2">أعجبك هذا البرومبت؟</h3>
              <p className="text-muted-foreground mb-4">
                سجّل الآن لحفظ البرومبتات المفضلة وإنشاء برومبتاتك الخاصة
              </p>
              <Button onClick={() => window.location.href = "/"} size="lg">
                ابدأ مجاناً
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
