/* ========================================
   RECOMMENDATION ENGINE
   Intelligent package recommendations + ROI calculations
   ======================================== */

const ChatbotRecommendation = {
    // ========================================
    // PACKAGE RECOMMENDATION
    // ========================================

    /**
     * Recommend best package based on user profile and lead score
     * @param {Object} userProfile - User profile from conversation
     * @param {number} leadScore - Lead score (0-100)
     * @returns {Object} - {package, confidence, reasoning}
     */
    recommend(userProfile, leadScore) {
        // Decision tree logic
        const recommendation = this.applyDecisionTree(userProfile, leadScore);

        // Calculate confidence in recommendation
        const confidence = this.calculateConfidence(userProfile, recommendation);

        // Generate reasoning
        const reasoning = this.generateReasoning(userProfile, recommendation);

        return {
            package: recommendation,
            confidence: confidence,
            reasoning: reasoning,
            packageData: ChatbotConfig.PACKAGES[recommendation.toUpperCase()]
        };
    },

    // ========================================
    // DECISION TREE
    // ========================================

    /**
     * Apply decision tree logic to recommend package
     * @param {Object} userProfile
     * @param {number} leadScore
     * @returns {string} - essential, professional, or premium
     */
    applyDecisionTree(userProfile, leadScore) {
        // RULE 1: Budget constraints
        if (userProfile.budgetRange === 'tight' || userProfile.budgetRange === 'essential') {
            return 'essential'; // Budget under $2.5K → Essential
        }

        // RULE 2: Premium budget → Premium package
        if (userProfile.budgetRange === 'premium' || userProfile.budgetRange === 'flexible') {
            return 'premium'; // Budget $6K+ or flexible → Premium
        }

        // RULE 3: High-value features needed → Premium
        const needsOnlineOrdering = userProfile.featuresNeeded.includes('ordering');
        const needsOnlineBooking = userProfile.featuresNeeded.includes('booking');
        const needsAI = userProfile.featuresNeeded.includes('ai');
        const needsEcommerce = userProfile.featuresNeeded.includes('ecommerce');

        // If needs both ordering AND booking → Premium
        if (needsOnlineOrdering && needsOnlineBooking) {
            return 'premium';
        }

        // If needs e-commerce → Premium
        if (needsEcommerce) {
            return 'premium';
        }

        // RULE 4: Restaurant + AI/ordering → Professional or Premium
        if (userProfile.businessType === 'restaurant') {
            if (needsOnlineOrdering || needsAI) {
                return 'professional'; // Restaurant + online ordering/AI → Professional
            }
        }

        // RULE 5: Salon + booking → Professional or Premium
        if (userProfile.businessType === 'salon' || userProfile.businessType === 'spa') {
            if (needsOnlineBooking) {
                return 'premium'; // Salon + booking → Premium
            }
        }

        // RULE 6: Fitness + member portal → Professional
        if (userProfile.businessType === 'fitness') {
            if (userProfile.featuresNeeded.length > 0) {
                return 'professional';
            }
        }

        // RULE 7: Urgent timeline + good budget → Professional
        if (userProfile.timelineUrgency === 'urgent' && userProfile.budgetRange === 'professional') {
            return 'professional';
        }

        // RULE 8: High lead score (hot/qualified) → Professional
        if (leadScore >= 70) {
            return 'professional'; // Hot leads can afford Professional
        }

        // RULE 9: Multiple features needed → Professional
        if (userProfile.featuresNeeded.length >= 2) {
            return 'professional';
        }

        // RULE 10: Multiple pain points → Professional
        if (userProfile.painPoints.length >= 3) {
            return 'professional'; // Lots of pain = willing to pay for solution
        }

        // DEFAULT: Professional (78% of customers choose this)
        return 'professional';
    },

    /**
     * Calculate confidence in recommendation (0-1)
     * @param {Object} userProfile
     * @param {string} recommendation
     * @returns {number}
     */
    calculateConfidence(userProfile, recommendation) {
        let confidence = 0.5; // Start at 50%

        // Increase confidence if we have key data
        if (userProfile.businessType) confidence += 0.1;
        if (userProfile.budgetRange) confidence += 0.15;
        if (userProfile.featuresNeeded.length > 0) confidence += 0.1;
        if (userProfile.timelineUrgency) confidence += 0.1;
        if (userProfile.painPoints.length > 0) confidence += 0.05;

        // Cap at 1.0
        return Math.min(confidence, 1.0);
    },

    /**
     * Generate reasoning for recommendation
     * @param {Object} userProfile
     * @param {string} recommendation
     * @returns {string}
     */
    generateReasoning(userProfile, recommendation) {
        const reasons = [];

        // Build reasoning based on decision factors
        if (recommendation === 'essential') {
            if (userProfile.budgetRange === 'tight' || userProfile.budgetRange === 'essential') {
                reasons.push('Budget-conscious choice');
            }
            reasons.push('Perfect starter package for your business');
        }

        if (recommendation === 'professional') {
            if (userProfile.businessType) {
                reasons.push(`Ideal for ${userProfile.businessType} businesses`);
            }
            if (userProfile.featuresNeeded.includes('ai')) {
                reasons.push('Includes AI chatbot you requested');
            }
            if (userProfile.featuresNeeded.includes('ordering')) {
                reasons.push('Includes online ordering system');
            }
            if (userProfile.featuresNeeded.includes('booking')) {
                reasons.push('Includes online booking system');
            }
            if (userProfile.budgetRange === 'professional') {
                reasons.push('Fits your budget range perfectly');
            }
            reasons.push('Our most popular package (78% of clients choose this)');
        }

        if (recommendation === 'premium') {
            if (userProfile.budgetRange === 'premium' || userProfile.budgetRange === 'flexible') {
                reasons.push('You have the budget for our complete solution');
            }
            if (userProfile.featuresNeeded.length >= 2) {
                reasons.push('Includes all features you need');
            }
            if (userProfile.businessType === 'salon') {
                reasons.push('Salons see 40% more bookings with Premium');
            }
            if (userProfile.businessType === 'restaurant') {
                reasons.push('Restaurants generate $4,500+/month extra with Premium');
            }
            reasons.push('All-inclusive solution - everything you need to succeed');
        }

        return reasons.join('. ');
    },

    // ========================================
    // ROI CALCULATIONS
    // ========================================

    /**
     * Calculate ROI for recommended package
     * @param {Object} userProfile
     * @param {string} packageName
     * @returns {Object} - ROI data
     */
    calculateROI(userProfile, packageName) {
        const packageData = ChatbotConfig.PACKAGES[packageName.toUpperCase()];
        const packagePrice = packageData.price;

        // Get industry-specific ROI
        const roiData = this.getIndustryROI(userProfile.businessType, packageName);

        // Calculate payback period
        const monthlyValue = roiData.monthlyRevenue || 0;
        const paybackMonths = monthlyValue > 0 ? Math.ceil(packagePrice / monthlyValue) : 12;

        // Calculate first year ROI
        const firstYearRevenue = monthlyValue * 12;
        const firstYearROI = firstYearRevenue > 0
            ? ((firstYearRevenue - packagePrice) / packagePrice) * 100
            : 0;

        return {
            packagePrice: packagePrice,
            monthlyRevenue: monthlyValue,
            firstYearRevenue: firstYearRevenue,
            paybackMonths: paybackMonths,
            firstYearROI: Math.round(firstYearROI),
            roiMultiple: monthlyValue > 0 ? (firstYearRevenue / packagePrice).toFixed(1) : 0,
            ...roiData
        };
    },

    /**
     * Get industry-specific ROI data
     * @param {string} businessType
     * @param {string} packageName
     * @returns {Object}
     */
    getIndustryROI(businessType, packageName) {
        const roiData = {
            'restaurant': {
                'essential': {
                    monthlyRevenue: 1200,
                    metric: 'extra orders per month',
                    metricValue: '15-20',
                    description: 'Online presence drives new customers'
                },
                'professional': {
                    monthlyRevenue: 4500,
                    metric: 'in online ordering revenue',
                    metricValue: '$4,500',
                    description: 'Online ordering averages $4,500/month for restaurants'
                },
                'premium': {
                    monthlyRevenue: 7500,
                    metric: 'in combined ordering + catering',
                    metricValue: '$7,500',
                    description: 'Full system captures online orders, catering, and reservations'
                }
            },
            'salon': {
                'essential': {
                    monthlyRevenue: 800,
                    metric: 'new client bookings',
                    metricValue: '10-15',
                    description: 'Online presence attracts new clients'
                },
                'professional': {
                    monthlyRevenue: 2400,
                    metric: 'more bookings per month',
                    metricValue: '40%',
                    description: 'Online booking increases appointment conversion by 40%'
                },
                'premium': {
                    monthlyRevenue: 4200,
                    metric: 'increase in bookings + retention',
                    metricValue: '60%',
                    description: 'Full booking system + email automation drives retention'
                }
            },
            'fitness': {
                'essential': {
                    monthlyRevenue: 900,
                    metric: 'new member signups',
                    metricValue: '5-8',
                    description: 'Professional site drives membership growth'
                },
                'professional': {
                    monthlyRevenue: 3200,
                    metric: 'member retention improvement',
                    metricValue: '34%',
                    description: 'Member portal increases retention by 34%'
                },
                'premium': {
                    monthlyRevenue: 5500,
                    metric: 'combined new members + retention',
                    metricValue: '$5,500',
                    description: 'Full system drives growth and prevents churn'
                }
            },
            'cafe': {
                'essential': {
                    monthlyRevenue: 1000,
                    metric: 'new customers',
                    metricValue: '20-30',
                    description: 'Online presence brings foot traffic'
                },
                'professional': {
                    monthlyRevenue: 3500,
                    metric: 'in online orders',
                    metricValue: '$3,500',
                    description: 'Online ordering for pickup/delivery'
                },
                'premium': {
                    monthlyRevenue: 5800,
                    metric: 'total online revenue',
                    metricValue: '$5,800',
                    description: 'Full ordering + catering system'
                }
            },
            'bar': {
                'essential': {
                    monthlyRevenue: 700,
                    metric: 'event bookings',
                    metricValue: '8-12',
                    description: 'Online presence drives event inquiries'
                },
                'professional': {
                    monthlyRevenue: 2200,
                    metric: 'private event revenue',
                    metricValue: '$2,200',
                    description: 'Event booking system captures private parties'
                },
                'premium': {
                    monthlyRevenue: 4000,
                    metric: 'total event revenue',
                    metricValue: '$4,000',
                    description: 'Full event + reservation system'
                }
            }
        };

        // Get data for business type and package
        const bizData = roiData[businessType] || roiData['restaurant']; // Default to restaurant
        return bizData[packageName] || bizData['professional']; // Default to professional
    },

    // ========================================
    // PACKAGE COMPARISON
    // ========================================

    /**
     * Compare all packages for user
     * @param {Object} userProfile
     * @returns {Object} - Comparison data
     */
    comparePackages(userProfile) {
        const packages = ['essential', 'professional', 'premium'];

        const comparison = packages.map(pkg => {
            const recommendation = this.recommend(userProfile, 50); // Use moderate score
            const roi = this.calculateROI(userProfile, pkg);
            const packageData = ChatbotConfig.PACKAGES[pkg.toUpperCase()];

            return {
                name: pkg,
                displayName: packageData.displayName,
                price: packageData.price,
                features: packageData.features,
                roi: roi,
                isRecommended: recommendation.package === pkg
            };
        });

        return comparison;
    },

    // ========================================
    // UPSELL/DOWNSELL
    // ========================================

    /**
     * Get upsell package (if applicable)
     * @param {string} currentPackage
     * @param {Object} userProfile
     * @returns {Object|null}
     */
    getUpsellPackage(currentPackage, userProfile) {
        const upsellMap = {
            'essential': 'professional',
            'professional': 'premium',
            'premium': null
        };

        const upsellPackage = upsellMap[currentPackage];

        if (!upsellPackage) return null;

        // Calculate additional value
        const currentROI = this.calculateROI(userProfile, currentPackage);
        const upsellROI = this.calculateROI(userProfile, upsellPackage);

        const additionalRevenue = upsellROI.firstYearRevenue - currentROI.firstYearRevenue;
        const additionalCost = upsellROI.packagePrice - currentROI.packagePrice;

        return {
            package: upsellPackage,
            packageData: ChatbotConfig.PACKAGES[upsellPackage.toUpperCase()],
            additionalCost: additionalCost,
            additionalRevenue: additionalRevenue,
            additionalROI: ((additionalRevenue - additionalCost) / additionalCost * 100).toFixed(0)
        };
    },

    /**
     * Get downsell package (for objection handling)
     * @param {string} currentPackage
     * @returns {Object|null}
     */
    getDownsellPackage(currentPackage) {
        const downsellMap = {
            'premium': 'professional',
            'professional': 'essential',
            'essential': null
        };

        const downsellPackage = downsellMap[currentPackage];

        if (!downsellPackage) return null;

        return {
            package: downsellPackage,
            packageData: ChatbotConfig.PACKAGES[downsellPackage.toUpperCase()]
        };
    },

    // ========================================
    // FEATURE MATCHING
    // ========================================

    /**
     * Check if package includes all requested features
     * @param {string} packageName
     * @param {Array} featuresNeeded
     * @returns {Object} - {hasAll, missing}
     */
    checkFeatureMatch(packageName, featuresNeeded) {
        const packageData = ChatbotConfig.PACKAGES[packageName.toUpperCase()];
        const packageFeatures = packageData.features || [];

        // Map user features to package features
        const featureMap = {
            'ordering': 'Online Ordering System',
            'booking': 'Online Booking System',
            'ai': 'AI Chatbot',
            'seo': 'SEO Optimization',
            'design': 'Custom Design',
            'ecommerce': 'E-commerce Platform',
            'email': 'Email Marketing'
        };

        const missing = [];

        featuresNeeded.forEach(feature => {
            const packageFeature = featureMap[feature];
            if (packageFeature && !packageFeatures.includes(packageFeature)) {
                missing.push(packageFeature);
            }
        });

        return {
            hasAll: missing.length === 0,
            missing: missing,
            matchPercentage: featuresNeeded.length > 0
                ? ((featuresNeeded.length - missing.length) / featuresNeeded.length * 100).toFixed(0)
                : 100
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotRecommendation;
}
