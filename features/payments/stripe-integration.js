/* ========================================
   STRIPE PAYMENT INTEGRATION
   Complete Stripe Checkout.js implementation
   ======================================== */

/**
 * Stripe Payment Integration
 * Handles payment processing, checkout, and webhooks
 *
 * Features:
 * - Stripe Checkout.js (hosted checkout page)
 * - One-time payments for web design packages
 * - Subscription support (future)
 * - Payment confirmation emails
 * - Webhook handling
 */

class StripeIntegration {
    constructor() {
        this.stripe = null;
        this.isInitialized = false;
        this.publishableKey = null;
    }

    /**
     * Initialize Stripe
     * Loads Stripe.js library and creates instance
     */
    async init() {
        if (this.isInitialized) {
            return this.stripe;
        }

        try {
            // Load Stripe.js from CDN
            await this.loadStripeScript();

            // Get publishable key from config
            this.publishableKey = window.Config?.stripe?.publishableKey || 'pk_test_PLACEHOLDER';

            // Create Stripe instance
            this.stripe = Stripe(this.publishableKey);
            this.isInitialized = true;

            console.log('✅ Stripe initialized');
            return this.stripe;
        } catch (error) {
            console.error('❌ Failed to initialize Stripe:', error);
            throw error;
        }
    }

    /**
     * Load Stripe.js script
     * @returns {Promise<void>}
     */
    loadStripeScript() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (window.Stripe) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Create checkout session for a package
     * @param {Object} packageData - Package information
     * @returns {Promise<void>}
     */
    async checkout(packageData) {
        try {
            // Initialize Stripe if needed
            await this.init();

            // Show loading state
            this.showLoadingState(true);

            // Emit event
            if (window.EventBus) {
                window.EventBus.emit('payment:initiated', packageData);
            }

            // Track analytics
            if (window.Analytics) {
                window.Analytics.trackEvent('Checkout_Initiated', {
                    package_name: packageData.name,
                    package_price: packageData.price,
                    payment_type: packageData.paymentType || 'full'
                });
            }

            // Save quote to database FIRST
            try {
                const saveResponse = await fetch('/api/save-quote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        customerName: packageData.customerName,
                        customerEmail: packageData.email,
                        businessName: packageData.business,
                        phone: packageData.phone,
                        packageName: packageData.name,
                        packagePrice: packageData.price,
                        paymentType: packageData.paymentType || 'full',
                        message: packageData.message,
                        source: 'website'
                    })
                });

                if (saveResponse.ok) {
                    const { quoteId } = await saveResponse.json();
                    console.log('Quote saved with ID:', quoteId);
                } else {
                    console.warn('Failed to save quote, continuing to checkout...');
                }
            } catch (error) {
                console.error('Error saving quote:', error);
                // Continue to checkout even if save fails
            }

            // Create checkout session via API
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    packageName: packageData.name,
                    price: packageData.price,
                    paymentType: packageData.paymentType || 'full',
                    customerEmail: packageData.email,
                    customerName: packageData.customerName,
                    metadata: {
                        business: packageData.business,
                        message: packageData.message,
                        timestamp: new Date().toISOString()
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { sessionId } = await response.json();

            // Redirect to Stripe Checkout
            const { error } = await this.stripe.redirectToCheckout({
                sessionId: sessionId
            });

            if (error) {
                throw error;
            }

        } catch (error) {
            console.error('Checkout error:', error);

            // Show error notification
            if (window.ToastNotification) {
                window.ToastNotification.show(
                    'Payment failed. Please try again or contact support.',
                    'error'
                );
            }

            // Emit error event
            if (window.EventBus) {
                window.EventBus.emit('payment:failed', { error: error.message });
            }

            // Track error
            if (window.Analytics) {
                window.Analytics.trackEvent('Checkout_Failed', {
                    error: error.message
                });
            }

        } finally {
            this.showLoadingState(false);
        }
    }

    /**
     * Create payment link for custom quotes
     * This is useful for post-call proposals
     * @param {Object} quoteData - Quote information
     * @returns {Promise<string>} Payment link URL
     */
    async createPaymentLink(quoteData) {
        try {
            const response = await fetch('/api/create-payment-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quoteData)
            });

            if (!response.ok) {
                throw new Error('Failed to create payment link');
            }

            const { paymentUrl } = await response.json();
            return paymentUrl;

        } catch (error) {
            console.error('Error creating payment link:', error);
            throw error;
        }
    }

    /**
     * Handle payment success
     * Called on success page after redirect from Stripe
     */
    async handleSuccess() {
        // Get session ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (!sessionId) {
            console.error('No session ID found');
            return;
        }

        try {
            // Verify session with backend
            const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
            const sessionData = await response.json();

            if (sessionData.success) {
                // Show success message
                if (window.ToastNotification) {
                    window.ToastNotification.show(
                        'Payment successful! Check your email for confirmation.',
                        'success',
                        8000
                    );
                }

                // Emit success event
                if (window.EventBus) {
                    window.EventBus.emit('payment:success', sessionData);
                }

                // Track conversion
                if (window.Analytics) {
                    window.Analytics.trackFormSubmission({
                        package: sessionData.packageName,
                        price: sessionData.amount,
                        email: sessionData.customerEmail
                    });
                }

                // Update UI
                this.showSuccessUI(sessionData);
            }

        } catch (error) {
            console.error('Error verifying payment:', error);
        }
    }

    /**
     * Show success UI
     * @param {Object} sessionData - Session data from Stripe
     */
    showSuccessUI(sessionData) {
        const container = document.getElementById('payment-success-container');
        if (!container) return;

        container.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✓</div>
                <h1>Payment Successful!</h1>
                <p class="success-message">
                    Thank you for choosing Pegrio! Your ${sessionData.packageName} is confirmed.
                </p>
                <div class="success-details">
                    <div class="detail-item">
                        <span class="detail-label">Order ID:</span>
                        <span class="detail-value">${sessionData.orderId || sessionData.sessionId}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Amount Paid:</span>
                        <span class="detail-value">$${(sessionData.amount / 100).toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${sessionData.customerEmail}</span>
                    </div>
                </div>
                <div class="next-steps">
                    <h2>What's Next?</h2>
                    <ol>
                        <li>Check your email for a detailed receipt and welcome guide</li>
                        <li>Our team will contact you within 24 hours to schedule your kickoff call</li>
                        <li>We'll send you a project questionnaire to gather requirements</li>
                    </ol>
                </div>
                <a href="/" class="btn btn-primary">Back to Home</a>
            </div>
        `;
    }

    /**
     * Show loading state
     * @param {boolean} isLoading - Loading state
     */
    showLoadingState(isLoading) {
        const buttons = document.querySelectorAll('.checkout-button, .btn-checkout');
        buttons.forEach(button => {
            if (isLoading) {
                button.disabled = true;
                button.dataset.originalText = button.textContent;
                button.innerHTML = `
                    <span class="spinner"></span>
                    Processing...
                `;
            } else {
                button.disabled = false;
                button.textContent = button.dataset.originalText || 'Proceed to Payment';
            }
        });
    }

    /**
     * Get checkout button for a package
     * Creates a button that triggers checkout when clicked
     * @param {Object} packageData - Package data
     * @returns {HTMLElement} Button element
     */
    createCheckoutButton(packageData) {
        const button = document.createElement('button');
        button.className = 'btn btn-primary checkout-button';
        button.textContent = `Get ${packageData.name} - $${packageData.price.toLocaleString()}`;
        button.setAttribute('data-package', packageData.id);

        button.addEventListener('click', () => {
            this.checkout(packageData);
        });

        return button;
    }
}

// Create singleton instance
const stripeIntegration = new StripeIntegration();

// Make available globally
if (typeof window !== 'undefined') {
    window.StripeIntegration = stripeIntegration;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = stripeIntegration;
}

/* ========================================
   USAGE EXAMPLES
   ======================================== */

/**
 * Example 1: Checkout from quote form
 *
 * const packageData = {
 *     name: 'Professional Package',
 *     price: 5000,
 *     paymentType: 'full', // or 'deposit'
 *     email: 'customer@example.com',
 *     customerName: 'John Doe',
 *     business: 'John\'s Restaurant',
 *     message: 'Need a website for my restaurant'
 * };
 *
 * StripeIntegration.checkout(packageData);
 */

/**
 * Example 2: Create payment link for custom quote
 *
 * const quoteData = {
 *     customerName: 'Jane Smith',
 *     customerEmail: 'jane@example.com',
 *     amount: 7500,
 *     description: 'Custom Website - Advanced Features',
 *     metadata: {
 *         callDate: '2026-02-20',
 *         features: 'E-commerce, Blog, Custom CMS'
 *     }
 * };
 *
 * const paymentUrl = await StripeIntegration.createPaymentLink(quoteData);
 * // Send this URL in email after discovery call
 */
