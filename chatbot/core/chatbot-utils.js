/* ========================================
   CHATBOT UTILITIES
   Shared helper functions
   ======================================== */

const ChatbotUtils = {
    // ========================================
    // TEXT PROCESSING
    // ========================================

    /**
     * Tokenize text into individual words
     * @param {string} text - Input text
     * @returns {string[]} - Array of tokens
     */
    tokenize(text) {
        if (!text || typeof text !== 'string') return [];

        return text
            .toLowerCase()
            .replace(/[^\w\s'-]/g, ' ') // Keep apostrophes and hyphens
            .split(/\s+/)
            .filter(token => token.length > 0);
    },

    /**
     * Remove stopwords from token array
     * @param {string[]} tokens - Array of tokens
     * @returns {string[]} - Filtered tokens
     */
    removeStopwords(tokens) {
        const stopwords = new Set([
            'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
            'may', 'might', 'must', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
            'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their',
            'this', 'that', 'these', 'those', 'of', 'to', 'in', 'on', 'at', 'by', 'for',
            'with', 'from', 'as', 'into', 'about', 'and', 'or', 'but', 'if', 'then'
        ]);

        return tokens.filter(token => !stopwords.has(token));
    },

    /**
     * Generate n-grams from tokens
     * @param {string[]} tokens - Array of tokens
     * @param {number} n - N-gram size (2 for bigrams, 3 for trigrams)
     * @returns {string[]} - Array of n-grams
     */
    generateNGrams(tokens, n) {
        if (tokens.length < n) return [];

        const ngrams = [];
        for (let i = 0; i <= tokens.length - n; i++) {
            ngrams.push(tokens.slice(i, i + n).join(' '));
        }
        return ngrams;
    },

    /**
     * Calculate Levenshtein distance between two strings
     * @param {string} str1
     * @param {string} str2
     * @returns {number} - Edit distance
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    },

    /**
     * Calculate similarity ratio between two strings
     * @param {string} str1
     * @param {string} str2
     * @returns {number} - Similarity ratio (0-1)
     */
    similarityRatio(str1, str2) {
        const distance = this.levenshteinDistance(str1, str2);
        const maxLength = Math.max(str1.length, str2.length);
        return maxLength === 0 ? 1 : 1 - (distance / maxLength);
    },

    // ========================================
    // VALIDATION
    // ========================================

    /**
     * Validate email address
     * @param {string} email
     * @returns {boolean}
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate phone number
     * @param {string} phone
     * @returns {boolean}
     */
    isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    /**
     * Sanitize user input
     * @param {string} input
     * @returns {string}
     */
    sanitizeInput(input) {
        if (!input || typeof input !== 'string') return '';

        return input
            .trim()
            .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
            .replace(/<[^>]+>/g, '') // Remove HTML tags
            .substring(0, ChatbotConfig.NLP.MAX_INPUT_LENGTH); // Limit length
    },

    // ========================================
    // DATE & TIME
    // ========================================

    /**
     * Get current timestamp
     * @returns {number}
     */
    now() {
        return Date.now();
    },

    /**
     * Format timestamp to readable date
     * @param {number} timestamp
     * @returns {string}
     */
    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Calculate duration in seconds
     * @param {number} startTime
     * @param {number} endTime
     * @returns {number}
     */
    getDuration(startTime, endTime = Date.now()) {
        return Math.floor((endTime - startTime) / 1000);
    },

    // ========================================
    // UNIQUE IDS
    // ========================================

    /**
     * Generate UUID v4
     * @returns {string}
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * Generate short ID
     * @returns {string}
     */
    generateShortId() {
        return Math.random().toString(36).substring(2, 10);
    },

    // ========================================
    // ARRAY UTILITIES
    // ========================================

    /**
     * Get random item from array
     * @param {Array} array
     * @returns {*}
     */
    randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Shuffle array (Fisher-Yates algorithm)
     * @param {Array} array
     * @returns {Array}
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Remove duplicates from array
     * @param {Array} array
     * @returns {Array}
     */
    uniqueArray(array) {
        return [...new Set(array)];
    },

    // ========================================
    // NUMBER UTILITIES
    // ========================================

    /**
     * Format number as currency
     * @param {number} amount
     * @returns {string}
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Format number with commas
     * @param {number} num
     * @returns {string}
     */
    formatNumber(num) {
        return num.toLocaleString('en-US');
    },

    /**
     * Clamp number between min and max
     * @param {number} num
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    },

    // ========================================
    // OBJECT UTILITIES
    // ========================================

    /**
     * Deep clone object
     * @param {Object} obj
     * @returns {Object}
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Check if object is empty
     * @param {Object} obj
     * @returns {boolean}
     */
    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    },

    // ========================================
    // STORAGE
    // ========================================

    /**
     * Save to localStorage
     * @param {string} key
     * @param {*} value
     */
    saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    },

    /**
     * Load from localStorage
     * @param {string} key
     * @returns {*}
     */
    loadFromStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return null;
        }
    },

    /**
     * Remove from localStorage
     * @param {string} key
     */
    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Failed to remove from localStorage:', error);
        }
    },

    // ========================================
    // DEBOUNCE & THROTTLE
    // ========================================

    /**
     * Debounce function
     * @param {Function} func
     * @param {number} wait - Milliseconds
     * @returns {Function}
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function
     * @param {Function} func
     * @param {number} limit - Milliseconds
     * @returns {Function}
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // ========================================
    // DELAY
    // ========================================

    /**
     * Sleep/delay function
     * @param {number} ms - Milliseconds
     * @returns {Promise}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotUtils;
}
