# 🔗 دليل تكامل API - API Integration Guide

## رقيم AI 966 - تكامل DeepSeek وAPI

---

## 📋 جدول المحتويات

1. [نظرة عامة](#overview)
2. [DeepSeek API](#deepseek)
3. [OpenAI API](#openai)
4. [Google Gemini API](#gemini)
5. [أمثلة الاستخدام](#examples)
6. [معالجة الأخطاء](#error-handling)

---

<a name="overview"></a>

## 🌟 نظرة عامة

يدعم **رقيم AI 966** التكامل مع عدة نماذج AI:

| النموذج | السعر (لكل مليون token) | الأفضل لـ | الدعم العربي |
|---------|-------------------------|-----------|--------------|
| **DeepSeek** | $0.14 | الأسئلة العامة والبرمجة | ⭐⭐⭐⭐⭐ |
| **OpenAI GPT-4** | $5.00 | المهام المعقدة | ⭐⭐⭐⭐ |
| **Gemini Flash** | مجاني | الاستخدام اليومي | ⭐⭐⭐ |
| **Claude** | $3.00 | التحليل والكتابة | ⭐⭐⭐⭐ |

---

<a name="deepseek"></a>

## 🚀 DeepSeek API

### لماذا DeepSeek؟

✅ **رخيص جداً** - 100× أرخص من GPT-4
✅ **سريع** - استجابة فورية
✅ **ذكي** - نتائج ممتازة للعربية
✅ **موثوق** - uptime 99.9%

---

### 1. الحصول على API Key

1. زر [DeepSeek Platform](https://platform.deepseek.com/)
2. سجل حساباً جديداً
3. انتقل إلى **API Keys**
4. اضغط **Create API Key**
5. انسخ المفتاح (يبدأ بـ \`sk-\`)

---

### 2. التكوين في المشروع

#### ملف \`.env\`
\`\`\`env
DEEPSEEK_API_KEY=sk-your-key-here
DEEPSEEK_API_BASE=https://api.deepseek.com
LLM_PROVIDER=deepseek
\`\`\`

---

### 3. استخدام DeepSeek Service

#### ملف: \`server/_core/deepseek.ts\`

\`\`\`typescript
import { generateText, generateJSON, chat } from './deepseek';

// مثال 1: توليد نص
const text = await generateText(
  'اكتب مقالة عن الذكاء الاصطناعي',
  'أنت كاتب محترف',
  {
    model: 'deepseek-chat',
    temperature: 0.7,
    max_tokens: 2048
  }
);

// مثال 2: توليد JSON
const analysis = await generateJSON(
  'حلل هذا النص: الذكاء الاصطناعي يغير العالم',
  'أنت محلل نصوص',
  {
    name: 'text_analysis',
    schema: {
      type: 'object',
      properties: {
        sentiment: { type: 'string' },
        keywords: { type: 'array', items: { type: 'string' } },
        summary: { type: 'string' }
      },
      required: ['sentiment', 'keywords', 'summary']
    }
  }
);

// مثال 3: محادثة
const messages = [
  { role: 'system', content: 'أنت مساعد ذكي' },
  { role: 'user', content: 'ما هو الذكاء الاصطناعي؟' }
];

const response = await chat(messages, {
  model: 'deepseek-chat',
  temperature: 0.5
});
\`\`\`

---

### 4. Parameters المتقدمة

\`\`\`typescript
interface DeepSeekRequestParams {
  model?: 'deepseek-chat' | 'deepseek-reasoner';
  messages: DeepSeekMessage[];
  temperature?: number;        // 0.0 - 2.0 (default: 0.7)
  max_tokens?: number;         // 1 - 8192 (default: 4096)
  top_p?: number;              // 0.0 - 1.0 (default: 1.0)
  frequency_penalty?: number;  // -2.0 - 2.0 (default: 0)
  presence_penalty?: number;   // -2.0 - 2.0 (default: 0)
  stop?: string[];             // كلمات التوقف
  response_format?: {
    type: 'text' | 'json_object' | 'json_schema';
    json_schema?: { ... }
  };
}
\`\`\`

---

### 5. أمثلة متقدمة

#### تحسين برومبت عربي

\`\`\`typescript
import { enhanceArabicPrompt } from './deepseek';

const enhanced = await enhanceArabicPrompt(
  'اكتب مقال عن التعليم',
  {
    usageType: 'article',
    complexity: 'متقدم',
    addExamples: true,
    humanTone: true
  }
);

console.log(enhanced);
// "اكتب مقالة شاملة عن التعليم الحديث، تتضمن:
// 1. تحليل الوضع الحالي للتعليم
// 2. التحديات التي تواجه المعلمين
// 3. دور التكنولوجيا في التعليم
// ..."
\`\`\`

#### تحليل نص

\`\`\`typescript
import { analyzeText } from './deepseek';

// تلخيص
const summary = await analyzeText(
  'نص طويل جداً...',
  'summary'
);

// تحليل مشاعر
const sentiment = await analyzeText(
  'هذا المنتج رائع جداً!',
  'sentiment'
);

// استخراج كلمات مفتاحية
const keywords = await analyzeText(
  'الذكاء الاصطناعي يغير العالم...',
  'keywords'
);
\`\`\`

---

<a name="openai"></a>

## 🤖 OpenAI API

### التكوين

\`\`\`env
OPENAI_API_KEY=sk-proj-your-key-here
\`\`\`

### الاستخدام عبر LLM Service

\`\`\`typescript
import { invokeLLM } from './llm';

const response = await invokeLLM({
  messages: [
    { role: 'system', content: 'أنت مساعد ذكي' },
    { role: 'user', content: 'مرحباً' }
  ],
  provider: 'openai',
  model: 'gpt-4o-mini'
});
\`\`\`

### النماذج المتاحة

| النموذج | السعر | الأفضل لـ |
|---------|-------|----------|
| gpt-4o | $5/M tokens | المهام المعقدة |
| gpt-4o-mini | $0.15/M tokens | الاستخدام اليومي |
| gpt-3.5-turbo | $0.50/M tokens | المهام البسيطة |

---

<a name="gemini"></a>

## 🌟 Google Gemini API

### التكوين

\`\`\`env
GEMINI_API_KEY=AIzaSy-your-key-here
\`\`\`

### الاستخدام

\`\`\`typescript
const response = await invokeLLM({
  messages: [
    { role: 'user', content: 'ما هو الذكاء الاصطناعي؟' }
  ],
  provider: 'gemini',
  model: 'gemini-2.5-flash'
});
\`\`\`

### النماذج المتاحة

- \`gemini-2.5-flash\` - سريع ومجاني
- \`gemini-1.5-pro\` - قوي ومدفوع

---

<a name="examples"></a>

## 💡 أمثلة الاستخدام

### 1. مولد البرومبتات

\`\`\`typescript
// Client-side
const mutation = trpc.prompt.generate.useMutation();

const result = await mutation.mutateAsync({
  basePrompt: 'اكتب مقال عن الذكاء الاصطناعي',
  usageType: 'article',
  options: {
    humanTone: true,
    examples: true,
    keyPoints: true,
    complexity: 'متوسط',
    engaging: false
  }
});

console.log(result.enhancedPrompt);
\`\`\`

---

### 2. محلل البرومبتات

\`\`\`typescript
const mutation = trpc.prompt.analyze.useMutation();

const analysis = await mutation.mutateAsync({
  prompt: 'اكتب قصة قصيرة'
});

console.log(analysis);
/*
{
  score: 6,
  strengths: ['واضح', 'بسيط'],
  weaknesses: ['قصير جداً', 'غير محدد'],
  suggestions: ['أضف تفاصيل أكثر', 'حدد نوع القصة'],
  improvedVersion: 'اكتب قصة قصيرة خيالية عن...'
}
*/
\`\`\`

---

### 3. محادثة AI

\`\`\`typescript
const mutation = trpc.chat.send.useMutation();

const response = await mutation.mutateAsync({
  messages: [
    { role: 'system', content: 'أنت مساعد ذكي' },
    { role: 'user', content: 'مرحباً، كيف حالك؟' }
  ],
  provider: 'deepseek',
  model: 'deepseek-chat'
});

console.log(response.response);
\`\`\`

---

### 4. مولد أوراق العمل

\`\`\`typescript
const mutation = trpc.worksheets.generate.useMutation();

const worksheet = await mutation.mutateAsync({
  generationMethod: 'text',
  questionType: 'multiple_choice',
  questionCount: 10,
  language: 'ar',
  gradeLevel: 'متوسط',
  lessonTitle: 'الذكاء الاصطناعي',
  sourceText: 'نص الدرس...'
});

console.log(worksheet.content);
\`\`\`

---

<a name="error-handling"></a>

## 🛡️ معالجة الأخطاء

### أخطاء شائعة

#### 1. API Key غير صحيح
\`\`\`typescript
try {
  await generateText('prompt');
} catch (error) {
  if (error.message.includes('API key')) {
    console.error('مفتاح API غير صحيح');
  }
}
\`\`\`

#### 2. Quota تجاوزت الحد
\`\`\`typescript
try {
  await generateText('prompt');
} catch (error) {
  if (error.message.includes('quota')) {
    console.error('تجاوزت حد الاستخدام');
    // استخدم provider بديل
    await invokeLLM({ provider: 'gemini', ... });
  }
}
\`\`\`

#### 3. Network Error
\`\`\`typescript
try {
  await generateText('prompt');
} catch (error) {
  if (error.message.includes('network')) {
    console.error('خطأ في الاتصال');
    // أعد المحاولة بعد 3 ثوان
    await new Promise(r => setTimeout(r, 3000));
    return await generateText('prompt');
  }
}
\`\`\`

---

### معالجة شاملة

\`\`\`typescript
async function safeGenerate(prompt: string) {
  const providers: ('deepseek' | 'openai' | 'gemini')[] =
    ['deepseek', 'openai', 'gemini'];

  for (const provider of providers) {
    try {
      return await invokeLLM({
        messages: [{ role: 'user', content: prompt }],
        provider
      });
    } catch (error) {
      console.error(\`\${provider} failed:\`, error);
      continue; // جرب التالي
    }
  }

  throw new Error('All providers failed');
}
\`\`\`

---

## 📊 مراقبة الاستخدام

### تسجيل المكالمات

\`\`\`typescript
// يتم حفظها تلقائياً في modelCallLogs
{
  userId: 123,
  provider: 'deepseek',
  model: 'deepseek-chat',
  promptTokens: 50,
  completionTokens: 200,
  costUsd: 0.000035,
  latencyMs: 1200,
  status: 'success'
}
\`\`\`

### استعراض الإحصائيات

\`\`\`typescript
const stats = await trpc.analytics.usage.useQuery();

console.log(stats);
/*
{
  totalCalls: 1234,
  totalCost: 1.45,
  avgLatency: 800,
  byProvider: {
    deepseek: { calls: 900, cost: 0.35 },
    openai: { calls: 200, cost: 1.00 },
    gemini: { calls: 134, cost: 0.10 }
  }
}
*/
\`\`\`

---

## 🔐 أفضل الممارسات

### 1. أمان API Keys

❌ **لا تفعل:**
\`\`\`typescript
const API_KEY = 'sk-1234567890'; // في الكود
\`\`\`

✅ **افعل:**
\`\`\`typescript
const API_KEY = process.env.DEEPSEEK_API_KEY;
\`\`\`

---

### 2. التحكم في التكلفة

\`\`\`typescript
// حدد max_tokens لتجنب الفواتير الكبيرة
await generateText(prompt, systemPrompt, {
  max_tokens: 1000  // لن يتجاوز 1000 token
});
\`\`\`

---

### 3. Caching

\`\`\`typescript
// استخدم cache للبرومبتات المتكررة
const cache = new Map();

async function getCachedResponse(prompt: string) {
  if (cache.has(prompt)) {
    return cache.get(prompt);
  }

  const response = await generateText(prompt);
  cache.set(prompt, response);
  return response;
}
\`\`\`

---

## 📞 الدعم

- **تيليجرام:** [@dr_basl](https://t.me/dr_basl)
- **تويتر:** [@hzbr_al](https://twitter.com/hzbr_al)
- **GitHub Issues:** [رفع مشكلة](https://github.com/yourusername/raqim-ai-966/issues)

---

<div align="center">

**وثيقة شاملة لتكامل AI APIs 🚀**

</div>
