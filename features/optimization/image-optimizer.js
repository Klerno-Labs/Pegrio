/* ========================================
   IMAGE OPTIMIZATION SYSTEM
   WebP conversion, lazy loading, responsive images, CDN
   ======================================== */

/**
 * Image Optimizer
 *
 * Features:
 * - WebP format with fallbacks
 * - Lazy loading with IntersectionObserver
 * - Responsive srcset generation
 * - CDN integration (Cloudinary/Cloudflare)
 * - Blur-up placeholder loading
 * - Automatic compression
 */

class ImageOptimizer {
    constructor() {
        this.images = new Map();
        this.observers = new Map();
        this.supportsWebP = false;
        this.cdnEnabled = false;
        this.cdnBaseUrl = '';
    }

    /**
     * Initialize Image Optimizer
     */
    async init() {
        try {
            // Detect WebP support
            this.supportsWebP = await this.detectWebPSupport();

            // Configure CDN
            this.configureCDN();

            // Initialize lazy loading
            this.initLazyLoading();

            // Initialize responsive images
            this.initResponsiveImages();

            // Initialize blur-up placeholders
            this.initBlurUpPlaceholders();

            console.log('✅ Image Optimizer initialized', {
                webP: this.supportsWebP,
                cdn: this.cdnEnabled
            });

        } catch (error) {
            console.error('❌ Failed to initialize Image Optimizer:', error);
        }
    }

    /**
     * Detect WebP support
     * @returns {Promise<boolean>} True if WebP is supported
     */
    detectWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = function() {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    /**
     * Configure CDN
     * Check for Cloudinary or Cloudflare configuration
     */
    configureCDN() {
        const config = window.Config?.cdn;

        if (config?.enabled) {
            this.cdnEnabled = true;
            this.cdnBaseUrl = config.baseUrl || '';
            console.log('📦 CDN enabled:', this.cdnBaseUrl);
        }
    }

    /**
     * Initialize lazy loading for images
     * Load images only when they're about to enter viewport
     */
    initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px' // Start loading 50px before entering viewport
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });

            this.observers.set('lazy-images', imageObserver);
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => this.loadImage(img));
        }
    }

    /**
     * Load a lazy image
     * @param {HTMLImageElement} img - Image element
     */
    loadImage(img) {
        const src = img.dataset.src || img.src;
        const srcset = img.dataset.srcset;

        if (!src) return;

        // Show loading state
        img.classList.add('loading');

        // Create a new image to preload
        const tempImg = new Image();

        tempImg.onload = () => {
            // Set the actual source
            if (srcset) {
                img.srcset = srcset;
            }
            img.src = this.optimizeUrl(src);

            // Remove data attributes
            delete img.dataset.src;
            delete img.dataset.srcset;

            // Remove loading state, add loaded state
            img.classList.remove('loading');
            img.classList.add('loaded');

            // Track successful load
            if (window.Analytics) {
                window.Analytics.trackEvent('Image_Loaded', {
                    event_category: 'performance',
                    event_label: src
                });
            }
        };

        tempImg.onerror = () => {
            console.error('Failed to load image:', src);
            img.classList.remove('loading');
            img.classList.add('error');
        };

        // Start loading
        tempImg.src = this.optimizeUrl(src);
    }

    /**
     * Optimize image URL
     * Apply WebP conversion and CDN transformations
     * @param {string} url - Original image URL
     * @returns {string} Optimized URL
     */
    optimizeUrl(url) {
        // If CDN is not enabled, return original URL
        if (!this.cdnEnabled) {
            return this.supportsWebP ? this.convertToWebP(url) : url;
        }

        // Use CDN transformations
        return this.applyCDNOptimizations(url);
    }

    /**
     * Convert image URL to WebP
     * @param {string} url - Original image URL
     * @returns {string} WebP URL
     */
    convertToWebP(url) {
        // Only convert if browser supports WebP and image is not already WebP
        if (!this.supportsWebP || url.endsWith('.webp')) {
            return url;
        }

        // Simple conversion: replace extension
        return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }

    /**
     * Apply CDN optimizations (Cloudinary/Cloudflare)
     * @param {string} url - Original image URL
     * @returns {string} CDN-optimized URL
     */
    applyCDNOptimizations(url) {
        // If URL is already from CDN, return as-is
        if (url.startsWith(this.cdnBaseUrl)) {
            return url;
        }

        // Extract filename from URL
        const filename = url.split('/').pop();

        // Cloudinary transformations
        const transformations = [
            'f_auto',      // Automatic format (WebP when supported)
            'q_auto',      // Automatic quality
            'w_auto',      // Automatic width
            'dpr_auto'     // Automatic device pixel ratio
        ].join(',');

        // Construct CDN URL
        return `${this.cdnBaseUrl}/${transformations}/${filename}`;
    }

    /**
     * Initialize responsive images
     * Add srcset for different screen sizes
     */
    initResponsiveImages() {
        const responsiveImages = document.querySelectorAll('img[data-responsive]');

        responsiveImages.forEach(img => {
            const src = img.src || img.dataset.src;
            if (!src) return;

            // Generate srcset
            const srcset = this.generateSrcset(src);
            img.srcset = srcset;

            // Add sizes attribute for better browser selection
            if (!img.sizes) {
                img.sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px';
            }
        });
    }

    /**
     * Generate srcset for different screen sizes
     * @param {string} src - Original image source
     * @returns {string} srcset string
     */
    generateSrcset(src) {
        const widths = [320, 640, 768, 1024, 1280, 1920];
        const srcsetParts = [];

        widths.forEach(width => {
            const url = this.cdnEnabled
                ? `${this.cdnBaseUrl}/w_${width},f_auto,q_auto/${src.split('/').pop()}`
                : src; // Without CDN, use same image (ideally pre-generated)

            srcsetParts.push(`${url} ${width}w`);
        });

        return srcsetParts.join(', ');
    }

    /**
     * Initialize blur-up placeholders
     * Show low-quality placeholder while loading high-quality image
     */
    initBlurUpPlaceholders() {
        const blurImages = document.querySelectorAll('img[data-blur-src]');

        blurImages.forEach(img => {
            const blurSrc = img.dataset.blurSrc;
            const actualSrc = img.dataset.src;

            if (!blurSrc || !actualSrc) return;

            // Set blur placeholder immediately
            img.src = blurSrc;
            img.classList.add('blur-placeholder');

            // Load actual image
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = this.optimizeUrl(actualSrc);
                img.classList.remove('blur-placeholder');
                img.classList.add('blur-loaded');
            };
            tempImg.src = this.optimizeUrl(actualSrc);
        });
    }

    /**
     * Preload critical images
     * Load important images immediately
     * @param {string[]} urls - Array of image URLs to preload
     */
    preloadImages(urls) {
        urls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = this.optimizeUrl(url);
            document.head.appendChild(link);
        });
    }

    /**
     * Compress image using canvas
     * Client-side compression for user uploads
     * @param {File} file - Image file
     * @param {number} quality - Quality (0-1)
     * @returns {Promise<Blob>} Compressed image blob
     */
    async compressImage(file, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate new dimensions (max 2000px)
                    let width = img.width;
                    let height = img.height;
                    const maxSize = 2000;

                    if (width > maxSize || height > maxSize) {
                        if (width > height) {
                            height = (height / width) * maxSize;
                            width = maxSize;
                        } else {
                            width = (width / height) * maxSize;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Draw and compress
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', quality);
                };

                img.onerror = reject;
                img.src = e.target.result;
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Get image dimensions without loading
     * @param {string} url - Image URL
     * @returns {Promise<{width: number, height: number}>} Image dimensions
     */
    async getImageDimensions(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });
            };

            img.onerror = reject;
            img.src = url;
        });
    }

    /**
     * Create responsive picture element
     * @param {Object} config - Picture configuration
     * @returns {HTMLPictureElement} Picture element
     */
    createPictureElement(config) {
        const {
            webpSrc,
            jpgSrc,
            alt,
            sizes = '100vw',
            className = ''
        } = config;

        const picture = document.createElement('picture');

        // WebP source
        if (webpSrc) {
            const webpSource = document.createElement('source');
            webpSource.type = 'image/webp';
            webpSource.srcset = webpSrc;
            webpSource.sizes = sizes;
            picture.appendChild(webpSource);
        }

        // Fallback JPG
        const img = document.createElement('img');
        img.src = jpgSrc;
        img.alt = alt || '';
        img.loading = 'lazy';
        if (className) img.className = className;
        picture.appendChild(img);

        return picture;
    }

    /**
     * Monitor image performance
     * Track load times and failures
     */
    monitorPerformance() {
        if (!('PerformanceObserver' in window)) return;

        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.initiatorType === 'img') {
                    console.log('Image loaded:', {
                        url: entry.name,
                        duration: entry.duration,
                        size: entry.transferSize
                    });

                    // Track slow images
                    if (entry.duration > 1000) {
                        console.warn('Slow image load:', entry.name);

                        if (window.Analytics) {
                            window.Analytics.trackEvent('Slow_Image_Load', {
                                event_category: 'performance',
                                event_label: entry.name,
                                value: Math.round(entry.duration)
                            });
                        }
                    }
                }
            });
        });

        observer.observe({ entryTypes: ['resource'] });
    }
}

// Create singleton instance
const imageOptimizer = new ImageOptimizer();

// Make available globally
if (typeof window !== 'undefined') {
    window.ImageOptimizer = imageOptimizer;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = imageOptimizer;
}

/* ========================================
   USAGE EXAMPLES
   ======================================== */

/**
 * Example 1: Lazy-loaded image
 *
 * <img data-src="/images/hero.jpg" alt="Hero" loading="lazy">
 */

/**
 * Example 2: Responsive image with srcset
 *
 * <img data-src="/images/product.jpg"
 *      data-responsive
 *      sizes="(max-width: 640px) 100vw, 50vw"
 *      alt="Product">
 */

/**
 * Example 3: Blur-up placeholder
 *
 * <img data-blur-src="/images/hero-blur.jpg"
 *      data-src="/images/hero.jpg"
 *      alt="Hero">
 */

/**
 * Example 4: Picture element with WebP
 *
 * const picture = ImageOptimizer.createPictureElement({
 *     webpSrc: '/images/hero.webp',
 *     jpgSrc: '/images/hero.jpg',
 *     alt: 'Hero Image',
 *     className: 'hero-image'
 * });
 * document.querySelector('.hero').appendChild(picture);
 */

/**
 * Example 5: Compress user upload
 *
 * const file = event.target.files[0];
 * const compressed = await ImageOptimizer.compressImage(file, 0.8);
 * // Upload compressed blob
 */
