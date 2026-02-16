/* ========================================
   INTENT LIBRARY
   500+ intent patterns for conversation recognition
   ======================================== */

const IntentLibrary = {
    // ========================================
    // GREETINGS & INITIAL CONTACT
    // ========================================
    greeting: {
        exact: [
            'hi', 'hello', 'hey', 'hola', 'howdy', 'greetings',
            'good morning', 'good afternoon', 'good evening',
            'what\'s up', 'whats up', 'sup'
        ],
        primary: ['hi', 'hello', 'hey', 'hola', 'greet'],
        secondary: ['morning', 'afternoon', 'evening', 'day'],
        negative: []
    },

    // ========================================
    // GET STARTED / NEED WEBSITE
    // ========================================
    get_started: {
        exact: [
            'i need a website', 'i want a website', 'i\'m looking for a website',
            'need a site', 'want a site', 'looking for a site',
            'build me a website', 'create a website', 'make me a website',
            'can you build', 'can you create', 'can you make'
        ],
        primary: ['need', 'want', 'looking', 'build', 'create', 'make', 'develop', 'design'],
        secondary: ['website', 'site', 'web', 'page', 'online', 'presence', 'platform'],
        negative: ['don\'t', 'not', 'no', 'never']
    },

    // ========================================
    // PRICING INQUIRY
    // ========================================
    pricing_inquiry: {
        exact: [
            'how much', 'how much does it cost', 'what does it cost',
            'what\'s the price', 'whats the price', 'how much is it',
            'cost', 'price', 'pricing', 'rates', 'fees',
            'how expensive', 'is this affordable', 'affordable'
        ],
        primary: ['cost', 'price', 'pricing', 'expensive', 'cheap', 'afford', 'pay', 'fee', 'rate', 'affordable'],
        secondary: ['much', 'money', 'dollar', 'budget', 'investment', 'this'],
        negative: []
    },

    // ========================================
    // PACKAGE COMPARISON
    // ========================================
    package_comparison: {
        exact: [
            'what\'s the difference', 'whats the difference', 'difference between',
            'compare packages', 'compare plans', 'which package', 'which plan',
            'essential vs professional', 'professional vs premium',
            'what\'s better', 'whats better', 'which is better'
        ],
        primary: ['difference', 'compare', 'comparison', 'better', 'best', 'recommend'],
        secondary: ['package', 'plan', 'tier', 'option', 'between', 'versus', 'vs'],
        negative: []
    },

    // ========================================
    // PACKAGE DETAILS
    // ========================================
    essential_details: {
        exact: [
            'tell me about essential', 'what is essential', 'essential package',
            'cheapest option', 'basic package', 'basic plan', 'starter package'
        ],
        primary: ['essential', 'basic', 'starter', 'cheap', 'minimum', 'simplest'],
        secondary: ['package', 'plan', 'tier', 'option'],
        negative: []
    },

    professional_details: {
        exact: [
            'tell me about professional', 'what is professional', 'professional package',
            'middle option', 'mid-tier', 'standard package'
        ],
        primary: ['professional', 'standard', 'middle', 'mid'],
        secondary: ['package', 'plan', 'tier', 'option'],
        negative: []
    },

    premium_details: {
        exact: [
            'tell me about premium', 'what is premium', 'premium package',
            'best package', 'most expensive', 'top tier', 'complete package'
        ],
        primary: ['premium', 'best', 'top', 'complete', 'full', 'ultimate', 'advanced'],
        secondary: ['package', 'plan', 'tier', 'option'],
        negative: []
    },

    // ========================================
    // TIMELINE / URGENCY
    // ========================================
    timeline_inquiry: {
        exact: [
            'how long', 'how long does it take', 'when can i get it',
            'delivery time', 'turnaround time', 'how fast',
            'how quickly', 'asap', 'urgent', 'rush',
            'how long will it take'
        ],
        primary: ['long', 'fast', 'quick', 'soon', 'when', 'time', 'delivery', 'turnaround', 'deadline', 'take'],
        secondary: ['ready', 'done', 'finish', 'complete', 'launch', 'will', 'it', 'how'],
        negative: []
    },

    urgent_timeline: {
        exact: [
            'asap', 'as soon as possible', 'urgent', 'urgently', 'rush',
            'i need it now', 'i need it fast', 'yesterday', 'immediately'
        ],
        primary: ['asap', 'urgent', 'rush', 'immediately', 'now', 'fast', 'quick', 'yesterday'],
        secondary: ['need', 'want', 'deadline', 'hurry'],
        negative: []
    },

    // ========================================
    // BUSINESS TYPE INDICATION
    // ========================================
    restaurant_mention: {
        exact: [
            'i own a restaurant', 'i have a restaurant', 'i run a restaurant',
            'my restaurant', 'for my restaurant', 'restaurant owner'
        ],
        primary: ['restaurant', 'cafe', 'bistro', 'diner', 'eatery', 'food', 'dining'],
        secondary: ['own', 'have', 'run', 'manage', 'operate'],
        negative: []
    },

    salon_mention: {
        exact: [
            'i own a salon', 'i have a salon', 'i run a salon',
            'my salon', 'for my salon', 'salon owner', 'hair salon', 'beauty salon',
            'my salon needs', 'my salon needs a website'
        ],
        primary: ['salon', 'spa', 'beauty', 'hair', 'barber', 'stylist'],
        secondary: ['own', 'have', 'run', 'manage', 'operate', 'my', 'needs'],
        negative: []
    },

    fitness_mention: {
        exact: [
            'i own a gym', 'i have a gym', 'i run a gym',
            'my gym', 'for my gym', 'gym owner', 'fitness center', 'yoga studio'
        ],
        primary: ['gym', 'fitness', 'yoga', 'pilates', 'crossfit', 'training', 'workout'],
        secondary: ['own', 'have', 'run', 'manage', 'operate', 'studio', 'center'],
        negative: []
    },

    // ========================================
    // FEATURES / NEEDS
    // ========================================
    ai_chatbot_inquiry: {
        exact: [
            'tell me about ai', 'what is the ai chatbot', 'how does the ai work',
            'ai features', 'chatbot', 'virtual assistant', 'do you do ai chatbots',
            'ai chatbot', 'do you do chatbots'
        ],
        primary: ['ai', 'chatbot', 'bot', 'assistant', 'automation', 'automated', 'chatbots'],
        secondary: ['feature', 'work', 'does', 'help', 'answer', 'customer', 'do', 'you'],
        negative: []
    },

    online_ordering_need: {
        exact: [
            'i need online ordering', 'online orders', 'order online',
            'customers order online', 'delivery orders', 'takeout orders'
        ],
        primary: ['ordering', 'order', 'delivery', 'takeout', 'pickup', 'doordash', 'uber'],
        secondary: ['online', 'customer', 'food', 'menu'],
        negative: []
    },

    online_booking_need: {
        exact: [
            'i need online booking', 'online appointments', 'book appointments',
            'customers book online', 'reservation system', 'scheduling',
            'i want online booking', 'online booking', 'book online'
        ],
        primary: ['booking', 'appointment', 'reservation', 'schedule', 'calendar', 'book'],
        secondary: ['online', 'customer', 'time', 'slot', 'want', 'need'],
        negative: []
    },

    seo_inquiry: {
        exact: [
            'seo', 'search engine optimization', 'google ranking',
            'show up on google', 'get found online', 'ranking'
        ],
        primary: ['seo', 'google', 'search', 'ranking', 'visibility', 'traffic', 'found'],
        secondary: ['engine', 'optimization', 'result', 'page'],
        negative: []
    },

    // ========================================
    // PAIN POINTS
    // ========================================
    no_website: {
        exact: [
            'i don\'t have a website', 'i have no website', 'no online presence',
            'not online', 'no web presence'
        ],
        primary: ['no', 'don\'t', 'doesn\'t', 'without', 'need'],
        secondary: ['website', 'site', 'online', 'presence', 'web'],
        negative: []
    },

    outdated_website: {
        exact: [
            'my website is outdated', 'old website', 'looks old',
            'from 2010', 'ancient website', 'needs updating'
        ],
        primary: ['outdated', 'old', 'ancient', 'dated', 'ugly', 'terrible'],
        secondary: ['website', 'site', 'design', 'looks'],
        negative: []
    },

    losing_customers: {
        exact: [
            'losing customers', 'losing business', 'competitors winning',
            'customers go elsewhere', 'losing to competitors'
        ],
        primary: ['losing', 'lost', 'miss', 'missing'],
        secondary: ['customer', 'business', 'sale', 'competitor', 'elsewhere'],
        negative: []
    },

    // ========================================
    // BUDGET CONCERNS
    // ========================================
    budget_concern: {
        exact: [
            'too expensive', 'can\'t afford', 'out of budget', 'over budget',
            'that\'s a lot', 'too much money', 'cheaper option', 'discount',
            'this is too expensive'
        ],
        primary: ['expensive', 'afford', 'budget', 'cheap', 'cheaper', 'discount', 'deal', 'too'],
        secondary: ['much', 'cost', 'price', 'money', 'pay', 'this', 'is'],
        negative: []
    },

    budget_tight: {
        exact: [
            'tight budget', 'limited budget', 'small budget', 'low budget',
            'under $2000', 'under 2k', 'less than $2000',
            'i have a tight budget'
        ],
        primary: ['tight', 'limited', 'small', 'low', 'under', 'less'],
        secondary: ['budget', 'money', 'afford', 'spend', 'have'],
        negative: []
    },

    budget_flexible: {
        exact: [
            'flexible budget', 'no budget limit', 'whatever it takes',
            'not concerned about price', 'money is not an issue', 'worth the investment'
        ],
        primary: ['flexible', 'no limit', 'whatever', 'worth', 'invest', 'value'],
        secondary: ['budget', 'concern', 'issue', 'problem'],
        negative: ['concern', 'worry', 'issue']
    },

    // ========================================
    // OBJECTIONS
    // ========================================
    not_ready: {
        exact: [
            'i\'m not ready', 'not ready yet', 'just looking', 'just browsing',
            'still thinking', 'need to think', 'let me think about it'
        ],
        primary: ['not ready', 'just', 'thinking', 'considering', 'browsing', 'looking'],
        secondary: ['maybe', 'later', 'soon', 'future'],
        negative: []
    },

    need_approval: {
        exact: [
            'need to ask', 'check with', 'talk to my partner', 'ask my boss',
            'not the decision maker', 'need approval'
        ],
        primary: ['ask', 'check', 'talk', 'approval', 'permission', 'boss', 'partner'],
        secondary: ['need', 'have to', 'must', 'should'],
        negative: []
    },

    // ========================================
    // READY TO BUY
    // ========================================
    ready_to_start: {
        exact: [
            'let\'s do it', 'let\'s get started', 'i\'m ready', 'i want to start',
            'sign me up', 'let\'s go', 'i\'m in', 'yes let\'s do this',
            'where do i sign', 'how do i get started',
            'i\'m ready to get started', 'ready to get started'
        ],
        primary: ['ready', 'start', 'begin', 'sign', 'yes', 'go', 'proceed', 'started'],
        secondary: ['let\'s', 'want', 'get', 'now', 'i\'m', 'to'],
        negative: ['not', 'don\'t', 'no']
    },

    // ========================================
    // PAYMENT / QUOTE REQUEST
    // ========================================
    quote_request: {
        exact: [
            'send me a quote', 'get a quote', 'i want a quote',
            'send proposal', 'get pricing', 'send me pricing'
        ],
        primary: ['quote', 'proposal', 'estimate', 'pricing', 'details'],
        secondary: ['send', 'get', 'want', 'need', 'email'],
        negative: []
    },

    payment_plan_inquiry: {
        exact: [
            'payment plan', 'monthly payments', 'pay in installments',
            'split payment', 'can i pay monthly', 'financing'
        ],
        primary: ['payment', 'pay', 'monthly', 'installment', 'plan', 'financing', 'split'],
        secondary: ['how', 'can', 'option', 'available'],
        negative: []
    },

    // ========================================
    // EXAMPLES / DEMOS
    // ========================================
    see_examples: {
        exact: [
            'show me examples', 'can i see examples', 'demo', 'sample',
            'portfolio', 'previous work', 'past projects', 'case studies'
        ],
        primary: ['example', 'demo', 'sample', 'portfolio', 'show', 'see', 'look'],
        secondary: ['work', 'project', 'site', 'website'],
        negative: []
    },

    // ========================================
    // SUPPORT / HELP
    // ========================================
    support_inquiry: {
        exact: [
            'do you provide support', 'customer support', 'help after launch',
            'ongoing support', 'maintenance', 'updates'
        ],
        primary: ['support', 'help', 'assist', 'maintenance', 'update', 'fix', 'bug'],
        secondary: ['after', 'ongoing', 'continue', 'service'],
        negative: []
    },

    // ========================================
    // GRATITUDE
    // ========================================
    gratitude: {
        exact: [
            'thank you', 'thanks', 'thank you so much', 'thanks a lot',
            'appreciate it', 'thanks for your help', 'helpful'
        ],
        primary: ['thank', 'thanks', 'appreciate', 'grateful', 'helpful'],
        secondary: ['you', 'much', 'lot', 'help'],
        negative: []
    },

    // ========================================
    // NEGATIVE / EXIT
    // ========================================
    not_interested: {
        exact: [
            'not interested', 'no thanks', 'no thank you',
            'i\'ll pass', 'not for me', 'maybe later'
        ],
        primary: ['not interested', 'no', 'pass', 'later', 'nevermind', 'forget'],
        secondary: ['thanks', 'thank you'],
        negative: []
    },

    // ========================================
    // CLARIFICATION / CONFUSION
    // ========================================
    clarification: {
        exact: [
            'what do you mean', 'i don\'t understand', 'can you explain',
            'confused', 'huh', 'what'
        ],
        primary: ['mean', 'understand', 'explain', 'confused', 'clarify', 'huh', 'what'],
        secondary: ['can you', 'don\'t', 'not sure'],
        negative: []
    },

    // ========================================
    // COMPETITOR MENTION
    // ========================================
    competitor_comparison: {
        exact: [
            'vs wix', 'vs squarespace', 'vs wordpress', 'vs shopify',
            'better than wix', 'compared to squarespace'
        ],
        primary: ['wix', 'squarespace', 'wordpress', 'shopify', 'weebly', 'godaddy'],
        secondary: ['vs', 'versus', 'compared', 'better', 'difference'],
        negative: []
    },

    // ========================================
    // OWNERSHIP / RIGHTS
    // ========================================
    ownership_inquiry: {
        exact: [
            'do i own the website', 'who owns the website', 'is it mine',
            'do i own the code', 'intellectual property', 'ownership'
        ],
        primary: ['own', 'ownership', 'mine', 'belong', 'rights', 'property'],
        secondary: ['website', 'code', 'design', 'content'],
        negative: []
    },

    // ========================================
    // MOBILE / RESPONSIVE
    // ========================================
    mobile_inquiry: {
        exact: [
            'mobile friendly', 'mobile responsive', 'works on mobile',
            'works on phone', 'responsive', 'mobile version'
        ],
        primary: ['mobile', 'phone', 'responsive', 'tablet', 'ipad', 'device'],
        secondary: ['friendly', 'work', 'version', 'compatible'],
        negative: []
    },

    // ========================================
    // HOSTING / DOMAIN
    // ========================================
    hosting_inquiry: {
        exact: [
            'do you provide hosting', 'web hosting', 'server',
            'where is it hosted', 'hosting included', 'domain'
        ],
        primary: ['hosting', 'host', 'server', 'domain', 'url', 'address'],
        secondary: ['provide', 'include', 'need', 'where'],
        negative: []
    },

    // ========================================
    // CUSTOM DESIGN
    // ========================================
    custom_design_inquiry: {
        exact: [
            'custom design', 'unique design', 'not a template',
            'tailored to my brand', 'personalized', 'custom made'
        ],
        primary: ['custom', 'unique', 'personalized', 'tailored', 'brand', 'specific'],
        secondary: ['design', 'look', 'style', 'template'],
        negative: ['template', 'generic']
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntentLibrary;
}
