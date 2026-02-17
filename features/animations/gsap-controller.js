/* ========================================
   GSAP ANIMATION CONTROLLER
   Advanced animations for top 0.01% experience
   ======================================== */

/**
 * GSAP Animation Controller
 *
 * Features:
 * - Hero parallax effects
 * - Scroll-triggered reveals
 * - Enhanced magnetic buttons
 * - Page transitions
 * - Smooth scrolling
 * - Interactive hover effects
 */

class GSAPController {
    constructor() {
        this.gsap = null;
        this.ScrollTrigger = null;
        this.isLoaded = false;
        this.animations = [];
    }

    /**
     * Initialize GSAP
     * Load GSAP and ScrollTrigger plugin
     */
    async init() {
        if (this.isLoaded) {
            return;
        }

        try {
            // Load GSAP library
            await this.loadGSAP();

            // Load ScrollTrigger plugin
            await this.loadScrollTrigger();

            // Register ScrollTrigger
            this.gsap.registerPlugin(this.ScrollTrigger);

            // Initialize animations
            this.initHeroAnimations();
            this.initScrollRevealAnimations();
            this.initMagneticButtons();
            this.initParallaxEffects();
            this.initCounterAnimations();
            this.initCardHoverEffects();
            this.initPageTransitions();

            this.isLoaded = true;
            console.log('✅ GSAP animations initialized');

        } catch (error) {
            console.error('❌ Failed to initialize GSAP:', error);
            // Graceful degradation - site still works without animations
        }
    }

    /**
     * Load GSAP library from CDN
     */
    loadGSAP() {
        return new Promise((resolve, reject) => {
            if (window.gsap) {
                this.gsap = window.gsap;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
            script.async = true;
            script.onload = () => {
                this.gsap = window.gsap;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Load ScrollTrigger plugin
     */
    loadScrollTrigger() {
        return new Promise((resolve, reject) => {
            if (window.ScrollTrigger) {
                this.ScrollTrigger = window.ScrollTrigger;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
            script.async = true;
            script.onload = () => {
                this.ScrollTrigger = window.ScrollTrigger;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Hero Section Animations
     * Staggered entrance for headline, subheadline, and CTA
     */
    initHeroAnimations() {
        const timeline = this.gsap.timeline({
            delay: 0.2
        });

        // Animate hero headline
        timeline.from('.hero h1', {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        // Animate hero subheadline
        timeline.from('.hero .subtitle', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5');

        // Animate CTA buttons
        timeline.from('.hero .cta-buttons .btn', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.4');

        // Animate hero badges/stats
        timeline.from('.hero .hero-stats', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        }, '-=0.3');

        this.animations.push(timeline);
    }

    /**
     * Scroll-Triggered Reveal Animations
     * Elements fade in and slide up as they enter viewport
     */
    initScrollRevealAnimations() {
        // Reveal sections
        const sections = document.querySelectorAll('section:not(.hero)');
        sections.forEach((section, index) => {
            this.gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 50%',
                    toggleActions: 'play none none none',
                    // markers: true // Debug mode
                },
                y: 80,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // Reveal package cards with stagger
        const packageCards = document.querySelectorAll('.package-card');
        if (packageCards.length > 0) {
            this.gsap.from(packageCards, {
                scrollTrigger: {
                    trigger: '.packages',
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            });
        }

        // Reveal process steps
        const processSteps = document.querySelectorAll('.process-step');
        if (processSteps.length > 0) {
            this.gsap.from(processSteps, {
                scrollTrigger: {
                    trigger: '.process',
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                },
                x: -50,
                opacity: 0,
                duration: 0.7,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }

        // Reveal FAQ items
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length > 0) {
            this.gsap.from(faqItems, {
                scrollTrigger: {
                    trigger: '.faq',
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                },
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }
    }

    /**
     * Enhanced Magnetic Button Effect
     * Buttons follow cursor with smooth animation
     */
    initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

        magneticButtons.forEach(button => {
            const strength = 20; // Magnetic pull strength

            button.addEventListener('mouseenter', () => {
                this.gsap.to(button, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            button.addEventListener('mouseleave', () => {
                this.gsap.to(button, {
                    scale: 1,
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            });

            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const deltaX = (e.clientX - centerX) / rect.width * strength;
                const deltaY = (e.clientY - centerY) / rect.height * strength;

                this.gsap.to(button, {
                    x: deltaX,
                    y: deltaY,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    /**
     * Parallax Effects
     * Background elements move at different speeds
     */
    initParallaxEffects() {
        // Hero background parallax
        const heroBackground = document.querySelector('.hero');
        if (heroBackground) {
            this.gsap.to(heroBackground, {
                scrollTrigger: {
                    trigger: heroBackground,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                },
                backgroundPosition: '50% 30%',
                ease: 'none'
            });
        }

        // Parallax for decorative elements
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallaxSpeed || 0.5;

            this.gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: (i, target) => -1 * target.offsetHeight * speed,
                ease: 'none'
            });
        });
    }

    /**
     * Number Counter Animations
     * Animate stats counting up
     */
    initCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.counter);
            const duration = parseFloat(counter.dataset.duration) || 2;
            const suffix = counter.dataset.suffix || '';

            this.gsap.from(counter, {
                scrollTrigger: {
                    trigger: counter,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                textContent: 0,
                duration: duration,
                ease: 'power1.out',
                snap: { textContent: 1 },
                onUpdate: function() {
                    counter.textContent = Math.ceil(counter.textContent) + suffix;
                }
            });
        });
    }

    /**
     * Card Hover Effects
     * 3D tilt effect on package cards
     */
    initCardHoverEffects() {
        const cards = document.querySelectorAll('.package-card, .process-step');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.gsap.to(card, {
                    y: -10,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                this.gsap.to(card, {
                    y: 0,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const rotateX = (e.clientY - centerY) / 20;
                const rotateY = (centerX - e.clientX) / 20;

                this.gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 0.3,
                    ease: 'power2.out',
                    transformPerspective: 1000
                });
            });

            card.addEventListener('mouseleave', () => {
                this.gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
    }

    /**
     * Page Transition Animations
     * Smooth transitions between sections when clicking nav links
     */
    initPageTransitions() {
        const navLinks = document.querySelectorAll('a[href^="#"]');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

                e.preventDefault();

                const target = document.querySelector(targetId);
                if (!target) return;

                // Smooth scroll with GSAP
                this.gsap.to(window, {
                    duration: 1.2,
                    scrollTo: {
                        y: target,
                        offsetY: 80 // Account for fixed header
                    },
                    ease: 'power3.inOut'
                });

                // Pulse animation on target section
                this.gsap.from(target, {
                    scale: 0.98,
                    duration: 0.4,
                    ease: 'power2.out',
                    delay: 0.6
                });
            });
        });
    }

    /**
     * Custom Timeline Animation
     * Create a custom GSAP timeline
     * @param {Object} config - Timeline configuration
     * @returns {Object} GSAP timeline
     */
    createTimeline(config = {}) {
        const timeline = this.gsap.timeline(config);
        this.animations.push(timeline);
        return timeline;
    }

    /**
     * Animate Element
     * Helper to animate any element
     * @param {string|HTMLElement} element - Element or selector
     * @param {Object} animation - Animation properties
     * @param {Object} trigger - ScrollTrigger configuration
     */
    animate(element, animation, trigger = null) {
        const config = { ...animation };

        if (trigger) {
            config.scrollTrigger = {
                trigger: trigger.element || element,
                start: trigger.start || 'top 80%',
                end: trigger.end || 'top 50%',
                toggleActions: trigger.toggleActions || 'play none none none',
                scrub: trigger.scrub || false
            };
        }

        return this.gsap.from(element, config);
    }

    /**
     * Kill All Animations
     * Stop and clear all running animations
     */
    killAll() {
        this.animations.forEach(anim => anim.kill());
        this.animations = [];
    }

    /**
     * Refresh ScrollTrigger
     * Call this after DOM changes
     */
    refresh() {
        if (this.ScrollTrigger) {
            this.ScrollTrigger.refresh();
        }
    }
}

// Create singleton instance
const gsapController = new GSAPController();

// Make available globally
if (typeof window !== 'undefined') {
    window.GSAPController = gsapController;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = gsapController;
}

/* ========================================
   USAGE EXAMPLES
   ======================================== */

/**
 * Example 1: Basic initialization
 *
 * GSAPController.init();
 */

/**
 * Example 2: Animate custom element
 *
 * GSAPController.animate('.custom-element', {
 *     y: 50,
 *     opacity: 0,
 *     duration: 1
 * }, {
 *     element: '.custom-section',
 *     start: 'top 70%'
 * });
 */

/**
 * Example 3: Create custom timeline
 *
 * const tl = GSAPController.createTimeline({ delay: 0.5 });
 * tl.from('.element1', { y: 50, opacity: 0, duration: 0.8 })
 *   .from('.element2', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
 *   .from('.element3', { scale: 0, duration: 0.5 }, '-=0.3');
 */

/**
 * Example 4: Add data attributes for counters
 *
 * <div data-counter="500" data-duration="2.5" data-suffix="+">0+</div>
 */

/**
 * Example 5: Add data attributes for parallax
 *
 * <div data-parallax data-parallax-speed="0.3">Background Element</div>
 */
