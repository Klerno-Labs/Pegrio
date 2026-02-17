/* ========================================
   CONVERTKIT EMAIL MARKETING
   Automated email sequences
   ======================================== */

/**
 * ConvertKit Integration
 * Email marketing automation for lead nurturing
 *
 * Features:
 * - Subscribe to forms
 * - Add tags
 * - Trigger sequences
 * - Track subscriber events
 */

class ConvertKitIntegration {
    constructor() {
        this.apiKey = window.Config?.convertkit?.apiKey || '';
        this.formId = window.Config?.convertkit?.formId || '';
        this.isConfigured = !!(this.apiKey && this.formId);
    }

    /**
     * Subscribe email to ConvertKit form
     * @param {Object} data - Subscriber data
     * @returns {Promise<Object>}
     */
    async subscribe(data) {
        if (!this.isConfigured) {
            console.warn('⚠️  ConvertKit not configured');
            return { success: false, message: 'Email service not configured' };
        }

        try {
            const response = await fetch('/api/subscribe-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email,
                    firstName: data.firstName || data.name?.split(' ')[0],
                    lastName: data.lastName || data.name?.split(' ').slice(1).join(' '),
                    tagId: data.tagId,
                    leadMagnet: data.leadMagnet,
                    source: data.source || 'website'
                })
            });

            if (!response.ok) {
                throw new Error('Subscription failed');
            }

            const result = await response.json();

            // Track event
            this.trackEvent('Subscribed', {
                email: data.email,
                source: data.source
            });

            return { success: true, data: result };

        } catch (error) {
            console.error('ConvertKit subscription error:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * Track event
     * @param {string} eventName - Event name
     * @param {Object} data - Event data
     */
    trackEvent(eventName, data = {}) {
        if (window.Analytics) {
            window.Analytics.trackEvent(`ConvertKit_${eventName}`, {
                event_category: 'email_marketing',
                ...data
            });
        }

        if (window.EventBus) {
            window.EventBus.emit(`convertkit:${eventName.toLowerCase()}`, data);
        }
    }
}

// Create singleton instance
const convertKitIntegration = new ConvertKitIntegration();

// Make available globally
if (typeof window !== 'undefined') {
    window.ConvertKitIntegration = convertKitIntegration;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = convertKitIntegration;
}
