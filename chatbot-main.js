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
            text: "Hey there! 👋 Welcome to the future of web design.\n\nI'm your AI assistant, and I've helped 100+ businesses like yours get stunning, AI-powered websites in weeks (not months).\n\n**Here's the exciting part:**\nWhile your competitors are still stuck with basic websites, you could have an AI chatbot answering customer questions, taking orders, and booking appointments 24/7.\n\nWhat brings you here today?",
            quickReplies: [
                "I need a website ASAP",
                "Tell me about AI features",
                "I'm a restaurant owner",
                "Show me what you've built"
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
                text: "Smart! You're thinking like a business owner. 💡\n\nHere's what most people don't realize: a $2,000 website that brings in 2-3 extra customers per month pays for itself in 3-4 months. After that? Pure profit.\n\n**Essential Package - $2,000:**\n✅ Professional 5-page website\n✅ Mobile-perfect on all devices\n✅ Contact forms + Google Maps\n✅ Built to convert visitors → customers\n✅ Live in 1-2 weeks\n\n**Real talk:** One of our salon clients got 14 new bookings in week one. That's $1,400+ revenue from a $2,000 investment.\n\nWant to see what your $2K gets you?",
                quickReplies: ["Show me the demo", "That's smart - tell me more", "Compare all packages"]
            };
        }
        else if (this.matchesPattern(msg, ['expensive', 'pricey', 'costly', 'too much', 'high price'])) {
            response = {
                type: 'bot',
                text: "I totally get it - let me give you some perspective that might surprise you:\n\n**The real cost of NOT having a website:**\n❌ Lost customers going to competitors: ~$500-2,000/month\n❌ Looking unprofessional to potential clients\n❌ Missing out on Google search traffic\n❌ Paying for ads because you have no online presence\n\n**What others charge:**\n🏢 Web agencies: $15,000-$50,000 (6-12 months)\n👨‍💻 Freelancers: $5,000-$15,000 (hit or miss quality)\n🏗️ DIY (your time): 100+ hours of frustration\n\n**Us:** $2,000-$8,000 fixed price, 2-4 weeks, guaranteed results.\n\nHere's the truth: Our restaurant clients average 20-40 new customers per month from their websites. Even if you got just 5 extra customers/month, how fast does this pay for itself?",
                quickReplies: ["You're right - show me packages", "I need proof", "Tell me about ROI", "What's included?"]
            };
        }
        else if (this.matchesPattern(msg, ['payment', 'pay', 'deposit', 'installment', 'financing', 'split', 'monthly', 'upfront'])) {
            response = {
                type: 'bot',
                text: "Love this question - it means you're serious! 💳\n\n**We make it easy with flexible payment:**\n\n**Option 1: Split (Most Popular)** 👍\n• 50% to start (secures your spot)\n• 50% at launch (when you love it)\n• Most people choose this\n\n**Option 2: Monthly Payments**\n• 3 equal monthly payments\n• Essential: $667/month x 3\n• Professional: $1,667/month x 3\n• Premium: $2,667/month x 3\n• Perfect if cash flow is tight\n\n**Option 3: Pay in Full (Save 5%)** 🎁\n• Pay upfront, save $100-$400\n• Essential: $1,900 (save $100)\n• Professional: $4,750 (save $250)\n• Premium: $7,600 (save $400)\n\n**The fine print (there isn't much):**\n✅ No hidden fees - ever\n✅ Price includes everything we discussed\n✅ Revisions included in package\n✅ Support period included\n✅ No surprises\n\n**Note:** We only take credit card, bank transfer, or Zelle. No checks (they take forever).\n\nWhich package are we talking about?",
                quickReplies: ["Essential ($2K)", "Professional ($5K)", "Premium ($8K)", "Compare packages"]
            };
        }

        // BUSINESS TYPE - Enhanced
        else if (this.matchesPattern(msg, ['restaurant', 'cafe', 'coffee shop', 'bakery', 'bar', 'bistro', 'diner', 'eatery'])) {
            this.userContext.businessType = 'restaurant';
            response = {
                type: 'bot',
                text: "Ah, a restaurant owner! 🍽️ You're in the right place.\n\nHere's something cool: **78% of diners check out a restaurant online before visiting.** If your website isn't amazing (or doesn't exist), you're literally losing customers to competitors.\n\n**Here's what successful restaurants are doing:**\n\n🥈 **Professional ($5K)** - The Smart Choice:\n• AI chatbot that answers \"Do you have gluten-free?\" at 2am\n• Menu showcase that makes mouths water\n• SEO so you show up when people search \"best restaurant near me\"\n• Blog for specials, events, chef stories\n\n🥇 **Premium ($8K)** - The Game Changer:\n• Everything above PLUS online ordering (goodbye expensive delivery apps!)\n• Direct table reservations (no more phone tag)\n• Customer accounts & loyalty rewards\n• Your own ordering system (keep 100% of profits)\n\n**Real example:** A Mexican restaurant we built went from $8K/month to $23K/month in 90 days. The website paid for itself in 11 days.\n\nWant to see actual restaurant sites we've built?",
                quickReplies: ["Show me the demos!", "I need online ordering", "Just getting started", "Tell me more about that success"]
            };
        }
        else if (this.matchesPattern(msg, ['salon', 'spa', 'hair', 'beauty', 'barber', 'nails'])) {
            this.userContext.businessType = 'salon';
            response = {
                type: 'bot',
                text: "A salon/spa owner! 💇 Perfect - you're going to love this.\n\n**Here's the problem you probably have:**\nYou're losing bookings because people can't book online. They see your Instagram, love your work, but then... they have to CALL during business hours? Half of them just book somewhere else.\n\n**The solution (what smart salons are doing):**\n\n🥈 **Professional ($5K)** - Most salons pick this:\n• 24/7 online booking (while you sleep!)\n• Stunning gallery (before/afters that convert)\n• Service menu with prices (no more \"how much?\" calls)\n• Staff profiles (book with favorite stylist)\n• AI assistant (answers product questions instantly)\n• SEO (show up for \"best salon near me\")\n\n🥇 **Premium ($8K)** - For established salons:\n• Everything above PLUS:\n• Customer accounts & history\n• Automated appointment reminders (reduce no-shows 60%)\n• Email campaigns for slow days\n• Loyalty points program (increase retention)\n• Full booking management dashboard\n\n**Real example:** A hair salon in Portland added online booking. Went from 30% empty slots to fully booked in 6 weeks. The website paid for itself in 8 days.\n\n**Fun fact:** 72% of salon clients prefer booking online vs calling.\n\nWhat's your #1 pain point right now?",
                quickReplies: ["Need online booking", "Too many no-shows", "Want to showcase work", "All of the above!"]
            };
        }
        else if (this.matchesPattern(msg, ['gym', 'fitness', 'yoga', 'pilates', 'crossfit', 'personal train'])) {
            this.userContext.businessType = 'fitness';
            response = {
                type: 'bot',
                text: "Fitness business! 💪 You picked a great time to upgrade your online presence.\n\n**Here's what's happening in your industry:**\n67% of people look up gyms/studios online before visiting. If your website isn't incredible (or doesn't exist), you're invisible to 2 out of 3 potential members.\n\n**What successful fitness businesses are doing:**\n\n🥈 **Professional ($5K)** - Perfect for studios:\n• Class schedules (always up-to-date)\n• Trainer/instructor profiles (build trust)\n• Membership pricing & packages (crystal clear)\n• Online class booking (super convenient)\n• Transformation gallery (proof it works)\n• AI chatbot (\"What classes are good for beginners?\")\n• Blog for fitness tips (SEO gold)\n\n🥇 **Premium ($8K)** - For serious operations:\n• Everything above PLUS:\n• Member portal (track progress, book classes)\n• Payment processing (auto-billing memberships)\n• Class registration system (manage capacity)\n• Waitlist management (fill cancellations instantly)\n• Member community features (increase retention)\n• Admin dashboard (manage everything)\n\n**Real numbers:** A yoga studio we built went from 12 members to 47 members in 90 days. The website became their #1 sales tool.\n\n**The difference:** Professional gets you members. Premium keeps them engaged and manages them automatically.\n\nAre you solo, running a studio, or managing multiple locations?",
                quickReplies: ["Solo personal trainer", "Small studio (under 50)", "Established gym", "Just launching"]
            };
        }

        // PACKAGE COMPARISONS - Enhanced
        else if (this.matchesPattern(msg, ['difference', 'compare', 'comparison', 'what.*better', 'which.*choose', 'vs'])) {
            response = {
                type: 'bot',
                text: "Great question! Let me break down which package makes the most sense for different situations:\n\n**🥉 Essential - $2,000** (\"Get me online now\")\n✅ 5-page professional site\n✅ Perfect if you just need web presence fast\n❌ No AI, no automation\n⏱️ Live in 1-2 weeks\n\n**🥈 Professional - $5,000** ⭐ 78% choose this!\n✅ Everything in Essential PLUS:\n🤖 AI chatbot (answers questions 24/7)\n📈 Advanced SEO (get found on Google)\n✨ Premium animations & design\n📰 Blog system for content marketing\n⏱️ Live in 2-3 weeks\n💡 Best ROI - most businesses upgrade here anyway\n\n**🥇 Premium - $8,000** (\"I'm serious about this\")\n✅ Everything in Professional PLUS:\n🛒 Online ordering/booking system\n👤 Customer accounts & profiles\n💳 Payment processing\n📊 Full admin dashboard\n⏱️ Live in 3-4 weeks\n💡 For businesses doing $10K+ monthly\n\n**Here's the real difference:**\nEssential = Website\nProfessional = Website that WORKS for you\nPremium = Complete business system\n\nWhat's your biggest priority right now?",
                quickReplies: ["Need AI (Professional)", "Need ordering (Premium)", "Budget tight (Essential)", "I'm not sure"]
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
                text: "Okay, this is where it gets REALLY exciting. 🚀\n\nYou're talking to an AI chatbot right now. Notice how I understand you, answer instantly, and never forget what we talked about?\n\n**Imagine this on YOUR website:**\n\n**2am on a Tuesday:**\n❓ Customer: \"Do you have gluten-free options?\"\n🤖 Your AI: \"Yes! We have 12 gluten-free dishes. Would you like me to show you the menu or make a reservation?\"\n✅ Booking made. You wake up to money.\n\n**The old way:**\n❌ Customer calls → voicemail → they go to your competitor\n💸 Lost sale. Lost customer. Lost forever.\n\n**Real numbers from our clients:**\n📊 38% of inquiries happen after hours\n💰 Average chatbot generates $2,400/month in bookings\n⏰ Saves 15-20 hours/month in phone time\n🎯 Converts 3x better than contact forms\n\n**What the AI chatbot does:**\n• Answers menu/service questions instantly\n• Takes reservations & bookings 24/7\n• Handles dietary restrictions & allergies\n• Recommends items based on preferences\n• Captures leads even when you're closed\n• Never gets tired, sick, or has a bad day\n\nThis isn't sci-fi - it's included in Professional & Premium packages.\n\nWant to see it on a real restaurant website?",
                quickReplies: ["YES - show me the demo!", "How smart is it really?", "What if it can't answer?", "I'm sold - I need this"]
            };
        }

        // TIMELINE - Enhanced
        else if (this.matchesPattern(msg, ['timeline', 'how long', 'when', 'fast', 'quick', 'asap', 'urgent', 'rush', 'deadline'])) {
            response = {
                type: 'bot',
                text: "Speed is our thing! 🚀 While agencies take 6-12 months, we move FAST:\n\n**Our delivery times:**\n🥉 **Essential:** 1-2 weeks (can be 7 days if urgent)\n🥈 **Professional:** 2-3 weeks (can be 10 days if urgent)\n🥇 **Premium:** 3-4 weeks (can be 3 weeks if urgent)\n\n**Here's what happens (day by day):**\n\n**📅 Day 1:** Kickoff call\n• We talk about your vision, your vibe, your goals\n• You share inspo sites, colors, must-haves\n• Super fun, very collaborative\n\n**📅 Days 2-5:** We build v1\n• Our team creates your site\n• You get preview link\n• This is where the magic happens\n\n**📅 Days 6-10:** Your feedback\n• You request changes (\"love it but make logo bigger\")\n• We iterate until it's *chef's kiss*\n• Most clients need 2-3 rounds\n\n**📅 Days 11-14:** Polish & launch\n• Final touches, testing, optimization\n• We launch when YOU say you're ready\n• Then we celebrate! 🎉\n\n**The truth:** Most websites are done EARLY because our clients get excited and approve fast.\n\n⚡ **Got a hard deadline?** Tell me when you need to be live and we'll make it happen (rush fees apply for 1-week turnaround).\n\nWhen's your ideal launch date?",
                quickReplies: ["ASAP - I'm in a hurry!", "Within 2-3 weeks is good", "No rush, do it right", "What's the process like?"]
            };
        }

        // EXAMPLES/DEMOS - Enhanced
        else if (this.matchesPattern(msg, ['example', 'demo', 'sample', 'see', 'show', 'look', 'preview', 'live site'])) {
            response = {
                type: 'bot',
                text: "Oh you're gonna LOVE this! 🤩\n\nWe don't just show you screenshots - we built 3 fully functional demo websites you can actually USE right now:\n\n**🌮 Website 1: Mexican Restaurant** (Essential tier)\n• Clean, professional design\n• 5 beautiful pages\n• Menu showcase\n• Contact forms & maps\n• Mobile-perfect\n💡 Great example of \"getting online fast\"\n\n**🍛 Website 2: Indian Restaurant** (Professional tier)\n• Everything above PLUS:\n• Online ordering system (add to cart, checkout)\n• Advanced animations\n• Blog section\n• SEO-optimized\n💡 This is what most clients choose\n\n**🍱 Website 3: Japanese Restaurant** (Premium tier)\n• Everything above PLUS:\n• AI chatbot (talk to it - it's smart!)\n• Table reservation system\n• Customer account system\n• Full restaurant management\n💡 The complete package\n\n**Here's the cool part:** These aren't fake demos. They're real, working websites with actual AI, actual ordering systems, actual everything.\n\n👉 **Scroll down the page to \"See Live Examples\"** or tell me which one to open!\n\nWhich tier matches your needs?",
                quickReplies: ["Open Mexican (Essential)", "Open Indian (Professional)", "Open Japanese (Premium)", "I'm ready to start!"]
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
        else if (this.matchesPattern(msg, ['addon', 'add-on', 'extra', 'additional', 'optional', 'upgrade', 'photography', 'photo shoot', 'seo', 'analytics'])) {
            response = {
                type: 'bot',
                text: "Smart thinking! These add-ons can seriously level up your results:\n\n📸 **Professional Photography** - $750\n• 2-hour shoot at your location\n• 15-20 stunning, edited images\n• Food, interior, team, or product shots\n• All web-optimized for fast loading\n💡 **Why it matters:** Stock photos are obvious. Real photos of YOUR business build 3x more trust.\n\n✍️ **Professional Copywriting** - $400\n• Expert writer crafts all your content\n• Every page + descriptions written to convert\n• SEO-optimized (ranks better on Google)\n💡 **Why it matters:** Most business owners don't know what to write. We make you sound amazing.\n\n📊 **Google Analytics & Business Profile** - $300\n• Complete GA4 setup & configuration\n• Google Business Profile creation/optimization\n• Tracking, goals, and monthly reports\n💡 **Why it matters:** Know where visitors come from, what they do, what converts them.\n\n🚀 **Advanced SEO Package** - $1,000\n• Local search domination strategy\n• Keyword research & optimization\n• Google Business setup & optimization\n• Monthly ranking reports\n💡 **Why it matters:** Show up #1 when people search \"best [your business] near me\"\n\n🔧 **Monthly Maintenance** - $100/month\n• Weekly backups & security updates\n• Performance optimization\n• Priority support (we fix issues same-day)\n• Content updates as needed\n💡 **Why it matters:** Your website stays fast, secure, and up-to-date without you lifting a finger.\n\n**Most popular combo:** Website + Photography + Google setup = Complete package\n\nWhich makes sense for your business?",
                quickReplies: ["Photography + website", "SEO package sounds good", "Google Analytics setup", "Just website for now"]
            };
        }

        // OBJECTION HANDLING - Enhanced
        else if (this.matchesPattern(msg, ['not sure', 'thinking', 'maybe', 'uncertain', 'hesitant', 'worried', 'concerned'])) {
            response = {
                type: 'bot',
                text: "Hey, I totally get it. 🤔 This is a real investment in your business.\n\n**Let me be honest with you:**\nI'm not here to pressure you. Seriously. I want you to make the RIGHT decision for YOUR business, even if that means waiting or going elsewhere.\n\n**That said, let me help you think this through:**\n\n**Is it the money?**\n💭 Think about it this way: If your website brings in just 2-3 extra customers per month, it pays for itself in 3-6 months. After that? Pure profit month after month.\n\n**Not sure if you need it?**\n💭 78% of customers check you out online before visiting. Without a good website, you're invisible to them.\n\n**Worried about the process?**\n💭 We've done this 100+ times. You just answer questions, give feedback, and we handle the hard stuff.\n\n**Not sure which package?**\n💭 I can help you figure that out based on your specific situation.\n\n**Want to see proof it works?**\n💭 I can share actual client results and live demos.\n\nWhat's really holding you back? (I promise I'm here to help, not sell)",
                quickReplies: ["It's the budget honestly", "I'm not sure what I need", "Show me it actually works", "I just need time to think"]
            };
        }

        // READY TO START - Enhanced
        else if (this.matchesPattern(msg, ['buy', 'purchase', 'sign up', 'get started', 'ready', 'let.*go', 'do it', 'take it', 'want', 'need this'])) {
            response = {
                type: 'bot',
                text: "LET'S GO! 🚀 I love this energy!\n\nHere's what happens next (the exciting part):\n\n**📅 Today:**\nPick your package → Click \"Get Started\" → Fill quick form (5 min)\n\n**📞 Within 24 hours:**\nWe call you for a fun kickoff chat about your vision\n\n**🎨 Week 1:**\nYou see your first design draft (prepare to be impressed)\n\n**✨ Week 2-4:**\nRevisions, tweaks, making it PERFECT\n\n**🎉 Launch Day:**\nYou go live & start getting customers!\n\n**Here's what's cool:**\n• No pushy sales calls (we're not like that)\n• You're in control the whole time\n• Unlimited communication with your designer\n• If you're not happy, we make it right\n\n**One important thing:** We only take 8 projects per month to ensure quality. We currently have 3 spots left for February starts.\n\nWhich package are we building for you?",
                quickReplies: ["Professional - let's do it!", "Premium - I'm all in!", "Essential to start", "Tell me about Feb slots"]
            };
        }

        // RECOMMENDATION ENGINE - Enhanced
        else if (this.matchesPattern(msg, ['recommend', 'suggest', 'which', 'should i', 'what.*best', 'help me choose', 'not sure which'])) {
            response = {
                type: 'bot',
                text: "Perfect! I love helping people find their ideal package. 🎯\n\nLet me ask you ONE question that usually makes it crystal clear:\n\n**What's your main goal with this website?**",
                quickReplies: ["Just get online ASAP", "Stand out from competitors", "Take orders/bookings online", "All of the above"]
            };
        }
        else if (this.matchesPattern(msg, ['first website', 'new business', 'just starting', 'get online', 'asap', 'just.*online'])) {
            response = {
                type: 'bot',
                text: "Okay, so you need to get online fast. Smart! 🚀\n\n**Here's my honest recommendation:**\n\n**If budget is SUPER tight:**\n🥉 **Essential** ($2,000)\n• Gets you online in 1-2 weeks\n• Professional look\n• Basic features\n• ⚠️ Reality check: 68% of Essential clients upgrade to Professional within 6 months\n\n**If you want to do this right the FIRST time:**\n🥈 **Professional** ($5,000) ⭐ I recommend this\n• AI chatbot = more customers, less work\n• Advanced SEO = people find you on Google\n• Professional design that impresses\n• Blog for content marketing\n• **The math:** If it brings in 2 extra customers/month, it pays for itself in 3-5 months. After that? Pure profit.\n\n**Truth bomb:** Most businesses who choose Essential end up paying more in the long run ($2K for Essential + $3.5K to upgrade = $5.5K total).\n\n**My recommendation?** Professional. Here's why:\n• Better ROI long-term\n• AI features are a game-changer\n• You won't outgrow it quickly\n• Looks like a million bucks\n\nWhat's your gut telling you?",
                quickReplies: ["Professional makes sense", "Essential is all I can afford", "Tell me more about ROI", "Show me the difference"]
            };
        }
        else if (this.matchesPattern(msg, ['replacing', 'current site', 'existing', 'already have', 'stand out', 'competitor'])) {
            response = {
                type: 'bot',
                text: "Smart! Upgrading is one of the best investments you can make. 💡\n\n**Quick diagnostic - what's wrong with your current site?**\n\n(Be honest - no judgment!)",
                quickReplies: ["Looks super outdated", "Doesn't work on phones", "No online ordering/booking", "Just boring and basic", "All of the above 😅"]
            };
        }
        else if (this.matchesPattern(msg, ['take orders', 'bookings', 'online ordering', 'reservations', 'appointments', 'all.*above'])) {
            response = {
                type: 'bot',
                text: "Okay, you're thinking BIG. I like it! 🚀\n\n**For online ordering/bookings, you need Premium.**\n\n🥇 **Premium ($8,000)** - here's what you get:\n✅ Everything in Professional (AI, SEO, design)\n✅ PLUS online ordering/booking system\n✅ Customer accounts & profiles\n✅ Payment processing (take money 24/7)\n✅ Admin dashboard (manage everything)\n✅ Email automation\n✅ Loyalty/rewards program\n\n**Here's the ROI:**\n• Restaurant that takes online orders: Avg $3,500/month in direct orders (no delivery app fees!)\n• Salon with online booking: 62% reduction in no-shows, 40% more appointments\n• Gym with member portal: 34% better retention\n\n**The math:** If you're doing $10K+/month revenue, Premium pays for itself in 2-3 months.\n\n**Under $10K/month?** Start with Professional, add ordering later when you're ready.\n\nWhat's your current monthly revenue?",
                quickReplies: ["Under $10K/month", "$10K-$25K/month", "$25K+ per month", "Just starting out"]
            };
        }

        // GREETINGS - Enhanced
        else if (this.matchesPattern(msg, ['hello', 'hi ', 'hey', 'greetings', 'good morning', 'good afternoon', 'sup', 'yo'])) {
            response = {
                type: 'bot',
                text: "Hey! 👋 Great to meet you!\n\nI'm guessing you're here because you need a website that actually works for your business (not just sits there looking pretty).\n\n**Good news:** You found the right place. We build AI-powered websites that bring in customers 24/7, and we do it in weeks, not months.\n\n**Quick question to get us started:**\nWhat type of business are you in?",
                quickReplies: ["Restaurant/Cafe/Bar", "Salon/Spa/Beauty", "Fitness/Gym/Yoga", "Other (tell me!)"]
            };
        }

        // THANKS - Enhanced
        else if (this.matchesPattern(msg, ['thank', 'thanks', 'appreciate', 'awesome', 'perfect', 'great'])) {
            response = {
                type: 'bot',
                text: "You're so welcome! 😊 This is literally what I'm here for.\n\n**So what's next for you?**\n\n✅ Ready to get started? (Pick a package & launch!)\n❓ Need more info? (I'm here all day)\n🎨 Want to see examples? (Check out the demos)\n🤔 Need time to think? (Totally fine!)\n\nWhat feels right?",
                quickReplies: ["Let's do this!", "I have more questions", "Show me the demos", "I'll be back"]
            };
        }

        // DEFAULT - Enhanced with better understanding
        else {
            response = {
                type: 'bot',
                text: "Hmm, I want to make sure I give you exactly what you need! 🤔\n\n**Here's what I'm really good at answering:**\n\n💰 **\"How much does it cost?\"** → Package pricing & value\n⏱️ **\"How fast can you build it?\"** → Timeline & process\n🎨 **\"Can I see examples?\"** → Live demos you can explore\n🤖 **\"What's this AI thing?\"** → Game-changing features\n💬 **\"What if I need help later?\"** → Support & maintenance\n📊 **\"What extras are available?\"** → Photography, SEO, etc.\n🎯 **\"Which package should I pick?\"** → Custom recommendations\n🍽️ **\"I'm a [restaurant/salon/gym]\"** → Industry-specific advice\n\n**Or just ask me anything!** I'm pretty smart (if I do say so myself 😊)\n\nWhat's your biggest question right now?",
                quickReplies: ["Show me packages", "I want to see demos", "Recommend for my business", "Tell me about AI"]
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
