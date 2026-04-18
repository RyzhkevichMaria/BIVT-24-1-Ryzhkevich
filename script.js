function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

let cart = [];

const productsDB = [
    { id: 1, name: "Apple iPhone SE (2016) 128 ГБ", price: 15990, category: "smartphones" },
    { id: 2, name: "POCO X3 Pro 128 ГБ", price: 19990, category: "smartphones" },
    { id: 3, name: "Ноутбук MSI Katana 17 HX", price: 89990, category: "laptops" }
];

const calculateTotal = () => {
    let total = 0;
    cart.forEach(item => total += item.price);
    return total;
};

const renderCart = () => {
    const cartContainer = document.getElementById('dynamic-cart');
    if (!cartContainer) return;

    let html = `<h3> Ваша корзина</h3>`;

    if (cart.length === 0) {
        html += `<p style="text-align:center; color:#5624ab;">Корзина пуста. Добавьте товары из каталога.</p>`;
    } else {
        html += `<ul id="cart-list">`;
        cart.forEach((item, index) => {
            html += `
                <li>
                    <span>${item.name} — <b>${item.price} ₽</b></span>
                    <button class="remove-btn" data-index="${index}">✕ Удалить</button>
                </li>
            `;
        });
        html += `</ul>`;

        html += `
            <div class="cart-total-block">
                <strong>Итого: <span id="cart-total">${calculateTotal()}</span> ₽</strong>
            </div>
            <div class="cart-actions">
                <button id="clear-cart-btn" class="cart-action-btn">Очистить корзину</button>
                <button id="pay-btn" class="cart-action-btn"> Оплатить</button>
            </div>
        `;
    }

    cartContainer.innerHTML = html;
    attachCartEvents();
};

const attachCartEvents = () => {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            renderCart();
            saveCartToLocalStorage();
        });
    });

    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            cart = [];
            renderCart();
            saveCartToLocalStorage();
            alert(' Корзина очищена!');
        });
    }

    const payBtn = document.getElementById('pay-btn');
    if (payBtn) {
        payBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert(' Корзина пуста! Добавьте товары для оплаты.');
            } else {
                const sum = calculateTotal();
                alert(` Оплата прошла успешно!\nСумма: ${sum} ₽\nСпасибо за покупку!`);
                cart = [];
                renderCart();
                saveCartToLocalStorage();
            }
        });
    }
};

const filterProducts = (category) => {
    const items = document.querySelectorAll('.product-item');
    
    items.forEach(item => {
        const itemCategory = item.dataset.category;
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }

    const filterContainer = document.getElementById('filter-container');
    if (filterContainer) {
        filterContainer.innerHTML = `
            <div class="filter-wrapper">
                <label for="category-filter">Фильтр по категории:</label>
                <select id="category-filter">
                    <option value="all">Все товары</option>
                    <option value="smartphones">Смартфоны</option>
                    <option value="laptops">Ноутбуки</option>
                </select>
            </div>
        `;

        document.getElementById('category-filter').addEventListener('change', (e) => {
            filterProducts(e.target.value);
        });
    }

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = Number(e.target.dataset.id);
            const product = productsDB.find(p => p.id === productId);
            
            if (product) {
                cart.push(product);
                renderCart();
                saveCartToLocalStorage();
                alert(` "${product.name}" добавлен в корзину!`);
            }
        });
    });

    renderCart();
});