/* ========================================
   LEAD QUALIFIER
   Intelligent lead scoring (0-100 scale)
   ======================================== */

const ChatbotLeadQualifier = {
    // ========================================
    // LEAD SCORING ALGORITHM
    // ========================================

    /**
     * Calculate lead score (0-100) based on user profile
     * @param {Object} userProfile - User profile from conversation
     * @param {Object} context - Full conversation context
     * @returns {Object} - {score, level, breakdown}
     */
    calculateScore(userProfile, context) {
        let score = 0;
        const breakdown = {};

        // 1. Business Type Score (+10-20 points)
        const businessTypeScore = this.scoreBusinessType(userProfile.businessType);
        score += businessTypeScore;
        breakdown.businessType = businessTypeScore;

        // 2. Budget Score (+5-30 points)
        const budgetScore = this.scoreBudget(userProfile.budgetRange);
        score += budgetScore;
        breakdown.budget = budgetScore;

        // 3. Timeline Score (+5-20 points)
        const timelineScore = this.scoreTimeline(userProfile.timelineUrgency);
        score += timelineScore;
        breakdown.timeline = timelineScore;

        // 4. Decision Maker Score (+10-20 points)
        const decisionMakerScore = this.scoreDecisionMaker(userProfile.isDecisionMaker);
        score += decisionMakerScore;
        breakdown.decisionMaker = decisionMakerScore;

        // 5. Pain Points Score (+2 per pain point, max 10)
        const painPointsScore = this.scorePainPoints(userProfile.painPoints);
        score += painPointsScore;
        breakdown.painPoints = painPointsScore;

        // 6. Features Needed Score (+2 per feature, max 10)
        const featuresScore = this.scoreFeatures(userProfile.featuresNeeded);
        score += featuresScore;
        breakdown.features = featuresScore;

        // 7. Engagement Score (+5-15 points based on message count)
        const engagementScore = this.scoreEngagement(context.messageCount);
        score += engagementScore;
        breakdown.engagement = engagementScore;

        // 8. Intent Quality Score (+5-10 points based on buying intents)
        const intentScore = this.scoreIntents(context.recentIntents);
        score += intentScore;
        breakdown.intents = intentScore;

        // Cap score at 100
        score = Math.min(score, 100);

        // Determine lead level
        const level = this.getLeadLevel(score);

        return {
            score: score,
            level: level,
            breakdown: breakdown
        };
    },

    // ========================================
    // SCORING COMPONENTS
    // ========================================

    /**
     * Score business type (higher for businesses that need websites more)
     * @param {string} businessType
     * @returns {number} - 0-20 points
     */
    scoreBusinessType(businessType) {
        if (!businessType) return 0;

        const scores = {
            'restaurant': 20,  // High need for online ordering
            'salon': 18,       // High need for online booking
            'fitness': 18,     // High need for member portal
            'cafe': 16,        // Moderate need
            'bar': 14,         // Moderate need
            'retail': 16,      // Moderate-high need
            'other': 10        // Lower urgency
        };

        return scores[businessType] || scores['other'];
    },

    /**
     * Score budget range (higher for bigger budgets)
     * @param {string} budgetRange
     * @returns {number} - 0-30 points
     */
    scoreBudget(budgetRange) {
        if (!budgetRange) return 5; // Unknown budget = low score

        const scores = {
            'tight': 10,        // Under $2K - low fit
            'essential': 15,    // $2K-$2.5K - okay fit
            'professional': 25, // $2.5K-$6K - good fit
            'premium': 30,      // $6K+ - excellent fit
            'flexible': 30      // Budget not an issue - excellent fit
        };

        return scores[budgetRange] || 5;
    },

    /**
     * Score timeline urgency (higher for urgent needs)
     * @param {string} timelineUrgency
     * @returns {number} - 0-20 points
     */
    scoreTimeline(timelineUrgency) {
        if (!timelineUrgency) return 5; // Unknown timeline = moderate score

        const scores = {
            'urgent': 20,    // ASAP - high urgency
            'soon': 15,      // 2-4 weeks - good urgency
            'flexible': 10,  // No rush - moderate
            'exploring': 5   // Just looking - low urgency
        };

        return scores[timelineUrgency] || 5;
    },

    /**
     * Score decision maker status (higher if they can make decisions)
     * @param {boolean|string} isDecisionMaker
     * @returns {number} - 0-20 points
     */
    scoreDecisionMaker(isDecisionMaker) {
        if (isDecisionMaker === null || isDecisionMaker === undefined) {
            return 10; // Unknown = moderate score
        }

        if (isDecisionMaker === true) {
            return 20; // Decision maker = high score
        }

        if (isDecisionMaker === 'influencer') {
            return 12; // Influencer but not decision maker = moderate
        }

        return 5; // Not decision maker = low score
    },

    /**
     * Score pain points (more pain = higher urgency)
     * @param {Array} painPoints
     * @returns {number} - 0-10 points
     */
    scorePainPoints(painPoints) {
        if (!painPoints || painPoints.length === 0) return 0;

        // 2 points per pain point, max 10
        return Math.min(painPoints.length * 2, 10);
    },

    /**
     * Score features needed (more features = bigger project)
     * @param {Array} featuresNeeded
     * @returns {number} - 0-10 points
     */
    scoreFeatures(featuresNeeded) {
        if (!featuresNeeded || featuresNeeded.length === 0) return 0;

        // High-value features
        const highValueFeatures = ['ordering', 'booking', 'ai', 'ecommerce'];

        // Count high-value features
        const highValueCount = featuresNeeded.filter(f =>
            highValueFeatures.includes(f)
        ).length;

        // 3 points per high-value feature, 1 point per other feature
        const score = (highValueCount * 3) + ((featuresNeeded.length - highValueCount) * 1);

        return Math.min(score, 10);
    },

    /**
     * Score engagement (more messages = more engaged)
     * @param {number} messageCount
     * @returns {number} - 0-15 points
     */
    scoreEngagement(messageCount) {
        if (messageCount <= 2) return 5;   // Low engagement
        if (messageCount <= 5) return 10;  // Moderate engagement
        if (messageCount <= 10) return 13; // Good engagement
        return 15; // High engagement
    },

    /**
     * Score intent quality (buying intents = higher score)
     * @param {Array} recentIntents
     * @returns {number} - 0-10 points
     */
    scoreIntents(recentIntents) {
        if (!recentIntents || recentIntents.length === 0) return 0;

        // High-intent keywords
        const buyingIntents = [
            'ready_to_start',
            'quote_request',
            'get_started',
            'pricing_inquiry',
            'package_comparison'
        ];

        // Low-intent keywords
        const lowIntents = [
            'not_interested',
            'not_ready',
            'clarification',
            'unknown'
        ];

        let score = 0;

        recentIntents.forEach(intentObj => {
            const intent = intentObj.intent;
            const confidence = intentObj.confidence || 0;

            if (buyingIntents.includes(intent)) {
                score += 3; // +3 for buying intent
            } else if (lowIntents.includes(intent)) {
                score -= 1; // -1 for low intent
            } else {
                score += 1; // +1 for neutral intent
            }
        });

        return Math.max(0, Math.min(score, 10)); // 0-10 range
    },

    // ========================================
    // LEAD LEVELS
    // ========================================

    /**
     * Get lead level based on score
     * @param {number} score
     * @returns {string} - cold, warm, hot, qualified
     */
    getLeadLevel(score) {
        if (score >= 86) return 'qualified'; // 86-100: Ready to buy
        if (score >= 61) return 'hot';       // 61-85: Very interested
        if (score >= 31) return 'warm';      // 31-60: Somewhat interested
        return 'cold';                       // 0-30: Low interest
    },

    /**
     * Get lead level description
     * @param {string} level
     * @returns {string}
     */
    getLeadLevelDescription(level) {
        const descriptions = {
            'qualified': 'Ready to buy - high budget, urgent timeline, decision maker',
            'hot': 'Very interested - good fit, needs features, engaged',
            'warm': 'Somewhat interested - exploring options, may need nurturing',
            'cold': 'Low interest - just browsing, not ready yet'
        };

        return descriptions[level] || 'Unknown lead level';
    },

    // ========================================
    // LEAD INSIGHTS
    // ========================================

    /**
     * Get actionable insights about the lead
     * @param {Object} scoreResult
     * @param {Object} userProfile
     * @returns {Object} - Insights and recommendations
     */
    getInsights(scoreResult, userProfile) {
        const insights = {
            strengths: [],
            weaknesses: [],
            nextSteps: []
        };

        const breakdown = scoreResult.breakdown;

        // Analyze strengths
        if (breakdown.businessType >= 18) {
            insights.strengths.push('Perfect business type for our services');
        }
        if (breakdown.budget >= 25) {
            insights.strengths.push('Healthy budget - can afford premium features');
        }
        if (breakdown.timeline >= 15) {
            insights.strengths.push('Urgent timeline - ready to move fast');
        }
        if (breakdown.decisionMaker >= 18) {
            insights.strengths.push('Decision maker - can close quickly');
        }
        if (breakdown.engagement >= 12) {
            insights.strengths.push('Highly engaged in conversation');
        }

        // Analyze weaknesses
        if (breakdown.budget < 15) {
            insights.weaknesses.push('Budget concerns - may need payment plan');
        }
        if (breakdown.timeline < 10) {
            insights.weaknesses.push('No urgency - just exploring');
        }
        if (breakdown.decisionMaker < 10) {
            insights.weaknesses.push('Not decision maker - needs approval');
        }
        if (breakdown.engagement < 8) {
            insights.weaknesses.push('Low engagement - may lose interest');
        }
        if (breakdown.painPoints === 0) {
            insights.weaknesses.push('No clear pain points identified');
        }

        // Determine next steps based on level
        switch (scoreResult.level) {
            case 'qualified':
                insights.nextSteps.push('Show form CTA immediately');
                insights.nextSteps.push('Emphasize urgency and scarcity');
                insights.nextSteps.push('Offer to schedule call with team');
                break;

            case 'hot':
                insights.nextSteps.push('Address any remaining objections');
                insights.nextSteps.push('Show ROI and social proof');
                insights.nextSteps.push('Push for form submission');
                break;

            case 'warm':
                insights.nextSteps.push('Build more value');
                insights.nextSteps.push('Identify pain points');
                insights.nextSteps.push('Offer examples and case studies');
                break;

            case 'cold':
                insights.nextSteps.push('Qualify budget and timeline');
                insights.nextSteps.push('Educate on value proposition');
                insights.nextSteps.push('Offer to stay in touch');
                break;
        }

        return insights;
    },

    // ========================================
    // DISQUALIFICATION
    // ========================================

    /**
     * Should we disqualify this lead?
     * @param {Object} scoreResult
     * @param {Object} userProfile
     * @returns {boolean}
     */
    shouldDisqualify(scoreResult, userProfile) {
        // Disqualify if:

        // 1. Explicitly not interested
        if (userProfile.hasExplicitlyDeclined) {
            return true;
        }

        // 2. Budget way too low (under $1000)
        if (userProfile.budgetRange === 'tight' && scoreResult.score < 15) {
            return true; // Tight budget + low overall score = bad fit
        }

        // 3. Score extremely low after many messages
        if (scoreResult.score < 15 && scoreResult.breakdown.engagement >= 12) {
            return true; // Engaged a lot but score still low = not a fit
        }

        return false;
    },

    /**
     * Get disqualification reason
     * @param {Object} userProfile
     * @returns {string}
     */
    getDisqualificationReason(userProfile) {
        if (userProfile.budgetRange === 'tight') {
            return 'Budget too low for our services';
        }
        if (userProfile.timelineUrgency === 'exploring') {
            return 'Not ready to buy - just exploring';
        }
        return 'Not a good fit';
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotLeadQualifier;
}
