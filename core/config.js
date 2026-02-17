/* ========================================
   CONFIGURATION HUB
   Central configuration for all integrations
   ======================================== */

/**
 * Central configuration object for all third-party services and features
 * Load from environment variables in production
 */
const Config = {
    // Environment
    environment: 'development', // 'development' | 'production'

    // Payments (Stripe)
    stripe: {
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_PLACEHOLDER',
        secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_PLACEHOLDER',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_PLACEHOLDER',
    },

    // Database (Supabase)
    supabase: {
        url: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
        anonKey: process.env.SUPABASE_ANON_KEY || 'eyJ_PLACEHOLDER',
        serviceKey: process.env.SUPABASE_SERVICE_KEY || 'eyJ_PLACEHOLDER',
    },

    // Email Marketing (ConvertKit)
    convertkit: {
        apiKey: process.env.CONVERTKIT_API_KEY || '',
        formId: process.env.CONVERTKIT_FORM_ID || '',
        tagId: process.env.CONVERTKIT_TAG_ID || '',
    },

    // Email Delivery (Resend)
    resend: {
        apiKey: process.env.RESEND_API_KEY || '',
        fromEmail: process.env.RESEND_FROM_EMAIL || 'hello@pegrio.com',
    },

    // CRM (HubSpot)
    hubspot: {
        apiKey: process.env.HUBSPOT_API_KEY || '',
        portalId: process.env.HUBSPOT_PORTAL_ID || '',
    },

    // Analytics
    analytics: {
        googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX',
        facebookPixelId: process.env.FACEBOOK_PIXEL_ID || '',
        clarityId: process.env.CLARITY_ID || '',
        hotjarId: process.env.HOTJAR_SITE_ID || '',
    },

    // Error Tracking (Sentry)
    sentry: {
        dsn: process.env.SENTRY_DSN || '',
        environment: process.env.SENTRY_ENVIRONMENT || 'development',
    },

    // Live Chat (Crisp)
    crisp: {
        websiteId: process.env.CRISP_WEBSITE_ID || '',
    },

    // Scheduling (Calendly)
    calendly: {
        username: process.env.CALENDLY_USERNAME || '',
        eventUrl: process.env.CALENDLY_EVENT_URL || '',
    },

    // CDN (Cloudflare)
    cloudflare: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
        streamToken: process.env.CLOUDFLARE_STREAM_TOKEN || '',
    },

    // Feature Flags
    features: {
        enablePayments: true,
        enableChat: true,
        enablePortal: false,  // Not implemented yet
        enableBlog: false,     // Not implemented yet
        enableSubscriptions: false,  // Not implemented yet
        enableAffiliate: false,      // Not implemented yet
        enableWhiteLabel: false,     // Not implemented yet
        enableABTesting: false,      // Not implemented yet
    },

    // App Settings
    app: {
        name: 'Pegrio',
        domain: process.env.DOMAIN || 'pegrio.com',
        supportEmail: process.env.SUPPORT_EMAIL || 'hello@pegrio.com',
        notificationEmail: process.env.NOTIFICATION_EMAIL || 'hello@pegrio.com',
    },

    // API Settings
    api: {
        baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
        timeout: 10000, // 10 seconds
        retries: 3,
    },

    // File Upload Settings
    uploads: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
        allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
    },

    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
    },

    // Session
    session: {
        cookieName: 'pegrio_session',
        cookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },

    // Pricing (for reference)
    pricing: {
        essential: {
            name: 'Essential Package',
            price: 2000,
            currency: 'USD',
        },
        professional: {
            name: 'Professional Package',
            price: 5000,
            currency: 'USD',
        },
        premium: {
            name: 'Premium Package',
            price: 8000,
            currency: 'USD',
        },
    },

    // Subscription Plans (for future use)
    subscriptions: {
        basic: {
            name: 'Basic',
            price: 99,
            interval: 'month',
        },
        pro: {
            name: 'Pro',
            price: 199,
            interval: 'month',
        },
        enterprise: {
            name: 'Enterprise',
            price: 499,
            interval: 'month',
        },
    },
};

// Helper function to check if we're in production
Config.isProduction = () => Config.environment === 'production';

// Helper function to check if we're in development
Config.isDevelopment = () => Config.environment === 'development';

// Helper function to get API endpoint
Config.getApiUrl = (path) => {
    const base = Config.api.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    const cleanPath = path.replace(/^\//, ''); // Remove leading slash
    return `${base}/${cleanPath}`;
};

// Validate required environment variables (call this on app init)
Config.validate = () => {
    const errors = [];

    // Check critical env vars in production
    if (Config.isProduction()) {
        if (!process.env.STRIPE_SECRET_KEY) {
            errors.push('STRIPE_SECRET_KEY is required in production');
        }
        if (!process.env.SUPABASE_URL) {
            errors.push('SUPABASE_URL is required in production');
        }
        if (!process.env.RESEND_API_KEY && !process.env.SENDGRID_API_KEY) {
            errors.push('Either RESEND_API_KEY or SENDGRID_API_KEY is required');
        }
    }

    if (errors.length > 0) {
        console.error('❌ Configuration errors:', errors);
        return false;
    }

    console.log('✅ Configuration validated successfully');
    return true;
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}
