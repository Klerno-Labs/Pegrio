// ========================================
// Contact Page Functionality
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');

    if (form) {
        form.addEventListener('submit', handleContactSubmit);
    }
});

function handleContactSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };

    // Validate
    if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactData.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }

    // In a real application, this would send to a server
    console.log('Contact form submitted:', contactData);

    // Simulate API call
    setTimeout(() => {
        // Show success message
        showFormMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');

        // Reset form
        e.target.reset();

        // Log to localStorage for demo purposes
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push(contactData);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    }, 500);
}

function showFormMessage(message, type) {
    const formSuccess = document.getElementById('form-success');
    const contactForm = document.getElementById('contact-form');

    if (type === 'success') {
        if (formSuccess) {
            formSuccess.querySelector('p').textContent = `✓ ${message}`;
            formSuccess.style.display = 'block';
            contactForm.style.display = 'none';

            // Show form again after 5 seconds
            setTimeout(() => {
                formSuccess.style.display = 'none';
                contactForm.style.display = 'block';
            }, 5000);
        }
    } else {
        // Show error toast
        if (window.cartManager) {
            cartManager.showToast(message, 'error');
        } else {
            alert(message);
        }
    }
}
