/* ===================================
   UTILITY FUNCTIONS
   =================================== */

// Rate limiting for security
const rateLimiter = {
    attempts: {},
    maxAttempts: 5,
    windowMs: 60000, // 1 minute

    check(action) {
        const now = Date.now();
        if (!this.attempts[action]) {
            this.attempts[action] = [];
        }

        // Remove old attempts outside the time window
        this.attempts[action] = this.attempts[action].filter(
            timestamp => now - timestamp < this.windowMs
        );

        if (this.attempts[action].length >= this.maxAttempts) {
            return false;
        }

        this.attempts[action].push(now);
        return true;
    }
};

// Local storage helpers with error handling
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    },

    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage error:', error);
            return null;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }
};

// User session management
const userSession = {
    isLoggedIn() {
        return storage.get('user') !== null;
    },

    getUser() {
        return storage.get('user');
    },

    setUser(userData) {
        storage.set('user', userData);
    },

    logout() {
        storage.remove('user');
        storage.remove('authToken');
        window.location.href = 'index.html';
    },

    getPoints() {
        const user = this.getUser();
        return user ? user.points || 0 : 0;
    },

    addPoints(points) {
        const user = this.getUser();
        if (user) {
            user.points = (user.points || 0) + points;
            this.setUser(user);
        }
    }
};

// Format currency
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Validate email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate phone
function isValidPhone(phone) {
    const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return re.test(phone);
}

// Sanitize input (basic XSS prevention)
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Analytics tracking (mock implementation)
const analytics = {
    track(event, data = {}) {
        console.log('Analytics:', event, data);
        // In production, this would send to a real analytics service
        const events = storage.get('analytics_events') || [];
        events.push({
            event,
            data,
            timestamp: new Date().toISOString()
        });
        storage.set('analytics_events', events.slice(-100)); // Keep last 100 events
    },

    pageView(page) {
        this.track('page_view', { page, url: window.location.href });
    },

    purchase(amount, items) {
        this.track('purchase', { amount, items, itemCount: items.length });
    },

    addToCart(item) {
        this.track('add_to_cart', { item });
    }
};

// Initialize analytics
analytics.pageView(document.title);

// Debounce function for performance
function debounce(func, wait) {
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

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
