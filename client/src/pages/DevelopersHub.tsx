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
  Code,
  Terminal,
  GitBranch,
  Bug,
  Zap,
  Database,
  FileCode,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  Cpu,
  Server,
  Globe
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function DevelopersHub() {
  const { language } = useLanguage();

  const [codeTask, setCodeTask] = useState("");
  const [programmingLanguage, setProgrammingLanguage] = useState("javascript");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const [bugDescription, setBugDescription] = useState("");
  const [bugSolution, setBugSolution] = useState("");

  const [apiDescription, setApiDescription] = useState("");
  const [generatedAPI, setGeneratedAPI] = useState("");

  // tRPC mutations
  const generateCodeMutation = trpc.prompt.generate.useMutation();
  const debugCodeMutation = trpc.prompt.generate.useMutation();
  const generateAPIMutation = trpc.prompt.generate.useMutation();

  // Programming languages
  const languages = [
    { value: "javascript", label: "JavaScript", icon: "JS" },
    { value: "typescript", label: "TypeScript", icon: "TS" },
    { value: "python", label: "Python", icon: "PY" },
    { value: "java", label: "Java", icon: "☕" },
    { value: "csharp", label: "C#", icon: "C#" },
    { value: "go", label: "Go", icon: "GO" },
    { value: "rust", label: "Rust", icon: "🦀" },
    { value: "php", label: "PHP", icon: "PHP" },
    { value: "ruby", label: "Ruby", icon: "💎" },
    { value: "swift", label: "Swift", icon: "🍎" },
  ];

  // Developer tools
  const developerTools = [
    {
      icon: Code,
      titleAr: "مولد الكود",
      titleEn: "Code Generator",
      descAr: "توليد كود احترافي بأي لغة برمجة",
      descEn: "Generate professional code in any programming language",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Bug,
      titleAr: "مصحح الأخطاء",
      titleEn: "Bug Debugger",
      descAr: "اكتشاف وإصلاح الأخطاء البرمجية",
      descEn: "Detect and fix programming bugs",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: Database,
      titleAr: "مولد قواعد البيانات",
      titleEn: "Database Generator",
      descAr: "إنشاء schemas وqueries لقواعد البيانات",
      descEn: "Create database schemas and queries",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Server,
      titleAr: "API Generator",
      titleEn: "API Generator",
      descAr: "توليد API endpoints احترافية",
      descEn: "Generate professional API endpoints",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Terminal,
      titleAr: "أوامر Shell",
      titleEn: "Shell Commands",
      descAr: "توليد أوامر bash وpowershell",
      descEn: "Generate bash and PowerShell commands",
      color: "from-gray-700 to-gray-900",
    },
    {
      icon: GitBranch,
      titleAr: "Git Helper",
      titleEn: "Git Helper",
      descAr: "مساعد لأوامر Git وworkflow",
      descEn: "Helper for Git commands and workflow",
      color: "from-orange-500 to-amber-500",
    },
  ];

  // Code snippets library
  const codeSnippets = [
    {
      titleAr: "React Component",
      titleEn: "React Component",
      lang: "typescript",
      code: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`
    },
    {
      titleAr: "API Endpoint (Node.js)",
      titleEn: "API Endpoint (Node.js)",
      lang: "javascript",
      code: `app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});`
    },
    {
      titleAr: "Database Schema (SQL)",
      titleEn: "Database Schema (SQL)",
      lang: "sql",
      code: `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_username ON users(username);`
    },
  ];

  const handleGenerateCode = async () => {
    if (!codeTask.trim()) {
      toast.error(language === "ar" ? "الرجاء إدخال وصف المهمة" : "Please enter task description");
      return;
    }

    try {
      const result = await generateCodeMutation.mutateAsync({
        basePrompt: `Generate ${programmingLanguage} code for: ${codeTask}`,
        usageType: "code",
        options: {
          humanTone: false,
          examples: true,
          keyPoints: true,
          complexity: "متوسط",
          engaging: false,
        }
      });

      setGeneratedCode(result.enhancedPrompt);
      toast.success(language === "ar" ? "تم إنشاء الكود بنجاح" : "Code generated successfully");
    } catch (error) {
      toast.error(language === "ar" ? "فشل في توليد الكود" : "Failed to generate code");
    }
  };

  const handleDebugCode = async () => {
    if (!bugDescription.trim()) {
      toast.error(language === "ar" ? "الرجاء إدخال وصف المشكلة" : "Please enter bug description");
      return;
    }

    try {
      const result = await debugCodeMutation.mutateAsync({
        basePrompt: `Debug and fix this code issue: ${bugDescription}`,
        usageType: "code",
        options: {
          humanTone: false,
          examples: true,
          keyPoints: true,
          complexity: "متوسط",
          engaging: false,
        }
      });

      setBugSolution(result.enhancedPrompt);
      toast.success(language === "ar" ? "تم تحليل المشكلة وإيجاد الحل" : "Bug analyzed and solution found");
    } catch (error) {
      toast.error(language === "ar" ? "فشل في تحليل المشكلة" : "Failed to analyze bug");
    }
  };

  const handleGenerateAPI = async () => {
    if (!apiDescription.trim()) {
      toast.error(language === "ar" ? "الرجاء إدخال وصف API" : "Please enter API description");
      return;
    }

    try {
      const result = await generateAPIMutation.mutateAsync({
        basePrompt: `Generate API code for: ${apiDescription}`,
        usageType: "code",
        options: {
          humanTone: false,
          examples: true,
          keyPoints: true,
          complexity: "متوسط",
          engaging: false,
        }
      });

      setGeneratedAPI(result.enhancedPrompt);
      toast.success(language === "ar" ? "تم إنشاء API بنجاح" : "API generated successfully");
    } catch (error) {
      toast.error(language === "ar" ? "فشل في توليد API" : "Failed to generate API");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: language === "ar" ? "تم النسخ" : "Copied",
      description: language === "ar" ? "تم نسخ الكود" : "Code copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {language === "ar" ? "مركز المطورين" : "Developers Hub"}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {language === "ar"
            ? "أدوات ذكية للمطورين لتوليد الكود، اكتشاف الأخطاء، وبناء APIs احترافية"
            : "Smart tools for developers to generate code, debug, and build professional APIs"}
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {developerTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
          );
        })}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="code" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 h-auto p-2 bg-muted/50">
          <TabsTrigger value="code" className="flex items-center gap-2 py-3">
            <Code className="w-4 h-4" />
            <span>{language === "ar" ? "مولد الكود" : "Code Gen"}</span>
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex items-center gap-2 py-3">
            <Bug className="w-4 h-4" />
            <span>{language === "ar" ? "تصحيح" : "Debug"}</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2 py-3">
            <Server className="w-4 h-4" />
            <span>{language === "ar" ? "API" : "API"}</span>
          </TabsTrigger>
          <TabsTrigger value="snippets" className="flex items-center gap-2 py-3">
            <FileCode className="w-4 h-4" />
            <span>{language === "ar" ? "أمثلة" : "Snippets"}</span>
          </TabsTrigger>
        </TabsList>

        {/* Code Generator Tab */}
        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                {language === "ar" ? "مولد الكود الذكي" : "Smart Code Generator"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "وصف ما تريد بناءه وسنولد الكود لك"
                  : "Describe what you want to build and we'll generate the code"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="programming-language">
                  {language === "ar" ? "لغة البرمجة" : "Programming Language"}
                </Label>
                <Select value={programmingLanguage} onValueChange={setProgrammingLanguage}>
                  <SelectTrigger id="programming-language" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.icon} {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="code-task">
                  {language === "ar" ? "وصف المهمة" : "Task Description"}
                </Label>
                <Textarea
                  id="code-task"
                  placeholder={language === "ar"
                    ? "مثال: أنشئ دالة لفرز مصفوفة من الأرقام باستخدام خوارزمية Quick Sort"
                    : "Example: Create a function to sort an array of numbers using Quick Sort algorithm"}
                  value={codeTask}
                  onChange={(e) => setCodeTask(e.target.value)}
                  className="min-h-[150px] mt-2 font-mono"
                />
              </div>

              <Button
                onClick={handleGenerateCode}
                disabled={generateCodeMutation.isPending}
                className="w-full"
                size="lg"
              >
                {generateCodeMutation.isPending ? (
                  <>{language === "ar" ? "جاري التوليد..." : "Generating..."}</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {language === "ar" ? "توليد الكود" : "Generate Code"}
                  </>
                )}
              </Button>

              {generatedCode && (
                <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50 border-slate-200 dark:border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {language === "ar" ? "الكود المولّد" : "Generated Code"}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedCode)}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{generatedCode}</code>
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Debug Tab */}
        <TabsContent value="debug" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="w-5 h-5" />
                {language === "ar" ? "مصحح الأخطاء الذكي" : "Smart Bug Debugger"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "صف المشكلة التي تواجهها وسنساعدك في إيجاد الحل"
                  : "Describe the issue you're facing and we'll help you find the solution"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bug-description">
                  {language === "ar" ? "وصف المشكلة والكود" : "Bug Description & Code"}
                </Label>
                <Textarea
                  id="bug-description"
                  placeholder={language === "ar"
                    ? "الصق الكود الذي يحتوي على المشكلة واشرح الخطأ..."
                    : "Paste the buggy code and explain the error..."}
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  className="min-h-[200px] mt-2 font-mono text-sm"
                />
              </div>

              <Button
                onClick={handleDebugCode}
                disabled={debugCodeMutation.isPending}
                className="w-full"
                size="lg"
              >
                {debugCodeMutation.isPending ? (
                  <>{language === "ar" ? "جاري التحليل..." : "Analyzing..."}</>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    {language === "ar" ? "تحليل وإصلاح" : "Analyze & Fix"}
                  </>
                )}
              </Button>

              {bugSolution && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {language === "ar" ? "الحل المقترح" : "Suggested Solution"}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(bugSolution)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{bugSolution}</code>
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Generator Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                {language === "ar" ? "مولد API احترافي" : "Professional API Generator"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "أنشئ REST APIs أو GraphQL endpoints بسهولة"
                  : "Create REST APIs or GraphQL endpoints easily"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-description">
                  {language === "ar" ? "وصف API المطلوب" : "API Description"}
                </Label>
                <Textarea
                  id="api-description"
                  placeholder={language === "ar"
                    ? "مثال: أنشئ REST API للمستخدمين مع عمليات CRUD كاملة"
                    : "Example: Create a REST API for users with full CRUD operations"}
                  value={apiDescription}
                  onChange={(e) => setApiDescription(e.target.value)}
                  className="min-h-[150px] mt-2"
                />
              </div>

              <Button
                onClick={handleGenerateAPI}
                disabled={generateAPIMutation.isPending}
                className="w-full"
                size="lg"
              >
                {generateAPIMutation.isPending ? (
                  <>{language === "ar" ? "جاري التوليد..." : "Generating..."}</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {language === "ar" ? "توليد API" : "Generate API"}
                  </>
                )}
              </Button>

              {generatedAPI && (
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {language === "ar" ? "كود API" : "API Code"}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedAPI)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{generatedAPI}</code>
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Snippets Tab */}
        <TabsContent value="snippets" className="space-y-6">
          <div className="grid gap-6">
            {codeSnippets.map((snippet, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileCode className="w-5 h-5" />
                      {language === "ar" ? snippet.titleAr : snippet.titleEn}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(snippet.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{snippet.code}</code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {language === "ar" ? "موارد إضافية" : "Additional Resources"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "استكشف مزيد من الأمثلة والأدوات المفيدة"
                  : "Explore more examples and useful tools"}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-3">
              <Button variant="outline" className="justify-start">
                <Globe className="w-4 h-4 mr-2" />
                {language === "ar" ? "الوثائق" : "Documentation"}
              </Button>
              <Button variant="outline" className="justify-start">
                <Cpu className="w-4 h-4 mr-2" />
                {language === "ar" ? "أدوات CLI" : "CLI Tools"}
              </Button>
              <Button variant="outline" className="justify-start">
                <Terminal className="w-4 h-4 mr-2" />
                {language === "ar" ? "أمثلة متقدمة" : "Advanced Examples"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
