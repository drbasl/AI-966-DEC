import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  improvedVersion: string;
}

export default function Analyzer() {
  const [prompt, setPrompt] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const analyzeMutation = trpc.prompt.analyze.useMutation();

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      toast.error("الرجاء إدخال برومبت للتحليل");
      return;
    }

    try {
      const result = await analyzeMutation.mutateAsync({ prompt });
      setAnalysis(result as AnalysisResult);
      toast.success("تم تحليل البرومبت بنجاح");
    } catch (error) {
      toast.error("فشل تحليل البرومبت");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "ممتاز";
    if (score >= 6) return "جيد";
    if (score >= 4) return "متوسط";
    return "ضعيف";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">محلل البرومبتات الذكي</h1>
          <p className="text-muted-foreground mt-1">
            احصل على تحليل شامل واقتراحات لتحسين برومبتاتك
          </p>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              أدخل البرومبت للتحليل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="اكتب أو الصق البرومبت الذي تريد تحليله هنا..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <Button
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending || !prompt.trim()}
              size="lg"
              className="w-full"
            >
              {analyzeMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                  جاري التحليل...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 ml-2" />
                  تحليل البرومبت
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Score Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                    <span
                      className={`text-4xl font-bold ${getScoreColor(
                        analysis.score
                      )}`}
                    >
                      {analysis.score}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      {getScoreLabel(analysis.score)}
                    </h3>
                    <p className="text-muted-foreground">
                      التقييم الإجمالي للبرومبت
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-500">
                  <CheckCircle2 className="w-5 h-5" />
                  نقاط القوة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                  نقاط الضعف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-500">
                  <Lightbulb className="w-5 h-5" />
                  اقتراحات للتحسين
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10"
                    >
                      <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Improved Version */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  النسخة المحسّنة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {analysis.improvedVersion}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    navigator.clipboard.writeText(analysis.improvedVersion);
                    toast.success("تم نسخ البرومبت المحسّن");
                  }}
                >
                  نسخ البرومبت المحسّن
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
