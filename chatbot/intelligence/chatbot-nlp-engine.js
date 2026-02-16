/* ========================================
   NLP ENGINE
   Multi-layer natural language processing
   ======================================== */

const ChatbotNLPEngine = {
    // ========================================
    // PROCESS INPUT
    // ========================================
    /**
     * Main entry point - process user input and return intent + entities
     * @param {string} input - User message
     * @param {Object} context - Conversation context
     * @returns {Object} - {intent, confidence, entities}
     */
    process(input, context = {}) {
        // Sanitize input
        const sanitized = ChatbotUtils.sanitizeInput(input);

        // Validate input length
        if (sanitized.length < ChatbotConfig.NLP.MIN_INPUT_LENGTH) {
            return {
                intent: { name: 'invalid_input', confidence: 1.0 },
                entities: {},
                tokens: []
            };
        }

        // Tokenize
        const tokens = ChatbotUtils.tokenize(sanitized);

        // Extract entities (business type, budget, timeline, etc.)
        const entities = ChatbotEntityExtractor.extractAll(sanitized);

        // Recognize intent (multi-layer approach)
        const intent = this.recognizeIntent(sanitized, tokens, context);

        return {
            intent,
            entities,
            tokens
        };
    },

    // ========================================
    // LAYER 1: EXACT PHRASE MATCHING
    // ========================================
    exactMatch(text) {
        const lower = text.toLowerCase().trim();

        for (const [intentName, intentData] of Object.entries(IntentLibrary)) {
            if (intentData.exact && intentData.exact.includes(lower)) {
                return {
                    name: intentName,
                    confidence: 1.0,
                    layer: 'exact'
                };
            }
        }

        return null;
    },

    // ========================================
    // LAYER 2: KEYWORD SCORING
    // ========================================
    keywordScoring(tokens) {
        const scores = {};

        for (const [intentName, intentData] of Object.entries(IntentLibrary)) {
            let score = 0;

            // Primary keywords (+10)
            if (intentData.primary) {
                intentData.primary.forEach(keyword => {
                    if (tokens.includes(keyword)) {
                        score += 10;
                    }
                });
            }

            // Secondary keywords (+5)
            if (intentData.secondary) {
                intentData.secondary.forEach(keyword => {
                    if (tokens.includes(keyword)) {
                        score += 5;
                    }
                });
            }

            // Negative keywords (-15)
            if (intentData.negative) {
                intentData.negative.forEach(keyword => {
                    if (tokens.includes(keyword)) {
                        score -= 15;
                    }
                });
            }

            if (score > 0) {
                scores[intentName] = score;
            }
        }

        // Find highest score
        let maxScore = 0;
        let topIntent = null;

        for (const [intentName, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                topIntent = intentName;
            }
        }

        if (topIntent) {
            // Normalize confidence (0-1)
            const confidence = Math.min(maxScore / 30, 1.0); // 30+ points = 100% confidence

            return {
                name: topIntent,
                confidence: confidence,
                layer: 'keyword',
                score: maxScore
            };
        }

        return null;
    },

    // ========================================
    // LAYER 3: N-GRAM ANALYSIS
    // ========================================
    ngramAnalysis(text, tokens) {
        const bigrams = ChatbotUtils.generateNGrams(tokens, 2);
        const trigrams = ChatbotUtils.generateNGrams(tokens, 3);

        const matches = {};

        for (const [intentName, intentData] of Object.entries(IntentLibrary)) {
            let matchCount = 0;

            // Check bigrams against exact phrases
            if (intentData.exact) {
                bigrams.forEach(bigram => {
                    intentData.exact.forEach(phrase => {
                        if (phrase.includes(bigram)) {
                            matchCount += 2;
                        }
                    });
                });

                // Check trigrams
                trigrams.forEach(trigram => {
                    intentData.exact.forEach(phrase => {
                        if (phrase.includes(trigram)) {
                            matchCount += 3;
                        }
                    });
                });
            }

            if (matchCount > 0) {
                matches[intentName] = matchCount;
            }
        }

        // Find highest match count
        let maxMatches = 0;
        let topIntent = null;

        for (const [intentName, count] of Object.entries(matches)) {
            if (count > maxMatches) {
                maxMatches = count;
                topIntent = intentName;
            }
        }

        if (topIntent && maxMatches >= 2) {
            const confidence = Math.min(maxMatches / 10, 1.0);

            return {
                name: topIntent,
                confidence: confidence,
                layer: 'ngram',
                matchCount: maxMatches
            };
        }

        return null;
    },

    // ========================================
    // LAYER 4: SENTIMENT ANALYSIS
    // ========================================
    analyzeSentiment(tokens) {
        const positiveWords = [
            'love', 'great', 'awesome', 'perfect', 'excellent', 'fantastic',
            'wonderful', 'amazing', 'good', 'nice', 'yes', 'absolutely', 'definitely'
        ];

        const negativeWords = [
            'hate', 'bad', 'terrible', 'awful', 'horrible', 'worried', 'concerned',
            'expensive', 'not sure', 'complicated', 'difficult', 'no', 'never', 'don\'t'
        ];

        const neutralWords = [
            'okay', 'fine', 'maybe', 'perhaps', 'thinking', 'considering', 'exploring'
        ];

        let positiveCount = 0;
        let negativeCount = 0;
        let neutralCount = 0;

        tokens.forEach(token => {
            if (positiveWords.includes(token)) positiveCount++;
            if (negativeWords.includes(token)) negativeCount++;
            if (neutralWords.includes(token)) neutralCount++;
        });

        if (positiveCount > negativeCount && positiveCount > neutralCount) {
            return { sentiment: 'positive', score: positiveCount };
        } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
            return { sentiment: 'negative', score: negativeCount };
        } else {
            return { sentiment: 'neutral', score: neutralCount };
        }
    },

    // ========================================
    // LAYER 5: CONTEXT-AWARE DISAMBIGUATION
    // ========================================
    contextualDisambiguation(candidateIntents, context) {
        // If we have conversation state, prefer intents that make sense in context
        if (context.currentState) {
            const state = context.currentState;

            // Example: In BUDGET_DISCUSSION state, prioritize budget-related intents
            if (state === ChatbotConfig.STATES.BUDGET_DISCUSSION) {
                const budgetIntents = ['budget_concern', 'budget_tight', 'budget_flexible', 'payment_plan_inquiry'];

                for (const intent of candidateIntents) {
                    if (budgetIntents.includes(intent.name)) {
                        intent.confidence = Math.min(intent.confidence * 1.2, 1.0); // Boost confidence
                        return intent;
                    }
                }
            }

            // In TIMELINE_ASSESSMENT, prioritize timeline intents
            if (state === ChatbotConfig.STATES.TIMELINE_ASSESSMENT) {
                const timelineIntents = ['timeline_inquiry', 'urgent_timeline'];

                for (const intent of candidateIntents) {
                    if (timelineIntents.includes(intent.name)) {
                        intent.confidence = Math.min(intent.confidence * 1.2, 1.0);
                        return intent;
                    }
                }
            }

            // In CLOSING state, prioritize ready_to_start or not_ready
            if (state === ChatbotConfig.STATES.CLOSING) {
                const closingIntents = ['ready_to_start', 'quote_request', 'not_ready', 'need_approval'];

                for (const intent of candidateIntents) {
                    if (closingIntents.includes(intent.name)) {
                        intent.confidence = Math.min(intent.confidence * 1.2, 1.0);
                        return intent;
                    }
                }
            }
        }

        // Return highest confidence intent
        return candidateIntents[0];
    },

    // ========================================
    // RECOGNIZE INTENT (MAIN FUNCTION)
    // ========================================
    recognizeIntent(text, tokens, context) {
        const candidateIntents = [];

        // Layer 1: Exact match (highest priority)
        const exactMatch = this.exactMatch(text);
        if (exactMatch) {
            return exactMatch;
        }

        // Layer 2: Keyword scoring
        const keywordMatch = this.keywordScoring(tokens);
        if (keywordMatch) {
            candidateIntents.push(keywordMatch);
        }

        // Layer 3: N-gram analysis
        const ngramMatch = this.ngramAnalysis(text, tokens);
        if (ngramMatch) {
            candidateIntents.push(ngramMatch);
        }

        // Layer 4: Sentiment analysis (influences confidence)
        const sentiment = this.analyzeSentiment(tokens);

        // Adjust confidence based on sentiment
        candidateIntents.forEach(intent => {
            if (sentiment.sentiment === 'positive' && ['ready_to_start', 'quote_request'].includes(intent.name)) {
                intent.confidence = Math.min(intent.confidence * 1.1, 1.0);
            } else if (sentiment.sentiment === 'negative' && ['budget_concern', 'not_interested'].includes(intent.name)) {
                intent.confidence = Math.min(intent.confidence * 1.1, 1.0);
            }
        });

        // Sort by confidence
        candidateIntents.sort((a, b) => b.confidence - a.confidence);

        // Layer 5: Contextual disambiguation
        if (candidateIntents.length > 0) {
            return this.contextualDisambiguation(candidateIntents, context);
        }

        // No match found - return fallback
        return {
            name: 'unknown',
            confidence: 0.0,
            layer: 'fallback'
        };
    },

    // ========================================
    // CONFIDENCE LEVEL
    // ========================================
    getConfidenceLevel(confidence) {
        if (confidence >= ChatbotConfig.NLP.CONFIDENCE_THRESHOLDS.HIGH) {
            return 'high'; // Direct response
        } else if (confidence >= ChatbotConfig.NLP.CONFIDENCE_THRESHOLDS.MEDIUM) {
            return 'medium'; // Ask clarification
        } else {
            return 'low'; // Fallback strategy
        }
    },

    // ========================================
    // FUZZY MATCHING (for spelling errors)
    // ========================================
    fuzzyMatch(input, patterns) {
        const bestMatches = [];

        patterns.forEach(pattern => {
            const similarity = ChatbotUtils.similarityRatio(input.toLowerCase(), pattern.toLowerCase());
            if (similarity >= 0.7) { // 70% similarity threshold
                bestMatches.push({
                    pattern: pattern,
                    similarity: similarity
                });
            }
        });

        bestMatches.sort((a, b) => b.similarity - a.similarity);

        return bestMatches.length > 0 ? bestMatches[0] : null;
    },

    // ========================================
    // DETECT MULTIPLE INTENTS
    // ========================================
    detectMultipleIntents(text, tokens) {
        const intents = [];

        // Check for multiple distinct intents in one message
        // Example: "I need a website for my restaurant ASAP and it needs online ordering"
        // Should detect: get_started, restaurant_mention, urgent_timeline, online_ordering_need

        // Run keyword scoring to get all intents above threshold
        const scores = {};

        for (const [intentName, intentData] of Object.entries(IntentLibrary)) {
            let score = 0;

            if (intentData.primary) {
                intentData.primary.forEach(keyword => {
                    if (tokens.includes(keyword)) score += 10;
                });
            }

            if (intentData.secondary) {
                intentData.secondary.forEach(keyword => {
                    if (tokens.includes(keyword)) score += 5;
                });
            }

            if (score >= 10) { // Threshold for inclusion
                const confidence = Math.min(score / 30, 1.0);
                intents.push({
                    name: intentName,
                    confidence: confidence,
                    score: score
                });
            }
        }

        intents.sort((a, b) => b.confidence - a.confidence);

        return intents;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotNLPEngine;
}
