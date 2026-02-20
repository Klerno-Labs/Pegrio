/* ===================================
   MENU PAGE JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function() {

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const menuCategories = document.querySelectorAll('.menu-category');
    const searchInput = document.getElementById('menuSearch');

    let currentFilter = 'all';

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Get category
            currentFilter = this.dataset.category;

            // Apply filter
            applyFilters();

            // Track analytics
            analytics.track('menu_filter', { category: currentFilter });
        });
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            applyFilters();
        }, 300));
    }

    function applyFilters() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        // Filter menu items
        menuItems.forEach(item => {
            const category = item.dataset.category;
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            const itemDesc = item.querySelector('p').textContent.toLowerCase();

            const matchesCategory = currentFilter === 'all' || category === currentFilter;
            const matchesSearch = searchTerm === '' ||
                                 itemName.includes(searchTerm) ||
                                 itemDesc.includes(searchTerm);

            if (matchesCategory && matchesSearch) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });

        // Show/hide categories
        menuCategories.forEach(category => {
            const categoryName = category.dataset.category;
            const visibleItems = category.querySelectorAll('.menu-item:not(.hidden)');

            if (currentFilter === 'all') {
                // Show category if it has visible items
                if (visibleItems.length > 0) {
                    category.classList.remove('hidden');
                } else {
                    category.classList.add('hidden');
                }
            } else {
                // Show category if it matches filter and has items
                if (categoryName === currentFilter && visibleItems.length > 0) {
                    category.classList.remove('hidden');
                } else {
                    category.classList.add('hidden');
                }
            }
        });

        // Show "no results" message if needed
        showNoResults();
    }

    function showNoResults() {
        const visibleItems = document.querySelectorAll('.menu-item:not(.hidden)');
        let noResultsMsg = document.getElementById('noResultsMessage');

        if (visibleItems.length === 0) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'noResultsMessage';
                noResultsMsg.className = 'no-results';
                noResultsMsg.innerHTML = `
                    <p>No items found matching your search.</p>
                    <button class="btn-secondary" onclick="clearSearch()">Clear Search</button>
                `;
                document.querySelector('.menu-section .container').appendChild(noResultsMsg);
            }
            noResultsMsg.style.display = 'block';
        } else {
            if (noResultsMsg) {
                noResultsMsg.style.display = 'none';
            }
        }
    }

    // Make clearSearch available globally
    window.clearSearch = function() {
        if (searchInput) {
            searchInput.value = '';
            applyFilters();
        }
    };

    // Add to cart buttons on menu page
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            if (itemId) {
                cart.addItem(itemId);
            }
        });
    });

    // Scroll to category from URL hash
    if (window.location.hash) {
        const category = window.location.hash.substring(1);
        const categoryBtn = document.querySelector(`.filter-btn[data-category="${category}"]`);
        if (categoryBtn) {
            categoryBtn.click();
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
});

// Add no results styling
const noResultsStyle = document.createElement('style');
noResultsStyle.textContent = `
    .no-results {
        text-align: center;
        padding: var(--spacing-xl);
        background: var(--bg-white);
        border-radius: var(--radius-lg);
        margin-top: var(--spacing-lg);
    }

    .no-results p {
        font-size: 1.25rem;
        color: var(--text-light);
        margin-bottom: var(--spacing-md);
    }
`;
document.head.appendChild(noResultsStyle);
