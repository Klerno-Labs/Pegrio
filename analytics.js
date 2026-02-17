/* ========================================
   ANALYTICS & TRACKING SYSTEM
   Professional implementation with privacy compliance
   ======================================== */

const Analytics = {
    initialized: false,

    // Configuration
    config: {
        // Replace with your actual IDs in production
        googleAnalyticsId: 'G-XXXXXXXXXX', // Your GA4 Measurement ID
        facebookPixelId: 'YOUR_PIXEL_ID',   // Your Facebook Pixel ID
        clarityId: 'YOUR_CLARITY_ID',       // Microsoft Clarity ID (optional)

        // Privacy settings
        respectDoNotTrack: true,
        cookieConsent: true, // Set to false if you handle consent elsewhere
    },

    // ========================================
    // INITIALIZATION
    // ========================================

    init() {
        if (this.initialized) return;

        // Check Do Not Track
        if (this.config.respectDoNotTrack && navigator.doNotTrack === '1') {
            console.log('Analytics: Respecting Do Not Track preference');
            return;
        }

        // Initialize Google Analytics 4
        if (this.config.googleAnalyticsId && this.config.googleAnalyticsId !== 'G-XXXXXXXXXX') {
            this.initGoogleAnalytics();
        }

        // Initialize Facebook Pixel
        if (this.config.facebookPixelId && this.config.facebookPixelId !== 'YOUR_PIXEL_ID') {
            this.initFacebookPixel();
        }

        // Initialize Microsoft Clarity
        if (this.config.clarityId && this.config.clarityId !== 'YOUR_CLARITY_ID') {
            this.initClarity();
        }

        // Set up event listeners
        this.setupEventListeners();

        this.initialized = true;
    },

    // ========================================
    // GOOGLE ANALYTICS 4
    // ========================================

    initGoogleAnalytics() {
        // Load gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.googleAnalyticsId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', this.config.googleAnalyticsId, {
            send_page_view: true,
            cookie_flags: 'SameSite=None;Secure'
        });

        console.log('Analytics: Google Analytics 4 initialized');
    },

    // ========================================
    // FACEBOOK PIXEL
    // ========================================

    initFacebookPixel() {
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');

        fbq('init', this.config.facebookPixelId);
        fbq('track', 'PageView');

        console.log('Analytics: Facebook Pixel initialized');
    },

    // ========================================
    // MICROSOFT CLARITY
    // ========================================

    initClarity() {
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", this.config.clarityId);

        console.log('Analytics: Microsoft Clarity initialized');
    },

    // ========================================
    // EVENT TRACKING
    // ========================================

    setupEventListeners() {
        // Track package button clicks
        document.querySelectorAll('[data-package]').forEach(button => {
            button.addEventListener('click', (e) => {
                const packageName = button.dataset.package;
                const packagePrice = button.dataset.price;

                this.trackEvent('Package_Viewed', {
                    package_name: packageName,
                    package_price: packagePrice,
                    currency: 'USD'
                });
            });
        });

        // Track demo site clicks
        document.querySelectorAll('.demo-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const demoName = link.closest('.demo-card')?.querySelector('h3')?.textContent || 'Unknown';

                this.trackEvent('Demo_Clicked', {
                    demo_name: demoName
                });
            });
        });

        // Track CTA button clicks
        document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
            if (!button.dataset.package) { // Don't double-track package buttons
                button.addEventListener('click', () => {
                    this.trackEvent('CTA_Clicked', {
                        button_text: button.textContent.trim(),
                        button_location: this.getButtonLocation(button)
                    });
                });
            }
        });

        // Track scroll depth
        this.trackScrollDepth();

        // Track time on page
        this.trackTimeOnPage();
    },

    // ========================================
    // TRACK CUSTOM EVENTS
    // ========================================

    trackEvent(eventName, parameters = {}) {
        // Google Analytics 4
        if (window.gtag) {
            gtag('event', eventName, parameters);
        }

        // Facebook Pixel
        if (window.fbq) {
            fbq('trackCustom', eventName, parameters);
        }

        // Console log in development
        if (window.location.hostname === 'localhost') {
            console.log('Analytics Event:', eventName, parameters);
        }
    },

    // ========================================
    // CONVERSION TRACKING
    // ========================================

    trackFormSubmission(formData) {
        const conversionData = {
            currency: 'USD',
            value: parseFloat(formData.price.replace(/[^0-9.-]+/g, '')),
            package_name: formData.package,
            payment_type: formData.paymentType
        };

        // Google Analytics conversion
        if (window.gtag) {
            gtag('event', 'generate_lead', {
                ...conversionData,
                event_category: 'engagement',
                event_label: 'Quote Request'
            });
        }

        // Facebook Pixel Lead event
        if (window.fbq) {
            fbq('track', 'Lead', conversionData);
        }
    },

    // ========================================
    // SCROLL DEPTH TRACKING
    // ========================================

    trackScrollDepth() {
        const milestones = [25, 50, 75, 90, 100];
        const reached = new Set();

        window.addEventListener('scroll', () => {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            milestones.forEach(milestone => {
                if (scrollPercentage >= milestone && !reached.has(milestone)) {
                    reached.add(milestone);
                    this.trackEvent('Scroll_Depth', {
                        percentage: milestone,
                        event_category: 'engagement'
                    });
                }
            });
        });
    },

    // ========================================
    // TIME ON PAGE TRACKING
    // ========================================

    trackTimeOnPage() {
        const startTime = Date.now();

        // Track every 30 seconds
        const interval = setInterval(() => {
            const timeOnPage = Math.floor((Date.now() - startTime) / 1000);

            if (timeOnPage % 30 === 0) {
                this.trackEvent('Time_On_Page', {
                    seconds: timeOnPage,
                    event_category: 'engagement'
                });
            }
        }, 30000);

        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            clearInterval(interval);
            const finalTime = Math.floor((Date.now() - startTime) / 1000);
            this.trackEvent('Page_Exit', {
                time_on_page: finalTime,
                event_category: 'engagement'
            });
        });
    },

    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    getButtonLocation(button) {
        const section = button.closest('section, header, footer');
        return section?.id || section?.className || 'unknown';
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Analytics.init());
} else {
    Analytics.init();
}

// Export for use in other scripts
window.Analytics = Analytics;
