// ========================================
// Cart Page Functionality
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateSummary();

    // Fulfillment method change
    const fulfillmentRadios = document.querySelectorAll('input[name="fulfillment"]');
    fulfillmentRadios.forEach(radio => {
        radio.addEventListener('change', updateSummary);
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartManager.getCart().length === 0) {
                cartManager.showToast('Your cart is empty!', 'error');
                return;
            }
            const fulfillment = document.querySelector('input[name="fulfillment"]:checked').value;
            localStorage.setItem('fulfillmentMethod', fulfillment);
            window.location.href = 'checkout.html';
        });
    }
});

function renderCart() {
    const container = document.getElementById('cart-container');
    const emptyCart = document.getElementById('empty-cart');
    const cart = cartManager.getCart();

    if (!container) return;

    if (cart.length === 0) {
        container.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    emptyCart.style.display = 'none';

    container.innerHTML = cart.map(item => createCartItemHTML(item)).join('');

    // Add event listeners
    container.querySelectorAll('.quantity-decrease').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemName = e.target.dataset.item;
            const item = cart.find(i => i.name === itemName);
            if (item && item.quantity > 1) {
                cartManager.updateQuantity(itemName, item.quantity - 1);
                renderCart();
                updateSummary();
            }
        });
    });

    container.querySelectorAll('.quantity-increase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemName = e.target.dataset.item;
            const item = cart.find(i => i.name === itemName);
            if (item) {
                cartManager.updateQuantity(itemName, item.quantity + 1);
                renderCart();
                updateSummary();
            }
        });
    });

    container.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemName = e.target.dataset.item;
            if (confirm(`Remove ${itemName} from cart?`)) {
                cartManager.removeItem(itemName);
                renderCart();
                updateSummary();
                cartManager.showToast('Item removed from cart', 'success');
            }
        });
    });
}

function createCartItemHTML(item) {
    const emojis = {
        'Butter Chicken': '🍛',
        'Chicken Tikka Masala': '🍛',
        'Lamb Rogan Josh': '🍛',
        'Palak Paneer': '🍛',
        'Chana Masala': '🍛',
        'Chicken Biryani': '🍚',
        'Lamb Biryani': '🍚',
        'Vegetable Biryani': '🍚',
        'Hyderabadi Biryani': '🍚',
        'Tandoori Chicken': '🍗',
        'Chicken Tikka': '🍗',
        'Paneer Tikka': '🧀',
        'Butter Naan': '🫓',
        'Garlic Naan': '🫓',
        'Samosa (2 pcs)': '🥟'
    };

    const emoji = emojis[item.name] || '🍽️';

    return `
        <div class="cart-item">
            <div class="cart-item-image" style="background: linear-gradient(135deg, #C95D3F 0%, #E6A834 100%);">
                ${emoji}
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${sanitizeHTML(item.name)}</h3>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-decrease" data-item="${sanitizeHTML(item.name)}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-increase" data-item="${sanitizeHTML(item.name)}">+</button>
                    </div>
                    <button class="remove-item" data-item="${sanitizeHTML(item.name)}">Remove</button>
                </div>
            </div>
            <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary-color);">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `;
}

function updateSummary() {
    const subtotal = cartManager.getTotal();
    const tax = cartManager.getTax();
    const fulfillmentMethod = document.querySelector('input[name="fulfillment"]:checked')?.value || 'delivery';
    const deliveryFee = fulfillmentMethod === 'delivery' ? 4.99 : 0;
    const total = subtotal + tax + deliveryFee;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('delivery-fee').textContent = deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free';
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}
