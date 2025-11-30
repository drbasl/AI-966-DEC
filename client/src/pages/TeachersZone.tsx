import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  FileText,
  ClipboardList,
  BookOpen,
  CheckSquare,
  Calendar,
  Award,
  Copy,
  Download,
  Sparkles,
  Users,
  Target
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function TeachersZone() {
  const { language } = useLanguage();

  const [lessonPlan, setLessonPlan] = useState({
    subject: "",
    topic: "",
    grade: "",
    duration: "45",
    objectives: "",
  });

  const [quizConfig, setQuizConfig] = useState({
    subject: "",
    topic: "",
    questionCount: "10",
    difficulty: "medium",
  });

  const [generatedLessonPlan, setGeneratedLessonPlan] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState("");

  // tRPC mutations
  const generateLessonPlanMutation = trpc.prompt.generate.useMutation();
  const generateQuizMutation = trpc.prompt.generate.useMutation();

  // Teachers' tools and resources
  const teacherTools = [
    {
      icon: FileText,
      titleAr: "مولد خطط الدروس",
      titleEn: "Lesson Plan Generator",
      descAr: "أنشئ خطط دروس احترافية ومنظمة",
      descEn: "Create professional and organized lesson plans",
      color: "from-blue-500 to-cyan-500",
      link: "/worksheets"
    },
    {
      icon: ClipboardList,
      titleAr: "مولد أوراق العمل",
      titleEn: "Worksheet Generator",
      descAr: "صمم أوراق عمل تفاعلية وممتعة",
      descEn: "Design interactive and engaging worksheets",
      color: "from-purple-500 to-pink-500",
      link: "/worksheets"
    },
    {
      icon: CheckSquare,
      titleAr: "بنك الأسئلة",
      titleEn: "Question Bank",
      descAr: "مكتبة ضخمة من الأسئلة المتنوعة",
      descEn: "Huge library of diverse questions",
      color: "from-green-500 to-emerald-500",
      link: "#questions"
    },
    {
      icon: Award,
      titleAr: "تقييم الطلاب",
      titleEn: "Student Assessment",
      descAr: "أدوات تقييم ومتابعة شاملة",
      descEn: "Comprehensive assessment and tracking tools",
      color: "from-orange-500 to-amber-500",
      link: "#assessment"
    },
    {
      icon: Calendar,
      titleAr: "جدولة الدروس",
      titleEn: "Lesson Scheduling",
      descAr: "نظم جدولك الدراسي بكفاءة",
      descEn: "Organize your teaching schedule efficiently",
      color: "from-red-500 to-rose-500",
      link: "#schedule"
    },
    {
      icon: Users,
      titleAr: "أنشطة جماعية",
      titleEn: "Group Activities",
      descAr: "أفكار لأنشطة تعاونية مبتكرة",
      descEn: "Ideas for innovative collaborative activities",
      color: "from-indigo-500 to-violet-500",
      link: "#activities"
    },
  ];

  // Educational resources
  const educationalResources = [
    {
      titleAr: "دليل المعلم الذكي",
      titleEn: "Smart Teacher's Guide",
      descAr: "استراتيجيات تدريس حديثة بالذكاء الاصطناعي",
      descEn: "Modern teaching strategies with AI",
      badge: "جديد",
      badgeEn: "New"
    },
    {
      titleAr: "أفضل الممارسات التعليمية",
      titleEn: "Best Teaching Practices",
      descAr: "تقنيات تدريس مثبتة علمياً وفعالة",
      descEn: "Scientifically proven effective teaching techniques",
      badge: "شائع",
      badgeEn: "Popular"
    },
    {
      titleAr: "إدارة الصف الفعال",
      titleEn: "Effective Classroom Management",
      descAr: "نصائح لإدارة صفية ناجحة ومنظمة",
      descEn: "Tips for successful and organized classroom management",
      badge: "مميز",
      badgeEn: "Featured"
    },
    {
      titleAr: "التعلم النشط",
      titleEn: "Active Learning",
      descAr: "أساليب تفاعلية لإشراك الطلاب",
      descEn: "Interactive methods to engage students",
      badge: "محدّث",
      badgeEn: "Updated"
    },
  ];

  // Subject templates
  const subjectTemplates = [
    { value: "math", labelAr: "رياضيات", labelEn: "Mathematics" },
    { value: "science", labelAr: "علوم", labelEn: "Science" },
    { value: "arabic", labelAr: "لغة عربية", labelEn: "Arabic Language" },
    { value: "english", labelAr: "لغة إنجليزية", labelEn: "English Language" },
    { value: "social", labelAr: "اجتماعيات", labelEn: "Social Studies" },
    { value: "islamic", labelAr: "تربية إسلامية", labelEn: "Islamic Studies" },
    { value: "computer", labelAr: "حاسب آلي", labelEn: "Computer Science" },
    { value: "art", labelAr: "فنون", labelEn: "Arts" },
  ];

  const gradeTemplates = [
    { value: "elementary", labelAr: "ابتدائي", labelEn: "Elementary" },
    { value: "middle", labelAr: "متوسط", labelEn: "Middle School" },
    { value: "high", labelAr: "ثانوي", labelEn: "High School" },
  ];

  const handleGenerateLessonPlan = async () => {
    if (!lessonPlan.subject || !lessonPlan.topic || !lessonPlan.grade) {
      toast.error(language === "ar"
        ? "الرجاء تعبئة جميع الحقول المطلوبة"
        : "Please fill all required fields");
      return;
    }

    try {
      const promptText = language === "ar"
        ? `أنشئ خطة درس احترافية للمادة: ${lessonPlan.subject}، الموضوع: ${lessonPlan.topic}، المرحلة: ${lessonPlan.grade}، المدة: ${lessonPlan.duration} دقيقة. الأهداف: ${lessonPlan.objectives || 'أهداف تعليمية شاملة'}`
        : `Create a professional lesson plan for subject: ${lessonPlan.subject}, topic: ${lessonPlan.topic}, grade: ${lessonPlan.grade}, duration: ${lessonPlan.duration} minutes. Objectives: ${lessonPlan.objectives || 'comprehensive learning objectives'}`;

      const result = await generateLessonPlanMutation.mutateAsync({
        basePrompt: promptText,
        usageType: "education",
        options: {
          humanTone: true,
          examples: true,
          keyPoints: true,
          complexity: "متوسط",
          engaging: true,
        }
      });

      setGeneratedLessonPlan(result.enhancedPrompt);
      toast.success(language === "ar" ? "تم إنشاء خطة الدرس بنجاح" : "Lesson plan created successfully");
    } catch (error) {
      toast.error(language === "ar" ? "فشل في توليد خطة الدرس" : "Failed to generate lesson plan");
    }
  };

  const handleGenerateQuiz = async () => {
    if (!quizConfig.subject || !quizConfig.topic) {
      toast.error(language === "ar"
        ? "الرجاء تعبئة جميع الحقول المطلوبة"
        : "Please fill all required fields");
      return;
    }

    try {
      const promptText = language === "ar"
        ? `أنشئ اختبار تعليمي للمادة: ${quizConfig.subject}، الموضوع: ${quizConfig.topic}، عدد الأسئلة: ${quizConfig.questionCount}، المستوى: ${quizConfig.difficulty}`
        : `Create an educational quiz for subject: ${quizConfig.subject}, topic: ${quizConfig.topic}, number of questions: ${quizConfig.questionCount}, difficulty: ${quizConfig.difficulty}`;

      const result = await generateQuizMutation.mutateAsync({
        basePrompt: promptText,
        usageType: "exam",
        options: {
          humanTone: false,
          examples: true,
          keyPoints: true,
          complexity: quizConfig.difficulty === "easy" ? "بسيط" : quizConfig.difficulty === "hard" ? "متقدم" : "متوسط",
          engaging: true,
        }
      });

      setGeneratedQuiz(result.enhancedPrompt);
      toast.success(language === "ar" ? "تم إنشاء الاختبار بنجاح" : "Quiz created successfully");
    } catch (error) {
      toast.error(language === "ar" ? "فشل في توليد الاختبار" : "Failed to generate quiz");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {language === "ar" ? "منطقة المعلمين" : "Teachers Zone"}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {language === "ar"
            ? "مركز شامل للمعلمين مع أدوات ذكية لتحضير الدروس، إنشاء الاختبارات، وإدارة الصف"
            : "Comprehensive hub for teachers with smart tools for lesson planning, quiz creation, and classroom management"}
        </p>
      </div>

      {/* Quick Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {teacherTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Link key={index} href={tool.link}>
              <a>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 hover:border-primary">
                  <CardHeader>
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${tool.color} w-fit mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">
                      {language === "ar" ? tool.titleAr : tool.titleEn}
                    </CardTitle>
                    <CardDescription>
                      {language === "ar" ? tool.descAr : tool.descEn}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </a>
            </Link>
          );
        })}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="lesson-plan" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-3 gap-2 h-auto p-2 bg-muted/50">
          <TabsTrigger value="lesson-plan" className="flex items-center gap-2 py-3">
            <BookOpen className="w-4 h-4" />
            <span>{language === "ar" ? "خطة درس" : "Lesson Plan"}</span>
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2 py-3">
            <CheckSquare className="w-4 h-4" />
            <span>{language === "ar" ? "اختبار سريع" : "Quick Quiz"}</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2 py-3">
            <Target className="w-4 h-4" />
            <span>{language === "ar" ? "موارد تعليمية" : "Resources"}</span>
          </TabsTrigger>
        </TabsList>

        {/* Lesson Plan Tab */}
        <TabsContent value="lesson-plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {language === "ar" ? "مولد خطط الدروس الذكي" : "Smart Lesson Plan Generator"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "أنشئ خطة درس احترافية ومنظمة بالذكاء الاصطناعي"
                  : "Create professional and organized lesson plans with AI"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">
                    {language === "ar" ? "المادة" : "Subject"}
                  </Label>
                  <Select value={lessonPlan.subject} onValueChange={(val) => setLessonPlan({...lessonPlan, subject: val})}>
                    <SelectTrigger id="subject" className="mt-2">
                      <SelectValue placeholder={language === "ar" ? "اختر المادة" : "Select Subject"} />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectTemplates.map((subj) => (
                        <SelectItem key={subj.value} value={subj.value}>
                          {language === "ar" ? subj.labelAr : subj.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="grade">
                    {language === "ar" ? "المرحلة الدراسية" : "Grade Level"}
                  </Label>
                  <Select value={lessonPlan.grade} onValueChange={(val) => setLessonPlan({...lessonPlan, grade: val})}>
                    <SelectTrigger id="grade" className="mt-2">
                      <SelectValue placeholder={language === "ar" ? "اختر المرحلة" : "Select Grade"} />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeTemplates.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {language === "ar" ? grade.labelAr : grade.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="topic">
                  {language === "ar" ? "موضوع الدرس" : "Lesson Topic"}
                </Label>
                <Input
                  id="topic"
                  placeholder={language === "ar" ? "مثال: الجمع والطرح للأعداد الكبيرة" : "Example: Addition and Subtraction of Large Numbers"}
                  value={lessonPlan.topic}
                  onChange={(e) => setLessonPlan({...lessonPlan, topic: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="objectives">
                  {language === "ar" ? "أهداف الدرس" : "Learning Objectives"}
                </Label>
                <Textarea
                  id="objectives"
                  placeholder={language === "ar"
                    ? "مثال: أن يتعرف الطالب على مفهوم الجمع والطرح..."
                    : "Example: Students will understand the concept of addition and subtraction..."}
                  value={lessonPlan.objectives}
                  onChange={(e) => setLessonPlan({...lessonPlan, objectives: e.target.value})}
                  className="min-h-[100px] mt-2"
                />
              </div>

              <div>
                <Label htmlFor="duration">
                  {language === "ar" ? "مدة الحصة (دقيقة)" : "Class Duration (minutes)"}
                </Label>
                <Select value={lessonPlan.duration} onValueChange={(val) => setLessonPlan({...lessonPlan, duration: val})}>
                  <SelectTrigger id="duration" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 {language === "ar" ? "دقيقة" : "minutes"}</SelectItem>
                    <SelectItem value="45">45 {language === "ar" ? "دقيقة" : "minutes"}</SelectItem>
                    <SelectItem value="60">60 {language === "ar" ? "دقيقة" : "minutes"}</SelectItem>
                    <SelectItem value="90">90 {language === "ar" ? "دقيقة" : "minutes"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerateLessonPlan} className="w-full" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                {language === "ar" ? "توليد خطة الدرس" : "Generate Lesson Plan"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                {language === "ar" ? "مولد الاختبارات السريعة" : "Quick Quiz Generator"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "أنشئ اختبارات متنوعة بأسئلة مخصصة بناءً على المحتوى"
                  : "Create diverse quizzes with customized questions based on content"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quiz-subject">
                    {language === "ar" ? "المادة" : "Subject"}
                  </Label>
                  <Select value={quizConfig.subject} onValueChange={(val) => setQuizConfig({...quizConfig, subject: val})}>
                    <SelectTrigger id="quiz-subject" className="mt-2">
                      <SelectValue placeholder={language === "ar" ? "اختر المادة" : "Select Subject"} />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectTemplates.map((subj) => (
                        <SelectItem key={subj.value} value={subj.value}>
                          {language === "ar" ? subj.labelAr : subj.labelEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">
                    {language === "ar" ? "مستوى الصعوبة" : "Difficulty Level"}
                  </Label>
                  <Select value={quizConfig.difficulty} onValueChange={(val) => setQuizConfig({...quizConfig, difficulty: val})}>
                    <SelectTrigger id="difficulty" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">{language === "ar" ? "سهل" : "Easy"}</SelectItem>
                      <SelectItem value="medium">{language === "ar" ? "متوسط" : "Medium"}</SelectItem>
                      <SelectItem value="hard">{language === "ar" ? "صعب" : "Hard"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="quiz-topic">
                  {language === "ar" ? "موضوع الاختبار" : "Quiz Topic"}
                </Label>
                <Input
                  id="quiz-topic"
                  placeholder={language === "ar" ? "مثال: الكسور العشرية" : "Example: Decimal Fractions"}
                  value={quizConfig.topic}
                  onChange={(e) => setQuizConfig({...quizConfig, topic: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="question-count">
                  {language === "ar" ? "عدد الأسئلة" : "Number of Questions"}
                </Label>
                <Select value={quizConfig.questionCount} onValueChange={(val) => setQuizConfig({...quizConfig, questionCount: val})}>
                  <SelectTrigger id="question-count" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 {language === "ar" ? "أسئلة" : "questions"}</SelectItem>
                    <SelectItem value="10">10 {language === "ar" ? "أسئلة" : "questions"}</SelectItem>
                    <SelectItem value="15">15 {language === "ar" ? "سؤال" : "questions"}</SelectItem>
                    <SelectItem value="20">20 {language === "ar" ? "سؤال" : "questions"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerateQuiz} className="w-full" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                {language === "ar" ? "توليد الاختبار" : "Generate Quiz"}
              </Button>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  {language === "ar" ? "أو استخدم مولد أوراق العمل المتقدم" : "Or use the advanced worksheet generator"}
                </p>
                <Link href="/worksheets">
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    {language === "ar" ? "الانتقال إلى مولد أوراق العمل" : "Go to Worksheet Generator"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {educationalResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      {language === "ar" ? resource.titleAr : resource.titleEn}
                    </CardTitle>
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                      {language === "ar" ? resource.badge : resource.badgeEn}
                    </span>
                  </div>
                  <CardDescription>
                    {language === "ar" ? resource.descAr : resource.descEn}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {language === "ar" ? "قراءة المزيد" : "Read More"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Resources Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {language === "ar" ? "موارد إضافية" : "Additional Resources"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "استكشف مكتبة شاملة من الموارد التعليمية والأدوات المفيدة"
                  : "Explore a comprehensive library of educational resources and useful tools"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/library">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {language === "ar" ? "مكتبة البرومبتات" : "Prompt Library"}
                </Button>
              </Link>
              <Link href="/creative-studio">
                <Button variant="outline" className="w-full justify-start">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {language === "ar" ? "استوديو الإبداع" : "Creative Studio"}
                </Button>
              </Link>
              <Link href="/ai-chat">
                <Button variant="outline" className="w-full justify-start">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  {language === "ar" ? "محادثة AI التعليمية" : "Educational AI Chat"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
