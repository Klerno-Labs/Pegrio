/* ========================================
   CHATBOT CONFIGURATION
   Centralized config for the entire chatbot system
   ======================================== */

const ChatbotConfig = {
    // ========================================
    // CONVERSATION STATES
    // ========================================
    STATES: {
        WELCOME: 'welcome',
        DISCOVERY: 'discovery',
        BUSINESS_PROFILING: 'business_profiling',
        NEEDS_ASSESSMENT: 'needs_assessment',
        BUDGET_DISCUSSION: 'budget_discussion',
        TIMELINE_ASSESSMENT: 'timeline_assessment',
        RECOMMENDATION: 'recommendation',
        OBJECTION_HANDLING: 'objection_handling',
        PACKAGE_DETAILS: 'package_details',
        CLOSING: 'closing',
        SUPPORT: 'support',
        EXIT: 'exit'
    },

    // ========================================
    // BUSINESS TYPES
    // ========================================
    BUSINESS_TYPES: {
        RESTAURANT: 'restaurant',
        SALON: 'salon',
        FITNESS: 'fitness',
        SPA: 'spa',
        CAFE: 'cafe',
        BAR: 'bar',
        RETAIL: 'retail',
        OTHER: 'other'
    },

    // ========================================
    // PACKAGE TYPES
    // ========================================
    PACKAGES: {
        ESSENTIAL: {
            name: 'essential',
            price: 2000,
            displayName: 'Essential',
            features: ['5-page website', 'Mobile-responsive', 'Contact form', 'Google Maps', 'Basic SEO']
        },
        PROFESSIONAL: {
            name: 'professional',
            price: 5000,
            displayName: 'Professional',
            features: ['Everything in Essential', 'AI chatbot', 'Custom design', 'Advanced SEO', 'Instagram feed', 'Reviews display']
        },
        PREMIUM: {
            name: 'premium',
            price: 8000,
            displayName: 'Premium',
            features: ['Everything in Professional', 'Online ordering/booking', 'Customer accounts', 'Admin dashboard', 'Email automation', 'Loyalty program']
        }
    },

    // ========================================
    // BUDGET RANGES
    // ========================================
    BUDGET_RANGES: {
        TIGHT: 'tight',           // <$2,000
        ESSENTIAL: 'essential',   // $2,000-$2,500
        PROFESSIONAL: 'professional', // $3,500-$5,000
        PREMIUM: 'premium',       // $6,000-$8,000
        FLEXIBLE: 'flexible'      // Not price-sensitive
    },

    // ========================================
    // TIMELINE URGENCY
    // ========================================
    TIMELINE_URGENCY: {
        URGENT: 'urgent',         // ASAP, deadline
        SOON: 'soon',             // 2-3 weeks
        FLEXIBLE: 'flexible',     // No rush
        EXPLORING: 'exploring'    // Just looking
    },

    // ========================================
    // LEAD QUALIFICATION LEVELS
    // ========================================
    QUALIFICATION_LEVELS: {
        COLD: 'cold',           // 0-30 points
        WARM: 'warm',           // 31-60 points
        HOT: 'hot',             // 61-85 points
        QUALIFIED: 'qualified'  // 86-100 points
    },

    // ========================================
    // PAIN POINTS
    // ========================================
    PAIN_POINTS: {
        NO_ONLINE_PRESENCE: 'no_online_presence',
        OUTDATED_WEBSITE: 'outdated_website',
        NO_ONLINE_ORDERS: 'no_online_orders',
        NO_BOOKINGS: 'no_bookings',
        LOSING_CUSTOMERS: 'losing_customers',
        NOT_ON_GOOGLE: 'not_on_google',
        LOOKS_UNPROFESSIONAL: 'looks_unprofessional',
        NO_MOBILE_VERSION: 'no_mobile_version',
        CANT_UPDATE_SELF: 'cant_update_self',
        TOO_EXPENSIVE: 'too_expensive'
    },

    // ========================================
    // FEATURES
    // ========================================
    FEATURES: {
        AI_CHATBOT: 'ai',
        ONLINE_ORDERING: 'ordering',
        ONLINE_BOOKING: 'booking',
        SEO: 'seo',
        CUSTOM_DESIGN: 'custom_design',
        MOBILE_APP: 'mobile_app',
        PAYMENT_PROCESSING: 'payments',
        EMAIL_MARKETING: 'email',
        ANALYTICS: 'analytics',
        SOCIAL_MEDIA: 'social'
    },

    // ========================================
    // NLP CONFIGURATION
    // ========================================
    NLP: {
        CONFIDENCE_THRESHOLDS: {
            HIGH: 0.85,     // Direct response
            MEDIUM: 0.60,   // Ask clarification
            LOW: 0.60       // Fallback strategy
        },
        MAX_FALLBACK_COUNT: 3,
        MIN_INPUT_LENGTH: 2,
        MAX_INPUT_LENGTH: 500
    },

    // ========================================
    // SCORING WEIGHTS
    // ========================================
    SCORING: {
        BUSINESS_TYPE: {
            TARGET: 20,      // restaurant, salon, fitness
            OTHER: 10
        },
        BUDGET: {
            PREMIUM: 30,
            PROFESSIONAL: 25,
            ESSENTIAL: 15,
            TIGHT: 5
        },
        TIMELINE: {
            URGENT: 20,
            SOON: 15,
            FLEXIBLE: 10,
            EXPLORING: 5
        },
        DECISION_MAKER: {
            YES: 20,
            INFLUENCER: 10,
            NO: 0
        },
        PAIN_POINT: 2,          // Per pain point
        FEATURE_NEEDED: 5,      // Per feature
        ENGAGEMENT: {
            HIGH_MESSAGE_COUNT: 10,     // 10+ messages
            MEDIUM_MESSAGE_COUNT: 5,    // 5-9 messages
            TIME_SPENT: 5              // 3+ minutes
        }
    },

    // ========================================
    // UI CONFIGURATION
    // ========================================
    UI: {
        CONTAINER_WIDTH: '420px',
        CONTAINER_HEIGHT: '680px',
        BORDER_RADIUS: '24px',
        ANIMATION_DURATION: {
            FAST: 300,      // ms
            NORMAL: 500,
            SLOW: 800
        },
        TYPING_DELAY: {
            MIN: 800,       // ms
            MAX: 1500
        },
        COLORS: {
            PRIMARY: '#667EEA',
            PRIMARY_DARK: '#764BA2',
            BOT_BG: 'rgba(248, 250, 252, 0.95)',
            BOT_TEXT: '#1E293B',
            USER_BG: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
            USER_TEXT: '#FFFFFF'
        }
    },

    // ========================================
    // SESSION CONFIGURATION
    // ========================================
    SESSION: {
        STORAGE_KEY: 'chatbot_session',
        EXPIRY_HOURS: 24,
        SAVE_INTERVAL: 5000 // ms - auto-save every 5 seconds
    },

    // ========================================
    // FORM INTEGRATION
    // ========================================
    FORM: {
        MODAL_ID: 'payment-modal',
        FIELDS: {
            NAME: 'quote-name',
            BUSINESS: 'quote-business',
            EMAIL: 'quote-email',
            PHONE: 'quote-phone',
            MESSAGE: 'quote-message'
        },
        CTA_TRIGGERS: {
            MIN_MESSAGES: 5,
            MIN_LEAD_SCORE: 40,
            REQUIRES_RECOMMENDATION: true
        }
    },

    // ========================================
    // ANALYTICS EVENTS
    // ========================================
    EVENTS: {
        CHAT_OPENED: 'chat_opened',
        CHAT_CLOSED: 'chat_closed',
        MESSAGE_SENT: 'message_sent',
        INTENT_RECOGNIZED: 'intent_recognized',
        LEAD_QUALIFIED: 'lead_qualified',
        PACKAGE_RECOMMENDED: 'package_recommended',
        FORM_OPENED: 'form_opened',
        FORM_SUBMITTED: 'form_submitted'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotConfig;
}
