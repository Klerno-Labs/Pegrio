/* ========================================
   CHATBOT CORE ORCHESTRATOR
   Main controller that ties all modules together
   ======================================== */

const ChatbotCore = {
    // Initialization state
    isInitialized: false,
    isProcessing: false,

    // Current context
    context: null,

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Initialize chatbot system
     */
    init() {
        if (this.isInitialized) {
            console.warn('Chatbot already initialized');
            return;
        }

        if (ChatbotConfig.DEBUG_MODE) {
            console.log('%c🤖 Initializing Advanced Chatbot System...', 'font-size: 14px; font-weight: bold; color: #667EEA;');
        }

        try {
            // Initialize UI
            ChatbotUI.init();

            // Initialize session (or restore from storage)
            this.context = ChatbotConversationMemory.getSession();

            // Attach event listeners
            this.attachEventListeners();

            // Send welcome message if new session
            if (this.context.messageCount === 0) {
                this.sendWelcomeMessage();
            } else {
                // Restore previous messages from session
                this.restoreMessages();
            }

            this.isInitialized = true;

            if (ChatbotConfig.DEBUG_MODE) {
                console.log('%c✅ Chatbot Initialized Successfully!', 'font-size: 14px; color: #30d158;');
                console.log('%cModules loaded: NLP Engine, Conversation Flow, Lead Qualifier, Recommendation, Form Integrator, UI', 'font-size: 12px; color: #8e8e93;');
            }

        } catch (error) {
            console.error('Failed to initialize chatbot:', error);
            this.showError('Failed to load chatbot. Please refresh the page.');
        }
    },

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // User sends message
        ChatbotUI.on('chatbot:send', (e) => {
            this.handleUserMessage(e.detail.text);
        });

        // Quick reply clicked
        ChatbotUI.on('chatbot:quickreply', (e) => {
            this.handleUserMessage(e.detail.value || e.detail.text);
        });

        // Window opened
        ChatbotUI.on('chatbot:open', () => {
            this.onWindowOpen();
        });

        // Window closed
        ChatbotUI.on('chatbot:close', () => {
            this.onWindowClose();
        });
    },

    // ========================================
    // WELCOME MESSAGE
    // ========================================

    /**
     * Send welcome message
     */
    sendWelcomeMessage() {
        setTimeout(() => {
            const welcomeText = ChatbotResponseGenerator.generate(
                ChatbotConfig.STATES.WELCOME,
                'greeting',
                this.getContext()
            );

            this.sendBotMessage(welcomeText);

            // Show quick replies for common intents
            this.showQuickReplies([
                'I need a website',
                'How much does it cost?',
                'Tell me about packages'
            ]);

        }, 500);
    },

    /**
     * Restore messages from session
     */
    restoreMessages() {
        const messages = ChatbotConversationMemory.getMessages();

        messages.forEach(msg => {
            if (msg.role === 'user') {
                ChatbotUI.addMessage(msg.text, 'user', { showTime: false });
            } else {
                ChatbotUI.addMessage(msg.text, 'bot', { showTime: false });
            }
        });
    },

    // ========================================
    // MESSAGE HANDLING
    // ========================================

    /**
     * Handle user message
     * @param {string} text
     */
    async handleUserMessage(text) {
        if (this.isProcessing) return;

        this.isProcessing = true;

        try {
            // Save user message
            ChatbotConversationMemory.addMessage('user', text);

            // Process with NLP engine
            const nlpResult = ChatbotNLPEngine.process(text, this.getContext());

            // Update entities
            ChatbotConversationMemory.updateEntities(nlpResult.entities);

            // Add intent to history
            ChatbotConversationMemory.addIntent(nlpResult.intent.name, nlpResult.intent.confidence);

            // Calculate lead score
            const userProfile = ChatbotConversationMemory.getUserProfile();
            const context = this.getContext();
            const leadScore = ChatbotLeadQualifier.calculateScore(userProfile, context);

            // Update lead score
            ChatbotConversationMemory.updateLeadScore(leadScore.score, leadScore.level);

            // Get recommendation (if ready)
            if (ChatbotConversationFlow.shouldRecommend(context)) {
                const recommendation = ChatbotRecommendation.recommend(userProfile, leadScore.score);
                ChatbotConversationMemory.setRecommendation(recommendation.package);
            }

            // Determine next state
            const currentState = ChatbotConversationMemory.getCurrentState();
            const nextState = ChatbotConversationFlow.getNextState(
                currentState,
                nlpResult.intent.name,
                this.getContext()
            );

            // Update state
            ChatbotConversationMemory.updateState(nextState);

            // Generate response
            const response = ChatbotResponseGenerator.generate(
                nextState,
                nlpResult.intent.name,
                this.getContext()
            );

            // Show typing indicator
            ChatbotUI.showTyping();

            // Simulate typing delay (more human-like)
            await this.delay(800 + Math.random() * 400);

            // Hide typing and send bot message
            ChatbotUI.hideTyping();
            this.sendBotMessage(response);

            // Show form CTA if appropriate
            const updatedContext = this.getContext();
            if (ChatbotFormIntegrator.shouldShowFormCTA(updatedContext)) {
                await this.delay(600);
                this.showFormCTA();
            }

            // Show quick replies based on state
            this.showContextualQuickReplies(nextState, nlpResult.intent.name);

            // Track analytics
            this.trackEvent('message_sent', {
                intent: nlpResult.intent.name,
                confidence: nlpResult.intent.confidence,
                state: nextState,
                leadScore: leadScore.score
            });

        } catch (error) {
            console.error('Error processing message:', error);
            this.sendBotMessage("I'm having trouble understanding. Could you rephrase that?");
        } finally {
            this.isProcessing = false;
        }
    },

    /**
     * Send bot message
     * @param {string} text
     */
    sendBotMessage(text) {
        ChatbotUI.addMessage(text, 'bot');
        ChatbotConversationMemory.addMessage('bot', text);
    },

    // ========================================
    // QUICK REPLIES
    // ========================================

    /**
     * Show quick replies
     * @param {Array} replies
     */
    showQuickReplies(replies) {
        ChatbotUI.showQuickReplies(replies);
    },

    /**
     * Show contextual quick replies based on state
     * @param {string} state
     * @param {string} intent
     */
    showContextualQuickReplies(state, intent) {
        let replies = [];

        switch (state) {
            case ChatbotConfig.STATES.DISCOVERY:
            case ChatbotConfig.STATES.BUSINESS_PROFILING:
                replies = ['Restaurant', 'Salon/Spa', 'Gym/Fitness', 'Other'];
                break;

            case ChatbotConfig.STATES.NEEDS_ASSESSMENT:
                replies = ['Online Ordering', 'Online Booking', 'AI Chatbot', 'SEO'];
                break;

            case ChatbotConfig.STATES.BUDGET_DISCUSSION:
                replies = ['Under $2K', '$2K-$5K', '$5K+', 'Not sure yet'];
                break;

            case ChatbotConfig.STATES.TIMELINE_ASSESSMENT:
                replies = ['ASAP', '2-4 weeks', 'Flexible'];
                break;

            case ChatbotConfig.STATES.RECOMMENDATION:
                replies = ['Tell me more', 'See other packages', 'I\'m ready!'];
                break;

            case ChatbotConfig.STATES.CLOSING:
                replies = ['Get Quote', 'Have questions', 'Need approval'];
                break;

            default:
                replies = [];
        }

        this.showQuickReplies(replies);
    },

    // ========================================
    // FORM CTA
    // ========================================

    /**
     * Show form CTA in chat
     */
    showFormCTA() {
        const context = this.getContext();
        const ctaHTML = ChatbotFormIntegrator.buildFormCTA(context);

        ChatbotUI.addCustomHTML(ctaHTML);

        // Pre-populate form
        const userProfile = ChatbotConversationMemory.getUserProfile();
        ChatbotFormIntegrator.populateForm(userProfile, context);

        // Set flag
        ChatbotConversationMemory.setFlag('showedFormCTA', true);

        // Track
        this.trackEvent('form_cta_shown', {
            leadScore: context.leadScore,
            package: context.recommendedPackage
        });
    },

    // ========================================
    // CONTEXT
    // ========================================

    /**
     * Get current conversation context
     * @returns {Object}
     */
    getContext() {
        return ChatbotConversationMemory.getContext();
    },

    // ========================================
    // WINDOW EVENTS
    // ========================================

    /**
     * Handle window open
     */
    onWindowOpen() {
        this.trackEvent('chatbot_opened');
    },

    /**
     * Handle window close
     */
    onWindowClose() {
        this.trackEvent('chatbot_closed', {
            messageCount: this.context.messageCount,
            duration: ChatbotUtils.getDuration(this.context.startTime)
        });
    },

    // ========================================
    // ANALYTICS
    // ========================================

    /**
     * Track event
     * @param {string} eventName
     * @param {Object} data
     */
    trackEvent(eventName, data = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'Chatbot',
                ...data
            });
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', eventName, data);
        }

        // Console log for debugging
        if (ChatbotConfig.DEBUG_MODE) {
            console.log(`📊 Event: ${eventName}`, data);
        }
    },

    // ========================================
    // UTILITIES
    // ========================================

    /**
     * Delay/sleep function
     * @param {number} ms
     * @returns {Promise}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Show error message
     * @param {string} message
     */
    showError(message) {
        ChatbotUI.showError(message);
    },

    /**
     * Reset conversation
     */
    reset() {
        ChatbotConversationMemory.clearSession();
        ChatbotUI.clearMessages();
        this.context = ChatbotConversationMemory.initSession();
        this.sendWelcomeMessage();

        this.trackEvent('conversation_reset');
    },

    // ========================================
    // DEBUG / TESTING
    // ========================================

    /**
     * Get session stats (for debugging)
     * @returns {Object}
     */
    getStats() {
        return ChatbotConversationMemory.getStats();
    },

    /**
     * Simulate user message (for testing)
     * @param {string} text
     */
    simulateMessage(text) {
        ChatbotUI.addMessage(text, 'user');
        this.handleUserMessage(text);
    },

    /**
     * Test NLP engine
     * @param {string} text
     * @returns {Object}
     */
    testNLP(text) {
        return ChatbotNLPEngine.process(text, this.getContext());
    }
};

// ========================================
// AUTO-INITIALIZE
// ========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ChatbotCore.init();
    });
} else {
    // DOM already loaded
    ChatbotCore.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotCore;
}

// Expose to window for debugging
window.ChatbotCore = ChatbotCore;
