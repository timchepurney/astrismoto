// -----------------------
// ASTRIS MOTO
// -----------------------

let cart = JSON.parse(localStorage.getItem("astris-cart")) || [];

let currentProduct = null;
let currentQty = 1;
let currentVariant = null;

// Loader
window.addEventListener("load", () => {

    setTimeout(() => {

        const loader = document.getElementById("loader");

        loader.style.opacity = "0";

        setTimeout(() => {
            loader.style.display = "none";
        },400);

    },1000);

    loadProducts();

    updateCart();

});

// Load Products

function loadProducts(){

    const container = document.getElementById("products");

    container.innerHTML = "";

    products.forEach(product=>{

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

// Open Product

function openProduct(id){

    currentProduct = products.find(p=>p.id===id);

    currentQty = 1;

    currentVariant = null;

    document.getElementById("home").style.display="none";

    document.getElementById("productPage").style.display="block";

    document.getElementById("productTitle").innerText=currentProduct.name;

    document.getElementById("productPrice").innerText="$"+currentProduct.price;

    loadGallery();

    loadVariants();

}

// Gallery

function loadGallery(){

    const gallery=document.getElementById("productGallery");

    gallery.innerHTML="";

    currentProduct.gallery.forEach(img=>{

        gallery.innerHTML+=`

        <img src="${img}">

        `;

    });

}

// Variants

function loadVariants(){

    const box=document.getElementById("variantButtons");

    box.innerHTML="";

    if(currentProduct.variants.length===0) return;

    currentProduct.variants.forEach(v=>{

        box.innerHTML+=`

        <button onclick="selectVariant('${v.name}',${v.price})">

        ${v.name}

        </button>

        `;

    });

}

function selectVariant(name,price){

    currentVariant=name;

    document.getElementById("productPrice").innerText="$"+price;

}
// -----------------------
// QUANTITY
// -----------------------

function increaseQty(){

    currentQty++;

    document.querySelector(".quantity span").innerText=currentQty;

}

function decreaseQty(){

    if(currentQty>1){

        currentQty--;

        document.querySelector(".quantity span").innerText=currentQty;

    }

}

// Connect buttons

document.addEventListener("click",(e)=>{

    if(e.target.classList.contains("qty-plus")){

        increaseQty();

    }

    if(e.target.classList.contains("qty-minus")){

        decreaseQty();

    }

});

// -----------------------
// ADD TO CART
// -----------------------

document.querySelector(".cart-large").onclick=()=>{

    let price=currentProduct.price;

    if(currentVariant){

        const found=currentProduct.variants.find(v=>v.name===currentVariant);

        if(found) price=found.price;

    }

    cart.push({

        id:currentProduct.id,

        name:currentProduct.name,

        variant:currentVariant,

        qty:currentQty,

        price:price,

        image:currentProduct.image

    });

    localStorage.setItem("astris-cart",JSON.stringify(cart));

    updateCart();

    openCart();

};

// -----------------------
// UPDATE CART
// -----------------------

function updateCart(){

    document.getElementById("cartCount").innerText=cart.length;

    let items=document.getElementById("cartItems");

    let total=0;

    items.innerHTML="";

    cart.forEach((item,index)=>{

        total+=item.price*item.qty;

        items.innerHTML+=`

        <div class="cart-item">

            <img src="${item.image}" width="70">

            <div>

                <h3>${item.name}</h3>

                <p>${item.variant||""}</p>

                <p>Qty ${item.qty}</p>

            </div>

            <div>

                $${item.price*item.qty}

            </div>

        </div>

        `;

    });

    document.getElementById("cartTotal").innerText="$"+total;

}

// -----------------------
// CART DRAWER
// -----------------------

function openCart(){

    document.getElementById("cartDrawer").classList.add("open");

}

function closeCart(){

    document.getElementById("cartDrawer").classList.remove("open");

}

document.querySelector(".closeCart").onclick=closeCart;

document.getElementById("cartButton").onclick=openCart;
const cartDrawer = document.getElementById("cartDrawer");
const cartButton = document.getElementById("cartButton");
const closeCart = document.querySelector(".closeCart");

cartButton.onclick = () => {
  cartDrawer.classList.add("open");
};

closeCart.onclick = () => {
  cartDrawer.classList.remove("open");
};
