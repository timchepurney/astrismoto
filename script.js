let cart = JSON.parse(localStorage.getItem("astris-cart")) || [];

let currentProduct = null;
let currentQty = 1;
let currentVariant = null;

// -----------------------
// INIT
// -----------------------

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";

    setTimeout(() => loader.style.display = "none", 500);
  }, 800);

  loadProducts();
  updateCart();
});

// -----------------------
// PRODUCTS
// -----------------------

function loadProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" onclick="openProduct(${p.id})">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>$${p.price}</p>
          <button onclick="openProduct(${p.id})">View Product</button>
        </div>
      </div>
    `;
  });
}

// -----------------------
// OPEN PRODUCT
// -----------------------

function openProduct(id) {
  currentProduct = products.find(p => p.id === id);
  currentQty = 1;
  currentVariant = null;

  document.getElementById("home").style.display = "none";
  document.getElementById("productPage").style.display = "block";

  document.getElementById("productTitle").innerText = currentProduct.name;
  document.getElementById("productPrice").innerText = "$" + currentProduct.price;

  loadGallery();
  loadVariants();
}

// -----------------------
// GALLERY
// -----------------------

function loadGallery() {
  const g = document.getElementById("productGallery");
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
  box.innerHTML = "";

  if (!currentProduct.variants) return;

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
  if (e.target.classList.contains("qty-plus")) {
    currentQty++;
    document.querySelector(".quantity span").innerText = currentQty;
  }

  if (e.target.classList.contains("qty-minus") && currentQty > 1) {
    currentQty--;
    document.querySelector(".quantity span").innerText = currentQty;
  }
});

// -----------------------
// ADD TO CART
// -----------------------

document.querySelector(".cart-large").addEventListener("click", () => {

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

  localStorage.setItem("astris-cart", JSON.stringify(cart));

  updateCart();
  openCart();
});

// -----------------------
// CART UPDATE
// -----------------------

function updateCart() {
  const items = document.getElementById("cartItems");
  let total = 0;

  items.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    items.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" width="60">

        <div style="flex:1">
          <h3>${item.name}</h3>
          <p>${item.variant || ""}</p>

          <div style="display:flex; gap:10px; align-items:center;">
            <button onclick="changeQty(${index}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
        </div>

        <div>
          $${item.price * item.qty}
          <button onclick="removeItem(${index})">🗑️</button>
        </div>
      </div>
    `;
  });

  document.getElementById("cartTotal").innerText = "$" + total;
  document.getElementById("cartCount").innerText = cart.length;

  localStorage.setItem("astris-cart", JSON.stringify(cart));
}

// -----------------------
// CART ACTIONS
// -----------------------

function changeQty(index, amount) {
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
  cartDrawer.classList.add("open");
}

function closeCart() {
  cartDrawer.classList.remove("open");
}

cartButton.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
