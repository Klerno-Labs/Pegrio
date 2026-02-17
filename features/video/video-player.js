/* ========================================
   VIDEO PLAYER & MANAGER
   Background videos, testimonials, lazy loading
   ======================================== */

/**
 * Video Player Manager
 *
 * Features:
 * - Hero background videos (autoplay, muted, loop)
 * - Video testimonials (YouTube/Vimeo embed)
 * - Lazy loading for performance
 * - Fallback images for low bandwidth
 * - Responsive video sizing
 * - Accessibility controls
 */

class VideoPlayer {
    constructor() {
        this.videos = new Map();
        this.observers = new Map();
        this.isLowBandwidth = false;
        this.userPrefersReducedData = false;
    }

    /**
     * Initialize Video Player
     * Detect bandwidth and set up lazy loading
     */
    async init() {
        try {
            // Detect connection quality
            this.detectBandwidth();

            // Check user preferences
            this.checkUserPreferences();

            // Initialize background videos
            this.initBackgroundVideos();

            // Initialize lazy loading
            this.initLazyLoading();

            // Initialize testimonial videos
            this.initTestimonialVideos();

            // Setup accessibility controls
            this.setupAccessibilityControls();

            console.log('✅ Video Player initialized');

        } catch (error) {
            console.error('❌ Failed to initialize Video Player:', error);
        }
    }

    /**
     * Detect user's bandwidth
     * Use Network Information API if available
     */
    detectBandwidth() {
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

            if (connection) {
                // effectiveType: 'slow-2g', '2g', '3g', or '4g'
                const effectiveType = connection.effectiveType;
                this.isLowBandwidth = effectiveType === 'slow-2g' || effectiveType === '2g';

                // Listen for connection changes
                connection.addEventListener('change', () => {
                    const newType = connection.effectiveType;
                    const wasLowBandwidth = this.isLowBandwidth;
                    this.isLowBandwidth = newType === 'slow-2g' || newType === '2g';

                    if (wasLowBandwidth !== this.isLowBandwidth) {
                        console.log(`📡 Connection changed to ${newType}`);
                        this.handleBandwidthChange();
                    }
                });
            }
        }

        // Fallback: Check if saveData is enabled
        if ('connection' in navigator && navigator.connection.saveData) {
            this.isLowBandwidth = true;
            this.userPrefersReducedData = true;
        }
    }

    /**
     * Check user preferences
     * Respect prefers-reduced-motion and save-data
     */
    checkUserPreferences() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            console.log('⚡ User prefers reduced motion - limiting video autoplay');
        }

        // Check for save-data preference
        if (navigator.connection && navigator.connection.saveData) {
            this.userPrefersReducedData = true;
            console.log('💾 User has save-data enabled');
        }
    }

    /**
     * Initialize background videos
     * Autoplay, muted, loop videos for hero sections
     */
    initBackgroundVideos() {
        const backgroundVideos = document.querySelectorAll('.background-video');

        backgroundVideos.forEach((videoElement) => {
            const videoConfig = {
                element: videoElement,
                type: 'background',
                autoplay: true,
                muted: true,
                loop: true,
                fallbackImage: videoElement.dataset.fallback || null
            };

            // Don't autoplay if low bandwidth or reduced data
            if (this.isLowBandwidth || this.userPrefersReducedData) {
                this.showFallbackImage(videoElement);
                return;
            }

            // Setup video
            this.setupBackgroundVideo(videoElement);

            this.videos.set(videoElement, videoConfig);
        });
    }

    /**
     * Setup background video element
     * @param {HTMLVideoElement} video - Video element
     */
    setupBackgroundVideo(video) {
        // Ensure attributes are set
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.setAttribute('loop', '');
        video.setAttribute('autoplay', '');

        // Mute the video (required for autoplay in most browsers)
        video.muted = true;
        video.loop = true;

        // Play when ready
        video.addEventListener('loadeddata', () => {
            video.play().catch(error => {
                console.warn('Autoplay prevented:', error);
                this.showFallbackImage(video);
            });
        });

        // Show fallback on error
        video.addEventListener('error', () => {
            console.error('Video failed to load');
            this.showFallbackImage(video);
        });

        // Track if video is playing
        video.addEventListener('playing', () => {
            video.classList.add('is-playing');
            // Hide fallback image once video plays
            const fallback = video.parentElement.querySelector('.video-fallback');
            if (fallback) {
                fallback.style.opacity = '0';
                setTimeout(() => fallback.style.display = 'none', 300);
            }
        });
    }

    /**
     * Show fallback image when video can't play
     * @param {HTMLVideoElement} video - Video element
     */
    showFallbackImage(video) {
        const fallbackSrc = video.dataset.fallback;
        if (!fallbackSrc) return;

        const container = video.parentElement;
        let fallbackImg = container.querySelector('.video-fallback');

        if (!fallbackImg) {
            fallbackImg = document.createElement('div');
            fallbackImg.className = 'video-fallback';
            fallbackImg.style.backgroundImage = `url(${fallbackSrc})`;
            fallbackImg.style.backgroundSize = 'cover';
            fallbackImg.style.backgroundPosition = 'center';
            fallbackImg.style.position = 'absolute';
            fallbackImg.style.top = '0';
            fallbackImg.style.left = '0';
            fallbackImg.style.width = '100%';
            fallbackImg.style.height = '100%';
            fallbackImg.style.zIndex = '1';
            container.insertBefore(fallbackImg, video);
        }

        fallbackImg.style.display = 'block';
        fallbackImg.style.opacity = '1';
        video.style.display = 'none';
    }

    /**
     * Initialize lazy loading for videos
     * Load videos only when they're about to enter viewport
     */
    initLazyLoading() {
        const lazyVideos = document.querySelectorAll('video[data-src]');

        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        this.loadVideo(video);
                        videoObserver.unobserve(video);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            lazyVideos.forEach(video => {
                videoObserver.observe(video);
            });

            this.observers.set('lazy-videos', videoObserver);
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyVideos.forEach(video => this.loadVideo(video));
        }
    }

    /**
     * Load a lazy video
     * @param {HTMLVideoElement} video - Video element
     */
    loadVideo(video) {
        const src = video.dataset.src;
        if (!src) return;

        // Don't load if low bandwidth
        if (this.isLowBandwidth || this.userPrefersReducedData) {
            this.showFallbackImage(video);
            return;
        }

        // Set source
        video.src = src;
        video.load();

        // Remove data-src attribute
        delete video.dataset.src;

        console.log('📹 Loaded video:', src);
    }

    /**
     * Initialize testimonial videos
     * YouTube/Vimeo embeds with play button overlays
     */
    initTestimonialVideos() {
        const testimonialVideos = document.querySelectorAll('.testimonial-video');

        testimonialVideos.forEach(container => {
            const videoId = container.dataset.videoId;
            const platform = container.dataset.platform || 'youtube'; // 'youtube' or 'vimeo'

            if (!videoId) return;

            // Create thumbnail with play button
            this.createVideoThumbnail(container, videoId, platform);

            // Load video on click
            container.addEventListener('click', () => {
                this.loadTestimonialVideo(container, videoId, platform);
            });
        });
    }

    /**
     * Create video thumbnail with play button
     * @param {HTMLElement} container - Container element
     * @param {string} videoId - Video ID
     * @param {string} platform - 'youtube' or 'vimeo'
     */
    createVideoThumbnail(container, videoId, platform) {
        let thumbnailUrl;

        if (platform === 'youtube') {
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        } else if (platform === 'vimeo') {
            // Vimeo requires API call for thumbnail, use placeholder for now
            thumbnailUrl = container.dataset.thumbnail || '';
        }

        // Create thumbnail
        const thumbnail = document.createElement('div');
        thumbnail.className = 'video-thumbnail';
        thumbnail.style.backgroundImage = `url(${thumbnailUrl})`;
        thumbnail.innerHTML = `
            <div class="play-button">
                <svg width="68" height="48" viewBox="0 0 68 48">
                    <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                    <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                </svg>
            </div>
        `;

        container.appendChild(thumbnail);
    }

    /**
     * Load testimonial video (YouTube/Vimeo iframe)
     * @param {HTMLElement} container - Container element
     * @param {string} videoId - Video ID
     * @param {string} platform - 'youtube' or 'vimeo'
     */
    loadTestimonialVideo(container, videoId, platform) {
        // Remove thumbnail
        const thumbnail = container.querySelector('.video-thumbnail');
        if (thumbnail) {
            thumbnail.remove();
        }

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

        if (platform === 'youtube') {
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        } else if (platform === 'vimeo') {
            iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
        }

        container.appendChild(iframe);

        // Track event
        if (window.Analytics) {
            window.Analytics.trackEvent('Video_Played', {
                event_category: 'engagement',
                event_label: `${platform}:${videoId}`
            });
        }
    }

    /**
     * Handle bandwidth changes
     * Pause/resume videos based on connection
     */
    handleBandwidthChange() {
        if (this.isLowBandwidth) {
            // Pause all background videos
            this.videos.forEach((config, video) => {
                if (config.type === 'background' && !video.paused) {
                    video.pause();
                    this.showFallbackImage(video);
                }
            });
        } else {
            // Resume videos
            this.videos.forEach((config, video) => {
                if (config.type === 'background' && video.paused) {
                    const fallback = video.parentElement.querySelector('.video-fallback');
                    if (fallback) {
                        fallback.style.display = 'none';
                    }
                    video.style.display = 'block';
                    video.play();
                }
            });
        }
    }

    /**
     * Setup accessibility controls
     * Pause button for background videos
     */
    setupAccessibilityControls() {
        const backgroundVideos = document.querySelectorAll('.background-video');

        backgroundVideos.forEach(video => {
            const container = video.parentElement;

            // Create pause/play button
            const controlBtn = document.createElement('button');
            controlBtn.className = 'video-control-btn';
            controlBtn.setAttribute('aria-label', 'Pause background video');
            controlBtn.innerHTML = `
                <svg class="pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
                <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;

            controlBtn.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    controlBtn.querySelector('.pause-icon').style.display = 'block';
                    controlBtn.querySelector('.play-icon').style.display = 'none';
                    controlBtn.setAttribute('aria-label', 'Pause background video');
                } else {
                    video.pause();
                    controlBtn.querySelector('.pause-icon').style.display = 'none';
                    controlBtn.querySelector('.play-icon').style.display = 'block';
                    controlBtn.setAttribute('aria-label', 'Play background video');
                }
            });

            container.appendChild(controlBtn);
        });
    }

    /**
     * Pause all videos
     * Useful when opening modals, etc.
     */
    pauseAll() {
        this.videos.forEach((config, video) => {
            if (!video.paused) {
                video.pause();
            }
        });
    }

    /**
     * Resume all videos
     */
    resumeAll() {
        this.videos.forEach((config, video) => {
            if (config.autoplay && video.paused) {
                video.play().catch(() => {
                    // Autoplay prevented
                });
            }
        });
    }

    /**
     * Get video by element
     * @param {HTMLVideoElement} element - Video element
     * @returns {Object|null} Video configuration
     */
    getVideo(element) {
        return this.videos.get(element) || null;
    }
}

// Create singleton instance
const videoPlayer = new VideoPlayer();

// Make available globally
if (typeof window !== 'undefined') {
    window.VideoPlayer = videoPlayer;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = videoPlayer;
}

/* ========================================
   USAGE EXAMPLES
   ======================================== */

/**
 * Example 1: Background video in hero
 *
 * <div class="hero-video-container">
 *     <video class="background-video" data-fallback="/images/hero-fallback.jpg" muted loop playsinline>
 *         <source src="/videos/hero-background.mp4" type="video/mp4">
 *         <source src="/videos/hero-background.webm" type="video/webm">
 *     </video>
 *     <div class="hero-content">
 *         <h1>Hero Headline</h1>
 *     </div>
 * </div>
 */

/**
 * Example 2: Lazy-loaded video
 *
 * <video data-src="/videos/demo.mp4" data-fallback="/images/demo-thumb.jpg" controls></video>
 */

/**
 * Example 3: YouTube testimonial
 *
 * <div class="testimonial-video" data-video-id="dQw4w9WgXcQ" data-platform="youtube"></div>
 */

/**
 * Example 4: Vimeo testimonial
 *
 * <div class="testimonial-video" data-video-id="123456789" data-platform="vimeo" data-thumbnail="/images/vimeo-thumb.jpg"></div>
 */
