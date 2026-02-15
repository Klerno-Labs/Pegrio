/* ===================================
   SHOPPING CART FUNCTIONALITY
   =================================== */

// Menu items database (mock data)
const menuItems = {
    'ramen-1': {
        id: 'ramen-1',
        name: 'Tonkotsu Ramen',
        price: 16.99,
        category: 'ramen',
        description: 'Rich pork bone broth, chashu pork, soft-boiled egg, bamboo shoots',
        image: 'assets/images/tonkotsu-ramen.jpg'
    },
    'sushi-1': {
        id: 'sushi-1',
        name: 'Premium Sushi Platter',
        price: 42.99,
        category: 'sushi',
        description: '12 pieces of chef\'s selection nigiri, 8 pieces maki rolls',
        image: 'assets/images/sushi-platter.jpg'
    },
    'bowl-1': {
        id: 'bowl-1',
        name: 'Chirashi Bowl',
        price: 24.99,
        category: 'bowls',
        description: 'Assorted sashimi over seasoned sushi rice with pickled vegetables',
        image: 'assets/images/chirashi-bowl.jpg'
    },
    'ramen-2': {
        id: 'ramen-2',
        name: 'Spicy Miso Ramen',
        price: 15.99,
        category: 'ramen',
        description: 'Spicy miso broth, ground pork, corn, green onions',
        image: 'assets/images/miso-ramen.jpg'
    },
    'ramen-3': {
        id: 'ramen-3',
        name: 'Shoyu Ramen',
        price: 14.99,
        category: 'ramen',
        description: 'Classic soy sauce broth, chashu, menma, nori',
        image: 'assets/images/shoyu-ramen.jpg'
    },
    'sushi-2': {
        id: 'sushi-2',
        name: 'Salmon Lover Set',
        price: 28.99,
        category: 'sushi',
        description: '6 salmon nigiri, 6 salmon sashimi, salmon roll',
        image: 'assets/images/salmon-set.jpg'
    },
    'sushi-3': {
        id: 'sushi-3',
        name: 'Dragon Roll',
        price: 18.99,
        category: 'sushi',
        description: 'Eel, cucumber, avocado, topped with eel sauce',
        image: 'assets/images/dragon-roll.jpg'
    },
    'appetizer-1': {
        id: 'appetizer-1',
        name: 'Gyoza (6 pieces)',
        price: 7.99,
        category: 'appetizers',
        description: 'Pan-fried pork dumplings with ponzu sauce',
        image: 'assets/images/gyoza.jpg'
    },
    'appetizer-2': {
        id: 'appetizer-2',
        name: 'Edamame',
        price: 5.99,
        category: 'appetizers',
        description: 'Steamed soybeans with sea salt',
        image: 'assets/images/edamame.jpg'
    },
    'appetizer-3': {
        id: 'appetizer-3',
        name: 'Takoyaki (6 pieces)',
        price: 8.99,
        category: 'appetizers',
        description: 'Octopus balls with takoyaki sauce and bonito flakes',
        image: 'assets/images/takoyaki.jpg'
    },
    'dessert-1': {
        id: 'dessert-1',
        name: 'Mochi Ice Cream',
        price: 6.99,
        category: 'desserts',
        description: 'Assorted flavors (3 pieces)',
        image: 'assets/images/mochi.jpg'
    },
    'dessert-2': {
        id: 'dessert-2',
        name: 'Green Tea Cheesecake',
        price: 7.99,
        category: 'desserts',
        description: 'Creamy matcha cheesecake with red bean',
        image: 'assets/images/matcha-cake.jpg'
    },
    'drink-1': {
        id: 'drink-1',
        name: 'Ramune',
        price: 3.99,
        category: 'drinks',
        description: 'Japanese marble soda (Original flavor)',
        image: 'assets/images/ramune.jpg'
    },
    'drink-2': {
        id: 'drink-2',
        name: 'Sake (Hot or Cold)',
        price: 12.99,
        category: 'drinks',
        description: 'Premium sake, 300ml',
        image: 'assets/images/sake.jpg'
    }
};

// Cart class
class ShoppingCart {
    constructor() {
        this.items = storage.get('cart') || [];
        this.updateUI();
    }

    addItem(itemId, quantity = 1) {
        const menuItem = menuItems[itemId];
        if (!menuItem) {
            showNotification('Item not found', 'error');
            return;
        }

        const existingItem = this.items.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...menuItem,
                quantity
            });
        }

        this.save();
        this.updateUI();
        analytics.addToCart(menuItem);
        showNotification(`${menuItem.name} added to cart`, 'success');
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.save();
        this.updateUI();
        showNotification('Item removed from cart', 'info');
    }

    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = quantity;
                this.save();
                this.updateUI();
            }
        }
    }

    clear() {
        this.items = [];
        this.save();
        this.updateUI();
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    getTotalItems() {
        return this.items.reduce((total, item) => {
            return total + item.quantity;
        }, 0);
    }

    save() {
        storage.set('cart', this.items);
    }

    updateUI() {
        // Update cart count
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.getTotalItems();
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Update cart items display
        const cartItemsContainer = document.getElementById('cartItems');
        if (cartItemsContainer) {
            if (this.items.length === 0) {
                cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
            } else {
                cartItemsContainer.innerHTML = this.items.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">${formatCurrency(item.price)}</p>
                            <div class="cart-item-controls">
                                <button class="btn-qty-decrease" data-id="${item.id}">-</button>
                                <span class="cart-item-qty">${item.quantity}</span>
                                <button class="btn-qty-increase" data-id="${item.id}">+</button>
                                <button class="btn-remove" data-id="${item.id}">Remove</button>
                            </div>
                        </div>
                    </div>
                `).join('');

                // Add event listeners
                document.querySelectorAll('.btn-qty-decrease').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemId = e.target.dataset.id;
                        const item = this.items.find(i => i.id === itemId);
                        if (item) {
                            this.updateQuantity(itemId, item.quantity - 1);
                        }
                    });
                });

                document.querySelectorAll('.btn-qty-increase').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemId = e.target.dataset.id;
                        const item = this.items.find(i => i.id === itemId);
                        if (item) {
                            this.updateQuantity(itemId, item.quantity + 1);
                        }
                    });
                });

                document.querySelectorAll('.btn-remove').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemId = e.target.dataset.id;
                        this.removeItem(itemId);
                    });
                });
            }
        }

        // Update cart total
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) {
            cartTotal.textContent = formatCurrency(this.getTotal());
        }
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Add cart item styles
const cartStyles = document.createElement('style');
cartStyles.textContent = `
    .cart-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    .cart-item-image {
        width: 80px;
        height: 80px;
        background-size: cover;
        background-position: center;
        background-color: var(--border-color);
        border-radius: var(--radius-md);
        flex-shrink: 0;
    }

    .cart-item-details {
        flex: 1;
    }

    .cart-item-details h4 {
        font-size: 1rem;
        margin-bottom: 0.25rem;
    }

    .cart-item-price {
        color: var(--primary-color);
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .btn-qty-decrease,
    .btn-qty-increase {
        width: 28px;
        height: 28px;
        border: 1px solid var(--border-color);
        background: white;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
    }

    .btn-qty-decrease:hover,
    .btn-qty-increase:hover {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }

    .cart-item-qty {
        min-width: 30px;
        text-align: center;
        font-weight: 600;
    }

    .btn-remove {
        margin-left: auto;
        padding: 0.25rem 0.75rem;
        background: transparent;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
        color: var(--text-light);
        transition: all 0.2s;
    }

    .btn-remove:hover {
        background: #f44336;
        color: white;
        border-color: #f44336;
    }
`;
document.head.appendChild(cartStyles);

// Export cart instance
window.cart = cart;
window.menuItems = menuItems;
