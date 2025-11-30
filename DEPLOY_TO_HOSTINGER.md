# 🚀 دليل رفع المشروع على Hostinger

## ✅ التحديثات التي تم حفظها

تم حفظ جميع التحديثات في Git Commit:
```
f995bd9 - feat: add new main navigation and 4 major feature pages
```

### 📦 الملفات الجديدة المضافة:
- ✅ `client/src/components/MainNav.tsx` - القائمة الرئيسية
- ✅ `client/src/pages/CreativeStudio.tsx` - استوديو الإبداع
- ✅ `client/src/pages/TeachersZone.tsx` - منطقة المعلمين
- ✅ `client/src/pages/DevelopersHub.tsx` - مركز المطورين
- ✅ ChatRaqim محدث بنظام محادثة صحيح

### 🔧 التحديثات التقنية:
- ✅ إضافة `chat.publicChat` endpoint للمحادثة
- ✅ إصلاح مشكلة الردود في ChatRaqim
- ✅ تثبيت `cross-env` لدعم Windows
- ✅ تحديث `App.tsx` و `routers.ts`

---

## 📤 خطوات رفع المشروع على Hostinger

### 1️⃣ تجهيز الملفات للرفع

انتقل إلى مجلد المشروع:
```bash
cd "C:\Users\basel\.claude-worktrees\raqim-ai-966-complete نسخه من مشروعي\youthful-yonath\raqim_ai_966-9999-full-master\raqim_ai_966-9999-full-master"
```

### 2️⃣ بناء المشروع للإنتاج

```bash
pnpm build
```

سيتم إنشاء مجلدات:
- `dist/` - ملفات الـ backend المبنية
- `dist/public/` - ملفات الـ frontend المبنية

### 3️⃣ الملفات المطلوب رفعها على Hostinger

رفع هذه المجلدات/الملفات فقط:

```
📁 dist/                    # كل محتويات المجلد
📁 drizzle/                 # ملفات قاعدة البيانات
📁 server/                  # كود الـ backend الأصلي
📄 package.json
📄 pnpm-lock.yaml
📄 .env                     # تحديث متغيرات البيئة!
```

**⚠️ لا ترفع:**
- ❌ `node_modules/` (سيتم تثبيتها على السيرفر)
- ❌ `client/` (تم بناؤها داخل dist/public)
- ❌ `.claude-worktrees/`
- ❌ `.git/`

### 4️⃣ تحديث ملف `.env` على السيرفر

قبل الرفع، تأكد من تحديث `.env` بمعلومات السيرفر:

```env
# Database - استخدم معلومات قاعدة البيانات من Hostinger
DATABASE_URL=mysql://username:password@localhost:3306/database_name

# DeepSeek API
DEEPSEEK_API_KEY=sk-f68e7a3725fb44179735434e99b436b6
DEEPSEEK_API_BASE=https://api.deepseek.com
LLM_PROVIDER=deepseek

# Environment
NODE_ENV=production
PORT=3000

# App URL - غير هذا إلى دومين موقعك
VITE_APP_URL=https://yourdomain.com
```

### 5️⃣ تثبيت Dependencies على Hostinger

بعد رفع الملفات، نفذ هذه الأوامر عبر SSH:

```bash
# انتقل إلى مجلد المشروع
cd /path/to/your/project

# تثبيت pnpm إذا لم يكن مثبتاً
npm install -g pnpm

# تثبيت dependencies
pnpm install --prod

# تشغيل migrations قاعدة البيانات
pnpm db:push
```

### 6️⃣ تشغيل المشروع

```bash
# تشغيل في وضع الإنتاج
pnpm start
```

أو إذا كنت تستخدم PM2:
```bash
pm2 start dist/index.js --name raqim-ai-966
pm2 save
pm2 startup
```

---

## 🔍 التحقق من التشغيل

بعد التشغيل، افتح المتصفح على:
- `http://yourdomain.com/` - الصفحة الرئيسية
- `http://yourdomain.com/creative-studio` - استوديو الإبداع
- `http://yourdomain.com/teachers-zone` - منطقة المعلمين
- `http://yourdomain.com/workspace` - ChatRaqim
- `http://yourdomain.com/developers-hub` - مركز المطورين

---

## 📝 ملاحظات مهمة

### ✅ ما تم إنجازه:
1. ✅ إنشاء 4 صفحات جديدة كاملة الوظائف
2. ✅ تكامل مع DeepSeek API
3. ✅ واجهات مستخدم احترافية
4. ✅ دعم اللغتين العربية والإنجليزية
5. ✅ نظام محادثة صحيح في ChatRaqim
6. ✅ إخفاء التفاصيل التقنية عن المستخدم

### ⚠️ قبل الرفع على الإنتاج:
- [ ] تحديث `DATABASE_URL` في `.env`
- [ ] تحديث `VITE_APP_URL` إلى دومين الموقع
- [ ] تحديث `JWT_SECRET` بقيمة آمنة
- [ ] التأكد من صحة `DEEPSEEK_API_KEY`
- [ ] اختبار الموقع محلياً بوضع production: `NODE_ENV=production pnpm start`

---

## 🆘 حل المشاكل

### المشكلة: الموقع لا يعمل بعد الرفع
**الحل:**
```bash
# تحقق من logs
pm2 logs raqim-ai-966

# أعد تشغيل السيرفر
pm2 restart raqim-ai-966
```

### المشكلة: خطأ في قاعدة البيانات
**الحل:**
```bash
# تأكد من صحة DATABASE_URL في .env
# ثم شغل migrations
pnpm db:push
```

### المشكلة: ChatRaqim لا يرد
**الحل:**
- تحقق من صحة `DEEPSEEK_API_KEY` في `.env`
- تحقق من الـ logs: `pm2 logs`

---

## 📞 الدعم

إذا واجهت أي مشاكل، راجع:
- `HOSTINGER_DEPLOYMENT_GUIDE.md` - دليل Hostinger الكامل
- `QUICK_START.md` - دليل البدء السريع
- Server logs: `pm2 logs` أو `tail -f logs/error.log`

---

✨ **تم إنشاء هذا الملف بواسطة Claude Code**
🤖 Generated with [Claude Code](https://claude.com/claude-code)
