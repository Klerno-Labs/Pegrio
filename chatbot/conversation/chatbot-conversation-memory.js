/* ========================================
   CONVERSATION MEMORY
   Context preservation and session management
   ======================================== */

const ChatbotConversationMemory = {
    // Session storage key
    STORAGE_KEY: 'chatbot_conversation_session',

    // ========================================
    // SESSION MANAGEMENT
    // ========================================

    /**
     * Initialize new conversation session
     * @returns {Object} - New session object
     */
    initSession() {
        const session = {
            sessionId: ChatbotUtils.generateUUID(),
            startTime: Date.now(),
            currentState: ChatbotConfig.STATES.WELCOME,
            messageCount: 0,

            // User profile (built progressively)
            userProfile: {
                businessType: null,
                businessName: null,
                budgetRange: null,
                timelineUrgency: null,
                featuresNeeded: [],
                painPoints: [],
                isDecisionMaker: null,
                email: null,
                phone: null
            },

            // Conversation history
            messages: [],

            // Intent history (last 5 intents)
            intentHistory: [],

            // Detected entities across conversation
            detectedEntities: {
                businessType: null,
                businessName: null,
                budgetRange: null,
                timelineUrgency: null,
                featuresNeeded: [],
                painPoints: [],
                isDecisionMaker: null,
                email: null,
                phone: null
            },

            // State history (for tracking progression)
            stateHistory: [ChatbotConfig.STATES.WELCOME],

            // Lead score (calculated by lead qualifier)
            leadScore: 0,
            leadLevel: 'cold', // cold, warm, hot, qualified

            // Recommended package
            recommendedPackage: null,

            // Flags
            flags: {
                hasGreeted: false,
                askedBusinessType: false,
                askedBudget: false,
                askedTimeline: false,
                askedFeatures: false,
                showedRecommendation: false,
                readyForForm: false,
                hasObjections: false
            }
        };

        this.saveSession(session);
        return session;
    },

    /**
     * Get current session (or create new one)
     * @returns {Object} - Session object
     */
    getSession() {
        const session = ChatbotUtils.loadFromStorage(this.STORAGE_KEY);

        if (!session || !session.sessionId) {
            return this.initSession();
        }

        // Check if session expired (24 hours)
        const sessionAge = Date.now() - session.startTime;
        const MAX_SESSION_AGE = 24 * 60 * 60 * 1000; // 24 hours

        if (sessionAge > MAX_SESSION_AGE) {
            return this.initSession();
        }

        return session;
    },

    /**
     * Save session to storage
     * @param {Object} session
     */
    saveSession(session) {
        ChatbotUtils.saveToStorage(this.STORAGE_KEY, session);
    },

    /**
     * Clear session (reset conversation)
     */
    clearSession() {
        ChatbotUtils.removeFromStorage(this.STORAGE_KEY);
    },

    // ========================================
    // STATE MANAGEMENT
    // ========================================

    /**
     * Update conversation state
     * @param {string} newState
     */
    updateState(newState) {
        const session = this.getSession();
        session.currentState = newState;

        // Add to state history
        if (session.stateHistory[session.stateHistory.length - 1] !== newState) {
            session.stateHistory.push(newState);
        }

        this.saveSession(session);
    },

    /**
     * Get current state
     * @returns {string}
     */
    getCurrentState() {
        const session = this.getSession();
        return session.currentState;
    },

    // ========================================
    // MESSAGE HISTORY
    // ========================================

    /**
     * Add message to history
     * @param {string} role - 'user' or 'bot'
     * @param {string} text - Message text
     * @param {Object} metadata - Optional metadata (intent, entities, etc.)
     */
    addMessage(role, text, metadata = {}) {
        const session = this.getSession();

        const message = {
            id: ChatbotUtils.generateShortId(),
            role: role,
            text: text,
            timestamp: Date.now(),
            ...metadata
        };

        session.messages.push(message);
        session.messageCount++;

        // Keep only last 50 messages (prevent storage overflow)
        if (session.messages.length > 50) {
            session.messages = session.messages.slice(-50);
        }

        this.saveSession(session);
    },

    /**
     * Get message history
     * @param {number} limit - Number of messages to retrieve (default: all)
     * @returns {Array} - Array of messages
     */
    getMessages(limit = null) {
        const session = this.getSession();

        if (limit) {
            return session.messages.slice(-limit);
        }

        return session.messages;
    },

    /**
     * Get last bot message
     * @returns {Object|null}
     */
    getLastBotMessage() {
        const session = this.getSession();
        const botMessages = session.messages.filter(m => m.role === 'bot');
        return botMessages.length > 0 ? botMessages[botMessages.length - 1] : null;
    },

    /**
     * Get last user message
     * @returns {Object|null}
     */
    getLastUserMessage() {
        const session = this.getSession();
        const userMessages = session.messages.filter(m => m.role === 'user');
        return userMessages.length > 0 ? userMessages[userMessages.length - 1] : null;
    },

    // ========================================
    // INTENT TRACKING
    // ========================================

    /**
     * Add intent to history
     * @param {string} intentName
     * @param {number} confidence
     */
    addIntent(intentName, confidence) {
        const session = this.getSession();

        session.intentHistory.push({
            intent: intentName,
            confidence: confidence,
            timestamp: Date.now()
        });

        // Keep only last 10 intents
        if (session.intentHistory.length > 10) {
            session.intentHistory = session.intentHistory.slice(-10);
        }

        this.saveSession(session);
    },

    /**
     * Get recent intents
     * @param {number} count - Number of recent intents
     * @returns {Array}
     */
    getRecentIntents(count = 5) {
        const session = this.getSession();
        return session.intentHistory.slice(-count);
    },

    // ========================================
    // ENTITY MANAGEMENT
    // ========================================

    /**
     * Update detected entities (merge with existing)
     * @param {Object} entities - New entities to merge
     */
    updateEntities(entities) {
        const session = this.getSession();

        // Merge entities (new values override old, but don't clear existing)
        for (const [key, value] of Object.entries(entities)) {
            if (value !== null && value !== undefined) {
                // Arrays - merge unique values
                if (Array.isArray(value)) {
                    const existing = session.detectedEntities[key] || [];
                    session.detectedEntities[key] = ChatbotUtils.uniqueArray([...existing, ...value]);
                }
                // Primitives - override
                else {
                    session.detectedEntities[key] = value;
                }
            }
        }

        // Also update userProfile
        for (const [key, value] of Object.entries(entities)) {
            if (value !== null && value !== undefined && session.userProfile.hasOwnProperty(key)) {
                if (Array.isArray(value)) {
                    const existing = session.userProfile[key] || [];
                    session.userProfile[key] = ChatbotUtils.uniqueArray([...existing, ...value]);
                } else {
                    session.userProfile[key] = value;
                }
            }
        }

        this.saveSession(session);
    },

    /**
     * Get all detected entities
     * @returns {Object}
     */
    getEntities() {
        const session = this.getSession();
        return session.detectedEntities;
    },

    /**
     * Get user profile
     * @returns {Object}
     */
    getUserProfile() {
        const session = this.getSession();
        return session.userProfile;
    },

    // ========================================
    // FLAGS MANAGEMENT
    // ========================================

    /**
     * Set a flag
     * @param {string} flagName
     * @param {boolean} value
     */
    setFlag(flagName, value) {
        const session = this.getSession();
        session.flags[flagName] = value;
        this.saveSession(session);
    },

    /**
     * Get a flag
     * @param {string} flagName
     * @returns {boolean}
     */
    getFlag(flagName) {
        const session = this.getSession();
        return session.flags[flagName] || false;
    },

    // ========================================
    // LEAD SCORING
    // ========================================

    /**
     * Update lead score
     * @param {number} score
     * @param {string} level - cold, warm, hot, qualified
     */
    updateLeadScore(score, level) {
        const session = this.getSession();
        session.leadScore = score;
        session.leadLevel = level;
        this.saveSession(session);
    },

    /**
     * Get lead score
     * @returns {Object} - {score, level}
     */
    getLeadScore() {
        const session = this.getSession();
        return {
            score: session.leadScore,
            level: session.leadLevel
        };
    },

    // ========================================
    // RECOMMENDATION
    // ========================================

    /**
     * Set recommended package
     * @param {string} packageName - essential, professional, premium
     */
    setRecommendation(packageName) {
        const session = this.getSession();
        session.recommendedPackage = packageName;
        this.saveSession(session);
    },

    /**
     * Get recommended package
     * @returns {string|null}
     */
    getRecommendation() {
        const session = this.getSession();
        return session.recommendedPackage;
    },

    // ========================================
    // CONVERSATION CONTEXT
    // ========================================

    /**
     * Get full conversation context (for NLP engine)
     * @returns {Object}
     */
    getContext() {
        const session = this.getSession();

        return {
            currentState: session.currentState,
            messageCount: session.messageCount,
            userProfile: session.userProfile,
            detectedEntities: session.detectedEntities,
            recentIntents: this.getRecentIntents(5),
            leadScore: session.leadScore,
            leadLevel: session.leadLevel,
            recommendedPackage: session.recommendedPackage,
            flags: session.flags
        };
    },

    // ========================================
    // SESSION INFO
    // ========================================

    /**
     * Get session statistics
     * @returns {Object}
     */
    getStats() {
        const session = this.getSession();

        return {
            sessionId: session.sessionId,
            duration: ChatbotUtils.getDuration(session.startTime),
            messageCount: session.messageCount,
            currentState: session.currentState,
            leadScore: session.leadScore,
            leadLevel: session.leadLevel,
            completionRate: this.calculateCompletionRate()
        };
    },

    /**
     * Calculate profile completion rate (0-100%)
     * @returns {number}
     */
    calculateCompletionRate() {
        const session = this.getSession();
        const profile = session.userProfile;

        const fields = [
            'businessType',
            'budgetRange',
            'timelineUrgency',
            'isDecisionMaker'
        ];

        const completed = fields.filter(field => {
            const value = profile[field];
            return value !== null && value !== undefined && value !== '';
        }).length;

        return Math.round((completed / fields.length) * 100);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotConversationMemory;
}
