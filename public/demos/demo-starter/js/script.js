/* ===================================
   La Casa de Sabor - JavaScript
   ================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    /* ===================================
       MOBILE NAVIGATION TOGGLE
       ================================== */

    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = mobileToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }

    /* ===================================
       SMOOTH SCROLLING FOR ANCHOR LINKS
       ================================== */

    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(href);

            if (targetElement) {
                e.preventDefault();
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ===================================
       NAVBAR SCROLL EFFECT
       ================================== */

    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 10) {
            navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    /* ===================================
       CONTACT FORM VALIDATION & SUBMISSION
       ================================== */

    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value.trim();

            // Validation
            let errors = [];

            if (name === '') {
                errors.push('Name is required');
            }

            if (email === '') {
                errors.push('Email is required');
            } else if (!isValidEmail(email)) {
                errors.push('Please enter a valid email address');
            }

            if (subject === '') {
                errors.push('Please select a subject');
            }

            if (message === '') {
                errors.push('Message is required');
            } else if (message.length < 10) {
                errors.push('Message must be at least 10 characters long');
            }

            // Display errors or success
            if (errors.length > 0) {
                showFormMessage('error', errors.join('<br>'));
            } else {
                // Simulate form submission
                submitForm(name, email, phone, subject, message);
            }
        });
    }

    /* ===================================
       HELPER FUNCTIONS
       ================================== */

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show form message
    function showFormMessage(type, message) {
        formMessage.className = 'form-message ' + type;
        formMessage.innerHTML = message;
        formMessage.style.display = 'block';

        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide message after 5 seconds
        setTimeout(function() {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Simulate form submission
    function submitForm(name, email, phone, subject, message) {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate API call with timeout
        setTimeout(function() {
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;

            // Show success message
            showFormMessage('success',
                'Thank you for your message, ' + name + '! We\'ll get back to you soon at ' + email + '.');

            // Reset form
            contactForm.reset();

            // In a real application, you would send the data to your server here
            // Example:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    subject: subject,
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                showFormMessage('success', 'Message sent successfully!');
                contactForm.reset();
            })
            .catch(error => {
                showFormMessage('error', 'An error occurred. Please try again.');
            });
            */
        }, 1500);
    }

    /* ===================================
       ANIMATE ON SCROLL (Optional Enhancement)
       ================================== */

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements (optional - can be enabled for more animations)
    const animateElements = document.querySelectorAll('.feature-card, .menu-card, .value-card');
    animateElements.forEach(element => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

        // Observe the element
        observer.observe(element);
    });

    /* ===================================
       CURRENT YEAR IN FOOTER
       ================================== */

    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.footer-bottom p');
    yearElements.forEach(element => {
        element.textContent = element.textContent.replace('2024', currentYear);
    });

    /* ===================================
       LOADING STATE
       ================================== */

    // Remove loading class when page is fully loaded
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    /* ===================================
       ACCESSIBILITY ENHANCEMENTS
       ================================== */

    // Add keyboard navigation for mobile menu
    if (mobileToggle) {
        mobileToggle.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Trap focus in mobile menu when open
    if (navMenu) {
        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.focus();
            }
        });
    }

    /* ===================================
       PERFORMANCE OPTIMIZATION
       ================================== */

    // Debounce function for scroll events
    function debounce(func, wait = 10) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll event
    const debouncedScroll = debounce(function() {
        // Any scroll-based functionality can go here
    });

    window.addEventListener('scroll', debouncedScroll);

});

/* ===================================
   ADDITIONAL UTILITY FUNCTIONS
   ================================== */

// Phone number formatting (optional)
function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
}

// Add to phone input if desired
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('blur', function() {
        this.value = formatPhoneNumber(this.value);
    });
}
