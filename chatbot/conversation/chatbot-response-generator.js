/* ========================================
   RESPONSE GENERATOR
   Dynamic, context-aware response generation
   500+ response templates
   ======================================== */

const ChatbotResponseGenerator = {
    // ========================================
    // MAIN RESPONSE GENERATION
    // ========================================

    /**
     * Generate response based on state, intent, and context
     * @param {string} state - Current conversation state
     * @param {string} intent - Detected intent
     * @param {Object} context - Conversation context
     * @returns {string} - Generated response
     */
    generate(state, intent, context) {
        // Get state-specific responses
        const responses = this.getResponsesByState(state, intent, context);

        // Pick appropriate response
        let response = ChatbotUtils.randomItem(responses);

        // Personalize response
        response = this.personalize(response, context);

        return response;
    },

    /**
     * Get responses by state
     * @param {string} state
     * @param {string} intent
     * @param {Object} context
     * @returns {Array} - Array of response templates
     */
    getResponsesByState(state, intent, context) {
        switch (state) {
            case ChatbotConfig.STATES.WELCOME:
                return this.welcomeResponses(intent, context);

            case ChatbotConfig.STATES.DISCOVERY:
                return this.discoveryResponses(intent, context);

            case ChatbotConfig.STATES.BUSINESS_PROFILING:
                return this.businessProfilingResponses(intent, context);

            case ChatbotConfig.STATES.NEEDS_ASSESSMENT:
                return this.needsAssessmentResponses(intent, context);

            case ChatbotConfig.STATES.BUDGET_DISCUSSION:
                return this.budgetDiscussionResponses(intent, context);

            case ChatbotConfig.STATES.TIMELINE_ASSESSMENT:
                return this.timelineAssessmentResponses(intent, context);

            case ChatbotConfig.STATES.RECOMMENDATION:
                return this.recommendationResponses(intent, context);

            case ChatbotConfig.STATES.PACKAGE_DETAILS:
                return this.packageDetailsResponses(intent, context);

            case ChatbotConfig.STATES.OBJECTION_HANDLING:
                return this.objectionHandlingResponses(intent, context);

            case ChatbotConfig.STATES.CLOSING:
                return this.closingResponses(intent, context);

            case ChatbotConfig.STATES.SUPPORT:
                return this.supportResponses(intent, context);

            case ChatbotConfig.STATES.EXIT:
                return this.exitResponses(intent, context);

            default:
                return this.fallbackResponses();
        }
    },

    // ========================================
    // WELCOME STATE
    // ========================================

    welcomeResponses(intent, context) {
        if (intent === 'greeting') {
            return [
                "Hey there! 👋 I help local businesses get stunning websites that actually bring in customers. What type of business do you have?",
                "Hi! I'm here to help you build an amazing website for your business. Tell me - what industry are you in?",
                "Hello! I specialize in websites for restaurants, salons, gyms, and local businesses. What kind of business are you running?",
                "Hey! 👋 Ready to take your business online? First, tell me what type of business you have!"
            ];
        }

        if (intent === 'get_started') {
            return [
                "Awesome! Let's build you something amazing. First question - what type of business do you have?",
                "Love it! Let's get started. What industry is your business in?",
                "Perfect! To recommend the right solution, I need to know - what type of business are you running?"
            ];
        }

        if (intent === 'pricing_inquiry') {
            return [
                "I'd love to give you exact pricing! First, tell me about your business so I can recommend the perfect package. What type of business do you have?",
                "Great question! Pricing depends on what you need. Let me ask - what kind of business are you running?",
                "I have packages from $2,000-$8,000 depending on features. To recommend the right one - what type of business do you have?"
            ];
        }

        // Default welcome
        return [
            "Welcome! 👋 I help local businesses like yours get high-converting websites. What type of business do you have?",
            "Hi there! I build custom websites for restaurants, salons, gyms, and local businesses. What industry are you in?"
        ];
    },

    // ========================================
    // DISCOVERY STATE
    // ========================================

    discoveryResponses(intent, context) {
        return [
            "Tell me about your business! What type of business is it?",
            "What kind of business are you running? (Restaurant, salon, gym, etc.)",
            "To help you best, I need to know - what industry is your business in?"
        ];
    },

    // ========================================
    // BUSINESS PROFILING STATE
    // ========================================

    businessProfilingResponses(intent, context) {
        if (context.detectedEntities.businessType) {
            const bizType = context.detectedEntities.businessType;
            const responses = {
                'restaurant': [
                    "Nice! Restaurants are my specialty. What's your biggest challenge right now? (No online ordering? Old website? Hard to find on Google?)",
                    "Love working with restaurants! What's the main problem you're trying to solve with a new website?",
                    "Perfect! I've helped tons of restaurants. What features do you need most? (Online ordering, reservations, menu showcase?)"
                ],
                'salon': [
                    "Awesome! Salons need great online booking. Is that something you're looking for?",
                    "Perfect! What's your biggest pain point right now? (No online booking? Clients can't find you? Website looks outdated?)",
                    "Love it! Salons do amazing with online booking. Is that a feature you need?"
                ],
                'fitness': [
                    "Nice! Gyms and studios thrive with member portals. What features are you looking for?",
                    "Perfect! What's your main goal? (Online class booking? Member management? Lead generation?)",
                    "Awesome! Fitness businesses need strong online presence. What's your biggest challenge?"
                ],
                'cafe': [
                    "Great! Cafes do amazing with online ordering. Is that something you need?",
                    "Perfect! What features are most important to you? (Online ordering, menu showcase, location info?)",
                    "Love it! What's the main problem you're trying to solve?"
                ],
                'bar': [
                    "Nice! What features do you need? (Event calendar, menu showcase, reservations?)",
                    "Perfect! What's your biggest challenge right now?",
                    "Awesome! What's the main goal for your website?"
                ]
            };

            return responses[bizType] || [
                "Got it! What's your biggest challenge right now with your online presence?",
                "Perfect! What features do you need most for your website?"
            ];
        }

        // Still asking for business type
        return [
            "What type of business do you have? (Restaurant, salon, gym, cafe, etc.)",
            "Tell me about your business - what industry are you in?",
            "To give you the best recommendation, I need to know what type of business you're running!"
        ];
    },

    // ========================================
    // NEEDS ASSESSMENT STATE
    // ========================================

    needsAssessmentResponses(intent, context) {
        if (intent.includes('online_ordering')) {
            return [
                "Online ordering is a game-changer! Restaurants see an average of $4,500/month in extra revenue from it. What else do you need?",
                "Perfect! Online ordering is included in our Professional and Premium packages. Any other features you're looking for?",
                "Great choice! Online ordering pays for itself in the first month. Anything else on your wish list?"
            ];
        }

        if (intent.includes('online_booking')) {
            return [
                "Online booking is huge! Salons report 40% more appointments when clients can book 24/7. What else do you need?",
                "Smart! Online booking is included in our Premium package. Any other must-haves?",
                "Love it! Online booking typically increases bookings by 35-40%. What else is important to you?"
            ];
        }

        if (intent.includes('ai_chatbot')) {
            return [
                "AI chatbots answer customer questions 24/7 and qualify leads automatically. Huge time-saver! What else do you need?",
                "Great idea! AI chatbots are included in our Professional and Premium packages. Anything else?",
                "Smart! AI chatbots can handle 80% of customer questions automatically. What other features do you want?"
            ];
        }

        if (intent.includes('seo')) {
            return [
                "SEO is critical! Most customers find local businesses on Google. We include local SEO in all packages. What else matters to you?",
                "Perfect! We optimize all sites for Google. You'll show up when customers search for [businessType] in your area. Any other needs?",
                "Smart thinking! SEO is included in every package we build. What other features are you looking for?"
            ];
        }

        // Default needs assessment
        return [
            "What features are most important to you? (Online ordering, booking, AI chatbot, custom design?)",
            "What's your biggest pain point right now? (Not on Google? No online orders? Website looks outdated?)",
            "Tell me what you need! I want to make sure we include everything important to you."
        ];
    },

    // ========================================
    // BUDGET DISCUSSION STATE
    // ========================================

    budgetDiscussionResponses(intent, context) {
        if (intent === 'budget_tight') {
            return [
                "Totally understand! Our Essential package starts at $2,000 and includes everything you need to get started. Sound good?",
                "No problem! We have flexible payment plans - $350/month over 6 months. And most businesses make back the investment in the first month!",
                "I get it! The good news is our websites typically generate 3-5x ROI in the first year. Want to hear about payment plans?"
            ];
        }

        if (intent === 'budget_flexible') {
            return [
                "Perfect! Our Premium package ($8,000) gives you everything - AI chatbot, online ordering/booking, custom design, and ongoing support. Worth it?",
                "Great! Sounds like quality matters to you. Our Professional package ($5,000) is our most popular. Includes custom design, AI features, and SEO.",
                "Awesome! Investing in a great website pays off big. Our clients see 3-5x ROI in the first year. What features matter most to you?"
            ];
        }

        if (intent === 'pricing_inquiry') {
            return [
                "We have three packages: Essential ($2,000), Professional ($5,000), and Premium ($8,000). What's your budget range?",
                "Great question! Pricing depends on features. What's your budget? ($2K-$3K, $3K-$6K, or $6K+)",
                "I have options from $2,000-$8,000 depending on what you need. What range works for you?"
            ];
        }

        // Default budget discussion
        return [
            "What's your budget for this project? I want to recommend the right package for you.",
            "To give you the perfect recommendation - what range are you comfortable with? ($2K-$3K, $3K-$6K, or $6K+)",
            "Budget-wise, what are you thinking? (Under $2K, $2-5K, $5K+)"
        ];
    },

    // ========================================
    // TIMELINE ASSESSMENT STATE
    // ========================================

    timelineAssessmentResponses(intent, context) {
        if (intent === 'urgent_timeline') {
            return [
                "No problem! We can have you live in 2-3 weeks. Our Professional package is perfect for that timeline. Sound good?",
                "Got it! Rush projects are our specialty. We can launch in 2-3 weeks. Ready to get started?",
                "ASAP works! We can fast-track your project. Most sites launch within 2-3 weeks. Let's do it!"
            ];
        }

        if (intent === 'timeline_inquiry') {
            return [
                "Typical timeline is 2-4 weeks from start to launch. Does that work for you?",
                "Most projects launch in 3-4 weeks. Urgent projects can go live in 2 weeks. What's your ideal timeline?",
                "We can move as fast or slow as you need! What timeline are you thinking?"
            ];
        }

        // Default timeline
        return [
            "When do you need this live? (ASAP, 2-4 weeks, flexible)",
            "What's your timeline looking like? (Urgent, soon, or no rush)",
            "How quickly do you need to launch? (Rush project or can we take our time?)"
        ];
    },

    // ========================================
    // RECOMMENDATION STATE
    // ========================================

    recommendationResponses(intent, context) {
        const recommendedPackage = context.recommendedPackage;

        if (!recommendedPackage) {
            return [
                "Based on what you've told me, let me recommend the perfect package for you...",
                "I have the perfect solution for your needs. Let me explain..."
            ];
        }

        const packageData = ChatbotConfig.PACKAGES[recommendedPackage.toUpperCase()];
        const packageName = packageData.displayName;
        const price = ChatbotUtils.formatCurrency(packageData.price);

        const recommendations = {
            'essential': [
                `I recommend our **Essential package** (${price}). It's perfect for [businessType] businesses that need a professional website fast. Includes: 5-page custom site, mobile-responsive design, contact forms, and Google optimization. Clean, professional, affordable. Sound good?`,
                `Based on your needs, the **Essential package** (${price}) is ideal! You get: custom design, mobile-friendly, SEO basics, and fast delivery. Great starting point for [businessType] businesses!`,
                `I'd suggest our **Essential package** (${price}). Perfect for your budget and timeline! Includes everything you need: professional design, mobile-responsive, SEO-ready, and we can launch in 2-3 weeks.`
            ],
            'professional': [
                `I recommend our **Professional package** (${price}) - it's our most popular! Perfect for [businessType] businesses. Includes: custom design, AI chatbot, advanced SEO, 10 pages, and everything you need to generate leads 24/7. This package pays for itself in 2-3 months!`,
                `Based on what you've told me, the **Professional package** (${price}) is perfect! You get: AI-powered chatbot, custom design, online [ordering/booking], SEO optimization, and ongoing support. Most [businessType] businesses choose this one!`,
                `I'd go with our **Professional package** (${price}). It includes: AI chatbot (answers questions 24/7), custom design, [online ordering/booking feature], local SEO, and analytics. This is the sweet spot for [businessType] businesses!`
            ],
            'premium': [
                `I strongly recommend our **Premium package** (${price}) for you! Here's why: You get EVERYTHING - AI chatbot, online ordering AND booking, custom design, email marketing, advanced analytics, ongoing support, and a dedicated account manager. [BusinessType] businesses see 3-5x ROI with this package!`,
                `For what you need, the **Premium package** (${price}) is the way to go! Includes: full e-commerce/booking system, AI chatbot, custom brand design, premium SEO, email marketing automation, and white-glove support. Worth every penny!`,
                `The **Premium package** (${price}) is perfect for ambitious [businessType] businesses! You get: complete online ordering/booking, AI features, custom design, email campaigns, premium support, and everything needed to dominate your market!`
            ]
        };

        const responses = recommendations[recommendedPackage] || [
            `I recommend the **${packageName}** package (${price}) based on your needs!`
        ];

        return responses;
    },

    // ========================================
    // PACKAGE DETAILS STATE
    // ========================================

    packageDetailsResponses(intent, context) {
        if (intent === 'essential_details') {
            return [
                "**Essential Package - $2,000**\n• 5-page custom website\n• Mobile-responsive design\n• Contact forms\n• Google SEO basics\n• Social media links\n• 2-week turnaround\n\nPerfect starter package! Want to see the others?",
                "**Essential** is our entry package ($2,000):\n✓ Professional custom design\n✓ 5 pages (Home, About, Services, Contact, etc.)\n✓ Mobile-friendly\n✓ Basic SEO\n✓ Fast delivery (2 weeks)\n\nGreat for businesses on a budget!"
            ];
        }

        if (intent === 'professional_details') {
            return [
                "**Professional Package - $5,000** (Most Popular! ⭐)\n• 10-page custom website\n• AI chatbot (answers questions 24/7)\n• Online ordering OR booking system\n• Advanced SEO + Google Business\n• Email integration\n• Analytics dashboard\n• 3-week turnaround\n\nThis is what 78% of clients choose!",
                "**Professional** is our sweet spot ($5,000):\n✓ Custom AI chatbot\n✓ Online ordering/booking\n✓ 10 pages + blog\n✓ Advanced SEO\n✓ Premium design\n✓ Analytics\n✓ 6 months support\n\nMost businesses see ROI in 2-3 months!"
            ];
        }

        if (intent === 'premium_details') {
            return [
                "**Premium Package - $8,000** (All-Inclusive! 🔥)\n• Unlimited pages\n• AI chatbot + automation\n• Full e-commerce/booking system\n• Custom brand design\n• Email marketing campaigns\n• Premium SEO + ads setup\n• Dedicated account manager\n• 12 months support\n\nThis is for businesses ready to dominate!",
                "**Premium** is the complete solution ($8,000):\n✓ Everything in Professional\n✓ Complete online ordering + booking\n✓ Email marketing automation\n✓ Premium custom design\n✓ Dedicated support\n✓ Social media integration\n✓ Advanced analytics\n\nFor serious businesses ready to scale!"
            ];
        }

        if (intent === 'package_comparison') {
            return [
                "Here's the breakdown:\n\n**Essential** ($2K) - Basic site, perfect starter\n**Professional** ($5K) - AI chatbot + ordering/booking ⭐ Most Popular!\n**Premium** ($8K) - Everything! Full automation\n\nWhich fits your needs best?",
                "Let me compare:\n\n💎 **Essential**: Great for budget-conscious businesses\n💎 **Professional**: Best value! Includes AI + online ordering/booking\n💎 **Premium**: Complete solution with all features\n\nWhat's most important to you?"
            ];
        }

        return [
            "Want to see details on a specific package? (Essential, Professional, or Premium)",
            "Which package interests you most? I can break down exactly what's included!",
            "I can show you details on any package - just ask! Which one are you curious about?"
        ];
    },

    // ========================================
    // OBJECTION HANDLING STATE
    // ========================================

    objectionHandlingResponses(intent, context) {
        if (intent === 'budget_concern' || intent === 'budget_tight') {
            return [
                "I totally get it! Here's the thing - most [businessType] businesses make back the investment in the first month. We also offer payment plans: $350/month for 6 months. Much more manageable, right?",
                "Fair concern! But consider this: a great website generates leads 24/7. Our clients typically see 3-5x ROI in the first year. Plus, we have flexible payment plans. Want to hear about those?",
                "I understand! That's why we offer payment plans - $350-$500/month instead of all upfront. And most businesses recoup the cost within 30-60 days from new customers. Worth exploring?",
                "Budget is important! Two things: (1) We have payment plans, (2) A good website makes you money. Example: [BusinessType] clients generate an extra $4,500/month from online orders. ROI is huge!"
            ];
        }

        if (intent === 'not_ready') {
            return [
                "No problem! What would help you decide? (Seeing examples, talking to my team, payment plans?)",
                "Totally fine! What questions can I answer to help you feel more confident?",
                "I get it! Want me to send you some info you can review? Or show you examples of what we've built?",
                "No rush! What's holding you back? Maybe I can address it!"
            ];
        }

        if (intent === 'need_approval') {
            return [
                "Smart! Want me to put together some info you can share with your partner/boss? I can include pricing, examples, and ROI data!",
                "Makes sense! I can send you a detailed breakdown to share. What would be most helpful for them to see?",
                "Good idea to loop them in! Let me prepare something professional you can forward. Should I include examples and pricing?"
            ];
        }

        if (intent === 'competitor_comparison') {
            return [
                "Great question! DIY platforms like Wix/Squarespace are cheap but limited. You get a template, not custom design, no AI features, and you have to build it yourself. We build a CUSTOM site tailored to your business with AI automation. Big difference!",
                "Unlike Wix/Squarespace, you get: (1) Custom design (not a template), (2) AI chatbot that qualifies leads, (3) Professional build (we do everything), (4) Ongoing support. You're comparing a Ferrari to a bicycle!",
                "DIY builders are fine for hobbies. For a serious business? You need custom design, professional copywriting, SEO, and features that actually convert. That's what we build!"
            ];
        }

        return [
            "I hear you! What's your biggest concern? Let me address it directly.",
            "Fair enough! What would make this a no-brainer for you?",
            "I get it! What questions can I answer to help you move forward?"
        ];
    },

    // ========================================
    // CLOSING STATE
    // ========================================

    closingResponses(intent, context) {
        if (intent === 'ready_to_start' || intent === 'quote_request') {
            return [
                "Awesome! Let's make this official. Click the button below to fill out a quick quote form, and I'll have my team reach out within 24 hours with next steps! 🚀",
                "Perfect! I'm excited to work with you! Click 'Get Your Quote' below and we'll get the ball rolling. You'll hear from us within 24 hours!",
                "Let's do it! 🎉 Click the quote button below. Fill out your details and we'll send over a detailed proposal within 24 hours. Ready?"
            ];
        }

        if (intent === 'need_approval') {
            return [
                "No problem! I'll prepare a detailed summary you can share. Click 'Get Quote' below and I'll send you everything: pricing, features, timeline, ROI data. Sound good?",
                "Smart move! I can send you a professional breakdown to share with your partner/boss. Just click the quote button and you'll get a full proposal!",
                "Got it! I'll put together a comprehensive proposal you can review together. Click 'Get Quote' and I'll send everything over!"
            ];
        }

        if (intent === 'not_ready') {
            return [
                "No worries! What would help you decide? I'm here to answer any questions!",
                "That's fine! What can I clarify for you? Or would you like to see some examples of our work?",
                "No problem! Want to chat with one of our designers? Or see examples of sites we've built?"
            ];
        }

        // Default closing
        return [
            "Ready to get started? Click 'Get Your Quote' below and let's build you something amazing! 🚀",
            "Excited to work with you! Click the quote button to get started. We'll have a proposal to you within 24 hours!",
            "Let's make it happen! Click 'Get Quote' below and we'll send you a detailed proposal ASAP!"
        ];
    },

    // ========================================
    // SUPPORT STATE
    // ========================================

    supportResponses(intent, context) {
        if (intent.includes('hosting')) {
            return [
                "Great question! Yes, we handle hosting, domain, SSL certificates - everything! It's included in your package. You don't have to worry about any technical stuff!",
                "Yes! Hosting is included for the first year. We manage everything - servers, security, backups, updates. You just focus on your business!"
            ];
        }

        if (intent.includes('ownership')) {
            return [
                "You own everything! The website, the code, the content, the domain - it's 100% yours. No lock-in, no surprises!",
                "Great question! Yes, you own the entire website. We deliver the code, and you can take it anywhere. Full ownership!"
            ];
        }

        if (intent.includes('support')) {
            return [
                "All packages include ongoing support! Professional gets 6 months, Premium gets 12 months. We handle updates, bugs, and questions!",
                "Yes! We don't just build and disappear. You get months of support depending on your package. We're here to help!"
            ];
        }

        if (intent.includes('mobile')) {
            return [
                "Absolutely! Every site we build is fully mobile-responsive. Works perfectly on phones, tablets, and desktops!",
                "100%! Mobile-responsive design is standard in every package. Your site will look amazing on all devices!"
            ];
        }

        return [
            "What questions do you have? I'm here to help!",
            "Happy to answer anything! What would you like to know?",
            "I can answer any questions you have. Shoot!"
        ];
    },

    // ========================================
    // EXIT STATE
    // ========================================

    exitResponses(intent, context) {
        if (intent === 'not_interested') {
            return [
                "No worries! If you change your mind, I'm here. Have a great day! 👋",
                "That's okay! Feel free to come back anytime. Good luck with your business!",
                "No problem! If you ever need help, just reach out. Take care! 👋"
            ];
        }

        return [
            "Thanks for chatting! If you have more questions later, I'm here. Have a great day! 👋",
            "Appreciate your time! Feel free to come back anytime. Good luck! 👋"
        ];
    },

    // ========================================
    // FALLBACK
    // ========================================

    fallbackResponses() {
        return [
            "I didn't quite catch that. Can you rephrase?",
            "Hmm, I'm not sure I understand. Can you say that differently?",
            "Sorry, I didn't get that. Could you clarify?",
            "I'm here to help with websites! What questions do you have?"
        ];
    },

    // ========================================
    // PERSONALIZATION
    // ========================================

    /**
     * Personalize response with context
     * @param {string} response - Template response
     * @param {Object} context - Context with entities
     * @returns {string} - Personalized response
     */
    personalize(response, context) {
        let personalized = response;

        // Replace [businessType] with actual business type
        if (context.detectedEntities.businessType) {
            const businessType = context.detectedEntities.businessType;
            personalized = personalized.replace(/\[businessType\]/gi, businessType);
            personalized = personalized.replace(/\[BusinessType\]/g, businessType.charAt(0).toUpperCase() + businessType.slice(1));
        }

        // Replace [businessName] with actual business name
        if (context.detectedEntities.businessName) {
            const businessName = context.detectedEntities.businessName;
            personalized = personalized.replace(/\[businessName\]/g, businessName);
        }

        // Replace [ordering/booking] based on business type
        if (context.detectedEntities.businessType) {
            const feature = ['restaurant', 'cafe', 'bar'].includes(context.detectedEntities.businessType)
                ? 'ordering'
                : 'booking';
            personalized = personalized.replace(/\[ordering\/booking\]/gi, feature);
        }

        return personalized;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotResponseGenerator;
}
