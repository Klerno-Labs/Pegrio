/* ===================================
   CHECKOUT & SQUARE PAYMENT INTEGRATION
   =================================== */

// Configuration
const SQUARE_APPLICATION_ID = 'sandbox-sq0idb-YOUR_APP_ID_HERE'; // Replace with your Square Application ID
const SQUARE_LOCATION_ID = 'YOUR_LOCATION_ID_HERE'; // Replace with your Square Location ID

const TAX_RATE = 0.085; // 8.5%
const DELIVERY_FEE = 4.99;
const POINTS_PER_DOLLAR = 10; // Earn 10 points per dollar spent

// Available promo codes
const PROMO_CODES = {
    'WELCOME10': { discount: 0.10, type: 'percentage' },
    'SAVE5': { discount: 5.00, type: 'fixed' },
    'FIRSTORDER': { discount: 0.15, type: 'percentage' }
};

class Checkout {
    constructor() {
        this.cartItems = cart.items;
        this.subtotal = cart.getTotal();
        this.tax = this.subtotal * TAX_RATE;
        this.deliveryFee = DELIVERY_FEE;
        this.discount = 0;
        this.total = 0;
        this.paymentCard = null;

        this.init();
    }

    init() {
        // Check if cart is empty
        if (this.cartItems.length === 0) {
            window.location.href = 'menu.html';
            return;
        }

        this.renderOrderItems();
        this.calculateTotal();
        this.initializeSquarePayment();
        this.setupEventListeners();
        this.prefillUserData();
        this.updatePointsDisplay();
    }

    renderOrderItems() {
        const checkoutItems = document.getElementById('checkoutItems');
        if (!checkoutItems) return;

        checkoutItems.innerHTML = this.cartItems.map(item => `
            <div class="checkout-item">
                <div class="checkout-item-details">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity} × ${formatCurrency(item.price)}</p>
                </div>
                <div class="checkout-item-price">
                    ${formatCurrency(item.price * item.quantity)}
                </div>
            </div>
        `).join('');
    }

    calculateTotal() {
        this.subtotal = cart.getTotal();
        this.tax = this.subtotal * TAX_RATE;
        this.total = this.subtotal + this.tax + this.deliveryFee - this.discount;

        this.updateSummary();
    }

    updateSummary() {
        document.getElementById('summarySubtotal').textContent = formatCurrency(this.subtotal);
        document.getElementById('summaryTax').textContent = formatCurrency(this.tax);
        document.getElementById('summaryDelivery').textContent = formatCurrency(this.deliveryFee);
        document.getElementById('summaryTotal').textContent = formatCurrency(this.total);
        document.getElementById('payment-amount').textContent = formatCurrency(this.total);

        // Show discount if applied
        if (this.discount > 0) {
            const loyaltySection = document.getElementById('loyaltyPointsSection');
            if (loyaltySection) {
                loyaltySection.style.display = 'flex';
                document.getElementById('loyaltyDiscount').textContent = '-' + formatCurrency(this.discount);
            }
        }
    }

    updatePointsDisplay() {
        if (userSession.isLoggedIn()) {
            const points = Math.floor(this.total * POINTS_PER_DOLLAR);
            const pointsEarned = document.getElementById('pointsEarned');
            if (pointsEarned) {
                pointsEarned.style.display = 'block';
                document.getElementById('pointsAmount').textContent = points;
            }
        }
    }

    async initializeSquarePayment() {
        try {
            // Initialize Square Payments
            if (!window.Square) {
                console.error('Square.js failed to load');
                showNotification('Payment system unavailable. Please try again later.', 'error');
                return;
            }

            const payments = window.Square.payments(SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID);

            // Initialize Card payment method
            this.paymentCard = await payments.card();
            await this.paymentCard.attach('#card-container');

            console.log('Square Payment initialized successfully');
        } catch (error) {
            console.error('Square Payment initialization failed:', error);
            // Show fallback message
            document.getElementById('payment-form').innerHTML = `
                <div class="payment-error">
                    <p>⚠️ Payment system is currently in demo mode.</p>
                    <p>In production, this would use Square's live payment processing.</p>
                    <button id="demo-payment-button" class="btn-primary btn-lg btn-block">
                        Complete Demo Order
                    </button>
                </div>
            `;

            // Setup demo payment button
            document.getElementById('demo-payment-button').addEventListener('click', () => {
                this.processDemoPayment();
            });
        }
    }

    setupEventListeners() {
        // Payment button
        const cardButton = document.getElementById('card-button');
        if (cardButton) {
            cardButton.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.handlePayment();
            });
        }

        // Promo code
        const applyPromoBtn = document.getElementById('applyPromo');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => {
                this.applyPromoCode();
            });
        }
    }

    prefillUserData() {
        if (userSession.isLoggedIn()) {
            const user = userSession.getUser();
            if (user) {
                document.getElementById('firstName').value = user.firstName || '';
                document.getElementById('lastName').value = user.lastName || '';
                document.getElementById('email').value = user.email || '';
                document.getElementById('phone').value = user.phone || '';
                document.getElementById('address').value = user.address || '';
                document.getElementById('city').value = user.city || '';
                document.getElementById('state').value = user.state || '';
                document.getElementById('zipCode').value = user.zipCode || '';
            }
        }
    }

    validateForm() {
        const form = document.getElementById('deliveryForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return false;
        }

        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }

        if (!isValidPhone(phone)) {
            showNotification('Please enter a valid phone number', 'error');
            return false;
        }

        return true;
    }

    async handlePayment() {
        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Rate limiting
        if (!rateLimiter.check('payment')) {
            showNotification('Too many payment attempts. Please try again later.', 'error');
            return;
        }

        // Show loading
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.add('active');

        try {
            // Tokenize card
            const result = await this.paymentCard.tokenize();

            if (result.status === 'OK') {
                // Process payment
                await this.processPayment(result.token);
            } else {
                throw new Error('Card tokenization failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            showNotification('Payment failed. Please try again.', 'error');
        } finally {
            loadingOverlay.classList.remove('active');
        }
    }

    async processPayment(token) {
        // In production, this would make an API call to your backend
        // which would then process the payment with Square's API

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate successful payment
        const orderData = this.getOrderData();
        orderData.paymentToken = token;
        orderData.orderNumber = generateId().toUpperCase().substr(0, 8);
        orderData.timestamp = new Date().toISOString();

        // Save order to user's history
        this.saveOrder(orderData);

        // Award loyalty points
        if (userSession.isLoggedIn()) {
            const points = Math.floor(this.total * POINTS_PER_DOLLAR);
            userSession.addPoints(points);
        }

        // Clear cart
        cart.clear();

        // Track analytics
        analytics.purchase(this.total, this.cartItems);

        // Send confirmation email (mock)
        this.sendConfirmationEmail(orderData);

        // Redirect to confirmation page
        storage.set('lastOrder', orderData);
        window.location.href = 'order-confirmation.html';
    }

    async processDemoPayment() {
        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Show loading
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.add('active');

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const orderData = this.getOrderData();
        orderData.orderNumber = generateId().toUpperCase().substr(0, 8);
        orderData.timestamp = new Date().toISOString();
        orderData.paymentMethod = 'Demo Payment';

        // Save order
        this.saveOrder(orderData);

        // Award points
        if (userSession.isLoggedIn()) {
            const points = Math.floor(this.total * POINTS_PER_DOLLAR);
            userSession.addPoints(points);
        }

        // Clear cart
        cart.clear();

        // Track analytics
        analytics.purchase(this.total, this.cartItems);

        // Redirect
        storage.set('lastOrder', orderData);
        loadingOverlay.classList.remove('active');
        window.location.href = 'order-confirmation.html';
    }

    getOrderData() {
        return {
            items: this.cartItems,
            subtotal: this.subtotal,
            tax: this.tax,
            deliveryFee: this.deliveryFee,
            discount: this.discount,
            total: this.total,
            customer: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: {
                    street: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    zipCode: document.getElementById('zipCode').value
                },
                notes: document.getElementById('deliveryNotes').value
            }
        };
    }

    saveOrder(orderData) {
        const orders = storage.get('orders') || [];
        orders.unshift(orderData);
        storage.set('orders', orders.slice(0, 50)); // Keep last 50 orders
    }

    sendConfirmationEmail(orderData) {
        // Mock email sending
        console.log('Sending confirmation email to:', orderData.customer.email);
        // In production, this would call your backend API
    }

    applyPromoCode() {
        const promoInput = document.getElementById('promoCode');
        const promoMessage = document.getElementById('promoMessage');
        const code = promoInput.value.trim().toUpperCase();

        if (!code) {
            promoMessage.textContent = 'Please enter a promo code';
            promoMessage.className = 'promo-message error';
            return;
        }

        const promo = PROMO_CODES[code];

        if (!promo) {
            promoMessage.textContent = 'Invalid promo code';
            promoMessage.className = 'promo-message error';
            return;
        }

        // Calculate discount
        if (promo.type === 'percentage') {
            this.discount = this.subtotal * promo.discount;
        } else {
            this.discount = promo.discount;
        }

        this.calculateTotal();

        promoMessage.textContent = `Promo code applied! You saved ${formatCurrency(this.discount)}`;
        promoMessage.className = 'promo-message success';

        // Disable promo input
        promoInput.disabled = true;
        document.getElementById('applyPromo').disabled = true;

        showNotification('Promo code applied successfully!', 'success');
        analytics.track('promo_code_applied', { code, discount: this.discount });
    }
}

// Initialize checkout when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new Checkout();
});
