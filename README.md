# 🚀 رقيم AI 966 - Raqim AI Platform

<div align="center">

![Raqim AI Logo](./client/public/logo.svg)

**منصة عربية متكاملة لتوليد البرومبتات الذكية وأدوات الذكاء الاصطناعي**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933)](https://nodejs.org/)

[العربية](#ar) | [English](#en)

</div>

---

<a name="ar"></a>

## 📖 نظرة عامة

**رقيم AI 966** هو موقع ويب عربي متكامل يوفر مجموعة من الأدوات الذكية لتحسين وتوليد البرومبتات، تحليل النصوص، إنشاء أوراق العمل التعليمية، والمحادثة مع نماذج الذكاء الاصطناعي المتقدمة.

### ✨ الميزات الرئيسية

- 🎯 **مولد البرومبتات الذكي** - تحسين وتوليد برومبتات احترافية بالذكاء الاصطناعي
- 💬 **محادثة AI متقدمة** - تحدث مع DeepSeek، OpenAI، Gemini، وClaude
- 📊 **محلل البرومبتات** - تحليل جودة البرومبتات مع اقتراحات التحسين
- 📝 **مولد أوراق العمل** - إنشاء أوراق عمل تعليمية تلقائياً
- 📚 **مكتبة شخصية** - حفظ وإدارة البرومبتات المفضلة
- 🔗 **مشاركة اجتماعية** - شارك البرومبتات مع روابط عامة
- 🌓 **وضع داكن/فاتح** - دعم كامل للثيمات
- 🌍 **دعم RTL** - تصميم متجاوب للغة العربية

---

## 🛠️ التقنيات المستخدمة

### Frontend
- **React 19.1** - مكتبة واجهة المستخدم
- **TypeScript 5.9** - لغة البرمجة
- **Vite 7** - أداة البناء والتطوير
- **Tailwind CSS 4** - إطار عمل التصميم
- **shadcn/ui** - مكتبة المكونات
- **tRPC** - اتصال نوع آمن مع Backend
- **Wouter** - التوجيه (Routing)

### Backend
- **Node.js** - بيئة التشغيل
- **Express 4** - إطار عمل الخادم
- **tRPC 11** - API نوع آمن
- **Drizzle ORM** - قاعدة البيانات
- **MySQL/TiDB** - قاعدة البيانات

### AI Providers
- **DeepSeek API** - نموذج رئيسي للعربية
- **OpenAI GPT** - بديل قوي
- **Google Gemini** - بديل سريع
- **Anthropic Claude** - بديل ذكي

---

## 📦 التثبيت والتشغيل

### المتطلبات
- Node.js 20 أو أحدث
- pnpm 10 أو أحدث
- MySQL 8 أو TiDB

### 1. استنساخ المشروع

\`\`\`bash
git clone https://github.com/yourusername/raqim-ai-966.git
cd raqim-ai-966
\`\`\`

### 2. تثبيت الاعتماديات

\`\`\`bash
pnpm install
\`\`\`

### 3. إعداد متغيرات البيئة

انسخ ملف \`.env.example\` إلى \`.env\` وأضف مفاتيح API الخاصة بك:

\`\`\`bash
cp .env.example .env
\`\`\`

**ملف \`.env\` المطلوب:**

\`\`\`env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/raqim_ai

# JWT Secret
JWT_SECRET=your-super-secret-key

# DeepSeek API (موصى به للعربية)
DEEPSEEK_API_KEY=your-deepseek-api-key
LLM_PROVIDER=deepseek

# OpenAI API (اختياري)
OPENAI_API_KEY=your-openai-api-key

# Gemini API (اختياري)
GEMINI_API_KEY=your-gemini-api-key

# Anthropic API (اختياري)
ANTHROPIC_API_KEY=your-anthropic-api-key
\`\`\`

### 4. إعداد قاعدة البيانات

\`\`\`bash
pnpm db:push
\`\`\`

### 5. تشغيل المشروع

**وضع التطوير:**
\`\`\`bash
pnpm dev
\`\`\`

**بناء للإنتاج:**
\`\`\`bash
pnpm build
pnpm start
\`\`\`

الموقع سيعمل على: \`http://localhost:5173\`

---

## 📁 هيكل المشروع

\`\`\`
raqim_ai_966/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # مكونات UI
│   │   ├── pages/         # صفحات التطبيق
│   │   ├── contexts/      # React Contexts
│   │   ├── hooks/         # Custom Hooks
│   │   └── lib/           # مكتبات مساعدة
│   └── public/            # ملفات ثابتة
├── server/                # Backend (Express + tRPC)
│   ├── _core/            # البنية الأساسية
│   │   ├── llm.ts        # خدمة AI العامة
│   │   ├── deepseek.ts   # خدمة DeepSeek
│   │   └── trpc.ts       # إعداد tRPC
│   ├── routers.ts        # مسارات API
│   └── db.ts             # قاعدة البيانات
├── drizzle/              # مخطط قاعدة البيانات
└── shared/               # كود مشترك
\`\`\`

---

## 🔑 الحصول على مفاتيح API

### DeepSeek (موصى به)
1. زر [DeepSeek Platform](https://platform.deepseek.com/)
2. سجل حساب جديد
3. انتقل إلى API Keys
4. أنشئ مفتاح API جديد
5. انسخه إلى \`DEEPSEEK_API_KEY\`

### OpenAI
1. زر [OpenAI Platform](https://platform.openai.com/)
2. API Keys → Create new secret key
3. انسخه إلى \`OPENAI_API_KEY\`

### Google Gemini
1. زر [Google AI Studio](https://makersuite.google.com/)
2. Get API Key
3. انسخه إلى \`GEMINI_API_KEY\`

---

## 🎨 الصفحات الرئيسية

| الصفحة | المسار | الوصف |
|--------|-------|-------|
| الرئيسية | \`/\` | صفحة الترحيب والميزات |
| المولد | \`/\` (قسم) | أداة توليد البرومبتات |
| المحلل | \`/analyzer\` | تحليل البرومبتات |
| المكتبة | \`/my-library\` | مكتبة البرومبتات الشخصية |
| الدردشة | \`/ai-chat\` | محادثة AI متقدمة |
| Workspace | \`/workspace\` | مساحة عمل AI |
| أوراق العمل | \`/worksheets\` | مولد أوراق العمل |
| Dashboard | \`/dashboard\` | لوحة التحكم |
| السجل | \`/history\` | سجل الأنشطة |

---

## 🔧 أوامر npm المتاحة

| الأمر | الوصف |
|------|------|
| \`pnpm dev\` | تشغيل وضع التطوير |
| \`pnpm build\` | بناء للإنتاج |
| \`pnpm start\` | تشغيل الإنتاج |
| \`pnpm check\` | فحص TypeScript |
| \`pnpm db:push\` | تحديث قاعدة البيانات |
| \`pnpm format\` | تنسيق الكود |

---

## 🌐 API Documentation

### tRPC Endpoints

#### **Prompt Generation**
\`\`\`typescript
prompt.generate({
  basePrompt: string,
  usageType: "social" | "code" | "education" | "crypto" | "article" | "exam",
  options: {
    humanTone: boolean,
    examples: boolean,
    keyPoints: boolean,
    complexity: "بسيط" | "متوسط" | "متقدم",
    engaging: boolean,
  }
})
\`\`\`

#### **Chat**
\`\`\`typescript
chat.send({
  messages: Message[],
  provider?: "deepseek" | "openai" | "gemini" | "anthropic",
  model?: string,
})
\`\`\`

#### **Saved Prompts**
\`\`\`typescript
savedPrompts.list()
savedPrompts.create({ title, basePrompt, enhancedPrompt, usageType })
savedPrompts.delete({ id })
savedPrompts.toggleFavorite({ id })
\`\`\`

---

## 📸 لقطات الشاشة

*(سيتم إضافة لقطات الشاشة قريباً)*

---

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المشروع
2. إنشاء فرع للميزة (\`git checkout -b feature/AmazingFeature\`)
3. Commit التغييرات (\`git commit -m 'Add amazing feature'\`)
4. Push للفرع (\`git push origin feature/AmazingFeature\`)
5. فتح Pull Request

---

## 📄 الرخصة

MIT License - راجع ملف [LICENSE](LICENSE) للتفاصيل

---

## 👨‍💻 التواصل

- **تيليجرام:** [@dr_basl](https://t.me/dr_basl)
- **تويتر:** [@hzbr_al](https://twitter.com/hzbr_al)

---

## 🙏 شكر وتقدير

- [shadcn/ui](https://ui.shadcn.com/) - مكتبة المكونات
- [DeepSeek](https://www.deepseek.com/) - نموذج AI
- [Manus Platform](https://manus.computer/) - منصة الاستضافة

---

<div align="center">

**صنع بـ ❤️ في السعودية**

v1.0.0 | 2025

</div>

---

<a name="en"></a>

# 🚀 Raqim AI 966 - AI Platform

## Overview

**Raqim AI 966** is a comprehensive Arabic web platform providing intelligent tools for prompt generation, text analysis, educational worksheet creation, and advanced AI chat with multiple models.

## Quick Start

\`\`\`bash
# Clone
git clone https://github.com/yourusername/raqim-ai-966.git

# Install
pnpm install

# Setup env
cp .env.example .env
# Add your API keys to .env

# Run database migrations
pnpm db:push

# Development
pnpm dev

# Production build
pnpm build
pnpm start
\`\`\`

## Key Features

- ✅ AI Prompt Generator
- ✅ Advanced AI Chat (DeepSeek, OpenAI, Gemini, Claude)
- ✅ Prompt Analyzer
- ✅ Worksheet Generator
- ✅ Personal Library
- ✅ Social Sharing
- ✅ Dark/Light Mode
- ✅ RTL Support

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui
**Backend:** Node.js, Express, tRPC, Drizzle ORM, MySQL
**AI:** DeepSeek, OpenAI, Gemini, Claude

## License

MIT License

---

Made with ❤️ in Saudi Arabia
