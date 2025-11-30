@echo off
chcp 65001 >nul
echo ========================================
echo   🚀 رفع مشروع رقيم AI 966 على GitHub
echo ========================================
echo.

REM استبدل YOUR_USERNAME باسم مستخدم GitHub الخاص بك
set /p GITHUB_USERNAME="أدخل اسم مستخدم GitHub الخاص بك: "

if "%GITHUB_USERNAME%"=="" (
    echo ❌ لم تدخل اسم المستخدم!
    pause
    exit /b 1
)

echo.
echo 📡 ربط المشروع بـ GitHub...

REM إضافة remote
git remote add origin https://github.com/%GITHUB_USERNAME%/raqim-ai-966.git 2>nul
if errorlevel 1 (
    git remote set-url origin https://github.com/%GITHUB_USERNAME%/raqim-ai-966.git
)

REM تغيير branch إلى main
git branch -M main

echo.
echo ⬆️  رفع الملفات إلى GitHub...

REM Push
git push -u origin main

echo.
echo ========================================
echo   ✅ تم رفع المشروع بنجاح!
echo ========================================
echo.
echo 🌐 رابط المشروع:
echo https://github.com/%GITHUB_USERNAME%/raqim-ai-966
echo.
echo 📦 الخطوة التالية: إنشاء Release v1.0.0
echo اذهب إلى: https://github.com/%GITHUB_USERNAME%/raqim-ai-966/releases/new
echo.
pause
