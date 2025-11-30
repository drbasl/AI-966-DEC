# 📦 نسخ ملفات المشروع للرفع على Hostinger
# هذا السكريبت ينسخ الملفات المطلوبة فقط إلى مجلد جاهز للرفع

Write-Host "🚀 تجهيز المشروع للرفع على Hostinger..." -ForegroundColor Green
Write-Host ""

# المجلد الوجهة
$destinationDir = "C:\Users\basel\Downloads\raqim-ai-966-ready-for-upload"

# إنشاء المجلد الوجهة
if (Test-Path $destinationDir) {
    Write-Host "⚠️  حذف المجلد القديم..." -ForegroundColor Yellow
    Remove-Item -Path $destinationDir -Recurse -Force
}

Write-Host "📁 إنشاء مجلد جديد: $destinationDir" -ForegroundColor Cyan
New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null

# نسخ الملفات المطلوبة
Write-Host "📋 نسخ الملفات..." -ForegroundColor Cyan

# نسخ المجلدات الأساسية
$folders = @("dist", "drizzle", "server")
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "  ✅ نسخ مجلد: $folder" -ForegroundColor Green
        Copy-Item -Path $folder -Destination $destinationDir -Recurse -Force
    }
}

# نسخ الملفات الأساسية
$files = @("package.json", "pnpm-lock.yaml", ".env")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ نسخ ملف: $file" -ForegroundColor Green
        Copy-Item -Path $file -Destination $destinationDir -Force
    }
}

# نسخ ملفات التوثيق
$docFiles = @(
    "README.md",
    "QUICK_START.md",
    "HOSTINGER_DEPLOYMENT_GUIDE.md",
    "DEPLOY_TO_HOSTINGER.md",
    "RELEASE_NOTES_v1.0.0.md"
)
foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ نسخ توثيق: $file" -ForegroundColor Green
        Copy-Item -Path $file -Destination $destinationDir -Force
    }
}

Write-Host ""
Write-Host "✨ تم تجهيز المشروع بنجاح!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 مكان الملفات الجاهزة للرفع:" -ForegroundColor Cyan
Write-Host "   $destinationDir" -ForegroundColor White
Write-Host ""
Write-Host "📤 الخطوات التالية:" -ForegroundColor Yellow
Write-Host "   1. اضغط ملف ZIP من المجلد: $destinationDir" -ForegroundColor White
Write-Host "   2. ارفع الملف على Hostinger عبر File Manager" -ForegroundColor White
Write-Host "   3. فك ضغط الملف على السيرفر" -ForegroundColor White
Write-Host "   4. حدّث ملف .env بمعلومات قاعدة البيانات" -ForegroundColor White
Write-Host "   5. نفذ: pnpm install --prod" -ForegroundColor White
Write-Host "   6. نفذ: pnpm db:push" -ForegroundColor White
Write-Host "   7. نفذ: pnpm start" -ForegroundColor White
Write-Host ""
Write-Host "📖 للمزيد من التفاصيل، راجع: DEPLOY_TO_HOSTINGER.md" -ForegroundColor Cyan
Write-Host ""

# فتح المجلد في Explorer
Start-Process explorer.exe $destinationDir
