// cart.js
let fulfillmentMode = "delivery";

function renderOrderSummary() {
  const el = document.getElementById("orderSummary");
  if (!el) return;

  if (cart.length === 0) {
    el.innerHTML = `<div class="summary-empty">Your cart is empty.<br><a href="menu.html">Browse the menu →</a></div>`;
    document.getElementById("whatsappCheckoutBtn").disabled = true;
    return;
  }

  document.getElementById("whatsappCheckoutBtn").disabled = false;

  const lines = cart.map(i => {
    const p = PRODUCTS.find(p => p.id === i.productId);
    if (!p) return "";
    const names = extrasDisplay(i.extras);
    return `
      <div class="cart-line">
        <div>
          <div class="cart-line-name">${i.qty} × ${p.name}</div>
          ${names.length ? `<div class="cart-line-extras">${names.join(", ")}</div>` : ""}
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

  el.innerHTML = `
    ${lines}
    <div class="cart-line" style="border:none;font-weight:700;padding-top:16px;">
      <span>Subtotal</span><span>${fmt(cartTotal())}</span>
    </div>
  `;
}

function setFulfillmentMode(mode) {
  fulfillmentMode = mode;
  document.querySelectorAll(".toggle-btn").forEach(b => b.classList.toggle("active", b.dataset.mode === mode));
  document.getElementById("addressField").style.display = mode === "pickup" ? "none" : "block";
}

function validateForm() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const errorEl = document.getElementById("formError");

  if (!name || !phone) {
    errorEl.textContent = "Please enter your name and phone number.";
    return null;
  }
  if (fulfillmentMode === "delivery" && !address) {
    errorEl.textContent = "Please enter a delivery address.";
    return null;
  }
  errorEl.textContent = "";
  return {
    name, phone, address,
    notes: document.getElementById("custNotes").value.trim(),
  };
}

function buildOrderMessage(details) {
  let msg = "Hello MURI CHOPS 👋\n\nI'd like to place an order.\n\n";
  cart.forEach(i => {
    const p = PRODUCTS.find(p => p.id === i.productId);
    if (!p) return;
    const names = extrasDisplay(i.extras);
    msg += `🍽️ ${i.qty} × ${p.name}`;
    if (names.length) msg += ` (+ ${names.join(", ")})`;
    msg += ` — ${fmt(lineTotal(i))}\n`;
  });
  msg += `\nTotal: ${fmt(cartTotal())}\n\n`;
  msg += `Name: ${details.name}\n`;
  msg += `Phone: ${details.phone}\n`;
  if (fulfillmentMode === "delivery") {
    msg += `Address: ${details.address}\n`;
    if (details.notes) msg += `Notes: ${details.notes}\n`;
    msg += `\nDelivery, please.`;
  } else {
    msg += `\nI'll pick this up, please.`;
  }
  return msg;
}

function initCartPage() {
  renderOrderSummary();

  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => setFulfillmentMode(btn.dataset.mode));
  });

  document.getElementById("whatsappCheckoutBtn").addEventListener("click", () => {
    if (cart.length === 0) return;
    const details = validateForm();
    if (!details) return;
    const msg = buildOrderMessage(details);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });
}

document.addEventListener("DOMContentLoaded", initCartPage);
