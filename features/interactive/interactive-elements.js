/* ========================================
   INTERACTIVE ELEMENTS
   ROI calculator, timeline estimator, comparison slider
   ======================================== */

/**
 * Interactive Elements Manager
 *
 * Features:
 * - ROI Calculator (calculate return on investment for a new website)
 * - Project Timeline Estimator (estimate project duration)
 * - Package Comparison Slider (compare package features)
 * - Before/After Website Slider (show website transformations)
 */

class InteractiveElements {
    constructor() {
        this.calculators = new Map();
        this.sliders = new Map();
    }

    /**
     * Initialize Interactive Elements
     */
    init() {
        try {
            // Initialize ROI Calculator
            this.initROICalculator();

            // Initialize Timeline Estimator
            this.initTimelineEstimator();

            // Initialize Package Comparison
            this.initPackageComparison();

            // Initialize Before/After Sliders
            this.initBeforeAfterSliders();

            console.log('✅ Interactive Elements initialized');

        } catch (error) {
            console.error('❌ Failed to initialize Interactive Elements:', error);
        }
    }

    /**
     * ROI Calculator
     * Calculate return on investment for a new website
     */
    initROICalculator() {
        const container = document.querySelector('#roi-calculator');
        if (!container) return;

        const html = `
            <div class="calculator-card">
                <h3 class="calculator-title">Website ROI Calculator</h3>
                <p class="calculator-subtitle">See your potential return on investment</p>

                <div class="calculator-inputs">
                    <div class="input-group">
                        <label for="monthly-visitors">Monthly Visitors</label>
                        <input type="number" id="monthly-visitors" value="1000" min="0" step="100">
                    </div>

                    <div class="input-group">
                        <label for="conversion-rate">Current Conversion Rate (%)</label>
                        <input type="number" id="conversion-rate" value="1" min="0" max="100" step="0.1">
                    </div>

                    <div class="input-group">
                        <label for="average-sale">Average Sale Value ($)</label>
                        <input type="number" id="average-sale" value="100" min="0" step="10">
                    </div>

                    <div class="input-group">
                        <label for="improvement">Expected Improvement (%)</label>
                        <input type="range" id="improvement" value="50" min="0" max="200" step="10">
                        <div class="range-value"><span id="improvement-value">50</span>%</div>
                    </div>
                </div>

                <div class="calculator-results">
                    <div class="result-card">
                        <div class="result-label">Current Monthly Revenue</div>
                        <div class="result-value" id="current-revenue">$1,000</div>
                    </div>
                    <div class="result-card highlight">
                        <div class="result-label">Projected Monthly Revenue</div>
                        <div class="result-value" id="projected-revenue">$1,500</div>
                    </div>
                    <div class="result-card success">
                        <div class="result-label">Monthly Increase</div>
                        <div class="result-value" id="monthly-increase">+$500</div>
                    </div>
                    <div class="result-card success">
                        <div class="result-label">Annual Increase</div>
                        <div class="result-value" id="annual-increase">+$6,000</div>
                    </div>
                </div>

                <div class="calculator-note">
                    *Based on industry averages. Your results may vary.
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup event listeners
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculateROI());
        });

        // Initial calculation
        this.calculateROI();

        this.calculators.set('roi', container);
    }

    /**
     * Calculate ROI
     */
    calculateROI() {
        const visitors = parseFloat(document.getElementById('monthly-visitors')?.value) || 0;
        const conversionRate = parseFloat(document.getElementById('conversion-rate')?.value) || 0;
        const averageSale = parseFloat(document.getElementById('average-sale')?.value) || 0;
        const improvement = parseFloat(document.getElementById('improvement')?.value) || 0;

        // Update improvement display
        const improvementValue = document.getElementById('improvement-value');
        if (improvementValue) {
            improvementValue.textContent = improvement;
        }

        // Calculate current revenue
        const currentConversions = visitors * (conversionRate / 100);
        const currentRevenue = currentConversions * averageSale;

        // Calculate projected revenue with improvement
        const newConversionRate = conversionRate * (1 + improvement / 100);
        const projectedConversions = visitors * (newConversionRate / 100);
        const projectedRevenue = projectedConversions * averageSale;

        // Calculate increases
        const monthlyIncrease = projectedRevenue - currentRevenue;
        const annualIncrease = monthlyIncrease * 12;

        // Update displays
        this.updateValue('current-revenue', currentRevenue);
        this.updateValue('projected-revenue', projectedRevenue);
        this.updateValue('monthly-increase', monthlyIncrease, true);
        this.updateValue('annual-increase', annualIncrease, true);

        // Track event
        if (window.Analytics) {
            window.Analytics.trackEvent('ROI_Calculator_Used', {
                event_category: 'engagement',
                event_label: `Improvement: ${improvement}%`,
                value: Math.round(annualIncrease)
            });
        }
    }

    /**
     * Update value display with formatting
     */
    updateValue(elementId, value, showPlus = false) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);

        element.textContent = (showPlus && value > 0 ? '+' : '') + formatted;

        // Animate the number
        element.classList.add('value-updated');
        setTimeout(() => element.classList.remove('value-updated'), 300);
    }

    /**
     * Timeline Estimator
     * Estimate project duration based on requirements
     */
    initTimelineEstimator() {
        const container = document.querySelector('#timeline-estimator');
        if (!container) return;

        const html = `
            <div class="calculator-card">
                <h3 class="calculator-title">Project Timeline Estimator</h3>
                <p class="calculator-subtitle">Get an estimate for your project</p>

                <div class="estimator-options">
                    <div class="option-group">
                        <label class="checkbox-option">
                            <input type="checkbox" data-weeks="1" checked>
                            <span>Custom Design</span>
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" data-weeks="0.5">
                            <span>Logo Design</span>
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" data-weeks="1">
                            <span>E-commerce Integration</span>
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" data-weeks="0.5">
                            <span>Blog/CMS</span>
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" data-weeks="1">
                            <span>Custom Features</span>
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" data-weeks="0.5">
                            <span>SEO Optimization</span>
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" data-weeks="1">
                            <span>Copywriting</span>
                        </label>
                        <label class="checkbox-option">
                            <input type="checkbox" data-weeks="0.5">
                            <span>Photography/Video</span>
                        </label>
                    </div>

                    <div class="pages-input">
                        <label for="num-pages">Number of Pages</label>
                        <select id="num-pages">
                            <option value="1">1-5 pages</option>
                            <option value="1.5" selected>6-10 pages</option>
                            <option value="2">11-20 pages</option>
                            <option value="3">20+ pages</option>
                        </select>
                    </div>
                </div>

                <div class="timeline-result">
                    <div class="timeline-visual">
                        <div class="timeline-bar">
                            <div class="timeline-progress" id="timeline-progress"></div>
                        </div>
                        <div class="timeline-label">
                            <span id="timeline-weeks">2-3</span> weeks
                        </div>
                    </div>
                    <div class="timeline-breakdown">
                        <h4>Project Phases:</h4>
                        <ul id="timeline-phases">
                            <li>Discovery & Planning (3-5 days)</li>
                            <li>Design & Revisions (1 week)</li>
                            <li>Development (1-2 weeks)</li>
                            <li>Testing & Launch (2-3 days)</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Setup event listeners
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        const pagesSelect = document.getElementById('num-pages');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.calculateTimeline());
        });

        pagesSelect?.addEventListener('change', () => this.calculateTimeline());

        // Initial calculation
        this.calculateTimeline();

        this.calculators.set('timeline', container);
    }

    /**
     * Calculate project timeline
     */
    calculateTimeline() {
        const checkboxes = document.querySelectorAll('#timeline-estimator input[type="checkbox"]:checked');
        const pagesSelect = document.getElementById('num-pages');

        let totalWeeks = parseFloat(pagesSelect?.value) || 1.5;

        // Add weeks for each selected feature
        checkboxes.forEach(checkbox => {
            totalWeeks += parseFloat(checkbox.dataset.weeks) || 0;
        });

        // Calculate min and max (±20%)
        const minWeeks = Math.ceil(totalWeeks * 0.8);
        const maxWeeks = Math.ceil(totalWeeks * 1.2);

        // Update display
        const weeksDisplay = document.getElementById('timeline-weeks');
        if (weeksDisplay) {
            weeksDisplay.textContent = `${minWeeks}-${maxWeeks}`;
        }

        // Update progress bar (visual representation)
        const progressBar = document.getElementById('timeline-progress');
        if (progressBar) {
            const percentage = Math.min((totalWeeks / 6) * 100, 100); // Max at 6 weeks
            progressBar.style.width = `${percentage}%`;
        }

        // Track event
        if (window.Analytics) {
            window.Analytics.trackEvent('Timeline_Estimator_Used', {
                event_category: 'engagement',
                event_label: `${minWeeks}-${maxWeeks} weeks`,
                value: maxWeeks
            });
        }
    }

    /**
     * Package Comparison Slider
     * Interactive comparison of package features
     */
    initPackageComparison() {
        const container = document.querySelector('#package-comparison');
        if (!container) return;

        // This is a simplified version - would integrate with existing package data
        console.log('Package comparison initialized');

        this.calculators.set('comparison', container);
    }

    /**
     * Before/After Website Slider
     * Show website transformations with draggable slider
     */
    initBeforeAfterSliders() {
        const sliders = document.querySelectorAll('.before-after-slider');

        sliders.forEach(slider => {
            const beforeImg = slider.querySelector('.before-image');
            const afterImg = slider.querySelector('.after-image');
            const handle = slider.querySelector('.slider-handle');

            if (!beforeImg || !afterImg || !handle) return;

            let isDragging = false;

            // Mouse events
            handle.addEventListener('mousedown', () => {
                isDragging = true;
                slider.classList.add('dragging');
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                this.updateSlider(slider, e.clientX);
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    slider.classList.remove('dragging');
                }
            });

            // Touch events
            handle.addEventListener('touchstart', () => {
                isDragging = true;
                slider.classList.add('dragging');
            });

            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                const touch = e.touches[0];
                this.updateSlider(slider, touch.clientX);
            });

            document.addEventListener('touchend', () => {
                if (isDragging) {
                    isDragging = false;
                    slider.classList.remove('dragging');
                }
            });

            // Click to set position
            slider.addEventListener('click', (e) => {
                if (e.target === handle) return;
                this.updateSlider(slider, e.clientX);
            });

            this.sliders.set(slider, { beforeImg, afterImg, handle });
        });
    }

    /**
     * Update before/after slider position
     */
    updateSlider(slider, clientX) {
        const rect = slider.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

        const afterImg = slider.querySelector('.after-image');
        const handle = slider.querySelector('.slider-handle');

        if (afterImg) {
            afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        }

        if (handle) {
            handle.style.left = `${percentage}%`;
        }
    }

    /**
     * Create a before/after slider programmatically
     */
    createBeforeAfterSlider(container, beforeSrc, afterSrc, label = '') {
        const html = `
            <div class="before-after-slider">
                <img src="${beforeSrc}" alt="Before ${label}" class="before-image">
                <div class="after-image-container">
                    <img src="${afterSrc}" alt="After ${label}" class="after-image">
                </div>
                <div class="slider-handle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                    </svg>
                </div>
                ${label ? `<div class="slider-label">${label}</div>` : ''}
            </div>
        `;

        container.innerHTML = html;

        // Initialize the new slider
        const newSlider = container.querySelector('.before-after-slider');
        if (newSlider) {
            this.initBeforeAfterSliders();
        }
    }
}

// Create singleton instance
const interactiveElements = new InteractiveElements();

// Make available globally
if (typeof window !== 'undefined') {
    window.InteractiveElements = interactiveElements;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = interactiveElements;
}

/* ========================================
   USAGE EXAMPLES
   ======================================== */

/**
 * Example 1: ROI Calculator
 *
 * <div id="roi-calculator"></div>
 * <script>
 *   InteractiveElements.init();
 * </script>
 */

/**
 * Example 2: Timeline Estimator
 *
 * <div id="timeline-estimator"></div>
 */

/**
 * Example 3: Before/After Slider
 *
 * <div class="before-after-slider">
 *     <img src="/images/before.jpg" alt="Before" class="before-image">
 *     <div class="after-image-container">
 *         <img src="/images/after.jpg" alt="After" class="after-image">
 *     </div>
 *     <div class="slider-handle">
 *         <svg>...</svg>
 *     </div>
 * </div>
 */

/**
 * Example 4: Create slider programmatically
 *
 * const container = document.querySelector('#my-slider');
 * InteractiveElements.createBeforeAfterSlider(
 *     container,
 *     '/images/old-website.jpg',
 *     '/images/new-website.jpg',
 *     'Restaurant Redesign'
 * );
 */
