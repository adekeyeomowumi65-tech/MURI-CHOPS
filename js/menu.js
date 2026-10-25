// menu.js
let currentCategory = "all";
let currentSearch = "";
let selectedProduct = null;
let selectedExtras = {}; // { extraId: qty }
let modalQty = 1;

function filterProducts() {
  return PRODUCTS.filter(p => {
    const matchCat = currentCategory === "all" || p.category === currentCategory;
    const matchSearch = p.name.toLowerCase().includes(currentSearch) || p.desc.toLowerCase().includes(currentSearch);
    return matchCat && matchSearch;
  });
}

function renderMenuGrid(animate = true) {
  const grid = document.getElementById("menuGrid");
  const noResults = document.getElementById("noResults");
  const list = filterProducts();
  
  const draw = () => {
    if (list.length === 0) {
      grid.innerHTML = "";
      noResults.style.display = "block";
    } else {
      noResults.style.display = "none";
      grid.innerHTML = list.map(p => `
        <div class="food-card in-view" data-id="${p.id}">
          <div class="food-card-img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
          <div class="food-card-body">
            <h3>${p.name}</h3>
            <p class="desc">${p.desc}</p>
            <div class="food-card-footer">
              <span class="price">${fmt(p.price)}</span>
              <button class="add-btn quick-add" data-id="${p.id}">+ Add</button>
            </div>
          </div>
        </div>
      `).join("");
      attachGridEvents();
    }
    grid.classList.remove("filtering");
  };
  
  if (animate) {
    grid.classList.add("filtering");
    setTimeout(draw, 220);
  } else {
    draw();
  }
}

function attachGridEvents() {
  document.querySelectorAll(".food-card").forEach(card => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".quick-add")) return;
      openProductModal(card.dataset.id);
    });
  });
  document.querySelectorAll(".quick-add").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(btn.dataset.id, 1, []);
      showToast("Added to your order");
      btn.textContent = "Added ✓";
      btn.classList.add("added");
      setTimeout(() => { btn.textContent = "+ Add";
        btn.classList.remove("added"); }, 1200);
    });
  });
}

function openProductModal(productId) {
  selectedProduct = PRODUCTS.find(p => p.id === productId);
  if (!selectedProduct) return;
  selectedExtras = {};
  modalQty = 1;
  
  document.getElementById("modalImg").src = selectedProduct.img;
  document.getElementById("modalImg").alt = selectedProduct.name;
  document.getElementById("modalName").textContent = selectedProduct.name;
  document.getElementById("modalDesc").textContent = selectedProduct.desc;
  document.getElementById("modalQty").textContent = modalQty;
  updateModalPrice();
  renderExtrasList();
  
  document.getElementById("modalOverlay").classList.add("open");
}

function renderExtrasList() {
  document.getElementById("extrasList").innerHTML = EXTRAS.map(ex => `
    <div class="extra-item">
      <div class="extra-info">
        <span class="extra-name">${ex.name}</span>
        <span class="extra-price">+${fmt(ex.price)} each</span>
      </div>
      <div class="qty-controls small">
        <button class="extra-minus" data-id="${ex.id}">−</button>
        <span id="extraQty-${ex.id}">${selectedExtras[ex.id] || 0}</span>
        <button class="extra-plus" data-id="${ex.id}">+</button>
      </div>
    </div>
  `).join("");
  
  document.querySelectorAll(".extra-plus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      selectedExtras[id] = (selectedExtras[id] || 0) + 1;
      document.getElementById(`extraQty-${id}`).textContent = selectedExtras[id];
      updateModalPrice();
    });
  });
  document.querySelectorAll(".extra-minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (!selectedExtras[id]) return;
      selectedExtras[id] -= 1;
      if (selectedExtras[id] <= 0) delete selectedExtras[id];
      document.getElementById(`extraQty-${id}`).textContent = selectedExtras[id] || 0;
      updateModalPrice();
    });
  });
}

function extrasArray() {
  return Object.entries(selectedExtras).map(([id, qty]) => ({ id, qty }));
}

function updateModalPrice() {
  const extrasTotal = extrasArray().reduce((s, e) => s + (EXTRAS.find(x => x.id === e.id)?.price || 0) * e.qty, 0);
  const total = (selectedProduct.price + extrasTotal) * modalQty;
  document.getElementById("modalPrice").textContent = fmt(total);
}

function closeProductModal() {
  document.getElementById("modalOverlay").classList.remove("open");
}

function initMenuPage() {
  renderMenuGrid(false);
  
  document.getElementById("searchInput").addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase().trim();
    renderMenuGrid();
  });
  
  document.querySelectorAll(".cat-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.dataset.cat;
      renderMenuGrid();
    });
  });
  
  document.getElementById("modalClose").addEventListener("click", closeProductModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeProductModal();
  });
  
  document.getElementById("modalQtyMinus").addEventListener("click", () => {
    if (modalQty > 1) modalQty--;
    document.getElementById("modalQty").textContent = modalQty;
    updateModalPrice();
  });
  document.getElementById("modalQtyPlus").addEventListener("click", () => {
    modalQty++;
    document.getElementById("modalQty").textContent = modalQty;
    updateModalPrice();
  });
  
  document.getElementById("modalAddBtn").addEventListener("click", () => {
    addToCart(selectedProduct.id, modalQty, extrasArray());
    showToast("Added to your order");
    closeProductModal();
  });
}

document.addEventListener("DOMContentLoaded", initMenuPage);