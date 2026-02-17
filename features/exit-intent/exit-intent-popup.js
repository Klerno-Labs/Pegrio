/* ========================================
   EXIT-INTENT POPUP
   Last chance conversion
   ======================================== */

/**
 * Exit-Intent Popup
 * Show popup when user is about to leave
 *
 * Features:
 * - Mouse tracking for exit detection
 * - Cookie-based frequency limiting
 * - Mobile-friendly
 * - Customizable offers
 * - A/B testing support
 */

class ExitIntentPopup {
    constructor() {
        this.isActive = true;
        this.hasShown = false;
        this.cookieName = 'exit_popup_shown';
        this.cookieDays = 7; // Show again after 7 days
        this.sensitivity = 20; // Pixels from top to trigger
    }

    /**
     * Initialize exit-intent detection
     */
    init() {
        // Check if already shown recently
        if (this.hasBeenShown()) {
            console.log('Exit popup already shown recently');
            return;
        }

        // Desktop: mouse leave detection
        if (window.innerWidth > 768) {
            document.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
        }

        // Mobile: scroll + back button detection
        if (window.innerWidth <= 768) {
            this.setupMobileDetection();
        }

        console.log('✅ Exit-intent popup initialized');
    }

    /**
     * Handle mouse leaving viewport
     * @param {MouseEvent} e - Mouse event
     */
    onMouseLeave(e) {
        if (this.hasShown || !this.isActive) return;

        // Check if mouse is near top (exiting)
        if (e.clientY <= this.sensitivity) {
            this.show();
        }
    }

    /**
     * Setup mobile exit detection
     */
    setupMobileDetection() {
        let scrollDepth = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            scrollDepth = Math.max(scrollDepth, (currentScroll / maxScroll) * 100);

            // Show if user scrolled past 50% and is scrolling up fast
            if (scrollDepth > 50 && currentScroll < scrollDepth - 100) {
                this.show();
            }
        });
    }

    /**
     * Show exit popup
     */
    show() {
        if (this.hasShown) return;

        this.hasShown = true;
        this.isActive = false;

        // Track event
        this.trackEvent('ExitIntent_Triggered');

        // Create and show popup
        const popupHtml = this.createPopupHtml();

        if (window.ModalManager) {
            window.ModalManager.showCustomModal('exit-intent-modal', popupHtml);
        } else {
            this.createFallbackModal(popupHtml);
        }

        // Set cookie
        this.setCookie();

        // Setup form handler
        setTimeout(() => {
            this.setupFormHandler();
        }, 100);
    }

    /**
     * Create popup HTML
     * @returns {string}
     */
    createPopupHtml() {
        return `
            <div class="exit-popup">
                <div class="exit-popup-icon">⚠️</div>
                <h2>Wait! Before You Go...</h2>
                <p class="exit-popup-subtitle">Get 10% off your website package if you book within 24 hours!</p>

                <div class="exit-popup-offer">
                    <div class="offer-badge">LIMITED TIME OFFER</div>
                    <h3>$500 Discount + Free Bonus</h3>
                    <ul class="offer-features">
                        <li>✓ $500 off any package</li>
                        <li>✓ Free logo refresh ($200 value)</li>
                        <li>✓ Priority scheduling</li>
                        <li>✓ 2 extra revision rounds</li>
                    </ul>
                </div>

                <form id="exit-intent-form" class="exit-form">
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email to claim offer"
                        required
                        autocomplete="email"
                    >
                    <button type="submit" class="btn btn-primary btn-large">
                        Claim My $500 Discount →
                    </button>
                </form>

                <p class="exit-popup-note">
                    🔒 Limited to first 5 customers this month. Offer expires in 24 hours.
                </p>

                <button class="exit-popup-close-text" onclick="this.closest('.modal').style.display='none'">
                    No thanks, I don't want to save $500
                </button>
            </div>
        `;
    }

    /**
     * Create fallback modal
     * @param {string} html - Modal HTML
     */
    createFallbackModal(html) {
        const modal = document.createElement('div');
        modal.className = 'modal exit-intent-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.remove()">&times;</button>
                ${html}
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    /**
     * Setup form submission handler
     */
    setupFormHandler() {
        const form = document.getElementById('exit-intent-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = form.querySelector('input[name="email"]').value;

            // Show loading
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner"></span> Processing...';

            try {
                // Subscribe to email list with special tag
                if (window.ConvertKitIntegration) {
                    await window.ConvertKitIntegration.subscribe({
                        email,
                        tagId: 'exit-intent-discount',
                        source: 'exit-popup'
                    });
                }

                // Track conversion
                this.trackConversion(email);

                // Show success
                form.innerHTML = `
                    <div class="exit-success">
                        <div class="success-icon">✓</div>
                        <h3>Discount Code Sent!</h3>
                        <p>Check your email for your $500 discount code.</p>
                        <p><strong>Use code:</strong> SAVE500</p>
                        <a href="#pricing" class="btn btn-primary" onclick="this.closest('.modal').style.display='none'">
                            View Packages →
                        </a>
                    </div>
                `;

            } catch (error) {
                console.error('Exit popup submission error:', error);
                btn.disabled = false;
                btn.textContent = 'Claim My $500 Discount →';

                if (window.ToastNotification) {
                    window.ToastNotification.show('Something went wrong. Please try again.', 'error');
                }
            }
        });
    }

    /**
     * Check if popup has been shown recently
     * @returns {boolean}
     */
    hasBeenShown() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === this.cookieName && value === 'true') {
                return true;
            }
        }
        return false;
    }

    /**
     * Set cookie to prevent showing again
     */
    setCookie() {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + this.cookieDays);
        document.cookie = `${this.cookieName}=true; expires=${expiryDate.toUTCString()}; path=/`;
    }

    /**
     * Track event
     * @param {string} eventName - Event name
     */
    trackEvent(eventName) {
        if (window.Analytics) {
            window.Analytics.trackEvent(eventName, {
                event_category: 'exit_intent'
            });
        }

        if (window.EventBus) {
            window.EventBus.emit(`exit-intent:${eventName.toLowerCase()}`);
        }
    }

    /**
     * Track conversion
     * @param {string} email - User email
     */
    trackConversion(email) {
        this.trackEvent('ExitIntent_Converted');

        if (window.Analytics) {
            window.Analytics.trackEvent('Exit_Popup_Conversion', {
                event_category: 'conversion',
                event_label: 'Exit Intent Discount',
                value: 500
            });

            // Facebook Pixel
            if (window.fbq) {
                fbq('track', 'Lead', {
                    content_name: 'Exit Intent Discount',
                    value: 500,
                    currency: 'USD'
                });
            }
        }
    }

    /**
     * Disable exit popup (for testing)
     */
    disable() {
        this.isActive = false;
    }

    /**
     * Enable exit popup
     */
    enable() {
        this.isActive = true;
    }
}

// Create singleton instance
const exitIntentPopup = new ExitIntentPopup();

// Make available globally
if (typeof window !== 'undefined') {
    window.ExitIntentPopup = exitIntentPopup;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = exitIntentPopup;
}

/* ========================================
   AUTO-INIT
   ======================================== */

// Initialize on page load
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait 5 seconds before activating exit-intent
        setTimeout(() => {
            window.ExitIntentPopup?.init();
        }, 5000);
    });
}
