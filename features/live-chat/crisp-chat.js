/* ========================================
   CRISP LIVE CHAT
   Real-time customer support
   ======================================== */

/**
 * Crisp Chat Integration
 * Live chat widget for customer support
 *
 * Features:
 * - Live chat widget
 * - Offline messages
 * - Custom branding
 * - User identification
 * - Event tracking
 */

class CrispChat {
    constructor() {
        this.websiteId = window.Config?.crisp?.websiteId || '';
        this.isLoaded = false;
    }

    /**
     * Initialize Crisp chat
     */
    async init() {
        if (this.isLoaded || !this.websiteId) {
            return;
        }

        try {
            // Set Crisp configuration
            window.$crisp = [];
            window.CRISP_WEBSITE_ID = this.websiteId;

            // Load Crisp script
            await this.loadCrispScript();

            this.isLoaded = true;
            console.log('✅ Crisp chat initialized');

            // Set up event listeners
            this.setupEventListeners();

        } catch (error) {
            console.error('❌ Failed to initialize Crisp:', error);
        }
    }

    /**
     * Load Crisp script
     */
    loadCrispScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://client.crisp.chat/l.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for chat events
        if (window.$crisp) {
            // Chat opened
            window.$crisp.push(['on', 'chat:opened', () => {
                this.trackEvent('Chat_Opened');
            }]);

            // Chat closed
            window.$crisp.push(['on', 'chat:closed', () => {
                this.trackEvent('Chat_Closed');
            }]);

            // Message sent
            window.$crisp.push(['on', 'message:sent', () => {
                this.trackEvent('Message_Sent');
            }]);

            // Message received
            window.$crisp.push(['on', 'message:received', () => {
                this.trackEvent('Message_Received');
            }]);
        }
    }

    /**
     * Open chat widget
     */
    open() {
        if (window.$crisp) {
            window.$crisp.push(['do', 'chat:open']);
            this.trackEvent('Chat_Opened_Manual');
        }
    }

    /**
     * Close chat widget
     */
    close() {
        if (window.$crisp) {
            window.$crisp.push(['do', 'chat:close']);
        }
    }

    /**
     * Show chat widget
     */
    show() {
        if (window.$crisp) {
            window.$crisp.push(['do', 'chat:show']);
        }
    }

    /**
     * Hide chat widget
     */
    hide() {
        if (window.$crisp) {
            window.$crisp.push(['do', 'chat:hide']);
        }
    }

    /**
     * Set user data (for better support)
     * @param {Object} user - User data
     */
    setUser(user) {
        if (window.$crisp && user) {
            // Set email
            if (user.email) {
                window.$crisp.push(['set', 'user:email', [user.email]]);
            }

            // Set name
            if (user.name) {
                window.$crisp.push(['set', 'user:nickname', [user.name]]);
            }

            // Set custom data
            if (user.company) {
                window.$crisp.push(['set', 'session:data', [[
                    ['company', user.company]
                ]]]);
            }
        }
    }

    /**
     * Send automatic message
     * @param {string} message - Message text
     */
    sendMessage(message) {
        if (window.$crisp) {
            window.$crisp.push(['do', 'message:send', ['text', message]]);
        }
    }

    /**
     * Track event
     * @param {string} eventName - Event name
     */
    trackEvent(eventName) {
        if (window.Analytics) {
            window.Analytics.trackEvent(`Crisp_${eventName}`, {
                event_category: 'live_chat'
            });
        }

        if (window.EventBus) {
            window.EventBus.emit(`crisp:${eventName.toLowerCase()}`);
        }
    }
}

// Create singleton instance
const crispChat = new CrispChat();

// Make available globally
if (typeof window !== 'undefined') {
    window.CrispChat = crispChat;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = crispChat;
}

/* ========================================
   AUTO-INIT
   ======================================== */

// Initialize on page load
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Delay chat load to improve page speed
        setTimeout(() => {
            window.CrispChat?.init();
        }, 2000);
    });
}
