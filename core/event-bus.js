/* ========================================
   EVENT BUS
   Inter-module communication system
   ======================================== */

/**
 * EventBus for decoupled communication between features
 * Allows modules to emit and listen for events without direct dependencies
 *
 * Usage:
 *   EventBus.on('payment:success', (data) => console.log(data))
 *   EventBus.emit('payment:success', { orderId: 123 })
 *   EventBus.off('payment:success', callbackFunction)
 */

class EventBus {
    constructor() {
        this.events = {};
        this.eventHistory = [];
        this.maxHistorySize = 100;
        this.debug = false; // Set to true for debugging
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @param {Object} options - Subscription options
     * @returns {Function} Unsubscribe function
     */
    on(event, callback, options = {}) {
        if (!event || typeof callback !== 'function') {
            console.error('EventBus.on() requires event name and callback function');
            return () => {};
        }

        // Initialize event array if doesn't exist
        if (!this.events[event]) {
            this.events[event] = [];
        }

        // Create subscription object
        const subscription = {
            callback,
            once: options.once || false,
            priority: options.priority || 0,
            id: this.generateId()
        };

        // Add to events array, maintaining priority order
        this.events[event].push(subscription);
        this.events[event].sort((a, b) => b.priority - a.priority);

        if (this.debug) {
            console.log(`📡 EventBus: Subscribed to "${event}"`, subscription);
        }

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Subscribe to an event once
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    once(event, callback) {
        return this.on(event, callback, { once: true });
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
        if (!this.events[event]) return;

        if (callback) {
            // Remove specific callback
            this.events[event] = this.events[event].filter(
                sub => sub.callback !== callback
            );
        } else {
            // Remove all callbacks for this event
            delete this.events[event];
        }

        if (this.debug) {
            console.log(`📡 EventBus: Unsubscribed from "${event}"`);
        }
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     * @param {Object} options - Emit options
     */
    emit(event, data = null, options = {}) {
        if (!event) {
            console.error('EventBus.emit() requires event name');
            return;
        }

        // Add to history
        this.addToHistory(event, data);

        if (this.debug) {
            console.log(`📡 EventBus: Emitting "${event}"`, data);
        }

        // No subscribers
        if (!this.events[event] || this.events[event].length === 0) {
            if (this.debug) {
                console.log(`📡 EventBus: No subscribers for "${event}"`);
            }
            return;
        }

        // Create event object
        const eventObj = {
            name: event,
            data,
            timestamp: new Date(),
            stopped: false,
            stopPropagation() {
                this.stopped = true;
            }
        };

        // Call all subscribers
        const subscribers = [...this.events[event]]; // Clone to avoid modification during iteration

        for (const subscription of subscribers) {
            // Stop if propagation was stopped
            if (eventObj.stopped && !options.ignoreStop) {
                break;
            }

            try {
                subscription.callback(eventObj.data, eventObj);
            } catch (error) {
                console.error(`Error in event handler for "${event}":`, error);
            }

            // Remove one-time subscriptions
            if (subscription.once) {
                this.off(event, subscription.callback);
            }
        }
    }

    /**
     * Emit an event asynchronously
     * @param {string} event - Event name
     * @param {*} data - Event data
     * @returns {Promise<void>}
     */
    async emitAsync(event, data = null) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.emit(event, data);
                resolve();
            }, 0);
        });
    }

    /**
     * Check if an event has subscribers
     * @param {string} event - Event name
     * @returns {boolean}
     */
    hasSubscribers(event) {
        return !!(this.events[event] && this.events[event].length > 0);
    }

    /**
     * Get number of subscribers for an event
     * @param {string} event - Event name
     * @returns {number}
     */
    getSubscriberCount(event) {
        return this.events[event] ? this.events[event].length : 0;
    }

    /**
     * Get all event names
     * @returns {Array<string>}
     */
    getEventNames() {
        return Object.keys(this.events);
    }

    /**
     * Clear all subscribers for an event or all events
     * @param {string} event - Optional event name
     */
    clear(event = null) {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }

        if (this.debug) {
            console.log(`📡 EventBus: Cleared ${event || 'all events'}`);
        }
    }

    /**
     * Add event to history
     * @private
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    addToHistory(event, data) {
        this.eventHistory.unshift({
            event,
            data,
            timestamp: new Date()
        });

        // Limit history size
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory = this.eventHistory.slice(0, this.maxHistorySize);
        }
    }

    /**
     * Get event history
     * @param {number} limit - Max number of events to return
     * @returns {Array}
     */
    getHistory(limit = 20) {
        return this.eventHistory.slice(0, limit);
    }

    /**
     * Generate unique ID for subscription
     * @private
     * @returns {string}
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Enable debug mode
     */
    enableDebug() {
        this.debug = true;
        console.log('📡 EventBus: Debug mode enabled');
    }

    /**
     * Disable debug mode
     */
    disableDebug() {
        this.debug = false;
    }
}

// Create singleton instance
const eventBusInstance = new EventBus();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = eventBusInstance;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.EventBus = eventBusInstance;
}

/* ========================================
   COMMON EVENTS REFERENCE
   ======================================== */

/**
 * Standard event names (for documentation)
 *
 * PAYMENT EVENTS:
 * - payment:initiated { amount, package, email }
 * - payment:success { orderId, amount, customer }
 * - payment:failed { error, amount }
 * - subscription:created { subscriptionId, plan, customer }
 * - subscription:cancelled { subscriptionId, reason }
 *
 * AUTH EVENTS:
 * - auth:login { user, session }
 * - auth:logout { user }
 * - auth:signup { user }
 * - auth:error { error }
 *
 * FORM EVENTS:
 * - form:submit { formData, formId }
 * - form:success { response, formId }
 * - form:error { error, formId }
 *
 * MODAL EVENTS:
 * - modal:open { modalId, data }
 * - modal:close { modalId }
 *
 * CHAT EVENTS:
 * - chat:open
 * - chat:close
 * - chat:message { message, from }
 *
 * ANALYTICS EVENTS:
 * - analytics:pageview { page, params }
 * - analytics:event { eventName, properties }
 * - analytics:conversion { type, value }
 *
 * NOTIFICATION EVENTS:
 * - notification:show { message, type }
 * - notification:close { id }
 *
 * CRM EVENTS:
 * - crm:lead:created { leadData }
 * - crm:deal:updated { dealId, changes }
 *
 * PROJECT EVENTS:
 * - project:created { projectId, projectData }
 * - project:updated { projectId, changes }
 * - project:status:changed { projectId, oldStatus, newStatus }
 *
 * FILE EVENTS:
 * - file:upload:started { fileId, fileName }
 * - file:upload:progress { fileId, progress }
 * - file:upload:complete { fileId, url }
 * - file:upload:error { fileId, error }
 */
