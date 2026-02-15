/* ===================================
   MAIN JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function() {

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('nav');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // Header scroll effect
    const header = document.getElementById('header');
    const menuFilters = document.querySelector('.menu-filters');
    let lastScroll = 0;

    window.addEventListener('scroll', debounce(function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Auto-hide menu filters on scroll down, show on scroll up
        if (menuFilters) {
            if (currentScroll > lastScroll && currentScroll > 200) {
                // Scrolling down - hide filters
                menuFilters.classList.add('filter-hidden');
            } else if (currentScroll < lastScroll) {
                // Scrolling up - show filters
                menuFilters.classList.remove('filter-hidden');
            }
        }

        lastScroll = currentScroll;
    }, 10));

    // Cart sidebar
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');

    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            cartSidebar.classList.add('open');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }

    function closeCartSidebar() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Add to cart buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            if (itemId) {
                cart.addItem(itemId);
            }
        });
    });

    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        if (userSession.isLoggedIn()) {
            const user = userSession.getUser();
            loginBtn.textContent = user.name || 'Account';
            loginBtn.addEventListener('click', function() {
                window.location.href = 'account.html';
            });
        } else {
            loginBtn.addEventListener('click', function() {
                window.location.href = 'login.html';
            });
        }
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!rateLimiter.check('newsletter')) {
                showNotification('Too many attempts. Please try again later.', 'error');
                return;
            }

            const email = this.querySelector('input[type="email"]').value;

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Mock newsletter signup
            setTimeout(() => {
                showNotification('Thank you for subscribing!', 'success');
                this.reset();

                // Track newsletter signup
                analytics.track('newsletter_signup', { email });
            }, 500);
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Lazy loading images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Performance monitoring
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log('Page load time:', pageLoadTime + 'ms');
                analytics.track('performance', { pageLoadTime });
            }, 0);
        });
    }

    // Update user points display if logged in
    updateUserPointsDisplay();

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key closes cart
        if (e.key === 'Escape') {
            if (cartSidebar.classList.contains('open')) {
                closeCartSidebar();
            }
        }
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .menu-item-card, .about-content').forEach(el => {
        observer.observe(el);
    });
});

// Update user points display
function updateUserPointsDisplay() {
    const pointsDisplay = document.getElementById('userPoints');
    if (pointsDisplay && userSession.isLoggedIn()) {
        const points = userSession.getPoints();
        pointsDisplay.textContent = points.toLocaleString();
    }
}

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}
