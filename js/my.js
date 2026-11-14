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
  household: 'منظفات ومستلزمات المنزل',
  cleaning: 'منظفات ومطهرات'
};

/* 2. INITIALIZATION */
window.addEventListener('DOMContentLoaded', () => {
  initArc();
  renderCategoryPills();
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
  wheelAcc: 0, lastWheel: 0, frameId: 0
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
      <img class="vf-g" src="${p.image.replace('/food/', '/food-sm/')}" alt="" width="500" height="500" decoding="async" draggable="false">
      <span class="vf-n">${p.name}</span>
      <span class="vf-p">${p.price.toFixed(0)} ج.م</span>
      <i class="vf-sheen"></i>
    </div>`).join('');
  VF.cards = [...arc.children];

  vfById('vf-chips').innerHTML = [1, 2, 3, 5].map(n =>
    `<button type="button" class="vf-chip" aria-pressed="${n === 1}" onclick="vfSetQty(${n}, this)">${n}</button>`).join('');

  new ResizeObserver(() => vfResize()).observe(hero);
  new IntersectionObserver(([e]) => {
    VF.visible = e.isIntersecting;
    if (VF.visible && !VF.frameId) VF.frameId = requestAnimationFrame(vfFrame);
  }).observe(hero);
  vfBindInput(stage, hero);
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
  VF.frameId = 0;
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

  if (VF.visible && !VF.frameId) VF.frameId = requestAnimationFrame(vfFrame);
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
  const items = document.querySelectorAll('.shelf-product-item, .product-card, .hn-product-card, .vf-model');
  const dropzone = document.getElementById('cart-dropzone');

  items.forEach(item => {
    if (item.dataset.dragBound) return; // منع تكرار الـ listeners
    item.dataset.dragBound = '1';
    item.addEventListener('dragstart', (e) => {
      const rawId = item.dataset.id || item.dataset.productId;
      e.dataTransfer.setData('text/plain', rawId);
      e.dataTransfer.effectAllowed = 'copy';
      const p = PRODUCTS_DATABASE.find(x => x.id === parseInt(rawId, 10));
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
    drawer.innerHTML = `<div class="hn-cart-empty-state text-center py-12 px-4">
      <div class="hn-cart-empty-icon"><i class="fa-solid fa-basket-shopping" aria-hidden="true"></i></div>
      <h4 class="mt-5 text-lg font-black text-slate-800 dark:text-white">هل نسيت شيئًا؟</h4>
      <p class="mt-2 mb-5 text-sm leading-7 text-slate-500 dark:text-slate-400">لسه فيه حاجات كتير ممكن تحتاجها. ارجع للمنتجات واختار اللي ناقصك.</p>
      <button type="button" class="hn-cart-browse-btn" onclick="browseAllProductsFromCart()">
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i> أضف المنتجات
      </button>
    </div>`;
  } else {
    drawer.innerHTML = cart.map(i => `
          <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border">
            <img src="${i.image}" alt="" loading="lazy" decoding="async" width="40" height="40" class="w-10 h-10 object-cover rounded-xl">
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

let hnCheckoutInProgress = false;
function checkoutCart() {
  if (hnCheckoutInProgress) return;
  if (!Array.isArray(cart) || cart.length === 0) return showToast('السلة فارغة!');
  hnCheckoutInProgress = true;
  const items = cart.map(item => ({
    id: Number(item.id), name: String(item.name), price: Number(item.price),
    quantity: Number(item.quantity), category: item.category || '', image: item.image || ''
  }));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountPercent = Math.max(0, Math.min(.9, Number(appliedDiscountPercent) || 0));
  const discount = subtotal * discountPercent;
  const earned = items.reduce((sum, item) => sum + Math.max(1, Math.round(item.price * item.quantity / 10)), 0);
  const orderId = `HN-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
  const order = {
    id: orderId, date: new Date().toISOString(), items, subtotal, discount,
    total: Math.max(0, subtotal - discount), points: earned,
    deliverySlot: selectedDeliverySlot, status: 'تم تسجيل الطلب'
  };
  try {
    if (typeof window.saveHyperNestOrder !== 'function' || !window.saveHyperNestOrder(order)) {
      showToast('تعذر حفظ الطلب. لم يتم إفراغ السلة، حاول مرة أخرى.');
      return;
    }
    loyaltyPoints = Math.max(0, Number(loyaltyPoints) || 0) + earned;
    appliedDiscountPercent = 0;
    cart = [];
    if (typeof saveState === 'function' && !saveState()) {
      // Keep the order, but report that the points snapshot may need a refresh.
      console.warn('[HyperNest] Order saved but loyalty state could not be persisted.');
    }
    if (typeof updateCartUI === 'function') updateCartUI();
    if (typeof closeCartDrawer === 'function') closeCartDrawer();
    window.updateLoyaltyUI?.();
    window.dispatchEvent(new CustomEvent('hn:orders-updated', { detail: { order } }));
    showToast(`🎉 تم تسجيل طلبك! كسبت ${earned} نقطة. التوصيل: ${selectedDeliverySlot}`);
  } finally {
    hnCheckoutInProgress = false;
  }
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
  const count = document.getElementById('wishlist-count');
  if (count) count.innerText = wishlist.length;
  renderCatalogProducts();
  updateWishlistUI();
  if (typeof saveState === 'function') saveState();
}

function updateWishlistUI() {
  const container = document.getElementById('wishlist-drawer-items');
  if (!container) return;

  window.removeFromWishlist = function (productId) {
    const id = Number(productId);
    if (wishlist.includes(id)) toggleWishlist(id);
  };

  if (wishlist.length === 0) {
    container.innerHTML = `<div class="text-center py-12 text-slate-400"><i class="fa-solid fa-heart-crack text-4xl mb-2"></i><p class="text-sm">قائمة المفضلة فارغة</p></div>`;
    return;
  }
  const items = PRODUCTS_DATABASE.filter(p => wishlist.includes(p.id));
  container.innerHTML = items.map(item => `
        <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
            <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" width="48" height="48" class="w-12 h-12 object-cover rounded-xl">
            <div class="flex-1 px-3">
                <h4 class="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">${item.name}</h4>
                <span class="text-xs font-black text-skyBrand-600 dark:text-skyBrand-400">${item.price.toFixed(2)} ج.م</span>
            </div>
            <button onclick="addToCart(${item.id})" class="px-2.5 py-1.5 bg-skyBrand-500 text-white rounded-xl text-xs font-bold hover:bg-skyBrand-600 transition">
                + السلة
            </button>
            <button type="button" onclick="removeFromWishlist(${item.id})" class="hn-wish-remove" title="إزالة من المفضلة" aria-label="إزالة ${item.name} من المفضلة"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button>
        </div>
      `).join('');
}

function openProductModal(id) {
  const p = PRODUCTS_DATABASE.find(item => Number(item.id) === Number(id));
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
            <img src="${p.image}" alt="" loading="lazy" decoding="async" width="100" height="64" class="w-full h-16 object-cover rounded-xl mb-1.5">>
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
    // 1) كل القراءات الأول
    const y = window.scrollY, vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const heroH = hero ? hero.offsetHeight : 0;
    const tops = scrub.map(({ el }) => el.getBoundingClientRect().top);
    // 2) بعدين كل الكتابات
    if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    if (hero && !prefersReducedMotion) hero.style.setProperty('--hp', clamp01((y - heroH * .45) / (heroH * .55)).toFixed(3));
    scrub.forEach(({ spans }, k) => {
      const p = prefersReducedMotion ? 1 : clamp01((vh * .85 - tops[k]) / (vh * .4));
      spans.forEach((sp, i) => { sp.style.opacity = (.2 + .8 * clamp01(p * spans.length * 1.2 - i)).toFixed(2); });
    });
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  requestAnimationFrame(update);

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

/* 7. ISOMETRIC 3D STORE MAP SVG RENDERER */
function renderFloorSVG(floor) {
  const svg = document.getElementById('store-svg-container');
  if (!svg) return;

  const zone = (id, title, subtitle, x, y, fill, accent, type = 'shelf') => {
    const label = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const shelves = type === 'checkout'
      ? `<g class="hn-map-detail"><polygon points="34,52 104,26 166,51 96,77" fill="#263746"/><polygon points="34,52 96,77 96,91 34,66" fill="#172633"/><polygon points="96,77 166,51 166,65 96,91" fill="#334a5a"/><path d="M52 52l44 18 42-16" fill="none" stroke="#e8f1f5" stroke-width="4" stroke-linecap="round"/><circle cx="149" cy="45" r="5" fill="#f5cb65"/></g>`
      : `<g class="hn-map-detail">
          <polygon points="25,40 77,20 94,28 42,49" fill="#ffffff" opacity=".78"/><polygon points="25,40 42,49 42,60 25,51" fill="#d6e0e4"/><polygon points="42,49 94,28 94,39 42,60" fill="#9aaeb7"/>
          <polygon points="104,39 156,19 173,27 121,48" fill="#ffffff" opacity=".78"/><polygon points="104,39 121,48 121,59 104,50" fill="#d6e0e4"/><polygon points="121,48 173,27 173,38 121,59" fill="#9aaeb7"/>
          <polygon points="61,62 113,42 130,50 78,71" fill="#ffffff" opacity=".7"/><polygon points="61,62 78,71 78,81 61,72" fill="#d6e0e4"/><polygon points="78,71 130,50 130,60 78,81" fill="#9aaeb7"/>
          <g fill="${accent}"><circle cx="39" cy="38" r="3.5"/><circle cx="52" cy="34" r="3.5"/><circle cx="65" cy="29" r="3.5"/><circle cx="118" cy="37" r="3.5"/><circle cx="132" cy="32" r="3.5"/><circle cx="145" cy="27" r="3.5"/></g>
        </g>`;
    return `<g id="zone-${id}" class="hn-iso-zone" transform="translate(${x} ${y})" role="button" tabindex="0" aria-label="${label} - ${subtitle}" onclick="selectMapZone('${id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectMapZone('${id}');}">
      <polygon class="hn-zone-shadow" points="0,39 100,0 204,39 104,79" fill="#07131d" opacity=".28" transform="translate(5 15)"/>
      <polygon points="0,31 104,71 104,91 0,51" fill="#71818b"/>
      <polygon points="104,71 204,31 204,51 104,91" fill="#536672"/>
      <polygon class="hn-zone-top" points="0,31 100,0 204,31 104,71" fill="${fill}" stroke="${accent}" stroke-width="2"/>
      <path d="M9 31L100 6 194 31" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="2"/>
      ${shelves}
      <rect x="40" y="78" width="125" height="22" rx="11" fill="#f8fbfc" stroke="${accent}" stroke-width="1.4"/>
      <text x="102" y="93" text-anchor="middle" direction="rtl" font-family="Cairo,sans-serif" font-size="11.5" font-weight="900" fill="#20313b">${label}</text>
      <text x="102" y="115" text-anchor="middle" font-family="Cairo,sans-serif" font-size="9" font-weight="800" fill="#dce7eb">${subtitle}</text>
      <circle cx="181" cy="20" r="10" fill="#fff" stroke="${accent}" stroke-width="2"/><path d="M177 20l3 3 5-6" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`;
  };

  const defs = `<defs>
    <linearGradient id="hnMapBackdrop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#172a38"/><stop offset="1" stop-color="#0b1722"/></linearGradient>
    <linearGradient id="hnMapFloor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7faf8"/><stop offset="1" stop-color="#cbd8d9"/></linearGradient>
    <linearGradient id="hnMapFloorSide" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#8fa2a8"/><stop offset="1" stop-color="#536873"/></linearGradient>
    <pattern id="hnMapGrid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#9aadb4" stroke-opacity=".24" stroke-width="1"/></pattern>
    <filter id="hnMapDrop" x="-30%" y="-30%" width="170%" height="190%"><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#020b12" flood-opacity=".32"/></filter>
    <filter id="hnMapSoft"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>`;

  const floorBase = `<rect width="900" height="560" rx="28" fill="url(#hnMapBackdrop)"/>
    <circle cx="140" cy="90" r="100" fill="#3c91a2" opacity=".13" filter="url(#hnMapSoft)"/><circle cx="760" cy="430" r="130" fill="#8a6fc0" opacity=".12" filter="url(#hnMapSoft)"/>
    <path d="M0 450H900M0 490H900" stroke="#9fb6c0" stroke-opacity=".08"/>
    <polygon points="54,254 448,75 846,257 450,478" fill="#08131d" opacity=".65" transform="translate(0 20)"/>
    <polygon points="54,236 448,57 846,239 450,460" fill="url(#hnMapFloorSide)" stroke="#a8bdc4" stroke-opacity=".6" stroke-width="2"/>
    <polygon points="54,236 448,57 846,239 450,460" fill="url(#hnMapFloor)" stroke="#e7f0ef" stroke-width="2"/>
    <polygon points="54,236 448,57 846,239 450,460" fill="url(#hnMapGrid)" opacity=".85"/>
    <path d="M96 237L448 78 804 240M145 261L448 123 754 264M196 285L448 169 704 288M248 309L448 215 655 311" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity=".8"/>
    <path d="M96 237L448 78 804 240M145 261L448 123 754 264M196 285L448 169 704 288M248 309L448 215 655 311" fill="none" stroke="#a9b8b9" stroke-width="1.5" stroke-dasharray="5 9" opacity=".8"/>`;

  if (floor === 1) {
    svg.setAttribute('viewBox', '0 0 900 560');
    svg.innerHTML = `${defs}${floorBase}
      <g class="hn-map-label"><rect x="34" y="24" width="202" height="34" rx="17" fill="#f7fbfc" fill-opacity=".12" stroke="#d5e7ed" stroke-opacity=".3"/><circle cx="53" cy="41" r="5" fill="#78d7b0"/><text x="68" y="45" fill="#e8f3f5" font-family="Cairo,sans-serif" font-size="12" font-weight="800">FRESH FOOD · GROUND FLOOR</text></g>
      <g filter="url(#hnMapDrop)">
        ${zone('produce', 'الخضار والفاكهة', 'ممر 01 · PRODUCE', 70, 112, '#b9e9cf', '#37a77b')}
        ${zone('dairy', 'الألبان والأجبان', 'ممر 02 · DAIRY', 340, 78, '#c9e8f4', '#398fbd')}
        ${zone('bakery', 'المخبوزات والحلويات', 'ممر 03 · BAKERY', 610, 122, '#f8d2c7', '#d77c69')}
        ${zone('meat', 'اللحوم والدواجن', 'ممر 04 · MEAT', 145, 294, '#f5c8d2', '#c85c7b')}
        ${zone('beverages', 'المشروبات', 'ممر 05 · DRINKS', 430, 286, '#d9d0fa', '#8874c7')}
        ${zone('checkout', 'الكاشير والمخرج', 'CHECKOUT', 665, 310, '#f6e0a9', '#c89b39', 'checkout')}
      </g>
      <g transform="translate(32 500)"><rect width="200" height="34" rx="17" fill="#eaf4f5" fill-opacity=".12" stroke="#d5e7ed" stroke-opacity=".3"/><circle cx="18" cy="17" r="5" fill="#78d7b0"/><text x="32" y="21" fill="#e8f3f5" font-family="Cairo,sans-serif" font-size="10" font-weight="800">CUSTOMER PATHWAYS</text></g>
      <g transform="translate(722 24)"><rect width="146" height="34" rx="17" fill="#2c806e"/><text x="73" y="22" text-anchor="middle" fill="#fff" font-family="Cairo,sans-serif" font-size="11" font-weight="900">الطابق الأرضي</text></g>`;
  } else {
    svg.setAttribute('viewBox', '0 0 900 560');
    svg.innerHTML = `${defs}${floorBase}
      <g class="hn-map-label"><rect x="34" y="24" width="214" height="34" rx="17" fill="#f7fbfc" fill-opacity=".12" stroke="#d5e7ed" stroke-opacity=".3"/><circle cx="53" cy="41" r="5" fill="#d5a9f2"/><text x="68" y="45" fill="#e8f3f5" font-family="Cairo,sans-serif" font-size="12" font-weight="800">HOME &amp; ELECTRONICS · LEVEL 1</text></g>
      <g filter="url(#hnMapDrop)">
        ${zone('home', 'الأدوات المنزلية', 'جناح A · HOME', 100, 130, '#e5d1f5', '#9b70bd')}
        ${zone('electronics', 'الأجهزة والإلكترونيات', 'جناح B · TECH', 490, 118, '#c3e9e2', '#429c8c')}
        ${zone('beauty', 'العناية الشخصية', 'جناح C · BEAUTY', 150, 310, '#f4d1e5', '#bd6f9b')}
        ${zone('cleaning', 'المنظفات والمطهرات', 'جناح D · CLEANING', 535, 300, '#cce2f5', '#5d91c0')}
      </g>
      <g transform="translate(32 500)"><rect width="205" height="34" rx="17" fill="#eaf4f5" fill-opacity=".12" stroke="#d5e7ed" stroke-opacity=".3"/><circle cx="18" cy="17" r="5" fill="#d5a9f2"/><text x="32" y="21" fill="#e8f3f5" font-family="Cairo,sans-serif" font-size="10" font-weight="800">ELEVATOR &amp; STAIRS</text></g>
      <g transform="translate(722 24)"><rect width="146" height="34" rx="17" fill="#536fa7"/><text x="73" y="22" text-anchor="middle" fill="#fff" font-family="Cairo,sans-serif" font-size="11" font-weight="900">الطابق الأول</text></g>`;
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
  document.querySelectorAll('#store-svg-container .hn-iso-zone').forEach(zoneEl => {
    zoneEl.classList.toggle('is-selected', zoneEl.id === `zone-${zone}`);
    zoneEl.setAttribute('aria-pressed', String(zoneEl.id === `zone-${zone}`));
  });
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
  if (!wheel || !btn || btn.disabled) return;

  // Visual-only demo: no random prize, payment, or discount is awarded.
  btn.disabled = true;
  btn.innerText = 'جاري عرض الحركة...';
  wheel.style.transform = 'rotate(1440deg)';

  window.setTimeout(() => {
    btn.innerText = 'تجربة توضيحية';
    showToast('دي حركة توضيحية فقط — جرّب أكواد الخصم الموجودة في قسم العروض.');
    window.setTimeout(() => {
      btn.disabled = false;
      btn.innerText = 'إعادة العرض';
      wheel.style.transitionDuration = '0ms';
      wheel.style.transform = 'rotate(0deg)';
      window.requestAnimationFrame(() => { wheel.style.transitionDuration = '3000ms'; });
    }, 800);
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