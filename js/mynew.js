/* 1. EXTENDED DATABASE (50 PRODUCTS) */
const PRODUCTS_DATABASE = [
  { id: 1, name: "تفاح أحمر طازج (1 كجم)", category: "produce", price: 45.00, rating: 4.9, icon: "🍎", stock: "متوفر", image: "imgs/food/product-01.webp", desc: "تفاح أحمر طازج ومقرمش مناسب كوجبة خفيفة أو لإضافته إلى سلطات الفاكهة." },
  { id: 2, name: "موز بلدي طازج (1 كجم)", category: "produce", price: 25.00, rating: 4.8, icon: "🍌", stock: "متوفر", image: "imgs/food/product-02.webp", desc: "موز طازج وحلو المذاق، مناسب للفطور والعصائر." },
  { id: 3, name: "حليب كامل الدسم (1 لتر)", category: "dairy", price: 38.00, rating: 4.7, icon: "🥛", stock: "متوفر", image: "imgs/food/product-03.webp", desc: "حليب كامل الدسم مناسب للشرب وتحضير المشروبات والوصفات اليومية." },
  { id: 4, name: "جبنة شيدر (250 جم)", category: "dairy", price: 65.00, rating: 4.9, icon: "🧀", stock: "متوفر", image: "imgs/food/product-04.webp", desc: "جبنة شيدر غنية بالنكهة، مناسبة للسندوتشات والبيتزا." },
  { id: 5, name: "خبز توست أبيض", category: "bakery", price: 28.00, rating: 4.6, icon: "🍞", stock: "متوفر", image: "imgs/food/product-05.webp", desc: "شرائح توست طرية مناسبة للفطور والسندوتشات." },
  { id: 6, name: "كرواسون بالزبدة (4 قطع)", category: "bakery", price: 42.00, rating: 4.8, icon: "🥐", stock: "محدود", image: "imgs/food/product-06.webp", desc: "كرواسون مورّق بطبقات هشة، مناسب للفطور أو وجبة خفيفة." },
  { id: 7, name: "صدور دجاج طازجة (1 كجم)", category: "meat", price: 210.00, rating: 4.9, icon: "🍗", stock: "متوفر", image: "imgs/food/product-07.webp", desc: "صدور دجاج طازجة مناسبة للشوي والطهي وتحضير الوجبات." },
  { id: 8, name: "عصير برتقال (1 لتر)", category: "beverages", price: 32.00, rating: 4.7, icon: "🍊", stock: "متوفر", image: "imgs/food/product-08.webp", desc: "عصير برتقال بطعم منعش، يقدم بارداً." },
  { id: 9, name: "بيض طازج (عبوة 6 بيضات)", category: "dairy", price: 35.00, rating: 4.8, icon: "🥚", stock: "متوفر", image: "imgs/food/product-09.webp", desc: "بيض طازج مناسب للفطور وإعداد مختلف الوجبات." },
  { id: 10, name: "طماطم طازجة (1 كجم)", category: "produce", price: 18.00, rating: 4.5, icon: "🍅", stock: "متوفر", image: "imgs/food/product-10.webp", desc: "طماطم حمراء طازجة مناسبة للسلطات والطهي اليومي." }
];

// Products 11–50: بيانات المنتجات المطابقة للصور المحلية الجديدة.
const EXTRA_GROCERY_PRODUCTS = [
  ['خيار بلدي طازج (1 كجم)', 'produce', '🥒', 'خيار أخضر طازج ومقرمش مناسب للسلطات.'],
  ['بطاطس طازجة (1 كجم)', 'produce', '🥔', 'بطاطس مناسبة للقلي والفرن والطهي المنزلي.'],
  ['بصل طازج (1 كجم)', 'produce', '🧅', 'بصل طازج يضيف نكهة مميزة لمختلف وصفات الطعام.'],
  ['ثوم طازج (250 جم)', 'produce', '🧄', 'فصوص ثوم طازجة مناسبة للتتبيل والطهي.'],
  ['جزر طازج (1 كجم)', 'produce', '🥕', 'جزر طازج ومقرمش مناسب للسلطات والطهي.'],
  ['فلفل أخضر حلو (500 جم)', 'produce', '🫑', 'فلفل أخضر طازج مناسب للسلطات والوصفات اليومية.'],
  ['ليمون طازج (1 كجم)', 'produce', '🍋', 'ليمون طازج للمشروبات والتتبيل وإضافة نكهة منعشة.'],
  ['خس أخضر طازج', 'produce', '🥬', 'أوراق خس طازجة مناسبة للسلطات والسندوتشات.'],
  ['بروكلي طازج (500 جم)', 'produce', '🥦', 'بروكلي طازج مناسب للطهي بالبخار والوصفات الصحية.'],
  ['فراولة طازجة (500 جم)', 'produce', '🍓', 'فراولة طازجة مناسبة للتحلية والعصائر.'],
  ['توت أزرق (125 جم)', 'produce', '🫐', 'حبات توت أزرق مناسبة للفطور والحلويات.'],
  ['عنب مشكل (1 كجم)', 'produce', '🍇', 'عنب طازج متنوع مناسب للتقديم كوجبة خفيفة.'],
  ['بطيخ طازج', 'produce', '🍉', 'بطيخ حلو ومنعش مناسب للتقديم بارداً.'],
  ['أفوكادو طازج (2 ثمرة)', 'produce', '🥑', 'أفوكادو طازج مناسب للسلطات والسندوتشات.'],
  ['ذرة حلوة طازجة (2 كوز)', 'produce', '🌽', 'ذرة حلوة مناسبة للسلق والشوي وإضافتها للوجبات.'],
  ['فاصوليا حمراء جافة (500 جم)', 'pantry', '🫘', 'فاصوليا حمراء مناسبة للشوربة واليخنات والوجبات المنزلية.'],
  ['أرز أبيض (1 كجم)', 'pantry', '🍚', 'أرز أبيض مناسب لتحضير الأطباق اليومية.'],
  ['مكرونة أقلام (500 جم)', 'pantry', '🍝', 'مكرونة أقلام مناسبة للصوصات والوصفات المختلفة.'],
  ['شوفان (500 جم)', 'pantry', '🥣', 'رقائق شوفان مناسبة للفطور وتحضير الوجبات الخفيفة.'],
  ['دقيق أبيض (1 كجم)', 'pantry', '🌾', 'دقيق أبيض مناسب للمخبوزات والمعجنات المنزلية.'],
  ['سكر أبيض (1 كجم)', 'pantry', '🍚', 'سكر أبيض للتحلية وتحضير المشروبات والحلويات.'],
  ['زيت طهي نباتي (1 لتر)', 'pantry', '🫒', 'زيت نباتي مناسب للطهي وإعداد الوجبات اليومية.'],
  ['عسل نحل (500 جم)', 'pantry', '🍯', 'عسل بطعم غني مناسب للفطور والتحلية.'],
  ['مربى فراولة (350 جم)', 'pantry', '🍓', 'مربى فراولة مناسبة للتوست والفطور.'],
  ['زبدة فول سوداني (340 جم)', 'pantry', '🥜', 'زبدة فول سوداني كريمية مناسبة للسندوتشات والفطور.'],
  ['شوكولاتة بالحليب (100 جم)', 'pantry', '🍫', 'ألواح شوكولاتة بالحليب مناسبة للتحلية.'],
  ['رقائق بطاطس (كيس)', 'pantry', '🥔', 'رقائق بطاطس مقرمشة كوجبة خفيفة.'],
  ['مكسرات مشكلة (250 جم)', 'pantry', '🥜', 'تشكيلة مكسرات مناسبة للتقديم والوجبات الخفيفة.'],
  ['زيتون أسود (250 جم)', 'pantry', '🫒', 'زيتون أسود مناسب للمقبلات والسلطات.'],
  ['مخلل خيار (500 جم)', 'pantry', '🥒', 'خيار مخلل مناسب للتقديم بجانب الوجبات.'],
  ['تونة قطع (عبوة)', 'pantry', '🐟', 'تونة معلبة مناسبة للسندوتشات والسلطات.'],
  ['سردين معلب (عبوة)', 'pantry', '🐟', 'سردين معلب مناسب للوجبات السريعة والسندوتشات.'],
  ['صلصة طماطم (300 جم)', 'pantry', '🍅', 'صلصة طماطم مناسبة للمكرونة والطهي.'],
  ['مايونيز (250 جم)', 'pantry', '🥣', 'مايونيز كريمي مناسب للسندوتشات والسلطات.'],
  ['قهوة مطحونة (200 جم)', 'beverages', '☕', 'قهوة مطحونة مناسبة للتحضير في المنزل.'],
  ['شاي أسود (250 جم)', 'beverages', '🍵', 'شاي أسود مناسب لتحضير كوب شاي يومي.'],
  ['قهوة سريعة التحضير (100 جم)', 'beverages', '☕', 'قهوة سريعة التحضير بمذاق غني وسهلة الإعداد.'],
  ['مشروبات غازية مشكلة (3 عبوات)', 'beverages', '🥤', 'تشكيلة مشروبات غازية تقدم باردة.'],
  ['مياه معدنية (6 زجاجات)', 'beverages', '💧', 'عبوات مياه معدنية مناسبة للشرب اليومي.'],
  ['حليب مجفف (400 جم)', 'dairy', '🥛', 'حليب مجفف مناسب لتحضير الحليب واستخدامه في الوصفات.']
];

EXTRA_GROCERY_PRODUCTS.forEach(([name, category, icon, desc], index) => {
  const id = index + 11;
  PRODUCTS_DATABASE.push({
    id,
    name,
    category,
    price: parseFloat((15 + (id * 4.5) % 180).toFixed(2)),
    rating: parseFloat((4.0 + (id % 10) * 0.1).toFixed(1)),
    icon,
    stock: id % 4 === 0 ? "كمية محدودة" : "متوفر",
    image: `imgs/food/product-${String(id).padStart(2, '0')}.webp`,
    desc
  });
});


/* 1B. CLEANING & HOUSEHOLD PRODUCTS (50 PRODUCTS) */
const EXTRA_CLEANING_PRODUCTS = [
  ['مسحوق غسيل أوتوماتيك للملابس الملونة (2.5 كجم)', '🧺', 'مسحوق غسيل مخصص للغسالات الأوتوماتيك ويساعد على تنظيف الملابس الملونة.'],
  ['مسحوق غسيل للملابس البيضاء (2 كجم)', '🫧', 'مسحوق مناسب لغسيل الملابس البيضاء والتنظيف اليومي.'],
  ['سائل غسيل ملابس مركز (1.5 لتر)', '🧴', 'سائل مركز لتنظيف الملابس ومناسب للاستخدام حسب تعليمات العبوة.'],
  ['منعم أقمشة برائحة اللافندر (1 لتر)', '🌸', 'منعم أقمشة يضيف رائحة لطيفة وملمساً ناعماً للملابس.'],
  ['مزيل بقع للملابس (500 مل)', '✨', 'مزيل بقع للاستخدام على الأقمشة وفق إرشادات المنتج.'],
  ['مبيض ملابس أبيض (1 لتر)', '🧼', 'مبيض مخصص للملابس البيضاء ويستخدم حسب تعليمات العبوة.'],
  ['سائل غسيل أطباق بالليمون (650 مل)', '🍋', 'سائل أطباق يساعد على إزالة الدهون وبقايا الطعام.'],
  ['سائل غسيل أطباق مركز (1 لتر)', '🫧', 'تركيبة مركزة لتنظيف الأواني والأطباق اليومية.'],
  ['منظف متعدد الاستخدامات (750 مل)', '🧴', 'منظف للأسطح القابلة للغسل في المطبخ والمنزل.'],
  ['منظف أرضيات برائحة الليمون (1 لتر)', '🍋', 'منظف أرضيات للاستخدام المنزلي برائحة الليمون.'],
  ['منظف أرضيات برائحة اللافندر (1 لتر)', '🌿', 'منظف مناسب للأرضيات القابلة للغسل برائحة منعشة.'],
  ['مطهر أسطح منزلي (500 مل)', '🧽', 'مطهر للأسطح المنزلية يستخدم وفق تعليمات الملصق.'],
  ['منظف زجاج ومرايا (650 مل)', '🪟', 'منظف للزجاج والمرايا للمساعدة على إزالة البصمات وآثار الأتربة.'],
  ['ملمع أثاث خشبي (300 مل)', '🪵', 'ملمع مخصص لأسطح الأثاث الخشبية حسب إرشادات الاستخدام.'],
  ['منظف حمامات (750 مل)', '🚿', 'منظف لأسطح الحمام والسيراميك وفق تعليمات العبوة.'],
  ['منظف مرحاض (700 مل)', '🚽', 'منظف مخصص لتنظيف المرحاض والعناية بنظافته.'],
  ['مزيل تكلسات للحمام (500 مل)', '💧', 'منتج مخصص للمساعدة على إزالة الترسبات الكلسية من الأسطح المناسبة.'],
  ['منظف مطبخ ومزيل دهون (500 مل)', '🍳', 'منظف للمطبخ يساعد على إزالة الدهون من الأسطح المناسبة.'],
  ['مزيل دهون قوي للمواقد (650 مل)', '🔥', 'مزيل دهون مخصص لأسطح المواقد القابلة للتنظيف.'],
  ['منظف أفران (500 مل)', '♨️', 'منظف مخصص للأفران ويستخدم وفق احتياطات وتعليمات العبوة.'],
  ['كلور منزلي (1 لتر)', '🧴', 'مبيض ومطهر منزلي يستخدم وفق تعليمات العبوة ولا يخلط بمواد أخرى.'],
  ['مطهر ملابس ومعقم غسيل (1 لتر)', '🧺', 'إضافة للغسيل تستخدم وفق تعليمات المنتج ونوع الأقمشة.'],
  ['صابون غسيل صلب (5 قطع)', '🧼', 'قطع صابون مخصصة لغسيل الملابس والتنظيف اليدوي.'],
  ['صابون يدين سائل (500 مل)', '🫧', 'صابون سائل لتنظيف اليدين للاستخدام اليومي.'],
  ['صابون جلسرين لليدين (3 قطع)', '🧼', 'صابون جلسرين للاستخدام اليومي في غسل اليدين.'],
  ['مناديل ورقية ناعمة (عبوة 6)', '🧻', 'مناديل ورقية ناعمة للاستخدام المنزلي اليومي.'],
  ['مناديل مطبخ رول (2 لفة)', '🧻', 'مناديل مطبخ ماصة للاستخدام أثناء إعداد الطعام والتنظيف.'],
  ['مناديل مبللة متعددة الاستخدامات (عبوة)', '🧻', 'مناديل مبللة لتنظيف الأسطح المناسبة حسب تعليمات العبوة.'],
  ['أكياس قمامة كبيرة (30 كيس)', '🗑️', 'أكياس قمامة منزلية كبيرة للاستخدام اليومي.'],
  ['أكياس قمامة متوسطة (40 كيس)', '🗑️', 'أكياس قمامة متوسطة الحجم لسلة المطبخ والمنزل.'],
  ['إسفنج تنظيف أطباق (5 قطع)', '🧽', 'إسفنج عملي لتنظيف الأطباق وأدوات المطبخ.'],
  ['سلك مواعين استانلس (3 قطع)', '🧹', 'قطع سلك لتنظيف الأواني المناسبة مع مراعاة عدم خدش الأسطح الحساسة.'],
  ['ليف تنظيف ناعم (قطعتان)', '🧽', 'ليف تنظيف للاستخدام اليومي على الأسطح المناسبة.'],
  ['فوط مايكروفايبر للتنظيف (3 قطع)', '🧺', 'فوط مايكروفايبر للمسح والتنظيف وتجفيف الأسطح.'],
  ['فرشاة تنظيف أطباق بمقبض', '🪥', 'فرشاة بمقبض لتسهيل تنظيف الأطباق والأواني.'],
  ['فرشاة تنظيف أرضيات', '🧹', 'فرشاة عملية لتنظيف الأرضيات والأسطح الصلبة.'],
  ['ممسحة أرضيات مايكروفايبر', '🧹', 'ممسحة أرضيات مناسبة للتنظيف اليومي.'],
  ['جردل تنظيف بمقبض (10 لتر)', '🪣', 'جردل منزلي بمقبض لحمل المياه وأدوات التنظيف.'],
  ['قفازات تنظيف مطاطية (زوج)', '🧤', 'قفازات لحماية اليدين أثناء أعمال التنظيف المنزلية.'],
  ['إسفنجة ميلامين لإزالة العلامات (4 قطع)', '🧽', 'إسفنج تنظيف مخصص لبعض العلامات على الأسطح المناسبة.'],
  ['معطر جو برائحة الورد (300 مل)', '🌹', 'معطر جو للاستخدام المنزلي وفق تعليمات العبوة.'],
  ['معطر جو برائحة اللافندر (300 مل)', '💜', 'معطر برائحة اللافندر لإضفاء رائحة لطيفة على المكان.'],
  ['معطر مفروشات (500 مل)', '🛋️', 'معطر للأقمشة والمفروشات القابلة للاستخدام حسب الملصق.'],
  ['مزيل روائح للثلاجة (عبوة)', '❄️', 'منتج للمساعدة على تقليل الروائح غير المرغوبة داخل الثلاجة.'],
  ['منظف غسالات الملابس (عبوة)', '🫧', 'منظف مخصص للعناية بحلة الغسالة وفق تعليمات الشركة.'],
  ['منظف غسالة الأطباق (عبوة)', '🍽️', 'منظف مخصص لغسالات الأطباق الأوتوماتيكية.'],
  ['ملح غسالة أطباق (1 كجم)', '🧂', 'ملح مخصص لغسالات الأطباق للمساعدة على تقليل آثار عسر المياه.'],
  ['ملمع غسالة أطباق (500 مل)', '✨', 'ملمع مخصص لغسالات الأطباق للمساعدة على تجفيف أفضل ولمعان الأواني.'],
  ['منظف ستائر ومفروشات (500 مل)', '🛋️', 'منظف للأقمشة والمفروشات القابلة للغسل وفق تعليمات العبوة.'],
  ['منظف أحذية (250 مل)', '👟', 'منظف مخصص للأحذية والخامات المناسبة حسب تعليمات الاستخدام.']
];

EXTRA_CLEANING_PRODUCTS.forEach(([name, icon, desc], index) => {
  const id = index + 51;
  PRODUCTS_DATABASE.push({
    id,
    name,
    category: 'household',
    price: parseFloat((18 + (id * 6.25) % 155).toFixed(2)),
    rating: parseFloat((4.1 + (id % 9) * 0.1).toFixed(1)),
    icon,
    stock: id % 7 === 0 ? 'كمية محدودة' : 'متوفر',
    image: `imgs/cleaning/product-${String(index + 1).padStart(2, '0')}.webp`,
    desc
  });
});

let currentFloor = 1;
let cart = [];
let wishlist = [];
let recentlyViewed = [];
let activeCategory = 'all';
let showAllProducts = false;
let appliedDiscountPercent = 0;
let maxBudget = 400;

let isProcessingDrop = false;
let selectedDeliverySlot = 'الآن (45 د)';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CATEGORY_LABELS = {
  all: 'جميع المنتجات',
  produce: 'خضار وفواكه طازجة',
  dairy: 'ألبان، أجبان وبيض',
  bakery: 'مخبوزات وحلويات الفرن',
  meat: 'لحوم، دواجن ومجمدات',
  beverages: 'مشروبات وعصائر',
  pantry: 'بقالة ومواد غذائية جافة',
  household: 'منظفات ومستلزمات المنزل'
};

/* 2. INITIALIZATION */
window.addEventListener('DOMContentLoaded', () => {
  initArc();
  renderCategoryPills();
  renderCatalogProducts();
  renderFloorSVG(1);
  setupDragAndDrop();
  setupScrollProgressAndReveal();
  setupCursorAndParticles();
  startLiveSalesSimulation();
  startFlashCountdown();
  setupOverlayEscape();
});

/* 3. VIRTUALFIT ARC (replaces the 3D shelves) */
const VF = {
  items: [], cards: [], pos: 0, target: 0, intro: 0, shown: -1, drag: null,
  sx: 0, sy: 0, tx: 0, ty: 0, qty: 1, W: 1, H: 1, anims: [], visible: true,
  wheelAcc: 0, lastWheel: 0
};
const VF_XS = [0, .215, .345, .432, .49, .52];
const VF_XS_M = [0, .36, .5, .56, .6, .62];
const vfMod = (n, m) => ((n % m) + m) % m;
const vfById = (id) => document.getElementById(id);
const vfXS = () => (VF.W < 768 ? VF_XS_M : VF_XS);

function initArc() {
  const stage = vfById('vf-stage'), arc = vfById('vf-arc'), hero = vfById('vf-hero');
  if (!stage || !arc || !hero) return;

  VF.items = PRODUCTS_DATABASE.filter(p => p.id <= 10); // الـ sort ما يأثرش عليهم
  arc.innerHTML = VF.items.map(p => `
    <div class="vf-card vf-glass" data-id="${p.id}">
      <img class="vf-g" src="${p.image}" alt="" draggable="false">
      <span class="vf-n">${p.name}</span>
      <span class="vf-p">${p.price.toFixed(0)} ج.م</span>
      <i class="vf-sheen"></i>
    </div>`).join('');
  VF.cards = [...arc.children];

  vfById('vf-chips').innerHTML = [1, 2, 3, 5].map(n =>
    `<button type="button" class="vf-chip" aria-pressed="${n === 1}" onclick="vfSetQty(${n}, this)">${n}</button>`).join('');

  vfResize();
  window.addEventListener('resize', vfResize);
  new IntersectionObserver(([e]) => { VF.visible = e.isIntersecting; }).observe(hero);
  vfBindInput(stage, hero);
  requestAnimationFrame(vfFrame);
}

function vfResize() {
  const hero = vfById('vf-hero');
  if (!hero) return;
  const r = hero.getBoundingClientRect();
  VF.W = r.width;
  VF.H = r.height;
  const m = VF.W < 768;
  hero.style.setProperty('--vf-mh', Math.min(VF.H * (m ? .4 : .46), VF.W * (m ? .62 : .34)) + 'px');
  hero.style.setProperty('--vf-cw', (m ? Math.min(VF.W * .3, 150) : Math.min(VF.W * .148, VF.H * .36)) + 'px');
}

function vfFrame(t) {
  requestAnimationFrame(vfFrame);
  if (!VF.visible) return;
  const N = VF.items.length, W = VF.W, H = VF.H, XS = vfXS();

  if (!VF.drag) VF.pos += (VF.target - VF.pos) * (prefersReducedMotion ? 1 : .11);
  VF.intro = Math.min(1, VF.intro + (prefersReducedMotion ? 1 : .012));
  const ie = 1 - Math.pow(1 - VF.intro, 3);
  VF.sx += (VF.tx - VF.sx) * .06;
  VF.sy += (VF.ty - VF.sy) * .06;

  const xAt = (a) => {
    const k = Math.min(Math.floor(a), XS.length - 2);
    return XS[k] + (XS[k + 1] - XS[k]) * (a - k);
  };

  VF.cards.forEach((el, i) => {
    const u = vfMod(i - VF.pos + N / 2, N) - N / 2;
    const a = Math.abs(u), sg = Math.sign(u);
    let s, z, ry, blur = 0, op = 1;

    if (a < 1) {
      s = .55 + .45 * a; z = -260 * (1 - a); op = a; ry = -sg * 16 * a;
    } else {
      s = 1 / (1 + .3 * Math.pow(a - 1, 1.15));
      z = -110 * (a - 1);
      ry = -sg * (16 + 9 * Math.min(2, a - 1));
      blur = Math.max(0, a - 1.6) * 2.4;
    }
    if (a > 3.4) op = Math.max(0, 1 - (a - 3.4) / .8);
    op *= ie;

    const x = sg * xAt(a) * W * ie;
    const bob = prefersReducedMotion ? 0 : Math.sin(t / 1000 * 1.1 + i * 1.7) * H * .006 * Math.min(1, a);
    const y = bob - (1 - s) * H * .04;
    ry += VF.sx * 10;

    el.style.transform = `translate(${x}px,${y}px) perspective(1300px) translateZ(${z}px) rotateY(${ry}deg) rotateX(${-VF.sy * 6}deg) scale(${s * (.6 + .4 * ie)})`;
    el.style.opacity = op;
    el.style.visibility = op < .01 ? 'hidden' : 'visible';
    el.style.zIndex = a < 1 ? 1 : Math.round(100 - 10 * a);
    el.style.filter = blur ? `blur(${blur}px)` : 'none';
  });

  const ghost = vfById('vf-ghost');
  if (ghost) {
    ghost.style.transform = `translate(calc(-50% - ${VF.sx * 40}px), ${-VF.sy * 16}px)`;
    [...ghost.children].forEach((l, i) => { l.style.transform = `translateY(${(1 - ie) * (60 + 30 * i)}px)`; });
  }

  if (!VF.drag && Math.abs(VF.target - VF.pos) < .25) {
    const idx = vfMod(Math.round(VF.target), N);
    if (idx !== VF.shown) vfTryOn(idx);
  }
}

function vfTryOn(idx) {
  VF.shown = idx;
  const p = VF.items[idx];
  const cur = vfById('vf-cur'), next = vfById('vf-next'), grid = vfById('vf-grid'), scan = vfById('vf-scan');
  vfUpdateBuy(p);
  vfById('vf-model').dataset.id = p.id;
  VF.anims.forEach(a => a.cancel());
  next.style.backgroundImage = `url("${p.image}")`;

  if (prefersReducedMotion) {
    cur.style.backgroundImage = next.style.backgroundImage;
    return;
  }

  const SPEED = 3; // غيّر الرقم ده بس: 1 = الأصلي، 2 = ضعف السرعة، 3 = أسرع
  const ease = 'cubic-bezier(.65,0,.35,1)';
  const clip = next.animate(
    [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }],
    { duration: 950 / SPEED, easing: ease, fill: 'forwards' });
  const g = grid.animate(
    [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)', offset: .5 }, { clipPath: 'inset(100% 0 0 0)' }],
    { duration: 1092 / SPEED, easing: ease });
  const sc = scan.animate([
    { top: '0%', transform: 'scaleX(.2)', opacity: 0 },
    { top: '6%', transform: 'scaleX(1)', opacity: 1, offset: .08 },
    { top: '94%', transform: 'scaleX(1)', opacity: 1, offset: .92 },
    { top: '100%', transform: 'scaleX(.2)', opacity: 0 }
  ], { duration: 950 / SPEED, easing: ease });
  const st = next.animate(
    [{ transform: 'scale(1.012)' }, { transform: 'scale(1)' }],
    { duration: 1250 / SPEED, easing: 'ease-out' });

  VF.anims = [clip, g, sc, st];
  clip.onfinish = () => {
    cur.style.backgroundImage = next.style.backgroundImage;
    VF.anims.forEach(a => a.cancel());
  };
}

function vfRoll(ln, text) {
  const old = ln.lastElementChild;
  if (old && old.textContent === text) return;
  const nw = document.createElement('span');
  nw.textContent = text;
  ln.appendChild(nw);
  if (prefersReducedMotion) { if (old) old.remove(); return; }
  const o = { duration: 620, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' };
  if (old) old.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-110%)' }], o).onfinish = () => old.remove();
  nw.animate([{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }], o);
}

function vfUpdateBuy(p) {
  vfRoll(vfById('vf-bname'), p.name);
  vfRoll(vfById('vf-bprice'), p.price.toFixed(2) + ' ج.م');
  const img = vfById('vf-thumb-img');
  img.src = p.image;
  img.alt = p.name;
  if (!prefersReducedMotion) {
    img.animate([{ transform: 'translateY(70%) scale(.8)' }, { transform: 'none' }],
      { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }
}

function vfSetQty(n, btn) {
  VF.qty = n;
  document.querySelectorAll('#vf-chips .vf-chip').forEach(b => b.setAttribute('aria-pressed', b === btn));
}

function vfAddToCart(btn) {
  const p = VF.items[vfMod(Math.round(VF.target), VF.items.length)];
  if (p) addToCart(p.id, VF.qty, btn);
}

function navigateShelves(direction) {
  VF.target = Math.round(VF.target) + (direction === 'left' ? -1 : 1);
}

function vfBindInput(stage, hero) {
  const N = () => VF.items.length;

  stage.addEventListener('pointerdown', (e) => {
    VF.drag = {
      x: e.clientX, p0: VF.pos, lx: e.clientX, lt: performance.now(), v: 0, moved: 0,
      card: e.target.closest('.vf-card')
    };
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', (e) => {
    const d = VF.drag;
    if (!d) return;
    const dx = e.clientX - d.x, now = performance.now();
    d.moved = Math.max(d.moved, Math.abs(dx));
    VF.pos = d.p0 - dx / (vfXS()[1] * VF.W);
    d.v = (e.clientX - d.lx) / Math.max(1, now - d.lt);
    d.lx = e.clientX;
    d.lt = now;
  });

  const end = () => {
    const d = VF.drag;
    if (!d) return;
    VF.drag = null;
    if (d.moved < 6 && d.card) {
      const i = VF.cards.indexOf(d.card), base = Math.round(VF.pos);
      VF.target = base + (vfMod(i - base + N() / 2, N()) - N() / 2);
    } else {
      const v = performance.now() - d.lt > 80 ? 0 : d.v;
      VF.target = Math.round(VF.pos - (v / (vfXS()[1] * VF.W)) * 180);
    }
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);

  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    VF.tx = (e.clientX - r.left) / r.width - .5;
    VF.ty = (e.clientY - r.top) / r.height - .5;
  });

  hero.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // سكرول الصفحة العادي يفضل شغال
    e.preventDefault();
    VF.wheelAcc += e.deltaX;
    const now = performance.now();
    if (Math.abs(VF.wheelAcc) > 60 && now - VF.lastWheel > 260) {
      VF.target = Math.round(VF.target) + (VF.wheelAcc > 0 ? 1 : -1);
      VF.wheelAcc = 0;
      VF.lastWheel = now;
    }
  }, { passive: false });

  hero.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') VF.target = Math.round(VF.target) + 1;
    if (e.key === 'ArrowLeft') VF.target = Math.round(VF.target) - 1;
  });

  const model = vfById('vf-model');
  model.addEventListener('click', () => openProductModal(parseInt(model.dataset.id)));
  model.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openProductModal(parseInt(model.dataset.id));
    }
  });
}

/* 4. CATALOG & CATEGORIES */
function renderCategoryPills() {
  const categories = [
    { id: 'all', name: 'الكل', icon: '✨' },
    { id: 'produce', name: 'خضار وفاكهة', icon: '🍎' },
    { id: 'dairy', name: 'ألبان وأجبان', icon: '🧀' },
    { id: 'bakery', name: 'مخبوزات', icon: '🥐' },
    { id: 'meat', name: 'لحوم ومجمدات', icon: '🥩' },
    { id: 'beverages', name: 'مشروبات', icon: '🧃' },
    { id: 'pantry', name: 'بقالة جافة', icon: '🛍️' },
    { id: 'household', name: 'منظفات', icon: '🧼' }
  ];

  const container = document.getElementById('category-pills');
  if (!container) return;

  container.innerHTML = categories.map(c => `
        <button onclick="filterCategory('${c.id}')" class="min-h-11 p-3 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-1 ${activeCategory === c.id ? 'bg-skyBrand-500 text-white border-skyBrand-500 shadow-md' : 'bg-[#fffdf8] dark:bg-slate-800 border-cream-200 dark:border-slate-700 hover:border-skyBrand-400'}">
          <span class="text-lg">${c.icon}</span>
          <span>${c.name}</span>
        </button>
      `).join('');
}

function filterCategory(catId) {
  activeCategory = catId;
  renderCategoryPills();
  renderCatalogProducts();
  document.getElementById('catalog-title').innerText = CATEGORY_LABELS[catId] || 'جميع المنتجات';
  document.getElementById('products-catalog')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

function renderCatalogProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let filtered = PRODUCTS_DATABASE.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchPrice = p.price <= maxBudget;
    return matchCat && matchPrice;
  });

  const limit = showAllProducts ? filtered.length : 8;
  const itemsToRender = filtered.slice(0, limit);

  grid.innerHTML = itemsToRender.map(product => createProductCardHTML(product)).join('');
  setupDragAndDrop();
}

function createProductCardHTML(product) {
  const isWish = wishlist.some(id => id === product.id);
  const hasDiscount = product.id % 3 === 0;

  return `
        <div class="product-card bg-[#fffdf8] dark:bg-slate-800 rounded-3xl p-4 border border-cream-200 dark:border-slate-700/80 shadow-[0_12px_28px_rgba(80,50,20,0.08)] hover:shadow-[0_18px_36px_rgba(80,50,20,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative"
            draggable="true" 
            data-id="${product.id}">
            
            ${hasDiscount ? `<span class="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">-25%</span>` : ''}
 
            <button type="button" onclick="toggleWishlist(${product.id})" aria-label="${isWish ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}" class="absolute top-3 right-3 z-10 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 shadow flex items-center justify-center transition ${isWish ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'}">
                <i class="fa-solid fa-heart" aria-hidden="true"></i>
            </button>
 
            <div>
                <div class="relative overflow-hidden rounded-2xl mb-3 bg-slate-50 dark:bg-slate-900 h-44 flex items-center justify-center cursor-pointer" onclick="openProductModal(${product.id})">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <span class="absolute bottom-2 right-2 bg-slate-900/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                        ${product.icon} ${product.stock}
                    </span>
                </div>
 
                <div class="flex items-center justify-between text-xs mb-1">
                    <span class="text-amber-400 font-bold flex items-center gap-1">
                        <i class="fa-solid fa-star"></i> ${product.rating}
                    </span>
                    <span class="text-slate-400 text-[11px]">كود #${product.id}</span>
                </div>
 
                <h3 class="font-extrabold text-sm text-slate-800 dark:text-white line-clamp-2 hover:text-skyBrand-600 transition cursor-pointer" onclick="openProductModal(${product.id})">
                    ${product.name}
                </h3>
            </div>
 
            <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                    <span class="text-xs text-slate-400 block -mb-1">السعر</span>
                    <span class="text-lg font-black text-skyBrand-600 dark:text-skyBrand-400">${product.price.toFixed(2)} <span class="text-xs font-normal">ج.م</span></span>
                </div>
 
                <button type="button" onclick="addToCart(${product.id}, 1, this)" 
                    class="min-h-11 min-w-11 p-2.5 rounded-xl bg-skyBrand-500 hover:bg-skyBrand-600 text-white font-bold transition shadow-md active:scale-95"
                    title="إضافة إلى السلة" aria-label="إضافة ${product.name} إلى السلة">
                    <i class="fa-solid fa-cart-plus" aria-hidden="true"></i>
                </button>
            </div>
 
        </div>
      `;
}

function toggleShowAllProducts() {
  showAllProducts = !showAllProducts;
  const btn = document.getElementById('load-more-btn');
  if (btn) btn.innerText = showAllProducts ? 'عرض أقل' : 'عرض كل المنتجات الـ 50';
  renderCatalogProducts();
}

/* 5. CART & DRAG AND DROP */
function setupDragAndDrop() {
  const items = document.querySelectorAll('.shelf-product-item, .product-card, .vf-model');
  const dropzone = document.getElementById('cart-dropzone');

  items.forEach(item => {
    if (item.dataset.dragBound) return; // منع تكرار الـ listeners
    item.dataset.dragBound = '1';
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.dataset.id);
      e.dataTransfer.effectAllowed = 'copy';
      const p = PRODUCTS_DATABASE.find(x => x.id === parseInt(item.dataset.id));
      if (p && e.dataTransfer.setDragImage) { // كأنك ماسك المنتج
        const ghost = document.createElement('div');
        ghost.className = 'drag-ghost';
        ghost.innerHTML = `<img src="${p.image}" alt="">`;
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 44, 44);
        setTimeout(() => ghost.remove(), 0);
      }
      item.classList.add('dragging');
    });
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
  });

  if (dropzone) {
    const newDropzone = dropzone.cloneNode(true);
    dropzone.parentNode.replaceChild(newDropzone, dropzone);

    newDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      newDropzone.classList.add('drag-over-dropzone');
    });

    newDropzone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      newDropzone.classList.remove('drag-over-dropzone');
    });

    newDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      newDropzone.classList.remove('drag-over-dropzone');

      if (isProcessingDrop) return;
      isProcessingDrop = true;

      const id = parseInt(e.dataTransfer.getData('text/plain'));
      if (id) {
        addToCart(id, 1);
      }

      setTimeout(() => {
        isProcessingDrop = false;
      }, 100);
    });
  }
}

function addToCart(id, amount = 1, origin = null) {
  const product = PRODUCTS_DATABASE.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.quantity += amount;
  } else {
    cart.push({ ...product, quantity: amount });
  }

  updateCartUI();
  showToast(`🛒 تمت إضافة "${product.name}" إلى السلة!`);
  if (origin) { flashAdded(origin); flyToCart(origin, product.image); } // الأنيميشن للزر فقط
}

function flashAdded(btn) {
  if (btn.dataset.busy) return;
  btn.dataset.busy = '1';
  const old = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> ' + (btn.dataset.addedLabel || '');
  btn.classList.add('is-added');
  setTimeout(() => { btn.innerHTML = old; btn.classList.remove('is-added'); delete btn.dataset.busy; }, 900);
}

function bumpCart() {
  const c = document.getElementById('cart-count');
  if (c && !prefersReducedMotion) c.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }], { duration: 350, easing: 'ease-out' });
}

function flyToCart(originEl, src) {
  const target = document.getElementById('cart-count');
  if (prefersReducedMotion || !target) return;
  const a = originEl.getBoundingClientRect(), b = target.getBoundingClientRect(), size = 44;
  const ax = a.left + a.width / 2, ay = a.top + a.height / 2;
  const dx = b.left + b.width / 2 - ax, dy = b.top + b.height / 2 - ay;
  const fly = document.createElement('img');
  fly.src = src; fly.alt = ''; fly.className = 'fly-thumb';
  Object.assign(fly.style, { left: ax - size / 2 + 'px', top: ay - size / 2 + 'px', width: size + 'px', height: size + 'px' });
  document.body.appendChild(fly);
  fly.animate([
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * .5}px,${dy * .5 - 60}px) scale(.8)`, opacity: 1, offset: .5 },
    { transform: `translate(${dx}px,${dy}px) scale(.25)`, opacity: .4 }
  ], { duration: 650, easing: 'cubic-bezier(.4,0,.2,1)' }).onfinish = () => { fly.remove(); bumpCart(); };
}

function updateQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  updateCartUI();
}

function confirmClearCart() {
  if (cart.length === 0) return showToast('السلة فارغة بالفعل!');
  cart = [];
  appliedDiscountPercent = 0;
  updateCartUI();
  showToast('🗑️ تم إفراغ السلة بنجاح.');
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * appliedDiscountPercent;
  const finalTotal = subtotal - discountAmount;

  document.getElementById('cart-count').innerText = totalCount;
  document.getElementById('cart-total-price').innerText = finalTotal.toFixed(2) + ' ج.م';
  document.getElementById('drawer-subtotal').innerText = subtotal.toFixed(2) + ' ج.م';
  document.getElementById('drawer-total-price').innerText = finalTotal.toFixed(2) + ' ج.م';

  const discountRow = document.getElementById('discount-row');
  if (discountRow) {
    if (appliedDiscountPercent > 0) {
      discountRow.classList.remove('hidden');
      document.getElementById('drawer-discount').innerText = '-' + discountAmount.toFixed(2) + ' ج.م';
    } else {
      discountRow.classList.add('hidden');
    }
  }

  const drawer = document.getElementById('cart-drawer-items');
  if (cart.length === 0) {
    drawer.innerHTML = `<div class="text-center py-12 text-slate-400"><i class="fa-solid fa-basket-shopping text-4xl mb-2"></i><p class="text-sm">سلتك فارغة حالياً</p></div>`;
  } else {
    drawer.innerHTML = cart.map(i => `
          <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border">
            <img src="${i.image}" class="w-10 h-10 object-cover rounded-xl">
            <div class="flex-1 px-3">
              <h4 class="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">${i.name}</h4>
              <span class="text-xs font-black text-skyBrand-600">${(i.price * i.quantity).toFixed(2)} ج.م</span>
            </div>
            <div class="flex items-center gap-2 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button onclick="updateQuantity(${i.id}, -1)" class="text-slate-400 hover:text-rose-500 font-bold text-xs">-</button>
              <span class="text-xs font-bold">${i.quantity}</span>
              <button onclick="updateQuantity(${i.id}, 1)" class="text-slate-400 hover:text-skyBrand-500 font-bold text-xs">+</button>
            </div>
          </div>
        `).join('');
  }
}

function openCartDrawer() { updateCartUI(); document.getElementById('cart-drawer').classList.remove('hidden'); }
function closeCartDrawer() { document.getElementById('cart-drawer').classList.add('hidden'); }
function openWishlistDrawer() { updateWishlistUI(); document.getElementById('wishlist-drawer').classList.remove('hidden'); }
function closeWishlistDrawer() { document.getElementById('wishlist-drawer').classList.add('hidden'); }

function checkoutCart() {
  if (cart.length === 0) return showToast('السلة فارغة!');
  showToast(`🎉 تم تسجيل طلبك بنجاح! التوصيل: ${selectedDeliverySlot}`);
  cart = [];
  updateCartUI();
  closeCartDrawer();
}

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast('تم إزالة المنتج من المفضلة');
  } else {
    wishlist.push(productId);
    showToast('❤️ تم إضافة المنتج للمفضلة!');
  }
  document.getElementById('wishlist-count').innerText = wishlist.length;
  renderCatalogProducts();
  updateWishlistUI();
}

function updateWishlistUI() {
  const container = document.getElementById('wishlist-drawer-items');
  if (!container) return;

  if (wishlist.length === 0) {
    container.innerHTML = `<div class="text-center py-12 text-slate-400"><i class="fa-solid fa-heart-crack text-4xl mb-2"></i><p class="text-sm">قائمة المفضلة فارغة</p></div>`;
    return;
  }

  const items = PRODUCTS_DATABASE.filter(p => wishlist.includes(p.id));
  container.innerHTML = items.map(item => `
        <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
            <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-xl">
            <div class="flex-1 px-3">
                <h4 class="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">${item.name}</h4>
                <span class="text-xs font-black text-skyBrand-600 dark:text-skyBrand-400">${item.price.toFixed(2)} ج.م</span>
            </div>
            <button onclick="addToCart(${item.id})" class="px-2.5 py-1.5 bg-skyBrand-500 text-white rounded-xl text-xs font-bold hover:bg-skyBrand-600 transition">
                + السلة
            </button>
        </div>
      `).join('');
}

function openProductModal(id) {
  const p = PRODUCTS_DATABASE.find(item => item.id === id);
  if (!p) return;

  trackRecentlyViewed(id);
  const content = document.getElementById('modal-content');
  content.innerHTML = `
        <div class="bg-slate-100 dark:bg-slate-800 p-6 flex items-center justify-center">
            <img src="${p.image}" class="w-full h-52 object-contain rounded-2xl shadow">
        </div>
        <div class="p-6 flex flex-col justify-between">
            <div>
                <span class="text-xs font-bold text-skyBrand-600 uppercase">${p.category}</span>
                <h3 id="modal-heading" class="text-xl font-black text-slate-800 dark:text-white mt-1">${p.name}</h3>
                <p class="text-sm text-slate-500 my-3 leading-relaxed">${p.desc}</p>
                <p class="text-xs font-bold text-emerald-700 dark:text-emerald-300">يُشترى معه غالباً: ${frequentlyBoughtLabel(p)}</p>
            </div>
            <div class="pt-4 border-t flex items-center justify-between">
                <span class="text-2xl font-black text-skyBrand-600">${p.price.toFixed(2)} ج.م</span>
                <button type="button" onclick="addToCart(${p.id}); closeProductModal();" class="min-h-11 px-5 py-2.5 rounded-xl bg-skyBrand-600 text-white font-extrabold text-xs shadow">
                    إضافة للسلة 🛒
                </button>
            </div>
        </div>
      `;
  document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() { document.getElementById('product-modal').classList.add('hidden'); }

function trackRecentlyViewed(productId) {
  if (!recentlyViewed.includes(productId)) {
    recentlyViewed.unshift(productId);
    if (recentlyViewed.length > 6) recentlyViewed.pop();
    renderRecentlyViewed();
  }
}

function renderRecentlyViewed() {
  const section = document.getElementById('recently-viewed-section');
  const grid = document.getElementById('recently-viewed-grid');
  if (!section || !grid) return;

  if (recentlyViewed.length === 0) {
    section.classList.add('hidden');
    return;
  }

  section.classList.remove('hidden');
  const products = PRODUCTS_DATABASE.filter(p => recentlyViewed.includes(p.id));

  grid.innerHTML = products.map(p => `
        <div class="bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-center cursor-pointer hover:shadow-md transition" onclick="openProductModal(${p.id})">
            <img src="${p.image}" class="w-full h-16 object-cover rounded-xl mb-1.5">
            <h5 class="text-[11px] font-bold text-slate-800 dark:text-white line-clamp-1">${p.name}</h5>
            <span class="text-xs font-black text-skyBrand-600 dark:text-skyBrand-400">${p.price} ج.م</span>
        </div>
      `).join('');
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold transition-all duration-300 transform translate-y-4 opacity-0 flex items-center gap-2';
  toast.innerHTML = message;
  container.appendChild(toast);
  setTimeout(() => toast.classList.remove('translate-y-4', 'opacity-0'), 10);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function setupScrollProgressAndReveal() {
  const bar = document.getElementById('scroll-progress');
  const hero = document.getElementById('vf-hero');
  const clamp01 = (n) => Math.min(1, Math.max(0, n));

  // تتابع ظهور عناصر الـ grids + كلمات العناوين (blur-in)
  document.querySelectorAll('.reveal-on-scroll .grid').forEach(g => {
    if (g.id === 'products-grid' || g.id === 'category-pills') return;
    [...g.children].forEach((c, i) => { c.classList.add('rv-child'); c.style.setProperty('--i', Math.min(i, 8)); });
  });
  document.querySelectorAll('.reveal-on-scroll h2').forEach(h => {
    if (h.id === 'catalog-title' || h.children.length) return;
    h.innerHTML = h.textContent.trim().split(/\s+/).map((w, i) => `<span class="bw" style="--w:${i}">${w}</span>`).join(' ');
  });
  // نص يضيء كلمة كلمة مع النزول
  const scrub = [...document.querySelectorAll('.scrub-text')].map(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="sw">${w}</span>`).join(' ');
    return { el, spans: [...el.children] };
  });

  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY, vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (hero && !prefersReducedMotion) hero.style.setProperty('--hp', clamp01((y - hero.offsetHeight * .45) / (hero.offsetHeight * .55)).toFixed(3));
    scrub.forEach(({ el, spans }) => {
      const p = prefersReducedMotion ? 1 : clamp01((vh * .85 - el.getBoundingClientRect().top) / (vh * .4));
      spans.forEach((sp, i) => { sp.style.opacity = (.2 + .8 * clamp01(p * spans.length * 1.2 - i)).toFixed(2); });
    });
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();

  const els = document.querySelectorAll('.reveal-on-scroll');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('revealed')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
  }), { threshold: .08, rootMargin: '0px 0px -6% 0px' });
  els.forEach(e => io.observe(e));
}

function setupCursorAndParticles() {
  if (prefersReducedMotion) return;
  const glow = document.getElementById('cursor-glow');
  window.addEventListener('mousemove', (e) => {
    if (glow) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }
  });

  window.addEventListener('click', (e) => {
    const icons = ['🍎', '🍌', '🥛', '🧀', '🥐', '🍗', '🍊', '🧼'];
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = 'click-particle';
      particle.innerText = icons[Math.floor(Math.random() * icons.length)];
      particle.style.left = e.clientX + 'px';
      particle.style.top = e.clientY + 'px';

      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 60;
      particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
      particle.style.setProperty('--rot', `${Math.random() * 360}deg`);

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }
  });
}

/* 6. REAL DYNAMIC SOCIAL PROOF & MOCK TESTIMONIAL TOASTS */
function startLiveSalesSimulation() {
  const liveEvents = [
    { name: 'سارة من الإسكندرية', text: 'المحل رائع جداً وفيه كل طلباتي! ⭐⭐⭐⭐⭐' },
    { name: 'محمد من الجيزة', text: 'قام بشراء "تفاح أحمر سكري" للتو! 🛒' },
    { name: 'أحمد من المنصورة', text: 'خدمة التوصيل ممتازة وسريعة جداً. 👌' },
    { name: 'منى من القاهرة', text: 'منتجات طازجة وتغليف محترم كالعادة. ❤️' },
    { name: 'عمر من طنطا', text: 'قام بشراء "صدور دجاج طازجة" للتو! 🛒' }
  ];

  const toast = document.getElementById('live-sales-toast');

  setInterval(() => {
    if (!toast) return;
    const randomEvent = liveEvents[Math.floor(Math.random() * liveEvents.length)];

    const userEl = document.getElementById('sales-user-name');
    const prodEl = document.getElementById('sales-product-name');

    if (userEl) userEl.innerText = randomEvent.name;
    if (prodEl) prodEl.innerText = randomEvent.text;

    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 4000);
  }, 10000);
}

/* 7. DYNAMIC 2D STORE MAP SVG RENDERER */
function renderFloorSVG(floor) {
  const svg = document.getElementById('store-svg-container');
  if (!svg) return;

  if (floor === 1) {
    svg.innerHTML = `
          <g id="zone-checkout" class="cursor-pointer hover:opacity-80 transition" onclick="selectMapZone('checkout')">
            <rect x="20" y="380" width="760" height="90" rx="12" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2" />
            <text x="400" y="430" font-size="18" font-weight="bold" fill="#0284c7" text-anchor="middle">💳 منطقة الكاشير والمخرج السريع</text>
          </g>
          <g id="zone-produce" class="cursor-pointer hover:opacity-90 transition" onclick="selectMapZone('produce')">
            <rect x="30" y="30" width="220" height="150" rx="12" fill="#dcfce7" stroke="#22c55e" stroke-width="2" />
            <text x="140" y="100" font-size="16" font-weight="bold" fill="#15803d" text-anchor="middle">🍎 قسم الخضار والفاكهة</text>
            <text x="140" y="125" font-size="12" fill="#166534" text-anchor="middle">(ممر 1)</text>
          </g>
          <g id="zone-dairy" class="cursor-pointer hover:opacity-90 transition" onclick="selectMapZone('dairy')">
            <rect x="290" y="30" width="220" height="150" rx="12" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" />
            <text x="400" y="100" font-size="16" font-weight="bold" fill="#b45309" text-anchor="middle">🧀 الألبان والأجبان</text>
            <text x="400" y="125" font-size="12" fill="#92400e" text-anchor="middle">(ممر 2)</text>
          </g>
          <g id="zone-bakery" class="cursor-pointer hover:opacity-90 transition" onclick="selectMapZone('bakery')">
            <rect x="550" y="30" width="220" height="150" rx="12" fill="#ffedd5" stroke="#f97316" stroke-width="2" />
            <text x="660" y="100" font-size="16" font-weight="bold" fill="#c2410c" text-anchor="middle">🥐 المخبوزات والحلويات</text>
            <text x="660" y="125" font-size="12" fill="#9a3412" text-anchor="middle">(ممر 3)</text>
          </g>
          <g id="zone-meat" class="cursor-pointer hover:opacity-90 transition" onclick="selectMapZone('meat')">
            <rect x="30" y="200" width="350" height="150" rx="12" fill="#ffe4e6" stroke="#f43f5e" stroke-width="2" />
            <text x="205" y="270" font-size="16" font-weight="bold" fill="#be123c" text-anchor="middle">🥩 اللحوم والدواجن</text>
            <text x="205" y="295" font-size="12" fill="#9f1239" text-anchor="middle">(ممر 4)</text>
          </g>
          <g id="zone-beverages" class="cursor-pointer hover:opacity-90 transition" onclick="selectMapZone('beverages')">
            <rect x="420" y="200" width="350" height="150" rx="12" fill="#e0e7ff" stroke="#6366f1" stroke-width="2" />
            <text x="595" y="270" font-size="16" font-weight="bold" fill="#4338ca" text-anchor="middle">🧃 المشروبات والعصائر</text>
            <text x="595" y="295" font-size="12" fill="#3730a3" text-anchor="middle">(ممر 5)</text>
          </g>
        `;
  } else {
    svg.innerHTML = `
          <g id="zone-elevator" class="cursor-pointer hover:opacity-80 transition" onclick="selectMapZone('elevator')">
            <rect x="20" y="380" width="760" height="90" rx="12" fill="#f1f5f9" stroke="#64748b" stroke-width="2" />
            <text x="400" y="430" font-size="18" font-weight="bold" fill="#334155" text-anchor="middle">🛗 المصاعد والسلالم الكهربائية للطابق الأرضي</text>
          </g>
          <g id="zone-home" class="cursor-pointer hover:opacity-90 transition" onclick="selectMapZone('home')">
            <rect x="30" y="30" width="350" height="150" rx="12" fill="#fae8ff" stroke="#d946ef" stroke-width="2" />
            <text x="205" y="100" font-size="16" font-weight="bold" fill="#a21caf" text-anchor="middle">🍳 الأدوات المنزلية والمطبخ</text>
            <text x="205" y="125" font-size="12" fill="#86198f" text-anchor="middle">(جناح A)</text>
          </g>
          <g id="zone-electronics" class="cursor-pointer hover:opacity-90 transition" onclick="selectMapZone('electronics')">
            <rect x="420" y="30" width="350" height="150" rx="12" fill="#ccfbf1" stroke="#14b8a6" stroke-width="2" />
            <text x="595" y="100" font-size="16" font-weight="bold" fill="#0f766e" text-anchor="middle">📺 الأجهزة الكهربائية والإلكترونيات</text>
            <text x="595" y="125" font-size="12" fill="#115e59" text-anchor="middle">(جناح B)</text>
          </g>
          <g id="zone-beauty" class="cursor-pointer hover:opacity-90 transition" onclick="selectMapZone('beauty')">
            <rect x="30" y="200" width="350" height="150" rx="12" fill="#fce7f3" stroke="#ec4899" stroke-width="2" />
            <text x="205" y="270" font-size="16" font-weight="bold" fill="#be185d" text-anchor="middle">🧴 العناية الشخصية والتجميل</text>
            <text x="205" y="295" font-size="12" fill="#9d174d" text-anchor="middle">(جناح C)</text>
          </g>
          <g id="zone-cleaning" class="cursor-pointer hover:opacity-90 transition" onclick="selectMapZone('cleaning')">
            <rect x="420" y="200" width="350" height="150" rx="12" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
            <text x="595" y="270" font-size="16" font-weight="bold" fill="#0369a1" text-anchor="middle">🧼 المنظفات والمطهرات المنزلية</text>
            <text x="595" y="295" font-size="12" fill="#075985" text-anchor="middle">(جناح D)</text>
          </g>
        `;
  }
}

function switchFloor(floor) {
  currentFloor = floor;
  renderFloorSVG(floor);

  const label = document.getElementById('current-floor-label');
  const entranceLabel = document.getElementById('entrance-label');
  const btn1 = document.getElementById('floor-1-btn');
  const btn2 = document.getElementById('floor-2-btn');

  if (floor === 1) {
    if (label) label.innerText = 'المخطط: الطابق الأرضي (الأغذية والطازج)';
    if (entranceLabel) entranceLabel.innerText = '🚪 مدخل السوبر ماركت الرئيسي';
    if (btn1) btn1.className = 'px-5 py-1.5 rounded-lg text-xs font-black bg-white dark:bg-slate-900 shadow text-skyBrand-600 dark:text-skyBrand-400 transition';
    if (btn2) btn2.className = 'px-5 py-1.5 rounded-lg text-xs font-black text-slate-600 dark:text-slate-400 transition';
    selectMapZone('produce');
  } else {
    if (label) label.innerText = 'المخطط: الطابق الأول العلوي (الأجهزة والأدوات المنزلية)';
    if (entranceLabel) entranceLabel.innerText = '🛗 مخرج السلالم والمصاعد الكهربائية';
    if (btn2) btn2.className = 'px-5 py-1.5 rounded-lg text-xs font-black bg-white dark:bg-slate-900 shadow text-skyBrand-600 dark:text-skyBrand-400 transition';
    if (btn1) btn1.className = 'px-5 py-1.5 rounded-lg text-xs font-black text-slate-600 dark:text-slate-400 transition';
    selectMapZone('home');
  }
  showToast(`🏢 تم الانتقال إلى ${floor === 1 ? 'الطابق الأرضي' : 'الطابق الأول العلوي'}`);
}

function selectMapZone(zone) {
  const title = document.getElementById('map-title');
  const desc = document.getElementById('map-desc');
  const feat = document.getElementById('map-featured-products');

  const info = {
    produce: { title: "قسم الخضار والفاكهة", desc: "خضروات وفواكه طازجة يومية تصل من المزارع مباشرة.", items: ["تفاح أحمر", "موز بلدي", "طماطم طازجة"] },
    dairy: { title: "قسم الألبان والأجبان", desc: "ألبان طبيعية، أجبان مستوردة ومحلية، وبيض طازج.", items: ["حليب كامل الدسم", "جبنة شيدر"] },
    bakery: { title: "قسم المخبوزات", desc: "خبز توست، كرواسون، وحلويات مخبوزة طازجة.", items: ["خبز توست", "كرواسون فرنسي"] },
    meat: { title: "قسم اللحوم والدواجن", desc: "لحوم بلدية ودواجن طازجة ومجمدات عالية الجودة.", items: ["صدور دجاج"] },
    beverages: { title: "قسم المشروبات والعصائر", desc: "عصائر طبيعية، مياه غازية، ومأكولات خفيفة.", items: ["عصير برتقال"] },
    checkout: { title: "منطقة الكاشير", desc: "دفع سريع بكافة الوسائل النقدية والبطاقات.", items: ["خدمة التغليف السريع"] },
    home: { title: "أواني وأدوات المطبخ", desc: "مستلزمات الطهي، الحلل، أدوات المائدة وأواني التقديم.", items: ["حلل طهي تفال", "أطقم معالق وشوك", "أكواب زجاجية"] },
    electronics: { title: "الأجهزة المنزلية", desc: "خلاطات، شاشات، ماكينات قهوة وأجهزة مطبخ حديثة.", items: ["خلاط كهربائي 500 واط", "قلاية بدون زيت", "غلاية مياة"] },
    beauty: { title: "العناية الشخصية والتجميل", desc: "شامبوهات، صابون مغذي، كريمات ورعاية كاملة للبشرة.", items: ["شامبو للشعر", "صابون بكتيري", "معجون أسنان"] },
    cleaning: { title: "المنظفات والمطهرات", desc: "مساحيق غسيل، مطهرات أرضيات ومنظفات الأواني.", items: ["مسحوق غسيل أتوماتيك", "منظف أرضيات", "ملمع زجاج"] },
    elevator: { title: "منطقة التنقل والسلالم", desc: "مصاعد وسلالم كهربائية للوصول للطابق الأرضي.", items: ["مصعد هيدروليكي", "سلم متحرك"] }
  };

  const data = info[zone] || { title: "قسم في المتجر", desc: "تصفح أرفف هذا الممر لمزيد من الخصومات.", items: [] };
  if (title) title.innerText = data.title;
  if (desc) desc.innerText = data.desc;
  if (feat) {
    feat.innerHTML = `<span class="text-xs font-extrabold text-slate-400">المنتجات المتاحة هنا:</span>` +
      data.items.map(item => `<div class="p-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-bold text-skyBrand-600 dark:text-skyBrand-300 mt-1">✓ ${item}</div>`).join('');
  }
}

function handleSearch(query) {
  const q = query.trim().toLowerCase();
  const grid = document.getElementById('products-grid');
  const suggest = document.getElementById('search-suggest');
  const searchInput = document.getElementById('search-input');
  if (!grid) return;

  const filtered = PRODUCTS_DATABASE.filter(p => p.name.toLowerCase().includes(q) || p.category.includes(q));
  grid.innerHTML = filtered.slice(0, 12).map(p => createProductCardHTML(p)).join('');
  setupDragAndDrop();

  if (suggest && searchInput) {
    if (!q) {
      suggest.classList.add('hidden');
      searchInput.setAttribute('aria-expanded', 'false');
      return;
    }
    suggest.innerHTML = filtered.slice(0, 6).map(p => `
          <button type="button" role="option" class="w-full text-right px-3 py-2 rounded-xl hover:bg-skyBrand-50 dark:hover:bg-slate-800 text-xs font-bold"
            onclick="openProductModal(${p.id}); document.getElementById('search-suggest').classList.add('hidden');">
            ${p.name} — ${p.price.toFixed(2)} ج.م
          </button>`).join('') || `<p class="px-3 py-2 text-xs text-slate-500">لا توجد نتائج مطابقة</p>`;
    suggest.classList.remove('hidden');
    searchInput.setAttribute('aria-expanded', 'true');
  }
}

function handleSort(value) {
  if (value === 'price-low') PRODUCTS_DATABASE.sort((a, b) => a.price - b.price);
  if (value === 'price-high') PRODUCTS_DATABASE.sort((a, b) => b.price - a.price);
  if (value === 'rating') PRODUCTS_DATABASE.sort((a, b) => b.rating - a.rating);
  renderCatalogProducts();
}

function handleBudgetFilter(val) {
  maxBudget = parseFloat(val);
  document.getElementById('budget-value').innerText = val + ' ج.م';
  renderCatalogProducts();
}

function resetFilters() {
  maxBudget = 400;
  activeCategory = 'all';
  showAllProducts = false;
  document.getElementById('budget-range').value = 400;
  document.getElementById('budget-value').innerText = '400 ج.م';
  document.getElementById('sort-select').value = 'default';
  renderCategoryPills();
  renderCatalogProducts();
}

function toggleMegaMenu() { document.getElementById('mega-menu').classList.toggle('hidden'); }
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('mobile-menu-btn');
  menu.classList.toggle('hidden');
  if (btn) btn.setAttribute('aria-expanded', menu.classList.contains('hidden') ? 'false' : 'true');
}
function toggleSpinWheelModal() { document.getElementById('spin-modal').classList.toggle('hidden'); }

function spinTheWheel() {
  const wheel = document.getElementById('wheel-graphic');
  const btn = document.getElementById('spin-btn');
  if (!wheel || !btn) return;

  btn.disabled = true;
  btn.innerText = 'جاري التدوير...';

  const randomRot = 1440 + Math.floor(Math.random() * 360);
  wheel.style.transform = `rotate(${randomRot}deg)`;

  setTimeout(() => {
    appliedDiscountPercent = 0.15;
    updateCartUI();
    showToast('🎉 مبروك! كسبت خصم 15% فوري وتم تطبيقه على السلة!');
    btn.innerText = 'تم استلام الهدية!';
    setTimeout(() => toggleSpinWheelModal(), 1500);
  }, 3000);
}

function toggleThemeWithRipple(e) {
  document.documentElement.classList.toggle('dark');
  showToast('🌗 تم تغيير وضع المظهر');
}

function copyPromoCode(code) {
  showToast(`📋 تم نسخ الكود: ${code}`);
}

function applyPromoCode() {
  const codeInput = document.getElementById('promo-code-input');
  const msg = document.getElementById('promo-message');
  if (!codeInput || !msg) return;

  const code = codeInput.value.trim().toUpperCase();
  if (code === 'SAVE10') {
    appliedDiscountPercent = 0.10;
    msg.innerText = "✓ تم تطبيق خصم 10% بنجاح!";
    msg.classList.remove('hidden');
  } else if (code === 'MYMARKET20') {
    appliedDiscountPercent = 0.20;
    msg.innerText = "✓ تم تطبيق خصم 20% الذهبي بنجاح!";
    msg.classList.remove('hidden');
  } else {
    appliedDiscountPercent = 0;
    msg.innerText = "❌ كود غير صحيح (جرب SAVE10)";
    msg.classList.remove('hidden');
  }
  updateCartUI();
}

function handleCareerSubmit(e) {
  e.preventDefault();
  showToast('✅ تم استلام طلب توظيفك بنجاح! سنتواصل معك قريباً.');
  e.target.reset();
}

function handleSupportSubmit(e) {
  e.preventDefault();
  showToast('📩 تم إرسال تذكرة الدعم الفني بنجاح. سيتم الرد عليك فوراً.');
  e.target.reset();
}

function frequentlyBoughtLabel(product) {
  const peer = PRODUCTS_DATABASE.find(p => p.category === product.category && p.id !== product.id);
  return peer ? peer.name : 'منتجات نفس القسم';
}

function addSmartBasket(ids) {
  ids.forEach(id => addToCart(id, 1));
  showToast('تم إضافة السلة الذكية دون حذف منتجاتك الحالية');
}

function selectDeliverySlot(value) {
  selectedDeliverySlot = value;
  const label = document.getElementById('delivery-slot-label');
  if (label) label.innerText = 'الموعد المختار: ' + value;
}

function shareFamilyList() {
  const names = cart.length ? cart.map(i => i.name).join('، ') : 'تفاح، حليب، خبز توست';
  const text = 'قائمة عائلة ماي ماركت: ' + names;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast('تم نسخ قائمة العائلة للمشاركة'));
  } else {
    showToast(text);
  }
}

function handleNewsletter(e) {
  e.preventDefault();
  showToast('تم الاشتراك في النشرة الأسبوعية');
  e.target.reset();
}

function startFlashCountdown() {
  let remaining = 20 * 60;
  const tick = () => {
    const h = String(Math.floor(remaining / 3600)).padStart(2, '0');
    const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    const elH = document.getElementById('flash-h');
    const elM = document.getElementById('flash-m');
    const elS = document.getElementById('flash-s');
    if (elH) elH.innerText = h;
    if (elM) elM.innerText = m;
    if (elS) elS.innerText = s;
    remaining = remaining <= 0 ? 20 * 60 : remaining - 1;
  };
  tick();
  setInterval(tick, 1000);
}

function setupOverlayEscape() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeProductModal();
    closeCartDrawer();
    closeWishlistDrawer();
    const spin = document.getElementById('spin-modal');
    if (spin && !spin.classList.contains('hidden')) toggleSpinWheelModal();
    const mega = document.getElementById('mega-menu');
    if (mega) mega.classList.add('hidden');
    const suggest = document.getElementById('search-suggest');
    if (suggest) suggest.classList.add('hidden');
  });
}