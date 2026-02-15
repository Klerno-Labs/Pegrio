// Enhanced AI Chatbot for Main Pricing Page
class PricingChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.userContext = {
            businessType: null,
            hasWebsite: null,
            budget: null,
            needsAI: null,
            askedAbout: []
        };
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <button class="chatbot-toggle" id="chatbotToggle" aria-label="Open chat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
            </button>

            <div class="chatbot-container" id="chatbotContainer">
                <div class="chatbot-header">
                    <div class="chatbot-header-content">
                        <div class="chatbot-avatar">🤖</div>
                        <div>
                            <h3 class="chatbot-title">AI Assistant</h3>
                            <p class="chatbot-status">● Online - Ready to help!</p>
                        </div>
                    </div>
                    <button class="chatbot-close" id="chatbotClose" aria-label="Close chat">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                        </svg>
                    </button>
                </div>

                <div class="chatbot-messages" id="chatbotMessages"></div>

                <div class="chatbot-input-area">
                    <div class="chatbot-input-wrapper">
                        <textarea
                            class="chatbot-input"
                            id="chatbotInput"
                            placeholder="Ask me anything about our packages..."
                            rows="1"
                        ></textarea>
                        <button class="chatbot-send-btn" id="chatbotSend" aria-label="Send message">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const toggle = document.getElementById('chatbotToggle');
        const close = document.getElementById('chatbotClose');
        const send = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.toggleChat());
        send.addEventListener('click', () => this.sendMessage());

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        input.addEventListener('input', () => {
            this.autoResize(input);
        });
    }

    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatbotToggle');

        container.classList.toggle('active');
        toggle.classList.toggle('active');

        if (this.isOpen) {
            document.getElementById('chatbotInput').focus();
        }
    }

    addWelcomeMessage() {
        const welcomeMsg = {
            type: 'bot',
            text: "Hi! 👋 I'm your AI assistant. I can help you find the perfect website package for your business.\n\nI specialize in helping restaurants, salons, fitness studios, and professional services get online fast!\n\nWhat would you like to know?",
            quickReplies: [
                "What packages do you offer?",
                "I'm a restaurant owner",
                "What's the difference?",
                "How long does it take?"
            ]
        };
        this.addMessage(welcomeMsg);
    }

    addMessage(message) {
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }

    renderMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

        const messageHTML = `
            <div class="chatbot-message ${message.type}">
                ${message.type === 'bot' ? '<div class="message-avatar bot">🤖</div>' : ''}
                <div>
                    <div class="message-content">
                        ${message.text}
                    </div>
                    ${message.quickReplies ? this.renderQuickReplies(message.quickReplies) : ''}
                </div>
                ${message.type === 'user' ? '<div class="message-avatar user">👤</div>' : ''}
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    }

    renderQuickReplies(replies) {
        const buttonsHTML = replies.map(reply =>
            `<button class="quick-reply-btn" onclick="chatbot.handleQuickReply('${reply.replace(/'/g, "\\'")}')">${reply}</button>`
        ).join('');

        return `<div class="quick-replies">${buttonsHTML}</div>`;
    }

    handleQuickReply(text) {
        this.addMessage({ type: 'user', text });
        this.generateResponse(text);
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        const text = input.value.trim();

        if (!text) return;

        this.addMessage({ type: 'user', text });
        input.value = '';
        input.style.height = 'auto';

        this.showTyping();
        setTimeout(() => {
            this.hideTyping();
            this.generateResponse(text);
        }, 800 + Math.random() * 700);
    }

    showTyping() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingHTML = `
            <div class="chatbot-message bot typing-message">
                <div class="message-avatar bot">🤖</div>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
    }

    hideTyping() {
        const typing = document.querySelector('.typing-message');
        if (typing) typing.remove();
    }

    // Enhanced response generation with better NLP
    generateResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        let response;

        // Track what user has asked about
        if (!this.userContext.askedAbout.includes(msg.substring(0, 20))) {
            this.userContext.askedAbout.push(msg.substring(0, 20));
        }

        // BUDGET/PRICING QUESTIONS - Enhanced
        if (this.matchesPattern(msg, ['cheap', 'affordable', 'budget', 'inexpensive', 'low cost', 'tight budget'])) {
            this.userContext.budget = 'low';
            response = {
                type: 'bot',
                text: "I understand budget is important! Our Essential Package at $2,000 gives you incredible value:\n\n✅ Complete 5-page website\n✅ Mobile-responsive design\n✅ Professional templates\n✅ Contact form & Google Maps\n✅ Ready in 1-2 weeks\n\nIt's our most affordable option and perfect for getting started. You can always upgrade later!\n\nWant to see a live example?",
                quickReplies: ["Show me the demo", "What if I need more features?", "Compare all packages"]
            };
        }
        else if (this.matchesPattern(msg, ['expensive', 'pricey', 'costly', 'too much', 'high price'])) {
            response = {
                type: 'bot',
                text: "I hear you! Let me put our pricing in perspective:\n\n💰 Hiring an agency: $10,000-$50,000\n💰 Freelancer (variable quality): $3,000-$15,000  \n💰 Our packages: $2,000-$8,000 (fixed, guaranteed)\n\nYou're getting:\n• Professional design\n• Fast delivery (2-4 weeks)\n• No surprises (fixed pricing)\n• Support included\n• Revisions included\n\nMany clients say we're actually underpriced for what they get! What features are most important to you?",
                quickReplies: ["I need AI features", "Just the basics", "Show me what I get"]
            };
        }
        else if (this.matchesPattern(msg, ['payment', 'pay', 'deposit', 'installment', 'financing', 'split'])) {
            response = {
                type: 'bot',
                text: "Great question about payment! 💳\n\nWe offer flexible payment options:\n\n📊 Standard: 50% upfront, 50% at launch\n📊 Split: 3 monthly payments\n📊 Full payment: 5% discount\n\nNo hidden fees - the package price is all-inclusive.\n\nWhich package interests you most?",
                quickReplies: ["Essential ($2K)", "Professional ($5K)", "Premium ($8K)", "Compare all"]
            };
        }

        // BUSINESS TYPE - Enhanced
        else if (this.matchesPattern(msg, ['restaurant', 'cafe', 'coffee shop', 'bakery', 'bar', 'bistro', 'diner', 'eatery'])) {
            this.userContext.businessType = 'restaurant';
            response = {
                type: 'bot',
                text: "Perfect! Restaurants are our specialty! 🍽️\n\n**Most restaurant owners choose:**\n\n🥈 Professional Package ($5K) if you want:\n• AI chatbot for reservations\n• Menu showcase with photos\n• Advanced SEO to get found\n• Online presence that drives traffic\n\n🥇 Premium Package ($8K) if you need:\n• Online ordering system\n• Table reservations\n• Customer accounts  \n• Full restaurant management\n\nWe have 3 live restaurant demos you can explore right now! Which sounds better for you?",
                quickReplies: ["Show me the demos", "I need online ordering", "Just a basic site", "Compare packages"]
            };
        }
        else if (this.matchesPattern(msg, ['salon', 'spa', 'hair', 'beauty', 'barber', 'nails'])) {
            this.userContext.businessType = 'salon';
            response = {
                type: 'bot',
                text: "Salons love our service! 💇\n\n**For salons/spas, I recommend:**\n\n🥈 Professional ($5K) - Most popular!\n• Online booking system\n• Service menu showcase\n• Staff profiles\n• Before/after gallery\n• AI assistant\n\n🥇 Premium ($8K) - Full featured:\n• Everything above PLUS\n• Customer accounts\n• Appointment management\n• Email automation\n• Loyalty program\n\nWhat's your top priority - booking system, showcasing work, or both?",
                quickReplies: ["Need booking", "Showcase my work", "I want both", "Budget options"]
            };
        }
        else if (this.matchesPattern(msg, ['gym', 'fitness', 'yoga', 'pilates', 'crossfit', 'personal train'])) {
            this.userContext.businessType = 'fitness';
            response = {
                type: 'bot',
                text: "Fitness studios thrive with our websites! 💪\n\n**Perfect for fitness businesses:**\n\n🥈 Professional ($5K):\n• Class schedules\n• Trainer profiles\n• Membership info\n• Online booking\n• Success stories\n\n🥇 Premium ($8K):\n• Member portal\n• Class registration\n• Payment processing\n• Workout tracking\n• Community features\n\nAre you solo or do you have a team?",
                quickReplies: ["Solo trainer", "Have a studio", "Multiple locations", "Just getting started"]
            };
        }

        // PACKAGE COMPARISONS - Enhanced
        else if (this.matchesPattern(msg, ['difference', 'compare', 'comparison', 'what.*better', 'which.*choose', 'vs'])) {
            response = {
                type: 'bot',
                text: "Here's the breakdown! 📊\n\n**🥉 Essential ($2,000)**\nBasic 5-page site, perfect to get online fast\n✅ Best for: New businesses, tight budgets\n⏱️ Ready in: 1-2 weeks\n\n**🥈 Professional ($5,000)** ⭐ Most Popular!\nEverything above + AI chatbot, advanced SEO, blog\n✅ Best for: Growing businesses  \n⏱️ Ready in: 2-3 weeks\n\n**🥇 Premium ($8,000)**\nEverything + online ordering/booking, customer accounts\n✅ Best for: Established businesses\n⏱️ Ready in: 3-4 weeks\n\nThe main difference? AI features and business automation.\n\nWhat matters most to you?",
                quickReplies: ["I need AI", "I need online sales", "Just getting started", "Show me examples"]
            };
        }

        // ESSENTIAL PACKAGE - Enhanced
        else if (this.matchesPattern(msg, ['essential', 'basic', 'simple', 'starter', '$2', '2000', '2k'])) {
            response = {
                type: 'bot',
                text: "Essential Package - $2,000 🥉\n\n**What you get:**\n✅ 5 professional pages (Home, Services, About, Gallery, Contact)\n✅ Mobile-responsive design\n✅ 3 template styles to choose from\n✅ Contact form + Google Maps\n✅ Social media integration\n✅ Basic SEO setup\n✅ 2 rounds of revisions\n✅ 30-day support\n\n⏱️ **Delivery:** 1-2 weeks\n\n💡 **Perfect if:**\n• You're just getting started\n• You need a professional presence fast\n• Budget is your main concern\n• You don't need AI or advanced features yet\n\nWant to see a live example?",
                quickReplies: ["Yes, show me!", "What's not included?", "Compare with Professional", "I'll take it!"]
            };
        }

        // PROFESSIONAL PACKAGE - Enhanced
        else if (this.matchesPattern(msg, ['professional', 'pro ', 'middle', '$5', '5000', '5k', 'popular', 'most people'])) {
            response = {
                type: 'bot',
                text: "Professional Package - $5,000 🥈 ⭐ MOST POPULAR\n\n**Everything in Essential PLUS:**\n🤖 AI Chatbot assistant\n📈 Advanced SEO & analytics\n✉️ Newsletter integration\n📰 Blog/news section\n✨ Advanced animations\n🎨 Custom design elements\n🔧 3 rounds of revisions\n📞 60-day support\n\n⏱️ **Delivery:** 2-3 weeks\n\n💡 **Perfect if:**\n• You want to stand out\n• AI features matter to you\n• You're ready to scale  \n• You want the best value\n\n78% of our clients choose this one!\n\nWant to see what the AI chatbot can do?",
                quickReplies: ["Show me AI demo", "What's the chatbot do?", "See live example", "Compare with Premium"]
            };
        }

        // PREMIUM PACKAGE - Enhanced
        else if (this.matchesPattern(msg, ['premium', 'best', 'top', 'complete', 'full', '$8', '8000', '8k', 'everything'])) {
            response = {
                type: 'bot',
                text: "Premium Package - $8,000 🥇 COMPLETE SOLUTION\n\n**Everything in Professional PLUS:**\n🛒 Online ordering/booking system\n👤 Customer account system\n📧 Email automation\n📊 Admin dashboard\n💳 Payment processing\n⭐ Review management\n🎁 Loyalty program\n🔧 Unlimited revisions\n👨‍💼 90-day priority support\n\n⏱️ **Delivery:** 3-4 weeks\n\n💡 **Perfect if:**\n• You need online sales/bookings\n• You want full automation\n• You're an established business\n• You want premium service\n\nThis is for serious businesses ready to dominate online!\n\nSee it in action?",
                quickReplies: ["Show me the demo!", "How does ordering work?", "Tell me about dashboard", "That's the one!"]
            };
        }

        // AI FEATURES - Enhanced
        else if (this.matchesPattern(msg, ['ai', 'artificial intelligence', 'chatbot', 'smart', 'intelligent', 'automation', 'automated'])) {
            this.userContext.needsAI = true;
            response = {
                type: 'bot',
                text: "AI features are game-changers! 🚀 Here's what you get:\n\n**🤖 AI Chatbot** (Professional & Premium):\n✅ Answers customer questions 24/7\n✅ Takes reservations/bookings\n✅ Handles menu questions\n✅ Understands dietary needs\n✅ Provides recommendations\n✅ Never sleeps, never has a bad day\n\n**Real impact:**\n📈 40% fewer missed inquiries\n⏰ 24/7 customer service\n💰 More conversions\n😊 Happier customers\n\nWant to try our chatbot right now? (You're talking to one!) Or see it on a restaurant demo?",
                quickReplies: ["Show restaurant demo", "How smart is it?", "Does it really work?", "I'm convinced!"]
            };
        }

        // TIMELINE - Enhanced
        else if (this.matchesPattern(msg, ['timeline', 'how long', 'when', 'fast', 'quick', 'asap', 'urgent', 'rush', 'deadline'])) {
            response = {
                type: 'bot',
                text: "Here's our delivery timeline: ⏱️\n\n**🥉 Essential:** 1-2 weeks\n**🥈 Professional:** 2-3 weeks  \n**🥇 Premium:** 3-4 weeks\n\n**What happens:**\n📅 Day 1: Kickoff call\n📅 Day 3-5: First draft\n📅 Week 2: Your feedback\n📅 Week 2-3: Revisions\n📅 Final: Launch!\n\n⚡ **Need it faster?**\nWe can expedite Essential to 7 days for +$500\nProfessional to 10 days for +$750\n\n95% of our sites launch on time or early!\n\nWhen do you need to be live?",
                quickReplies: ["ASAP", "Within a month", "No rush", "Tell me about process"]
            };
        }

        // EXAMPLES/DEMOS - Enhanced
        else if (this.matchesPattern(msg, ['example', 'demo', 'sample', 'see', 'show', 'look', 'preview', 'live site'])) {
            response = {
                type: 'bot',
                text: "I'd love to show you! We have 3 fully functional demo sites:\n\n**🌮 Mexican Restaurant** (Essential)\n• Clean 5-page design  \n• Menu showcase\n• Contact forms\n• Photo gallery\n\n**🍛 Indian Restaurant** (Professional)\n• All Essential features\n• Online ordering\n• Custom design\n• Advanced features\n\n**🍱 Japanese Restaurant** (Premium)\n• AI chatbot\n• Table reservations\n• Customer accounts\n• Full restaurant system\n\nScroll down to 'See Live Examples' or tell me which to open!",
                quickReplies: ["Open Mexican demo", "Open Indian demo", "Open Japanese demo", "I want to start"]
            };
        }

        // SUPPORT - Enhanced
        else if (this.matchesPattern(msg, ['support', 'help', 'assistance', 'training', 'learn', 'after launch', 'maintenance'])) {
            response = {
                type: 'bot',
                text: "Support is included! Here's what you get: 🛟\n\n**During Development:**\n• Dedicated project manager\n• Regular updates\n• Unlimited communication\n• Design feedback sessions\n\n**After Launch:**\n🥉 Essential: 30 days email support\n🥈 Professional: 60 days email support\n🥇 Premium: 90 days priority support\n\n**Training:**\n• How to update content\n• How to add photos\n• How to use features\n• Video tutorials\n\n**After support period:**\n• $100/month maintenance plans\n• À la carte updates\n• Emergency support available\n\nWe don't abandon you after launch!",
                quickReplies: ["What's maintenance?", "View packages", "Sounds good!", "I have more questions"]
            };
        }

        // ADD-ONS - Enhanced
        else if (this.matchesPattern(msg, ['addon', 'add-on', 'extra', 'additional', 'optional', 'upgrade'])) {
            response = {
                type: 'bot',
                text: "Great question! We offer these optional add-ons:\n\n📸 **Photography Session** - $750\n• 2-hour shoot at your location\n• 15-20 edited high-res images\n• Food, interior, or product shots\n• All images web-optimized\n\n✍️ **Content Writing** - $400\n• Professional copywriting  \n• All pages + menu descriptions\n• SEO-optimized content\n\n🔧 **Monthly Maintenance** - $100/mo\n• Updates, backups, security\n• Priority support\n• Performance optimization\n\n🚀 **Advanced SEO** - $1,000\n• Local search optimization\n• Google Business setup\n• Ranking strategy\n\n📊 **Google Analytics & Business** - $300\n• GA4 complete setup\n• Business Profile creation\n• Tracking & reports\n\nWhich interests you?",
                quickReplies: ["Photography details", "SEO package info", "Google Analytics", "None for now"]
            };
        }

        // OBJECTION HANDLING - Enhanced
        else if (this.matchesPattern(msg, ['not sure', 'thinking', 'maybe', 'uncertain', 'hesitant', 'worried', 'concerned'])) {
            response = {
                type: 'bot',
                text: "That's totally normal! Big decisions take time. 🤔\n\nWhat's your main concern?\n• Budget?\n• Timeline?\n• Not sure what you need?\n• Want to see more examples?\n• Technical questions?\n• ROI/value?\n\nI'm here to help you make the right decision - even if that means waiting or going with someone else. What would help you feel confident?",
                quickReplies: ["It's the budget", "Not sure what I need", "Show me value/ROI", "I need time to think"]
            };
        }

        // READY TO START - Enhanced
        else if (this.matchesPattern(msg, ['buy', 'purchase', 'sign up', 'get started', 'ready', 'let.*go', 'do it', 'take it', 'want', 'need this'])) {
            response = {
                type: 'bot',
                text: "Awesome! I'm excited to help you get started! 🎉\n\n**Next steps:**\n\n1️⃣ **Choose your package** (scroll up to view)\n2️⃣ **Click 'Get Started'** button on your chosen package\n3️⃣ **Fill out brief form** (5 minutes)\n4️⃣ **We'll contact you** within 24 hours\n5️⃣ **Kickoff call** to start your project\n\nWhich package feels right for you?\n\n💡 Not sure? I can recommend based on your needs!",
                quickReplies: ["Essential is perfect", "I want Professional", "Premium for me", "Help me choose"]
            };
        }

        // RECOMMENDATION ENGINE - Enhanced
        else if (this.matchesPattern(msg, ['recommend', 'suggest', 'which', 'should i', 'what.*best', 'help me choose'])) {
            response = {
                type: 'bot',
                text: "I'll help you choose! 🎯 Let me ask a few quick questions:\n\n1️⃣ Is this your first website, or replacing an existing one?",
                quickReplies: ["First website", "Replacing current site", "Have website, want better"]
            };
        }
        else if (this.matchesPattern(msg, ['first website', 'new business', 'just starting'])) {
            response = {
                type: 'bot',
                text: "Perfect! For first-timers, I typically recommend:\n\n**START HERE:**\n🥉 **Essential** ($2,000) if:\n• You just need professional online presence\n• Budget is tight\n• You can add features later\n\n**BETTER VALUE:**\n🥈 **Professional** ($5,000) if:\n• You want to compete seriously  \n• AI features matter\n• You'll need it soon anyway\n\nMost first-timers who choose Essential upgrade within 6 months. Starting with Professional saves money long-term!\n\nWhat's your monthly budget for marketing/web?",
                quickReplies: ["Under $200/mo", "$200-500/mo", "$500+/mo", "I'll take Professional"]
            };
        }
        else if (this.matchesPattern(msg, ['replacing', 'current site', 'existing', 'already have'])) {
            response = {
                type: 'bot',
                text: "Smart move upgrading! What's missing from your current site?\n\n(Check all that apply by telling me)",
                quickReplies: ["Looks outdated", "No mobile version", "Need online ordering", "Want AI features", "All of the above"]
            };
        }

        // GREETINGS - Enhanced
        else if (this.matchesPattern(msg, ['hello', 'hi ', 'hey', 'greetings', 'good morning', 'good afternoon'])) {
            response = {
                type: 'bot',
                text: "Hello! 👋 Great to meet you! I'm here to help you find the perfect website package.\n\nQuick question - what type of business are you running?",
                quickReplies: ["Restaurant/cafe", "Salon/spa", "Fitness/gym", "Other service business"]
            };
        }

        // THANKS - Enhanced
        else if (this.matchesPattern(msg, ['thank', 'thanks', 'appreciate'])) {
            response = {
                type: 'bot',
                text: "You're very welcome! 😊 Happy to help.\n\nIs there anything else you'd like to know? Or are you ready to get started?",
                quickReplies: ["I'm ready!", "Few more questions", "Show me demos", "I'll think about it"]
            };
        }

        // DEFAULT - Enhanced with better understanding
        else {
            response = {
                type: 'bot',
                text: "I want to make sure I give you the best answer! 🎯\n\nI can help with:\n\n💰 **Pricing & Packages** - Essential, Professional, or Premium?\n⏱️ **Timeline** - How fast can you deliver?\n🎨 **Examples** - Show me what you've built\n🤖 **AI Features** - What can the chatbot do?\n💬 **Support** - What happens after launch?\n📊 **Add-ons** - Photography, SEO, etc.\n🎯 **Recommendations** - Which package for my business?\n\nWhat would be most helpful right now?",
                quickReplies: ["Compare packages", "Show pricing", "See examples", "Recommend for me"]
            };
        }

        this.addMessage(response);
    }

    // Helper function for better pattern matching
    matchesPattern(text, patterns) {
        return patterns.some(pattern => {
            if (pattern.includes('*')) {
                // Convert wildcard to regex
                const regexPattern = pattern.replace(/\*/g, '.*');
                return new RegExp(regexPattern).test(text);
            }
            return text.includes(pattern);
        });
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when page loads
let chatbot;
document.addEventListener('DOMContentLoaded', () => {
    chatbot = new PricingChatbot();
});
