/* ========================================
   FORM INTEGRATOR
   Two-way sync between chatbot and quote form
   ======================================== */

const ChatbotFormIntegrator = {
    // Form field mappings
    fieldMappings: {
        name: 'name',
        email: 'email',
        phone: 'phone',
        businessName: 'business-name',
        businessType: 'business-type',
        message: 'message',
        package: 'package-preference',
        // Hidden fields
        leadScore: 'lead-score',
        conversationData: 'conversation-data'
    },

    // ========================================
    // AUTO-POPULATE FORM
    // ========================================

    /**
     * Auto-populate quote form with conversation data
     * @param {Object} userProfile - User profile from conversation
     * @param {Object} context - Full conversation context
     */
    populateForm(userProfile, context) {
        // Get form element
        const form = this.getQuoteForm();
        if (!form) {
            console.warn('Quote form not found');
            return;
        }

        // Populate basic fields
        this.setFieldValue('email', userProfile.email);
        this.setFieldValue('phone', userProfile.phone);
        this.setFieldValue('businessName', userProfile.businessName);

        // Set business type (if dropdown exists)
        this.setFieldValue('businessType', this.formatBusinessType(userProfile.businessType));

        // Build intelligent message
        const intelligentMessage = this.buildIntelligentMessage(userProfile, context);
        this.setFieldValue('message', intelligentMessage);

        // Set package recommendation (if dropdown exists)
        if (context.recommendedPackage) {
            this.setFieldValue('package', this.formatPackageName(context.recommendedPackage));
        }

        // Set hidden fields
        this.setHiddenField('leadScore', context.leadScore);
        this.setHiddenField('conversationData', JSON.stringify(this.getConversationSummary(userProfile, context)));
    },

    /**
     * Get quote form element
     * @returns {HTMLElement|null}
     */
    getQuoteForm() {
        // Try common form IDs/classes
        return document.querySelector('#quote-form') ||
               document.querySelector('#contact-form') ||
               document.querySelector('.quote-form') ||
               document.querySelector('form[name="quote"]');
    },

    /**
     * Set form field value
     * @param {string} fieldKey - Key from fieldMappings
     * @param {string} value - Value to set
     */
    setFieldValue(fieldKey, value) {
        if (!value) return;

        const fieldName = this.fieldMappings[fieldKey];
        if (!fieldName) return;

        // Try multiple selectors
        const field = document.querySelector(`#${fieldName}`) ||
                     document.querySelector(`[name="${fieldName}"]`) ||
                     document.querySelector(`[data-field="${fieldName}"]`);

        if (field) {
            if (field.tagName === 'SELECT') {
                // For dropdowns, find matching option
                const option = Array.from(field.options).find(opt =>
                    opt.value.toLowerCase() === value.toLowerCase() ||
                    opt.text.toLowerCase() === value.toLowerCase()
                );
                if (option) {
                    field.value = option.value;
                }
            } else {
                field.value = value;
            }

            // Trigger change event
            field.dispatchEvent(new Event('change', { bubbles: true }));
        }
    },

    /**
     * Set or create hidden field
     * @param {string} fieldKey
     * @param {string} value
     */
    setHiddenField(fieldKey, value) {
        if (!value) return;

        const form = this.getQuoteForm();
        if (!form) return;

        const fieldName = this.fieldMappings[fieldKey];
        let field = form.querySelector(`input[name="${fieldName}"]`);

        // Create hidden field if doesn't exist
        if (!field) {
            field = document.createElement('input');
            field.type = 'hidden';
            field.name = fieldName;
            form.appendChild(field);
        }

        field.value = value;
    },

    // ========================================
    // INTELLIGENT MESSAGE BUILDER
    // ========================================

    /**
     * Build intelligent message summarizing conversation
     * @param {Object} userProfile
     * @param {Object} context
     * @returns {string}
     */
    buildIntelligentMessage(userProfile, context) {
        const parts = [];

        // Business type
        if (userProfile.businessType) {
            const bizType = this.formatBusinessType(userProfile.businessType);
            parts.push(`I have a ${bizType} business${userProfile.businessName ? ` called "${userProfile.businessName}"` : ''}.`);
        }

        // Features needed
        if (userProfile.featuresNeeded && userProfile.featuresNeeded.length > 0) {
            const features = this.formatFeaturesList(userProfile.featuresNeeded);
            parts.push(`I need: ${features}.`);
        }

        // Pain points
        if (userProfile.painPoints && userProfile.painPoints.length > 0) {
            const painPoints = this.formatPainPointsList(userProfile.painPoints);
            parts.push(`Current challenges: ${painPoints}.`);
        }

        // Budget
        if (userProfile.budgetRange) {
            const budget = this.formatBudgetRange(userProfile.budgetRange);
            parts.push(`Budget: ${budget}.`);
        }

        // Timeline
        if (userProfile.timelineUrgency) {
            const timeline = this.formatTimeline(userProfile.timelineUrgency);
            parts.push(`Timeline: ${timeline}.`);
        }

        // Package interest
        if (context.recommendedPackage) {
            const pkg = this.formatPackageName(context.recommendedPackage);
            parts.push(`Interested in: ${pkg} package.`);
        }

        // Add footer
        parts.push('\n(Message auto-generated from chatbot conversation)');

        return parts.join(' ');
    },

    /**
     * Format business type for display
     * @param {string} businessType
     * @returns {string}
     */
    formatBusinessType(businessType) {
        if (!businessType) return '';

        const formatted = {
            'restaurant': 'Restaurant',
            'salon': 'Salon/Spa',
            'fitness': 'Fitness/Gym',
            'cafe': 'Cafe/Coffee Shop',
            'bar': 'Bar/Pub',
            'retail': 'Retail Store',
            'other': 'Business'
        };

        return formatted[businessType] || businessType;
    },

    /**
     * Format features list
     * @param {Array} features
     * @returns {string}
     */
    formatFeaturesList(features) {
        const formatted = features.map(f => {
            const names = {
                'ordering': 'Online Ordering',
                'booking': 'Online Booking',
                'ai': 'AI Chatbot',
                'seo': 'SEO Optimization',
                'design': 'Custom Design',
                'ecommerce': 'E-commerce',
                'email': 'Email Marketing'
            };
            return names[f] || f;
        });

        return this.formatList(formatted);
    },

    /**
     * Format pain points list
     * @param {Array} painPoints
     * @returns {string}
     */
    formatPainPointsList(painPoints) {
        const formatted = painPoints.map(p => {
            const names = {
                'no_online_presence': 'No website',
                'outdated_website': 'Outdated website',
                'no_online_orders': 'No online ordering',
                'no_bookings': 'No online booking',
                'losing_customers': 'Losing customers',
                'not_on_google': 'Not showing up on Google',
                'looks_unprofessional': 'Looks unprofessional',
                'no_mobile_version': 'Not mobile-friendly',
                'cant_update_self': 'Can\'t update myself'
            };
            return names[p] || p;
        });

        return this.formatList(formatted);
    },

    /**
     * Format budget range
     * @param {string} budgetRange
     * @returns {string}
     */
    formatBudgetRange(budgetRange) {
        const ranges = {
            'tight': 'Under $2,000',
            'essential': '$2,000-$2,500',
            'professional': '$2,500-$6,000',
            'premium': '$6,000+',
            'flexible': 'Flexible'
        };

        return ranges[budgetRange] || budgetRange;
    },

    /**
     * Format timeline
     * @param {string} timeline
     * @returns {string}
     */
    formatTimeline(timeline) {
        const timelines = {
            'urgent': 'ASAP (1-2 weeks)',
            'soon': 'Soon (2-4 weeks)',
            'flexible': 'Flexible timeline',
            'exploring': 'Just exploring options'
        };

        return timelines[timeline] || timeline;
    },

    /**
     * Format package name
     * @param {string} packageName
     * @returns {string}
     */
    formatPackageName(packageName) {
        return packageName.charAt(0).toUpperCase() + packageName.slice(1);
    },

    /**
     * Format array as comma-separated list
     * @param {Array} items
     * @returns {string}
     */
    formatList(items) {
        if (items.length === 0) return '';
        if (items.length === 1) return items[0];
        if (items.length === 2) return items.join(' and ');

        return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
    },

    // ========================================
    // CONVERSATION SUMMARY
    // ========================================

    /**
     * Get conversation summary for hidden field
     * @param {Object} userProfile
     * @param {Object} context
     * @returns {Object}
     */
    getConversationSummary(userProfile, context) {
        return {
            profile: {
                businessType: userProfile.businessType,
                businessName: userProfile.businessName,
                budgetRange: userProfile.budgetRange,
                timelineUrgency: userProfile.timelineUrgency,
                featuresNeeded: userProfile.featuresNeeded,
                painPoints: userProfile.painPoints,
                isDecisionMaker: userProfile.isDecisionMaker
            },
            qualification: {
                leadScore: context.leadScore,
                leadLevel: context.leadLevel,
                recommendedPackage: context.recommendedPackage
            },
            engagement: {
                messageCount: context.messageCount,
                sessionDuration: Date.now() - (context.startTime || Date.now()),
                completionRate: this.calculateCompletionRate(userProfile)
            }
        };
    },

    /**
     * Calculate profile completion rate
     * @param {Object} userProfile
     * @returns {number}
     */
    calculateCompletionRate(userProfile) {
        const fields = ['businessType', 'budgetRange', 'timelineUrgency', 'isDecisionMaker'];
        const completed = fields.filter(f => userProfile[f] != null).length;
        return Math.round((completed / fields.length) * 100);
    },

    // ========================================
    // CTA MANAGEMENT
    // ========================================

    /**
     * Show "Get Your Quote" CTA button in chat
     * @param {Object} context
     * @returns {string} - HTML for CTA button
     */
    buildFormCTA(context) {
        const packageName = context.recommendedPackage
            ? this.formatPackageName(context.recommendedPackage)
            : 'Custom';

        return `
            <div class="chatbot-form-cta" style="
                background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
                padding: 20px;
                border-radius: 16px;
                text-align: center;
                margin: 10px 0;
                box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
            ">
                <div style="color: white; font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                    Ready to Get Started?
                </div>
                <div style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin-bottom: 16px;">
                    ${packageName} Package • ${context.leadLevel === 'qualified' ? '🔥 Perfect Fit!' : 'Great Match!'}
                </div>
                <button
                    onclick="ChatbotFormIntegrator.openQuoteForm()"
                    style="
                        background: white;
                        color: #667EEA;
                        border: none;
                        padding: 14px 32px;
                        border-radius: 24px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        transition: all 0.3s ease;
                    "
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0, 0, 0, 0.15)';"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.1)';"
                >
                    Get Your Quote →
                </button>
            </div>
        `;
    },

    /**
     * Check if we should show form CTA
     * @param {Object} context
     * @returns {boolean}
     */
    shouldShowFormCTA(context) {
        // Must have recommendation
        if (!context.recommendedPackage) return false;

        // Must have exchanged at least 5 messages
        if (context.messageCount < 5) return false;

        // Lead score must be at least 40 (warm)
        if (context.leadScore < 40) return false;

        // Must show buying intent
        const buyingIntents = ['ready_to_start', 'quote_request', 'get_started'];
        const hasBuyingIntent = context.recentIntents.some(i =>
            buyingIntents.includes(i.intent)
        ) || context.currentState === 'closing';

        return hasBuyingIntent;
    },

    // ========================================
    // FORM OPENING
    // ========================================

    /**
     * Open quote form modal
     */
    openQuoteForm() {
        // Try to find and open the modal
        const modal = document.querySelector('#quote-modal') ||
                     document.querySelector('.modal') ||
                     document.querySelector('[data-modal="quote"]');

        if (modal) {
            // Show modal
            modal.style.display = 'block';
            modal.classList.add('active', 'open');

            // Trigger modal open event
            modal.dispatchEvent(new Event('modal:open', { bubbles: true }));

            // Focus first input
            setTimeout(() => {
                const firstInput = modal.querySelector('input:not([type="hidden"]), textarea, select');
                if (firstInput) firstInput.focus();
            }, 300);
        } else {
            // Fallback: scroll to form on page
            const form = this.getQuoteForm();
            if (form) {
                form.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Focus first input
                setTimeout(() => {
                    const firstInput = form.querySelector('input:not([type="hidden"]), textarea, select');
                    if (firstInput) firstInput.focus();
                }, 500);
            }
        }

        // Trigger form open event
        this.triggerEvent('chatbot:formopen');
    },

    /**
     * Trigger custom event
     * @param {string} eventName
     * @param {Object} detail
     */
    triggerEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: detail,
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(event);
    },

    // ========================================
    // FORM SUBMISSION TRACKING
    // ========================================

    /**
     * Track form submission (for analytics)
     * @param {Object} formData
     */
    trackFormSubmission(formData) {
        // Track with analytics (Google Analytics, Facebook Pixel, etc.)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'Quote Form',
                event_label: 'Chatbot Assisted',
                value: formData.leadScore || 0
            });
        }

        // Track with Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: 'Quote Request',
                content_category: 'Chatbot',
                value: formData.leadScore || 0
            });
        }

        // Trigger event for custom tracking
        this.triggerEvent('chatbot:formsubmit', { formData });
    },

    // ========================================
    // UTILITIES
    // ========================================

    /**
     * Clear form fields
     */
    clearForm() {
        const form = this.getQuoteForm();
        if (form) {
            form.reset();
        }
    },

    /**
     * Get form data as object
     * @returns {Object}
     */
    getFormData() {
        const form = this.getQuoteForm();
        if (!form) return {};

        const formData = new FormData(form);
        const data = {};

        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    },

    /**
     * Validate form is populated correctly
     * @returns {Object} - {valid, missing}
     */
    validateFormPopulation() {
        const form = this.getQuoteForm();
        if (!form) {
            return { valid: false, missing: ['Form not found'] };
        }

        const requiredFields = ['email', 'message'];
        const missing = [];

        requiredFields.forEach(fieldKey => {
            const fieldName = this.fieldMappings[fieldKey];
            const field = form.querySelector(`[name="${fieldName}"]`);

            if (!field || !field.value.trim()) {
                missing.push(fieldKey);
            }
        });

        return {
            valid: missing.length === 0,
            missing: missing
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotFormIntegrator;
}
