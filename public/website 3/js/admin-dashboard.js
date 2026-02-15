/* ===================================
   ADMIN DASHBOARD FUNCTIONALITY
   =================================== */

document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    setupEventListeners();
});

function loadDashboardData() {
    const orders = storage.get('orders') || [];
    const analyticsEvents = storage.get('analytics_events') || [];

    // Calculate stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Mock customer count (in production, this would come from database)
    const totalCustomers = Math.max(totalOrders, 156);

    // Update stat cards
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('avgOrderValue').textContent = formatCurrency(avgOrderValue);

    // Load recent orders
    loadRecentOrders(orders);
}

function loadRecentOrders(orders) {
    const tbody = document.querySelector('#recentOrdersTable tbody');

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    No orders yet
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = orders.slice(0, 10).map(order => {
        const status = getOrderStatus(order.timestamp);
        const timeAgo = getTimeAgo(order.timestamp);

        return `
            <tr>
                <td><strong>#${order.orderNumber}</strong></td>
                <td>${order.customer?.firstName || 'Guest'} ${order.customer?.lastName || ''}</td>
                <td>${order.items.length} items</td>
                <td><strong>${formatCurrency(order.total)}</strong></td>
                <td><span class="status-badge ${status.class}">${status.text}</span></td>
                <td>${timeAgo}</td>
            </tr>
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

function getTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return 'Just now';
}

function setupEventListeners() {
    // Date range selector
    const dateRange = document.getElementById('dateRange');
    if (dateRange) {
        dateRange.addEventListener('change', function() {
            console.log('Date range changed:', this.value);
            loadDashboardData();
            // In production, filter data based on selected range
        });
    }

    // Nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();

                // Update active state
                document.querySelectorAll('.nav-item').forEach(nav => {
                    nav.classList.remove('active');
                });
                this.classList.add('active');

                // Update dashboard title
                const section = this.querySelector('.nav-text').textContent;
                document.querySelector('.dashboard-header h1').textContent = section;

                // In production, load different sections
                console.log('Navigating to section:', section);
            }
        });
    });

    // Mobile sidebar toggle (for mobile view)
    createMobileToggle();
}

function createMobileToggle() {
    if (window.innerWidth <= 768) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-sidebar-toggle';
        toggleBtn.innerHTML = '☰ Menu';
        toggleBtn.style.cssText = `
            position: fixed;
            top: 1rem;
            left: 1rem;
            z-index: 1001;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: var(--radius-md);
            cursor: pointer;
            font-weight: 600;
        `;

        toggleBtn.addEventListener('click', function() {
            document.querySelector('.dashboard-sidebar').classList.toggle('open');
        });

        document.body.appendChild(toggleBtn);
    }
}

// Real-time updates (mock)
function simulateRealTimeUpdates() {
    setInterval(() => {
        // In production, this would poll your backend or use websockets
        const orders = storage.get('orders') || [];
        if (orders.length > 0) {
            loadRecentOrders(orders);
        }
    }, 30000); // Update every 30 seconds
}

// Start real-time updates
simulateRealTimeUpdates();

// Export data function
function exportData(type) {
    const data = storage.get(type === 'orders' ? 'orders' : 'analytics_events') || [];
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification(`${type} data exported successfully`, 'success');
}

// Make exportData available globally
window.exportData = exportData;
