// HyperNest persistence layer. Requires data.js and my.js globals.
const STORAGE_KEY = 'hypernest-demo-state-v1';
let loyaltyPoints = 0; // نقاط نادي الولاء

function safeReadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('[HyperNest] Could not read saved state:', error);
    return null;
  }
}

function saveState() {
  try {
    const snapshot = {
      cart: cart.map(item => ({ id: Number(item.id), quantity: Number(item.quantity) })),
      wishlist: wishlist.map(Number),
      discount: Number(appliedDiscountPercent) || 0,
      promoCode: document.getElementById('promo-code-input')?.value.trim().toUpperCase() || '',
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      deliverySlot: selectedDeliverySlot || 'الآن (45 د)',
      recentlyViewed: Array.isArray(recentlyViewed) ? recentlyViewed.slice(0, 6) : [],
      loyaltyPoints
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    return true;
  } catch (error) {
    console.warn('[HyperNest] Could not save state:', error);
    return false;
  }
}

function restoreState() {
  const saved = safeReadState();
  if (!saved) return;

  const validIds = new Set(PRODUCTS_DATABASE.map(product => Number(product.id)));
  if (Array.isArray(saved.cart)) {
    let restoredTotal = 0;
    cart = saved.cart.map(entry => {
      const product = PRODUCTS_DATABASE.find(item => Number(item.id) === Number(entry.id));
      const requested = Math.max(1, Math.min(15, Math.floor(Number(entry.quantity) || 1)));
      const quantity = Math.min(requested, Math.max(0, 30 - restoredTotal));
      if (product && quantity > 0) restoredTotal += quantity;
      return product && validIds.has(Number(entry.id)) && quantity > 0 ? { ...product, quantity } : null;
    }).filter(Boolean);
  }
  if (Array.isArray(saved.wishlist)) {
    wishlist = [...new Set(saved.wishlist.map(Number).filter(id => validIds.has(id)))];
  }
  const discount = Number(saved.discount);
  appliedDiscountPercent = [0, .1, .15, .2].includes(discount) ? discount : 0;
  const promoInput = document.getElementById('promo-code-input');
  if (promoInput && typeof saved.promoCode === 'string') promoInput.value = saved.promoCode;
  if (saved.theme === 'dark' || saved.theme === 'light') {
    document.documentElement.classList.toggle('dark', saved.theme === 'dark');
  }
  if (typeof saved.deliverySlot === 'string') selectedDeliverySlot = saved.deliverySlot;
  if (Array.isArray(saved.recentlyViewed)) recentlyViewed = saved.recentlyViewed.map(Number).filter(id => validIds.has(id)).slice(0, 6);

  loyaltyPoints = Math.max(0, Math.floor(Number(saved.loyaltyPoints) || 0));
  if (typeof updateCartUI === 'function') updateCartUI();
  if (typeof updateWishlistUI === 'function') updateWishlistUI();
  const wishCount = document.getElementById('wishlist-count');
  if (wishCount) wishCount.textContent = String(wishlist.length);
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) themeIcon.className = document.documentElement.classList.contains('dark') ? 'fa-solid fa-sun text-base sm:text-lg relative z-10' : 'fa-solid fa-moon text-base sm:text-lg relative z-10';
  const deliveryLabel = document.getElementById('delivery-slot-label');
  if (deliveryLabel) deliveryLabel.textContent = 'الموعد المختار: ' + selectedDeliverySlot;
  const deliveryRadio = document.querySelector(`input[name="delivery-slot"][value="${CSS.escape(selectedDeliverySlot)}"]`);
  if (deliveryRadio) deliveryRadio.checked = true;
  if (typeof renderRecentlyViewed === 'function') renderRecentlyViewed();
  if (typeof window.updateLoyaltyUI === 'function') window.updateLoyaltyUI();
  const dashboardPoints = document.getElementById('hn-dash-points');
  if (dashboardPoints) dashboardPoints.textContent = String(loyaltyPoints);
}



const HN_ORDERS_KEY = 'hypernest-demo-orders-v1';
function getHyperNestOrders() {
  try {
    const value = JSON.parse(localStorage.getItem(HN_ORDERS_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.warn('[HyperNest] Could not read order history:', error);
    return [];
  }
}
function saveHyperNestOrder(order) {
  try {
    const orders = getHyperNestOrders();
    if (orders.some(item => item.id === order.id)) return false;
    localStorage.setItem(HN_ORDERS_KEY, JSON.stringify([order, ...orders].slice(0, 100)));
    return true;
  } catch (error) {
    console.warn('[HyperNest] Could not save order:', error);
    return false;
  }
}
window.getHyperNestOrders = getHyperNestOrders;
window.getHyperNestLoyaltyPoints = () => loyaltyPoints;
window.setHyperNestLoyaltyPoints = value => {
  loyaltyPoints = Math.max(0, Math.floor(Number(value) || 0));
  window.updateLoyaltyUI?.();
  saveState();
  return loyaltyPoints;
};
