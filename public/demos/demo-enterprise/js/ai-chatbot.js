// AI Chatbot for Restaurant Demo (Full Features)
class RestaurantChatbot {
    constructor(restaurantName = "Our Restaurant", cuisine = "Japanese") {
        this.restaurantName = restaurantName;
        this.cuisine = cuisine;
        this.isOpen = false;
        this.messages = [];
        this.cart = [];
        this.reservationData = {};
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
                            <h3 class="chatbot-title">AI Restaurant Assistant</h3>
                            <p class="chatbot-status">● Online - Here to help!</p>
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
                            placeholder="Ask me anything..."
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
        document.getElementById('chatbotToggle').addEventListener('click', () => this.toggleChat());
        document.getElementById('chatbotClose').addEventListener('click', () => this.toggleChat());
        document.getElementById('chatbotSend').addEventListener('click', () => this.sendMessage());

        const input = document.getElementById('chatbotInput');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        input.addEventListener('input', () => this.autoResize(input));
    }

    autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        document.getElementById('chatbotContainer').classList.toggle('active');
        document.getElementById('chatbotToggle').classList.toggle('active');
        if (this.isOpen) document.getElementById('chatbotInput').focus();
    }

    addWelcomeMessage() {
        this.addMessage({
            type: 'bot',
            text: `Welcome to ${this.restaurantName}! 👋 I'm your AI assistant.\n\nI can help you with:\n• 📅 Table reservations\n• 🍱 Menu questions & recommendations\n• 🌱 Dietary preferences\n• 🛒 Orders\n• ⏰ Hours & location\n\nHow can I assist you today?`,
            quickReplies: [
                "Make a reservation",
                "See the menu",
                "Gluten-free options?",
                "Hours & location"
            ]
        });
    }

    addMessage(message) {
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }

    renderMessage(message) {
        const container = document.getElementById('chatbotMessages');
        const messageHTML = `
            <div class="chatbot-message ${message.type}">
                ${message.type === 'bot' ? '<div class="message-avatar bot">🤖</div>' : ''}
                <div>
                    <div class="message-content">${message.text}</div>
                    ${message.quickReplies ? this.renderQuickReplies(message.quickReplies) : ''}
                </div>
                ${message.type === 'user' ? '<div class="message-avatar user">👤</div>' : ''}
            </div>
        `;
        container.insertAdjacentHTML('beforeend', messageHTML);
    }

    renderQuickReplies(replies) {
        return `<div class="quick-replies">
            ${replies.map(r => `<button class="quick-reply-btn" onclick="restaurantChatbot.handleQuickReply('${r.replace(/'/g, "\\'")}')">${r}</button>`).join('')}
        </div>`;
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
        const typing = `
            <div class="chatbot-message bot typing-message">
                <div class="message-avatar bot">🤖</div>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        document.getElementById('chatbotMessages').insertAdjacentHTML('beforeend', typing);
        this.scrollToBottom();
    }

    hideTyping() {
        const typing = document.querySelector('.typing-message');
        if (typing) typing.remove();
    }

    generateResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        let response;

        // Reservations
        if (msg.includes('reserv') || msg.includes('table') || msg.includes('book')) {
            response = {
                type: 'bot',
                text: "I'd be happy to help you book a table! 📅\n\nHow many guests will be dining?",
                quickReplies: ["2 people", "4 people", "6 people", "Large party (8+)"]
            };
        }
        else if (msg.match(/\d+\s*(people|person|guest)/)) {
            const num = msg.match(/\d+/)[0];
            response = {
                type: 'bot',
                text: `Perfect! A table for ${num}. What date would you like?`,
                quickReplies: ["Tonight", "Tomorrow", "This weekend", "Specific date"]
            };
        }
        else if (msg.includes('tonight') || msg.includes('today')) {
            response = {
                type: 'bot',
                text: "Great! What time works best for you tonight?\n\nAvailable times:\n⏰ 5:30 PM\n⏰ 7:00 PM\n⏰ 8:30 PM",
                quickReplies: ["5:30 PM", "7:00 PM", "8:30 PM"]
            };
        }

        // Menu questions
        else if (msg.includes('menu') || msg.includes('food') || msg.includes('dish')) {
            response = {
                type: 'bot',
                text: `Our menu features authentic ${this.cuisine} cuisine! 🍱\n\nPopular sections:\n• 🍜 Ramen & Noodles\n• 🍣 Sushi & Sashimi\n• 🍤 Appetizers\n• 🍵 Drinks & Desserts\n\nWould you like recommendations?`,
                quickReplies: ["Show me sushi", "What's popular?", "Vegetarian options", "See full menu"]
            };
        }

        // Dietary preferences
        else if (msg.includes('gluten') || msg.includes('gluten-free')) {
            response = {
                type: 'bot',
                text: "Yes! We have many gluten-free options:\n\n✅ Sashimi Platter\n✅ Edamame\n✅ Miso Soup (with GF miso)\n✅ Rice bowls (with tamari sauce)\n✅ Gyoza (GF version available)\n\nAll items are prepared in a separate area to avoid cross-contamination.",
                quickReplies: ["Order gluten-free", "Other dietary options", "Make reservation"]
            };
        }
        else if (msg.includes('vegan') || msg.includes('vegetarian')) {
            response = {
                type: 'bot',
                text: "We love our plant-based guests! 🌱\n\nVegan options:\n🥗 Vegetable Ramen\n🥗 Edamame\n🥗 Vegetable Sushi Rolls\n🥗 Tofu Teriyaki\n🥗 Miso Soup\n\nAll made with no animal products!",
                quickReplies: ["Order vegan", "Tell me more", "See full menu"]
            };
        }
        else if (msg.includes('allerg') || msg.includes('nut') || msg.includes('shellfish')) {
            response = {
                type: 'bot',
                text: "Safety first! 🛡️ Please let us know about any allergies.\n\nCommon allergens we can accommodate:\n• Nuts & peanuts\n• Shellfish\n• Soy\n• Eggs\n• Dairy\n\nOur chef can modify most dishes. What allergen should we avoid?",
                quickReplies: ["No nuts", "No shellfish", "Multiple allergies", "Speak to chef"]
            };
        }

        // Recommendations
        else if (msg.includes('recommend') || msg.includes('popular') || msg.includes('best') || msg.includes('favorite')) {
            response = {
                type: 'bot',
                text: "Our most popular dishes are: ⭐\n\n1. 🍜 Tonkotsu Ramen - Rich pork broth, $16\n2. 🍣 Chef's Sushi Platter - 18 pieces, $32\n3. 🦐 Spicy Miso Ramen - Fan favorite!, $17\n4. 🍱 Chirashi Bowl - Fresh sashimi over rice, $28\n\nAll amazing choices! What sounds good?",
                quickReplies: ["Tell me about #1", "I'll take #2", "Something lighter", "Vegetarian option"]
            };
        }

        // Ordering
        else if (msg.includes('order') || msg.includes('buy') || msg.includes('take') || msg.match(/i'?ll (have|take|get)/)) {
            response = {
                type: 'bot',
                text: "Perfect! 🛒 I can help you order.\n\nWould you like:\n📦 Pickup (ready in 20-30 min)\n🚗 Delivery (45-60 min)\n🍽️ Dine-in (with reservation)",
                quickReplies: ["Pickup", "Delivery", "Dine-in"]
            };
        }
        else if (msg.includes('pickup')) {
            response = {
                type: 'bot',
                text: "Great! Pickup orders are ready in 20-30 minutes. 📦\n\nWhat would you like to order? (You can say item names or ask for the menu)",
                quickReplies: ["Show me the menu", "Tonkotsu Ramen", "Sushi platter", "Recommendations"]
            };
        }
        else if (msg.includes('delivery')) {
            response = {
                type: 'bot',
                text: "We deliver within 5 miles! 🚗 Estimated time: 45-60 minutes.\n\nMinimum order: $15\nDelivery fee: $3.99\n\nWhat would you like to order?",
                quickReplies: ["Show menu", "Popular items", "Add to cart"]
            };
        }

        // Hours & Location
        else if (msg.includes('hour') || msg.includes('open') || msg.includes('close') || msg.includes('when')) {
            response = {
                type: 'bot',
                text: "We're open: ⏰\n\n📅 Monday-Thursday: 11:30 AM - 9:30 PM\n📅 Friday-Saturday: 11:30 AM - 10:30 PM\n📅 Sunday: 12:00 PM - 9:00 PM\n\nKitchen closes 30 minutes before closing time.",
                quickReplies: ["Make a reservation", "Get directions", "Call restaurant"]
            };
        }
        else if (msg.includes('where') || msg.includes('location') || msg.includes('address') || msg.includes('direction')) {
            response = {
                type: 'bot',
                text: "Find us at: 📍\n\n123 Main Street\nDowntown District\nCity, ST 12345\n\n📞 Phone: (555) 123-4567\n\nWe're right across from City Park with free parking available!",
                quickReplies: ["Get directions", "Make reservation", "See menu"]
            };
        }

        // Pricing questions
        else if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
            response = {
                type: 'bot',
                text: "Our pricing: 💰\n\n🍜 Ramen: $14-$18\n🍣 Sushi rolls: $8-$16\n🍱 Bento boxes: $16-$24\n🍤 Appetizers: $6-$12\n🍵 Drinks: $3-$8\n\nMost entrees $12-$20. Want to see the full menu?",
                quickReplies: ["Show full menu", "Daily specials?", "Lunch combos?"]
            };
        }

        // Specials
        else if (msg.includes('special') || msg.includes('deal') || msg.includes('discount') || msg.includes('lunch')) {
            response = {
                type: 'bot',
                text: "Today's specials: 🎉\n\n🌟 Lunch Combo (11:30-3pm): Any ramen + gyoza + drink = $18\n🌟 Happy Hour (4-6pm): 20% off appetizers\n🌟 Sushi Tuesday: Buy 2 rolls, get 1 free\n\nAlso check out our seasonal menu!",
                quickReplies: ["Order lunch combo", "Make reservation", "Seasonal menu"]
            };
        }

        // Greetings
        else if (msg.includes('hello') || msg.includes('hi ') || msg === 'hi' || msg.includes('hey')) {
            response = {
                type: 'bot',
                text: "Hello! 👋 Welcome to " + this.restaurantName + "! How can I help you today?",
                quickReplies: ["Make a reservation", "See the menu", "Hours & location", "Order food"]
            };
        }
        else if (msg.includes('thank')) {
            response = {
                type: 'bot',
                text: "You're very welcome! 😊 We're here to help. Anything else you need?",
                quickReplies: ["Make reservation", "Order food", "That's all, thanks!"]
            };
        }

        // Default
        else {
            response = {
                type: 'bot',
                text: "I can help you with:\n\n📅 Reservations & bookings\n🍱 Menu & recommendations\n🌱 Dietary preferences\n🛒 Food ordering\n📍 Hours & location\n💰 Pricing & specials\n\nWhat would you like to know?",
                quickReplies: ["Make a reservation", "See menu", "Order food", "Hours & location"]
            };
        }

        this.addMessage(response);
    }

    scrollToBottom() {
        const container = document.getElementById('chatbotMessages');
        container.scrollTop = container.scrollHeight;
    }
}

// Initialize restaurant chatbot
let restaurantChatbot;
document.addEventListener('DOMContentLoaded', () => {
    // You can customize the restaurant name and cuisine type
    restaurantChatbot = new RestaurantChatbot("Sakura Japanese Cuisine", "Japanese");
});
