# 🚀 دليل نشر مشروع Raqim AI 966

## 📋 الملفات المطلوبة للنشر:

بعد تشغيل `pnpm build`، ستحصل على:
- `public/` → ملفات Frontend
- `dist/` → ملفات Backend
- `.env` → متغيرات البيئة (API Keys)

---

## 🌐 طريقة الرفع على Render.com (موصى بها)

### 1️⃣ إنشاء حساب على Render
- اذهب إلى: https://render.com
- اضغط **Get Started**
- سجل دخول بحساب GitHub

### 2️⃣ ربط GitHub Repository
- اضغط **New +** → **Web Service**
- اختر Repository: `AI-966-DEC`
- اضغط **Connect**

### 3️⃣ إعدادات المشروع

**Name**: `raqim-ai-966`

**Root Directory**: `AI-966-NOV`
(أو المجلد اللي فيه package.json)

**Build Command**:
```bash
pnpm install && pnpm build
```

**Start Command**:
```bash
node dist/index.js
```

**Environment**: `Node`

**Plan**: **Free** ✅

### 4️⃣ إضافة Environment Variables

اضغط **Environment** → **Add Environment Variable**:

```
DEEPSEEK_API_KEY=sk-f68e7a3725fb44179735434e99b436b6
VITE_DEEPSEEK_API_KEY=sk-f68e7a3725fb44179735434e99b436b6
DEEPSEEK_API_BASE=https://api.deepseek.com
NODE_ENV=production
PORT=3000
```

### 5️⃣ نشر المشروع

- اضغط **Create Web Service**
- انتظر 5-10 دقائق لاكتمال النشر
- احصل على الرابط: `https://raqim-ai-966.onrender.com`

---

## 🔧 طريقة الرفع اليدوي (أي استضافة تدعم Node.js)

### الخطوات:

1. **رفع الملفات:**
   ```
   public/
   dist/
   package.json
   .env
   ```

2. **تشغيل الأوامر على السيرفر:**
   ```bash
   npm install --production
   node dist/index.js
   ```

3. **ضبط Port:**
   - عدل `PORT` في `.env` حسب استضافتك

4. **SSL:**
   - فعّل HTTPS من لوحة التحكم

---

## ✅ استضافات مجانية أخرى:

| الاستضافة | المميزات | الرابط |
|----------|----------|--------|
| **Render** ⭐ | سهل + مجاني كامل | https://render.com |
| **Railway** | نشر سريع من GitHub | https://railway.app |
| **Fly.io** | استضافة قوية | https://fly.io |
| **Cyclic** | بسيط جداً | https://cyclic.sh |

---

## 🔑 ملاحظات مهمة:

1. ✅ **لا تنسَ إضافة API Keys** في Environment Variables
2. ✅ **استخدم Node.js 20.x** في إعدادات الاستضافة
3. ✅ **فعّل Auto-Deploy** من GitHub
4. ⚠️ **لا ترفع ملف `.env`** إلى GitHub (يجب أن يكون في `.gitignore`)

---

## 🆘 حل المشاكل:

### المشكلة: Build فشل
**الحل**: تأكد من وجود `pnpm` في Build Command:
```bash
npm install -g pnpm && pnpm install && pnpm build
```

### المشكلة: الموقع لا يفتح
**الحل**: تأكد من:
1. `PORT=3000` في Environment Variables
2. Server يشتغل على `0.0.0.0` (مش `localhost`)

### المشكلة: API لا يعمل
**الحل**: تأكد من إضافة `DEEPSEEK_API_KEY` في Environment Variables

---

## 📞 دعم:

للمساعدة، تواصل عبر GitHub Issues:
https://github.com/drbasl/AI-966-DEC/issues

---

**صُنع بـ ❤️ في السعودية 🇸🇦**
**Raqim AI 966 - v1.0**
