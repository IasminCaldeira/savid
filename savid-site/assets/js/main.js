/* ============================================
   SAVID AROMATICS — Core JS
   Header/Footer injection, cart, product rendering.
   ============================================ */

/* ---------- Header & Footer (injected on every page) ---------- */
const HEADER_HTML = `
<header class="site-header">
  <div class="header-inner">
    <button class="menu-toggle" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
    <a href="index.html" class="brand"><img src="assets/logo.png" alt="Savid Aromatics"></a>
    <nav class="main-nav">
      <a href="produtos.html" data-nav="produtos">PRODUTOS</a>
      <a href="kits.html" data-nav="kits">KITS</a>
      <a href="sobre.html" data-nav="sobre">SOBRE NÓS</a>
    </nav>
    <div class="search">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="text" placeholder="Digite aqui">
    </div>
    <div class="header-icons">
      <a href="#" aria-label="Favoritos"><i class="fa-regular fa-heart"></i></a>
      <a href="carrinho.html" aria-label="Carrinho">
        <i class="fa-solid fa-bag-shopping"></i>
        <span class="cart-count" data-cart-count>0</span>
      </a>
      <a href="usuario.html" aria-label="Minha conta"><i class="fa-regular fa-user"></i></a>
    </div>
  </div>
</header>`;

const FOOTER_HTML = `
<section class="social">
  <p>Siga a SAVID</p>
  <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
  <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
  <a href="#" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
</section>
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-col">
      <h4>Institucional</h4>
      <ul>
        <li><a href="sobre.html">Nossa História</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <ul>
        <li><a href="#">Ajuda e contato</a></li>
        <li><a href="#">Política de Entrega e Devolução</a></li>
        <li><a href="#">Central de trocas e devoluções</a></li>
        <li><a href="#">Parcerias e Eventos</a></li>
      </ul>
    </div>
    <div class="footer-brand">
      <img src="assets/logo.png" alt="Savid Aromatics">
      <div class="pay">
        <i class="fa-brands fa-cc-amex"></i>
        <i class="fa-brands fa-cc-diners-club"></i>
        <i class="fa-brands fa-cc-mastercard"></i>
        <i class="fa-brands fa-cc-visa"></i>
        <i class="fa-solid fa-money-bill-wave"></i>
      </div>
    </div>
  </div>
  <p class="copyright">
    © Copyright Savid Aromatics 2026 · Todos os direitos reservados Savid Indústria e Comércio de Aromas LTDA<br>
    CNPJ: 12.345.678/0001-99 | Avenida Tancredo Neves, 1200, Sala 501 – Caminho das Árvores · Salvador – BA | CEP: 41820-020
  </p>
</footer>`;

function mountChrome(){
  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if(h) h.outerHTML = HEADER_HTML;
  if(f) f.outerHTML = FOOTER_HTML;
  // mark active nav
  const page = document.body.dataset.page;
  if(page){
    const link = document.querySelector(`[data-nav="${page}"]`);
    if(link) link.classList.add('active');
  }
  refreshCartCount();
}

/* ---------- Utils ---------- */
const BRL = n => 'R$ ' + Number(n).toFixed(2).replace('.', ',');

/* ---------- Cart (localStorage) ---------- */
const CART_KEY = 'savid_cart_v1';
function getCart(){ try{return JSON.parse(localStorage.getItem(CART_KEY))||[]}catch(e){return[]} }
function setCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); refreshCartCount(); }
function addToCart(id, qty=1){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(item) item.qty += qty; else cart.push({id, qty});
  setCart(cart);
  toast('Produto adicionado ao carrinho');
}
function removeFromCart(id){ setCart(getCart().filter(i=>i.id!==id)); }
function setCartQty(id, qty){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty = Math.max(1, qty);
  setCart(cart);
}
function refreshCartCount(){
  const count = getCart().reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('[data-cart-count]').forEach(el=>{
    el.textContent = count;
    el.style.display = count>0 ? 'flex' : 'none';
  });
}
function findProduct(id){ return (window.SAVID_PRODUCTS||[]).find(p=>p.id===id); }

/* ---------- Toast ---------- */
function toast(msg){
  let t = document.getElementById('savid-toast');
  if(!t){ t = document.createElement('div'); t.id='savid-toast';
    Object.assign(t.style,{position:'fixed',bottom:'24px',right:'24px',background:'#1a1a1a',color:'#fff',padding:'12px 18px',borderRadius:'4px',fontSize:'13px',zIndex:9999,opacity:'0',transition:'opacity .3s'});
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.opacity='1';
  clearTimeout(t._h); t._h = setTimeout(()=>t.style.opacity='0', 1800);
}

/* ---------- Product Card Renderer ---------- */
function productCardHTML(p){
  // GERADOR DE AVALIAÇÕES ALTAS EXCLUSIVAS (Acima de 230)
  // Usa o ID e o Nome do produto para criar um número único e fixo para cada vela
  const s = String(p.id) + (p.nome || '');
  let hash = 0;
  for (let i = 0; i < s.length; i++) { hash = s.charCodeAt(i) + ((hash << 5) - hash); }
  const numeroAvaliacoes = Math.abs(hash % 220) + 230; // Gera números variados entre 230 e 450

  return `
    <article class="product-card">
      <button class="fav" aria-label="Favoritar"><i class="fa-regular fa-heart"></i></button>
      <a class="product-link" href="produto.html?id=${encodeURIComponent(p.id)}">
        <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
      </a>
      <div class="product-info">
        <div class="product-rating" style="font-size: 11px; color: #c9a84c; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
          <div class="stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
          <span style="color: #6b6b6b;">(${numeroAvaliacoes} avaliações)</span>
        </div>
        
        <a class="product-link" href="produto.html?id=${encodeURIComponent(p.id)}">
          <p class="product-name">${p.nome}</p>
        </a>
        <div class="product-price">${BRL(p.preco)}</div>
        <button class="btn-add" data-add="${p.id}"><i class="fa-solid fa-bag-shopping"></i> Adicionar</button>
      </div>
    </article>`;
}
function renderProducts(selector, filterFn){
  const el = document.querySelector(selector); if(!el) return;
  const list = (window.SAVID_PRODUCTS||[]).filter(filterFn);
  el.innerHTML = list.map(productCardHTML).join('');
  el.querySelectorAll('[data-add]').forEach(b=>{
    b.addEventListener('click', e=>{ e.preventDefault(); addToCart(b.dataset.add); });
  });
  el.querySelectorAll('.fav').forEach(b=>{
    b.addEventListener('click', e=>{ e.preventDefault(); b.querySelector('i').classList.toggle('fa-solid'); b.querySelector('i').classList.toggle('fa-regular'); });
  });
  const total = document.querySelector('[data-total]');
  if(total) total.textContent = `Total de ${list.length} produtos`;
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', mountChrome);
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.querySelector(".main-nav");

    // Verifica se os elementos existem na página antes de rodar
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", function () {
            // Liga/Desliga a classe 'active' no menu ao clicar
            mainNav.classList.toggle("active");
        });
    }
});