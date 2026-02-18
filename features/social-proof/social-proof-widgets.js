/* ========================================
   SOCIAL PROOF WIDGETS
   Trust building elements
   ======================================== */

/**
 * Social Proof Widgets
 * Build trust with live activity, reviews, and badges
 *
 * Features:
 * - Live activity notifications
 * - Review rotator
 * - Trust badges
 * - Stats counter
 */

class SocialProofWidgets {
    constructor() {
        this.activities = [
            { name: 'Sarah M.', location: 'New York, NY', action: 'requested a quote for Professional Package', time: '2 minutes ago' },
            { name: 'Mike J.', location: 'Austin, TX', action: 'scheduled a discovery call', time: '15 minutes ago' },
            { name: 'Jennifer L.', location: 'Miami, FL', action: 'downloaded the Website Checklist', time: '23 minutes ago' },
            { name: 'David K.', location: 'Seattle, WA', action: 'purchased the Premium Package', time: '1 hour ago' },
            { name: 'Lisa P.', location: 'Boston, MA', action: 'requested a quote for Essential Package', time: '2 hours ago' },
            { name: 'Tom R.', location: 'Denver, CO', action: 'scheduled a discovery call', time: '3 hours ago' },
            { name: 'Emily S.', location: 'Portland, OR', action: 'downloaded the ROI Calculator', time: '4 hours ago' },
            { name: 'Chris B.', location: 'Chicago, IL', action: 'requested a quote for Professional Package', time: '5 hours ago' }
        ];

        this.reviews = [
            { author: 'Sarah Mitchell', rating: 5, text: 'Pegrio built us an amazing website that increased our online orders by 300%. Highly recommend!', business: 'The Italian Kitchen' },
            { author: 'John Davis', rating: 5, text: 'Professional, fast, and the end result exceeded our expectations. Worth every penny.', business: 'Davis Law Firm' },
            { author: 'Maria Garcia', rating: 5, text: 'They understood our vision perfectly and delivered a website that our customers love.', business: 'Garcia Boutique' },
            { author: 'Robert Chen', rating: 5, text: 'Best web design experience ever. The team was responsive and creative.', business: 'Chen Consulting' },
            { author: 'Amanda Lee', rating: 5, text: 'Our new website has transformed our business. We get 10x more inquiries now!', business: 'Lee Photography' }
        ];

        this.currentActivityIndex = 0;
        this.currentReviewIndex = 0;
        this.activityInterval = null;
        this.reviewInterval = null;
    }

    /**
     * Initialize all widgets
     */
    init() {
        this.initLiveActivity();
        this.initReviewRotator();
        this.initTrustBadges();
        this.initStatsCounter();
        console.log('✅ Social proof widgets initialized');
    }

    /**
     * Initialize live activity notifications
     */
    initLiveActivity() {
        // Show first activity after delay
        setTimeout(() => {
            this.showActivity();

            // Then show new activity every 8-15 seconds
            this.activityInterval = setInterval(() => {
                this.showActivity();
            }, Math.random() * 7000 + 8000); // 8-15 seconds
        }, 3000);
    }

    /**
     * Show activity notification
     */
    showActivity() {
        const activity = this.activities[this.currentActivityIndex];
        this.currentActivityIndex = (this.currentActivityIndex + 1) % this.activities.length;

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'social-proof-notification';
        notification.innerHTML = `
            <div class="notification-icon">👤</div>
            <div class="notification-content">
                <div class="notification-header">
                    <strong>${activity.name}</strong> from ${activity.location}
                </div>
                <div class="notification-action">${activity.action}</div>
                <div class="notification-time">${activity.time}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Track event
        this.trackEvent('Activity_Shown', { action: activity.action });
    }

    /**
     * Initialize review rotator
     */
    initReviewRotator() {
        const container = document.querySelector('#review-rotator');
        if (!container) return;

        // Show first review
        this.showReview(container);

        // Rotate every 6 seconds
        this.reviewInterval = setInterval(() => {
            this.showReview(container);
        }, 6000);
    }

    /**
     * Show review
     * @param {HTMLElement} container - Container element
     */
    showReview(container) {
        const review = this.reviews[this.currentReviewIndex];
        this.currentReviewIndex = (this.currentReviewIndex + 1) % this.reviews.length;

        const stars = '⭐'.repeat(review.rating);

        container.innerHTML = `
            <div class="review-card fade-in-up">
                <div class="review-stars">${stars}</div>
                <p class="review-text">"${review.text}"</p>
                <div class="review-author">
                    <strong>${review.author}</strong>
                    <span>${review.business}</span>
                </div>
            </div>
        `;
    }

    /**
     * Initialize trust badges
     */
    initTrustBadges() {
        const container = document.querySelector('#trust-badges');
        if (!container) return;

        container.innerHTML = `
            <div class="trust-badges">
                <div class="trust-badge">
                    <div class="badge-icon">🔒</div>
                    <div class="badge-text">
                        <strong>Secure Payments</strong>
                        <span>256-bit SSL encryption</span>
                    </div>
                </div>
                <div class="trust-badge">
                    <div class="badge-icon">⭐</div>
                    <div class="badge-text">
                        <strong>5.0 Rating</strong>
                        <span>From 50+ clients</span>
                    </div>
                </div>
                <div class="trust-badge">
                    <div class="badge-icon">✓</div>
                    <div class="badge-text">
                        <strong>100% Guaranteed</strong>
                        <span>Money-back if not satisfied</span>
                    </div>
                </div>
                <div class="trust-badge">
                    <div class="badge-icon">⚡</div>
                    <div class="badge-text">
                        <strong>Fast Delivery</strong>
                        <span>Live in 6 weeks or less</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize stats counter (animated numbers)
     */
    initStatsCounter() {
        const stats = document.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => observer.observe(stat));
    }

    /**
     * Animate number count-up
     * @param {HTMLElement} element - Element to animate
     */
    animateNumber(element) {
        const target = parseInt(element.dataset.target || element.textContent);
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, duration / steps);
    }

    /**
     * Track event
     * @param {string} eventName - Event name
     * @param {Object} data - Event data
     */
    trackEvent(eventName, data = {}) {
        if (window.Analytics) {
            window.Analytics.trackEvent(`SocialProof_${eventName}`, {
                event_category: 'social_proof',
                ...data
            });
        }

        if (window.EventBus) {
            window.EventBus.emit(`social-proof:${eventName.toLowerCase()}`, data);
        }
    }

    /**
     * Stop all intervals (for cleanup)
     */
    destroy() {
        if (this.activityInterval) {
            clearInterval(this.activityInterval);
        }
        if (this.reviewInterval) {
            clearInterval(this.reviewInterval);
        }
    }
}

// Create singleton instance
const socialProofWidgets = new SocialProofWidgets();

// Make available globally
if (typeof window !== 'undefined') {
    window.SocialProofWidgets = socialProofWidgets;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = socialProofWidgets;
}

/* ========================================
   AUTO-INIT (DISABLED - popups too distracting)
   ======================================== */

// Initialize on page load (DISABLED)
// if (typeof window !== 'undefined') {
//     document.addEventListener('DOMContentLoaded', () => {
//         window.SocialProofWidgets?.init();
//     });
// }
