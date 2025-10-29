// script.js

// Selecciona el elemento del encabezado
const header = document.querySelector('header');

// Define el umbral de scroll en píxeles.
// Cuando el usuario baje más allá de esta cantidad, el header cambiará.
const scrollThreshold = 100; // Puedes ajustar este valor: 50, 150, etc.

// Esta función se ejecuta cada vez que el usuario hace scroll
function handleScroll() {
  // window.scrollY devuelve el número de píxeles que la página ha sido desplazada verticalmente.
  if (window.scrollY > scrollThreshold) {
    // Si la posición de scroll es mayor que el umbral, añade la clase 'scrolled'
    header.classList.add('scrolled');
  } else {
    // Si la posición de scroll es menor o igual al umbral (estamos arriba), quita la clase 'scrolled'
    header.classList.remove('scrolled');
  }
}

// Añade un "escuchador de eventos" al objeto 'window' para el evento 'scroll'
window.addEventListener('scroll', handleScroll);

// También ejecuta la función una vez cuando el DOM esté completamente cargado.
// Esto es importante para que el header tenga el estilo correcto si el usuario recarga la página
// y ya estaba en una posición de scroll, o si la página es muy corta y ya está "scrolleada" al inicio.
document.addEventListener('DOMContentLoaded', handleScroll);

// --- DATA ---
const products = [
  { id: 1, name: "Clamshell Tomatoes", price: 16.9, seller: "Fresh Market", image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg" },
  { id: 2, name: "Broccoli", price: 14.9, seller: "Green Farm", image: "https://upload.wikimedia.org/wikipedia/commons/0/03/Broccoli_and_cross_section_edit.jpg" },
  { id: 3, name: "Onion", price: 25.9, seller: "Veggie Shop", image: "https://www.pngplay.com/wp-content/uploads/2/Onion-PNG-Pic-Background-1.png" },
  { id: 4, name: "Parsley", price: 14.9, seller: "Fresh Garden", image: "https://static.vecteezy.com/system/resources/previews/031/760/207/large_2x/parsley-with-ai-generated-free-png.png" },
  { id: 5, name: "Cucumber", price: 10.5, seller: "Eco Farm", image: "https://static.vecteezy.com/system/resources/previews/029/720/186/original/cucumber-transparent-background-png.png" },
  { id: 6, name: "Purple Cabbage", price: 12.0, seller: "Healthy Veggies", image: "https://static.vecteezy.com/system/resources/previews/047/082/263/non_2x/purple-cabbage-on-transparent-background-png.png" },
  { id: 7, name: "Carrot", price: 0.98, seller: "Sofia Market", image: "https://www.pngall.com/wp-content/uploads/2016/04/Carrot-PNG.png" }
];

const CURRENCY = "$";
const fmt = n => `${CURRENCY}${Number(n).toFixed(2).replace(".", ",")}`;

// --- ELEMENTS ---
const searchInput  = document.getElementById("search");
const productList  = document.getElementById("product-list");
const productDetail= document.getElementById("product-detail");
const backBtn      = document.getElementById("back-btn");
const detailImg    = document.getElementById("detail-img");
const detailName   = document.getElementById("detail-name");
const detailPrice  = document.getElementById("detail-price");
const detailSeller = document.getElementById("detail-seller");
const suggestions  = document.getElementById("suggestions");
const addCartBtn   = document.getElementById("add-cart-btn");

const cartBtn      = document.getElementById("cart-btn");
const cartPanel    = document.getElementById("cart-panel");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsEl  = document.getElementById("cart-items");
const cartTotalEl  = document.getElementById("cart-total");
const cartCountEl  = document.getElementById("cart-count");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn  = document.getElementById("checkout");

const toggleViewBtn = document.getElementById("toggle-view");

// --- STATE ---
let filtered = [...products];
let selectedProduct = null;
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let isGrid = true;

// --- RENDER PRODUCTS ---
function renderProducts(list){
  productList.innerHTML = "";
  list.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<img src="${p.image}" alt="${p.name}"/>
                      <h4>${p.name}</h4>
                      <p>${fmt(p.price)}</p>`;
    card.onclick = ()=> showDetail(p);
    productList.appendChild(card);
  });
  productList.className = isGrid ? "grid" : "list";
}

// --- DETAIL VIEW ---
function showDetail(product){
  selectedProduct = product;
  productList.style.display = "none";
  productDetail.classList.remove("hidden");

  detailImg.src = product.image;
  detailName.textContent = product.name.toUpperCase();
  detailPrice.textContent = fmt(product.price);
  detailSeller.textContent = product.seller;

  addCartBtn.onclick = ()=> addToCart(product);

  suggestions.innerHTML = "";
  products.filter(p=>p.id!==product.id).forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<img src="${p.image}" alt="${p.name}"/>
                      <h4>${p.name}</h4>
                      <p>${fmt(p.price)}</p>`;
    card.onclick = ()=> showDetail(p);
    suggestions.appendChild(card);
  });
}

backBtn.onclick = ()=>{
  productList.style.display = "grid";
  productDetail.classList.add("hidden");
};

// --- SEARCH ---
searchInput.addEventListener("input", ()=>{
  const q = searchInput.value.toLowerCase();
  filtered = products.filter(p=> p.name.toLowerCase().includes(q));
  renderProducts(filtered);
});

// --- VIEW TOGGLE ---
toggleViewBtn.onclick = ()=>{
  isGrid = !isGrid;
  renderProducts(filtered);
};

// --- CART LOGIC (igual al tuyo) ---
function persistCart(){ localStorage.setItem("cart", JSON.stringify(cart)); }
function addToCart(p){
  const i = cart.findIndex(item=> item.id===p.id);
  if(i>=0){ cart[i].qty += 1; }
  else { cart.push({ id:p.id, name:p.name, price:p.price, image:p.image, qty:1 }); }
  renderCart();
}
function updateQty(id, delta){
  const i = cart.findIndex(x=>x.id===id);
  if(i<0) return;
  cart[i].qty += delta;
  if(cart[i].qty<=0) cart.splice(i,1);
  renderCart();
}
function removeItem(id){ cart = cart.filter(x=>x.id!==id); renderCart(); }
function calcTotals(){
  const count = cart.reduce((s,i)=> s+i.qty, 0);
  const total = cart.reduce((s,i)=> s+(i.price*i.qty), 0);
  return { count, total };
}
function renderCart(){
  cartItemsEl.innerHTML = "";
  if(cart.length === 0){
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="cart-icon">🛒</div>
        <strong>Your cart is empty!</strong>
        <p>What are you waiting for to fill it?</p>
        <button onclick="cartPanel.classList.add('hidden')" class="btn-cart" style="margin-top:15px; background:green;">🛍️ Go Shopping</button>
      </div>
    `;
    cartCountEl.textContent = 0;
    cartTotalEl.textContent = fmt(0);
    persistCart();
    return;
  }
  cart.forEach(item=>{
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}"/>
      <div>
        <p class="item-title">${item.name}</p>
        <p class="item-price">${fmt(item.price)}</p>
        <button class="remove" data-id="${item.id}">Remove</button>
      </div>
      <div class="qty">
        <button class="minus" data-id="${item.id}">−</button>
        <span>${item.qty}</span>
        <button class="plus" data-id="${item.id}">+</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });
  cartItemsEl.querySelectorAll(".plus").forEach(b=> b.onclick = ()=> updateQty(Number(b.dataset.id), +1));
  cartItemsEl.querySelectorAll(".minus").forEach(b=> b.onclick = ()=> updateQty(Number(b.dataset.id), -1));
  cartItemsEl.querySelectorAll(".remove").forEach(b=> b.onclick = ()=> removeItem(Number(b.dataset.id)));
  const { count, total } = calcTotals();
  cartCountEl.textContent = count;
  cartTotalEl.textContent = fmt(total);
  persistCart();
}

cartBtn.onclick   = ()=> cartPanel.classList.toggle("hidden");
closeCartBtn.onclick = ()=> cartPanel.classList.add("hidden");
clearCartBtn.onclick = ()=> { cart = []; renderCart(); };
checkoutBtn.onclick  = ()=> alert("This is a demo checkout 🙂");

// --- INIT ---
renderProducts(filtered);
renderCart();
