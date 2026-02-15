// AI Chatbot for Main Pricing Page
class PricingChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotHTML();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    createChatbotHTML() {
        const chatbotHTML = `
            <!-- Chatbot Toggle Button -->
            <button class="chatbot-toggle" id="chatbotToggle" aria-label="Open chat">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
            </button>

            <!-- Chatbot Container -->
            <div class="chatbot-container" id="chatbotContainer">
                <!-- Header -->
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

                <!-- Messages -->
                <div class="chatbot-messages" id="chatbotMessages"></div>

                <!-- Input Area -->
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
            text: "Hi! 👋 I'm your AI assistant. I can help you find the perfect website package for your business. What would you like to know?",
            quickReplies: [
                "What's included in each package?",
                "What's the difference between packages?",
                "How long does it take?",
                "Can I see examples?"
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
        }, 1000 + Math.random() * 1000);
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

    generateResponse(userMessage) {
        const lowerMsg = userMessage.toLowerCase();
        let response;

        // Package information
        if (lowerMsg.includes('essential') || lowerMsg.includes('$2') || lowerMsg.includes('2000')) {
            response = {
                type: 'bot',
                text: "The Essential Package ($2,000) is perfect for new businesses! It includes:\n\n✅ 5 professional pages\n✅ Mobile-responsive design\n✅ Contact form & Google Maps\n✅ Basic SEO setup\n✅ 1-2 week delivery\n✅ 30-day support\n\nBest for: New businesses, solopreneurs, tight budgets",
                quickReplies: ["View demo site", "Compare with other packages", "Get started"]
            };
        }
        else if (lowerMsg.includes('professional') || lowerMsg.includes('$5') || lowerMsg.includes('5000')) {
            response = {
                type: 'bot',
                text: "The Professional Package ($5,000) is our most popular! ⭐\n\nEverything in Essential PLUS:\n✅ AI Chatbot assistant\n✅ Advanced SEO & analytics\n✅ Newsletter integration\n✅ Blog/news section\n✅ Advanced animations\n✅ 2-3 week delivery\n✅ 60-day support\n\nBest for: Growing businesses ready to scale",
                quickReplies: ["View demo site", "What's the AI chatbot?", "Get started"]
            };
        }
        else if (lowerMsg.includes('premium') || lowerMsg.includes('$8') || lowerMsg.includes('8000')) {
            response = {
                type: 'bot',
                text: "The Premium Package ($8,000) is our flagship offering! 🥇\n\nEverything in Professional PLUS:\n✅ Online ordering/booking system\n✅ Customer accounts\n✅ Email automation\n✅ Admin dashboard\n✅ Priority support\n✅ 3-4 week delivery\n✅ 90-day support\n\nBest for: Established businesses, high-volume operations",
                quickReplies: ["View demo site", "Tell me about the dashboard", "Get started"]
            };
        }
        // Comparison questions
        else if (lowerMsg.includes('difference') || lowerMsg.includes('compare')) {
            response = {
                type: 'bot',
                text: "Here's a quick comparison:\n\n🥉 Essential ($2K): Basic 5-page site, perfect to get online\n\n🥈 Professional ($5K): Adds AI chatbot, advanced SEO, blog - our most popular!\n\n🥇 Premium ($8K): Full online ordering/booking, customer accounts, admin dashboard\n\nThe main differences are AI features and advanced functionality. What's most important for your business?",
                quickReplies: ["I need AI features", "I need online ordering", "Just getting started"]
            };
        }
        // Timeline questions
        else if (lowerMsg.includes('how long') || lowerMsg.includes('timeline') || lowerMsg.includes('delivery')) {
            response = {
                type: 'bot',
                text: "Great question! Delivery times are:\n\n⚡ Essential: 1-2 weeks\n⚡ Professional: 2-3 weeks\n⚡ Premium: 3-4 weeks\n\nWe also include revision rounds:\n• Essential: 2 rounds\n• Professional: 3 rounds\n• Premium: Unlimited\n\nMost clients launch within their package timeline!",
                quickReplies: ["What happens after launch?", "View packages", "Get started"]
            };
        }
        // Examples/demos
        else if (lowerMsg.includes('example') || lowerMsg.includes('demo') || lowerMsg.includes('sample')) {
            response = {
                type: 'bot',
                text: "I'd love to show you! We have three live demo sites:\n\n🌮 Mexican Restaurant (Essential Package)\n🍛 Indian Restaurant (Professional Package)\n🍱 Japanese Restaurant (Premium Package)\n\nEach demo shows exactly what you'll get. Scroll down to the 'See Our Work' section or I can link you directly!",
                quickReplies: ["Show me demos", "What's included?", "I'm ready to start"]
            };
        }
        // AI features
        else if (lowerMsg.includes('ai') || lowerMsg.includes('chatbot') || lowerMsg.includes('smart')) {
            response = {
                type: 'bot',
                text: "Our AI features are game-changers! 🚀\n\n✨ AI Chatbot:\n- Answers customer questions 24/7\n- Handles reservations/bookings\n- Provides menu recommendations\n- Understands dietary preferences\n\n✨ Smart Menu:\n- Dietary filtering (vegan, gluten-free, etc.)\n- Personalized recommendations\n- Ingredient information\n\nIncluded in Professional & Premium packages!",
                quickReplies: ["See it in action", "Which package?", "Get started"]
            };
        }
        // Pricing questions
        else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('how much')) {
            response = {
                type: 'bot',
                text: "We offer three clear pricing tiers:\n\n🥉 Essential: $2,000\n🥈 Professional: $5,000 (Most Popular!)\n🥇 Premium: $8,000\n\nNo hidden fees, no surprises. One-time payment includes everything listed in your package. Which features are most important to you?",
                quickReplies: ["Compare packages", "What's included?", "Payment options?"]
            };
        }
        // Support questions
        else if (lowerMsg.includes('support') || lowerMsg.includes('help after')) {
            response = {
                type: 'bot',
                text: "Support is included with every package!\n\n📧 Essential: 30 days of email support\n📧 Professional: 60 days of email support\n📧 Premium: 90 days of priority support\n\nAfter your support period, you can:\n• Extend support monthly\n• Purchase à la carte updates\n• Upgrade to a maintenance plan\n\nWe're here for the long haul!",
                quickReplies: ["What's included?", "View packages", "Get started"]
            };
        }
        // Getting started
        else if (lowerMsg.includes('start') || lowerMsg.includes('begin') || lowerMsg.includes('sign up')) {
            response = {
                type: 'bot',
                text: "Awesome! Here's how to get started:\n\n1️⃣ Choose your package (scroll up to view all three)\n2️⃣ Click 'Get Started' on your chosen package\n3️⃣ Fill out a quick form with your business info\n4️⃣ We'll contact you within 24 hours to begin!\n\nWant a quick recommendation based on your needs?",
                quickReplies: ["Yes, recommend a package", "I know which one", "View packages"]
            };
        }
        // Recommendations
        else if (lowerMsg.includes('recommend') || lowerMsg.includes('which') || lowerMsg.includes('should i')) {
            response = {
                type: 'bot',
                text: "I can help you choose! Let me ask:\n\nDo you already have a website, or is this your first one?",
                quickReplies: ["First website", "Replacing existing site", "Still deciding"]
            };
        }
        // Add-ons
        else if (lowerMsg.includes('addon') || lowerMsg.includes('add-on') || lowerMsg.includes('extra') || lowerMsg.includes('optional')) {
            response = {
                type: 'bot',
                text: "Great question! We offer these optional add-ons:\n\n📸 Photography Session - $750\n✍️ Content Writing - $400\n🔧 Monthly Maintenance - $100/mo\n🚀 SEO Package - $1,000\n📊 Google Analytics & Business - $300\n\nAdd-ons work with any package. Which interests you?",
                quickReplies: ["Tell me about photography", "What's included in SEO?", "Google Analytics details", "View packages"]
            };
        }
        else if (lowerMsg.includes('google analytics') || lowerMsg.includes('google business') || lowerMsg.includes('analytics')) {
            response = {
                type: 'bot',
                text: "Google Analytics & Business Setup ($300):\n\n📊 Complete Google Analytics 4 setup\n📍 Google Business Profile creation\n📈 Conversion tracking configuration\n🎯 Custom event tracking\n📱 Mobile app analytics (if applicable)\n📧 Weekly performance reports (first month)\n\nTrack your website's success from day one!",
                quickReplies: ["Add to my package", "Other add-ons?", "View packages"]
            };
        }
        else if (lowerMsg.includes('photogra') || lowerMsg.includes('photo')) {
            response = {
                type: 'bot',
                text: "Professional Photography ($750):\n\n📸 2-hour on-location shoot\n📸 15-20 edited high-res images\n📸 Food, interior, or product shots\n📸 All images optimized for web\n📸 Full commercial rights\n\nPerfect for restaurants and retail businesses!",
                quickReplies: ["Add to my package", "Other add-ons?", "View packages"]
            };
        }
        else if (lowerMsg.includes('maintenance') || lowerMsg.includes('ongoing')) {
            response = {
                type: 'bot',
                text: "Monthly Maintenance ($100/month):\n\n🔧 Content updates\n🔧 Security monitoring\n🔧 Weekly backups\n🔧 Plugin/software updates\n🔧 Performance optimization\n🔧 Priority email support\n\nKeep your site running smoothly!",
                quickReplies: ["Add to my package", "Other add-ons?", "View packages"]
            };
        }
        // Business type
        else if (lowerMsg.includes('restaurant') || lowerMsg.includes('cafe')) {
            response = {
                type: 'bot',
                text: "Perfect! Restaurants love our service. 🍽️\n\nMost restaurants choose:\n• Professional Package - if you want AI chatbot, SEO, and showcasing your menu\n• Premium Package - if you need online ordering and reservations\n\nWant to see our restaurant demos?",
                quickReplies: ["Show me demos", "I need online ordering", "Tell me more"]
            };
        }
        // Default responses
        else if (lowerMsg.includes('hello') || lowerMsg.includes('hi ') || lowerMsg === 'hi') {
            response = {
                type: 'bot',
                text: "Hello! 👋 Great to chat with you! I'm here to help you find the perfect website package for your business. What would you like to know?",
                quickReplies: ["Compare packages", "Show me examples", "How long does it take?"]
            };
        }
        else if (lowerMsg.includes('thank')) {
            response = {
                type: 'bot',
                text: "You're very welcome! 😊 Is there anything else you'd like to know about our packages?",
                quickReplies: ["View packages", "See demos", "Get started"]
            };
        }
        else {
            response = {
                type: 'bot',
                text: "I'd be happy to help with that! Here's what I can answer:\n\n💼 Package details & pricing\n⏱️ Timeline & delivery\n🎨 Features & examples\n🤖 AI capabilities\n💬 Support & next steps\n\nWhat would you like to know?",
                quickReplies: ["Compare all packages", "Show me pricing", "See examples", "How do I start?"]
            };
        }

        this.addMessage(response);
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
