// ========================================
// Main JavaScript - Global Functionality
// ========================================

// Cart Management
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    addItem(item) {
        const existingItem = this.cart.find(i => i.name === item.name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }
        this.saveCart();
        this.showToast(`${item.name} added to cart!`, 'success');
    }

    removeItem(itemName) {
        this.cart = this.cart.filter(item => item.name !== itemName);
        this.saveCart();
    }

    updateQuantity(itemName, quantity) {
        const item = this.cart.find(i => i.name === itemName);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
        }
    }

    getCart() {
        return this.cart;
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getTax() {
        return this.getTotal() * 0.085;
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    updateCartCount() {
        const counts = document.querySelectorAll('.cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        counts.forEach(count => {
            count.textContent = totalItems;
            count.style.display = totalItems > 0 ? 'flex' : 'none';
        });
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.className = `toast ${type} show`;
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
}

// Initialize cart manager globally
const cartManager = new CartManager();

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') &&
            !mobileToggle.contains(e.target) &&
            !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Add to cart buttons on home page
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const item = {
                name: button.dataset.item,
                price: parseFloat(button.dataset.price)
            };
            cartManager.addItem(item);
        });
    });

    // Load Instagram feed (simulated)
    loadInstagramFeed();

    // Load reviews
    loadReviews();
});

// Simulated Instagram Feed
function loadInstagramFeed() {
    const instagramFeed = document.getElementById('instagram-feed');
    if (!instagramFeed) return;

    const images = typeof instagramFeedImages !== 'undefined' ? instagramFeedImages : [
        'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1593010932917-92d3bc309053?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1619895092538-128341789043?w=500&h=500&fit=crop'
    ];

    instagramFeed.innerHTML = images.map((imageUrl, index) => `
        <div class="instagram-item">
            <div style="background: ${post.color}; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 80px;">
                ${post.emoji}
            </div>
            <div class="instagram-overlay">
                ❤️ 234 💬 12
            </div>
        </div>
    `).join('');
}

// Load Reviews
function loadReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    if (!reviewsContainer) return;

    const reviews = [
        {
            author: 'Sarah Johnson',
            rating: 5,
            date: '2 days ago',
            text: 'Absolutely amazing! The butter chicken is the best I\'ve ever had. Perfectly spiced and authentic flavors. Will definitely be back!'
        },
        {
            author: 'Raj Patel',
            rating: 5,
            date: '1 week ago',
            text: 'Great service and even better food. The biryani is exceptional - aromatic and full of flavor. Highly recommend for anyone craving authentic Indian cuisine.'
        },
        {
            author: 'Emily Chen',
            rating: 5,
            date: '2 weeks ago',
            text: 'Love this place! The atmosphere is warm and welcoming, and the food is consistently excellent. The palak paneer is my favorite!'
        }
    ];

    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div>
                    <div class="review-author">${review.author}</div>
                    <div class="review-date">${review.date}</div>
                </div>
                <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

// Utility Functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Security: Content Security Policy helpers
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Performance: Lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
