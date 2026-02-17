/* ========================================
   CALENDLY APPOINTMENT SCHEDULING
   Discovery call booking system
   ======================================== */

/**
 * Calendly Integration for Discovery Calls
 *
 * Features:
 * - Inline widget embedding
 * - Popup widget for CTAs
 * - Pre-filled user information
 * - Event tracking
 * - Custom styling to match brand
 */

class CalendlyIntegration {
    constructor() {
        this.isLoaded = false;
        this.calendlyUrl = null;
    }

    /**
     * Initialize Calendly
     * Load Calendly widget library
     */
    async init() {
        if (this.isLoaded) {
            return;
        }

        try {
            // Get Calendly URL from config
            this.calendlyUrl = window.Config?.calendly?.eventUrl ||
                             'https://calendly.com/your-username/discovery-call';

            // Load Calendly widget script
            await this.loadCalendlyScript();

            // Load Calendly CSS
            this.loadCalendlyStyles();

            this.isLoaded = true;
            console.log('✅ Calendly initialized');

        } catch (error) {
            console.error('❌ Failed to initialize Calendly:', error);
            throw error;
        }
    }

    /**
     * Load Calendly widget script
     * @returns {Promise<void>}
     */
    loadCalendlyScript() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (window.Calendly) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Load Calendly styles
     */
    loadCalendlyStyles() {
        if (document.querySelector('link[href*="calendly"]')) {
            return; // Already loaded
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://assets.calendly.com/assets/external/widget.css';
        document.head.appendChild(link);
    }

    /**
     * Open Calendly popup
     * @param {Object} options - Pre-fill options
     */
    async openPopup(options = {}) {
        await this.init();

        // Pre-fill data
        const prefill = {
            name: options.name || '',
            email: options.email || '',
            customAnswers: {
                a1: options.business || '',        // Question 1: Business name
                a2: options.packageInterest || ''  // Question 2: Package interest
            }
        };

        // UTM parameters for tracking
        const utm = {
            utmSource: options.source || 'website',
            utmMedium: options.medium || 'cta',
            utmCampaign: options.campaign || 'discovery-call'
        };

        // Open popup
        window.Calendly.initPopupWidget({
            url: this.calendlyUrl,
            prefill: prefill,
            utm: utm
        });

        // Track event
        this.trackEvent('Popup_Opened', options);

        // Listen for events
        this.setupEventListeners();
    }

    /**
     * Embed Calendly inline in a container
     * @param {string|HTMLElement} container - Container element or selector
     * @param {Object} options - Pre-fill options
     */
    async embedInline(container, options = {}) {
        await this.init();

        const element = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!element) {
            console.error('Calendly container not found');
            return;
        }

        // Pre-fill data
        const prefill = {
            name: options.name || '',
            email: options.email || '',
            customAnswers: {
                a1: options.business || '',
                a2: options.packageInterest || ''
            }
        };

        // UTM parameters
        const utm = {
            utmSource: options.source || 'website',
            utmMedium: options.medium || 'inline',
            utmCampaign: options.campaign || 'discovery-call'
        };

        // Initialize inline widget
        window.Calendly.initInlineWidget({
            url: this.calendlyUrl,
            parentElement: element,
            prefill: prefill,
            utm: utm
        });

        // Track event
        this.trackEvent('Inline_Widget_Loaded', options);

        // Listen for events
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for Calendly events
     */
    setupEventListeners() {
        if (this.listenersAdded) return;

        window.addEventListener('message', (e) => {
            if (e.origin !== 'https://calendly.com') return;

            const data = e.data;

            // Event scheduled
            if (data.event === 'calendly.event_scheduled') {
                this.onEventScheduled(data.payload);
            }

            // Date and time selected
            if (data.event === 'calendly.date_and_time_selected') {
                this.onDateTimeSelected(data.payload);
            }

            // Event type viewed
            if (data.event === 'calendly.event_type_viewed') {
                this.onEventTypeViewed(data.payload);
            }

            // Profile page viewed
            if (data.event === 'calendly.profile_page_viewed') {
                this.onProfilePageViewed(data.payload);
            }
        });

        this.listenersAdded = true;
    }

    /**
     * Handle event scheduled
     * @param {Object} payload - Event data
     */
    onEventScheduled(payload) {
        console.log('📅 Discovery call scheduled!', payload);

        // Show success notification
        if (window.ToastNotification) {
            window.ToastNotification.show(
                'Discovery call scheduled! Check your email for confirmation.',
                'success',
                8000
            );
        }

        // Emit event for other modules
        if (window.EventBus) {
            window.EventBus.emit('appointment:scheduled', {
                eventUri: payload.event.uri,
                inviteeUri: payload.invitee.uri
            });
        }

        // Track conversion
        this.trackEvent('Discovery_Call_Scheduled', {
            eventUri: payload.event.uri
        });

        // Track analytics conversion
        if (window.Analytics) {
            window.Analytics.trackEvent('Appointment_Booked', {
                event_category: 'conversion',
                event_label: 'Discovery Call',
                value: 1
            });
        }

        // Show next steps
        this.showNextSteps();
    }

    /**
     * Handle date/time selection
     * @param {Object} payload - Event data
     */
    onDateTimeSelected(payload) {
        console.log('📅 Date/time selected:', payload);

        this.trackEvent('DateTime_Selected', {
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Handle event type viewed
     * @param {Object} payload - Event data
     */
    onEventTypeViewed(payload) {
        console.log('👀 Event type viewed');

        this.trackEvent('EventType_Viewed', {});
    }

    /**
     * Handle profile page viewed
     * @param {Object} payload - Event data
     */
    onProfilePageViewed(payload) {
        console.log('👀 Profile page viewed');
    }

    /**
     * Show next steps after booking
     */
    showNextSteps() {
        // Close modal if open
        const modal = document.querySelector('.calendly-overlay');
        if (modal) {
            setTimeout(() => {
                modal.style.display = 'none';
            }, 2000);
        }

        // Show custom next steps message
        const message = `
            <div class="next-steps-notification">
                <h3>🎉 Your Discovery Call is Scheduled!</h3>
                <p><strong>What to expect:</strong></p>
                <ul>
                    <li>You'll receive a calendar invite via email</li>
                    <li>We'll discuss your vision, goals, and requirements</li>
                    <li>We'll answer all your questions about the process</li>
                    <li>We'll create a custom proposal tailored to your needs</li>
                </ul>
                <p><strong>Prepare for the call:</strong></p>
                <ul>
                    <li>Think about your must-have features</li>
                    <li>Gather examples of websites you love</li>
                    <li>Have your brand colors/logo ready (if available)</li>
                </ul>
                <p>Looking forward to speaking with you!</p>
            </div>
        `;

        if (window.ModalManager) {
            window.ModalManager.showCustomModal('next-steps-modal', message);
        }
    }

    /**
     * Track event
     * @param {string} eventName - Event name
     * @param {Object} data - Event data
     */
    trackEvent(eventName, data = {}) {
        if (window.Analytics) {
            window.Analytics.trackEvent(`Calendly_${eventName}`, {
                event_category: 'scheduling',
                ...data
            });
        }

        if (window.EventBus) {
            window.EventBus.emit(`calendly:${eventName.toLowerCase()}`, data);
        }
    }

    /**
     * Create "Schedule Call" button
     * @param {Object} options - Button options
     * @returns {HTMLElement} Button element
     */
    createButton(options = {}) {
        const button = document.createElement('button');
        button.className = options.className || 'btn btn-primary calendly-button';
        button.textContent = options.text || 'Schedule Discovery Call';
        button.setAttribute('aria-label', 'Schedule a discovery call');

        button.addEventListener('click', () => {
            this.openPopup({
                name: options.name,
                email: options.email,
                business: options.business,
                packageInterest: options.package,
                source: options.source || 'button',
                medium: options.medium || 'click'
            });
        });

        return button;
    }

    /**
     * Add "Schedule Call" badge to existing buttons
     * Enhances existing CTAs with scheduling capability
     */
    enhanceExistingButtons() {
        // Find all "Get Started" / "Contact" buttons
        const buttons = document.querySelectorAll('[data-action="schedule-call"]');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                // Get pre-fill data from button attributes
                const options = {
                    package: button.dataset.package,
                    source: button.dataset.source || 'hero',
                    medium: 'button'
                };

                this.openPopup(options);
            });
        });
    }
}

// Create singleton instance
const calendlyIntegration = new CalendlyIntegration();

// Make available globally
if (typeof window !== 'undefined') {
    window.CalendlyIntegration = calendlyIntegration;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = calendlyIntegration;
}

/* ========================================
   USAGE EXAMPLES
   ======================================== */

/**
 * Example 1: Open popup from button click
 *
 * <button onclick="CalendlyIntegration.openPopup({ package: 'Professional' })">
 *     Schedule Discovery Call
 * </button>
 */

/**
 * Example 2: Embed inline widget
 *
 * <div id="calendly-embed"></div>
 * <script>
 *   CalendlyIntegration.embedInline('#calendly-embed');
 * </script>
 */

/**
 * Example 3: Create button programmatically
 *
 * const button = CalendlyIntegration.createButton({
 *     text: 'Book Your Free Consultation',
 *     package: 'Essential',
 *     source: 'pricing-table'
 * });
 * document.querySelector('.cta-container').appendChild(button);
 */

/**
 * Example 4: Pre-fill with form data
 *
 * CalendlyIntegration.openPopup({
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     business: 'John\'s Restaurant',
 *     packageInterest: 'Professional Package - $5,000'
 * });
 */
