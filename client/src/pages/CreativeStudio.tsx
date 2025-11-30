import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  Sparkles,
  Image as ImageIcon,
  FileText,
  Palette,
  Video,
  Music,
  Lightbulb,
  Copy,
  Download,
  Share2,
  Wand2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function CreativeStudio() {
  const { language } = useLanguage();

  // State for different creative tools
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStyle, setImageStyle] = useState("realistic");
  const [generatedImagePrompt, setGeneratedImagePrompt] = useState("");

  const [storyIdea, setStoryIdea] = useState("");
  const [storyGenre, setStoryGenre] = useState("fantasy");
  const [generatedStory, setGeneratedStory] = useState("");

  const [designBrief, setDesignBrief] = useState("");
  const [designType, setDesignType] = useState("logo");
  const [generatedDesignIdea, setGeneratedDesignIdea] = useState("");

  const [contentTopic, setContentTopic] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [generatedContent, setGeneratedContent] = useState("");

  // tRPC mutations
  const generateImagePromptMutation = trpc.prompt.generate.useMutation();
  const generateStoryMutation = trpc.prompt.generate.useMutation();
  const generateDesignIdeaMutation = trpc.prompt.generate.useMutation();
  const generateContentMutation = trpc.prompt.generate.useMutation();

  // Handlers
  const handleGenerateImagePrompt = async () => {
    if (!imagePrompt.trim()) {
      toast.error(language === "ar" ? "الرجاء إدخال وصف للصورة" : "Please enter an image description");
      return;
    }

    try {
      const result = await generateImagePromptMutation.mutateAsync({
        basePrompt: imagePrompt,
        usageType: "article",
        options: {
          humanTone: true,
          examples: true,
          keyPoints: true,
          complexity: "متوسط",
          engaging: false,
        }
      });

      setGeneratedImagePrompt(result.enhancedPrompt);
      toast.success(language === "ar" ? "تم إنشاء وصف الصورة بنجاح" : "Image prompt created successfully");
    } catch (error) {
      toast.error(language === "ar" ? "فشل في توليد الوصف" : "Failed to generate prompt");
    }
  };

  const handleGenerateStory = async () => {
    if (!storyIdea.trim()) {
      toast.error(language === "ar" ? "الرجاء إدخال فكرة القصة" : "Please enter a story idea");
      return;
    }

    try {
      const result = await generateStoryMutation.mutateAsync({
        basePrompt: storyIdea,
        usageType: "article",
        options: {
          humanTone: true,
          examples: false,
          keyPoints: true,
          complexity: "متوسط",
          engaging: true,
        }
      });

      setGeneratedStory(result.enhancedPrompt);
      toast.success(language === "ar" ? "تم إنشاء القصة بنجاح" : "Story created successfully");
    } catch (error) {
      toast.error(language === "ar" ? "فشل في توليد القصة" : "Failed to generate story");
    }
  };

  const handleGenerateDesignIdea = async () => {
    if (!designBrief.trim()) {
      toast.error(language === "ar" ? "الرجاء إدخال وصف التصميم" : "Please enter design description");
      return;
    }

    try {
      const result = await generateDesignIdeaMutation.mutateAsync({
        basePrompt: designBrief,
        usageType: "article",
        options: {
          humanTone: true,
          examples: true,
          keyPoints: true,
          complexity: "متوسط",
          engaging: false,
        }
      });

      setGeneratedDesignIdea(result.enhancedPrompt);
      toast.success(language === "ar" ? "تم إنشاء فكرة التصميم بنجاح" : "Design idea created successfully");
    } catch (error) {
      toast.error(language === "ar" ? "فشل في توليد الفكرة" : "Failed to generate idea");
    }
  };

  const handleGenerateContent = async () => {
    if (!contentTopic.trim()) {
      toast.error(language === "ar" ? "الرجاء إدخال موضوع المحتوى" : "Please enter content topic");
      return;
    }

    try {
      const result = await generateContentMutation.mutateAsync({
        basePrompt: contentTopic,
        usageType: "article",
        options: {
          humanTone: true,
          examples: true,
          keyPoints: true,
          complexity: "متوسط",
          engaging: true,
        }
      });

      setGeneratedContent(result.enhancedPrompt);
      toast.success(language === "ar" ? "تم إنشاء المحتوى بنجاح" : "Content created successfully");
    } catch (error) {
      toast.error(language === "ar" ? "فشل في توليد المحتوى" : "Failed to generate content");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(language === "ar" ? "تم نسخ النص إلى الحافظة" : "Text copied to clipboard");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {language === "ar" ? "استوديو الإبداع" : "Creative Studio"}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {language === "ar"
            ? "مجموعة شاملة من أدوات الذكاء الاصطناعي الإبداعية لتوليد الأفكار والمحتوى المبتكر"
            : "A comprehensive suite of creative AI tools to generate innovative ideas and content"}
        </p>
      </div>

      {/* Creative Tools Tabs */}
      <Tabs defaultValue="image" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 h-auto p-2 bg-muted/50">
          <TabsTrigger value="image" className="flex items-center gap-2 py-3">
            <ImageIcon className="w-4 h-4" />
            <span>{language === "ar" ? "مولد الصور" : "Image Generator"}</span>
          </TabsTrigger>
          <TabsTrigger value="story" className="flex items-center gap-2 py-3">
            <FileText className="w-4 h-4" />
            <span>{language === "ar" ? "كتابة إبداعية" : "Creative Writing"}</span>
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center gap-2 py-3">
            <Palette className="w-4 h-4" />
            <span>{language === "ar" ? "أفكار تصميم" : "Design Ideas"}</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2 py-3">
            <Lightbulb className="w-4 h-4" />
            <span>{language === "ar" ? "محتوى إبداعي" : "Creative Content"}</span>
          </TabsTrigger>
        </TabsList>

        {/* Image Generation Tab */}
        <TabsContent value="image" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                {language === "ar" ? "مولد وصف الصور بالذكاء الاصطناعي" : "AI Image Prompt Generator"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "أنشئ أوصاف احترافية لتوليد الصور باستخدام Midjourney, DALL-E, Stable Diffusion"
                  : "Create professional prompts for Midjourney, DALL-E, Stable Diffusion"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image-prompt">
                  {language === "ar" ? "وصف الصورة المطلوبة" : "Image Description"}
                </Label>
                <Textarea
                  id="image-prompt"
                  placeholder={language === "ar" ? "مثال: منظر طبيعي خلاب لجبال في الغروب..." : "Example: A breathtaking mountain landscape at sunset..."}
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="min-h-[120px] mt-2"
                />
              </div>

              <div>
                <Label htmlFor="image-style">
                  {language === "ar" ? "نمط الصورة" : "Image Style"}
                </Label>
                <Select value={imageStyle} onValueChange={setImageStyle}>
                  <SelectTrigger id="image-style" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">{language === "ar" ? "واقعي" : "Realistic"}</SelectItem>
                    <SelectItem value="artistic">{language === "ar" ? "فني" : "Artistic"}</SelectItem>
                    <SelectItem value="anime">{language === "ar" ? "أنمي" : "Anime"}</SelectItem>
                    <SelectItem value="3d">{language === "ar" ? "ثلاثي الأبعاد" : "3D Render"}</SelectItem>
                    <SelectItem value="oil-painting">{language === "ar" ? "لوحة زيتية" : "Oil Painting"}</SelectItem>
                    <SelectItem value="watercolor">{language === "ar" ? "ألوان مائية" : "Watercolor"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateImagePrompt}
                disabled={generateImagePromptMutation.isPending}
                className="w-full"
                size="lg"
              >
                {generateImagePromptMutation.isPending ? (
                  <>{language === "ar" ? "جاري التوليد..." : "Generating..."}</>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    {language === "ar" ? "توليد وصف الصورة" : "Generate Image Prompt"}
                  </>
                )}
              </Button>

              {generatedImagePrompt && (
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {language === "ar" ? "الوصف المولّد" : "Generated Prompt"}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedImagePrompt)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{generatedImagePrompt}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Creative Writing Tab */}
        <TabsContent value="story" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {language === "ar" ? "مولد القصص الإبداعية" : "Creative Story Generator"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "اكتب قصصاً إبداعية وروايات بمساعدة الذكاء الاصطناعي"
                  : "Write creative stories and narratives with AI assistance"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="story-idea">
                  {language === "ar" ? "فكرة القصة" : "Story Idea"}
                </Label>
                <Textarea
                  id="story-idea"
                  placeholder={language === "ar" ? "مثال: رحلة شاب يبحث عن كنز مفقود..." : "Example: A young adventurer searching for a lost treasure..."}
                  value={storyIdea}
                  onChange={(e) => setStoryIdea(e.target.value)}
                  className="min-h-[120px] mt-2"
                />
              </div>

              <div>
                <Label htmlFor="story-genre">
                  {language === "ar" ? "نوع القصة" : "Story Genre"}
                </Label>
                <Select value={storyGenre} onValueChange={setStoryGenre}>
                  <SelectTrigger id="story-genre" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fantasy">{language === "ar" ? "خيالي" : "Fantasy"}</SelectItem>
                    <SelectItem value="scifi">{language === "ar" ? "خيال علمي" : "Sci-Fi"}</SelectItem>
                    <SelectItem value="mystery">{language === "ar" ? "غموض" : "Mystery"}</SelectItem>
                    <SelectItem value="romance">{language === "ar" ? "رومانسي" : "Romance"}</SelectItem>
                    <SelectItem value="horror">{language === "ar" ? "رعب" : "Horror"}</SelectItem>
                    <SelectItem value="adventure">{language === "ar" ? "مغامرة" : "Adventure"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateStory}
                disabled={generateStoryMutation.isPending}
                className="w-full"
                size="lg"
              >
                {generateStoryMutation.isPending ? (
                  <>{language === "ar" ? "جاري الكتابة..." : "Writing..."}</>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    {language === "ar" ? "كتابة القصة" : "Write Story"}
                  </>
                )}
              </Button>

              {generatedStory && (
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {language === "ar" ? "القصة المولّدة" : "Generated Story"}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedStory)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{generatedStory}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Design Ideas Tab */}
        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {language === "ar" ? "مولد أفكار التصميم" : "Design Ideas Generator"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "احصل على أفكار تصميم إبداعية للشعارات، واجهات المستخدم، والمزيد"
                  : "Get creative design ideas for logos, UI/UX, and more"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="design-brief">
                  {language === "ar" ? "وصف المشروع" : "Design Brief"}
                </Label>
                <Textarea
                  id="design-brief"
                  placeholder={language === "ar" ? "مثال: شعار لشركة تقنية حديثة..." : "Example: Logo for a modern tech company..."}
                  value={designBrief}
                  onChange={(e) => setDesignBrief(e.target.value)}
                  className="min-h-[120px] mt-2"
                />
              </div>

              <div>
                <Label htmlFor="design-type">
                  {language === "ar" ? "نوع التصميم" : "Design Type"}
                </Label>
                <Select value={designType} onValueChange={setDesignType}>
                  <SelectTrigger id="design-type" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logo">{language === "ar" ? "شعار" : "Logo"}</SelectItem>
                    <SelectItem value="ui">{language === "ar" ? "واجهة مستخدم" : "UI Design"}</SelectItem>
                    <SelectItem value="poster">{language === "ar" ? "ملصق" : "Poster"}</SelectItem>
                    <SelectItem value="branding">{language === "ar" ? "هوية بصرية" : "Branding"}</SelectItem>
                    <SelectItem value="packaging">{language === "ar" ? "تغليف" : "Packaging"}</SelectItem>
                    <SelectItem value="website">{language === "ar" ? "موقع ويب" : "Website"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateDesignIdea}
                disabled={generateDesignIdeaMutation.isPending}
                className="w-full"
                size="lg"
              >
                {generateDesignIdeaMutation.isPending ? (
                  <>{language === "ar" ? "جاري التوليد..." : "Generating..."}</>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    {language === "ar" ? "توليد فكرة تصميم" : "Generate Design Idea"}
                  </>
                )}
              </Button>

              {generatedDesignIdea && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {language === "ar" ? "فكرة التصميم" : "Design Idea"}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedDesignIdea)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{generatedDesignIdea}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Creative Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                {language === "ar" ? "مولد المحتوى الإبداعي" : "Creative Content Generator"}
              </CardTitle>
              <CardDescription>
                {language === "ar"
                  ? "أنشئ محتوى إبداعي للمدونات، السوشيال ميديا، والمزيد"
                  : "Create creative content for blogs, social media, and more"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content-topic">
                  {language === "ar" ? "موضوع المحتوى" : "Content Topic"}
                </Label>
                <Textarea
                  id="content-topic"
                  placeholder={language === "ar" ? "مثال: فوائد الذكاء الاصطناعي في التعليم..." : "Example: Benefits of AI in education..."}
                  value={contentTopic}
                  onChange={(e) => setContentTopic(e.target.value)}
                  className="min-h-[120px] mt-2"
                />
              </div>

              <div>
                <Label htmlFor="content-type">
                  {language === "ar" ? "نوع المحتوى" : "Content Type"}
                </Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger id="content-type" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog">{language === "ar" ? "مقال مدونة" : "Blog Post"}</SelectItem>
                    <SelectItem value="social">{language === "ar" ? "منشور سوشيال ميديا" : "Social Media"}</SelectItem>
                    <SelectItem value="email">{language === "ar" ? "بريد إلكتروني" : "Email"}</SelectItem>
                    <SelectItem value="video-script">{language === "ar" ? "سكريبت فيديو" : "Video Script"}</SelectItem>
                    <SelectItem value="ad-copy">{language === "ar" ? "إعلان" : "Ad Copy"}</SelectItem>
                    <SelectItem value="newsletter">{language === "ar" ? "نشرة بريدية" : "Newsletter"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateContent}
                disabled={generateContentMutation.isPending}
                className="w-full"
                size="lg"
              >
                {generateContentMutation.isPending ? (
                  <>{language === "ar" ? "جاري التوليد..." : "Generating..."}</>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    {language === "ar" ? "توليد المحتوى" : "Generate Content"}
                  </>
                )}
              </Button>

              {generatedContent && (
                <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      {language === "ar" ? "المحتوى المولّد" : "Generated Content"}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedContent)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{generatedContent}</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader>
            <ImageIcon className="w-8 h-8 text-purple-600 mb-2" />
            <CardTitle className="text-lg">{language === "ar" ? "صور احترافية" : "Professional Images"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {language === "ar"
                ? "أوصاف دقيقة لتوليد صور عالية الجودة"
                : "Precise prompts for high-quality image generation"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader>
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <CardTitle className="text-lg">{language === "ar" ? "كتابة إبداعية" : "Creative Writing"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {language === "ar"
                ? "قصص وروايات بأسلوب احترافي مميز"
                : "Stories and narratives with professional style"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader>
            <Palette className="w-8 h-8 text-green-600 mb-2" />
            <CardTitle className="text-lg">{language === "ar" ? "تصميم مبتكر" : "Innovative Design"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {language === "ar"
                ? "أفكار تصميم فريدة ومبتكرة لمشاريعك"
                : "Unique and innovative design ideas for your projects"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
          <CardHeader>
            <Lightbulb className="w-8 h-8 text-orange-600 mb-2" />
            <CardTitle className="text-lg">{language === "ar" ? "محتوى متنوع" : "Diverse Content"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {language === "ar"
                ? "محتوى إبداعي لجميع منصاتك الرقمية"
                : "Creative content for all your digital platforms"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
