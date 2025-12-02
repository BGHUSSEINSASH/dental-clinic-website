# موقع عيادة د. يقين عامر

موقع ثابت (Static) باللغة العربية لعرض خدمات عيادة طب الأسنان، الأخبار، النشرة البريدية، ولوحة تحكم بسيطة تعتمد على LocalStorage.

## المحتوى
- صفحة رئيسية (بطلة + خدمات + معرض + مميزات + تواصل)
- قسم الأخبار + نموذج اشتراك في النشرة
- لوحة تحكم `admin.html` لإدارة الأخبار والمشتركين (تجريبية)
- ألوان وهوية (ماروني + ذهبي)

## المتطلبات للنشر
- حساب GitHub
- حساب Firebase مع تمكين Hosting
- تثبيت أدوات:
  - Git
  - Node.js + NPM
  - Firebase CLI: `npm install -g firebase-tools`

## خطوات رفع المشروع على GitHub
1. افتح المجلد في الطرفية (PowerShell):
   ```pwsh
   Set-Location "c:\Users\BGHUSSEINSASH\Desktop\موقع طبيب اسنان"
   git init
   git add .
   git commit -m "Initial commit: Yaqeen Dental Clinic"
   ```
2. أنشئ مستودع جديد على حسابك في GitHub (مثلاً: `yaqeen-dental-clinic`).
3. أضف المصدر البعيد (استبدل USERNAME و REPO):
   ```pwsh
   git remote add origin https://github.com/USERNAME/REPO.git
   git branch -M main
   git push -u origin main
   ```

## إعداد Firebase Hosting
1. تسجيل الدخول:
   ```pwsh
   firebase login
   ```
2. (اختياري) إنشاء مشروع جديد من لوحة Firebase وأخذ المعرّف (Project ID).
3. عدل ملف `.firebaserc` وضع المعرّف مكان `REPLACE_WITH_FIREBASE_PROJECT_ID`.
4. تهيئة الاستضافة (إذا لم تفعل سابقاً):
   ```pwsh
   firebase init hosting
   ```
   - اختر المشروع.
   - أدخل `.` كمسار المجلد العام (public directory).
   - قل لا لإعادة كتابة SPA (يمكن جعله نعم لاحقاً).
5. النشر:
   ```pwsh
   firebase deploy
   ```

## ملاحظات أمنية
- لوحة التحكم بدون مصادقة، وهي لأغراض العرض فقط.
- يفضل لاحقاً نقل الأخبار والمشتركين لقاعدة بيانات (Firestore) مع نظام دخول.

## تطوير لاحق مقترح
- إضافة مصادقة Firebase Authentication للوحة التحكم.
- استبدال LocalStorage بـ Firestore.
- إضافة ضغط صور وتحسين SEO.

## الرخصة
هذا المشروع تعليمـي؛ يمكنك التوسع به وفق احتياجاتك.
