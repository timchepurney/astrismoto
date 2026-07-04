console.log("script is alive 🔥");
// -----------------------
// ASTRIS MOTO - CLEAN SCRIPT
// -----------------------

let cart = JSON.parse(localStorage.getItem("astris-cart")) || [];

let currentProduct = null;
let currentQty = 1;
let currentVariant = null;

// -----------------------
// LOADER (ONLY ONCE)
// -----------------------

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";

    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }, 800);

  loadProducts();
  updateCart();
});

// -----------------------
// LOAD PRODUCTS
// -----------------------

function loadProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(product => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" onclick="openProduct(${product.id})">

        <div class="product-info">
          <h3>${product.name}</h3>
          <p>$${product.price}</p>

          <button onclick="openProduct(${product.id})">
            View Product
          </button>
        </div>
      </div>
    `;
  });
}

// -----------------------
// OPEN PRODUCT PAGE
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
  const gallery = document.getElementById("productGallery");
  gallery.innerHTML = "";

  currentProduct.gallery.forEach(img => {
    gallery.innerHTML += `<img src="${img}">`;
  });
}

// -----------------------
// VARIANTS
// -----------------------

function loadVariants() {
  const box = document.getElementById("variantButtons");
  box.innerHTML = "";

  if (!currentProduct.variants || currentProduct.variants.length === 0) return;

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
// QUANTITY
// -----------------------

function increaseQty() {
  currentQty++;
  document.querySelector(".quantity span").innerText = currentQty;
}

function decreaseQty() {
  if (currentQty > 1) {
    currentQty--;
    document.querySelector(".quantity span").innerText = currentQty;
  }
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("qty-plus")) increaseQty();
  if (e.target.classList.contains("qty-minus")) decreaseQty();
});

// -----------------------
// ADD TO CART
// -----------------------

document.querySelector(".cart-large").addEventListener("click", () => {
  let price = currentProduct.price;

  if (currentVariant && currentProduct.variants) {
    const found = currentProduct.variants.find(v => v.name === currentVariant);
    if (found) price = found.price;
  }

  cart.push({
    id: currentProduct.id,
    name: currentProduct.name,
    variant: currentVariant,
    qty: currentQty,
    price: price,
    image: currentProduct.image
  });

  localStorage.setItem("astris-cart", JSON.stringify(cart));

  updateCart();
  openCart();
});

// -----------------------
// UPDATE CART
// -----------------------

function updateCart() {
  document.getElementById("cartCount").innerText = cart.length;

  const items = document.getElementById("cartItems");
  let total = 0;

  items.innerHTML = "";

  cart.forEach(item => {
    total += item.price * item.qty;

    items.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" width="60">

        <div>
          <h3>${item.name}</h3>
          <p>${item.variant || ""}</p>
          <p>Qty: ${item.qty}</p>
        </div>

        <div>$${item.price * item.qty}</div>
      </div>
    `;
  });

  document.getElementById("cartTotal").innerText = "$" + total;
}

// -----------------------
// CART DRAWER (CLEAN)
// -----------------------

const cartDrawer = document.getElementById("cartDrawer");
const cartButton = document.getElementById("cartButton");
const closeBtn = document.querySelector(".closeCart");

function openCart() {
  cartDrawer.classList.add("open");
}

function closeCart() {
  cartDrawer.classList.remove("open");
}

cartButton.addEventListener("click", openCart);
closeBtn.addEventListener("click", closeCart);
