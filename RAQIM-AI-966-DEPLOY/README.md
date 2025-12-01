# 🚀 Raqim AI 966 - ملفات النشر الجاهزة

## 📦 الملفات الموجودة:

```
RAQIM-AI-966-DEPLOY/
├── public/                  → Frontend (React App)
├── dist/                    → Backend (Node.js Server)
├── package.json             → Dependencies
├── .env                     → Environment Variables (API Keys)
├── DEPLOYMENT-GUIDE.md      → دليل النشر الكامل
└── README.md                → هذا الملف
```

---

## 🌐 استضافات مجانية موصى بها:

### 1️⃣ **Render.com** ⭐ (الأفضل)
- ✅ مجاني 100%
- ✅ نشر تلقائي من GitHub
- ✅ SSL مجاني
- 🔗 https://render.com

### 2️⃣ **Railway.app**
- ✅ نشر سهل وسريع
- 🔗 https://railway.app

### 3️⃣ **Fly.io**
- ✅ استضافة قوية
- 🔗 https://fly.io

---

## 🚀 خطوات النشر السريعة على Render:

### 1. إنشاء حساب:
- اذهب إلى: https://render.com
- سجل دخول بحساب GitHub

### 2. إنشاء Web Service:
- اضغط **New +** → **Web Service**
- اختر Repository: `AI-966-DEC`

### 3. الإعدادات:

**Name**: `raqim-ai-966`

**Build Command**:
```bash
pnpm install && pnpm build
```

**Start Command**:
```bash
node dist/index.js
```

**Environment**: `Node`
**Node Version**: `20.x`

### 4. Environment Variables:

أضف هذه المتغيرات من ملف `.env`:
```
DEEPSEEK_API_KEY=sk-f68e7a3725fb44179735434e99b436b6
VITE_DEEPSEEK_API_KEY=sk-f68e7a3725fb44179735434e99b436b6
DEEPSEEK_API_BASE=https://api.deepseek.com
NODE_ENV=production
PORT=3000
```

### 5. نشر:
- اضغط **Create Web Service**
- انتظر 5-10 دقائق
- احصل على الرابط: `https://raqim-ai-966.onrender.com`

---

## 🔧 رفع يدوي (أي سيرفر Node.js):

```bash
# 1. رفع الملفات على السيرفر
# 2. تشغيل الأوامر:
npm install --production
node dist/index.js
```

---

## ⚠️ ملاحظات مهمة:

1. ✅ **لا تنسَ إضافة API Keys** في Environment Variables
2. ✅ **استخدم Node.js 20.x**
3. ⚠️ **لا ترفع ملف `.env`** على GitHub (خاص فقط بالسيرفر)
4. ✅ **فعّل HTTPS** (تلقائي في Render/Railway/Fly)

---

## 📖 للمزيد من التفاصيل:
اقرأ ملف `DEPLOYMENT-GUIDE.md` للتعليمات الكاملة.

---

## 🎉 تم!

بعد النشر، موقعك سيكون جاهز على:
`https://اسم-مشروعك.onrender.com`

---

**صُنع بـ ❤️ في السعودية 🇸🇦**
**Raqim AI 966 - v1.0**
