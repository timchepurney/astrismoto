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
