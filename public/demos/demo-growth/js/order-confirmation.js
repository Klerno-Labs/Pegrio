// ========================================
// Order Confirmation Page Functionality
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const orderData = JSON.parse(localStorage.getItem('currentOrder'));

    if (!orderData) {
        window.location.href = 'index.html';
        return;
    }

    displayOrderConfirmation(orderData);
    animateTracking();
});

function displayOrderConfirmation(order) {
    // Customer email
    const emailSpan = document.getElementById('customer-email');
    if (emailSpan) {
        emailSpan.textContent = order.customer.email;
    }

    // Order number
    const orderNumberSpan = document.getElementById('order-number');
    if (orderNumberSpan) {
        orderNumberSpan.textContent = order.orderNumber;
    }

    // Fulfillment method
    const fulfillmentSpan = document.getElementById('fulfillment-method');
    if (fulfillmentSpan) {
        fulfillmentSpan.textContent = order.fulfillment === 'delivery' ? '🚗 Delivery' : '🏪 Pickup';
    }

    // Estimated time
    const estimatedTimeSpan = document.getElementById('estimated-time');
    if (estimatedTimeSpan) {
        const minutes = order.fulfillment === 'delivery' ? '30-45' : '15-20';
        estimatedTimeSpan.textContent = `${minutes} minutes`;
    }

    // Delivery address (if applicable)
    if (order.fulfillment === 'delivery' && order.address) {
        const addressSection = document.getElementById('delivery-address-section');
        const addressSpan = document.getElementById('delivery-address');
        if (addressSection && addressSpan) {
            addressSection.style.display = 'block';
            addressSpan.textContent = `${order.address.street}, ${order.address.city}, ${order.address.state} ${order.address.zip}`;
        }
    }

    // Payment method
    const paymentSpan = document.getElementById('payment-method');
    if (paymentSpan) {
        paymentSpan.textContent = order.payment === 'card' ? '💳 Credit/Debit Card' : '💵 Cash';
    }

    // Order items
    const itemsList = document.getElementById('order-items-list');
    if (itemsList) {
        itemsList.innerHTML = order.items.map(item => `
            <div class="order-item">
                <span>${sanitizeHTML(item.name)} × ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }

    // Totals
    document.getElementById('order-subtotal').textContent = `$${order.totals.subtotal.toFixed(2)}`;
    document.getElementById('order-tax').textContent = `$${order.totals.tax.toFixed(2)}`;
    document.getElementById('order-fee').textContent = order.totals.deliveryFee > 0 ? `$${order.totals.deliveryFee.toFixed(2)}` : 'Free';
    document.getElementById('order-total').textContent = `$${order.totals.total.toFixed(2)}`;

    // Fee label
    const feeLabel = document.getElementById('order-fee-label');
    if (feeLabel) {
        feeLabel.textContent = order.fulfillment === 'delivery' ? 'Delivery Fee:' : 'Pickup Fee:';
    }

    // Update tracking for pickup
    if (order.fulfillment === 'pickup') {
        const deliveryStep = document.getElementById('delivery-step');
        if (deliveryStep) {
            deliveryStep.querySelector('.tracking-icon').textContent = '🏪';
            deliveryStep.querySelector('.tracking-label').textContent = 'Ready for Pickup';
        }
    }
}

function animateTracking() {
    const steps = document.querySelectorAll('.tracking-step');

    // Animate preparing step after 2 seconds
    setTimeout(() => {
        steps[2]?.classList.add('active');
    }, 2000);

    // Note: In a real application, you would update this based on actual order status
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}
