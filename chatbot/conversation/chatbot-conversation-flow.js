/* ========================================
   CONVERSATION FLOW
   State machine for intelligent conversation management
   ======================================== */

const ChatbotConversationFlow = {
    // ========================================
    // STATE TRANSITIONS
    // ========================================

    /**
     * Determine next state based on current state, intent, and context
     * @param {string} currentState - Current conversation state
     * @param {string} intent - Detected intent
     * @param {Object} context - Conversation context
     * @returns {string} - Next state
     */
    getNextState(currentState, intent, context) {
        // Handle special intents that can occur in any state
        const immediateTransitions = this.checkImmediateTransitions(intent, context);
        if (immediateTransitions) {
            return immediateTransitions;
        }

        // State-specific transitions
        switch (currentState) {
            case ChatbotConfig.STATES.WELCOME:
                return this.fromWelcome(intent, context);

            case ChatbotConfig.STATES.DISCOVERY:
                return this.fromDiscovery(intent, context);

            case ChatbotConfig.STATES.BUSINESS_PROFILING:
                return this.fromBusinessProfiling(intent, context);

            case ChatbotConfig.STATES.NEEDS_ASSESSMENT:
                return this.fromNeedsAssessment(intent, context);

            case ChatbotConfig.STATES.BUDGET_DISCUSSION:
                return this.fromBudgetDiscussion(intent, context);

            case ChatbotConfig.STATES.TIMELINE_ASSESSMENT:
                return this.fromTimelineAssessment(intent, context);

            case ChatbotConfig.STATES.RECOMMENDATION:
                return this.fromRecommendation(intent, context);

            case ChatbotConfig.STATES.PACKAGE_DETAILS:
                return this.fromPackageDetails(intent, context);

            case ChatbotConfig.STATES.OBJECTION_HANDLING:
                return this.fromObjectionHandling(intent, context);

            case ChatbotConfig.STATES.CLOSING:
                return this.fromClosing(intent, context);

            case ChatbotConfig.STATES.SUPPORT:
                return this.fromSupport(intent, context);

            case ChatbotConfig.STATES.EXIT:
                return ChatbotConfig.STATES.EXIT;

            default:
                return currentState;
        }
    },

    // ========================================
    // IMMEDIATE TRANSITIONS (Any State)
    // ========================================

    checkImmediateTransitions(intent, context) {
        // User says goodbye or not interested
        if (intent === 'not_interested' || intent === 'goodbye') {
            return ChatbotConfig.STATES.EXIT;
        }

        // User says thanks (but continue conversation)
        if (intent === 'gratitude') {
            return null; // Stay in current state
        }

        // User asks for support
        if (intent === 'support_inquiry') {
            return ChatbotConfig.STATES.SUPPORT;
        }

        // User is ready to start (high-intent action)
        if ((intent === 'ready_to_start' || intent === 'quote_request') && context.recommendedPackage) {
            return ChatbotConfig.STATES.CLOSING;
        }

        // User has budget objection
        if (intent === 'budget_concern' || intent === 'budget_tight') {
            return ChatbotConfig.STATES.OBJECTION_HANDLING;
        }

        // User asks about specific package
        if (intent === 'essential_details' || intent === 'professional_details' || intent === 'premium_details') {
            return ChatbotConfig.STATES.PACKAGE_DETAILS;
        }

        return null; // No immediate transition
    },

    // ========================================
    // STATE-SPECIFIC TRANSITIONS
    // ========================================

    fromWelcome(intent, context) {
        // User greets back
        if (intent === 'greeting') {
            return ChatbotConfig.STATES.DISCOVERY;
        }

        // User immediately asks for pricing
        if (intent === 'pricing_inquiry' || intent === 'package_comparison') {
            return ChatbotConfig.STATES.DISCOVERY; // Get context first before pricing
        }

        // User says they need a website
        if (intent === 'get_started') {
            return ChatbotConfig.STATES.BUSINESS_PROFILING;
        }

        // User mentions their business type
        if (intent.includes('_mention')) { // restaurant_mention, salon_mention, etc.
            return ChatbotConfig.STATES.NEEDS_ASSESSMENT;
        }

        // Default: move to discovery
        return ChatbotConfig.STATES.DISCOVERY;
    },

    fromDiscovery(intent, context) {
        // User mentions business type
        if (intent.includes('_mention') || context.detectedEntities.businessType) {
            return ChatbotConfig.STATES.NEEDS_ASSESSMENT;
        }

        // User says they need a website
        if (intent === 'get_started') {
            return ChatbotConfig.STATES.BUSINESS_PROFILING;
        }

        // User asks about features
        if (intent.includes('_need') || intent.includes('_inquiry')) {
            return ChatbotConfig.STATES.NEEDS_ASSESSMENT;
        }

        // Default: move to business profiling
        return ChatbotConfig.STATES.BUSINESS_PROFILING;
    },

    fromBusinessProfiling(intent, context) {
        // Have business type, move to needs
        if (context.detectedEntities.businessType) {
            return ChatbotConfig.STATES.NEEDS_ASSESSMENT;
        }

        // User still unclear
        if (intent === 'clarification' || intent === 'unknown') {
            return ChatbotConfig.STATES.BUSINESS_PROFILING; // Stay and re-ask
        }

        // Default: move to needs assessment
        return ChatbotConfig.STATES.NEEDS_ASSESSMENT;
    },

    fromNeedsAssessment(intent, context) {
        // User mentions specific features
        if (intent.includes('_need') || intent.includes('_inquiry')) {
            return ChatbotConfig.STATES.NEEDS_ASSESSMENT; // Stay to collect more
        }

        // Have enough context, move to budget
        const hasContext = context.detectedEntities.businessType &&
                          (context.detectedEntities.featuresNeeded.length > 0 ||
                           context.detectedEntities.painPoints.length > 0);

        if (hasContext || context.messageCount >= 4) {
            return ChatbotConfig.STATES.BUDGET_DISCUSSION;
        }

        // Default: stay in needs assessment
        return ChatbotConfig.STATES.NEEDS_ASSESSMENT;
    },

    fromBudgetDiscussion(intent, context) {
        // Have budget info, move to timeline
        if (context.detectedEntities.budgetRange) {
            return ChatbotConfig.STATES.TIMELINE_ASSESSMENT;
        }

        // User mentions budget
        if (intent.includes('budget')) {
            return ChatbotConfig.STATES.BUDGET_DISCUSSION; // Stay to clarify
        }

        // User asks about pricing (wants to know cost)
        if (intent === 'pricing_inquiry' || intent === 'package_comparison') {
            return ChatbotConfig.STATES.BUDGET_DISCUSSION; // Stay and explain value
        }

        // After 2 budget messages, move on even if no clear budget
        if (context.messageCount >= 6) {
            return ChatbotConfig.STATES.TIMELINE_ASSESSMENT;
        }

        // Default: stay in budget discussion
        return ChatbotConfig.STATES.BUDGET_DISCUSSION;
    },

    fromTimelineAssessment(intent, context) {
        // Have timeline, make recommendation
        if (context.detectedEntities.timelineUrgency) {
            return ChatbotConfig.STATES.RECOMMENDATION;
        }

        // User mentions timeline
        if (intent === 'timeline_inquiry' || intent === 'urgent_timeline') {
            return ChatbotConfig.STATES.TIMELINE_ASSESSMENT; // Stay to clarify
        }

        // After 2 timeline messages, make recommendation anyway
        if (context.messageCount >= 8) {
            return ChatbotConfig.STATES.RECOMMENDATION;
        }

        // Default: stay in timeline assessment
        return ChatbotConfig.STATES.TIMELINE_ASSESSMENT;
    },

    fromRecommendation(intent, context) {
        // User wants to see examples
        if (intent === 'see_examples') {
            return ChatbotConfig.STATES.PACKAGE_DETAILS;
        }

        // User wants package comparison
        if (intent === 'package_comparison') {
            return ChatbotConfig.STATES.PACKAGE_DETAILS;
        }

        // User is ready
        if (intent === 'ready_to_start' || intent === 'quote_request') {
            return ChatbotConfig.STATES.CLOSING;
        }

        // User has questions about recommendation
        if (intent === 'clarification' || intent.includes('_details')) {
            return ChatbotConfig.STATES.PACKAGE_DETAILS;
        }

        // Default: move to closing
        return ChatbotConfig.STATES.CLOSING;
    },

    fromPackageDetails(intent, context) {
        // User is ready after seeing details
        if (intent === 'ready_to_start' || intent === 'quote_request') {
            return ChatbotConfig.STATES.CLOSING;
        }

        // User wants different package
        if (intent.includes('_details')) {
            return ChatbotConfig.STATES.PACKAGE_DETAILS; // Stay and show different package
        }

        // User compares packages
        if (intent === 'package_comparison') {
            return ChatbotConfig.STATES.PACKAGE_DETAILS; // Stay and compare
        }

        // After showing details, move to closing
        return ChatbotConfig.STATES.CLOSING;
    },

    fromObjectionHandling(intent, context) {
        // User is convinced, ready to proceed
        if (intent === 'ready_to_start' || intent === 'quote_request') {
            return ChatbotConfig.STATES.CLOSING;
        }

        // User still has concerns
        if (intent.includes('budget_') || intent === 'not_ready') {
            return ChatbotConfig.STATES.OBJECTION_HANDLING; // Stay and address
        }

        // User wants to see value (show package details)
        if (intent === 'package_comparison' || intent.includes('_details')) {
            return ChatbotConfig.STATES.PACKAGE_DETAILS;
        }

        // After addressing objection, move to closing
        return ChatbotConfig.STATES.CLOSING;
    },

    fromClosing(intent, context) {
        // User confirms they're ready
        if (intent === 'ready_to_start' || intent === 'quote_request') {
            return ChatbotConfig.STATES.CLOSING; // Stay and show form CTA
        }

        // User needs approval
        if (intent === 'need_approval') {
            return ChatbotConfig.STATES.CLOSING; // Stay and offer to send info
        }

        // User not ready yet
        if (intent === 'not_ready') {
            return ChatbotConfig.STATES.SUPPORT; // Offer to answer questions
        }

        // Stay in closing (showing form CTA)
        return ChatbotConfig.STATES.CLOSING;
    },

    fromSupport(intent, context) {
        // User has specific question, route appropriately
        if (intent.includes('_inquiry') || intent.includes('_need')) {
            return ChatbotConfig.STATES.SUPPORT; // Stay and answer
        }

        // User is now ready
        if (intent === 'ready_to_start' || intent === 'quote_request') {
            return ChatbotConfig.STATES.CLOSING;
        }

        // Stay in support
        return ChatbotConfig.STATES.SUPPORT;
    },

    // ========================================
    // STATE DECISION LOGIC
    // ========================================

    /**
     * Should we show recommendation now?
     * @param {Object} context
     * @returns {boolean}
     */
    shouldRecommend(context) {
        // Must have business type
        if (!context.detectedEntities.businessType) {
            return false;
        }

        // Must have at least one of: budget, features, or pain points
        const hasNeeds = context.detectedEntities.budgetRange ||
                        context.detectedEntities.featuresNeeded.length > 0 ||
                        context.detectedEntities.painPoints.length > 0;

        if (!hasNeeds) {
            return false;
        }

        // Must have exchanged at least 3 messages
        if (context.messageCount < 3) {
            return false;
        }

        return true;
    },

    /**
     * Should we show form CTA?
     * @param {Object} context
     * @returns {boolean}
     */
    shouldShowFormCTA(context) {
        // Must have recommendation
        if (!context.recommendedPackage) {
            return false;
        }

        // Must have exchanged at least 5 messages
        if (context.messageCount < 5) {
            return false;
        }

        // Lead score must be at least 40 (warm)
        if (context.leadScore < 40) {
            return false;
        }

        // Must show buying intent (ready_to_start, quote_request, or in closing state)
        const buyingIntent = context.recentIntents.some(i =>
            i.intent === 'ready_to_start' || i.intent === 'quote_request'
        ) || context.currentState === ChatbotConfig.STATES.CLOSING;

        return buyingIntent;
    },

    /**
     * What question should we ask next?
     * @param {Object} context
     * @returns {string} - Question type: 'businessType', 'features', 'budget', 'timeline', 'decisionMaker', 'none'
     */
    getNextQuestion(context) {
        const entities = context.detectedEntities;
        const flags = context.flags;

        // Ask business type first
        if (!entities.businessType && !flags.askedBusinessType) {
            return 'businessType';
        }

        // Ask about pain points / needs
        if (entities.businessType && entities.featuresNeeded.length === 0 &&
            entities.painPoints.length === 0 && !flags.askedFeatures) {
            return 'features';
        }

        // Ask about budget
        if (!entities.budgetRange && !flags.askedBudget && context.messageCount >= 3) {
            return 'budget';
        }

        // Ask about timeline
        if (!entities.timelineUrgency && !flags.askedTimeline && context.messageCount >= 4) {
            return 'timeline';
        }

        // Ask about decision maker (later in conversation)
        if (entities.isDecisionMaker === null && context.messageCount >= 6) {
            return 'decisionMaker';
        }

        // No more questions needed
        return 'none';
    },

    // ========================================
    // CONVERSATION QUALITY
    // ========================================

    /**
     * Is conversation stuck? (same state for too long)
     * @param {Array} stateHistory - Array of states
     * @returns {boolean}
     */
    isConversationStuck(stateHistory) {
        if (stateHistory.length < 4) {
            return false;
        }

        // Check if last 4 states are the same
        const lastFour = stateHistory.slice(-4);
        const allSame = lastFour.every(state => state === lastFour[0]);

        return allSame;
    },

    /**
     * Unstuck conversation (force progression)
     * @param {string} currentState
     * @returns {string} - Next state to force progression
     */
    unstuckConversation(currentState) {
        // Map stuck states to their next logical state
        const progressionMap = {
            [ChatbotConfig.STATES.WELCOME]: ChatbotConfig.STATES.DISCOVERY,
            [ChatbotConfig.STATES.DISCOVERY]: ChatbotConfig.STATES.BUSINESS_PROFILING,
            [ChatbotConfig.STATES.BUSINESS_PROFILING]: ChatbotConfig.STATES.NEEDS_ASSESSMENT,
            [ChatbotConfig.STATES.NEEDS_ASSESSMENT]: ChatbotConfig.STATES.BUDGET_DISCUSSION,
            [ChatbotConfig.STATES.BUDGET_DISCUSSION]: ChatbotConfig.STATES.TIMELINE_ASSESSMENT,
            [ChatbotConfig.STATES.TIMELINE_ASSESSMENT]: ChatbotConfig.STATES.RECOMMENDATION,
            [ChatbotConfig.STATES.RECOMMENDATION]: ChatbotConfig.STATES.CLOSING,
            [ChatbotConfig.STATES.PACKAGE_DETAILS]: ChatbotConfig.STATES.CLOSING,
            [ChatbotConfig.STATES.OBJECTION_HANDLING]: ChatbotConfig.STATES.CLOSING,
            [ChatbotConfig.STATES.SUPPORT]: ChatbotConfig.STATES.CLOSING
        };

        return progressionMap[currentState] || ChatbotConfig.STATES.CLOSING;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotConversationFlow;
}
