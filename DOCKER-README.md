# 🐳 Raqim AI 966 - Docker Setup

## 📦 ما تم إنشاؤه:

```
raqim-ai-966/
├── Dockerfile              → Multi-stage build للمشروع
├── docker-compose.yml      → إدارة جميع الـ Services
├── .dockerignore          → تحسين سرعة البناء
├── deploy.sh              → سكريبت نشر تلقائي
├── nginx/
│   └── nginx.conf         → Reverse Proxy configuration
├── .env.example           → قالب متغيرات البيئة
└── VPS-DEPLOYMENT-GUIDE.md → دليل النشر الكامل على VPS
```

---

## 🚀 البداية السريعة:

### 1️⃣ **نسخ ملف .env:**
```bash
cp .env.example .env
```

عدّل القيم في `.env`:
```env
DEEPSEEK_API_KEY=your-actual-api-key
VITE_DEEPSEEK_API_KEY=your-actual-api-key
JWT_SECRET=your-secret-key
```

### 2️⃣ **بناء وتشغيل:**
```bash
# استخدام السكريبت التلقائي
chmod +x deploy.sh
./deploy.sh

# أو يدوياً:
docker compose build
docker compose up -d
```

### 3️⃣ **الوصول للموقع:**
```
http://localhost
```

---

## 🏗️ البنية المعمارية:

```
┌─────────────────────────────────────────┐
│         Nginx Reverse Proxy             │
│    (Port 80/443 → SSL + Load Balancing) │
└───────────────┬─────────────────────────┘
                │
    ┌───────────┴───────────┐
    │                       │
┌───▼────────┐    ┌────────▼────┐
│   Raqim    │    │   Static    │
│   App      │    │   Files     │
│ (Node.js)  │    │  (public/)  │
│  Port 3000 │    │             │
└────┬───────┘    └─────────────┘
     │
     ├───────────┬──────────────┐
     │           │              │
┌────▼────┐ ┌───▼─────┐ ┌─────▼──────┐
│  Redis  │ │ Postgres│ │   Future   │
│ (Cache) │ │  (DB)   │ │  Services  │
│ Port    │ │ Port    │ │  (Workers, │
│ 6379    │ │ 5432    │ │   Queues)  │
└─────────┘ └─────────┘ └────────────┘
```

---

## 🛠️ الأوامر المتاحة:

### إدارة المشروع:
```bash
# بناء Images
docker compose build

# تشغيل في الخلفية
docker compose up -d

# إيقاف
docker compose down

# إعادة التشغيل
docker compose restart

# عرض الحالة
docker compose ps
```

### مراقبة Logs:
```bash
# جميع الـ containers
docker compose logs -f

# Container معين
docker compose logs -f app
docker compose logs -f nginx
docker compose logs -f redis
docker compose logs -f postgres
```

### تنظيف:
```bash
# إيقاف وحذف Volumes
docker compose down -v

# تنظيف النظام
docker system prune -a
```

---

## 📊 مراقبة الأداء:

### استهلاك الموارد:
```bash
docker stats
```

### حجم Images:
```bash
docker images
```

### Disk Usage:
```bash
docker system df
```

---

## 🔧 التكوين:

### Environment Variables (`.env`):

| Variable | Description | Required |
|----------|-------------|----------|
| `DEEPSEEK_API_KEY` | DeepSeek API Key | ✅ |
| `VITE_DEEPSEEK_API_KEY` | Frontend API Key | ✅ |
| `JWT_SECRET` | JWT Secret for auth | ✅ |
| `NODE_ENV` | Environment (production) | ✅ |
| `PORT` | App port (default: 3000) | ✅ |
| `DATABASE_URL` | PostgreSQL connection | ⚠️ |
| `DB_USER` | Postgres user | ⚠️ |
| `DB_PASSWORD` | Postgres password | ⚠️ |
| `DB_NAME` | Database name | ⚠️ |

### Nginx Configuration:

- **Port 80**: HTTP → Redirect to HTTPS
- **Port 443**: HTTPS (SSL/TLS)
- **Rate Limiting**:
  - API: 10 req/s
  - General: 30 req/s
- **Gzip**: Enabled
- **Caching**: Static files (1 year)

---

## 🌐 النشر على VPS:

راجع الدليل الكامل: [VPS-DEPLOYMENT-GUIDE.md](./VPS-DEPLOYMENT-GUIDE.md)

### خطوات سريعة:

1. **استئجار VPS** (DigitalOcean/Hetzner)
2. **تثبيت Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```
3. **نسخ المشروع:**
   ```bash
   git clone https://github.com/drbasl/AI-966-DEC.git
   cd AI-966-DEC
   ```
4. **إعداد .env:**
   ```bash
   cp .env.example .env
   nano .env
   ```
5. **النشر:**
   ```bash
   ./deploy.sh
   ```

---

## 🔒 الأمان:

### ✅ مدمج:
- ✅ **Non-root user** في Docker
- ✅ **Health checks** لكل container
- ✅ **Security headers** (X-Frame-Options, XSS Protection)
- ✅ **Rate limiting** (API + General)
- ✅ **Gzip compression**

### ⚠️ يجب تفعيله على VPS:
- ⚠️ **Firewall (ufw)**
- ⚠️ **Fail2Ban**
- ⚠️ **SSL/TLS (Let's Encrypt)**
- ⚠️ **تعطيل Root SSH**

---

## 📈 خطة التوسع:

### المرحلة 1 (الحالية):
- ✅ Nginx + App + Redis + Postgres
- ✅ Docker Compose
- ✅ Health checks

### المرحلة 2 (الأشهر 6-12):
- 🔄 **Horizontal Scaling** (Multiple app instances)
- 📊 **Monitoring** (Prometheus + Grafana)
- 🔔 **Alerting** (Discord/Email notifications)

### المرحلة 3 (السنة 2-3):
- ⚡ **Background Workers** (Bull/BullMQ)
- 📬 **Message Queue** (RabbitMQ)
- 🗄️ **Database Read Replicas**
- 🔄 **Load Balancer** (HAProxy/Nginx+)

### المرحلة 4 (السنة 3-5):
- ☸️ **Kubernetes Migration**
- 🌍 **Multi-Region Deployment**
- 🤖 **AI Model Fine-tuning infrastructure**
- 📊 **Advanced Analytics**

---

## 🆘 حل المشاكل:

### Build فشل:
```bash
docker compose down
docker system prune -a
docker compose build --no-cache
docker compose up -d
```

### Container يعيد التشغيل:
```bash
docker compose logs app
# شوف الخطأ وصلحه
```

### Out of Memory:
```bash
# عدّل docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
```

### Port مستخدم:
```bash
# شوف من يستخدم Port 80
sudo lsof -i :80
# أوقفه أو غيّر Port في docker-compose.yml
```

---

## 📚 الموارد:

- **Docker Docs**: https://docs.docker.com
- **Docker Compose**: https://docs.docker.com/compose
- **Nginx**: https://nginx.org/en/docs
- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices

---

## 📞 الدعم:

- **GitHub Issues**: https://github.com/drbasl/AI-966-DEC/issues
- **Documentation**: [VPS-DEPLOYMENT-GUIDE.md](./VPS-DEPLOYMENT-GUIDE.md)

---

**🎉 Docker setup جاهز للإنتاج!**

**Raqim AI 966 - صُنع بـ ❤️ في السعودية 🇸🇦**
