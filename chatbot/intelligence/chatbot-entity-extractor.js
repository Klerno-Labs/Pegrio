/* ========================================
   ENTITY EXTRACTOR
   Extract structured data from user messages
   ======================================== */

const ChatbotEntityExtractor = {
    // ========================================
    // BUSINESS TYPE EXTRACTION
    // ========================================
    extractBusinessType(text) {
        const lower = text.toLowerCase();

        // Restaurant keywords
        const restaurantKeywords = [
            'restaurant', 'bistro', 'cafe', 'diner', 'eatery', 'food', 'dining',
            'pizza', 'burger', 'sushi', 'mexican', 'italian', 'chinese', 'thai',
            'taco', 'burrito', 'sandwich', 'grill', 'kitchen', 'chef'
        ];

        // Salon/Beauty keywords
        const salonKeywords = [
            'salon', 'spa', 'beauty', 'hair', 'barber', 'stylist', 'nails',
            'manicure', 'pedicure', 'facial', 'massage', 'aesthetics', 'cosmetic'
        ];

        // Fitness keywords
        const fitnessKeywords = [
            'gym', 'fitness', 'yoga', 'pilates', 'crossfit', 'training', 'workout',
            'exercise', 'wellness', 'health club', 'studio', 'personal training'
        ];

        // Cafe keywords (specific to cafe, not general restaurant)
        const cafeKeywords = [
            'cafe', 'coffee shop', 'coffee house', 'espresso', 'latte', 'cappuccino'
        ];

        // Bar keywords
        const barKeywords = [
            'bar', 'pub', 'tavern', 'brewery', 'cocktail', 'nightclub', 'lounge'
        ];

        // Check in order of specificity
        if (cafeKeywords.some(keyword => lower.includes(keyword))) {
            return ChatbotConfig.BUSINESS_TYPES.CAFE;
        }
        if (salonKeywords.some(keyword => lower.includes(keyword))) {
            return ChatbotConfig.BUSINESS_TYPES.SALON;
        }
        if (fitnessKeywords.some(keyword => lower.includes(keyword))) {
            return ChatbotConfig.BUSINESS_TYPES.FITNESS;
        }
        if (barKeywords.some(keyword => lower.includes(keyword))) {
            return ChatbotConfig.BUSINESS_TYPES.BAR;
        }
        if (restaurantKeywords.some(keyword => lower.includes(keyword))) {
            return ChatbotConfig.BUSINESS_TYPES.RESTAURANT;
        }

        return null;
    },

    // ========================================
    // BUSINESS NAME EXTRACTION
    // ========================================
    extractBusinessName(text) {
        const lower = text.toLowerCase();

        // Pattern: "my [business] is called [name]"
        const calledPattern = /(?:called|named)\s+([a-z0-9\s'-]+)/i;
        let match = text.match(calledPattern);
        if (match) {
            return this.capitalizeBusinessName(match[1].trim());
        }

        // Pattern: "i own [name]"
        const ownPattern = /(?:own|have|run|operate)\s+([a-z0-9\s'-]+?)(?:\s+(?:restaurant|salon|gym|spa|cafe|bar|bistro))/i;
        match = text.match(ownPattern);
        if (match) {
            return this.capitalizeBusinessName(match[1].trim());
        }

        // Pattern: "[name] restaurant/salon/gym"
        const prefixPattern = /^([a-z0-9\s'-]+?)\s+(?:restaurant|salon|gym|spa|cafe|bar|bistro|fitness)/i;
        match = text.match(prefixPattern);
        if (match) {
            return this.capitalizeBusinessName(match[1].trim());
        }

        return null;
    },

    capitalizeBusinessName(name) {
        return name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    },

    // ========================================
    // BUDGET EXTRACTION
    // ========================================
    extractBudgetRange(text) {
        const lower = text.toLowerCase();

        // Extract dollar amounts - check specific patterns
        const amounts = [];

        // Pattern 1: $5000 or $5,000
        const dollarMatch = text.match(/\$\s*(\d{1,3}(?:,\d{3})*|\d+)/g);
        if (dollarMatch) {
            dollarMatch.forEach(m => {
                const num = parseInt(m.replace(/[$,\s]/g, ''), 10);
                if (!Number.isNaN(num) && num >= 100) {
                    amounts.push(num);
                }
            });
        }

        // Pattern 2: 5k or 5K
        const kMatch = text.match(/(\d+)k/gi);
        if (kMatch) {
            kMatch.forEach(m => {
                const num = parseInt(m.replace(/k/gi, ''), 10) * 1000;
                if (!Number.isNaN(num) && num >= 100) {
                    amounts.push(num);
                }
            });
        }

        // Pattern 3: "around 5000" or "spend 5000"
        const contextMatch = text.match(/(?:around|about|spend|budget|afford)\s+\$?\s*(\d{3,})/gi);
        if (contextMatch) {
            contextMatch.forEach(m => {
                const numMatch = m.match(/(\d{3,})/);
                if (numMatch) {
                    const num = parseInt(numMatch[1], 10);
                    if (!Number.isNaN(num) && num >= 100) {
                        amounts.push(num);
                    }
                }
            });
        }

        if (amounts.length > 0) {
            const maxAmount = Math.max(...amounts);

            // Categorize budget
            if (maxAmount < 2000) {
                return ChatbotConfig.BUDGET_RANGES.TIGHT;
            } else if (maxAmount < 2500) {
                return ChatbotConfig.BUDGET_RANGES.ESSENTIAL;
            } else if (maxAmount < 6000) {
                return ChatbotConfig.BUDGET_RANGES.PROFESSIONAL;
            } else {
                return ChatbotConfig.BUDGET_RANGES.PREMIUM;
            }
        }

        // Keywords for budget sensitivity
        const tightKeywords = [
            'tight budget', 'limited budget', 'small budget', 'low budget',
            'cheap', 'cheaper', 'affordable', 'minimum', 'basic', 'under 2'
        ];

        const flexibleKeywords = [
            'flexible', 'no limit', 'whatever it takes', 'worth it', 'invest',
            'not concerned', 'money is not an issue', 'quality matters'
        ];

        if (tightKeywords.some(keyword => lower.includes(keyword))) {
            return ChatbotConfig.BUDGET_RANGES.TIGHT;
        }

        if (flexibleKeywords.some(keyword => lower.includes(keyword))) {
            return ChatbotConfig.BUDGET_RANGES.FLEXIBLE;
        }

        return null;
    },

    // ========================================
    // TIMELINE/URGENCY EXTRACTION
    // ========================================
    extractTimelineUrgency(text) {
        const lower = text.toLowerCase();

        // Urgent keywords
        const urgentKeywords = [
            'asap', 'urgent', 'urgently', 'rush', 'immediately', 'now',
            'yesterday', 'right away', 'as soon as possible'
        ];

        // Soon keywords
        const soonKeywords = [
            '2 weeks', '3 weeks', '2-3 weeks', 'soon', 'quickly', 'fast'
        ];

        // Flexible keywords
        const flexibleKeywords = [
            'no rush', 'whenever', 'flexible', 'no hurry', 'take your time'
        ];

        // Exploring keywords
        const exploringKeywords = [
            'just looking', 'just browsing', 'exploring', 'researching',
            'checking out', 'considering'
        ];

        if (urgentKeywords.some(keyword => lower.includes(keyword))) {
            return ChatbotConfig.TIMELINE_URGENCY.URGENT;
        }

        if (soonKeywords.some(keyword => lower.includes(keyword))) {
            return ChatbotConfig.TIMELINE_URGENCY.SOON;
        }

        if (flexibleKeywords.some(keyword => lower.includes(keyword))) {
            return ChatbotConfig.TIMELINE_URGENCY.FLEXIBLE;
        }

        if (exploringKeywords.some(keyword => lower.includes(keyword))) {
            return ChatbotConfig.TIMELINE_URGENCY.EXPLORING;
        }

        return null;
    },

    // ========================================
    // FEATURES EXTRACTION
    // ========================================
    extractFeaturesNeeded(text) {
        const lower = text.toLowerCase();
        const features = [];

        // AI Chatbot
        const aiKeywords = ['ai', 'chatbot', 'bot', 'virtual assistant', 'automation'];
        if (aiKeywords.some(keyword => lower.includes(keyword))) {
            features.push(ChatbotConfig.FEATURES.AI_CHATBOT);
        }

        // Online Ordering
        const orderingKeywords = [
            'online ordering', 'order online', 'delivery', 'takeout', 'pickup',
            'doordash', 'uber eats', 'grubhub', 'food ordering'
        ];
        if (orderingKeywords.some(keyword => lower.includes(keyword))) {
            features.push(ChatbotConfig.FEATURES.ONLINE_ORDERING);
        }

        // Online Booking
        const bookingKeywords = [
            'online booking', 'book online', 'appointment', 'reservation',
            'schedule', 'calendar', 'booking system'
        ];
        if (bookingKeywords.some(keyword => lower.includes(keyword))) {
            features.push(ChatbotConfig.FEATURES.ONLINE_BOOKING);
        }

        // SEO
        const seoKeywords = [
            'seo', 'search engine', 'google', 'ranking', 'found online',
            'search results', 'visibility', 'organic traffic'
        ];
        if (seoKeywords.some(keyword => lower.includes(keyword))) {
            features.push(ChatbotConfig.FEATURES.SEO);
        }

        // Custom Design
        const designKeywords = [
            'custom design', 'unique design', 'tailored', 'personalized',
            'brand', 'not a template'
        ];
        if (designKeywords.some(keyword => lower.includes(keyword))) {
            features.push(ChatbotConfig.FEATURES.CUSTOM_DESIGN);
        }

        // Payment Processing
        const paymentKeywords = [
            'payment', 'credit card', 'stripe', 'square', 'paypal', 'checkout'
        ];
        if (paymentKeywords.some(keyword => lower.includes(keyword))) {
            features.push(ChatbotConfig.FEATURES.PAYMENT_PROCESSING);
        }

        // Email Marketing
        const emailKeywords = [
            'email', 'newsletter', 'mailchimp', 'email marketing', 'campaign'
        ];
        if (emailKeywords.some(keyword => lower.includes(keyword))) {
            features.push(ChatbotConfig.FEATURES.EMAIL_MARKETING);
        }

        return ChatbotUtils.uniqueArray(features);
    },

    // ========================================
    // PAIN POINTS EXTRACTION
    // ========================================
    extractPainPoints(text) {
        const lower = text.toLowerCase();
        const painPoints = [];

        // No online presence
        const noPresenceKeywords = [
            'no website', 'don\'t have a website', 'no online presence',
            'not online', 'no web presence'
        ];
        if (noPresenceKeywords.some(keyword => lower.includes(keyword))) {
            painPoints.push(ChatbotConfig.PAIN_POINTS.NO_ONLINE_PRESENCE);
        }

        // Outdated website
        const outdatedKeywords = [
            'outdated', 'old website', 'looks old', 'ancient', 'from 2010',
            'needs updating', 'terrible', 'ugly'
        ];
        if (outdatedKeywords.some(keyword => lower.includes(keyword))) {
            painPoints.push(ChatbotConfig.PAIN_POINTS.OUTDATED_WEBSITE);
        }

        // No online orders
        const noOrdersKeywords = [
            'no online ordering', 'can\'t order online', 'need ordering',
            'want online orders', 'delivery problem'
        ];
        if (noOrdersKeywords.some(keyword => lower.includes(keyword))) {
            painPoints.push(ChatbotConfig.PAIN_POINTS.NO_ONLINE_ORDERS);
        }

        // No bookings
        const noBookingsKeywords = [
            'no online booking', 'can\'t book online', 'need booking',
            'want online appointments', 'reservation problem'
        ];
        if (noBookingsKeywords.some(keyword => lower.includes(keyword))) {
            painPoints.push(ChatbotConfig.PAIN_POINTS.NO_BOOKINGS);
        }

        // Losing customers
        const losingCustomersKeywords = [
            'losing customers', 'losing business', 'customers go elsewhere',
            'competitor winning', 'miss out'
        ];
        if (losingCustomersKeywords.some(keyword => lower.includes(keyword))) {
            painPoints.push(ChatbotConfig.PAIN_POINTS.LOSING_CUSTOMERS);
        }

        // Not on Google
        const notOnGoogleKeywords = [
            'not on google', 'can\'t find me', 'not showing up', 'no ranking',
            'not visible'
        ];
        if (notOnGoogleKeywords.some(keyword => lower.includes(keyword))) {
            painPoints.push(ChatbotConfig.PAIN_POINTS.NOT_ON_GOOGLE);
        }

        // Looks unprofessional
        const unprofessionalKeywords = [
            'unprofessional', 'looks bad', 'embarrassing', 'amateur', 'cheap looking'
        ];
        if (unprofessionalKeywords.some(keyword => lower.includes(keyword))) {
            painPoints.push(ChatbotConfig.PAIN_POINTS.LOOKS_UNPROFESSIONAL);
        }

        // No mobile version
        const noMobileKeywords = [
            'no mobile', 'not mobile friendly', 'doesn\'t work on phone',
            'mobile version', 'not responsive'
        ];
        if (noMobileKeywords.some(keyword => lower.includes(keyword))) {
            painPoints.push(ChatbotConfig.PAIN_POINTS.NO_MOBILE_VERSION);
        }

        // Can't update self
        const cantUpdateKeywords = [
            'can\'t update', 'can\'t change', 'locked', 'pay someone to update',
            'need developer'
        ];
        if (cantUpdateKeywords.some(keyword => lower.includes(keyword))) {
            painPoints.push(ChatbotConfig.PAIN_POINTS.CANT_UPDATE_SELF);
        }

        return ChatbotUtils.uniqueArray(painPoints);
    },

    // ========================================
    // DECISION MAKER STATUS
    // ========================================
    extractDecisionMakerStatus(text) {
        const lower = text.toLowerCase();

        // Owner/decision maker keywords
        const ownerKeywords = [
            'i\'m the owner', 'i own', 'i run', 'i manage', 'i decide',
            'my business', 'my restaurant', 'my salon', 'my gym',
            'it\'s up to me', 'my decision', 'i\'m in charge'
        ];

        // Needs approval keywords
        const approvalKeywords = [
            'need to ask', 'check with', 'talk to my partner', 'ask my boss',
            'not the decision maker', 'need approval', 'permission', 'my boss decides'
        ];

        // Influencer keywords
        const influencerKeywords = [
            'i recommend', 'i\'m helping', 'looking for my boss', 'for someone else',
            'evaluating options'
        ];

        if (ownerKeywords.some(keyword => lower.includes(keyword))) {
            return true; // Decision maker
        }

        if (approvalKeywords.some(keyword => lower.includes(keyword))) {
            return false; // Not decision maker
        }

        if (influencerKeywords.some(keyword => lower.includes(keyword))) {
            return 'influencer'; // Influencer but not decision maker
        }

        return null; // Unknown
    },

    // ========================================
    // EMAIL EXTRACTION
    // ========================================
    extractEmail(text) {
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
        const match = text.match(emailRegex);
        return match ? match[1] : null;
    },

    // ========================================
    // PHONE EXTRACTION
    // ========================================
    extractPhone(text) {
        // Match various phone formats
        const phoneRegex = /(\+?1?\s*\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/;
        const match = text.match(phoneRegex);
        return match ? match[1] : null;
    },

    // ========================================
    // EXTRACT ALL ENTITIES
    // ========================================
    extractAll(text) {
        return {
            businessType: this.extractBusinessType(text),
            businessName: this.extractBusinessName(text),
            budgetRange: this.extractBudgetRange(text),
            timelineUrgency: this.extractTimelineUrgency(text),
            featuresNeeded: this.extractFeaturesNeeded(text),
            painPoints: this.extractPainPoints(text),
            isDecisionMaker: this.extractDecisionMakerStatus(text),
            email: this.extractEmail(text),
            phone: this.extractPhone(text)
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotEntityExtractor;
}
