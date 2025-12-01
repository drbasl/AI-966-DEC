# 🐳 دليل النشر الكامل على VPS - Raqim AI 966

## 📋 المتطلبات:

- **VPS** مع Ubuntu 22.04 LTS (موصى به)
- **2GB RAM** على الأقل
- **20GB SSD** على الأقل
- **Domain** (اختياري للبداية)

---

## 🌐 استئجار VPS (اختر واحد):

### 1️⃣ DigitalOcean ⭐ (موصى به)
- **الخطة**: Basic Droplet - $6/شهر
- **المواصفات**: 1GB RAM، 25GB SSD، 1TB Transfer
- **التسجيل**: https://www.digitalocean.com
- **كوبون**: $200 رصيد مجاني (60 يوم)

### 2️⃣ Hetzner 💰 (الأرخص)
- **الخطة**: CX11 - €4.15/شهر (~$4.5)
- **المواصفات**: 2GB RAM، 40GB SSD
- **التسجيل**: https://www.hetzner.com

### 3️⃣ Vultr
- **الخطة**: Regular Performance - $6/شهر
- **التسجيل**: https://www.vultr.com

---

## 🚀 خطوات النشر الكاملة:

### **المرحلة 1: إعداد السيرفر** (مرة واحدة)

#### 1. اتصل بالسيرفر:
```bash
ssh root@YOUR_SERVER_IP
```

#### 2. تحديث النظام:
```bash
apt update && apt upgrade -y
```

#### 3. تثبيت Docker & Docker Compose:
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

#### 4. تثبيت Git:
```bash
apt install git -y
```

#### 5. إنشاء مستخدم غير root (أمان):
```bash
adduser raqim
usermod -aG sudo raqim
usermod -aG docker raqim

# Switch to new user
su - raqim
```

---

### **المرحلة 2: رفع المشروع**

#### 1. استنساخ المشروع من GitHub:
```bash
cd ~
git clone https://github.com/drbasl/AI-966-DEC.git raqim-ai-966
cd raqim-ai-966
```

#### 2. نسخ ملف .env:
```bash
cp .env.example .env
nano .env
```

**عدّل القيم التالية:**
```env
DEEPSEEK_API_KEY=sk-your-actual-key
VITE_DEEPSEEK_API_KEY=sk-your-actual-key
JWT_SECRET=your-super-secret-random-string-here
DB_PASSWORD=your-secure-postgres-password
```

احفظ بـ `Ctrl+X` ثم `Y` ثم `Enter`

---

### **المرحلة 3: بناء وتشغيل المشروع**

#### 1. بناء Docker Images:
```bash
docker compose build
```

#### 2. تشغيل المشروع:
```bash
docker compose up -d
```

#### 3. التحقق من الحالة:
```bash
docker compose ps
docker compose logs -f app
```

#### 4. اختبار الموقع:
افتح المتصفح:
```
http://YOUR_SERVER_IP
```

---

### **المرحلة 4: إعداد Domain & SSL** (اختياري لكن موصى به)

#### 1. ربط Domain بالسيرفر:
- اذهب لمزود الـ Domain
- أضف **A Record**:
  - Name: `@`
  - Value: `YOUR_SERVER_IP`
- أضف **A Record** لـ www:
  - Name: `www`
  - Value: `YOUR_SERVER_IP`

#### 2. تثبيت Certbot (Let's Encrypt):
```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 3. الحصول على SSL:
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### 4. تجديد SSL تلقائياً:
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## 🔧 إدارة المشروع:

### عرض Logs:
```bash
# جميع الـ services
docker compose logs -f

# App فقط
docker compose logs -f app

# Nginx فقط
docker compose logs -f nginx
```

### إيقاف المشروع:
```bash
docker compose down
```

### إعادة تشغيل:
```bash
docker compose restart
```

### تحديث الكود:
```bash
git pull
docker compose build
docker compose up -d
```

### حذف كل شيء (البيانات):
```bash
docker compose down -v
```

---

## 📊 مراقبة الأداء:

### استهلاك الموارد:
```bash
docker stats
```

### Disk Usage:
```bash
docker system df
```

### تنظيف الـ cache:
```bash
docker system prune -a
```

---

## 🔒 الأمان (مهم جداً):

### 1. تفعيل Firewall:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

### 2. تعطيل Root Login عبر SSH:
```bash
sudo nano /etc/ssh/sshd_config
```
عدّل:
```
PermitRootLogin no
PasswordAuthentication no
```
ثم:
```bash
sudo systemctl restart sshd
```

### 3. تثبيت Fail2Ban (ضد Brute Force):
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 📈 خطة التوسع المستقبلية (3-5 سنوات):

### **السنة 1:**
- ✅ إطلاق MVP
- ✅ مراقبة Logs & Performance
- ✅ جمع Feedback

### **السنة 2:**
- 🔄 **Redis Caching** (مفعّل جاهزياً في docker-compose)
- 📊 **Analytics Dashboard**
- 🔔 **Push Notifications**

### **السنة 3:**
- ⚡ **Workers** (Background Jobs)
- 📬 **Message Queues** (RabbitMQ / Redis)
- 🗄️ **Database Scaling** (Read Replicas)

### **السنة 4-5:**
- ☸️ **Kubernetes** (Auto-scaling)
- 🌍 **Multi-Region Deployment**
- 🤖 **AI Model Fine-tuning**

---

## 🆘 حل المشاكل:

### المشكلة: Build فشل
```bash
# تنظيف وإعادة بناء
docker compose down
docker system prune -a
docker compose build --no-cache
docker compose up -d
```

### المشكلة: Container يعيد التشغيل باستمرار
```bash
docker compose logs app
# شوف الخطأ وصلحه في .env
```

### المشكلة: Out of Disk Space
```bash
docker system prune -a --volumes
```

### المشكلة: النشر بطيء
```bash
# زيادة Memory Limit
docker compose down
# عدّل docker-compose.yml
docker compose up -d
```

---

## 📞 الدعم:

للمساعدة:
- GitHub Issues: https://github.com/drbasl/AI-966-DEC/issues
- Docker Docs: https://docs.docker.com

---

## ✅ Checklist النشر:

- [ ] VPS مستأجر ومفعّل
- [ ] SSH متصل
- [ ] Docker & Docker Compose مثبت
- [ ] مشروع منسوخ من GitHub
- [ ] ملف .env معدّل بالقيم الصحيحة
- [ ] `docker compose build` نجح
- [ ] `docker compose up -d` يشتغل
- [ ] الموقع يفتح على `http://SERVER_IP`
- [ ] Domain مربوط (اختياري)
- [ ] SSL مفعّل (اختياري)
- [ ] Firewall مفعّل
- [ ] Fail2Ban مثبت

---

**🎉 مبروك! مشروعك الآن على VPS احترافي!**

**Raqim AI 966 - صُنع بـ ❤️ في السعودية 🇸🇦**
