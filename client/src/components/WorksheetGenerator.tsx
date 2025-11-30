import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileText, Sparkles, Download, FileDown, Copy } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type GenerationMethod = "text" | "title";
type QuestionType = "multiple_choice" | "short_answer" | "essay" | "true_false" | "fill_blank" | "mixed";

export default function WorksheetGenerator() {
  const [generationMethod, setGenerationMethod] = useState<GenerationMethod>("title");
  const [questionType, setQuestionType] = useState<QuestionType>("multiple_choice");
  const [questionCount, setQuestionCount] = useState<number>(7);
  const [language, setLanguage] = useState<string>("ar");
  const [gradeLevel, setGradeLevel] = useState<string>("elementary");
  const [lessonTitle, setLessonTitle] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const [schoolName, setSchoolName] = useState<string>("");
  const [sourceText, setSourceText] = useState<string>("");

  const generateMutation = trpc.worksheets.generate.useMutation({
    onSuccess: (data) => {
      toast.success("تم توليد ورقة العمل بنجاح!");
    },
    onError: (error) => {
      toast.error("حدث خطأ في توليد ورقة العمل");
      console.error(error);
    },
  });

  const handleGenerate = () => {
    if (!lessonTitle.trim()) {
      toast.error("يرجى إدخال عنوان الدرس");
      return;
    }

    if (generationMethod === "text" && !sourceText.trim()) {
      toast.error("يرجى إدخال النص المصدر");
      return;
    }

    generateMutation.mutate({
      generationMethod,
      questionType,
      questionCount,
      language,
      gradeLevel,
      lessonTitle,
      teacherName: teacherName || undefined,
      schoolName: schoolName || undefined,
      sourceText: generationMethod === "text" ? sourceText : undefined,
    });
  };

  const handleCopy = async () => {
    if (generateMutation.data?.content) {
      await navigator.clipboard.writeText(generateMutation.data.content);
      toast.success("تم نسخ ورقة العمل!");
    }
  };

  const handleExportText = () => {
    if (generateMutation.data?.content) {
      const content = `ورقة عمل: ${lessonTitle}\n${teacherName ? `المعلم/ة: ${teacherName}\n` : ""}${schoolName ? `المدرسة: ${schoolName}\n` : ""}\n${"─".repeat(50)}\n\n${generateMutation.data.content}`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ورقة_عمل_${lessonTitle}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("تم تصدير ورقة العمل كملف نصي!");
    }
  };

  const handleExportWord = () => {
    if (generateMutation.data?.content) {
      const content = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><title>ورقة عمل - ${lessonTitle}</title></head>
        <body dir="rtl" style="font-family: Arial, sans-serif;">
          <h1 style="text-align: center; color: #0ea5e9;">ورقة عمل</h1>
          <h2 style="text-align: center;">${lessonTitle}</h2>
          ${teacherName ? `<p><strong>المعلم/ة:</strong> ${teacherName}</p>` : ""}
          ${schoolName ? `<p><strong>المدرسة:</strong> ${schoolName}</p>` : ""}
          <hr/>
          <div style="white-space: pre-wrap;">${generateMutation.data.content}</div>
          <hr/>
          <p style="color: #888; font-size: 12px; text-align: center;">تم التوليد بواسطة رقيم AI 966</p>
        </body>
        </html>
      `;
      const blob = new Blob([content], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ورقة_عمل_${lessonTitle}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("تم تصدير ورقة العمل كملف Word!");
    }
  };

  return (
    <Card className="p-6 bg-card/50 border-primary/20">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold neon-text flex items-center justify-center gap-2">
            <FileText className="w-6 h-6" />
            تفاصيل ورقة العمل
          </h2>
          <p className="text-sm text-muted-foreground">
            اختر طريقة التوليد المناسبة لإنشاء ورقة عمل مخصصة
          </p>
        </div>

        {/* Generation Method */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">طريقة التوليد</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={generationMethod === "title" ? "default" : "outline"}
              onClick={() => setGenerationMethod("title")}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              إنشاء باستخدام عنوان الدرس
            </Button>
            <Button
              variant={generationMethod === "text" ? "default" : "outline"}
              onClick={() => setGenerationMethod("text")}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              باستخدام نص
            </Button>
          </div>
        </div>

        {/* Source Text (if method is text) */}
        {generationMethod === "text" && (
          <div className="space-y-2">
            <Label htmlFor="source-text">النص المصدر</Label>
            <Textarea
              id="source-text"
              placeholder="أدخل النص الذي تريد إنشاء أسئلة منه..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
        )}

        {/* Question Type */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            نوع الأسئلة <span className="text-xs text-muted-foreground">(يمكن اختيار عدة أنواع)</span>
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={questionType === "multiple_choice" ? "default" : "outline"}
              onClick={() => setQuestionType("multiple_choice")}
              size="sm"
            >
              الاختيار من متعدد
            </Button>
            <Button
              variant={questionType === "short_answer" ? "default" : "outline"}
              onClick={() => setQuestionType("short_answer")}
              size="sm"
            >
              أسئلة قصيرة
            </Button>
            <Button
              variant={questionType === "essay" ? "default" : "outline"}
              onClick={() => setQuestionType("essay")}
              size="sm"
            >
              مقالي
            </Button>
            <Button
              variant={questionType === "true_false" ? "default" : "outline"}
              onClick={() => setQuestionType("true_false")}
              size="sm"
            >
              صح أم خطأ
            </Button>
            <Button
              variant={questionType === "fill_blank" ? "default" : "outline"}
              onClick={() => setQuestionType("fill_blank")}
              size="sm"
            >
              أهل الفراغات
            </Button>
            <Button
              variant={questionType === "mixed" ? "default" : "outline"}
              onClick={() => setQuestionType("mixed")}
              size="sm"
              className="bg-primary/10"
            >
              أسئلة متنوعة
            </Button>
          </div>
        </div>

        {/* Question Count & Language */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="question-count">عدد الأسئلة</Label>
            <Input
              id="question-count"
              type="number"
              min={1}
              max={30}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 7)}
              placeholder="7"
            />
            <p className="text-xs text-muted-foreground">الحد 30 سؤال</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">لغة الورقة</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">الإنجليزية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grade Level & Lesson Title */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="grade-level">المرحلة الدراسية</Label>
            <Select value={gradeLevel} onValueChange={setGradeLevel}>
              <SelectTrigger id="grade-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="elementary">ابتدائي</SelectItem>
                <SelectItem value="middle">متوسط</SelectItem>
                <SelectItem value="high">ثانوي</SelectItem>
                <SelectItem value="university">جامعي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lesson-title">
              عنوان الدرس <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lesson-title"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="اكتب عنوان الدرس أو عنوان الدرس"
            />
          </div>
        </div>

        {/* Teacher Name & School Name */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="teacher-name">اسم المعلم/ة (اختياري)</Label>
            <Input
              id="teacher-name"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="اسم المعلم/ة"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="school-name">اسم المدرسة (اختياري)</Label>
            <Input
              id="school-name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="اسم المدرسة"
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending}
          className="w-full h-12 text-lg"
          size="lg"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="ml-2 w-5 h-5 animate-spin" />
              جاري التوليد...
            </>
          ) : (
            <>
              <Sparkles className="ml-2 w-5 h-5" />
              توليد ورقة العمل
            </>
          )}
        </Button>

        {/* Generated Worksheet */}
        {generateMutation.data && (
          <div className="space-y-4 p-6 bg-background/50 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">ورقة العمل المولدة</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="ml-2 w-4 h-4" />
                  نسخ
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="ml-2 w-4 h-4" />
                      تصدير
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportWord}>
                      <FileText className="ml-2 w-4 h-4" />
                      تصدير Word
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportText}>
                      <FileDown className="ml-2 w-4 h-4" />
                      تصدير نص عادي
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: generateMutation.data.content }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
