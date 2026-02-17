/* ========================================
   LEAD MAGNET SYSTEM
   PDF downloads + email capture
   ======================================== */

/**
 * Lead Magnet Manager
 * Captures emails in exchange for valuable content (PDFs, guides, templates)
 *
 * Features:
 * - Email capture forms
 * - Instant PDF download
 * - Email service integration (ConvertKit/Mailchimp)
 * - Multiple lead magnets support
 * - Conversion tracking
 * - Thank you page
 */

class LeadMagnetManager {
    constructor() {
        this.leadMagnets = {
            'website-checklist': {
                id: 'website-checklist',
                title: 'Ultimate Website Launch Checklist',
                description: 'Everything you need before going live (47-point checklist)',
                fileName: 'website-launch-checklist.pdf',
                fileUrl: '/downloads/website-launch-checklist.pdf',
                tagId: 'lead-magnet-checklist'
            },
            'roi-calculator': {
                id: 'roi-calculator',
                title: 'Website ROI Calculator',
                description: 'Calculate exactly how much revenue your new website will generate',
                fileName: 'website-roi-calculator.pdf',
                fileUrl: '/downloads/website-roi-calculator.pdf',
                tagId: 'lead-magnet-roi'
            },
            'design-guide': {
                id: 'design-guide',
                title: 'Modern Web Design Guide 2026',
                description: '50+ design tips from top designers',
                fileName: 'web-design-guide-2026.pdf',
                fileUrl: '/downloads/web-design-guide-2026.pdf',
                tagId: 'lead-magnet-design'
            }
        };
    }

    /**
     * Show lead magnet popup
     * @param {string} magnetId - Lead magnet ID
     */
    showPopup(magnetId) {
        const magnet = this.leadMagnets[magnetId];
        if (!magnet) {
            console.error('Lead magnet not found:', magnetId);
            return;
        }

        // Create popup HTML
        const popupHtml = this.createPopupHtml(magnet);

        // Show modal
        if (window.ModalManager) {
            window.ModalManager.showCustomModal('lead-magnet-modal', popupHtml);
        } else {
            this.createFallbackModal(popupHtml);
        }

        // Set up form submission
        setTimeout(() => {
            this.setupFormHandler(magnetId);
        }, 100);

        // Track event
        this.trackEvent('LeadMagnet_Viewed', {
            magnet_id: magnetId,
            magnet_title: magnet.title
        });
    }

    /**
     * Create popup HTML
     * @param {Object} magnet - Lead magnet data
     * @returns {string} HTML
     */
    createPopupHtml(magnet) {
        return `
            <div class="lead-magnet-popup">
                <div class="lead-magnet-icon">📥</div>
                <h2 class="lead-magnet-title">${magnet.title}</h2>
                <p class="lead-magnet-description">${magnet.description}</p>

                <form id="lead-magnet-form-${magnet.id}" class="lead-magnet-form">
                    <div class="form-group">
                        <label for="lead-name">Your Name *</label>
                        <input
                            type="text"
                            id="lead-name"
                            name="name"
                            required
                            placeholder="John Doe"
                            autocomplete="name"
                        >
                    </div>

                    <div class="form-group">
                        <label for="lead-email">Email Address *</label>
                        <input
                            type="email"
                            id="lead-email"
                            name="email"
                            required
                            placeholder="john@example.com"
                            autocomplete="email"
                        >
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input
                                type="checkbox"
                                name="consent"
                                required
                            >
                            <span>I agree to receive emails from Pegrio (you can unsubscribe anytime)</span>
                        </label>
                    </div>

                    <button type="submit" class="btn btn-primary btn-large">
                        Get My Free ${magnet.title.split(' ')[0]} →
                    </button>

                    <p class="form-note">
                        🔒 Your information is safe. We never share your email.
                    </p>
                </form>

                <div id="lead-magnet-success-${magnet.id}" class="lead-magnet-success" style="display: none;">
                    <div class="success-icon">✓</div>
                    <h3>Check Your Email!</h3>
                    <p>We've sent ${magnet.title} to your inbox.</p>
                    <p class="download-backup">
                        Can't wait? <a href="${magnet.fileUrl}" download="${magnet.fileName}" class="download-link">Download now →</a>
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * Create fallback modal (if ModalManager not available)
     * @param {string} html - Modal HTML
     */
    createFallbackModal(html) {
        const modal = document.createElement('div');
        modal.className = 'modal lead-magnet-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                ${html}
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    /**
     * Set up form submission handler
     * @param {string} magnetId - Lead magnet ID
     */
    setupFormHandler(magnetId) {
        const form = document.getElementById(`lead-magnet-form-${magnetId}`);
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                magnetId: magnetId,
                magnetTitle: this.leadMagnets[magnetId].title
            };

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span> Sending...';

            try {
                // Submit to email service
                await this.submitToEmailService(data);

                // Hide form, show success
                form.style.display = 'none';
                const successDiv = document.getElementById(`lead-magnet-success-${magnetId}`);
                if (successDiv) {
                    successDiv.style.display = 'block';
                }

                // Track conversion
                this.trackConversion(data);

                // Auto-download PDF
                setTimeout(() => {
                    this.downloadPDF(magnetId);
                }, 1000);

            } catch (error) {
                console.error('Lead magnet submission error:', error);

                // Show error
                if (window.ToastNotification) {
                    window.ToastNotification.show(
                        'Oops! Something went wrong. Please try again.',
                        'error'
                    );
                }

                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    /**
     * Submit to email service (ConvertKit/Mailchimp)
     * @param {Object} data - Form data
     */
    async submitToEmailService(data) {
        const magnet = this.leadMagnets[data.magnetId];

        const response = await fetch('/api/subscribe-lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.email,
                firstName: data.name.split(' ')[0],
                lastName: data.name.split(' ').slice(1).join(' '),
                tagId: magnet.tagId,
                leadMagnet: data.magnetTitle,
                source: 'lead-magnet'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to subscribe');
        }

        return await response.json();
    }

    /**
     * Download PDF
     * @param {string} magnetId - Lead magnet ID
     */
    downloadPDF(magnetId) {
        const magnet = this.leadMagnets[magnetId];
        if (!magnet) return;

        // Create download link
        const link = document.createElement('a');
        link.href = magnet.fileUrl;
        link.download = magnet.fileName;
        link.click();

        // Track download
        this.trackEvent('LeadMagnet_Downloaded', {
            magnet_id: magnetId,
            magnet_title: magnet.title
        });
    }

    /**
     * Track conversion
     * @param {Object} data - Lead data
     */
    trackConversion(data) {
        // Emit event
        if (window.EventBus) {
            window.EventBus.emit('lead:captured', data);
        }

        // Track analytics
        if (window.Analytics) {
            window.Analytics.trackEvent('LeadMagnet_Conversion', {
                event_category: 'lead_generation',
                event_label: data.magnetTitle,
                value: 1
            });

            // Track as conversion
            if (window.gtag) {
                gtag('event', 'conversion', {
                    event_category: 'lead_generation',
                    event_label: data.magnetTitle
                });
            }

            // Facebook Pixel
            if (window.fbq) {
                fbq('track', 'Lead', {
                    content_name: data.magnetTitle,
                    value: 1,
                    currency: 'USD'
                });
            }
        }
    }

    /**
     * Track event
     * @param {string} eventName - Event name
     * @param {Object} data - Event data
     */
    trackEvent(eventName, data = {}) {
        if (window.Analytics) {
            window.Analytics.trackEvent(eventName, {
                event_category: 'lead_magnets',
                ...data
            });
        }

        if (window.EventBus) {
            window.EventBus.emit(`lead-magnet:${eventName.toLowerCase()}`, data);
        }
    }

    /**
     * Create lead magnet button
     * @param {string} magnetId - Lead magnet ID
     * @param {Object} options - Button options
     * @returns {HTMLElement} Button element
     */
    createButton(magnetId, options = {}) {
        const magnet = this.leadMagnets[magnetId];
        if (!magnet) {
            console.error('Lead magnet not found:', magnetId);
            return null;
        }

        const button = document.createElement('button');
        button.className = options.className || 'btn btn-secondary lead-magnet-button';
        button.textContent = options.text || `Download Free ${magnet.title.split(' ')[0]}`;
        button.setAttribute('aria-label', `Download ${magnet.title}`);
        button.dataset.magnetId = magnetId;

        button.addEventListener('click', () => {
            this.showPopup(magnetId);
        });

        return button;
    }

    /**
     * Add lead magnet to page
     * @param {string} containerId - Container element ID
     * @param {string} magnetId - Lead magnet ID
     */
    addToPage(containerId, magnetId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }

        const magnet = this.leadMagnets[magnetId];
        if (!magnet) {
            console.error('Lead magnet not found:', magnetId);
            return;
        }

        const html = `
            <div class="lead-magnet-card" data-magnet-id="${magnetId}">
                <div class="lead-magnet-card-icon">📄</div>
                <h3>${magnet.title}</h3>
                <p>${magnet.description}</p>
                <button class="btn btn-primary" onclick="LeadMagnetManager.showPopup('${magnetId}')">
                    Download Free Guide
                </button>
            </div>
        `;

        container.innerHTML = html;
    }
}

// Create singleton instance
const leadMagnetManager = new LeadMagnetManager();

// Make available globally
if (typeof window !== 'undefined') {
    window.LeadMagnetManager = leadMagnetManager;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = leadMagnetManager;
}

/* ========================================
   USAGE EXAMPLES
   ======================================== */

/**
 * Example 1: Show popup on button click
 *
 * <button onclick="LeadMagnetManager.showPopup('website-checklist')">
 *     Get Free Checklist
 * </button>
 */

/**
 * Example 2: Create button programmatically
 *
 * const button = LeadMagnetManager.createButton('website-checklist', {
 *     text: 'Download Free Guide',
 *     className: 'btn btn-primary'
 * });
 * document.querySelector('.hero').appendChild(button);
 */

/**
 * Example 3: Add to specific container
 *
 * LeadMagnetManager.addToPage('lead-magnet-container', 'roi-calculator');
 */

/**
 * Example 4: Listen for conversions
 *
 * EventBus.on('lead:captured', (data) => {
 *     console.log('New lead:', data.email);
 *     // Send to CRM, show thank you message, etc.
 * });
 */
