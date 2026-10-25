const fmt = (n) => `₦${n.toLocaleString()}`;
const CART_KEY = "muriChopsCart";

let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
// cart item shape: { lineId, productId, qty, extras: [{id, qty}] }

function extrasKey(extras) {
  return [...extras].map(e => `${e.id}:${e.qty}`).sort().join(",");
}

function lineTotal(item) {
  const p = PRODUCTS.find(p => p.id === item.productId);
  if (!p) return 0;
  const extrasTotal = item.extras.reduce((s, e) => s + (EXTRAS.find(ex => ex.id === e.id)?.price || 0) * e.qty, 0);
  return p.price * item.qty + extrasTotal;
}

function extrasDisplay(extras) {
  return extras.map(e => {
    const ex = EXTRAS.find(x => x.id === e.id);
    return ex ? `${ex.name}${e.qty > 1 ? ` ×${e.qty}` : ""}` : null;
  }).filter(Boolean);
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartCount();
}

function addToCart(productId, qty = 1, extras = []) {
  const key = extrasKey(extras);
  const existing = cart.find(i => i.productId === productId && extrasKey(i.extras) === key);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ lineId: `${productId}-${key}-${Date.now()}`, productId, qty, extras });
  }
  saveCart();
  renderCartDrawer();
  bumpCartBadge();
}

function updateQty(lineId, delta) {
  const item = cart.find(i => i.lineId === lineId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.lineId !== lineId);
  saveCart();
  renderCartDrawer();
}

function removeLine(lineId) {
  cart = cart.filter(i => i.lineId !== lineId);
  saveCart();
  renderCartDrawer();
  if (typeof renderOrderSummary === "function") renderOrderSummary();
}

function cartTotal() {
  return cart.reduce((sum, i) => sum + lineTotal(i), 0);
}

function cartCount() {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function renderCartCount() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = cartCount();
}

function bumpCartBadge() {
  const el = document.getElementById("cartCount");
  if (!el) return;
  el.classList.remove("pop");
  void el.offsetWidth;
  el.classList.add("pop");
}

function renderCartDrawer() {
  const itemsEl = document.getElementById("cartItems");
  const footerEl = document.getElementById("cartFooter");
  if (!itemsEl || !footerEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="empty-cart">Your cart is empty.<br>Add something delicious 🍛</div>`;
    footerEl.innerHTML = "";
    return;
  }

  itemsEl.innerHTML = cart.map(i => {
    const p = PRODUCTS.find(p => p.id === i.productId);
    if (!p) return "";
    const names = extrasDisplay(i.extras);
    return `
      <div class="cart-line">
        <div>
          <div class="cart-line-name">${p.name}</div>
          ${names.length ? `<div class="cart-line-extras">${names.join(", ")}</div>` : ""}
          <div class="qty-controls">
            <button onclick="updateQty('${i.lineId}', -1)">−</button>
            <span>${i.qty}</span>
            <button onclick="updateQty('${i.lineId}', 1)">+</button>
          </div>
        </div>
        <div class="cart-line-right">
          <div class="price">${fmt(lineTotal(i))}</div>
          
<button class="delete-line-btn" onclick="removeLine('${i.lineId}')" aria-label="Remove item">
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
    <path d="M10 11v6"></path><path d="M14 11v6"></path>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
  </svg>
</button>
        </div>
      </div>`;
  }).join("");

  footerEl.innerHTML = `
    <div class="cart-line" style="border:none;font-weight:700;">
      <span>Subtotal</span><span>${fmt(cartTotal())}</span>
    </div>
    <a href="cart.html" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:12px;">Review & Checkout</a>
  `;
}

function showToast(text) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function renderPopular() {
  const grid = document.getElementById("popularGrid");
  if (!grid) return;
  const popular = PRODUCTS.filter(p => p.popular).slice(0, 3);
  grid.innerHTML = popular.map(p => `
    <div class="food-card" data-id="${p.id}">
      <div class="food-card-img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
      <div class="food-card-body">
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="food-card-footer">
          <span class="price">${fmt(p.price)}</span>
          <button class="add-btn" data-id="${p.id}">+ Add</button>
        </div>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      addToCart(id, 1, []);
      showToast("Added to your order");
      btn.textContent = "Added ✓";
      btn.classList.add("added");
      setTimeout(() => { btn.textContent = "+ Add"; btn.classList.remove("added"); }, 1200);
    });
  });

  observeReveal(grid.querySelectorAll(".food-card"));
}

function observeReveal(elements) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add("in-view"), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  elements.forEach(el => io.observe(el));
}

function initNavbarScroll() {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  });
}

function initHeroText() {
  document.querySelectorAll(".hero-title .line, .hero-content .eyebrow, .hero-desc, .hero-actions")
    .forEach(el => {
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add("in-view"), delay);
    });
}

function initCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("cartOverlay");
  const openBtn = document.getElementById("cartBtn");
  const closeBtn = document.getElementById("closeCart");

  const open = () => { drawer.classList.add("open"); overlay.classList.add("open"); };
  const close = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); };

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  overlay?.addEventListener("click", close);
}

document.addEventListener("DOMContentLoaded", () => {
  initNavbarScroll();
  initHeroText();
  initCartDrawer();
  renderPopular();
  renderCartDrawer();
  renderCartCount();
  observeReveal(document.querySelectorAll(".section-head.reveal-up, .why-card, .promo.reveal-up"));
});
