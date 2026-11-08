/*
 * HyperNest enhancement layer
 * Load AFTER js/my.js. It extends the existing demo instead of replacing its core logic.
 */
(() => {
  'use strict';

  const INSTAGRAM_URL = 'https://www.instagram.com/simo.g3/';
  const GITHUB_URL = 'https://github.com/simo-g1';

  const CATEGORY_META = [
    { id: 'all', label: 'كل المنتجات', icon: 'fa-layer-group' },
    { id: 'produce', label: 'خضار وفاكهة', icon: 'fa-apple-whole' },
    { id: 'dairy', label: 'ألبان وأجبان', icon: 'fa-cheese' },
    { id: 'bakery', label: 'مخبوزات', icon: 'fa-bread-slice' },
    { id: 'meat', label: 'لحوم ومجمدات', icon: 'fa-drumstick-bite' },
    { id: 'beverages', label: 'مشروبات', icon: 'fa-bottle-water' },
    { id: 'household', label: 'منظفات', icon: 'fa-soap' },
    { id: 'home-tools', label: 'أدوات منزلية', icon: 'fa-house' },
    { id: 'electronics', label: 'أجهزة كهربائية', icon: 'fa-plug' },
    { id: 'cleaning', label: 'منظفات ومطهرات', icon: 'fa-spray-can-sparkles' }
  ];





  const ICON_BY_CATEGORY = {
    produce: 'fa-apple-whole', dairy: 'fa-cheese', bakery: 'fa-bread-slice',
    meat: 'fa-drumstick-bite', beverages: 'fa-bottle-water', household: 'fa-soap',
    'home-tools': 'fa-house', electronics: 'fa-plug', cleaning: 'fa-spray-can-sparkles'
  };

  const EMOJI_ICON_MAP = new Map([
    ['🍎', 'fa-apple-whole'], ['🍌', 'fa-lemon'], ['🥛', 'fa-glass-water'], ['🧀', 'fa-cheese'],
    ['🍞', 'fa-bread-slice'], ['🥐', 'fa-cookie-bite'], ['🍗', 'fa-drumstick-bite'], ['🍊', 'fa-bottle-water'],
    ['🧼', 'fa-soap'], ['🥦', 'fa-leaf'], ['🥖', 'fa-bread-slice'], ['🥩', 'fa-drumstick-bite'],
    ['🧃', 'fa-bottle-water'], ['🧻', 'fa-toilet-paper'], ['🛒', 'fa-cart-shopping'], ['🎉', 'fa-gift'],
    ['📍', 'fa-location-dot'], ['🚪', 'fa-door-open'], ['🧀', 'fa-cheese'], ['💳', 'fa-credit-card'],
    ['🛗', 'fa-elevator'], ['🍳', 'fa-utensils'], ['📺', 'fa-tv'], ['🧴', 'fa-pump-soap'],
    ['🧼', 'fa-soap'], ['🎯', 'fa-bullseye'], ['❤️', 'fa-heart'], ['⭐', 'fa-star'], ['👌', 'fa-thumbs-up'],
    ['📩', 'fa-envelope'], ['🗑️', 'fa-trash-can'], ['🌗', 'fa-circle-half-stroke'], ['📋', 'fa-copy']
  ]);


  function addExtraProducts() {
    if (typeof PRODUCTS_DATABASE === 'undefined' || !Array.isArray(PRODUCTS_DATABASE)) return;
    const existingIds = new Set(PRODUCTS_DATABASE.map(item => Number(item.id)));
    NEW_PRODUCTS.forEach(([id, name, category, price, faIcon, imageNumber]) => {
      if (existingIds.has(id)) return;
      PRODUCTS_DATABASE.push({
        id, name, category, price: Number(price), rating: 4.6 + ((id % 4) * .1),
        icon: '', faIcon, stock: 'متوفر', image: `imgs/home-tools/product-${String(imageNumber).padStart(2, '0')}.webp`,
        desc: `منتج ${name} مناسب للاستخدام اليومي، مع وصف واضح وسعر تجريبي داخل متجر HyperNest.`
      });
    });

    CLEANING_PRODUCTS.forEach(([name, price, faIcon], index) => {
      const id = 101 + index;
      if (existingIds.has(id)) return;
      PRODUCTS_DATABASE.push({
        id, name, category: 'cleaning', price: Number(price),
        rating: Number((4.5 + ((index % 5) * .1)).toFixed(1)), icon: '', faIcon,
        stock: index % 9 === 0 ? 'كمية محدودة' : 'متوفر',
        image: `imgs/cleaning/product-${String(index + 1).padStart(2, '0')}.webp`,
        desc: `${name} للاستخدام المنزلي، يُرجى اتباع تعليمات الاستخدام الموضحة على العبوة.`
      });
    });

    if (typeof CATEGORY_LABELS !== 'undefined') {
      CATEGORY_LABELS['home-tools'] = 'الأدوات المنزلية';
      CATEGORY_LABELS.electronics = 'أجهزة كهربائية';
      CATEGORY_LABELS.cleaning = 'منظفات ومطهرات';
    }
  }

  function assignMerchantData() {
    const merchants = [
      { id: 'merchant-1', name: 'بيت العيلة', rating: 4.8, delivery: '30–45 دقيقة', logo: 'fa-house' },
      { id: 'merchant-2', name: 'سوق النخبة', rating: 4.7, delivery: '35–50 دقيقة', logo: 'fa-store' },
      { id: 'merchant-3', name: 'ركن الطازج', rating: 4.9, delivery: '25–40 دقيقة', logo: 'fa-leaf' },
      { id: 'merchant-4', name: 'لمسة بيت', rating: 4.6, delivery: '40–55 دقيقة', logo: 'fa-box' }
    ];
    PRODUCTS_DATABASE.forEach((product, index) => {
      product.merchant = index % 4 === 0 ? merchants[(index / 4 | 0) % merchants.length] : null;
    });
    window.HN_MERCHANTS = merchants;
    window.HN_DELIVERY_COMPANIES = [
      { name: 'وصلة', rating: '4.9', time: '25–40 دقيقة', icon: 'fa-truck-fast' },
      { name: 'درب', rating: '4.8', time: '30–45 دقيقة', icon: 'fa-motorcycle' },
      { name: 'خطوة', rating: '4.7', time: '35–50 دقيقة', icon: 'fa-route' }
    ];
  }

  function injectMarketplaceSections() {
    const footer = document.querySelector('footer');
    if (!footer || document.getElementById('hn-marketplace-partners')) return;
    const section = document.createElement('section');
    section.id = 'hn-marketplace-partners';
    section.className = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8';
    section.innerHTML = `
      <div><div class="hn-product-group-head"><div class="hn-product-group-icon"><i class="fa-solid fa-store"></i></div><div><h3>تجّار HyperNest</h3><p>شركاء افتراضيون يقدمون مجموعة مختارة من المنتجات</p></div></div><div class="hn-partner-grid">${window.HN_MERCHANTS.map(m=>`<article class="hn-partner-card"><span class="hn-partner-icon"><i class="fa-solid ${m.logo}"></i></span><h4>${m.name}</h4><p><i class="fa-solid fa-star"></i> ${m.rating} · توصيل ${m.delivery}</p></article>`).join('')}</div></div>
      <div><div class="hn-product-group-head"><div class="hn-product-group-icon"><i class="fa-solid fa-truck-fast"></i></div><div><h3>شركات التوصيل</h3><p>خيارات توصيل تجريبية داخل نموذج المتجر</p></div></div><div class="hn-partner-grid">${window.HN_DELIVERY_COMPANIES.map(c=>`<article class="hn-partner-card"><span class="hn-partner-icon"><i class="fa-solid ${c.icon}"></i></span><h4>${c.name}</h4><p><i class="fa-solid fa-star"></i> ${c.rating} · ${c.time}</p></article>`).join('')}</div></div>`;
    const catalog = document.getElementById('products-catalog');
    if (catalog) catalog.insertAdjacentElement('afterend', section);
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function renderCategories() {
    const container = document.getElementById('category-pills');
    if (!container) return;
    container.innerHTML = CATEGORY_META.map(category => `
      <button type="button" class="hn-category-pill" data-category="${category.id}"
        aria-pressed="${activeCategory === category.id ? 'true' : 'false'}"
        onclick="filterCategory('${category.id}')">
        <i class="fa-solid ${category.icon}" aria-hidden="true"></i>
        <span>${category.label}</span>
      </button>
    `).join('');
  }

  function renderProductCard(product) {
    const isWish = wishlist.includes(Number(product.id));
    const icon = product.faIcon || ICON_BY_CATEGORY[product.category] || 'fa-box';
    const imageMarkup = product.image
      ? `<img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy" decoding="async" width="500" height="500" onerror="this.remove()">`
      : '';
    const categoryLabel = CATEGORY_META.find(item => item.id === product.category)?.label || 'منتج';

    return `
      <article class="hn-product-card product-card relative p-3 sm:p-4 flex flex-col" draggable="true" data-id="${Number(product.id)}">
        <button type="button" onclick="toggleWishlist(${Number(product.id)})"
          aria-label="${isWish ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}: ${escapeHTML(product.name)}"
          class="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/90 dark:bg-slate-900/90 shadow flex items-center justify-center ${isWish ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}">
          <i class="fa-solid fa-heart" aria-hidden="true"></i>
        </button>
        <div class="hn-product-visual" onclick="openProductModal(${Number(product.id)})" role="button" tabindex="0"
          onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openProductModal(${Number(product.id)});}">
          <div class="hn-product-icon" aria-hidden="true"><i class="fa-solid ${icon}"></i></div>
          ${imageMarkup}
          <span class="hn-product-stock">${escapeHTML(product.stock || 'متوفر')}</span>
          ${(product.id >= 51 && product.id <= 150) ? '<span class="hn-product-badge">قسم جديد</span>' : ''}
        </div>
        <div class="flex items-center justify-between gap-2 mb-1 hn-product-meta">
          <span class="text-amber-500 font-extrabold"><i class="fa-solid fa-star" aria-hidden="true"></i> ${Number(product.rating || 4.5).toFixed(1)}</span>
          <span>${categoryLabel}</span>
        </div>
        <h3 class="hn-product-name">${escapeHTML(product.name)}</h3>
        <div class="mt-auto pt-3 mt-3 border-t border-stone-200/70 dark:border-stone-700 flex items-center justify-between gap-2">
          <div><span class="block text-[10px] text-stone-400">السعر</span>
            <span class="hn-product-price">${Number(product.price).toFixed(2)} <small class="text-[10px] font-semibold">ج.م</small></span>
          </div>
          <button type="button" class="hn-product-add" onclick="addToCart(${Number(product.id)},1,this)"
            aria-label="إضافة ${escapeHTML(product.name)} إلى السلة" title="إضافة للسلة">
            <i class="fa-solid fa-cart-plus" aria-hidden="true"></i>
          </button>
        </div>
      </article>`;
  }

  function renderProducts() {
    const catalog = document.getElementById('products-catalog');
    const legacyGrid = document.getElementById('products-grid');
    if (!catalog || !legacyGrid) return;

    let groupsRoot = document.getElementById('hn-product-groups');
    if (!groupsRoot) {
      groupsRoot = document.createElement('div');
      groupsRoot.id = 'hn-product-groups';
      legacyGrid.insertAdjacentElement('beforebegin', groupsRoot);
      legacyGrid.hidden = true;
      legacyGrid.classList.add('hidden');
      const oldLoadMore = document.getElementById('load-more-btn');
      if (oldLoadMore) oldLoadMore.hidden = true;
    }

    const baseProducts = PRODUCTS_DATABASE.filter(product => Number(product.id) <= 50);
    const homeProducts = PRODUCTS_DATABASE.filter(product => product.category === 'home-tools');
    const electronicProducts = PRODUCTS_DATABASE.filter(product => product.category === 'electronics');
    const cleaningProducts = PRODUCTS_DATABASE.filter(product => product.category === 'cleaning');
    const categoryGroups = [
      { id: 'base', title: 'منتجات السوبر ماركت', subtitle: 'الأغذية والمشروبات والمنتجات اليومية', icon: 'fa-basket-shopping', products: baseProducts },
      { id: 'home-tools', title: 'الأدوات المنزلية', subtitle: 'كل ما تحتاجه لتنظيم وتجهيز منزلك', icon: 'fa-house', products: homeProducts },
      { id: 'electronics', title: 'الأجهزة الكهربائية', subtitle: 'أجهزة عملية وأدوات تساعدك في البيت', icon: 'fa-plug', products: electronicProducts },
      { id: 'cleaning', title: 'المنظفات والمطهرات', subtitle: 'منتجات العناية بنظافة البيت والأسطح والملابس', icon: 'fa-spray-can-sparkles', products: cleaningProducts }
    ];

    const visibleGroups = activeCategory === 'all'
      ? categoryGroups
      : categoryGroups.filter(group => activeCategory === 'home-tools' ? group.id === 'home-tools'
        : activeCategory === 'electronics' ? group.id === 'electronics'
          : activeCategory === 'cleaning' ? group.id === 'cleaning' : group.id === 'base');

    let hasMore = false;
    groupsRoot.innerHTML = visibleGroups.map(group => {
      const filtered = group.products.filter(product => Number(product.price) <= Number(maxBudget));
      const selected = activeCategory === 'all' && group.id === 'base'
        ? filtered
        : filtered.filter(product => activeCategory === 'all' || group.id !== 'base' || product.category === activeCategory);
      const limit = 4;
      const visible = selected.slice(0, limit);
      if (selected.length > 4) hasMore = true;
      const cards = visible.length
        ? visible.map(renderProductCard).join('')
        : '<div class="hn-empty-state"><i class="fa-solid fa-magnifying-glass mb-2 text-xl"></i><p class="font-bold">مفيش منتجات مطابقة للميزانية الحالية.</p></div>';
      return `
        <section class="hn-product-group" aria-labelledby="hn-group-${group.id}">
          <div class="hn-product-group-head">
            <div class="hn-product-group-icon"><i class="fa-solid ${group.icon}" aria-hidden="true"></i></div>
            <div class="min-w-0">
              <h3 id="hn-group-${group.id}">${group.title}</h3>
              <p>${group.subtitle}</p>
            </div>
            <span class="hn-product-count">${selected.length} منتج</span>
          </div>
          <div class="hn-product-grid">${cards}</div>
        </section>`;
    }).join('');

    const moreButton = document.getElementById('load-more-btn');
    if (moreButton) {
      moreButton.hidden = !hasMore;
      moreButton.textContent = 'عرض باقي المنتجات';
      moreButton.onclick = () => { window.location.href = 'products.html'; };
    }
    const catalogTitle = document.getElementById('catalog-title');
    if (catalogTitle) {
      const selectedMeta = CATEGORY_META.find(category => category.id === activeCategory);
      catalogTitle.textContent = activeCategory === 'all' ? 'تسوّق حسب الأقسام' : (selectedMeta?.label || 'المنتجات');
    }
    if (typeof setupDragAndDrop === 'function') setupDragAndDrop();
  }

  function injectOffersHub() {
    const hero = document.getElementById('vf-hero');
    if (!hero || document.getElementById('hn-news-hub')) return;

    const hub = document.createElement('section');
    hub.id = 'hn-news-hub';
    hub.className = 'hn-offers-section reveal-on-scroll hn-motion-section';
    hub.setAttribute('aria-labelledby', 'hn-hub-heading');
    hub.innerHTML = `
      <div class="hn-offers-heading hn-motion-heading">
        <div>
          <span class="hn-hub-eyebrow"><i class="fa-solid fa-sparkles" aria-hidden="true"></i> جديد HyperNest</span>
          <h2 id="hn-hub-heading" class="hn-hub-title">كل جديد من HyperNest في مكان واحد</h2>
          <p class="hn-hub-subtitle">عروض واضحة، أكواد خصم، ومكافآت — من غير ما تزاحم تجربة التسوق.</p>
        </div>
        <span class="hn-loyalty-pill"><i class="fa-solid fa-award" aria-hidden="true"></i> نادي الولاء · <b id="hn-loyalty-points">0</b> نقطة</span>
      </div>

      <div class="hn-offer-slider" aria-roledescription="carousel" aria-label="عروض HyperNest">
        <div class="hn-offer-track" id="hn-offer-track" aria-live="polite">
          <article class="hn-offer-slide hn-offer-slide--fresh" data-slide="0">
            <div class="hn-offer-copy"><span class="hn-offer-kicker">اختيارات طازجة كل يوم</span><h3>الطازج اللي بتحبه<br>في مشوار واحد</h3><p>اختار احتياجات بيتك من الخضار والفاكهة والمنتجات اليومية بسهولة.</p><button type="button" class="hn-offer-cta" data-offer-category="produce">تسوق الخضار والفاكهة <i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button></div>
            <div class="hn-offer-art hn-offer-art--produce" aria-hidden="true"><span><i class="fa-solid fa-carrot"></i></span><span><i class="fa-solid fa-lemon"></i></span><span><i class="fa-solid fa-apple-whole"></i></span><span><i class="fa-solid fa-leaf"></i></span></div>
            <span class="hn-offer-number">01 / 03</span>
          </article>
          <article class="hn-offer-slide hn-offer-slide--pantry" data-slide="1" hidden>
            <div class="hn-offer-copy"><span class="hn-offer-kicker">كل أساسيات البيت</span><h3>كمّل مشترياتك<br>من غير لف كتير</h3><p>من الألبان والمخبوزات لحد احتياجات المطبخ اليومية — كل قسم واضح وسهل.</p><button type="button" class="hn-offer-cta" data-offer-category="dairy">اكتشف المنتجات <i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button></div>
            <div class="hn-offer-art hn-offer-art--pantry" aria-hidden="true"><span><i class="fa-solid fa-glass-water"></i></span><span><i class="fa-solid fa-cheese"></i></span><span><i class="fa-solid fa-cookie-bite"></i></span><span><i class="fa-solid fa-bread-slice"></i></span></div>
            <span class="hn-offer-number">02 / 03</span>
          </article>
          <article class="hn-offer-slide hn-offer-slide--home" data-slide="2" hidden>
            <div class="hn-offer-copy"><span class="hn-offer-kicker">وصل حديثًا</span><h3>من المطبخ<br>لحد كل ركن في البيت</h3><p>50 منتجًا جديدًا بين الأدوات المنزلية والأجهزة والإلكترونيات لتجربة كتالوج أوسع.</p><button type="button" class="hn-offer-cta" data-offer-category="home-tools">شوف المنتجات الجديدة <i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button></div>
            <div class="hn-offer-art hn-offer-art--home" aria-hidden="true"><span><i class="fa-solid fa-mug-hot"></i></span><span><i class="fa-solid fa-kitchen-set"></i></span><span><i class="fa-solid fa-basket-shopping"></i></span><span><i class="fa-solid fa-lightbulb"></i></span></div>
            <span class="hn-offer-number">03 / 03</span>
          </article>
        </div>
        <div class="hn-offer-controls">
          <div class="hn-offer-dots" role="group" aria-label="اختيار العرض">
            <button type="button" class="is-active" data-offer-dot="0" aria-label="العرض الأول" aria-pressed="true"></button>
            <button type="button" data-offer-dot="1" aria-label="العرض الثاني" aria-pressed="false"></button>
            <button type="button" data-offer-dot="2" aria-label="العرض الثالث" aria-pressed="false"></button>
          </div>
          <div class="hn-offer-arrows"><button type="button" id="hn-offer-prev" aria-label="العرض السابق"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button><button type="button" id="hn-offer-next" aria-label="العرض التالي"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button></div>
        </div>
      </div>

      <div class="hn-hub-features" aria-label="مميزات وعروض إضافية">
        <article class="hn-hub-feature hn-coupon-feature" data-hn-stagger>
          <div class="hn-feature-topline"><span class="hn-feature-icon"><i class="fa-solid fa-ticket" aria-hidden="true"></i></span><span class="hn-feature-label">عرض ترحيبي</span></div>
          <h3>وفّر على طلبك القادم</h3>
          <p>اختار الكود المناسب وطبّقه من السلة. الأكواد هنا تجريبية للعرض وليست مرتبطة ببوابة دفع حقيقية.</p>
          <div class="hn-coupon-list">
            <div class="hn-coupon-row"><div><b>HYPERNEST20</b><small>خصم 20%</small></div><button type="button" data-copy-code="HYPERNEST20" aria-label="نسخ كود HYPERNEST20"><i class="fa-regular fa-copy" aria-hidden="true"></i> نسخ</button><button type="button" data-apply-code="HYPERNEST20">تطبيق</button></div>
            <div class="hn-coupon-row"><div><b>SAVE10</b><small>خصم 10%</small></div><button type="button" data-copy-code="SAVE10" aria-label="نسخ كود SAVE10"><i class="fa-regular fa-copy" aria-hidden="true"></i> نسخ</button><button type="button" data-apply-code="SAVE10">تطبيق</button></div>
          </div>
        </article>

        <article class="hn-hub-feature hn-rewards-feature" data-hn-stagger>
          <div class="hn-feature-topline"><span class="hn-feature-icon"><i class="fa-solid fa-gift" aria-hidden="true"></i></span><span class="hn-feature-label">مكافآت التوفير</span></div>
          <h3>جرّب عجلة التوفير</h3>
          <p>لف العجلة وشاهد تجربة الخصم داخل النموذج التجريبي، من غير ما تغطي على الـ Hero.</p>
          <div class="hn-rewards-actions"><button type="button" class="hn-feature-primary" onclick="toggleSpinWheelModal()"><i class="fa-solid fa-rotate" aria-hidden="true"></i> افتح العجلة</button><button type="button" class="hn-feature-secondary" onclick="shareFamilyList()"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i> مشاركة قائمة العائلة</button></div>
          <div class="hn-reward-orbit" aria-hidden="true"><span><i class="fa-solid fa-percent"></i></span><span><i class="fa-solid fa-star"></i></span><span><i class="fa-solid fa-gift"></i></span></div>
        </article>

        <article class="hn-hub-feature hn-arrivals-feature" data-hn-stagger>
          <div class="hn-feature-topline"><span class="hn-feature-icon"><i class="fa-solid fa-box-open" aria-hidden="true"></i></span><span class="hn-feature-label">وصل حديثًا</span></div>
          <h3>البيت والإلكترونيات</h3>
          <p>أضفنا 50 منتجًا جديدًا بين الأدوات المنزلية والأجهزة والإلكترونيات لتجربة كتالوج أوسع.</p>
          <div class="hn-arrival-tags"><button type="button" data-offer-category="home-tools"><i class="fa-solid fa-house" aria-hidden="true"></i> الأدوات المنزلية</button><button type="button" data-offer-category="electronics"><i class="fa-solid fa-plug" aria-hidden="true"></i> الإلكترونيات</button></div>
        </article>
      </div>
      <div class="hn-hub-footnote"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> العروض والأكواد والمكافآت المعروضة تجريبية ضمن نموذج HyperNest.</div>`;

    hero.insertAdjacentElement('afterend', hub);
    const loyaltySource = document.getElementById('loyalty-points');
    const loyaltyTarget = document.getElementById('hn-loyalty-points');
    if (loyaltySource && loyaltyTarget) loyaltyTarget.textContent = loyaltySource.textContent.replace(/[^0-9]/g, '') || '0';

    const slides = [...hub.querySelectorAll('.hn-offer-slide')];
    const dots = [...hub.querySelectorAll('[data-offer-dot]')];
    let activeSlide = 0;
    const showSlide = index => {
      activeSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.hidden = i !== activeSlide; });
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === activeSlide);
        dot.setAttribute('aria-pressed', String(i === activeSlide));
      });
    };
    hub.querySelector('#hn-offer-prev')?.addEventListener('click', () => showSlide(activeSlide - 1));
    hub.querySelector('#hn-offer-next')?.addEventListener('click', () => showSlide(activeSlide + 1));
    dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.offerDot))));
    hub.querySelectorAll('[data-offer-category]').forEach(button => button.addEventListener('click', () => {
      if (typeof filterCategory === 'function') filterCategory(button.dataset.offerCategory);
      document.getElementById('products-catalog')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }));
    hub.querySelectorAll('[data-copy-code]').forEach(button => button.addEventListener('click', () => copyPromoCode(button.dataset.copyCode)));
    hub.querySelectorAll('[data-apply-code]').forEach(button => button.addEventListener('click', () => {
      const input = document.getElementById('promo-code-input');
      if (input) input.value = button.dataset.applyCode;
      closeCartDrawer();
      openCartDrawer();
      if (typeof applyPromoCode === 'function') applyPromoCode();
      showToast(`تم تجهيز كود ${button.dataset.applyCode} في السلة التجريبية`);
    }));

    let startX = 0;
    const slider = hub.querySelector('.hn-offer-slider');
    slider?.addEventListener('touchstart', event => { startX = event.changedTouches[0].clientX; }, { passive: true });
    slider?.addEventListener('touchend', event => {
      const delta = event.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 45) showSlide(activeSlide + (delta > 0 ? 1 : -1));
    }, { passive: true });
    slider?.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') showSlide(activeSlide + 1);
      if (event.key === 'ArrowRight') showSlide(activeSlide - 1);
    });
  }

  function setupScrollStory() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = [
      document.getElementById('hn-news-hub'),
      document.getElementById('categories'),
      document.getElementById('products-catalog'),
      document.getElementById('smart-baskets'),
      document.getElementById('store-map'),
      document.getElementById('order-track'),
      document.getElementById('testimonials'),
      document.getElementById('faq')
    ].filter(Boolean);

    targets.forEach(section => {
      section.classList.add('hn-motion-section');
      section.querySelectorAll('.hn-product-card, .hn-product-group, .hn-hub-feature, .grid > *, #map-zone-info').forEach((item, index) => {
        item.classList.add('hn-motion-item');
        item.style.setProperty('--hn-motion-index', Math.min(index, 9));
      });
    });

    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach(section => section.classList.add('hn-in-view', 'revealed'));
    } else {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('hn-in-view', 'revealed');
        observer.unobserve(entry.target);
      }), { threshold: .12, rootMargin: '0px 0px -7% 0px' });
      targets.forEach(section => observer.observe(section));
    }

    const map = document.getElementById('store-map');
    const mapStage = map?.querySelector('.hn-map-stage');
    if (mapStage && !reduced && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      mapStage.addEventListener('pointermove', event => {
        const rect = mapStage.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        mapStage.style.setProperty('--hn-map-tilt-x', `${(-y * 2.2).toFixed(2)}deg`);
        mapStage.style.setProperty('--hn-map-tilt-y', `${(x * 2.8).toFixed(2)}deg`);
      });
      mapStage.addEventListener('pointerleave', () => {
        mapStage.style.setProperty('--hn-map-tilt-x', '0deg');
        mapStage.style.setProperty('--hn-map-tilt-y', '0deg');
      });
    }

    window.shareFamilyList = async function () {
      const items = Array.isArray(cart) ? cart : [];
      const text = items.length
        ? `قائمة مشتريات العائلة من HyperNest:\n${items.map(item => `• ${item.name} × ${item.quantity}`).join('\n')}`
        : 'قائمة مشتريات العائلة من HyperNest: لسه ما ضفناش منتجات. افتح المتجر واختار احتياجاتك.';
      try {
        if (navigator.share) await navigator.share({ title: 'قائمة العائلة | HyperNest', text });
        else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); showToast('تم نسخ قائمة العائلة للمشاركة'); }
        else showToast('المشاركة غير مدعومة على هذا المتصفح');
      } catch (error) {
        if (error?.name !== 'AbortError') showToast('تعذر مشاركة القائمة حاليًا');
      }
    };

    window.browseAllProductsFromCart = function () {
      if (typeof closeCartDrawer === 'function') closeCartDrawer();
      activeCategory = 'all';
      showAllProducts = true;
      maxBudget = 1500;
      const search = document.getElementById('search-input');
      const mobileSearch = document.getElementById('search-input-mobile');
      if (search) search.value = '';
      if (mobileSearch) mobileSearch.value = '';
      const budget = document.getElementById('budget-range');
      const budgetValue = document.getElementById('budget-value');
      if (budget) budget.value = '1500';
      if (budgetValue) budgetValue.textContent = '1500 ج.م';
      if (typeof renderCategories === 'function') renderCategories();
      if (typeof renderProducts === 'function') renderProducts();
      else if (typeof renderCatalogProducts === 'function') renderCatalogProducts();
      const catalog = document.getElementById('products-catalog');
      catalog?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => {
        const heading = document.getElementById('catalog-title') || catalog;
        if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
      }, prefersReducedMotion ? 0 : 550);
    };
  }

  function setupBranding() {
    document.title = 'HyperNest | تسوّق بذكاء';
    const replaceText = text => String(text)
      .replace(/My\s*Market/gi, 'HyperNest')
      .replace(/ماي\s*ماركت/g, 'هايبر نست')
      .replace(/MYMARKET20/g, 'HYPERNEST20');

    function visitTextNodes(root) {
      if (!root) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const parent = node.parentElement;
        if (!parent || parent.closest('script,style,textarea,option,svg')) continue;
        nodes.push(node);
      }
      nodes.forEach(node => {
        const updated = replaceText(node.nodeValue);
        if (updated !== node.nodeValue) node.nodeValue = updated;
      });
    }

    visitTextNodes(document.body);
    const observer = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          if (!node.parentElement?.closest('script,style,textarea,option,svg')) node.nodeValue = replaceText(node.nodeValue);
        } else if (node.nodeType === Node.ELEMENT_NODE) visitTextNodes(node);
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const socialContainer = document.querySelector('footer .fa-brands.fa-instagram')?.closest('.flex');
    if (socialContainer) {
      socialContainer.querySelectorAll('a').forEach(anchor => anchor.remove());
      const links = [
        { href: INSTAGRAM_URL, icon: 'fa-brands fa-instagram', label: 'Instagram' },
        { href: GITHUB_URL, icon: 'fa-brands fa-github', label: 'GitHub' }
      ];
      links.forEach(link => {
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.setAttribute('aria-label', link.label);
        anchor.title = link.label;
        anchor.className = 'hover:text-skyBrand-400 transition';
        anchor.innerHTML = `<i class="${link.icon}" aria-hidden="true"></i>`;
        socialContainer.appendChild(anchor);
      });
    }

    const footerBottom = document.querySelector('footer .max-w-7xl.mt-8');
    if (footerBottom && !document.getElementById('hn-credit')) {
      const credit = document.createElement('p');
      credit.id = 'hn-credit';
      credit.className = 'hn-credit';
      credit.innerHTML = `<span>Developed with</span> <i class="fa-solid fa-heart hn-credit-heart" role="img" aria-label="love"></i> <span>by</span> <a class="hn-credit-link" href="${GITHUB_URL}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github" aria-hidden="true"></i> Simo</a>`;
      footerBottom.appendChild(credit);
    }
  }

  function replaceEmojiText(root) {
    if (!root) return;
    const emojiPattern = /(?!\u2713)[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}](?:\uFE0F|\uFE0E)?/gu;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!parent || parent.closest('script,style,textarea,input,option,svg,i')) continue;
      if (emojiPattern.test(node.nodeValue)) { emojiPattern.lastIndex = 0; nodes.push(node); }
      emojiPattern.lastIndex = 0;
    }

    nodes.forEach(node => {
      const source = node.nodeValue;
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      source.replace(emojiPattern, (match, offset) => {
        if (offset > lastIndex) fragment.appendChild(document.createTextNode(source.slice(lastIndex, offset)));
        const icon = document.createElement('i');
        icon.className = `fa-solid ${EMOJI_ICON_MAP.get(match) || 'fa-circle'}`;
        icon.setAttribute('aria-hidden', 'true');
        icon.style.marginInline = '.12em';
        fragment.appendChild(icon);
        lastIndex = offset + match.length;
        return match;
      });
      if (lastIndex < source.length) fragment.appendChild(document.createTextNode(source.slice(lastIndex)));
      node.replaceWith(fragment);
    });
  }

  function stripEmojiFromSVG() {
    const svg = document.getElementById('store-svg-container');
    if (!svg) return;
    const walker = document.createTreeWalker(svg, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const emojiPattern = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}](?:\uFE0F|\uFE0E)?/gu;
    nodes.forEach(node => { node.nodeValue = node.nodeValue.replace(emojiPattern, ''); });
  }

  function installFunctionWrappers() {
    const wrap = (name, after) => {
      const original = window[name];
      if (typeof original !== 'function' || original.__hyperNestWrapped) return;
      const wrapped = function (...args) {
        const result = original.apply(this, args);
        try { after?.(result, args); } catch (error) { console.warn(`[HyperNest] ${name} post-hook failed:`, error); }
        return result;
      };
      wrapped.__hyperNestWrapped = true;
      window[name] = wrapped;
    };

    wrap('addToCart', saveState);
    wrap('updateQuantity', saveState);
    wrap('confirmClearCart', () => {
      const promoInput = document.getElementById('promo-code-input');
      const promoMessage = document.getElementById('promo-message');
      if (promoInput) promoInput.value = '';
      if (promoMessage) promoMessage.classList.add('hidden');
      saveState();
    });
    wrap('checkoutCart', saveState);
    wrap('toggleWishlist', saveState);
    wrap('selectDeliverySlot', saveState);
    wrap('toggleThemeWithRipple', saveState);
    wrap('applyPromoCode', saveState);
    wrap('copyPromoCode', saveState);
    wrap('spinTheWheel', () => window.setTimeout(saveState, 3200));

    // Products added in this upgrade are icon-led (no external image dependency).
    const originalFlyToCart = window.flyToCart;
    if (typeof originalFlyToCart === 'function' && !originalFlyToCart.__hyperNestWrapped) {
      const flyToCart = function (origin, src) {
        if (!src) { if (typeof bumpCart === 'function') bumpCart(); return; }
        return originalFlyToCart.apply(this, arguments);
      };
      flyToCart.__hyperNestWrapped = true;
      window.flyToCart = flyToCart;
    }

    const addIconFallbacks = root => {
      if (!root) return;
      root.querySelectorAll('img').forEach(img => {
        if (img.getAttribute('src')) return;
        const row = img.closest('.flex.items-center');
        const label = row?.querySelector('h4,h5')?.textContent?.trim();
        const owner = img.closest('[onclick*=\"openProductModal\"]');
        const cardId = owner?.getAttribute('onclick')?.match(/openProductModal\((\d+)\)/)?.[1];
        const product = PRODUCTS_DATABASE.find(item => item.name === label) || PRODUCTS_DATABASE.find(item => item.id === Number(cardId)) || PRODUCTS_DATABASE.find(item => item.id === Number(window.__hnActiveProductId));
        if (!product) { img.remove(); return; }
        const tile = document.createElement('div');
        tile.className = 'hn-mini-product-icon';
        tile.setAttribute('aria-hidden', 'true');
        const icon = document.createElement('i');
        icon.className = `fa-solid ${product.faIcon || ICON_BY_CATEGORY[product.category] || 'fa-box'}`;
        tile.appendChild(icon);
        img.replaceWith(tile);
      });
    };

    wrap('updateCartUI', () => addIconFallbacks(document.getElementById('cart-drawer-items')));
    wrap('updateWishlistUI', () => addIconFallbacks(document.getElementById('wishlist-drawer-items')));
    wrap('renderRecentlyViewed', () => addIconFallbacks(document.getElementById('recently-viewed-grid')));
    wrap('openProductModal', (_result, args) => {
      window.__hnActiveProductId = Number(args[0]);
      const content = document.getElementById('modal-content');
      addIconFallbacks(content);
    });

    const originalResize = window.vfResize;
    if (typeof originalResize === 'function' && !originalResize.__hyperNestWrapped) {
      const resized = function (...args) {
        const result = originalResize.apply(this, args);
        const hero = document.getElementById('vf-hero');
        if (hero && typeof VF !== 'undefined') {
          const mobile = VF.W < 768;
          const size = mobile
            ? Math.min(VF.H * .36, VF.W * .56)
            : Math.min(VF.H * .40, VF.W * .29);
          hero.style.setProperty('--vf-mh', `${Math.max(210, size)}px`);
          const xs = VF.W < 420 ? [0, .405, .53, .58, .615, .635] : [0, .36, .5, .56, .6, .62];
          xs.forEach((value, index) => { VF_XS_M[index] = value; });
        }
        return result;
      };
      resized.__hyperNestWrapped = true;
      window.vfResize = resized;
    }

    const originalRenderFloor = window.renderFloorSVG;
    if (typeof originalRenderFloor === 'function' && !originalRenderFloor.__hyperNestWrapped) {
      const renderFloor = function (...args) {
        const result = originalRenderFloor.apply(this, args);
        stripEmojiFromSVG();
        return result;
      };
      renderFloor.__hyperNestWrapped = true;
      window.renderFloorSVG = renderFloor;
    }

    // Avoid simulated purchases and decorative emoji bursts; both distract from shopping.
    window.startLiveSalesSimulation = function () { };
    window.setupCursorAndParticles = function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth < 768) return;
      const glow = document.getElementById('cursor-glow');
      if (!glow) return;
      window.addEventListener('mousemove', event => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
      }, { passive: true });
      const particleIcons = ['fa-apple-whole', 'fa-lemon', 'fa-cheese', 'fa-bread-slice', 'fa-drumstick-bite', 'fa-bottle-water'];
      window.addEventListener('click', event => {
        particleIcons.forEach(iconName => {
          const particle = document.createElement('div');
          particle.className = 'click-particle';
          particle.setAttribute('aria-hidden', 'true');
          particle.innerHTML = `<i class="fa-solid ${iconName}"></i>`;
          particle.style.left = `${event.clientX}px`;
          particle.style.top = `${event.clientY}px`;
          const angle = Math.random() * Math.PI * 2;
          const distance = 40 + Math.random() * 60;
          particle.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
          particle.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
          particle.style.setProperty('--rot', `${Math.random() * 360}deg`);
          document.body.appendChild(particle);
          window.setTimeout(() => particle.remove(), 800);
        });
      }, { passive: true });
    };

    // More accurate copy feedback; the previous helper only showed a toast.
    window.copyPromoCode = async function (code) {
      const value = String(code || '').trim();
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        showToast(`تم نسخ كود الخصم: ${value}`);
      } catch (error) {
        const field = document.createElement('textarea');
        field.value = value;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        showToast(copied ? `تم نسخ كود الخصم: ${value}` : 'انسخ الكود يدويًا من القائمة');
      }
      saveState();
    };

    // Expose the updated brand coupon while keeping the original demo validator intact.
    const applyPromoOriginal = window.applyPromoCode;
    if (typeof applyPromoOriginal === 'function') {
      window.applyPromoCode = function () {
        const input = document.getElementById('promo-code-input');
        const selectedCode = input?.value.trim().toUpperCase() || '';
        if (input && selectedCode === 'HYPERNEST20') input.value = 'MYMARKET20';
        const result = applyPromoOriginal.call(this);
        if (input && selectedCode === 'HYPERNEST20') input.value = 'HYPERNEST20';
        saveState();
        return result;
      };
    }

    // Render safe text instead of assigning arbitrary toast HTML.
    window.showToast = function (message) {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = 'hn-toast bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold transition-all duration-300 flex items-center gap-2';
      const icon = document.createElement('i');
      icon.className = 'fa-solid fa-circle-check text-emerald-400';
      icon.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span');
      text.textContent = String(message ?? '').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim();
      toast.append(icon, text);
      container.appendChild(toast);
      requestAnimationFrame(() => toast.classList.add('is-visible'));
      window.setTimeout(() => {
        toast.classList.remove('is-visible');
        window.setTimeout(() => toast.remove(), 260);
      }, 2800);
    };
  }

  function setInitialTheme() {
    const saved = safeReadState();
    if (saved?.theme === 'dark' || saved?.theme === 'light') {
      document.documentElement.classList.toggle('dark', saved.theme === 'dark');
    }
    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = document.documentElement.classList.contains('dark')
      ? 'fa-solid fa-sun text-base sm:text-lg relative z-10'
      : 'fa-solid fa-moon text-base sm:text-lg relative z-10';
  }


  function applyVisualTextCleanup() {
    replaceEmojiText(document.body);
    stripEmojiFromSVG();
    const wheel = document.getElementById('wheel-graphic');
    if (wheel) wheel.textContent = 'توفير';
    const spinButton = document.getElementById('spin-btn');
    if (spinButton) spinButton.textContent = 'لف العجلة الآن';
    const points = document.getElementById('loyalty-points');
    const target = document.getElementById('hn-loyalty-points');
    if (points && target) target.textContent = points.textContent.replace(/[^0-9]/g, '') || '240';
  }
  const BUDGET_MIN = 100;
  const BUDGET_MAX = 10000;

  function resetBudgetUI() {
    maxBudget = BUDGET_MAX;
    const range = document.getElementById('budget-range');
    const label = document.getElementById('budget-value');
    if (range) { range.min = BUDGET_MIN; range.max = BUDGET_MAX; range.value = BUDGET_MAX; }
    if (label) label.textContent = `${BUDGET_MAX} ج.م`;
  }
  /* ===== HyperNest round 3 extras ===== */
  const TESTIMONIALS = [
    ['منى عبد الرحمن', 'عميلة دائمة · القاهرة', 'الخضار والفاكهة من هايبر نست بتوصل كأنها لسه مقطوفة! التغليف ممتاز والتوصيل سريع جداً في أقل من ساعة.', 5],
    ['أحمد هشام', 'عميل · المنصورة', 'أسهل موقع تسوق أونلاين استخدمته، وخاصية سحب المنتجات للسلة مريحة أوي بصراحة!', 5],
    ['سارة محمود', 'عميلة · الإسكندرية', 'أسعارهم منافسة جداً والعروض اليومية بتوفر كتير في ميزانية البيت الشهرية. خدمة الدعم محترمة جداً.', 5],
    ['ندى كمال', 'عميلة جديدة · طنطا', 'السلال الذكية وفرت عليا وقت ترتيب الطلب الأسبوعي، والخريطة بتساعدني ألاقي الأقسام بسرعة.', 5],
    ['عمر السيد', 'عميل · الزقازيق', 'طلبت بقالة الأسبوع كلها والمنتجات وصلت سليمة ومرتبة. الدجاج كان طازج فعلاً.', 5],
    ['هبة إبراهيم', 'عميلة دائمة · دمياط', 'الألبان طازجة وتاريخ الصلاحية بعيد، وده أهم حاجة عندي. هطلب تاني أكيد.', 5],
    ['يوسف عادل', 'عميل · الجيزة', 'الموقع سريع وسهل على الموبايل، وكود الخصم اشتغل من أول مرة.', 4],
    ['آية فتحي', 'عميلة · المنصورة', 'عجبني إن منتجات البيت والأجهزة في قسم لوحدها وسهل الوصول لها.', 5],
    ['كريم مصطفى', 'عميل · بورسعيد', 'التوصيل اتأخر شوية يوم الجمعة، بس الدعم رد بسرعة وعوضني. خدمة محترمة.', 4],
    ['دينا سمير', 'عميلة · شبين الكوم', 'الخبز والمخبوزات طازجة وريحتها حلوة. الكرواسون بقى عادة أسبوعية عندنا.', 5],
    ['محمود رضا', 'عميل · أسيوط', 'الأسعار مناسبة جداً مقارنة بالسوبر ماركت اللي جنبنا، والاختيارات كتير.', 5],
    ['رنا حسام', 'عميلة · السويس', 'الدفع عند الاستلام مريح، والمندوب كان محترم وسلّم الطلب في الميعاد.', 5],
    ['مصطفى جمال', 'عميل · القاهرة', 'عصير البرتقال طعمه طبيعي فعلاً، مش زي العصائر الجاهزة. هكرر الطلب.', 4],
    ['نورهان أشرف', 'عميلة · المنصورة', 'بحب إني أحدد ميعاد التوصيل من السلة، بيناسب مواعيد شغلي.', 5],
    ['إسلام نبيل', 'عميل · طنطا', 'أدوات المطبخ اللي طلبتها جودتها حلوة وسعرها أقل من المحلات.', 5],
    ['مريم وائل', 'عميلة · الإسكندرية', 'المفضلة والبحث السريع خلوا الطلب يخلص في دقايق.', 4],
    ['باسم خالد', 'عميل · الإسماعيلية', 'الدعم الفني رد عليا في أقل من ربع ساعة وحل مشكلة الدفع.', 5],
    ['جميلة سعيد', 'عميلة · المنيا', 'الخضار نضيف ومتغلف كويس، وكل حاجة وصلت زي الصور بالظبط.', 5],
    ['طارق فؤاد', 'عميل · كفر الشيخ', 'الموقع منظم وسهل الوصول للأقسام، والتجربة كلها مريحة.', 4],
    ['شيماء عصام', 'عميلة · الفيوم', 'طلبت مكنسة كهربائية وجت متغلفة كويس وشغالة تمام، والسعر مناسب.', 5],
    ['حسام الدين', 'عميل · بنها', 'العروض الأسبوعية بتفرق في المصاريف، ومبقتش أروح السوبر ماركت إلا نادراً.', 5]
  ];

  function initTestimonials() {
    const grid = document.getElementById('testimonials-grid');
    if (!grid || grid.dataset.ready) return;
    grid.dataset.ready = '1';
    const HOLD_MS = 3500; // مدة بقاء كل مجموعة قبل التبديل
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const perView = () => (window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);
    let start = 0, timer = 0, paused = false, busy = false, onScreen = true;

    const cardHTML = ([name, meta, text, stars]) => `
      <article class="hn-testimonial bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 relative flex flex-col">
        <div class="flex items-center gap-1 text-sm mb-3" role="img" aria-label="تقييم ${stars} من 5">
          ${[1, 2, 3, 4, 5].map(n => `<i class="fa-solid fa-star ${n <= stars ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}" aria-hidden="true"></i>`).join('')}
        </div>
        <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">"${escapeHTML(text)}"</p>
        <div class="flex items-center gap-3 mt-auto">
          <div class="w-10 h-10 shrink-0 rounded-full bg-skyBrand-100 dark:bg-skyBrand-900 text-skyBrand-600 font-bold flex items-center justify-center" aria-hidden="true">${escapeHTML(name.charAt(0))}</div>
          <div>
            <h4 class="text-sm font-bold text-slate-800 dark:text-white">${escapeHTML(name)}</h4>
            <span class="text-xs text-slate-400">${escapeHTML(meta)}</span>
          </div>
        </div>
      </article>`;

    const render = () => {
      const n = perView();
      grid.innerHTML = Array.from({ length: n }, (_, i) => cardHTML(TESTIMONIALS[(start + i) % TESTIMONIALS.length])).join('');
    };
    const schedule = () => { clearTimeout(timer); timer = window.setTimeout(next, HOLD_MS); };

    function next() {
      if (busy || paused || !onScreen || document.hidden) return schedule();
      busy = true;
      const advance = () => { start = (start + perView()) % TESTIMONIALS.length; render(); };
      if (reduceMotion) { advance(); busy = false; return schedule(); }
      const old = [...grid.children];
      old.forEach((card, i) => { card.style.animationDelay = `${i * 90}ms`; card.classList.add('hn-t-out'); });
      window.setTimeout(() => {
        advance();
        [...grid.children].forEach((card, i) => { card.style.animationDelay = `${i * 110}ms`; card.classList.add('hn-t-in'); });
        window.setTimeout(() => { busy = false; schedule(); }, 650 + grid.children.length * 110);
      }, 420 + old.length * 90);
    }

    render();
    grid.addEventListener('mouseenter', () => { paused = true; });
    grid.addEventListener('mouseleave', () => { paused = false; });
    grid.addEventListener('focusin', () => { paused = true; });
    grid.addEventListener('focusout', () => { paused = false; });
    if ('IntersectionObserver' in window) new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }).observe(grid);
    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => { if (!busy) render(); }, 200);
    });
    schedule();
  }

  /* ارتفاع الهيدر الثابت يتحول لمتغير CSS عشان الـ Hero يتظبط على الشاشة */
  function trackHeaderHeight() {
    const header = document.querySelector('header.sticky');
    if (!header) return;
    const apply = () => {
      document.documentElement.style.setProperty('--hn-header-h', `${header.offsetHeight}px`);
      if (typeof window.vfResize === 'function') window.vfResize();
    };
    apply();
    if ('ResizeObserver' in window) new ResizeObserver(apply).observe(header);
  }

  function updateLoyaltyUI() {
    const el = document.getElementById('hn-loyalty-points');
    if (el) el.textContent = String(loyaltyPoints);
  }

  window.updateLoyaltyUI = updateLoyaltyUI;

  function initBasketReveal() {
    const section = document.getElementById('smart-baskets');
    const grid = section && section.querySelector('.grid');
    if (!grid) return;
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.classList.add('hn-play');
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      section.classList.add('hn-play');
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(grid);
  }

  function installHnExtras() {
    const after = (name, fn) => {
      const original = window[name];
      if (typeof original !== 'function' || original.__hnExtra) return;
      const wrapped = function (...args) {
        const result = original.apply(this, args);
        try { fn(result, args); } catch (error) { console.warn(`[HyperNest] ${name} hook failed:`, error); }
        return result;
      };
      wrapped.__hnExtra = true;
      window[name] = wrapped;
    };

    after('toggleThemeWithRipple', () => {
      const icon = document.getElementById('theme-icon');
      if (icon) icon.className = document.documentElement.classList.contains('dark')
        ? 'fa-solid fa-sun text-base sm:text-lg relative z-10'
        : 'fa-solid fa-moon text-base sm:text-lg relative z-10';
    });
    after('resetFilters', () => { resetBudgetUI(); renderProducts(); });
    after('trackRecentlyViewed', saveState);

    // السحب والإفلات: ربط منطقة السلة مرة واحدة بدل استبدال العنصر كل مرة
    window.setupDragAndDrop = function () {
      document.querySelectorAll('.shelf-product-item, .product-card, .vf-model').forEach(item => {
        if (item.dataset.dragBound) return;
        item.dataset.dragBound = '1';
        item.addEventListener('dragstart', event => {
          event.dataTransfer.setData('text/plain', item.dataset.id);
          event.dataTransfer.effectAllowed = 'copy';
          const product = PRODUCTS_DATABASE.find(entry => entry.id === parseInt(item.dataset.id, 10));
          if (product && event.dataTransfer.setDragImage) {
            const ghost = document.createElement('div');
            ghost.className = 'drag-ghost';
            ghost.innerHTML = `<img src="${escapeHTML(product.image)}" alt="">`;
            document.body.appendChild(ghost);
            event.dataTransfer.setDragImage(ghost, 44, 44);
            window.setTimeout(() => ghost.remove(), 0);
          }
          item.classList.add('dragging');
        });
        item.addEventListener('dragend', () => item.classList.remove('dragging'));
      });
      const zone = document.getElementById('cart-dropzone');
      if (zone && !zone.dataset.dropBound) {
        zone.dataset.dropBound = '1';
        zone.addEventListener('dragover', event => { event.preventDefault(); zone.classList.add('drag-over-dropzone'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over-dropzone'));
        zone.addEventListener('drop', event => {
          event.preventDefault();
          zone.classList.remove('drag-over-dropzone');
          if (isProcessingDrop) return;
          isProcessingDrop = true;
          const id = parseInt(event.dataTransfer.getData('text/plain'), 10);
          if (id) addToCart(id, 1);
          window.setTimeout(() => { isProcessingDrop = false; }, 100);
        });
      }
    };

    // نقاط الولاء: كل 100 ج.م = 10 نقاط، والمنتج الأغلى يكسّب نقاط أكتر
    const baseCheckout = window.checkoutCart;
    if (typeof baseCheckout === 'function' && !baseCheckout.__hnPoints) {
      const withPoints = function (...args) {
        const hadItems = cart.length > 0;
        const earned = cart.reduce((sum, item) => sum + Math.max(1, Math.round(Number(item.price) * Number(item.quantity) / 10)), 0);
        const result = baseCheckout.apply(this, args);
        if (hadItems) {
          loyaltyPoints += earned;
          updateLoyaltyUI();
          saveState();
          showToast(`كسبت ${earned} نقطة في نادي الولاء`);
        }
        return result;
      };
      withPoints.__hnPoints = true;
      window.checkoutCart = withPoints;
    }

    // كول داون: بعد 3 إضافات للسلة يتوقف الإضافة 3 ثواني
    const ACTIONS_BEFORE_COOLDOWN = 3, COOLDOWN_MS = 2000, IDLE_RESET_MS = 4000;
    let actions = 0, lastActionAt = 0, blockedUntil = 0, coolTimer = 0;
    const gate = () => {
      const now = Date.now();
      if (now < blockedUntil) return false; // صامت: الأزرار بتبهت بس بدون رسائل متكررة
      if (now - lastActionAt > IDLE_RESET_MS) actions = 0;
      lastActionAt = now;
      actions += 1;
      if (actions >= ACTIONS_BEFORE_COOLDOWN) {
        actions = 0;
        blockedUntil = now + COOLDOWN_MS;
        document.body.classList.add('hn-cart-cooldown');
        showToast('تمت إضافة 3 منتجات، ثانيتين وتكمل');
        clearTimeout(coolTimer);
        coolTimer = window.setTimeout(() => document.body.classList.remove('hn-cart-cooldown'), COOLDOWN_MS);
      }
      return true;
    };
    const baseAdd = window.addToCart;
    if (typeof baseAdd === 'function' && !baseAdd.__hnCooldown) {
      let inBasket = false;
      const guardedAdd = function (id, amount = 1, origin = null) {
        if (!inBasket && !gate()) return;
        return baseAdd.call(this, id, amount, origin);
      };
      guardedAdd.__hnCooldown = true;
      window.addToCart = guardedAdd;
      const baseBasket = window.addSmartBasket;
      if (typeof baseBasket === 'function') {
        window.addSmartBasket = function (ids) {
          if (!gate()) return;
          inBasket = true; // السلة الذكية تُحسب عملية واحدة
          try { return baseBasket.call(this, ids); } finally { inBasket = false; }
        };
      }
    }
  }

  function init() {
    addExtraProducts();
    assignMerchantData();
    setInitialTheme();
    injectOffersHub();
    setupBranding();
    injectMarketplaceSections();
    installFunctionWrappers();
    restoreState();
    resetBudgetUI();

    if (typeof renderCategories === 'function') renderCategories();
    if (typeof renderProducts === 'function') renderProducts();
    else {
      window.renderCategoryPills = renderCategories;
      window.createProductCardHTML = renderProductCard;
      window.renderCatalogProducts = renderProducts;
      renderCategories();
      renderProducts();
    }

    // Replace the original renderers so category changes, searches and wishlist updates keep the new design.
    window.renderCategoryPills = renderCategories;
    window.createProductCardHTML = renderProductCard;
    window.renderCatalogProducts = renderProducts;

    const originalSpinLabel = document.querySelector('#spin-modal h3');
    if (originalSpinLabel) originalSpinLabel.textContent = 'عجلة توفير HyperNest';
    const wheelDescription = document.querySelector('#spin-modal p');
    if (wheelDescription) wheelDescription.textContent = 'دي محاكاة بصرية فقط، وأكواد الخصم الموجودة في قسم العروض هي وسيلة التوفير التجريبية.';

    applyVisualTextCleanup();
    trackHeaderHeight();
    initTestimonials();
    initBasketReveal();
    setupScrollStory();
    updateLoyaltyUI();
    saveState();

    // Watch newly rendered sections for emoji glyphs, including later toast / map updates.
    const emojiObserver = new MutationObserver(records => records.forEach(record => {
      record.addedNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const parent = node.parentElement;
          if (parent && !parent.closest('script,style,svg,textarea,input,option,i')) replaceEmojiText(parent);
        } else if (node.nodeType === Node.ELEMENT_NODE && !node.closest('svg')) {
          replaceEmojiText(node);
        }
      });
    }));
    emojiObserver.observe(document.body, { childList: true, subtree: true });
  }

  // Add the products and patch handlers before the original DOMContentLoaded callback renders.
  addExtraProducts();
  installFunctionWrappers();
  installHnExtras();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();