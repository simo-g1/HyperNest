(function () {
  'use strict';

  const KEY = 'hn_hero_intro_completed';
  const SHIFT = 0.10; // بيأخر إطلاق/هبوط المنتجات لحد ما السلة توصل النص
  const INTRO_SCROLL_SPEED_PX_PER_SECOND = 500; // سرعة السكرول أثناء الـ Intro فقط (px/s)
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let done = false;
  try { done = sessionStorage.getItem(KEY) === 'true'; } catch (e) { }
  if (done) root.classList.add('hn-intro-completed');

  const P = (id, name, price, slot, off, launch, land, bX, bY, bRot, arcH) => ({
    id, name, price, image: `imgs/food/product-${String(id).padStart(2, '0')}.webp`,
    arcSlot: slot, slotOffset: off, launch, land, bX, bY, bRot, arcH
  });
  const HERO_PRODUCTS = [
    P(1, 'تفاح أحمر سكري فاخر', '45', 'center', 0, .38, .60, -8, 4, -6, 180),
    P(2, 'موز بلدي فاخر طازج', '25', 'right', 1, .34, .56, 12, -10, -15, 200),
    P(3, 'حليب طازج كامل الدسم', '38', 'right', 2, .39, .61, 6, -6, 6, 210),
    P(4, 'جبنة شيدر مستوردة', '65', 'right', 3, .44, .65, 18, 5, -12, 220),
    P(5, 'خبز التوست الأبيض', '28', 'right', 4, .48, .68, -16, 8, 10, 190),
    P(6, 'كرواسون فرنسي بالزبدة', '42', 'right', 5, .52, .71, -22, -6, 14, 210),
    P(10, 'طماطم مزرعية طازجة', '18', 'left', 1, .32, .54, 0, 10, -5, 200),
    P(9, 'بيض أبيض طازج', '95', 'left', 2, .36, .58, -14, -4, -2, 190),
    P(8, 'عصير برتقال طبيعي', '32', 'left', 3, .41, .63, -8, -16, 4, 200),
    P(7, 'صدور دجاج طازجة', '210', 'left', 4, .46, .67, 10, 2, 8, 220)
  ];

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const easeInQuad = t => t * t;
  const easeInOutQuad = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  function getArcSlotCoords(item, W, H) {
    const m = W < 768;
    const cw = m ? Math.min(W * 0.3, 140) : Math.min(W * 0.155, H * 0.38);
    const ch = cw * 1.42;
    const mh = Math.min(H * (m ? 0.4 : 0.46), W * (m ? 0.62 : 0.34));
    const by = H - (m ? 232 : 172);
    const cy = by - mh / 2, cx = W * 0.5;
    if (item.arcSlot === 'center') {
      return { x: cx - cw / 2, y: cy - ch / 2, z: 30, ry: 0, scale: 1.05, opacity: 1, zIndex: 100, cw, ch };
    }
    const sg = item.arcSlot === 'right' ? 1 : -1, o = item.slotOffset;
    const xf = m ? [0, .32, .46, .54, .59, .63] : [0, .21, .34, .43, .49, .53];
    const sc = [1.05, .84, .68, .56, .46, .38];
    const s = sc[Math.min(o, 5)];
    return {
      x: cx + sg * xf[Math.min(o, 5)] * W - cw / 2,
      y: cy - (1 - s) * H * 0.05 - ch / 2,
      z: -10 - (o - 1) * 85, ry: -sg * (15 + (o - 1) * 9),
      scale: s, opacity: o > 4 ? 0.75 : 1, zIndex: Math.round(90 - o * 12), cw, ch
    };
  }

  /* ===== الـ header: مخفي في الـ hero، يظهر لما تنزل شوية ===== */
  const header = document.querySelector('body > header');
  const track = document.getElementById('hn-hero-intro');
  function updateHeader() {
    if (!header) return;
    const y = window.scrollY;
    let limit = 80;
    if (track && !root.classList.contains('hn-intro-completed')) {
      limit = track.getBoundingClientRect().top + y + track.offsetHeight - window.innerHeight;
    }
    header.classList.toggle('hn-header-hidden', y < limit);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader, { passive: true });
  updateHeader();

  function init() {
    const hero = document.getElementById('vf-hero');
    if (!track || !hero) return;
    if (done) { hero.classList.remove('hn-intro-active'); updateHeader(); return; }

    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    updateHeader();

    const layer = track.querySelector('.hn-intro-cart-layer');
    const cart = track.querySelector('.hn-intro-cart-wrapper');
    const shadow = track.querySelector('.hn-cart-floor-shadow');
    const plane = track.querySelector('.hn-intro-products-plane');
    const bar = track.querySelector('.hn-intro-progress-bar-fill');
    const hud = track.querySelector('.hn-intro-hud');
    const hint = track.querySelector('.hn-intro-scroll-hint');
    const cta = document.getElementById('hn-intro-cta');
    const wheels = track.querySelectorAll('.hn-cart-wheel-rotate');
    if (!cart || !plane) return;

    plane.innerHTML = '';
    const cards = HERO_PRODUCTS.map(item => {
      const el = document.createElement('div');
      el.className = 'hn-intro-card vf-card vf-glass';
      el.innerHTML = `<img class="vf-g" src="${item.image}" alt="${item.name}" width="500" height="500" decoding="async" draggable="false">
        <span class="vf-n">${item.name}</span><span class="vf-p">${item.price} ج.م</span><i class="vf-sheen"></i>`;
      plane.appendChild(el);
      return { item, el };
    });

    let W = innerWidth, H = innerHeight;
    let target = 0, current = 0, ticking = false, finished = false;
    let lastFrameTime = 0;
    const SMOOTHING_MS = 180; // مدة استجابة تقدم الأنيميشن للسكرول السريع
    let entry = reduced ? 1 : 0;
    const entryStart = performance.now() + 250, ENTRY_MS = 1000;

    function request() { if (!ticking) { ticking = true; requestAnimationFrame(loop); } }

    function loop(now) {
      ticking = false;
      let busy = false;
      if (entry < 1) { entry = clamp((now - entryStart) / ENTRY_MS, 0, 1); busy = entry < 1; }

      // تنعيم مستقل عن عدد الإطارات: يمنع قفز الأنيميشن عند السكرول السريع.
      const deltaTime = lastFrameTime ? Math.min(now - lastFrameTime, 50) : 16.67;
      lastFrameTime = now;
      const smoothing = 1 - Math.exp(-deltaTime / SMOOTHING_MS);
      const diff = target - current;
      if (Math.abs(diff) > 0.0005) {
        current += diff * smoothing;
        busy = true;
      } else {
        current = target;
      }

      render(current);
      if (!finished && current >= 0.999 && target >= 0.999 && entry >= 1) finish();
      if (busy && !finished) request();
    }

    // يقفل النزول عند نهاية الـ Intro، ثم عند نهاية الـ Hero مؤقتًا.
    let scrollBoundaryActive = true;
    let touchStartY = 0;
    let controlledScrollTarget = window.scrollY;
    let controlledScrollFrame = 0;
    let controlledScrollTime = 0;

    function queueControlledScroll(delta) {
      const maxScroll = getMaxAllowedScroll();
      controlledScrollTarget = clamp(controlledScrollTarget + delta, 0, maxScroll);
      if (!controlledScrollFrame) {
        controlledScrollTime = performance.now();
        controlledScrollFrame = requestAnimationFrame(stepControlledScroll);
      }
    }

    function stepControlledScroll(now) {
      const elapsed = Math.min((now - controlledScrollTime) / 1000, 0.05);
      controlledScrollTime = now;
      const currentScroll = window.scrollY;
      const difference = controlledScrollTarget - currentScroll;
      const maxStep = INTRO_SCROLL_SPEED_PX_PER_SECOND * elapsed;
      const step = clamp(difference, -maxStep, maxStep);

      if (Math.abs(difference) <= 1) {
        window.scrollTo({ top: controlledScrollTarget, left: 0, behavior: 'instant' });
        controlledScrollFrame = 0;
        return;
      }

      window.scrollTo({ top: currentScroll + step, left: 0, behavior: 'instant' });
      controlledScrollFrame = requestAnimationFrame(stepControlledScroll);
    }

    function getMaxAllowedScroll() {
      const boundaryElement = finished ? hero : track;
      const boundaryBottom = boundaryElement.getBoundingClientRect().bottom + window.scrollY;
      return Math.max(0, boundaryBottom - window.innerHeight);
    }

    function clampAtBoundary(event) {
      event.preventDefault();
      window.scrollTo({
        top: getMaxAllowedScroll(),
        left: 0,
        behavior: 'instant'
      });
    }

    function preventWheelPastBoundary(event) {
      if (!scrollBoundaryActive) return;
      const multiplier = event.deltaMode === 1 ? 16 :
        event.deltaMode === 2 ? window.innerHeight : 1;
      if (!finished) {
        event.preventDefault();
        queueControlledScroll(event.deltaY * multiplier);
        return;
      }
      if (event.deltaY > 0 && window.scrollY + event.deltaY * multiplier > getMaxAllowedScroll()) {
        clampAtBoundary(event);
      }
    }

    function rememberTouchStart(event) {
      if (event.touches.length) touchStartY = event.touches[0].clientY;
    }

    function preventTouchPastBoundary(event) {
      if (!scrollBoundaryActive || !event.touches.length) return;
      const currentY = event.touches[0].clientY;
      const delta = touchStartY - currentY;
      touchStartY = currentY;
      if (!finished) {
        event.preventDefault();
        queueControlledScroll(delta);
        return;
      }
      if (delta > 0 && window.scrollY + delta > getMaxAllowedScroll()) clampAtBoundary(event);
    }

    function preventKeyboardPastBoundary(event) {
      if (!scrollBoundaryActive || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof Element &&
        (event.target.isContentEditable || event.target.closest('input, textarea, select, [contenteditable="true"]'))) return;

      const downKeys = ['ArrowDown', 'PageDown', 'End', ' '];
      if (!downKeys.includes(event.key)) return;
      if (event.key === ' ' && event.target instanceof Element &&
        event.target.closest('button, a, [role="button"]')) return;

      const amount = event.key === 'ArrowDown' ? 40 : window.innerHeight;
      if (!finished) {
        event.preventDefault();
        queueControlledScroll(amount);
        return;
      }
      if (window.scrollY + amount > getMaxAllowedScroll()) clampAtBoundary(event);
    }

    window.addEventListener('wheel', preventWheelPastBoundary, { passive: false });
    window.addEventListener('touchstart', rememberTouchStart, { passive: true });
    window.addEventListener('touchmove', preventTouchPastBoundary, { passive: false });
    window.addEventListener('keydown', preventKeyboardPastBoundary);

    function finish() {
      finished = true;
      done = true;
      if (controlledScrollFrame) {
        cancelAnimationFrame(controlledScrollFrame);
        controlledScrollFrame = 0;
      }

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });

      root.classList.add('hn-intro-completed');

      try {
        sessionStorage.setItem(KEY, 'true');
      } catch (e) { }

      render(1);

      hero.classList.remove('hn-intro-active');
      hero.style.removeProperty('--hn-reveal');

      if (layer) layer.style.display = 'none';

      updateHeader();

      // يبدأ العد من لحظة ظهور الـ Hero بالكامل.
      window.setTimeout(() => {
        scrollBoundaryActive = false;
        window.removeEventListener('wheel', preventWheelPastBoundary);
        window.removeEventListener('touchstart', rememberTouchStart);
        window.removeEventListener('touchmove', preventTouchPastBoundary);
        window.removeEventListener('keydown', preventKeyboardPastBoundary);
      }, 10);
    }

    function onScroll() {
      if (finished) return;
      const max = track.offsetHeight - H;
      if (max <= 0) return;
      target = clamp(-track.getBoundingClientRect().top / max, 0, 1);
      request();
    }

    function render(p) {
      const mobile = W < 768;
      const cw = W >= 1024 ? 380 : (W <= 640 ? 260 : 320);
      const ch = W >= 1024 ? 320 : (W <= 640 ? 220 : 270);
      const floorY = H * (mobile ? 0.74 : 0.76);
      const restX = W - cw - (mobile ? 12 : W * 0.07);
      const centerX = W / 2 - cw / 2;
      const e = easeOutCubic(entry);
      const startX = (W + 40) + (restX - (W + 40)) * e; // الدخول من اليمين
      let x = startX, y = floorY - ch, rot = 0, op = 1;
      let wheel = -(1 - e) * 600;

      if (p <= 0.06) {
        x = startX;
      } else if (p <= 0.40) {
        const t = easeInOutQuad((p - 0.06) / 0.34);
        x = startX + (centerX - startX) * t;
        y += Math.sin(t * Math.PI * 4) * 3;
        rot = Math.sin(t * Math.PI * 4);
        wheel -= t * 720;
      } else if (p <= 0.66) {
        const t = (p - 0.40) / 0.26;
        rot = Math.sin(t * Math.PI) * -34;
        x = centerX - (p - 0.40) * 60;
        y += Math.sin(t * Math.PI) * 16;
        wheel -= 720 + (p - 0.40) * 260;
      } else if (p <= 0.84) {
        const t = easeInOutQuad((p - 0.66) / 0.18);
        const sx = centerX - 0.26 * 60;
        x = sx + (-cw - 100 - sx) * t;
        op = t > 0.3 ? clamp(1 - (t - 0.3) / 0.5, 0, 1) : 1;
        wheel -= 790 + (p - 0.66) * 900;
      } else {
        x = -cw - 250; op = 0;
      }

      cart.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotateZ(${rot.toFixed(2)}deg)`;
      cart.style.opacity = op.toFixed(3);
      wheels.forEach(w => { w.style.transform = `rotate(${wheel.toFixed(1)}deg)`; });
      if (shadow) {
        const tn = Math.abs(rot) / 34;
        shadow.style.transform = `scaleX(${(1 - tn * 0.25).toFixed(2)}) skewX(${(rot * 0.5).toFixed(1)}deg)`;
        shadow.style.opacity = (op * (0.85 - tn * 0.3)).toFixed(3);
      }

      // النص التعريفي + المؤشرات
      const hudO = clamp(1 - p / 0.10, 0, 1);
      if (hud) { hud.style.opacity = hudO.toFixed(3); hud.style.visibility = hudO < 0.02 ? 'hidden' : 'visible'; }
      if (hint) hint.style.opacity = hudO.toFixed(3);
      if (bar) bar.style.width = (p * 100).toFixed(1) + '%';

      // المنتجات
      const ref = getArcSlotCoords(HERO_PRODUCTS[0], W, H);
      track.style.setProperty('--hn-cw', ref.cw + 'px');
      const k = mobile ? 0.7 : 1;
      const rad = rot * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad);
      const lx = x + cw * 0.32 * cos - ch * 0.38 * sin;
      const ly = y + cw * 0.32 * sin + ch * 0.38 * cos;

      cards.forEach(({ item, el }) => {
        const s = getArcSlotCoords(item, W, H);
        const launch = item.launch + SHIFT, land = item.land + SHIFT;
        if (p < launch) {
          const rx = cw * 0.52 + item.bX * k, ry = ch * 0.36 + item.bY * k;
          const wx = x + rx * cos - ry * sin, wy = y + rx * sin + ry * cos;
          el.style.transform = `translate3d(${(wx - s.cw / 2).toFixed(1)}px, ${(wy - s.ch / 2).toFixed(1)}px, 0) rotate(${(rot + item.bRot).toFixed(1)}deg) scale(.35)`;
          el.style.opacity = op > 0 ? '1' : '0';
          el.style.zIndex = '5';
        } else if (p < land) {
          const t = clamp((p - launch) / (land - launch), 0, 1);
          const arc = Math.sin(t * Math.PI) * item.arcH * (mobile ? 0.65 : 1);
          const cx = lx + (s.x - lx) * easeOutCubic(t);
          const cy = ly + (s.y - ly) * easeInQuad(t) - arc;
          const dir = item.slotOffset % 2 === 0 ? 1 : -1;
          const sc = 0.40 + (s.scale - 0.40) * t + Math.sin(t * Math.PI) * 0.12;
          el.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, ${(s.z * t).toFixed(1)}px) rotateY(${(s.ry * t + (1 - t) * 8 * dir).toFixed(1)}deg) rotateZ(${((1 - t) * 16 * dir).toFixed(1)}deg) scale(${sc.toFixed(3)})`;
          el.style.opacity = '1';
          el.style.zIndex = '80';
        } else {
          el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, ${s.z.toFixed(1)}px) rotateY(${s.ry.toFixed(1)}deg) scale(${s.scale.toFixed(3)})`;
          el.style.opacity = s.opacity.toFixed(3);
          el.style.zIndex = String(s.zIndex);
        }
      });

      // تسليم للـ hero الحقيقي
      const tH = clamp((p - 0.84) / 0.11, 0, 1);
      if (layer) layer.style.opacity = (1 - tH).toFixed(3);
      hero.style.setProperty('--hn-reveal', tH.toFixed(3));
    }

    const goOn = () => {
      const max = track.offsetHeight - H;
      window.scrollTo({ top: track.getBoundingClientRect().top + window.scrollY + max * 0.97, behavior: reduced ? 'auto' : 'smooth' });
    };
    if (cta) cta.addEventListener('click', goOn);
    if (hint) {
      hint.addEventListener('click', goOn);
      hint.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); goOn(); } });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { W = innerWidth; H = innerHeight; render(current); }, { passive: true });

    render(0);
    request(); // يشغّل حركة دخول السلة
    onScroll();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();