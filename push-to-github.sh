#!/bin/bash

# GitHub Push Script for Raqim AI 966
# ====================================

echo "🚀 رفع مشروع رقيم AI 966 على GitHub"
echo "===================================="
echo ""

# استبدل YOUR_USERNAME باسم مستخدم GitHub الخاص بك
read -p "أدخل اسم مستخدم GitHub الخاص بك: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ لم تدخل اسم المستخدم!"
    exit 1
fi

echo ""
echo "📡 ربط المشروع بـ GitHub..."

# إضافة remote
git remote add origin "https://github.com/$GITHUB_USERNAME/raqim-ai-966.git" 2>/dev/null || \
git remote set-url origin "https://github.com/$GITHUB_USERNAME/raqim-ai-966.git"

# تغيير branch إلى main
git branch -M main

echo ""
echo "⬆️  رفع الملفات إلى GitHub..."

# Push
git push -u origin main

echo ""
echo "✅ تم رفع المشروع بنجاح!"
echo ""
echo "🌐 رابط المشروع:"
echo "https://github.com/$GITHUB_USERNAME/raqim-ai-966"
echo ""
echo "📦 الخطوة التالية: إنشاء Release v1.0.0"
echo "اذهب إلى: https://github.com/$GITHUB_USERNAME/raqim-ai-966/releases/new"
