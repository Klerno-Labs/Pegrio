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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // new CustomCursor(); // Disabled - too distracting
    // new ScrollProgress(); // Disabled for performance
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
// MODAL FUNCTIONALITY
// ========================================

const modal = document.getElementById('payment-modal');
const packageButtons = document.querySelectorAll('[data-package]');
const closeModal = document.querySelector('.modal-close');

packageButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const packageName = button.dataset.package;
        const packagePrice = button.dataset.price;
        openPaymentModal(packageName, packagePrice);
    });
});

if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function openPaymentModal(packageName, price) {
    const modal = document.getElementById('payment-modal');
    const packageNameEl = document.getElementById('selected-package-name');
    const packagePriceEl = document.getElementById('selected-package-price');

    if (packageNameEl) {
        packageNameEl.textContent = packageName.charAt(0).toUpperCase() + packageName.slice(1) + ' Package';
    }
    if (packagePriceEl) {
        packagePriceEl.textContent = '$' + parseInt(price).toLocaleString();
    }

    updatePaymentPrices(parseInt(price));
    modal.style.display = 'flex';
}

// ========================================
// PAYMENT TYPE SELECTOR
// ========================================

const paymentTypeButtons = document.querySelectorAll('.payment-type-btn');
paymentTypeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        paymentTypeButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

function updatePaymentPrices(basePrice) {
    const fullPrice = Math.round(basePrice * 0.95);
    const splitPrice = Math.round(basePrice / 2);
    const monthlyPrice = Math.round(basePrice / 10);

    const fullPriceEl = document.getElementById('full-price');
    const splitPriceEl = document.getElementById('split-price');
    const monthlyPriceEl = document.getElementById('monthly-price');

    if (fullPriceEl) fullPriceEl.textContent = '$' + fullPrice.toLocaleString();
    if (splitPriceEl) splitPriceEl.textContent = '$' + splitPrice.toLocaleString();
    if (monthlyPriceEl) monthlyPriceEl.textContent = '$' + monthlyPrice.toLocaleString() + '/mo';
}

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
// CONSOLE MESSAGE
// ========================================

console.log('%c✨ Top 0.01% UI/UX Showcase', 'font-size: 20px; font-weight: bold; color: #0071e3;');
console.log('%cBuilt with AI-powered design and premium interactions', 'font-size: 12px; color: #6e6e73;');
