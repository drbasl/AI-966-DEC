# ⚡ Quick Start - رقيم AI 966

## 🚀 تشغيل المشروع في 5 دقائق

---

## 📋 المتطلبات

✅ Node.js 20+
✅ pnpm 10+
✅ حساب DeepSeek (مجاني)

---

## 🎯 خطوات سريعة

### 1. Clone المشروع

```bash
git clone https://github.com/YOUR_USERNAME/raqim-ai-966.git
cd raqim-ai-966
```

### 2. Install Dependencies

```bash
pnpm install
```

⏱️ سيستغرق ~2 دقيقة

---

### 3. احصل على DeepSeek API Key (مجاني)

1. زر: https://platform.deepseek.com/
2. سجل حساب جديد
3. اذهب إلى **API Keys**
4. اضغط **Create new key**
5. انسخ المفتاح

---

### 4. إعداد البيئة

```bash
# انسخ ملف المثال
cp .env.example .env

# افتح .env واستبدل:
# DEEPSEEK_API_KEY=your-key-here
```

**أو يدوياً:**
```env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxx
LLM_PROVIDER=deepseek
```

---

### 5. قاعدة البيانات (اختياري للبداية)

**للتجربة فقط** - يمكن تخطي هذه الخطوة

```bash
# إعداد MySQL محلي أو TiDB Cloud
DATABASE_URL=mysql://user:pass@localhost:3306/raqim_ai

# تطبيق المخططات
pnpm db:push
```

**أو** استخدم TiDB Cloud (مجاني):
https://tidbcloud.com/

---

### 6. تشغيل المشروع

```bash
pnpm dev
```

**النتيجة:**
```
VITE v7.1.9  ready in 234 ms
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

---

### 7. افتح المتصفح

```
http://localhost:5173
```

🎉 **تهانينا! المشروع يعمل الآن!**

---

## 🧪 اختبر الميزات

### مولد البرومبتات
1. اذهب إلى الصفحة الرئيسية
2. اكتب: "اكتب مقال عن الذكاء الاصطناعي"
3. اختر نوع: "article"
4. اضغط "توليد" ✨

### محادثة AI
1. اذهب إلى: http://localhost:5173/ai-chat
2. اكتب سؤال: "ما هو الذكاء الاصطناعي؟"
3. اضغط Enter 💬

### محلل البرومبتات
1. اذهب إلى: http://localhost:5173/analyzer
2. الصق برومبت
3. اضغط "تحليل" 📊

---

## 🎨 الصفحات المتاحة

| الصفحة | الرابط | الوصف |
|--------|--------|-------|
| الرئيسية | `/` | المولد الذكي |
| محادثة AI | `/ai-chat` | Chat متقدم |
| المحلل | `/analyzer` | تحليل برومبتات |
| المكتبة | `/my-library` | برومبتاتك المحفوظة |
| أوراق العمل | `/worksheets` | مولد أوراق عمل |
| Workspace | `/workspace` | مساحة عمل AI |
| Dashboard | `/dashboard` | لوحة التحكم |

---

## 💰 التكلفة

### DeepSeek (الخيار الافتراضي)
- **مجاني:** أول 1M tokens
- **بعدها:** $0.14 لكل 1M tokens
- **مثال:** 1000 استعلام = ~$1-2

### بدائل (اختيارية)
- OpenAI: $5/M tokens (أغلى لكن أقوى)
- Gemini: مجاني (محدود)

---

## 🔧 استكشاف الأخطاء

### خطأ: "API key not configured"
✅ تأكد من إضافة `DEEPSEEK_API_KEY` في `.env`

### خطأ: "Cannot connect to database"
✅ قاعدة البيانات اختيارية للبداية
✅ أو راجع `DEPLOYMENT.md` لإعداد MySQL

### خطأ: "Port 5173 in use"
✅ أوقف Vite القديم أو غيّر البورت

---

## 📚 مزيد من المعلومات

- **README.md** - وثائق كاملة
- **DEPLOYMENT.md** - دليل النشر
- **API_INTEGRATION_GUIDE.md** - دليل API

---

## 💡 نصائح

1. **استخدم DeepSeek** - الأفضل للعربية والأرخص
2. **ابدأ بدون Database** - للتجربة السريعة
3. **اقرأ README.md** - للميزات الكاملة

---

## 🎉 استمتع!

الآن يمكنك:
- ✅ توليد برومبتات ذكية
- ✅ المحادثة مع AI
- ✅ تحليل البرومبتات
- ✅ إنشاء أوراق عمل

---

<div align="center">

**⏱️ استغرق الإعداد:** ~5 دقائق

**🚀 جاهز للاستخدام!**

</div>
