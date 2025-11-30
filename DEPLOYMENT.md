# 📚 دليل النشر والتشغيل - Deployment Guide

## رقيم AI 966 - Raqim AI Platform

---

## 📋 جدول المحتويات

1. [متطلبات النظام](#requirements)
2. [إعداد البيئة المحلية](#local-setup)
3. [إعداد قاعدة البيانات](#database-setup)
4. [تكوين API Keys](#api-keys)
5. [البناء للإنتاج](#production-build)
6. [النشر على الخادم](#deployment)
7. [استكشاف الأخطاء](#troubleshooting)

---

<a name="requirements"></a>

## 🔧 متطلبات النظام

### البرمجيات المطلوبة
- **Node.js**: 20.x أو أحدث
- **pnpm**: 10.x أو أحدث
- **MySQL**: 8.0+ أو **TiDB Cloud**
- **Git**: أحدث إصدار

### التحقق من الإصدارات

\`\`\`bash
node --version   # يجب أن يكون v20.0.0 أو أعلى
pnpm --version   # يجب أن يكون 10.0.0 أو أعلى
mysql --version  # يجب أن يكون 8.0 أو أعلى
\`\`\`

---

<a name="local-setup"></a>

## 🏠 إعداد البيئة المحلية

### 1. استنساخ المشروع

\`\`\`bash
git clone https://github.com/yourusername/raqim-ai-966.git
cd raqim-ai-966
\`\`\`

### 2. تثبيت الاعتماديات

\`\`\`bash
pnpm install
\`\`\`

**ملاحظة:** قد تستغرق العملية 2-3 دقائق حسب سرعة الإنترنت.

### 3. إعداد ملف البيئة

انسخ ملف المثال:
\`\`\`bash
cp .env.example .env
\`\`\`

افتح \`.env\` وأضف التكوينات الخاصة بك (سيتم شرحها في الأقسام التالية).

---

<a name="database-setup"></a>

## 🗄️ إعداد قاعدة البيانات

### الخيار 1: MySQL محلي

#### تثبيت MySQL (Windows)
1. حمل MySQL من [الموقع الرسمي](https://dev.mysql.com/downloads/installer/)
2. اتبع معالج التثبيت
3. سجل كلمة مرور root

#### إنشاء قاعدة البيانات

\`\`\`bash
# تسجيل الدخول إلى MySQL
mysql -u root -p

# إنشاء قاعدة بيانات جديدة
CREATE DATABASE raqim_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# إنشاء مستخدم جديد
CREATE USER 'raqim_user'@'localhost' IDENTIFIED BY 'password123';

# منح الصلاحيات
GRANT ALL PRIVILEGES ON raqim_ai.* TO 'raqim_user'@'localhost';
FLUSH PRIVILEGES;

EXIT;
\`\`\`

#### تحديث \`.env\`

\`\`\`env
DATABASE_URL=mysql://raqim_user:password123@localhost:3306/raqim_ai
\`\`\`

### الخيار 2: TiDB Cloud (موصى به للإنتاج)

1. زر [TiDB Cloud](https://tidbcloud.com/)
2. سجل حساب مجاني
3. أنشئ Cluster جديد
4. احصل على Connection String
5. أضفه إلى \`.env\`:

\`\`\`env
DATABASE_URL=mysql://user:password@gateway01.region.prod.aws.tidbcloud.com:4000/raqim_ai?ssl={"rejectUnauthorized":true}
\`\`\`

### تطبيق المخططات (Migrations)

\`\`\`bash
pnpm db:push
\`\`\`

**النتيجة المتوقعة:**
\`\`\`
✓ Schema migrations applied successfully
✓ Tables created: users, savedPrompts, popularPrompts, ...
\`\`\`

---

<a name="api-keys"></a>

## 🔑 تكوين API Keys

### 1. DeepSeek API (موصى به - الأفضل للعربية)

#### الحصول على المفتاح
1. زر [DeepSeek Platform](https://platform.deepseek.com/)
2. سجل حساباً جديداً
3. انتقل إلى **API Keys**
4. اضغط **Create new key**
5. انسخ المفتاح

#### إضافة إلى \`.env\`
\`\`\`env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_API_BASE=https://api.deepseek.com
LLM_PROVIDER=deepseek
DEFAULT_LLM_PROVIDER=deepseek
\`\`\`

**التكلفة:** ~$0.14 لكل مليون token (رخيص جداً)

---

### 2. OpenAI API (بديل قوي)

#### الحصول على المفتاح
1. زر [OpenAI Platform](https://platform.openai.com/)
2. سجل الدخول أو أنشئ حساب
3. انتقل إلى **API Keys**
4. اضغط **Create new secret key**
5. انسخ المفتاح

#### إضافة إلى \`.env\`
\`\`\`env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`

**التكلفة:** ~$0.15-$5 لكل مليون token حسب النموذج

---

### 3. Google Gemini API (بديل مجاني)

#### الحصول على المفتاح
1. زر [Google AI Studio](https://makersuite.google.com/)
2. سجل الدخول بحساب Google
3. اضغط **Get API key**
4. أنشئ مفتاحاً جديداً
5. انسخ المفتاح

#### إضافة إلى \`.env\`
\`\`\`env
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx
\`\`\`

**التكلفة:** مجاني حتى حد معين

---

### 4. Anthropic Claude API (بديل ذكي)

#### الحصول على المفتاح
1. زر [Anthropic Console](https://console.anthropic.com/)
2. سجل حساباً جديداً
3. انتقل إلى **API Keys**
4. أنشئ مفتاحاً جديداً
5. انسخ المفتاح

#### إضافة إلى \`.env\`
\`\`\`env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_BASE=https://api.anthropic.com
\`\`\`

**التكلفة:** ~$3-$15 لكل مليون token

---

### ملف \`.env\` كامل

\`\`\`env
# ====================================
# RAQIM AI 966 - Environment Variables
# ====================================

# Database Configuration
DATABASE_URL=mysql://user:password@localhost:3306/raqim_ai

# JWT & Security
JWT_SECRET=raqim-ai-966-super-secret-key-2025-change-this

# OAuth Configuration (Manus Platform - اختياري)
OAUTH_SERVER_URL=https://oauth.manus.computer
VITE_APP_ID=raqim-ai-966
OWNER_OPEN_ID=owner-open-id

# ====================================
# AI Provider API Keys
# ====================================

# DeepSeek API (Primary - Recommended)
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
DEEPSEEK_API_BASE=https://api.deepseek.com

# OpenAI API (Alternative)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx

# Google Gemini API (Alternative)
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxx

# Anthropic Claude API (Alternative)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxxx
ANTHROPIC_API_BASE=https://api.anthropic.com

# ====================================
# LLM Provider Configuration
# ====================================

# Primary provider
LLM_PROVIDER=deepseek
DEFAULT_LLM_PROVIDER=deepseek

# ====================================
# Application Configuration
# ====================================

# Environment
NODE_ENV=development

# Server Port
PORT=3000

# App URL (for share links)
VITE_APP_URL=http://localhost:5173
\`\`\`

---

<a name="production-build"></a>

## 🏗️ البناء للإنتاج

### 1. تشغيل وضع التطوير أولاً

\`\`\`bash
pnpm dev
\`\`\`

افتح المتصفح على \`http://localhost:5173\` وتحقق من:
- ✅ الصفحة الرئيسية تعمل
- ✅ مولد البرومبتات يعمل
- ✅ المحادثة مع AI تعمل
- ✅ قاعدة البيانات متصلة

### 2. فحص الأخطاء

\`\`\`bash
pnpm check
\`\`\`

### 3. بناء الإنتاج

\`\`\`bash
pnpm build
\`\`\`

**النتيجة المتوقعة:**
\`\`\`
✓ 1814 modules transformed.
✓ built in 3.76s

dist/public/index.html                   371.38 kB │ gzip: 106.62 kB
dist/public/assets/index-BuYsoDQr.css    151.61 kB │ gzip:  22.81 kB
dist/public/assets/index-B5_FuJ6t.js   1,366.23 kB │ gzip: 290.93 kB
dist/index.js                              75.9 kB
\`\`\`

### 4. اختبار البناء

\`\`\`bash
pnpm start
\`\`\`

افتح \`http://localhost:3000\` وتحقق من عمل كل شيء.

---

<a name="deployment"></a>

## 🚀 النشر على الخادم

### الخيار 1: Vercel (موصى به - سهل)

#### 1. إنشاء حساب Vercel
- زر [Vercel](https://vercel.com/)
- سجل بحساب GitHub

#### 2. ربط المشروع
\`\`\`bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# رفع المشروع
vercel
\`\`\`

#### 3. إضافة متغيرات البيئة
في لوحة Vercel:
- Settings → Environment Variables
- أضف جميع المتغيرات من \`.env\`

#### 4. النشر
\`\`\`bash
vercel --prod
\`\`\`

---

### الخيار 2: VPS (Ubuntu Server)

#### 1. الاتصال بالخادم
\`\`\`bash
ssh user@your-server-ip
\`\`\`

#### 2. تثبيت المتطلبات
\`\`\`bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت pnpm
npm install -g pnpm

# تثبيت MySQL
sudo apt install -y mysql-server

# تثبيت Nginx
sudo apt install -y nginx

# تثبيت PM2
npm install -g pm2
\`\`\`

#### 3. نسخ المشروع
\`\`\`bash
cd /var/www
sudo git clone https://github.com/yourusername/raqim-ai-966.git
cd raqim-ai-966
sudo chown -R $USER:$USER .
\`\`\`

#### 4. التثبيت والبناء
\`\`\`bash
pnpm install
cp .env.example .env
nano .env  # أضف التكوينات
pnpm db:push
pnpm build
\`\`\`

#### 5. تشغيل مع PM2
\`\`\`bash
pm2 start dist/index.js --name raqim-ai
pm2 save
pm2 startup
\`\`\`

#### 6. إعداد Nginx
\`\`\`bash
sudo nano /etc/nginx/sites-available/raqim-ai
\`\`\`

أضف:
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

\`\`\`bash
sudo ln -s /etc/nginx/sites-available/raqim-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

#### 7. إضافة SSL (اختياري)
\`\`\`bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
\`\`\`

---

<a name="troubleshooting"></a>

## 🔍 استكشاف الأخطاء

### خطأ: "Cannot connect to database"

**الحل:**
\`\`\`bash
# تحقق من MySQL يعمل
sudo systemctl status mysql

# تحقق من DATABASE_URL صحيح
echo $DATABASE_URL

# اختبر الاتصال
mysql -h localhost -u raqim_user -p
\`\`\`

---

### خطأ: "API key is not configured"

**الحل:**
1. تحقق من ملف \`.env\`
2. تأكد من وجود \`DEEPSEEK_API_KEY\`
3. أعد تشغيل الخادم

---

### خطأ: "Port 3000 already in use"

**الحل:**
\`\`\`bash
# إيجاد العملية
lsof -i :3000

# إيقافها
kill -9 <PID>

# أو غيّر البورت في .env
PORT=3001
\`\`\`

---

### خطأ: Build فشل

**الحل:**
\`\`\`bash
# مسح الكاش
rm -rf node_modules dist .pnpm-store
pnpm install
pnpm build
\`\`\`

---

## 📞 الدعم الفني

إذا واجهت مشاكل:

1. راجع [Issues على GitHub](https://github.com/yourusername/raqim-ai-966/issues)
2. تواصل على **تيليجرام:** [@dr_basl](https://t.me/dr_basl)
3. تواصل على **تويتر:** [@hzbr_al](https://twitter.com/hzbr_al)

---

## ✅ Checklist قبل النشر

- [ ] اختبرت المشروع محلياً
- [ ] أضفت جميع API keys
- [ ] قاعدة البيانات تعمل
- [ ] Build نجح بدون أخطاء
- [ ] اختبرت جميع الميزات
- [ ] أضفت SSL للموقع
- [ ] عملت backup لقاعدة البيانات

---

<div align="center">

**نتمنى لك نشراً موفقاً! 🚀**

</div>
