/* ===== cart.js (shared) ===== */
(function () {
  const KEY = 'cart';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(KEY, JSON.stringify(cart));
    updateCartCount();
  }
  function addToCart(item) {
    const cart = getCart();
    const idx = cart.findIndex(x => x.id === item.id);
    if (idx >= 0) {
      cart[idx].qty += item.qty || 1;
    } else {
      cart.push({ id: item.id, name: item.name, price: item.price, qty: item.qty || 1, image: item.image || "" });
    }
    saveCart(cart);
  }
  function setQty(id, qty) {
    const cart = getCart().map(it => it.id === id ? { ...it, qty: Math.max(1, qty) } : it);
    saveCart(cart);
  }
  function inc(id) {
    const cart = getCart().map(it => it.id === id ? { ...it, qty: it.qty + 1 } : it);
    saveCart(cart);
  }
  function dec(id) {
    const cart = getCart().map(it => it.id === id ? { ...it, qty: Math.max(1, it.qty - 1) } : it);
    saveCart(cart);
  }
  function removeItem(id) {
    const cart = getCart().filter(it => it.id !== id);
    saveCart(cart);
  }
  function total() {
    return getCart().reduce((s, it) => s + it.price * it.qty, 0);
  }

  function updateCartCount() {
    const el = document.getElementById('cartCount');
    if (!el) return;
    const count = getCart().reduce((s, it) => s + it.qty, 0);
    el.textContent = count;
  } 

  // update badge on first load & on storage changes (other tabs/pages)
  document.addEventListener('DOMContentLoaded', updateCartCount);
  window.addEventListener('storage', (e) => { if (e.key === KEY) updateCartCount(); });

  // Expose minimal API globally
  window.Cart = { getCart, saveCart, addToCart, inc, dec, setQty, removeItem, total, updateCartCount };
})();
