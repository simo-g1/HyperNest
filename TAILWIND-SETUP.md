# HyperNest — الانتقال من Tailwind Play CDN إلى CLI

تم تجهيز إعدادات Tailwind CLI مع الحفاظ على إعدادات المشروع الحالية:
- `darkMode: 'class'`
- ألوان `slate` و`skyBrand` و`cream`
- الحركات المخصصة `gradient-wave` و`float` و`pulse-glow`
- فحص صفحات HTML الثلاثة وملفات JavaScript لاستخراج الكلاسات، بما فيها الكلاسات المكتوبة داخل Template Literals.

## التنفيذ على جهازك

من Terminal داخل مجلد المشروع:

```bash
npm install
npm run build:css
```

سينتج الملف `css/tailwind.css` مضغوطًا.

بعد التأكد من نجاح البناء ووجود الملف، نفّذ التبديل التالي في **index.html وproducts.html وdashboard.html**:

1. احذف `<script src="https://cdn.tailwindcss.com"></script>`.
2. احذف كتلة `<script> ... tailwind.config = {...} ... </script>` الخاصة بإعداد Tailwind.
3. أضف هذا السطر مكانهما داخل `<head>`:

```html
<link rel="stylesheet" href="css/tailwind.css">
```

اترك ترتيب ملفات CSS الأخرى كما هو حاليًا، واجعل `tailwind.css` قبل `normalize.css` وباقي ملفات التنسيق حتى لا تتغير أولوية التنسيقات الموجودة بلا داعٍ:

```html
<link rel="stylesheet" href="css/tailwind.css">
<link rel="stylesheet" href="css/normalize.css">
<link rel="stylesheet" href="css/all.min.css">
```

## أثناء التطوير

شغّل `npm run watch:css` في Terminal منفصل ليُعاد بناء CSS تلقائيًا عند تعديل كلاسات HTML/JS.

## ملاحظات مهمة

- لا تحذف `src/tailwind.css` أو `tailwind.config.js`؛ فهما ملفات المصدر اللازمة لإعادة البناء.
- لا ترفع `node_modules` إلى GitHub؛ أضفناه إلى `.gitignore`.
- ارفع `css/tailwind.css` الناتج إلى GitHub لأنه الملف الذي سيحمّله الموقع في الإنتاج.
- أي كلاس Tailwind يتكوّن ديناميكيًا بتجميع أجزاء نصية في JavaScript قد لا يلتقطه الفاحص. استخدم أسماء الكلاسات كاملة كنصوص ثابتة أو أضفها إلى `safelist` في `tailwind.config.js` عند الحاجة.
- لا يتم حذف Play CDN من صفحات الموقع قبل نجاح `npm run build:css` وفحص الشكل؛ لتجنب ظهور الموقع دون تنسيقات.
