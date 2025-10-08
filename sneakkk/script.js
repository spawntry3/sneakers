const sliderWrapper = document.querySelector('.slider-wrapper');
const dots = document.querySelectorAll('.dot');

setInterval(() => {
    sliderWrapper?.classList.toggle('slide-active');
    dots.forEach(dot => dot.classList.toggle('active-dot'));
}, 3500);

const sneakers = [
    { id: 1, title: 'Мужские Кроссовки Nike Blazer Mid Suede', price: '12 999', img: 'assets/sneaker-1.png' },
    { id: 2, title: 'Мужские Кроссовки Nike Air Max 270', price: '12 999', img: 'assets/sneaker-2.png' },
    { id: 3, title: 'Мужские Кроссовки Nike Blazer Mid Suede', price: '8 499', img: 'assets/sneaker-3.png' },
    { id: 4, title: 'Кроссовки Puma X Aka Boku Future Rider', price: '8 999', img: 'assets/sneaker-4.png' },
    { id: 5, title: 'Мужские Кроссовки Under Armour Curry 8', price: '15 199', img: 'assets/sneaker-5.png' },
    { id: 6, title: 'Мужские Кроссовки Nike Kyrie 7', price: '11 299', img: 'assets/sneaker-6.png' },
    { id: 7, title: 'Мужские Кроссовки Jordan Air Jordan 11', price: '10 799', img: 'assets/sneaker-7.png' },
    { id: 8, title: 'Мужские Кроссовки Nike LeBron XVIII', price: '16 499', img: 'assets/sneaker-8.png' },
    { id: 9, title: 'Мужские Кроссовки Nike LeBron XVIII Low', price: '13 999', img: 'assets/sneaker-9.png' },
    { id: 10, title: 'Мужские Кроссовки Nike Blazer Mid Suede', price: '8 499', img: 'assets/sneaker-10.png' },
    { id: 11, title: 'Кроссовки Puma X Aka Boku Future Rider', price: '8 999', img: 'assets/sneaker-11.png' },
    { id: 12, title: 'Мужские Кроссовки Nike Kyrie Flytrap IV', price: '11 299', img: 'assets/sneaker-12.png' }
];

const elements = {
    cards: document.querySelector('.cards'),
    searchInput: document.querySelector('.search input'),
    cartOverlay: document.querySelector('.cart-overlay'),
    cartModal: document.querySelector('.cart-modal'),
    cartItemsContainer: document.querySelector('.cart-items'),
    cartTotalEl: document.querySelector('.cart-total'),
    cartTaxEl: document.querySelector('.cart-tax'),
    headerCart: document.querySelector('.right-header2'),
    favSection: document.querySelector('.favorite-cards'),
    notFav: document.querySelector('.not-favorite'),
    favHead: document.querySelector('.favorite-head'),
    balanceEl: document.getElementById('balance'),
};

const getData = key => JSON.parse(localStorage.getItem(key)) || [];
const setData = (key, value) => localStorage.setItem(key, JSON.stringify(value));

let cart = getData('cart');
let favorites = getData('favorites');
let orders = getData('orders');

const openCart = () => {
    elements.cartOverlay?.classList.remove('hidden');
    elements.cartModal?.classList.remove('hidden');
    renderCart();
};
const closeCart = () => {
    elements.cartOverlay?.classList.add('hidden');
    elements.cartModal?.classList.add('hidden');
};

elements.cartOverlay?.addEventListener('click', closeCart);
elements.headerCart?.addEventListener('click', openCart);

const addToCart = product => {
    cart.push(product);
    setData('cart', cart);
    updateCartHeader();
    renderCart();
    renderSneakers(sneakers);
    renderFavorites();
};

const removeFromCart = id => {
    cart = cart.filter(item => item.id !== id);
    setData('cart', cart);
    updateCartHeader();
    renderCart();
    renderSneakers(sneakers);
    renderFavorites();
};

const updateCartHeader = () => {
    if (!elements.balanceEl) return;
    const total = cart.reduce((sum, item) => sum + parseInt(item.price.replace(/\s/g, ''), 10), 0);
    elements.balanceEl.textContent = `${total} тг.`;
};

document.addEventListener('DOMContentLoaded', updateCartHeader);

const renderCart = () => {
    const { cartItemsContainer, cartTotalEl, cartTaxEl } = elements;
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = cart.length
        ? cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price} тг.</div>
                </div>
                <div class="cart-item-remove" onclick="removeFromCart(${item.id})">×</div>
            </div>
        `).join('')
        : '<p class="pusto-cart">Корзина пуста</p>';

    const total = cart.reduce((sum, item) => sum + parseInt(item.price.replace(/\s/g, ''), 10), 0);
    const tax = Math.floor(total * 0.05);
    if (cartTotalEl) cartTotalEl.textContent = `${total} тг.`;
    if (cartTaxEl) cartTaxEl.textContent = `${tax} тг.`;
};

const renderSneakers = (list = []) => {
    const { cards } = elements;
    if (!cards) return;

    cards.innerHTML = list.length
        ? list.map(item => {
            const inFav = favorites.some(f => f.id === item.id);
            const inCart = cart.some(c => c.id === item.id);
            return `
                <div class="card" data-id="${item.id}">
                    <img class="favorite-status" src="assets/${inFav ? 'favorite-plus.svg' : 'favorite-minus.svg'}" alt="favorite">
                    <img src="${item.img}" alt="sneaker">
                    <h1>${item.title}</h1>
                    <div class="card-bottom">
                        <div class="card-info">
                            <span>ЦЕНА:</span>
                            <p>${item.price} тг.</p>
                        </div>
                        <img class="cart-status" src="assets/${inCart ? 'cart-plus.svg' : 'cart-minus.svg'}" alt="cart">
                    </div>
                </div>
            `;
        }).join('')
        : '<div class="not-found">Товар не найден...</div>';
};

const renderFavorites = () => {
    const { favSection, notFav, favHead } = elements;
    if (!favSection) return;

    if (favorites.length === 0) {
        notFav.style.display = '';
        favHead.style.display = 'none';
        favSection.style.display = 'none';
        return;
    }

    notFav.style.display = 'none';
    favHead.style.display = '';
    favSection.style.display = '';
    favSection.innerHTML = favorites.map(item => {
        const inCart = cart.some(c => c.id === item.id);
        return `
            <div class="card" data-id="${item.id}">
                <img class="favorite-status" src="assets/favorite-plus.svg" alt="favorite">
                <img src="${item.img}" alt="sneaker">
                <h1>${item.title}</h1>
                <div class="card-bottom">
                    <div class="card-info">
                        <span>ЦЕНА:</span>
                        <p>${item.price} тг.</p>
                    </div>
                    <img class="cart-status" src="assets/${inCart ? 'cart-plus.svg' : 'cart-minus.svg'}" alt="cart">
                </div>
            </div>
        `;
    }).join('');
};

const renderOrders = () => {
    const ordersContainer = document.querySelector('.orders-container');
    const buysSection = document.querySelector('.buys');
    const buyCards = document.querySelector('.buy-cards');

    if (!ordersContainer || !buyCards) return;

    if (orders.length === 0) {
        ordersContainer.style.display = '';
        buysSection.style.display = 'none';
        return;
    }

    ordersContainer.style.display = 'none';
    buysSection.style.display = '';
    buyCards.innerHTML = orders.map(item => `
        <div class="card" data-id="${item.id}">
            <img src="${item.img}" alt="sneaker">
            <h1>${item.title}</h1>
            <div class="card-bottom">
                <div class="card-info">
                    <span>ЦЕНА:</span>
                    <p>${item.price} тг.</p>
                </div>
            </div>
        </div>
    `).join('');
};

const checkout = () => {
    if (cart.length === 0) return;
    orders = [...orders, ...cart];
    setData('orders', orders);
    cart = [];
    setData('cart', cart);
    updateCartHeader();
    renderCart();
    renderSneakers(sneakers);
    renderFavorites();
    renderOrders();
    closeCart();
};

document.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (e.target.classList.contains('checkout-btn')) checkout();
    if (!card) return;

    const id = Number(card.dataset.id);
    const title = card.querySelector('h1').textContent;
    const price = card.querySelector('.card-info p').textContent.replace(' тг.', '');
    const img = card.querySelector('img:nth-child(2)').src;

    if (e.target.classList.contains('cart-status')) {
        cart.some(item => item.id === id)
            ? removeFromCart(id)
            : addToCart({ id, title, price, img });
    }

    if (e.target.classList.contains('favorite-status')) {
        favorites = favorites.some(item => item.id === id)
            ? favorites.filter(item => item.id !== id)
            : [...favorites, { id, title, price, img }];
        setData('favorites', favorites);
        renderSneakers(sneakers);
        renderFavorites();
    }
});

elements.searchInput?.addEventListener('input', () => {
    const query = elements.searchInput.value.toLowerCase().trim();
    const filtered = sneakers.filter(item => item.title.toLowerCase().includes(query));
    renderSneakers(filtered);
});

renderSneakers(sneakers);
updateCartHeader();
renderCart();
renderFavorites();
renderOrders();


document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('navMenu');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });


    document.addEventListener('click', (event) => {
        if (!navMenu.contains(event.target) && !burger.contains(event.target)) {
            burger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});