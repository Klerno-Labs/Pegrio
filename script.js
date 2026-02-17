/* ========================================
   TOP 0.01% UI/UX - Interactive Features
   Minimalist & Sophisticated Interactions
   ======================================== */

// ========================================
// CUSTOM CURSOR - Premium Desktop Experience
// ========================================

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.cursorX = 0;
        this.cursorY = 0;
        this.dotX = 0;
        this.dotY = 0;
        this.init();
    }

    init() {
        // Only initialize on desktop
        if (window.innerWidth <= 768) return;

        // Create cursor elements
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);

        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'custom-cursor-dot';
        document.body.appendChild(this.cursorDot);

        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;
        });

        // Add hover effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .pricing-card, .demo-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });

        // Animate cursor
        this.animate();
    }

    animate() {
        // Smooth cursor movement with easing
        this.dotX += (this.cursorX - this.dotX) * 1;
        this.dotY += (this.cursorY - this.dotY) * 1;

        const cursorEase = 0.15;
        const cursorCurrentX = parseFloat(this.cursor.style.left) || 0;
        const cursorCurrentY = parseFloat(this.cursor.style.top) || 0;

        const newX = cursorCurrentX + (this.cursorX - cursorCurrentX) * cursorEase;
        const newY = cursorCurrentY + (this.cursorY - cursorCurrentY) * cursorEase;

        this.cursor.style.left = newX + 'px';
        this.cursor.style.top = newY + 'px';
        this.cursorDot.style.left = this.dotX + 'px';
        this.cursorDot.style.top = this.dotY + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// SCROLL PROGRESS INDICATOR
// ========================================

class ScrollProgress {
    constructor() {
        this.progressBar = null;
        this.init();
    }

    init() {
        // Create progress bar
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress';
        document.body.appendChild(this.progressBar);

        // Update on scroll
        window.addEventListener('scroll', () => this.update());
    }

    update() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        this.progressBar.style.width = scrolled + '%';
    }
}

// ========================================
// TOAST NOTIFICATION SYSTEM
// ========================================

const ToastNotification = {
    container: null,

    init() {
        this.container = document.querySelector('.toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            this.container.setAttribute('role', 'region');
            this.container.setAttribute('aria-live', 'polite');
            this.container.setAttribute('aria-label', 'Notifications');
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 5000) {
        if (!this.container) this.init();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('role', 'alert');

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };

        toast.innerHTML = `
            <span class="toast-icon" aria-hidden="true">${icons[type] || icons.info}</span>
            <div class="toast-content">
                <div class="toast-title">${titles[type] || titles.info}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">&times;</button>
        `;

        this.container.appendChild(toast);

        // Show with animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.remove(toast));

        // Auto-remove
        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }

        return toast;
    },

    remove(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 500);
    },

    success(message, duration) {
        return this.show(message, 'success', duration);
    },

    error(message, duration) {
        return this.show(message, 'error', duration);
    },

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    },

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
};

// ========================================
// SERVICE WORKER REGISTRATION (PWA)
// ========================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                if (window.location.hostname === 'localhost') {
                    console.log('PWA: Service Worker registered');
                }
            })
            .catch(error => {
                console.error('PWA: Service Worker registration failed:', error);
            });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    ToastNotification.init();
    new CustomCursor();
    new ScrollProgress();
});

// ========================================
// ENHANCED SCROLL REVEAL ANIMATION
// ========================================

class ScrollReveal {
    constructor() {
        this.observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Get all reveal elements in the same section
                    const section = entry.target.closest('section') || entry.target.closest('.container');
                    const revealElements = section ?
                        Array.from(section.querySelectorAll('.reveal')) :
                        [entry.target];

                    // Find index within section for proper staggering
                    const index = revealElements.indexOf(entry.target);

                    // Stagger with 150ms delay between each element
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, index * 150);
                }
            });
        }, this.observerOptions);

        // Observe all reveal elements
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));
    }
}

// Initialize scroll reveal
document.addEventListener('DOMContentLoaded', () => {
    new ScrollReveal();
});

// ========================================
// SMOOTH SCROLL FOR NAVIGATION
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// MODAL FUNCTIONALITY - Enhanced Accessibility
// ========================================

const ModalManager = {
    modal: null,
    lastFocusedElement: null,
    focusableElements: null,

    init() {
        this.modal = document.getElementById('payment-modal');
        if (!this.modal) return;

        const closeButton = this.modal.querySelector('.modal-close');
        const packageButtons = document.querySelectorAll('[data-package]');

        // Package button handlers
        packageButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const packageName = button.dataset.package;
                const packagePrice = button.dataset.price;
                this.open(packageName, packagePrice);
            });
        });

        // Close button handler
        if (closeButton) {
            closeButton.addEventListener('click', () => this.close());
        }

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.close();
            }
        });

        // Focus trap
        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleFocusTrap(e);
            }
        });
    },

    open(packageName, price) {
        this.lastFocusedElement = document.activeElement;

        const packageNameEl = document.getElementById('selected-package-name');
        const packagePriceEl = document.getElementById('selected-package-price');

        if (packageNameEl) {
            packageNameEl.textContent = packageName.charAt(0).toUpperCase() + packageName.slice(1) + ' Package';
        }
        if (packagePriceEl) {
            packagePriceEl.textContent = '$' + parseInt(price).toLocaleString();
        }

        this.updatePaymentPrices(parseInt(price));
        this.modal.style.display = 'flex';
        this.modal.setAttribute('aria-hidden', 'false');

        // Get focusable elements
        this.focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        // Focus first element
        if (this.focusableElements.length > 0) {
            setTimeout(() => this.focusableElements[0].focus(), 100);
        }
    },

    close() {
        this.modal.style.display = 'none';
        this.modal.setAttribute('aria-hidden', 'true');

        // Return focus to trigger element
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
    },

    handleFocusTrap(e) {
        if (!this.focusableElements || this.focusableElements.length === 0) return;

        const firstElement = this.focusableElements[0];
        const lastElement = this.focusableElements[this.focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    },

    updatePaymentPrices(basePrice) {
        const fullPrice = Math.round(basePrice * 0.95);
        const splitPrice = Math.round(basePrice / 2);
        const monthlyPrice = Math.round(basePrice / 3);

        const fullPriceEl = document.getElementById('full-price');
        const splitPriceEl = document.getElementById('split-price');
        const monthlyPriceEl = document.getElementById('monthly-price');

        if (fullPriceEl) fullPriceEl.textContent = '$' + fullPrice.toLocaleString();
        if (splitPriceEl) splitPriceEl.textContent = '$' + splitPrice.toLocaleString();
        if (monthlyPriceEl) monthlyPriceEl.textContent = '$' + monthlyPrice.toLocaleString() + '/mo';
    }
};

// Initialize modal manager
document.addEventListener('DOMContentLoaded', () => {
    ModalManager.init();
});

// ========================================
// PAYMENT TYPE SELECTOR
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const paymentTypeButtons = document.querySelectorAll('.payment-type-btn');
    paymentTypeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            paymentTypeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================

const FormHandler = {
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    },

    validatePhone(phone) {
        // Allow empty or valid phone numbers
        if (!phone) return true;
        const re = /^[\d\s\-\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    showFieldError(field, message) {
        field.setCustomValidity(message);
        field.reportValidity();
        field.classList.add('error');

        field.addEventListener('input', function clearError() {
            field.setCustomValidity('');
            field.classList.remove('error');
            field.removeEventListener('input', clearError);
        }, { once: true });
    },

    async submitQuote(formData) {
        // Production: Replace with your actual API endpoint
        // const response = await fetch('/api/quote', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
        // return await response.json();

        // Demo: Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const quoteForm = document.getElementById('quote-form');
    if (!quoteForm) return;

    quoteForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = document.getElementById('checkout-button');
        const originalText = submitButton.textContent;

        // Get form fields
        const nameField = document.getElementById('quote-name');
        const businessField = document.getElementById('quote-business');
        const emailField = document.getElementById('quote-email');
        const phoneField = document.getElementById('quote-phone');

        // Validate email
        if (!FormHandler.validateEmail(emailField.value)) {
            FormHandler.showFieldError(emailField, 'Please enter a valid email address');
            return;
        }

        // Validate phone if provided
        if (phoneField.value && !FormHandler.validatePhone(phoneField.value)) {
            FormHandler.showFieldError(phoneField, 'Please enter a valid phone number (10+ digits)');
            return;
        }

        // Get form data
        const selectedPaymentType = document.querySelector('.payment-type-btn.active');
        const formData = {
            package: document.getElementById('selected-package-name')?.textContent || '',
            price: document.getElementById('selected-package-price')?.textContent || '',
            paymentType: selectedPaymentType?.dataset.type || 'full',
            name: nameField.value.trim(),
            business: businessField.value.trim(),
            email: emailField.value.trim(),
            phone: phoneField.value.trim(),
            message: document.getElementById('quote-message')?.value.trim() || '',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct'
        };

        // Update button to show loading
        submitButton.disabled = true;
        submitButton.textContent = '✨ Sending...';
        submitButton.style.opacity = '0.7';

        try {
            const result = await FormHandler.submitQuote(formData);

            // Show success state
            submitButton.textContent = '✓ Request Sent!';
            submitButton.style.background = '#10b981';
            submitButton.style.opacity = '1';

            // Close modal and show toast notification
            setTimeout(() => {
                if (ModalManager && ModalManager.close) {
                    ModalManager.close();
                }
                submitButton.textContent = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
                quoteForm.reset();

                // Show professional toast notification
                ToastNotification.success(
                    `Thank you, ${formData.name}! We'll send you a detailed proposal within 24 hours. Check your email (${formData.email}) soon!`,
                    7000
                );

                // Track conversion
                if (window.Analytics) {
                    Analytics.trackFormSubmission(formData);
                }
            }, 2000);

        } catch (error) {
            // Show error state
            submitButton.textContent = '✕ Error - Please Try Again';
            submitButton.style.background = '#ef4444';
            submitButton.style.opacity = '1';

            ToastNotification.error(
                'Something went wrong. Please try again or contact us directly at hello@pegrio.com',
                6000
            );

            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
            }, 3000);
        }
    });
});

// ========================================
// ENHANCED MAGNETIC BUTTON EFFECT
// ========================================

class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.btn, .btn-primary, .btn-outline, .btn-secondary');
        this.strength = 0.3; // Magnetic pull strength
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transition = 'transform 0.1s ease-out';
            });

            button.addEventListener('mousemove', (e) => {
                if (window.innerWidth <= 768) return; // Skip on mobile

                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Calculate distance from center
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = Math.max(rect.width, rect.height);

                // Reduce strength as cursor moves away from center
                const dynamicStrength = this.strength * (1 - distance / maxDistance);

                button.style.transform = `translate(${x * dynamicStrength}px, ${y * dynamicStrength}px) translateY(-2px) scale(1.02)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
                button.style.transform = '';
            });
        });
    }
}

// Initialize magnetic buttons
document.addEventListener('DOMContentLoaded', () => {
    new MagneticButtons();
});

// ========================================
// STATS COUNTER ANIMATION
// ========================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Trigger counter animations when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('[data-count]');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ========================================
// PARALLAX EFFECT
// ========================================

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax();
            ticking = false;
        });
        ticking = true;
    }
});

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// ========================================
// PRICING CARD HOVER EFFECT
// ========================================
// Removed JavaScript hover - CSS :hover handles all cards uniformly
// This ensures the featured card reacts the same as other cards

// ========================================
// PAGE LOAD ANIMATION
// ========================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .cta-buttons');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
});

// ========================================
// ========================================
// FAQ ACCORDION - Enhanced Accessibility
// ========================================

function initFAQAccordion() {
    const faqButtons = document.querySelectorAll('.faq-question');

    faqButtons.forEach(button => {
        button.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const icon = this.querySelector('.faq-icon');
            const wasActive = faqItem.classList.contains('active');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                const itemButton = item.querySelector('.faq-question');
                const itemAnswer = item.querySelector('.faq-answer');
                const itemIcon = item.querySelector('.faq-icon');

                item.classList.remove('active');
                itemAnswer.style.maxHeight = null;
                itemIcon.textContent = '+';
                itemButton.setAttribute('aria-expanded', 'false');
            });

            // Open clicked item if it wasn't active
            if (!wasActive) {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.textContent = '−';
                this.setAttribute('aria-expanded', 'true');
            }
        });

        // Keyboard navigation support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Initialize FAQ accordion when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQAccordion);
} else {
    initFAQAccordion();
}
