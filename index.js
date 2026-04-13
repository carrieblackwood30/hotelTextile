// index.js — логика каталога, фильтры, сортировка, модал, избранное и корзина

// --- Sample product template (you can expand) ---
const products = [
  {
    id: 'p1',
    name: 'Комплект постельного белья "Комфорт"',
    category: 'Постельное белье',
    price: 4200,
    material: 'Хлопок 100%',
    color: 'Белый',
    size: 'King',
    grade: 5,
    rating: 4.8,
    desc: 'Плотный хлопок с сатиновым переплетением, стойкий к стиркам.',
    colorCode: '#ffffff'
  },
  {
    id: 'p2',
    name: 'Полотенце гостиничное 600 г/м²',
    category: 'Полотенца',
    price: 850,
    material: 'Махра',
    color: 'Кремовый',
    size: '70x140',
    grade: 4,
    rating: 4.5,
    desc: 'Высокая впитываемость, быстро сохнет, долго служит.',
    colorCode: '#f6e7d8'
  },
  {
    id: 'p3',
    name: 'Халат для гостей "Люкс"',
    category: 'Халаты',
    price: 3200,
    material: 'Махра',
    color: 'Серый',
    size: 'L',
    grade: 5,
    rating: 4.7,
    desc: 'Мягкий халат с плотной махрой, аккуратная отделка.',
    colorCode: '#d9d9d9'
  },
  {
    id: 'p4',
    name: 'Скатерть для ресторана "Элеганс"',
    category: 'Скатерти',
    price: 2100,
    material: 'Полиэстер',
    color: 'Шоколад',
    size: '150x250',
    grade: 4,
    rating: 4.3,
    desc: 'Практичная ткань, устойчива к пятнам, легко гладится.',
    colorCode: '#6b3f2b'
  },
  {
    id: 'p5',
    name: 'Шторы затемняющие "Ночной комфорт"',
    category: 'Шторы',
    price: 5400,
    material: 'Блэкаут',
    color: 'Бежевый',
    size: '300x270',
    grade: 5,
    rating: 4.9,
    desc: 'Полное затемнение, тепло- и звукоизоляция.',
    colorCode: '#e6d6c6'
  },
  {
    id: 'p6',
    name: 'Наволочка гостиничная 50x70',
    category: 'Постельное белье',
    price: 320,
    material: 'Хлопок 100%',
    color: 'Белый',
    size: '50x70',
    grade: 3,
    rating: 4.1,
    desc: 'Бюджетный вариант для массовых номеров.',
    colorCode: '#ffffff'
  },
  {
    id: 'p7',
    name: 'Покрывало "Уют"',
    category: 'Покрывала',
    price: 2800,
    material: 'Полиэстер',
    color: 'Тёмно-синий',
    size: '200x220',
    grade: 4,
    rating: 4.4,
    desc: 'Износостойкое покрывало с декоративной прострочкой.',
    colorCode: '#1f3b6f'
  },
  {
    id: 'p8',
    name: 'Полотенце для SPA 800 г/м²',
    category: 'Полотенца',
    price: 1200,
    material: 'Махра',
    color: 'Белый',
    size: '90x180',
    grade: 5,
    rating: 4.9,
    desc: 'Премиум плотность, идеальны для SPA и бассейнов.',
    colorCode: '#ffffff'
  }
];

// --- State ---
let state = {
  products,
  filters: {
    categories: new Set(),
    materials: new Set(),
    color: '',
    priceMin: null,
    priceMax: null,
    grade: ''
  },
  sort: 'featured',
  query: '',
  favorites: new Set(JSON.parse(localStorage.getItem('fav') || '[]')),
  cart: JSON.parse(localStorage.getItem('cart') || '[]')
};

// --- DOM refs ---
const productsGrid = document.getElementById('productsGrid');
const resultsInfo = document.getElementById('resultsInfo');
const noResults = document.getElementById('noResults');
const resetBtn = document.getElementById('resetBtn');
const favCount = document.getElementById('favCount');
const cartCount = document.getElementById('cartCount');
const favBtn = document.getElementById('favBtn');
const cartBtn = document.getElementById('cartBtn');

const categoryFilters = document.getElementById('categoryFilters');
const materialFilters = document.getElementById('materialFilters');
const colorFilters = document.getElementById('colorFilters');
const priceMin = document.getElementById('priceMin');
const priceMax = document.getElementById('priceMax');
const gradeFilter = document.getElementById('gradeFilter');
const applyFilters = document.getElementById('applyFilters');
const clearFilters = document.getElementById('clearFilters');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');

const modal = document.getElementById('modal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalCategory = document.getElementById('modalCategory');
const modalDesc = document.getElementById('modalDesc');
const modalMaterial = document.getElementById('modalMaterial');
const modalColor = document.getElementById('modalColor');
const modalSize = document.getElementById('modalSize');
const modalGrade = document.getElementById('modalGrade');
const modalRating = document.getElementById('modalRating');
const modalPrice = document.getElementById('modalPrice');
const addToCartBtn = document.getElementById('addToCart');
const toggleFavBtn = document.getElementById('toggleFav');

// --- Utilities ---
function uniqueValues(key){
  return Array.from(new Set(products.map(p => p[key]))).sort();
}
function formatPrice(n){ return n.toLocaleString('ru-RU') + ' ₸'; }

// --- Render filter chips dynamically ---
function renderFilterChips(){
  categoryFilters.innerHTML = '';
  materialFilters.innerHTML = '';
  colorFilters.innerHTML = '';

  uniqueValues('category').forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = cat;
    btn.dataset.value = cat;
    btn.addEventListener('click', () => {
      toggleSet(state.filters.categories, cat);
      btn.classList.toggle('active');
    });
    categoryFilters.appendChild(btn);
  });

  uniqueValues('material').forEach(mat => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = mat;
    btn.dataset.value = mat;
    btn.addEventListener('click', () => {
      toggleSet(state.filters.materials, mat);
      btn.classList.toggle('active');
    });
    materialFilters.appendChild(btn);
  });

  // color swatches
  const colors = uniqueValues('color');
  colors.forEach(c => {
    const sw = document.createElement('div');
    sw.className = 'swatch';
    sw.title = c;
    const prod = products.find(p => p.color === c);
    sw.style.background = prod ? prod.colorCode : '#ddd';
    sw.addEventListener('click', () => {
      if(state.filters.color === c){ state.filters.color = ''; sw.classList.remove('active'); }
      else {
        // remove active from others
        document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        state.filters.color = c; sw.classList.add('active');
      }
    });
    colorFilters.appendChild(sw);
  });

  // price inputs default
  const prices = products.map(p => p.price);
  priceMin.value = Math.min(...prices);
  priceMax.value = Math.max(...prices);
  state.filters.priceMin = Number(priceMin.value);
  state.filters.priceMax = Number(priceMax.value);
}

// toggle helper for Set
function toggleSet(set, value){
  if(set.has(value)) set.delete(value);
  else set.add(value);
}

// --- Render products ---
function renderProducts(list){
  productsGrid.innerHTML = '';
  if(list.length === 0){
    noResults.hidden = false;
    resultsInfo.textContent = 'Ничего не найдено';
    return;
  }
  noResults.hidden = true;
  resultsInfo.textContent = `Показано ${list.length} товаров`;

  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="product-thumb" style="background: linear-gradient(135deg, ${shade(p.colorCode, -8)}, ${p.colorCode});">
        ${p.name.split(' ').slice(0,2).map(s => s[0]).join('')}
      </div>
      <div class="product-body">
        <h4 class="product-title">${p.name}</h4>
        <div class="product-meta small">${p.category} • ${p.material} • ${p.size}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px">
          <div class="product-price">${formatPrice(p.price)}</div>
          <div class="small muted">⭐ ${p.rating}</div>
        </div>
        <div class="card-actions">
          <button class="btn ghost quick-view" data-id="${p.id}">Быстрый просмотр</button>
          <button class="btn primary add-cart" data-id="${p.id}">В корзину</button>
          <button class="btn ghost fav-toggle" data-id="${p.id}">${state.favorites.has(p.id) ? '❤' : '♡'}</button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  // attach events
  document.querySelectorAll('.quick-view').forEach(b => b.addEventListener('click', e => openModal(e.target.dataset.id)));
  document.querySelectorAll('.add-cart').forEach(b => b.addEventListener('click', e => addToCart(e.target.dataset.id)));
  document.querySelectorAll('.fav-toggle').forEach(b => b.addEventListener('click', e => toggleFav(e.target.dataset.id, e.target)));
}

// --- Filtering & Sorting ---
function applyAllFilters(){
  let list = products.slice();

  // search
  const q = state.query.trim().toLowerCase();
  if(q){
    list = list.filter(p => (p.name + ' ' + p.material + ' ' + p.color + ' ' + p.category).toLowerCase().includes(q));
  }

  // categories
  if(state.filters.categories.size){
    list = list.filter(p => state.filters.categories.has(p.category));
  }

  // materials
  if(state.filters.materials.size){
    list = list.filter(p => state.filters.materials.has(p.material));
  }

  // color
  if(state.filters.color){
    list = list.filter(p => p.color === state.filters.color);
  }

  // price
  const min = Number(state.filters.priceMin) || 0;
  const max = Number(state.filters.priceMax) || Infinity;
  list = list.filter(p => p.price >= min && p.price <= max);

  // grade
  if(state.filters.grade){
    list = list.filter(p => String(p.grade) === String(state.filters.grade));
  }

  // sort
  switch(state.sort){
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'rating-desc': list.sort((a,b)=>b.rating-a.rating); break;
    case 'name-asc': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    default: /* featured keep original order */ break;
  }

  renderProducts(list);
}

// --- Modal ---
let currentModalId = null;
function openModal(id){
  const p = products.find(x => x.id === id);
  if(!p) return;
  currentModalId = id;
  modalTitle.textContent = p.name;
  modalImage.style.background = `linear-gradient(135deg, ${shade(p.colorCode, -8)}, ${p.colorCode})`;
  modalImage.textContent = p.name.split(' ').slice(0,2).map(s => s[0]).join('');
  modalCategory.textContent = p.category;
  modalDesc.textContent = p.desc;
  modalMaterial.textContent = p.material;
  modalColor.textContent = p.color;
  modalSize.textContent = p.size;
  modalGrade.textContent = `${p.grade} ★`;
  modalRating.textContent = p.rating;
  modalPrice.textContent = formatPrice(p.price);
  toggleFavBtn.textContent = state.favorites.has(id) ? '❤ В избранное' : '♡ В избранное';
  modal.setAttribute('aria-hidden', 'false');
  modal.style.display = 'flex';
}
function closeModal(){
  modal.setAttribute('aria-hidden', 'true');
  modal.style.display = 'none';
  currentModalId = null;
}

// --- Cart & Favorites ---
function addToCart(id){
  const item = products.find(p => p.id === id);
  if(!item) return;
  state.cart.push({id:item.id, name:item.name, price:item.price, qty:1});
  localStorage.setItem('cart', JSON.stringify(state.cart));
  updateCounts();
  // simple feedback
  alert(`${item.name} добавлен в корзину`);
}
function toggleFav(id, btnEl){
  if(state.favorites.has(id)) state.favorites.delete(id);
  else state.favorites.add(id);
  localStorage.setItem('fav', JSON.stringify(Array.from(state.favorites)));
  updateCounts();
  if(btnEl) btnEl.textContent = state.favorites.has(id) ? '❤' : '♡';
}
function updateCounts(){
  favCount.textContent = state.favorites.size;
  cartCount.textContent = state.cart.length;
}

// --- Helpers ---
function shade(hex, percent){
  // simple shade for hex color (percent -100..100)
  try{
    const c = hex.replace('#','');
    const num = parseInt(c,16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00FF) + percent;
    let b = (num & 0x0000FF) + percent;
    r = Math.max(0,Math.min(255,r));
    g = Math.max(0,Math.min(255,g));
    b = Math.max(0,Math.min(255,b));
    return '#' + ( (1<<24) + (r<<16) + (g<<8) + b ).toString(16).slice(1);
  }catch(e){
    return hex;
  }
}

// --- Events wiring ---
applyFilters.addEventListener('click', () => {
  state.filters.priceMin = Number(priceMin.value) || 0;
  state.filters.priceMax = Number(priceMax.value) || Infinity;
  state.filters.grade = gradeFilter.value;
  applyAllFilters();
});

clearFilters.addEventListener('click', () => {
  state.filters = { categories: new Set(), materials: new Set(), color: '', priceMin: null, priceMax: null, grade: '' };
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  gradeFilter.value = '';
  renderFilterChips();
  applyAllFilters();
});

sortSelect.addEventListener('change', e => {
  state.sort = e.target.value;
  applyAllFilters();
});

searchInput.addEventListener('input', e => {
  state.query = e.target.value;
  // live search
  applyAllFilters();
});

resetBtn.addEventListener('click', () => {
  state.query = '';
  searchInput.value = '';
  clearFilters.click();
  applyAllFilters();
});

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
toggleFavBtn.addEventListener('click', () => {
  if(!currentModalId) return;
  toggleFav(currentModalId);
  toggleFavBtn.textContent = state.favorites.has(currentModalId) ? '❤ В избранное' : '♡ В избранное';
  // update product card icons
  document.querySelectorAll('.fav-toggle').forEach(b => {
    const id = b.dataset.id;
    b.textContent = state.favorites.has(id) ? '❤' : '♡';
  });
});
addToCartBtn.addEventListener('click', () => {
  if(!currentModalId) return;
  addToCart(currentModalId);
  closeModal();
});

// header buttons
favBtn.addEventListener('click', () => {
  const favList = products.filter(p => state.favorites.has(p.id));
  if(favList.length === 0) { alert('Список избранного пуст'); return; }
  renderProducts(favList);
});
cartBtn.addEventListener('click', () => {
  if(state.cart.length === 0){ alert('Корзина пуста'); return; }
  const total = state.cart.reduce((s,i)=>s+i.price*i.qty,0);
  alert(`В корзине ${state.cart.length} товаров. Общая сумма: ${formatPrice(total)}`);
});

// init
document.getElementById('year').textContent = new Date().getFullYear();
renderFilterChips();
applyAllFilters();
updateCounts();