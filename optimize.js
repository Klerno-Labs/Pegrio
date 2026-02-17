/* ========================================
   PERFORMANCE OPTIMIZATIONS
   Additional optimizations for perfect 100s
   ======================================== */

// ========================================
// PRELOAD CRITICAL RESOURCES
// ========================================

(function() {
    // Preload critical fonts
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.as = 'font';
    fontPreload.type = 'font/woff2';
    fontPreload.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
    fontPreload.crossOrigin = 'anonymous';
    document.head.appendChild(fontPreload);
})();

// ========================================
// LAZY LOAD NON-CRITICAL CSS
// ========================================

function loadDeferredStyles() {
    const addStylesNode = document.getElementById('deferred-styles');
    if (addStylesNode) {
        const replacement = document.createElement('div');
        replacement.innerHTML = addStylesNode.textContent;
        document.body.appendChild(replacement);
        addStylesNode.parentElement.removeChild(addStylesNode);
    }
}

// Load after page load
if (window.addEventListener) {
    window.addEventListener('load', loadDeferredStyles, false);
} else if (window.attachEvent) {
    window.attachEvent('onload', loadDeferredStyles);
}

// ========================================
// REDUCE LAYOUT SHIFT (CLS)
// ========================================

// Set image dimensions immediately
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
        // Prevent layout shift by setting aspect ratio
        if (!img.width && !img.height) {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            if (aspectRatio) {
                img.style.aspectRatio = aspectRatio;
            }
        }
    });
});

// ========================================
// OPTIMIZE THIRD-PARTY SCRIPTS
// ========================================

// Delay analytics until user interaction
let analyticsLoaded = false;

function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;

    // Analytics will load from analytics.js
    if (window.Analytics && !window.Analytics.initialized) {
        window.Analytics.init();
    }
}

// Load on first user interaction
['scroll', 'click', 'touchstart', 'mousemove'].forEach(event => {
    window.addEventListener(event, loadAnalytics, { once: true, passive: true });
});

// Fallback: load after 3 seconds if no interaction
setTimeout(loadAnalytics, 3000);

// ========================================
// PREFETCH LIKELY NAVIGATION
// ========================================

// Prefetch demo pages when user hovers over links
document.addEventListener('DOMContentLoaded', () => {
    const demoLinks = document.querySelectorAll('.demo-link, a[href*="website"]');

    demoLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#')) {
                const prefetch = document.createElement('link');
                prefetch.rel = 'prefetch';
                prefetch.href = href;
                document.head.appendChild(prefetch);
            }
        }, { once: true });
    });
});

// ========================================
// REDUCE MAIN THREAD WORK
// ========================================

// Use requestIdleCallback for non-critical tasks
const scheduleWork = window.requestIdleCallback || function(cb) {
    return setTimeout(cb, 1);
};

// Defer non-critical initializations
scheduleWork(() => {
    // Initialize fancy features only when browser is idle
    if (window.CustomCursor && window.innerWidth > 768) {
        new CustomCursor();
    }

    if (window.ScrollProgress) {
        new ScrollProgress();
    }
});

// ========================================
// OPTIMIZE FONT LOADING
// ========================================

if ('fonts' in document) {
    Promise.all([
        document.fonts.load('400 1rem Inter'),
        document.fonts.load('600 1rem Inter'),
        document.fonts.load('700 1rem Inter')
    ]).then(() => {
        document.documentElement.classList.add('fonts-loaded');
    });
}

// ========================================
// REDUCE UNUSED JAVASCRIPT
// ========================================

// Only initialize features that are visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const section = entry.target;

            // Initialize section-specific features
            if (section.id === 'faq' && window.initFAQAccordion) {
                initFAQAccordion();
                observer.unobserve(section);
            }
        }
    });
}, { rootMargin: '50px' });

// Observe sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));
});

// ========================================
// PERFORMANCE MONITORING
// ========================================

// Send performance metrics to analytics
window.addEventListener('load', () => {
    if ('PerformanceObserver' in window) {
        // Observe Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];

            if (window.Analytics && lastEntry.renderTime) {
                Analytics.trackEvent('Performance_LCP', {
                    value: Math.round(lastEntry.renderTime),
                    event_category: 'performance'
                });
            }
        });

        try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            // LCP not supported
        }

        // Observe First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (window.Analytics) {
                    Analytics.trackEvent('Performance_FID', {
                        value: Math.round(entry.processingStart - entry.startTime),
                        event_category: 'performance'
                    });
                }
            });
        });

        try {
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            // FID not supported
        }

        // Observe Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
        });

        try {
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            // CLS not supported
        }

        // Report CLS on page unload
        window.addEventListener('beforeunload', () => {
            if (window.Analytics && clsValue > 0) {
                Analytics.trackEvent('Performance_CLS', {
                    value: Math.round(clsValue * 1000) / 1000,
                    event_category: 'performance'
                });
            }
        });
    }
});
