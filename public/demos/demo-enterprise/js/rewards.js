/* ===================================
   REWARDS PAGE FUNCTIONALITY
   =================================== */

const TIER_LEVELS = {
    BRONZE: { min: 0, max: 999, name: 'Bronze', multiplier: 10 },
    SILVER: { min: 1000, max: 2499, name: 'Silver', multiplier: 12 },
    GOLD: { min: 2500, max: Infinity, name: 'Gold', multiplier: 15 }
};

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (userSession.isLoggedIn()) {
        showPointsBalance();
    } else {
        document.getElementById('pointsBalance').style.display = 'none';
    }

    // Setup redeem buttons
    setupRedeemButtons();
});

function showPointsBalance() {
    const pointsBalance = document.getElementById('pointsBalance');
    const user = userSession.getUser();
    const points = userSession.getPoints();

    pointsBalance.style.display = 'block';

    // Update points display
    document.getElementById('currentPoints').textContent = points.toLocaleString();

    // Calculate and display tier
    const tier = getCurrentTier(points);
    document.getElementById('userTier').textContent = tier.name;

    // Calculate progress to next tier
    const nextTier = getNextTier(tier.name);
    if (nextTier) {
        const pointsNeeded = nextTier.min - points;
        const progress = ((points - tier.min) / (nextTier.min - tier.min)) * 100;

        document.getElementById('tierProgress').style.width = progress + '%';
        document.getElementById('progressText').textContent =
            `${pointsNeeded.toLocaleString()} more points to ${nextTier.name} tier`;
    } else {
        // Already at highest tier
        document.getElementById('tierProgress').style.width = '100%';
        document.getElementById('progressText').textContent =
            'You\'ve reached the highest tier! 🎉';
    }
}

function getCurrentTier(points) {
    if (points >= TIER_LEVELS.GOLD.min) return TIER_LEVELS.GOLD;
    if (points >= TIER_LEVELS.SILVER.min) return TIER_LEVELS.SILVER;
    return TIER_LEVELS.BRONZE;
}

function getNextTier(currentTierName) {
    if (currentTierName === 'Bronze') return TIER_LEVELS.SILVER;
    if (currentTierName === 'Silver') return TIER_LEVELS.GOLD;
    return null; // Already at highest tier
}

function setupRedeemButtons() {
    const redeemButtons = document.querySelectorAll('.btn-redeem');

    redeemButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pointsCost = parseInt(this.dataset.points);
            const rewardName = this.dataset.reward;

            if (!userSession.isLoggedIn()) {
                showNotification('Please sign in to redeem rewards', 'error');
                setTimeout(() => {
                    window.location.href = 'account.html';
                }, 1500);
                return;
            }

            const currentPoints = userSession.getPoints();

            if (currentPoints < pointsCost) {
                showNotification(`You need ${(pointsCost - currentPoints).toLocaleString()} more points to redeem this reward`, 'error');
                return;
            }

            // Confirm redemption
            if (confirm(`Redeem ${rewardName} for ${pointsCost.toLocaleString()} points?`)) {
                redeemReward(pointsCost, rewardName);
            }
        });

        // Update button state based on points
        updateButtonState(button);
    });
}

function updateButtonState(button) {
    if (!userSession.isLoggedIn()) {
        button.textContent = 'Sign In';
        return;
    }

    const pointsCost = parseInt(button.dataset.points);
    const currentPoints = userSession.getPoints();

    if (currentPoints < pointsCost) {
        button.disabled = true;
        button.textContent = 'Not Enough Points';
    } else {
        button.disabled = false;
        button.textContent = 'Redeem';
    }
}

function redeemReward(pointsCost, rewardName) {
    // Deduct points
    const user = userSession.getUser();
    user.points -= pointsCost;
    userSession.setUser(user);

    // Save redeemed reward
    const redemptions = storage.get('redemptions') || [];
    redemptions.unshift({
        id: generateId(),
        reward: rewardName,
        points: pointsCost,
        date: new Date().toISOString(),
        status: 'active'
    });
    storage.set('redemptions', redemptions.slice(0, 50));

    // Track analytics
    analytics.track('reward_redeemed', { reward: rewardName, points: pointsCost });

    // Show success message
    showNotification(`${rewardName} redeemed successfully!`, 'success');

    // Update UI
    showPointsBalance();
    setupRedeemButtons(); // Re-setup to update button states
}
