// ========================================
// Menu Page Functionality
// ========================================

let currentCategory = 'all';
let currentFilters = new Set();
let currentSort = 'default';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    // Load initial menu
    renderMenuItems();

    // Category filters
    const categoryButtons = document.querySelectorAll('#category-filters .filter-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.dataset.category;
            renderMenuItems();
        });
    });

    // Dietary filters
    const dietaryCheckboxes = document.querySelectorAll('.checkbox-filters input[type="checkbox"]');
    dietaryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                currentFilters.add(checkbox.dataset.filter);
            } else {
                currentFilters.delete(checkbox.dataset.filter);
            }
            renderMenuItems();
        });
    });

    // Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderMenuItems();
        });
    }

    // Search
    const searchInput = document.getElementById('menu-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderMenuItems();
        });
    }
});

function renderMenuItems() {
    const container = document.getElementById('menu-items');
    const noResults = document.getElementById('no-results');

    if (!container) return;

    // Filter items
    let filteredItems = menuItems.filter(item => {
        // Category filter
        if (currentCategory !== 'all' && item.category !== currentCategory) {
            return false;
        }

        // Dietary filters
        if (currentFilters.size > 0) {
            const hasAllFilters = Array.from(currentFilters).every(filter =>
                item.tags.includes(filter)
            );
            if (!hasAllFilters) return false;
        }

        // Search filter
        if (searchQuery && !item.name.toLowerCase().includes(searchQuery) &&
            !item.description.toLowerCase().includes(searchQuery)) {
            return false;
        }

        return true;
    });

    // Sort items
    filteredItems = sortItems(filteredItems, currentSort);

    // Render
    if (filteredItems.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
    } else {
        container.style.display = 'grid';
        noResults.style.display = 'none';
        container.innerHTML = filteredItems.map(item => createMenuItemCard(item)).join('');

        // Add event listeners to add-to-cart buttons
        container.querySelectorAll('.btn-add-cart').forEach(button => {
            button.addEventListener('click', () => {
                const item = {
                    name: button.dataset.name,
                    price: parseFloat(button.dataset.price)
                };
                cartManager.addItem(item);
            });
        });
    }
}

function sortItems(items, sortType) {
    const sorted = [...items];

    switch (sortType) {
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'popular':
            return sorted.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        default:
            return sorted;
    }
}

function createMenuItemCard(item) {
    const badges = [];
    if (item.popular) badges.push('<span class="dish-badge">Popular</span>');
    if (item.tags.includes('vegetarian')) badges.push('<span class="dish-badge" style="background: #4CAF50; color: white;">🌱 Vegetarian</span>');
    if (item.tags.includes('vegan')) badges.push('<span class="dish-badge" style="background: #8BC34A; color: white;">🥬 Vegan</span>');
    if (item.tags.includes('spicy')) badges.push('<span class="dish-badge" style="background: #FF5722; color: white;">🌶️ Spicy</span>');
    if (item.tags.includes('gluten-free')) badges.push('<span class="dish-badge" style="background: #FFD23F;">🌾 GF</span>');

    // Use real images if available
    const imageUrl = typeof getImageUrl !== 'undefined' ? getImageUrl(item.name) : null;

    return `
        <div class="dish-card">
            <div style="position: relative;">
                ${imageUrl ?
                    `<img src="${imageUrl}" alt="${sanitizeHTML(item.name)}" class="dish-image" style="width: 100%; height: 250px; object-fit: cover;">` :
                    `<div class="dish-image" style="background: linear-gradient(135deg, #C95D3F 0%, #E6A834 100%); height: 250px; display: flex; align-items: center; justify-content: center; font-size: 80px;">${item.emoji}</div>`
                }
                ${badges.map(badge => `<div style="position: absolute; top: 1rem; right: 1rem;">${badge}</div>`).join('')}
            </div>
            <div class="dish-content">
                <h3>${sanitizeHTML(item.name)}</h3>
                <p>${sanitizeHTML(item.description)}</p>
                <div class="dish-footer">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="btn-add-cart" data-name="${sanitizeHTML(item.name)}" data-price="${item.price}">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}
