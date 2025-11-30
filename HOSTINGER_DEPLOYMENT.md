# 🚀 نشر رقيم AI 966 على Hostinger

## دليل شامل خطوة-بخطوة

---

## 📋 جدول المحتويات

1. [اختيار الباقة المناسبة](#package)
2. [إعداد الحساب](#setup)
3. [رفع المشروع](#upload)
4. [إعداد قاعدة البيانات](#database)
5. [تكوين Node.js](#nodejs)
6. [ربط الدومين](#domain)
7. [SSL وHTTPS](#ssl)
8. [الاختبار النهائي](#testing)

---

<a name="package"></a>

## 1️⃣ اختيار الباقة المناسبة

### الخيارات المتاحة:

#### ⭐ Premium Hosting ($2.99/شهر)
**مناسب لـ:**
- ✅ المشاريع الصغيرة
- ✅ الاختبار والتطوير
- ✅ حركة مرور متوسطة (10k زيارة/شهر)

**المواصفات:**
- 100 GB Storage
- ~25,000 Visits/month
- 2 CPUs
- 2 GB RAM

**تقييم:** ⭐⭐⭐ مقبول للبداية

---

#### 🌟 Business Hosting ($3.99/شهر)
**مناسب لـ:**
- ✅ المشاريع المتوسطة
- ✅ حركة مرور جيدة (25k زيارة/شهر)
- ✅ أداء أفضل

**المواصفات:**
- 200 GB Storage
- ~100,000 Visits/month
- 4 CPUs
- 4 GB RAM
- Daily backups

**تقييم:** ⭐⭐⭐⭐ موصى به

---

#### 💎 VPS Hosting ($4.99/شهر)
**مناسب لـ:**
- ✅ المشاريع الكبيرة
- ✅ تحكم كامل
- ✅ حركة مرور عالية

**المواصفات:**
- 50 GB Storage (SSD)
- 1 TB Bandwidth
- 1 vCPU
- 4 GB RAM
- Full root access

**تقييم:** ⭐⭐⭐⭐⭐ الأفضل للإنتاج

---

### 🎯 التوصية لمشروع رقيم AI:

**للبداية:** Business Hosting ($3.99/شهر)
**للنمو:** VPS Hosting ($4.99/شهر)

**لماذا؟**
- رقيم AI يستخدم Node.js + React
- يحتاج MySQL database
- يحتاج موارد معقولة للـ AI APIs

---

<a name="setup"></a>

## 2️⃣ إعداد الحساب

### خطوات التسجيل:

1. **اذهب إلى:** https://www.hostinger.com/

2. **اختر الباقة:** Business Hosting أو VPS

3. **اختر المدة:**
   - 12 شهر: خصم 50%
   - 24 شهر: خصم 60%
   - 48 شهر: خصم 75% (الأفضل)

4. **اختر دومين:**
   - دومين مجاني لأول سنة
   - مثال: `raqim-ai.com` أو `raqim966.com`

5. **أكمل الدفع:**
   - بطاقة ائتمان
   - PayPal
   - أو طرق دفع محلية

---

<a name="upload"></a>

## 3️⃣ رفع المشروع

### الطريقة 1: عبر Git (موصى به) ⭐

#### خطوة A: تفعيل Git في Hostinger

1. سجل دخول إلى **hPanel**
2. اذهب إلى **Advanced** → **Git**
3. اضغط **Create Repository**

#### خطوة B: رفع من GitHub

```bash
# في hPanel Terminal
cd domains/your-domain.com

# استنساخ المشروع
git clone https://github.com/YOUR_USERNAME/raqim-ai-966.git .

# تثبيت الاعتماديات
npm install -g pnpm
pnpm install
```

---

### الطريقة 2: عبر FTP/SFTP

#### خطوة A: الحصول على بيانات FTP

في hPanel:
1. **Files** → **FTP Accounts**
2. انسخ:
   - Hostname
   - Username
   - Password

#### خطوة B: رفع الملفات

استخدم **FileZilla** أو **WinSCP**:

1. **Host:** ftp.your-domain.com
2. **Username:** [من hPanel]
3. **Password:** [من hPanel]
4. **Port:** 21 (FTP) أو 22 (SFTP)

5. **ارفع:**
   ```
   المجلد المحلي → domains/your-domain.com/public_html
   ```

---

<a name="database"></a>

## 4️⃣ إعداد قاعدة البيانات MySQL

### خطوة A: إنشاء Database

في hPanel:

1. **Databases** → **MySQL Databases**
2. اضغط **Create Database**
3. **Database name:** `raqim_ai`
4. **Username:** `raqim_user`
5. **Password:** [قوية]
6. اضغط **Create**

### خطوة B: استيراد Schema

```bash
# في Hostinger Terminal
cd domains/your-domain.com
pnpm db:push
```

**أو عبر phpMyAdmin:**

1. **Databases** → **phpMyAdmin**
2. اختر `raqim_ai`
3. **Import** → رفع `drizzle/schema.sql`

### خطوة C: تحديث .env

```bash
# في Hostinger File Manager
nano .env
```

أضف:
```env
DATABASE_URL=mysql://raqim_user:password@localhost:3306/raqim_ai
```

---

<a name="nodejs"></a>

## 5️⃣ تكوين Node.js

### للـ Shared Hosting:

في hPanel:

1. **Advanced** → **Node.js**
2. اضغط **Setup Node.js Application**

**التكوين:**
```
Application root: /domains/your-domain.com
Application URL: your-domain.com
Application startup file: dist/index.js
Node.js version: 20.x
```

3. اضغط **Create**

---

### للـ VPS:

#### تثبيت Node.js 20:

```bash
# SSH إلى VPS
ssh root@your-vps-ip

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# تثبيت pnpm
npm install -g pnpm

# تثبيل PM2
npm install -g pm2
```

#### نشر المشروع:

```bash
cd /var/www/raqim-ai-966

# تثبيت
pnpm install

# بناء
pnpm build

# تشغيل مع PM2
pm2 start dist/index.js --name raqim-ai
pm2 save
pm2 startup
```

---

<a name="domain"></a>

## 6️⃣ ربط الدومين

### إذا اشتريت دومين من Hostinger:

✅ **تلقائي!** لا حاجة لإعدادات.

---

### إذا اشتريت دومين من مكان آخر:

في مزود الدومين (GoDaddy, Namecheap...):

1. **DNS Settings**
2. **A Record:**
   ```
   Type: A
   Name: @
   Value: [IP من Hostinger]
   ```

3. **CNAME Record:**
   ```
   Type: CNAME
   Name: www
   Value: your-domain.com
   ```

انتظر 24-48 ساعة للتفعيل.

---

<a name="ssl"></a>

## 7️⃣ SSL وHTTPS (مجاني)

في hPanel:

1. **Security** → **SSL**
2. اختر دومينك
3. اضغط **Install SSL**
4. اختر **Let's Encrypt** (مجاني)
5. ✅ تفعيل تلقائي!

**تأكد من HTTPS:**
```
https://your-domain.com
```

---

<a name="testing"></a>

## 8️⃣ الاختبار النهائي

### Checklist:

```
✅ الموقع يفتح: https://your-domain.com
✅ الصفحة الرئيسية تعمل
✅ مولد البرومبتات يعمل
✅ محادثة AI تعمل
✅ قاعدة البيانات متصلة
✅ API keys مضافة
✅ SSL مفعّل (HTTPS)
```

---

## 🔧 إعدادات إضافية مهمة

### 1. متغيرات البيئة

في hPanel → **Node.js App** → **Environment Variables**:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://...
DEEPSEEK_API_KEY=sk-...
JWT_SECRET=...
VITE_APP_URL=https://your-domain.com
```

---

### 2. تحسين الأداء

```bash
# في Terminal
# تفعيل Gzip
nano .htaccess
```

أضف:
```apache
# Enable Gzip Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

### 3. Nginx Configuration (VPS فقط)

```bash
nano /etc/nginx/sites-available/raqim-ai
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /assets {
        alias /var/www/raqim-ai-966/dist/public/assets;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
ln -s /etc/nginx/sites-available/raqim-ai /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 💰 تكلفة متوقعة

### Hostinger Costs:

| البند | التكلفة/شهر | ملاحظات |
|------|-------------|---------|
| Business Hosting | $3.99 | سنتين مقدماً |
| أو VPS | $4.99 | شهرياً |
| Domain | $0 (أول سنة) | بعدها ~$10/سنة |
| SSL | $0 | مجاني (Let's Encrypt) |
| **المجموع** | **$4-5/شهر** | + DeepSeek API |

### API Costs (DeepSeek):

- 10,000 استعلام/شهر = ~$5-10
- **إجمالي التشغيل:** $10-15/شهر

---

## 🆚 مقارنة مع البدائل

| المزود | السعر/شهر | السهولة | الأداء | التوصية |
|--------|-----------|---------|---------|----------|
| **Hostinger** | $4-5 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ممتاز |
| Vercel | $0-20 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ممتاز (Serverless) |
| DigitalOcean | $6 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | للمحترفين |
| AWS | $10+ | ⭐⭐ | ⭐⭐⭐⭐⭐ | معقد |

---

## 🔄 التحديثات المستقبلية

### Git Pull للتحديثات:

```bash
# SSH إلى Hostinger
cd domains/your-domain.com

# سحب التحديثات
git pull origin main

# إعادة البناء
pnpm build

# إعادة التشغيل
pm2 restart raqim-ai
```

---

## 🛡️ النسخ الاحتياطي

### يومياً (تلقائي في Business/VPS):

Hostinger → **Backups** → **Create Backup**

### يدوياً:

```bash
# Database backup
mysqldump -u raqim_user -p raqim_ai > backup.sql

# Files backup
tar -czf raqim-backup.tar.gz domains/your-domain.com/
```

---

## 📞 الدعم الفني

### Hostinger Support:

- **Live Chat:** 24/7 (عربي متاح)
- **Email:** support@hostinger.com
- **Knowledge Base:** https://support.hostinger.com

### مشاكل شائعة:

#### خطأ: "Node.js app not starting"
✅ تحقق من `package.json` scripts
✅ تحقق من `NODE_ENV=production`

#### خطأ: "Database connection failed"
✅ تحقق من `DATABASE_URL` في `.env`
✅ تحقق من MySQL user permissions

---

## ✅ Checklist النشر النهائي

قبل الإطلاق:

```
✅ رفع الكود على Hostinger
✅ قاعدة البيانات تعمل
✅ API keys مضافة
✅ SSL مفعّل
✅ Domain مربوط
✅ Node.js app يعمل
✅ اختبار جميع الميزات
✅ Backup أولي
✅ مراقبة الأداء
```

---

<div align="center">

**🚀 جاهز للإطلاق على Hostinger!**

**وقت النشر المتوقع:** 30-60 دقيقة

</div>

---

## 🎯 الخطوة التالية

بعد النشر على Hostinger:

1. ✅ رفع على GitHub (نسخة احتياطية)
2. ✅ إنشاء Release v1.0.0
3. ✅ مشاركة الموقع
4. 🎉 الاحتفال بالإطلاق!
