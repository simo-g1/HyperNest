(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
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
    const limitedAdd = function(id, amount=1, origin=null) {
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
    const limitedUpdate = function(id, delta) {
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
    const trackedCheckout = function(...args) {
      if (!cart.length) return originalCheckout.apply(this,args);
      const subtotal = cart.reduce((sum,p)=>sum + Number(p.price)*Number(p.quantity),0);
      const discount = subtotal * (Number(window.appliedDiscountPercent)||0);
      const points = cart.reduce((sum,p)=>sum + Math.max(1,Math.round(Number(p.price)*Number(p.quantity)/10)),0);
      const order = { id: 'HN-' + Date.now().toString(36).toUpperCase(), date: new Date().toISOString(), items: cart.map(p=>({id:p.id,name:p.name,price:p.price,quantity:p.quantity,category:p.category,image:p.image})), subtotal, discount, total: subtotal-discount, points, status: 'تم تسجيل الطلب (تجريبي)' };
      const orders = readOrders(); orders.unshift(order); writeOrders(orders.slice(0,100));
      return originalCheckout.apply(this,args);
    };
    trackedCheckout.__hnOrders = true; window.checkoutCart = trackedCheckout;
  }

  const CATEGORY_LABELS = {
    produce: 'خضار وفاكهة', dairy: 'ألبان وأجبان', bakery: 'مخبوزات',
    meat: 'لحوم ومجمدات', beverages: 'مشروبات', cleaning: 'منظفات ومطهرات',
    'home-tools': 'أدوات منزلية', electronics: 'أجهزة كهربائية', household: 'مستلزمات منزلية'
  };
  if (typeof CATEGORY_LABELS !== 'undefined') CATEGORY_LABELS.household = 'منظفات';

  const PRODUCT_GROUPS = [
    { key: 'supermarket', title: 'السوبر ماركت', icon: 'fa-basket-shopping', categories: ['produce', 'dairy', 'bakery', 'meat', 'beverages'] },
    { key: 'cleaning', title: 'المنظفات', icon: 'fa-pump-soap', categories: ['cleaning', 'household'] },
    { key: 'home', title: 'الأدوات المنزلية', icon: 'fa-house', categories: ['home-tools'] },
    { key: 'electronics', title: 'الأجهزة الكهربائية', icon: 'fa-plug', categories: ['electronics'] }
  ];

  function refreshWishlistButtons() {
    const saved = new Set((typeof wishlist !== 'undefined' ? wishlist : []).map(Number));
    $$('.hn-page-wish').forEach(button => {
      const card = button.closest('[data-product-id]');
      const active = !!card && saved.has(Number(card.dataset.productId));
      button.classList.toggle('is-wishlisted', active);
      button.setAttribute('aria-pressed', String(active));
      const name = card?.querySelector('h3')?.textContent || 'المنتج';
      button.setAttribute('aria-label', active ? `إزالة ${name} من المفضلة` : `إضافة ${name} للمفضلة`);
    });
  }
  window.refreshHnProductWishlist = refreshWishlistButtons;
  const originalToggleWishlist = window.toggleWishlist;
  if (typeof originalToggleWishlist === 'function' && !originalToggleWishlist.__hnPageSync) {
    const syncedToggleWishlist = function(...args) {
      const result = originalToggleWishlist.apply(this, args);
      refreshWishlistButtons();
      return result;
    };
    syncedToggleWishlist.__hnPageSync = true;
    window.toggleWishlist = syncedToggleWishlist;
  }

  function productCard(p) {
    const safe = String(p.name).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const merchantName = p.merchant?.name ? `<small class="hn-page-merchant">من تاجر: ${String(p.merchant.name).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</small>` : '';
    const active = (typeof wishlist !== 'undefined' ? wishlist : []).map(Number).includes(Number(p.id));
    const categoryLabel = CATEGORY_LABELS[p.category] || p.category;
    const icon = p.faIcon || 'fa-box';
    const image = p.image ? `<img src="${p.image}" alt="${safe}" loading="lazy" decoding="async" onerror="this.remove()">` : '';
    return `<article class="hn-product-card product-card relative p-3 sm:p-4 flex flex-col" data-product-id="${p.id}" data-id="${p.id}">
      <button type="button" class="hn-page-wish${active ? ' is-wishlisted' : ''}" aria-pressed="${active}" aria-label="${active ? 'إزالة' : 'إضافة'} ${safe} ${active ? 'من' : 'إلى'} المفضلة" onclick="toggleWishlist(${p.id})"><i class="fa-solid fa-heart" aria-hidden="true"></i></button>
      <button type="button" class="hn-page-product-image hn-product-visual" onclick="openProductModal(${p.id})" aria-label="عرض تفاصيل ${safe}"><div class="hn-product-icon" aria-hidden="true"><i class="fa-solid ${icon}"></i></div>${image}<span class="hn-product-stock">${p.stock || 'متوفر'}</span>${p.id >= 51 && p.id <= 150 ? '<span class="hn-product-badge">قسم جديد</span>' : ''}</button>
      <div class="hn-page-card-body"><div class="hn-product-meta"><span class="hn-page-rating"><i class="fa-solid fa-star" aria-hidden="true"></i> ${Number(p.rating || 4.5).toFixed(1)}</span><span class="hn-page-category">${categoryLabel}</span></div>${merchantName}<h3 class="hn-product-name">${safe}</h3>
      <div class="hn-page-card-footer"><strong class="hn-product-price">${Number(p.price).toFixed(2)} <small>ج.م</small></strong><button class="hn-page-add hn-product-add" type="button" onclick="addToCart(${p.id},1,this)" aria-label="إضافة ${safe} للسلة"><i class="fa-solid fa-cart-plus" aria-hidden="true"></i></button></div></div></article>`;
  }

  const originalApplyPromo = window.applyPromoCode;
  if (originalApplyPromo && !originalApplyPromo.__hnLoyalty) {
    const loyaltyApply = function() {
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
    const search = $('#hn-product-search');
    const category = $('#hn-product-category');
    const sort = $('#hn-product-sort');
    const budget = $('#hn-product-budget');
    const budgetLabel = $('#hn-product-budget-value');
    const more = $('#hn-products-more');
    let shown = 16, filtered = [];
    const params = new URLSearchParams(location.search);
    const validCats = new Set(['all','produce','dairy','bakery','meat','beverages','cleaning','household','home-tools','electronics']);
    const initialCat = validCats.has(params.get('cat')) ? params.get('cat') : 'all';
    if (category) category.value = initialCat;
    if (search && params.get('q')) search.value = params.get('q');
    function renderSmartSuggestions() {
      const box=$('#hn-page-smart-baskets'); if(!box) return;
      const inCart=new Set((typeof cart !== 'undefined' ? cart : []).map(x=>Number(x.id)));
      const picks=PRODUCTS_DATABASE.filter(p=>!inCart.has(Number(p.id))).slice(0,4);
      box.innerHTML=picks.map(productCard).join('');
    }
    function render(reset=true) {
      if (reset) shown=16;
      const q=(search?.value||'').trim().toLocaleLowerCase('ar');
      const cat=category?.value||'all'; const max=Number(budget?.value||10000);
      filtered=PRODUCTS_DATABASE.filter(p=>(cat==='all'||p.category===cat) && Number(p.price)<=max && (!q || p.name.toLocaleLowerCase('ar').includes(q) || (CATEGORY_LABELS[p.category]||p.category).toLocaleLowerCase('ar').includes(q)));
      const order=sort?.value||'featured';
      if(order==='price-low') filtered.sort((a,b)=>a.price-b.price);
      if(order==='price-high') filtered.sort((a,b)=>b.price-a.price);
      if(order==='rating') filtered.sort((a,b)=>(b.rating||0)-(a.rating||0));
      if(order==='name') filtered.sort((a,b)=>a.name.localeCompare(b.name,'ar'));
      const selectedGroup = cat==='all' ? null : PRODUCT_GROUPS.find(g=>g.categories.includes(cat))?.key;
      let hasMoreInGroups = false;
      const groupedMarkup = PRODUCT_GROUPS.filter(group=>!selectedGroup || group.key===selectedGroup).map(group => {
        const groupProducts = filtered.filter(product => group.categories.includes(product.category));
        if (!groupProducts.length) return '';
        if (groupProducts.length > shown) hasMoreInGroups = true;
        const products = groupProducts.slice(0, shown);
        return `<section class="hn-product-group" aria-label="${group.title}"><header class="hn-product-group-head"><span class="hn-product-group-icon"><i class="fa-solid ${group.icon}" aria-hidden="true"></i></span><div><h2>${group.title}</h2><p>${products.length} من ${groupProducts.length} منتج</p></div></header><div class="hn-page-products-grid">${products.map(productCard).join('')}</div></section>`;
      }).join('');
      grid.innerHTML = groupedMarkup || '<div class="hn-empty-state">مفيش منتجات مطابقة للبحث أو الفلاتر.</div>';
      refreshWishlistButtons();
      $('#hn-products-count').textContent=`${filtered.length} منتج`;
      if(more) more.hidden=!hasMoreInGroups;
      renderSmartSuggestions();
      if(budgetLabel) budgetLabel.textContent=max.toLocaleString('en-US')+' ج.م';
    }
    [search,category,sort,budget].filter(Boolean).forEach(el=>el.addEventListener(el===search?'input':'change',()=>render(true)));
    more?.addEventListener('click',()=>{shown+=16;render(false)});
    window.handleSearch = function(q){ if(search){search.value=q;render(true);} };
    document.addEventListener('DOMContentLoaded',()=>render(true));
    if(document.readyState!=='loading') setTimeout(()=>render(true),0);
  }

  if (isDashboard) {
    function renderDashboard() {
      const orders=readOrders();
      const productsBought=orders.reduce((n,o)=>n+o.items.reduce((a,p)=>a+p.quantity,0),0);
      const spent=orders.reduce((n,o)=>n+o.total,0);
      const points=Number(window.loyaltyPoints)||Number(JSON.parse(localStorage.getItem('hypernest-demo-state-v1')||'{}').loyaltyPoints)||0;
      const level=points>=3000?{name:'Gold',min:3000,next:5000}:{name:points>=1000?'Silver':'Bronze',min:points>=1000?1000:0,next:points>=1000?3000:1000};
      const progress=Math.min(100,Math.max(0,(points-level.min)/(level.next-level.min)*100));
      $('#hn-dash-orders').textContent=orders.length; $('#hn-dash-items').textContent=productsBought;
      $('#hn-dash-spent').textContent=spent.toFixed(2)+' ج.م'; $('#hn-dash-points').textContent=points;
      $('#hn-dash-level').textContent=level.name; $('#hn-dash-next').textContent=`${Math.max(0,level.next-points)} نقطة للمستوى التالي`;
      $('#hn-dash-progress').style.width=progress+'%';
      const counts={}; orders.forEach(o=>o.items.forEach(p=>counts[p.category]=(counts[p.category]||0)+p.quantity));
      const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]; $('#hn-dash-favorite').textContent=top?(({produce:'خضار وفاكهة',dairy:'ألبان وأجبان',bakery:'مخبوزات',meat:'لحوم ومجمدات',beverages:'مشروبات',cleaning:'منظفات', 'home-tools':'أدوات منزلية',electronics:'أجهزة كهربائية',household:'مستلزمات منزلية'})[top[0]]||top[0]):'لسه مفيش مشتريات';
      $('#hn-dash-orders-list').innerHTML=orders.length?orders.slice(0,8).map(o=>`<article class="hn-order-row"><div><b>${o.id}</b><small>${new Date(o.date).toLocaleString('ar-EG')}</small><small>${o.items.length} منتج مختلف · ${o.status}</small></div><strong>${o.total.toFixed(2)} ج.م</strong></article>`).join(''):'<p class="hn-dashboard-empty">لسه مفيش طلبات مسجلة. ابدأ التسوق وهتظهر طلباتك هنا.</p>';
      $('#hn-redeem-balance').textContent=points;
    }
    $('#hn-redeem-btn')?.addEventListener('click',()=>{
      const state=JSON.parse(localStorage.getItem('hypernest-demo-state-v1')||'{}');
      const points=Number(state.loyaltyPoints)||0;
      const cost=1000, discount=50;
      if(points<cost) return announce('تحتاج 1000 نقطة لاستبدالها بخصم 50 جنيه.');
      state.loyaltyPoints=points-cost; state.discount=.0; localStorage.setItem('hypernest-demo-state-v1',JSON.stringify(state));
      state.redeemedCoupon={code:'LOYALTY15',amount:15,createdAt:new Date().toISOString()};
      localStorage.setItem('hypernest-demo-state-v1',JSON.stringify(state));
      announce('تم استبدال 1000 نقطة. استخدم كود LOYALTY15 للحصول على خصم 15%.'); renderDashboard();
    });
    document.addEventListener('DOMContentLoaded',renderDashboard);
    if(document.readyState!=='loading') setTimeout(renderDashboard,0);
  }

  // Search from any page opens the shared catalog with the entered query.
  if (!isProducts && !isDashboard) {
    window.goToProductsSearch = q => location.href='products.html?q='+encodeURIComponent(q||'');
    window.handleSearch = function(q) {
      const input=document.getElementById('search-input');
      const mobile=document.getElementById('search-input-mobile');
      const suggest=document.getElementById('search-suggest');
      const term=String(q||'').trim().toLocaleLowerCase('ar');
      if(mobile && document.activeElement===mobile) mobile.value=q;
      if(input && document.activeElement===input) input.value=q;
      if(!suggest) return;
      if(!term){suggest.classList.add('hidden');return;}
      const matches=PRODUCTS_DATABASE.filter(p=>p.name.toLocaleLowerCase('ar').includes(term)).slice(0,6);
      suggest.innerHTML=matches.map(p=>`<button type="button" class="w-full text-right px-3 py-2 rounded-xl hover:bg-skyBrand-50 text-xs font-bold" >${p.name} — ${Number(p.price).toFixed(2)} ج.م</button>`).join('') || '<p class="px-3 py-2 text-xs">لا توجد نتائج مطابقة</p>';
      // Keep the suggestion click navigation simple and preserve the typed term.
      $$('#search-suggest button').forEach(btn=>btn.onclick=()=>location.href='products.html?q='+encodeURIComponent(term));
      suggest.classList.remove('hidden');
    };
    ['search-input','search-input-mobile'].forEach(id=>{const el=document.getElementById(id);el?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();location.href='products.html?q='+encodeURIComponent(el.value);}});});
  }
})();
