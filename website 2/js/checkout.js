// ========================================
// Checkout Page Functionality
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Load cart summary
    renderCheckoutSummary();

    // Load saved fulfillment method
    const savedFulfillment = localStorage.getItem('fulfillmentMethod') || 'delivery';
    const fulfillmentRadio = document.querySelector(`input[name="fulfillment"][value="${savedFulfillment}"]`);
    if (fulfillmentRadio) {
        fulfillmentRadio.checked = true;
        toggleDeliverySection(savedFulfillment);
    }

    // Fulfillment method listeners
    const fulfillmentRadios = document.querySelectorAll('input[name="fulfillment"]');
    fulfillmentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            toggleDeliverySection(e.target.value);
            updateCheckoutSummary();
        });
    });

    // Payment method listeners
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            toggleCardDetails(e.target.value);
        });
    });

    // Form submission
    const form = document.getElementById('checkout-form');
    if (form) {
        form.addEventListener('submit', handleCheckoutSubmit);
    }

    // Card formatting
    setupCardFormatting();
});

function renderCheckoutSummary() {
    const cart = cartManager.getCart();
    const summaryItems = document.getElementById('summary-items');

    if (summaryItems) {
        summaryItems.innerHTML = cart.map(item => `
            <div class="summary-item">
                <span>${sanitizeHTML(item.name)} × ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }

    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    const subtotal = cartManager.getTotal();
    const tax = cartManager.getTax();
    const fulfillmentMethod = document.querySelector('input[name="fulfillment"]:checked')?.value || 'delivery';
    const deliveryFee = fulfillmentMethod === 'delivery' ? 4.99 : 0;
    const total = subtotal + tax + deliveryFee;

    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkout-fee').textContent = deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free';
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('fee-label').textContent = fulfillmentMethod === 'delivery' ? 'Delivery Fee:' : 'Pickup Fee:';
}

function toggleDeliverySection(fulfillmentMethod) {
    const deliverySection = document.getElementById('delivery-section');
    if (deliverySection) {
        if (fulfillmentMethod === 'delivery') {
            deliverySection.style.display = 'block';
            // Make fields required
            deliverySection.querySelectorAll('input').forEach(input => {
                input.required = true;
            });
        } else {
            deliverySection.style.display = 'none';
            // Remove required attribute
            deliverySection.querySelectorAll('input').forEach(input => {
                input.required = false;
            });
        }
    }
}

function toggleCardDetails(paymentMethod) {
    const cardDetails = document.getElementById('card-details');
    if (cardDetails) {
        if (paymentMethod === 'card') {
            cardDetails.style.display = 'block';
            cardDetails.querySelectorAll('input').forEach(input => {
                input.required = true;
            });
        } else {
            cardDetails.style.display = 'none';
            cardDetails.querySelectorAll('input').forEach(input => {
                input.required = false;
            });
        }
    }
}

function setupCardFormatting() {
    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCvc = document.getElementById('card-cvc');

    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value.substring(0, 19);
        });
    }

    if (cardExpiry) {
        cardExpiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    if (cardCvc) {
        cardCvc.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }
}

function handleCheckoutSubmit(e) {
    e.preventDefault();

    // Validate cart
    if (cartManager.getCart().length === 0) {
        cartManager.showToast('Your cart is empty!', 'error');
        return;
    }

    // Get form data
    const formData = new FormData(e.target);
    const orderData = {
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        fulfillment: formData.get('fulfillment'),
        payment: formData.get('payment'),
        items: cartManager.getCart(),
        totals: {
            subtotal: cartManager.getTotal(),
            tax: cartManager.getTax(),
            deliveryFee: formData.get('fulfillment') === 'delivery' ? 4.99 : 0,
            total: cartManager.getTotal() + cartManager.getTax() + (formData.get('fulfillment') === 'delivery' ? 4.99 : 0)
        },
        timestamp: new Date().toISOString(),
        orderNumber: generateOrderNumber()
    };

    // Add delivery address if delivery
    if (formData.get('fulfillment') === 'delivery') {
        orderData.address = {
            street: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip'),
            instructions: formData.get('deliveryInstructions')
        };
    }

    // Add special instructions
    orderData.specialInstructions = formData.get('specialInstructions');

    // Save order
    localStorage.setItem('currentOrder', JSON.stringify(orderData));

    // Clear cart
    cartManager.clearCart();

    // Redirect to confirmation
    window.location.href = 'order-confirmation.html';
}

function generateOrderNumber() {
    const date = new Date();
    const random = Math.floor(Math.random() * 10000);
    return `LC${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${String(random).padStart(4, '0')}`;
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}
