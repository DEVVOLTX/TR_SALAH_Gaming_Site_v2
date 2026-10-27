# ربط المتجر بـ Firebase

## 1) من Firebase Console (مشروع salah-store-5a9c8)
1. **Authentication → Sign-in method:** فعّل Email/Password.
2. **Authentication → Users:** أضف الإيميلين المسموحين بكلمات مرور قوية (أنشئهم فورًا قبل أي حاجة تانية).
3. **Authentication → Settings → User actions:** عطّل "Enable create (sign-up)" عشان محدش يسجّل حساب جديد.
4. **Firestore Database:** Create database (Production mode).
5. **Firestore → Rules:** الصق محتوى `firestore.rules` واضغط Publish.

## 2) البناء والنشر
```bash
npm install
npm run build      # الناتج في dist/
```
ارفع محتوى `dist/` على GitHub Pages (أو Firebase Hosting). المتجر على `/` ولوحة التحكم على `/admin.html`.

## 3) أول استخدام
- افتح `/admin.html` وادخل. الأسعار الافتراضية بتظهر، عدّل واضغط **حفظ التغييرات** وهيتحدّث المتجر فورًا.
- الطلبات اللي بتتأكد في المتجر بتظهر في تبويب **الطلبات**.

## ملاحظات
- قيم الـ config في `src/firebase.js` عامة وليست سرية. الحماية من `firestore.rules`.
- لو غيّرت إيميلات الأدمن، عدّلها في `firestore.rules` وفي `ALLOWED` داخل `src/admin.jsx`.
