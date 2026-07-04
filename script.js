let cart = JSON.parse(localStorage.getItem("astris-cart")) || [];

let currentProduct = null;
let currentQty = 1;
let currentVariant = null;

let activeFilter = "all";

// -----------------------
// INIT
// -----------------------

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
      setTimeout(() => loader.style.display = "none", 500);
    }, 800);
  }

  loadProducts();
  updateCart();
});

// -----------------------
// MENU SYSTEM ☰
// -----------------------

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-btn");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenu = document.getElementById("closeMenu");
  const backdrop = document.getElementById("backdrop");

  const openMenu = () => {
    if (sideMenu) sideMenu.classList.add("open");
    if (backdrop) backdrop.style.display = "block";
  };

  const closeMenuFn = () => {
    if (sideMenu) sideMenu.classList.remove("open");
    if (backdrop) backdrop.style.display = "none";
  };

  menuBtn?.addEventListener("click", openMenu);
  closeMenu?.addEventListener("click", closeMenuFn);
  backdrop?.addEventListener("click", closeMenuFn);

  // NAV LINKS
  document.querySelector(".nav-home")?.addEventListener("click", (e) => {
    e.preventDefault();
    showHome();
    closeMenuFn();
  });

  document.querySelector(".nav-shop")?.addEventListener("click", (e) => {
    e.preventDefault();
    showHome();
    loadProducts();
    closeMenuFn();
  });
});

// -----------------------
// FILTER SYSTEM
// -----------------------

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("filter")) return;

  activeFilter = e.target.dataset.filter || "all";

  document.querySelectorAll(".filter").forEach(btn => {
    btn.classList.remove("active");
  });

  e.target.classList.add("active");

  loadProducts();
});

// -----------------------
// LOAD PRODUCTS
// -----------------------

function loadProducts() {
  const container = document.getElementById("products");
  if (!container || typeof products === "undefined") return;

  container.innerHTML = "";

  const filtered =
    activeFilter === "all"
      ? products
      : products.filter(p => p.category === activeFilter);

  filtered.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" onclick="openProduct(${p.id})">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>$${p.price}</p>
          <button onclick="openProduct(${p.id})">View</button>
        </div>
      </div>
    `;
  });
}

// -----------------------
// PAGE SWITCH HELPERS
// -----------------------

function showHome() {
  document.getElementById("home").style.display = "block";
  document.getElementById("productPage").style.display = "none";
}

function showProduct() {
  document.getElementById("home").style.display = "none";
  document.getElementById("productPage").style.display = "block";
}

// -----------------------
// OPEN PRODUCT
// -----------------------

function openProduct(id) {
  currentProduct = products.find(p => p.id === id);
  if (!currentProduct) return;

  currentQty = 1;
  currentVariant = null;

  showProduct();

  document.getElementById("productTitle").innerText = currentProduct.name;
  document.getElementById("productPrice").innerText = "$" + currentProduct.price;

  loadGallery();
  loadVariants();
}

// -----------------------
// BACK BUTTON
// -----------------------

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("back-btn") || e.target.id === "closeProduct") {
    showHome();
  }
});

// -----------------------
// GALLERY
// -----------------------

function loadGallery() {
  const g = document.getElementById("productGallery");
  if (!g || !currentProduct) return;

  g.innerHTML = "";

  currentProduct.gallery.forEach(img => {
    g.innerHTML += `<img src="${img}">`;
  });
}

// -----------------------
// VARIANTS
// -----------------------

function loadVariants() {
  const box = document.getElementById("variantButtons");
  if (!box || !currentProduct) return;

  box.innerHTML = "";

  if (!currentProduct.variants?.length) return;

  currentProduct.variants.forEach(v => {
    box.innerHTML += `
      <button onclick="selectVariant('${v.name}', ${v.price})">
        ${v.name}
      </button>
    `;
  });
}

function selectVariant(name, price) {
  currentVariant = name;
  document.getElementById("productPrice").innerText = "$" + price;
}

// -----------------------
// QTY
// -----------------------

document.addEventListener("click", (e) => {
  const qtyEl = document.querySelector(".quantity span");
  if (!qtyEl) return;

  if (e.target.classList.contains("qty-plus")) {
    currentQty++;
    qtyEl.innerText = currentQty;
  }

  if (e.target.classList.contains("qty-minus") && currentQty > 1) {
    currentQty--;
    qtyEl.innerText = currentQty;
  }
});

// -----------------------
// ADD TO CART
// -----------------------

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cart-large")) return;
  if (!currentProduct) return;

  let price = currentProduct.price;

  if (currentVariant && currentProduct.variants) {
    const v = currentProduct.variants.find(x => x.name === currentVariant);
    if (v) price = v.price;
  }

  const existing = cart.find(
    i => i.id === currentProduct.id && i.variant === currentVariant
  );

  if (existing) {
    existing.qty += currentQty;
  } else {
    cart.push({
      id: currentProduct.id,
      name: currentProduct.name,
      variant: currentVariant,
      qty: currentQty,
      price,
      image: currentProduct.image
    });
  }

  updateCart();
  openCart();
});

// -----------------------
// CART
// -----------------------

function updateCart() {
  const items = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const countEl = document.getElementById("cartCount");

  if (!items) return;

  let total = 0;
  items.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    items.innerHTML += `
      <div class="cart-item" style="display:flex;gap:10px;align-items:center;margin-bottom:15px;">
        <img src="${item.image}" width="60" style="border-radius:10px;">

        <div style="flex:1">
          <h3 style="font-size:14px;">${item.name}</h3>
          <p style="color:#aaa;font-size:12px;">${item.variant || ""}</p>

          <div style="display:flex;gap:8px;align-items:center;">
            <button onclick="changeQty(${index}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
        </div>

        <div style="text-align:right;">
          <div>$${item.price * item.qty}</div>
          <button onclick="removeItem(${index})">🗑️</button>
        </div>
      </div>
    `;
  });

  if (totalEl) totalEl.innerText = "$" + total;
  if (countEl) countEl.innerText = cart.length;

  localStorage.setItem("astris-cart", JSON.stringify(cart));
}

// -----------------------
// CART ACTIONS
// -----------------------

function changeQty(index, amount) {
  if (!cart[index]) return;

  cart[index].qty += amount;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

// -----------------------
// CART DRAWER
// -----------------------

const cartDrawer = document.getElementById("cartDrawer");
const cartButton = document.getElementById("cartButton");
const closeCartBtn = document.querySelector(".closeCart");

function openCart() {
  cartDrawer?.classList.add("open");
}

function closeCart() {
  cartDrawer?.classList.remove("open");
}

cartButton?.addEventListener("click", openCart);
closeCartBtn?.addEventListener("click", closeCart);
