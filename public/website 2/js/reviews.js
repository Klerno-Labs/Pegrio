// ========================================
// Reviews Page Functionality
// ========================================

const allReviews = [
    {
        id: 1,
        author: 'Sarah Johnson',
        rating: 5,
        date: new Date('2024-02-10'),
        text: 'Absolutely amazing! The butter chicken are the best I\'ve ever had. Fresh ingredients and authentic flavors. The service was quick and the staff was incredibly friendly. Will definitely be back!',
        helpful: 45
    },
    {
        id: 2,
        author: 'Mike Rodriguez',
        rating: 5,
        date: new Date('2024-02-05'),
        text: 'Great service and even better food. The biryani is huge and delicious. Highly recommend for anyone craving authentic Mexican cuisine. The horchata is also a must-try!',
        helpful: 38
    },
    {
        id: 3,
        author: 'Emily Chen',
        rating: 5,
        date: new Date('2024-01-28'),
        text: 'Love this place! The atmosphere is warm and welcoming, and the food is consistently excellent. The palak paneer are my favorite! I\'ve been here at least 5 times and never disappointed.',
        helpful: 52
    },
    {
        id: 4,
        author: 'David Martinez',
        rating: 5,
        date: new Date('2024-01-22'),
        text: 'Best Mexican restaurant in town! The tandoori chicken are perfectly seasoned and the samosas is always fresh. The portions are generous and the prices are very reasonable.',
        helpful: 41
    },
    {
        id: 5,
        author: 'Jessica Williams',
        rating: 4,
        date: new Date('2024-01-15'),
        text: 'Really good food and nice ambiance. The naan were delicious and the salsa had a perfect kick. Only complaint is that it can get quite busy during lunch hours, but it\'s worth the wait!',
        helpful: 28
    },
    {
        id: 6,
        author: 'Robert Taylor',
        rating: 5,
        date: new Date('2024-01-10'),
        text: 'Outstanding experience from start to finish. The staff went above and beyond to accommodate our large group. Every dish we tried was fantastic, especially the kulfi for dessert!',
        helpful: 33
    },
    {
        id: 7,
        author: 'Amanda Lee',
        rating: 5,
        date: new Date('2024-01-05'),
        text: 'I\'m vegetarian and was thrilled with the variety of options available. The bean and cheese burrito and vegetarian tacos were both incredible. Finally, a Mexican restaurant that caters well to vegetarians!',
        helpful: 47
    },
    {
        id: 8,
        author: 'Chris Anderson',
        rating: 4,
        date: new Date('2023-12-28'),
        text: 'Solid Mexican food with authentic flavors. The chicken tikka were crispy and fresh. Great place for a casual dinner. Would give 5 stars but the wait time was a bit long.',
        helpful: 19
    },
    {
        id: 9,
        author: 'Maria Garcia',
        rating: 5,
        date: new Date('2023-12-20'),
        text: 'As someone who grew up eating Mexican food, I can confidently say this is the real deal. The flavors remind me of my grandmother\'s cooking. The mole enchiladas are exceptional!',
        helpful: 61
    },
    {
        id: 10,
        author: 'James Wilson',
        rating: 5,
        date: new Date('2023-12-15'),
        text: 'Fantastic food and great value for money. The California burrito is loaded and absolutely delicious. The staff is always friendly and the restaurant is kept very clean.',
        helpful: 35
    },
    {
        id: 11,
        author: 'Nicole Brown',
        rating: 4,
        date: new Date('2023-12-10'),
        text: 'Very good Mexican food. The nachos supreme are amazing - perfectly crispy with lots of toppings. The only downside is limited parking, but the food makes up for it.',
        helpful: 22
    },
    {
        id: 12,
        author: 'Kevin Thompson',
        rating: 5,
        date: new Date('2023-12-05'),
        text: 'My go-to spot for Mexican food! I order from here at least once a week. The delivery is always fast and the food arrives hot. The breakfast burritos are perfect for weekend mornings.',
        helpful: 29
    },
    {
        id: 13,
        author: 'Lisa Martinez',
        rating: 5,
        date: new Date('2023-11-28'),
        text: 'Incredible authentic Mexican cuisine! Every dish is prepared with care and you can taste the quality. The jamaica drink is so refreshing. This place has become our family\'s favorite restaurant.',
        helpful: 44
    },
    {
        id: 14,
        author: 'Daniel Kim',
        rating: 3,
        date: new Date('2023-11-22'),
        text: 'Good food but a bit inconsistent. Had a great experience the first time, but the second visit the portions were smaller and the wait was longer. Still tasty though.',
        helpful: 15
    },
    {
        id: 15,
        author: 'Ashley Davis',
        rating: 5,
        date: new Date('2023-11-15'),
        text: 'Absolutely love this place! The gulab jamun is to die for. The entire staff is so welcoming and the atmosphere is perfect for both family dinners and date nights.',
        helpful: 37
    }
];

let currentRatingFilter = 'all';
let currentSortMethod = 'recent';

document.addEventListener('DOMContentLoaded', () => {
    renderReviews();

    // Rating filter buttons
    const filterButtons = document.querySelectorAll('.reviews-controls .filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentRatingFilter = button.dataset.rating;
            renderReviews();
        });
    });

    // Sort dropdown
    const sortSelect = document.getElementById('review-sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSortMethod = e.target.value;
            renderReviews();
        });
    }
});

function renderReviews() {
    const container = document.getElementById('reviews-list');
    if (!container) return;

    // Filter reviews
    let filteredReviews = currentRatingFilter === 'all'
        ? [...allReviews]
        : allReviews.filter(review => review.rating === parseInt(currentRatingFilter));

    // Sort reviews
    filteredReviews = sortReviews(filteredReviews, currentSortMethod);

    // Render
    container.innerHTML = filteredReviews.map(review => createReviewCard(review)).join('');
}

function sortReviews(reviews, method) {
    const sorted = [...reviews];

    switch (method) {
        case 'recent':
            return sorted.sort((a, b) => b.date - a.date);
        case 'helpful':
            return sorted.sort((a, b) => b.helpful - a.helpful);
        case 'highest':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'lowest':
            return sorted.sort((a, b) => a.rating - b.rating);
        default:
            return sorted;
    }
}

function createReviewCard(review) {
    const timeAgo = getTimeAgo(review.date);
    const stars = '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

    return `
        <div class="review-card">
            <div class="review-header">
                <div>
                    <div class="review-author">${sanitizeHTML(review.author)}</div>
                    <div class="review-date">${timeAgo}</div>
                </div>
                <div class="review-rating">${stars}</div>
            </div>
            <p class="review-text">${sanitizeHTML(review.text)}</p>
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); color: var(--text-light); font-size: 0.9rem;">
                👍 Helpful (${review.helpful})
            </div>
        </div>
    `;
}

function getTimeAgo(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}
