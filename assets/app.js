
// Shared app logic (localStorage cart, rendering, nav count)
const PRODUCTS = [
  {id:'americano', name:'Американо', price:40, img:'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?q=80&w=1200&auto=format&fit=crop'},
  {id:'cappuccino', name:'Капучино', price:60, img:'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop'},
  {id:'latte', name:'Латте', price:70, img:'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?q=80&w=1200&auto=format&fit=crop'},
  {id:'flatwhite', name:'Флэт уайт', price:80, img:'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop'},
  {id:'icedlatte', name:'Айсед латте', price:80, img:'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1200&auto=format&fit=crop'},
  {id:'affogato', name:'Аффогато', price:100, img:'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop'},
];

const CART_KEY = 'ch_cart';
function readCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }catch(e){ return {} } }
function writeCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function addToCart(id){ const c=readCart(); c[id]=(c[id]||0)+1; writeCart(c); toast('Добавлено в корзину'); }
function removeFromCart(id){ const c=readCart(); if(c[id]){ c[id]--; if(c[id]<=0) delete c[id]; writeCart(c); } }
function deleteFromCart(id){ const c=readCart(); delete c[id]; writeCart(c); }
function clearCart(){ writeCart({}); }
function cartItems(){
  const c = readCart(); const arr = [];
  for (const [id,qty] of Object.entries(c)){ const p=PRODUCTS.find(x=>x.id===id); if(p) arr.push({...p, qty}); }
  return arr;
}
function cartTotal(){ return cartItems().reduce((s,i)=>s+i.price*i.qty,0); }

function updateCartCount(){
  const count = Object.values(readCart()).reduce((s,n)=>s+n,0);
  document.querySelectorAll('[data-cart-count]').forEach(el=> el.textContent = count);
}
document.addEventListener('DOMContentLoaded', updateCartCount);

/* --- Renderers --- */
function renderMenu(){
  const root = document.getElementById('menu-root'); if(!root) return;
  root.innerHTML = PRODUCTS.map(p=>`
    <div class="card item">
      <div class="img" style="background-image:url('${p.img}')"></div>
      <h3>${p.name}</h3>
      <div class="price">${p.price} ₽</div>
      <button class="btn btn-primary" onclick="addToCart('${p.id}')">В корзину</button>
    </div>
  `).join('');
}

function renderCart(){
  const root = document.getElementById('cart-root'); if(!root) return;
  const items = cartItems();
  if(items.length===0){
    root.innerHTML = `<div class="card center">Пока пусто… Добавьте напитки из меню ☕</div>`;
    document.getElementById('total-box').classList.add('hidden');
    return;
  }
  document.getElementById('total-box').classList.remove('hidden');
  root.innerHTML = items.map(i=>`
    <div class="cart-item">
      <div>
        <div class="cart-name">${i.name}</div>
        <div class="small">${i.price} ₽/шт</div>
      </div>
      <div class="qty-box">
        <button class="iconbtn" aria-label="-" onclick="removeFromCart('${i.id}'); renderCart()">−</button>
        <strong>${i.qty}</strong>
        <button class="iconbtn" aria-label="+" onclick="addToCart('${i.id}'); renderCart()">+</button>
      </div>
      <div><strong>${i.price*i.qty} ₽</strong></div>
      <button class="iconbtn" onclick="deleteFromCart('${i.id}'); renderCart()" title="Удалить">✕</button>
    </div>
  `).join('');
  document.getElementById('total').textContent = cartTotal() + ' ₽';
}

function proceedCheckout(){
  if(cartItems().length===0){ toast('Корзина пуста'); return; }
  window.location.href = 'checkout.html';
}

/* --- Checkout --- */
function handleCheckout(e){
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  if(!data.name || !data.phone){ toast('Заполните контактные данные'); return; }
  // Simulate submit
  const order = {items: cartItems(), total: cartTotal(), customer:data, at:new Date().toISOString()};
  localStorage.setItem('ch_last_order', JSON.stringify(order));
  clearCart();
  toast('Заказ оформлен! Мы пришлем подтверждение в Telegram/по SMS.');
  setTimeout(()=> location.href='index.html', 1500);
}

/* --- Auth Tabs --- */
function initAuth(){
  const loginTab = document.getElementById('tab-login');
  const regTab = document.getElementById('tab-register');
  const login = document.getElementById('login'); const reg = document.getElementById('register');
  if(!loginTab) return;
  const activate = (which)=>{
    if(which==='login'){ loginTab.classList.add('btn-primary'); regTab.classList.remove('btn-primary'); login.classList.remove('hidden'); reg.classList.add('hidden'); }
    else { regTab.classList.add('btn-primary'); loginTab.classList.remove('btn-primary'); reg.classList.remove('hidden'); login.classList.add('hidden'); }
  };
  loginTab.onclick=()=>activate('login'); regTab.onclick=()=>activate('reg'); activate('login');
}

/* --- Tiny toast --- */
function toast(msg){
  let t=document.getElementById('toast');
  if(!t){
    t=document.createElement('div'); t.id='toast';
    t.style.position='fixed'; t.style.left='50%'; t.style.bottom='24px'; t.style.transform='translateX(-50%)';
    t.style.background='rgba(43,24,17,.95)'; t.style.color='#fff'; t.style.padding='12px 16px'; t.style.borderRadius='12px';
    t.style.boxShadow='0 8px 24px rgba(0,0,0,.35)'; t.style.zIndex='9999';
    document.body.appendChild(t);
  }
  t.textContent=msg; t.style.opacity='1'; setTimeout(()=>t.style.opacity='0',1400);
}

window.renderMenu = renderMenu;
window.renderCart = renderCart;
window.proceedCheckout = proceedCheckout;
window.handleCheckout = handleCheckout;
window.addToCart = addToCart;
document.addEventListener('DOMContentLoaded', initAuth);

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('nav');
  let overlay = document.querySelector('.nav-overlay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);
  }

  if (toggle && nav && overlay) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      nav.classList.remove('active');
      overlay.classList.remove('active');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        overlay.classList.remove('active');
      });
    });
  }
});
