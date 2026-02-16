/* ========================================
   CHATBOT UI
   Rendering, DOM manipulation, user interactions
   ======================================== */

const ChatbotUI = {
    // DOM elements
    elements: {
        container: null,
        toggle: null,
        window: null,
        messages: null,
        input: null,
        sendBtn: null,
        quickReplies: null
    },

    // State
    isOpen: false,
    isTyping: false,

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Initialize chatbot UI
     */
    init() {
        this.createChatbotHTML();
        this.cacheElements();
        this.attachEventListeners();
        this.setupAccessibility();
    },

    /**
     * Create chatbot HTML structure
     */
    createChatbotHTML() {
        const html = `
            <div class="chatbot-container" id="chatbot-container">
                <!-- Toggle Button -->
                <button
                    class="chatbot-toggle pulse"
                    id="chatbot-toggle"
                    aria-label="Open chat"
                    aria-expanded="false"
                    aria-controls="chatbot-window"
                >
                    <svg class="chatbot-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    <span class="chatbot-toggle-badge" style="display: none;">1</span>
                </button>

                <!-- Chatbot Window -->
                <div class="chatbot-window" id="chatbot-window" role="dialog" aria-labelledby="chatbot-header-title">
                    <!-- Header -->
                    <div class="chatbot-header">
                        <div class="chatbot-header-content">
                            <div class="chatbot-avatar" aria-hidden="true">🤖</div>
                            <div class="chatbot-header-text">
                                <h3 id="chatbot-header-title">Website Assistant</h3>
                                <p>
                                    <span class="chatbot-status-dot" aria-hidden="true"></span>
                                    <span class="sr-only">Status: </span>Online
                                </p>
                            </div>
                        </div>
                        <button
                            class="chatbot-close-btn"
                            id="chatbot-close"
                            aria-label="Close chat"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Messages Area -->
                    <div
                        class="chatbot-messages"
                        id="chatbot-messages"
                        role="log"
                        aria-live="polite"
                        aria-atomic="false"
                    >
                        <!-- Messages will be inserted here -->
                    </div>

                    <!-- Quick Replies -->
                    <div class="chatbot-quick-replies" id="chatbot-quick-replies" role="group" aria-label="Quick reply options">
                        <!-- Quick reply buttons will be inserted here -->
                    </div>

                    <!-- Input Area -->
                    <div class="chatbot-input-area">
                        <input
                            type="text"
                            class="chatbot-input"
                            id="chatbot-input"
                            placeholder="Type your message..."
                            aria-label="Message input"
                            maxlength="500"
                        />
                        <button
                            class="chatbot-send-btn"
                            id="chatbot-send"
                            aria-label="Send message"
                            disabled
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    },

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements.container = document.getElementById('chatbot-container');
        this.elements.toggle = document.getElementById('chatbot-toggle');
        this.elements.window = document.getElementById('chatbot-window');
        this.elements.messages = document.getElementById('chatbot-messages');
        this.elements.input = document.getElementById('chatbot-input');
        this.elements.sendBtn = document.getElementById('chatbot-send');
        this.elements.quickReplies = document.getElementById('chatbot-quick-replies');
        this.elements.closeBtn = document.getElementById('chatbot-close');
    },

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Toggle button
        this.elements.toggle.addEventListener('click', () => this.toggleWindow());

        // Close button
        this.elements.closeBtn.addEventListener('click', () => this.closeWindow());

        // Send button
        this.elements.sendBtn.addEventListener('click', () => this.handleSend());

        // Input enter key
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });

        // Input change (enable/disable send button)
        this.elements.input.addEventListener('input', (e) => {
            this.elements.sendBtn.disabled = e.target.value.trim().length === 0;
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isOpen &&
                !this.elements.container.contains(e.target) &&
                !e.target.closest('.chatbot-container')) {
                // Don't close when clicking outside
                // this.closeWindow();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeWindow();
            }
        });
    },

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Trap focus within window when open
        this.elements.window.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.isOpen) {
                this.trapFocus(e);
            }
        });
    },

    /**
     * Trap focus within chatbot window
     * @param {Event} e - Keyboard event
     */
    trapFocus(e) {
        const focusableElements = this.elements.window.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    },

    // ========================================
    // WINDOW MANAGEMENT
    // ========================================

    /**
     * Toggle window open/close
     */
    toggleWindow() {
        if (this.isOpen) {
            this.closeWindow();
        } else {
            this.openWindow();
        }
    },

    /**
     * Open chatbot window
     */
    openWindow() {
        this.isOpen = true;
        this.elements.window.classList.add('open', 'opening');
        this.elements.toggle.classList.remove('pulse');
        this.elements.toggle.setAttribute('aria-expanded', 'true');
        this.elements.toggle.setAttribute('aria-label', 'Close chat');

        // Focus input after opening
        setTimeout(() => {
            this.elements.input.focus();
            this.elements.window.classList.remove('opening');
        }, 300);

        // Hide badge
        const badge = this.elements.toggle.querySelector('.chatbot-toggle-badge');
        if (badge) badge.style.display = 'none';

        // Scroll to bottom
        this.scrollToBottom();

        // Trigger open event (for chatbot core to handle)
        this.triggerEvent('chatbot:open');
    },

    /**
     * Close chatbot window
     */
    closeWindow() {
        this.isOpen = false;
        this.elements.window.classList.add('closing');
        this.elements.window.classList.remove('open');
        this.elements.toggle.setAttribute('aria-expanded', 'false');
        this.elements.toggle.setAttribute('aria-label', 'Open chat');

        setTimeout(() => {
            this.elements.window.classList.remove('closing');
        }, 300);

        // Trigger close event
        this.triggerEvent('chatbot:close');
    },

    // ========================================
    // MESSAGE RENDERING
    // ========================================

    /**
     * Add message to chat
     * @param {string} text - Message text
     * @param {string} role - 'bot' or 'user'
     * @param {Object} options - Additional options
     */
    addMessage(text, role = 'bot', options = {}) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${role}`;
        messageDiv.setAttribute('role', 'article');
        messageDiv.setAttribute('aria-label', `${role === 'bot' ? 'Bot' : 'You'}: ${text}`);

        const avatar = role === 'bot' ? '🤖' : '👤';
        const time = this.formatTime(new Date());

        messageDiv.innerHTML = `
            <div class="chatbot-message-avatar" aria-hidden="true">${avatar}</div>
            <div class="chatbot-message-content">
                <div class="chatbot-message-bubble">${this.formatMessageText(text)}</div>
                ${options.showTime !== false ? `<div class="chatbot-message-time">${time}</div>` : ''}
            </div>
        `;

        this.elements.messages.appendChild(messageDiv);
        this.scrollToBottom();

        // Trigger message event
        this.triggerEvent('chatbot:message', { text, role });
    },

    /**
     * Format message text (support markdown-like formatting)
     * @param {string} text
     * @returns {string}
     */
    formatMessageText(text) {
        // Support **bold**
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Support line breaks
        text = text.replace(/\n/g, '<br>');

        // Support links (simple)
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        return text;
    },

    /**
     * Format time
     * @param {Date} date
     * @returns {string}
     */
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    },

    /**
     * Show typing indicator
     */
    showTyping() {
        if (this.isTyping) return;

        this.isTyping = true;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chatbot-typing';
        typingDiv.id = 'chatbot-typing-indicator';
        typingDiv.setAttribute('role', 'status');
        typingDiv.setAttribute('aria-label', 'Bot is typing');

        typingDiv.innerHTML = `
            <div class="chatbot-message-avatar" aria-hidden="true">🤖</div>
            <div class="chatbot-typing-bubble">
                <div class="chatbot-typing-dot"></div>
                <div class="chatbot-typing-dot"></div>
                <div class="chatbot-typing-dot"></div>
            </div>
        `;

        this.elements.messages.appendChild(typingDiv);
        this.scrollToBottom();
    },

    /**
     * Hide typing indicator
     */
    hideTyping() {
        this.isTyping = false;

        const typingIndicator = document.getElementById('chatbot-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    },

    // ========================================
    // QUICK REPLIES
    // ========================================

    /**
     * Show quick reply buttons
     * @param {Array} replies - Array of reply options
     */
    showQuickReplies(replies) {
        if (!replies || replies.length === 0) {
            this.elements.quickReplies.innerHTML = '';
            return;
        }

        this.elements.quickReplies.innerHTML = '';

        replies.forEach((reply, index) => {
            const btn = document.createElement('button');
            btn.className = 'chatbot-quick-reply-btn';
            btn.textContent = reply.text || reply;
            btn.setAttribute('aria-label', `Quick reply: ${reply.text || reply}`);
            btn.style.animationDelay = `${index * 0.05}s`;

            btn.addEventListener('click', () => {
                this.handleQuickReply(reply);
            });

            this.elements.quickReplies.appendChild(btn);
        });
    },

    /**
     * Handle quick reply click
     * @param {Object|string} reply
     */
    handleQuickReply(reply) {
        const text = reply.text || reply;
        const value = reply.value || text;

        // Add user message
        this.addMessage(text, 'user');

        // Clear quick replies
        this.showQuickReplies([]);

        // Clear input
        this.elements.input.value = '';
        this.elements.sendBtn.disabled = true;

        // Trigger quick reply event
        this.triggerEvent('chatbot:quickreply', { text, value });
    },

    // ========================================
    // INPUT HANDLING
    // ========================================

    /**
     * Handle send button click
     */
    handleSend() {
        const text = this.elements.input.value.trim();

        if (text.length === 0) return;

        // Add user message
        this.addMessage(text, 'user');

        // Clear input
        this.elements.input.value = '';
        this.elements.sendBtn.disabled = true;

        // Trigger send event
        this.triggerEvent('chatbot:send', { text });
    },

    /**
     * Set input value
     * @param {string} value
     */
    setInputValue(value) {
        this.elements.input.value = value;
        this.elements.sendBtn.disabled = value.trim().length === 0;
    },

    /**
     * Disable/enable input
     * @param {boolean} disabled
     */
    setInputDisabled(disabled) {
        this.elements.input.disabled = disabled;
        if (disabled) {
            this.elements.sendBtn.disabled = true;
        }
    },

    // ========================================
    // UTILITY
    // ========================================

    /**
     * Scroll messages to bottom
     */
    scrollToBottom() {
        setTimeout(() => {
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
        }, 100);
    },

    /**
     * Clear all messages
     */
    clearMessages() {
        this.elements.messages.innerHTML = '';
    },

    /**
     * Show badge on toggle button
     * @param {number} count
     */
    showBadge(count = 1) {
        const badge = this.elements.toggle.querySelector('.chatbot-toggle-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = 'block';
            badge.classList.add('wiggle');

            setTimeout(() => {
                badge.classList.remove('wiggle');
            }, 1500);
        }
    },

    /**
     * Hide badge
     */
    hideBadge() {
        const badge = this.elements.toggle.querySelector('.chatbot-toggle-badge');
        if (badge) {
            badge.style.display = 'none';
        }
    },

    /**
     * Add custom HTML to messages
     * @param {string} html
     */
    addCustomHTML(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        this.elements.messages.appendChild(div);
        this.scrollToBottom();
    },

    /**
     * Show error message
     * @param {string} message
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chatbot-message bot chatbot-error';
        errorDiv.innerHTML = `
            <div class="chatbot-message-avatar" aria-hidden="true">⚠️</div>
            <div class="chatbot-message-content">
                <div class="chatbot-message-bubble">${message}</div>
            </div>
        `;

        this.elements.messages.appendChild(errorDiv);
        this.scrollToBottom();
    },

    /**
     * Trigger custom event
     * @param {string} eventName
     * @param {Object} detail
     */
    triggerEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: detail,
            bubbles: true,
            cancelable: true
        });

        this.elements.container.dispatchEvent(event);
    },

    /**
     * Add event listener
     * @param {string} eventName
     * @param {Function} handler
     */
    on(eventName, handler) {
        this.elements.container.addEventListener(eventName, handler);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChatbotUI;
}
