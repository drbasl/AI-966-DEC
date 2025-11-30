import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle2, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function PromptAnalyzer() {
  const [promptToAnalyze, setPromptToAnalyze] = useState("");

  const analyzeMutation = trpc.prompt.analyze.useMutation();

  const handleAnalyze = () => {
    if (promptToAnalyze.trim()) {
      analyzeMutation.mutate({ prompt: promptToAnalyze });
    }
  };

  const analysis = analyzeMutation.data;

  return (
    <Card className="p-6 md:p-8 neon-glow bg-card border-primary/30">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">محلل البرومبتات الذكي</h3>
          <p className="text-muted-foreground">
            احصل على تحليل شامل لجودة برومبتك مع اقتراحات للتحسين
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">البرومبت المراد تحليله</label>
          <Textarea
            placeholder="الصق برومبتك هنا للحصول على تحليل مفصل لنقاط القوة والضعف..."
            value={promptToAnalyze}
            onChange={(e) => setPromptToAnalyze(e.target.value)}
            className="min-h-[150px] bg-background/50 border-primary/30 focus:border-primary"
          />
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={!promptToAnalyze.trim() || analyzeMutation.isPending}
          className="w-full"
          size="lg"
        >
          {analyzeMutation.isPending ? (
            <>
              <Loader2 className="ml-2 w-5 h-5 animate-spin" />
              جاري التحليل...
            </>
          ) : (
            <>
              <TrendingUp className="ml-2 w-5 h-5" />
              تحليل البرومبت
            </>
          )}
        </Button>

        {analysis && (
          <div className="space-y-6 mt-8 animate-in fade-in duration-500">
            {/* Overall Score */}
            <div className="bg-primary/10 p-6 rounded-lg border border-primary/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold">التقييم الإجمالي</h4>
                <div className="text-3xl font-bold text-primary">
                  {analysis.score}/10
                </div>
              </div>
              <Progress value={analysis.score * 10} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {analysis.score >= 8
                  ? "برومبت ممتاز! 🎉"
                  : analysis.score >= 6
                  ? "برومبت جيد، يمكن تحسينه"
                  : "برومبت يحتاج إلى تحسينات كبيرة"}
              </p>
            </div>

            {/* Strengths */}
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  نقاط القوة
                </h4>
                <div className="space-y-2">
                  {analysis.strengths.map((strength: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses */}
            {analysis.weaknesses && analysis.weaknesses.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  نقاط الضعف
                </h4>
                <div className="space-y-2">
                  {analysis.weaknesses.map((weakness: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{weakness}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  اقتراحات التحسين
                </h4>
                <div className="space-y-2">
                  {analysis.suggestions.map((suggestion: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-primary/10 border border-primary/30 rounded-lg"
                    >
                      <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improved Version */}
            {analysis.improvedVersion && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold">النسخة المحسّنة</h4>
                <div className="bg-muted/30 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {analysis.improvedVersion}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
