(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const isProducts = document.body.dataset.page === 'products';
  const isDashboard = document.body.dataset.page === 'dashboard';
  const ORDERS_KEY = 'hypernest-demo-orders-v1';
  const readOrders = () => { try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch { return []; } };
  const writeOrders = orders => localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  const totalCart = () => (typeof cart !== 'undefined' ? cart : []).reduce((n, p) => n + Number(p.quantity || 0), 0);
  const announce = msg => { if (typeof window.showToast === 'function') showToast(msg); else alert(msg); };

  // Add cart quantity constraints without replacing the original cart logic.
  const originalAdd = window.addToCart;
  if (originalAdd && !originalAdd.__hnLimits) {
    const limitedAdd = function (id, amount = 1, origin = null) {
      const item = cart.find(p => Number(p.id) === Number(id));
      const current = item ? Number(item.quantity) : 0;
      const requested = Math.max(1, Math.floor(Number(amount) || 1));
      if (current + requested > 15) return announce('الحد الأقصى للمنتج الواحد 15 قطعة.'), false;
      if (totalCart() + requested > 30) return announce('وصلت للحد الأقصى للسلة: 30 قطعة إجماليًا.'), false;
      return originalAdd.call(this, id, requested, origin);
    };
    limitedAdd.__hnLimits = true; window.addToCart = limitedAdd;
  }
  const originalUpdate = window.updateQuantity;
  if (originalUpdate && !originalUpdate.__hnLimits) {
    const limitedUpdate = function (id, delta) {
      const item = cart.find(p => Number(p.id) === Number(id));
      if (!item) return;
      if (delta > 0 && Number(item.quantity) >= 15) return announce('الحد الأقصى للمنتج الواحد 15 قطعة.');
      if (delta > 0 && totalCart() >= 30) return announce('وصلت للحد الأقصى للسلة: 30 قطعة إجماليًا.');
      return originalUpdate.call(this, id, delta);
    };
    limitedUpdate.__hnLimits = true; window.updateQuantity = limitedUpdate;
  }

  // Save an order snapshot before the legacy checkout clears the cart.
  const originalCheckout = window.checkoutCart;
  if (originalCheckout && !originalCheckout.__hnOrders) {
    const trackedCheckout = function (...args) {
      if (!cart.length) return originalCheckout.apply(this, args);
      const subtotal = cart.reduce((sum, p) => sum + Number(p.price) * Number(p.quantity), 0);
      const discount = subtotal * (Number(window.appliedDiscountPercent) || 0);
      const points = cart.reduce((sum, p) => sum + Math.max(1, Math.round(Number(p.price) * Number(p.quantity) / 10)), 0);
      const order = { id: 'HN-' + Date.now().toString(36).toUpperCase(), date: new Date().toISOString(), items: cart.map(p => ({ id: p.id, name: p.name, price: p.price, quantity: p.quantity, category: p.category, image: p.image })), subtotal, discount, total: subtotal - discount, points, status: 'تم تسجيل الطلب (تجريبي)' };
      const orders = readOrders(); orders.unshift(order); writeOrders(orders.slice(0, 100));
      return originalCheckout.apply(this, args);
    };
    trackedCheckout.__hnOrders = true; window.checkoutCart = trackedCheckout;
  }

  const PRODUCT_GROUPS = [ // same order and grouping as index
    { key: 'food', title: 'منتجات السوبر ماركت', subtitle: 'الأغذية والمشروبات والمنتجات اليومية', icon: 'fa-basket-shopping', categories: ['produce', 'dairy', 'bakery', 'meat', 'beverages', 'household'] },
    { key: 'home', title: 'الأدوات المنزلية', subtitle: 'كل ما تحتاجه لتنظيم وتجهيز منزلك', icon: 'fa-house', categories: ['home-tools'] },
    { key: 'electronics', title: 'الأجهزة الكهربائية', subtitle: 'أجهزة عملية وأدوات تساعدك في البيت', icon: 'fa-plug', categories: ['electronics'] },
    { key: 'cleaning', title: 'المنظفات والمطهرات', subtitle: 'منتجات العناية بنظافة البيت والأسطح والملابس', icon: 'fa-spray-can-sparkles', categories: ['cleaning'] }
  ];

  function refreshWishlistButtons() {
    const saved = new Set((typeof wishlist !== 'undefined' ? wishlist : []).map(Number));
    $$('.hn-product-card[data-id]').forEach(card => {
      const btn = card.querySelector('button[onclick^="toggleWishlist"]');
      if (!btn) return;
      const active = saved.has(Number(card.dataset.id));
      btn.classList.toggle('text-rose-500', active);
      btn.classList.toggle('text-slate-400', !active);
      btn.classList.toggle('hover:text-rose-500', !active);
      const name = card.querySelector('.hn-product-name')?.textContent || '';
      btn.setAttribute('aria-label', `${active ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}: ${name}`);
    });
  }
  window.refreshHnProductWishlist = refreshWishlistButtons;
  const originalToggleWishlist = window.toggleWishlist;
  if (typeof originalToggleWishlist === 'function' && !originalToggleWishlist.__hnPageSync) {
    const syncedToggleWishlist = function (...args) {
      const result = originalToggleWishlist.apply(this, args);
      refreshWishlistButtons();
      return result;
    };
    syncedToggleWishlist.__hnPageSync = true;
    window.toggleWishlist = syncedToggleWishlist;
  }

  function productCard(p) {
    const merchantLine = p.merchant ? `<small class="hn-page-category">من تاجر: ${p.merchant.name}</small>` : '<small class="hn-page-category">من HyperNest</small>';
    const safe = String(p.name).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const active = (typeof wishlist !== 'undefined' ? wishlist : []).map(Number).includes(Number(p.id));
    const categoryLabel = CATEGORY_LABELS[p.category] || p.category;
    const rating = Number(p.rating || 4.5).toFixed(1);
    return `<article class="hn-product-card" data-product-id="${p.id}"><button class="hn-page-wish${active ? ' is-wishlisted' : ''}" type="button" aria-pressed="${active}" aria-label="${active ? 'إزالة' : 'إضافة'} ${safe} ${active ? 'من' : 'إلى'} المفضلة" onclick="toggleWishlist(${p.id})"><i class="fa-solid fa-heart" aria-hidden="true"></i></button><button class="hn-page-product-image" type="button" onclick="openProductModal(${p.id})"><img src="${p.image}" alt="${safe}" loading="lazy" decoding="async" width="500" height="500"></button><div class="hn-page-card-body"><span class="hn-page-category">${categoryLabel}</span>${merchantLine}<h3>${safe}</h3><p class="hn-page-rating"><i class="fa-solid fa-star" aria-hidden="true"></i> ${rating}</p><strong>${Number(p.price).toFixed(2)} ج.م</strong><button class="hn-page-add" type="button" onclick="addToCart(${p.id},1,this)"><i class="fa-solid fa-cart-plus" aria-hidden="true"></i> أضف للسلة</button></div></article>`;
  }

  const originalApplyPromo = window.applyPromoCode;
  if (originalApplyPromo && !originalApplyPromo.__hnLoyalty) {
    const loyaltyApply = function () {
      const input = document.getElementById('promo-code-input');
      if (input && input.value.trim().toUpperCase() === 'LOYALTY15') {
        window.appliedDiscountPercent = 0.15;
        if (typeof updateCartUI === 'function') updateCartUI();
        const msg = document.getElementById('promo-message');
        if (msg) { msg.textContent = 'تم تفعيل خصم الولاء 15%.'; msg.classList.remove('hidden'); }
        if (typeof saveState === 'function') saveState();
        announce('تم تفعيل خصم الولاء 15%.'); return;
      }
      return originalApplyPromo.apply(this, arguments);
    };
    loyaltyApply.__hnLoyalty = true; window.applyPromoCode = loyaltyApply;
  }
  if (isProducts) {
    const grid = $('#hn-all-products');
    const search = $('#hn-product-search'), category = $('#hn-product-category');
    const sort = $('#hn-product-sort'), budget = $('#hn-product-budget');
    const budgetLabel = $('#hn-product-budget-value');
    const GROUP_STEP = 8, SKELETON_MS = 2500;
    const shown = {};                 // group key -> visible count
    let filtered = [], ready = false;

    const params = new URLSearchParams(location.search);
    if (category) category.value = params.get('cat') || 'all';
    if (search && params.get('q')) search.value = params.get('q');

    const skelCard = `<article class="hn-product-card hn-skel-card"><span class="hn-skel hn-skel-visual"></span><span class="hn-skel hn-skel-line hn-skel-w50"></span><span class="hn-skel hn-skel-line"></span><span class="hn-skel hn-skel-line hn-skel-w70"></span><span class="hn-skel hn-skel-btn"></span></article>`;
    function showSkeleton() {
      grid.setAttribute('aria-busy', 'true');
      grid.innerHTML = [0, 1].map(() => `<section class="hn-product-group" aria-hidden="true"><div class="hn-product-group-head"><span class="hn-skel hn-skel-icon"></span><div class="hn-skel-lines"><span class="hn-skel hn-skel-line hn-skel-w35"></span><span class="hn-skel hn-skel-line hn-skel-w50"></span></div></div><div class="hn-product-grid">${skelCard.repeat(4)}</div></section>`).join('');
    }

    function applyFilters() {
      const q = (search?.value || '').trim().toLocaleLowerCase('ar');
      const cat = category?.value || 'all', max = Number(budget?.value || 10000);
      filtered = PRODUCTS_DATABASE.filter(p => (cat === 'all' || p.category === cat) && Number(p.price) <= max &&
        (!q || p.name.toLocaleLowerCase('ar').includes(q) || (CATEGORY_LABELS[p.category] || p.category).toLocaleLowerCase('ar').includes(q)));
      const order = sort?.value || 'featured';
      if (order === 'price-low') filtered.sort((a, b) => a.price - b.price);
      if (order === 'price-high') filtered.sort((a, b) => b.price - a.price);
      if (order === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      if (order === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
      if (budgetLabel) budgetLabel.textContent = max.toLocaleString('en-US') + ' ج.م';
    }
    const productsOf = group => filtered.filter(p => group.categories.includes(p.category));

    function cardsFragment(list) {
      const tpl = document.createElement('template');
      tpl.innerHTML = list.map(p => window.hnRenderProductCard(p)).join('');
      [...tpl.content.children].forEach((el, i) => { el.classList.add('hn-card-enter'); el.style.setProperty('--i', Math.min(i, 11)); });
      return tpl.content;
    }
    function updateMoreButton(section, total) {
      const key = section.dataset.group, btn = section.querySelector('.hn-more-btn'), left = total - shown[key];
      btn.hidden = left <= 0;
      btn.innerHTML = `عرض المزيد · باقي ${left} <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>`;
    }

    function render() {
      if (!ready) return;
      applyFilters();
      $('#hn-products-count').textContent = `${filtered.length} منتج`;
      grid.setAttribute('aria-busy', 'false');
      grid.innerHTML = '';
      PRODUCT_GROUPS.forEach(group => {
        const list = productsOf(group);
        if (!list.length) return;
        shown[group.key] = Math.min(GROUP_STEP, list.length);
        grid.insertAdjacentHTML('beforeend', `<section class="hn-product-group" data-group="${group.key}" aria-label="${group.title}"><div class="hn-product-group-head"><div class="hn-product-group-icon"><i class="fa-solid ${group.icon}" aria-hidden="true"></i></div><div class="min-w-0"><h3>${group.title}</h3><p>${group.subtitle}</p></div><span class="hn-product-count">${list.length} منتج</span></div><div class="hn-product-grid"></div><div class="hn-more-wrap"><button type="button" class="hn-more-btn" data-more="${group.key}"></button></div></section>`);
        const section = grid.lastElementChild;
        section.querySelector('.hn-product-grid').append(cardsFragment(list.slice(0, shown[group.key])));
        updateMoreButton(section, list.length);
      });
      if (!grid.children.length) grid.innerHTML = '<div class="hn-empty-state">مفيش منتجات مطابقة للبحث أو الفلاتر.</div>';
      renderSmartSuggestions();
      window.setupDragAndDrop?.();
    }

    // "Show more" appends inline, under its own section, with no re-render and no scroll jump
    grid.addEventListener('click', event => {
      const btn = event.target.closest('[data-more]');
      if (!btn) return;
      const group = PRODUCT_GROUPS.find(g => g.key === btn.dataset.more);
      const section = btn.closest('.hn-product-group');
      const list = productsOf(group), from = shown[group.key];
      shown[group.key] = Math.min(from + GROUP_STEP, list.length);
      section.querySelector('.hn-product-grid').append(cardsFragment(list.slice(from, shown[group.key])));
      updateMoreButton(section, list.length);
      window.setupDragAndDrop?.();
    });

    function renderSmartSuggestions() {
      const box = $('#hn-page-smart-baskets');
      if (!box) return;
      const inCart = new Set((typeof cart !== 'undefined' ? cart : []).map(x => Number(x.id)));
      box.replaceChildren(cardsFragment(PRODUCTS_DATABASE.filter(p => !inCart.has(Number(p.id))).slice(0, 4)));
    }

    [search, category, sort, budget].filter(Boolean).forEach(el => el.addEventListener(el === search ? 'input' : 'change', render));
    window.handleSearch = q => { if (search) { search.value = q; render(); } };

    function boot() { showSkeleton(); setTimeout(() => { ready = true; render(); }, SKELETON_MS); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
    else boot();
  }

  if (isDashboard) {
    const DASH_SKELETON_MS = 2500;
    const main = $('#main');

    const skeletonFor = card => {
      if (card.classList.contains('hn-stat-card'))
        return '<div class="hn-skel hn-skel-line hn-skel-w50"></div><div class="hn-skel hn-skel-value"></div>';
      if (card.classList.contains('hn-level-card'))
        return '<div class="hn-skel hn-skel-line hn-skel-w35"></div><div class="hn-skel hn-skel-value hn-skel-w50"></div><div class="hn-skel hn-skel-bar"></div><div class="hn-skel hn-skel-line hn-skel-w70"></div>';
      return '<div class="hn-skel hn-skel-line hn-skel-w35"></div>' +
        '<div class="hn-skel hn-skel-row"></div><div class="hn-skel hn-skel-row"></div><div class="hn-skel hn-skel-row"></div>';
    };

    function mountDashboardSkeleton() {
      main?.setAttribute('aria-busy', 'true');
      $$('.hn-stat-card, .hn-level-card, .hn-orders-card').forEach(card => {
        if (card.querySelector(':scope > .hn-skel-layer')) return;
        const layer = document.createElement('div');
        layer.className = 'hn-skel-layer';
        layer.setAttribute('aria-hidden', 'true');
        layer.innerHTML = skeletonFor(card);
        card.append(layer);
      });
    }

    function renderDashboard() {
      // حافظ على كود renderDashboard القديم زي ما هو بالضبط، 
      // بس امسح السطر ده منه لو كان موجود:
      // setTimeout(() => document.body.classList.remove('hn-loading'), 3500);
    }

    function finishDashboardLoading() {
      renderDashboard();
      document.body.classList.remove('hn-loading');
      main?.setAttribute('aria-busy', 'false');
    }

    $('#hn-redeem-btn')?.addEventListener('click', () => { /* كود الزرار القديم بدون تغيير */ });

    mountDashboardSkeleton();
    setTimeout(finishDashboardLoading, DASH_SKELETON_MS);
  }

  // Search from any page opens the shared catalog with the entered query.
  if (!isProducts && !isDashboard) {
    window.goToProductsSearch = q => location.href = 'products.html?q=' + encodeURIComponent(q || '');
    window.handleSearch = function (q) {
      const input = document.getElementById('search-input');
      const mobile = document.getElementById('search-input-mobile');
      const suggest = document.getElementById('search-suggest');
      const term = String(q || '').trim().toLocaleLowerCase('ar');
      if (mobile && document.activeElement === mobile) mobile.value = q;
      if (input && document.activeElement === input) input.value = q;
      if (!suggest) return;
      if (!term) { suggest.classList.add('hidden'); return; }
      const matches = PRODUCTS_DATABASE.filter(p => p.name.toLocaleLowerCase('ar').includes(term)).slice(0, 6);
      suggest.innerHTML = matches.map(p => `<button type="button" class="w-full text-right px-3 py-2 rounded-xl hover:bg-skyBrand-50 text-xs font-bold" >${p.name} — ${Number(p.price).toFixed(2)} ج.م</button>`).join('') || '<p class="px-3 py-2 text-xs">لا توجد نتائج مطابقة</p>';
      // Keep the suggestion click navigation simple and preserve the typed term.
      $$('#search-suggest button').forEach(btn => btn.onclick = () => location.href = 'products.html?q=' + encodeURIComponent(term));
      suggest.classList.remove('hidden');
    };
    ['search-input', 'search-input-mobile'].forEach(id => { const el = document.getElementById(id); el?.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); location.href = 'products.html?q=' + encodeURIComponent(el.value); } }); });
  }
})();
