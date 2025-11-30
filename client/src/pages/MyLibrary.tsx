import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Trash2, Download, Loader2, Copy, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function MyLibrary() {
  const { user, loading: authLoading } = useAuth();
  const [exportFormat, setExportFormat] = useState<"json" | "txt">("json");

  const { data: prompts, isLoading, refetch } = trpc.savedPrompts.list.useQuery(undefined, {
    enabled: !!user,
  });

  const deleteMutation = trpc.savedPrompts.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف البرومبت");
      refetch();
    },
    onError: () => {
      toast.error("حدث خطأ في حذف البرومبت");
    },
  });

  const { refetch: exportData } = trpc.savedPrompts.exportPrompts.useQuery(
    { format: exportFormat },
    {
      enabled: false,
    }
  );

  const handleExport = async () => {
    const result = await exportData();
    if (result.data) {
      const blob = new Blob([result.data.data], {
        type: result.data.format === "json" ? "application/json" : "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my-prompts.${result.data.format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("تم تصدير البرومبتات");
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("تم نسخ البرومبت");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold">يجب تسجيل الدخول</h2>
          <p className="text-muted-foreground">
            سجل الدخول لعرض مكتبتك الشخصية من البرومبتات المحفوظة
          </p>
          <div className="flex gap-3">
            <Button asChild className="flex-1">
              <a href={getLoginUrl()}>تسجيل الدخول</a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                <ArrowRight className="ml-2 w-4 h-4" />
                العودة للرئيسية
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold neon-text">مكتبتي الشخصية</h1>
              <p className="text-muted-foreground mt-1">
                جميع البرومبتات المحفوظة في مكان واحد
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowRight className="ml-2 w-4 h-4" />
                العودة
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Export Section */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportFormat("json")}
            className={exportFormat === "json" ? "border-primary" : ""}
          >
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportFormat("txt")}
            className={exportFormat === "txt" ? "border-primary" : ""}
          >
            TXT
          </Button>
          <Button onClick={handleExport} size="sm" className="mr-auto">
            <Download className="ml-2 w-4 h-4" />
            تصدير الكل
          </Button>
        </div>

        {/* Prompts List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !prompts || prompts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              لا توجد برومبتات محفوظة بعد
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ابدأ بتوليد برومبتات واحفظها لتظهر هنا
            </p>
            <Button asChild className="mt-4">
              <Link href="/">ابدأ الآن</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {prompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="p-6 bg-card/50 border-primary/20 hover:border-primary/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{prompt.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(prompt.createdAt).toLocaleDateString("ar-SA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(prompt.enhancedPrompt)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate({ id: prompt.id })}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {prompt.enhancedPrompt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                      {prompt.usageType}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
