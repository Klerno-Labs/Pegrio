/* ===================================
   ACCOUNT PAGE FUNCTIONALITY
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    const loginPrompt = document.getElementById('loginPrompt');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const accountDashboard = document.getElementById('accountDashboard');

    // Check if user is logged in
    if (userSession.isLoggedIn()) {
        showDashboard();
    } else {
        loginPrompt.style.display = 'block';
    }

    // Show login form
    document.getElementById('showLoginForm').addEventListener('click', function() {
        loginPrompt.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Show register form
    document.getElementById('showRegisterForm').addEventListener('click', function() {
        loginPrompt.style.display = 'none';
        registerForm.style.display = 'block';
    });

    // Switch to register
    document.getElementById('switchToRegister').addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    // Switch to login
    document.getElementById('switchToLogin').addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Login form submission
    document.getElementById('loginFormElement').addEventListener('submit', function(e) {
        e.preventDefault();

        if (!rateLimiter.check('login')) {
            showNotification('Too many login attempts. Please try again later.', 'error');
            return;
        }

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Mock login (in production, this would call your backend API)
        setTimeout(() => {
            // Mock user data
            const userData = {
                id: generateId(),
                email: email,
                firstName: 'John',
                lastName: 'Doe',
                phone: '(555) 123-4567',
                points: 1250,
                memberSince: new Date().toISOString()
            };

            userSession.setUser(userData);
            showNotification('Welcome back!', 'success');
            analytics.track('login', { email });

            showDashboard();
        }, 500);
    });

    // Register form submission
    document.getElementById('registerFormElement').addEventListener('submit', function(e) {
        e.preventDefault();

        if (!rateLimiter.check('register')) {
            showNotification('Too many registration attempts. Please try again later.', 'error');
            return;
        }

        const firstName = document.getElementById('regFirstName').value;
        const lastName = document.getElementById('regLastName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const password = document.getElementById('regPassword').value;

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (!isValidPhone(phone)) {
            showNotification('Please enter a valid phone number', 'error');
            return;
        }

        // Mock registration
        setTimeout(() => {
            const userData = {
                id: generateId(),
                email: email,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                points: 0,
                memberSince: new Date().toISOString()
            };

            userSession.setUser(userData);
            showNotification('Account created successfully! Welcome aboard!', 'success');
            analytics.track('register', { email });

            // Give welcome bonus
            userSession.addPoints(100);
            showNotification('You earned 100 welcome bonus points!', 'success');

            showDashboard();
        }, 500);
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            userSession.logout();
        }
    });

    // Edit profile button
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        showNotification('Profile editing feature coming soon!', 'info');
    });

    function showDashboard() {
        loginPrompt.style.display = 'none';
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        accountDashboard.style.display = 'block';

        const user = userSession.getUser();

        // Update profile info
        document.getElementById('profileName').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profilePhone').textContent = user.phone;
        document.getElementById('memberSince').textContent = formatDate(user.memberSince);

        // Update points
        document.getElementById('userPoints').textContent = user.points.toLocaleString();

        // Update stats
        updateOrderStats();

        // Load order history
        loadOrderHistory();
    }

    function updateOrderStats() {
        const orders = storage.get('orders') || [];
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalSpent').textContent = formatCurrency(totalSpent);
    }

    function loadOrderHistory() {
        const orders = storage.get('orders') || [];
        const ordersList = document.getElementById('ordersList');

        if (orders.length === 0) {
            ordersList.innerHTML = '<p class="no-orders">No orders yet. <a href="menu.html">Start ordering!</a></p>';
            return;
        }

        ordersList.innerHTML = orders.map(order => {
            const status = getOrderStatus(order.timestamp);
            return `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-number">Order #${order.orderNumber}</div>
                        <div class="order-status ${status.class}">${status.text}</div>
                    </div>

                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">${item.quantity}x ${item.name}</div>
                        `).join('')}
                    </div>

                    <div class="order-footer">
                        <div class="order-date">${formatDate(order.timestamp)}</div>
                        <div class="order-total">${formatCurrency(order.total)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function getOrderStatus(timestamp) {
        const orderDate = new Date(timestamp);
        const now = new Date();
        const hoursSince = (now - orderDate) / (1000 * 60 * 60);

        if (hoursSince > 2) {
            return { class: 'delivered', text: 'Delivered' };
        } else if (hoursSince > 0.5) {
            return { class: 'in-transit', text: 'In Transit' };
        } else {
            return { class: 'preparing', text: 'Preparing' };
        }
    }
});
