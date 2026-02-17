/* ========================================
   SUPABASE CLIENT
   Database, auth, and storage connection
   ======================================== */

/**
 * Supabase Client for database operations, authentication, and file storage
 * Uses @supabase/supabase-js library
 *
 * Installation: npm install @supabase/supabase-js
 */

// Import configuration
// Note: In production, this will use environment variables
const Config = typeof module !== 'undefined' && typeof require !== 'undefined'
    ? require('./config.js')
    : window.Config;

/**
 * Initialize Supabase client
 * This will be loaded dynamically when needed
 */
let supabaseClient = null;

const SupabaseClient = {
    /**
     * Initialize the Supabase client
     * @returns {Promise<Object>} Supabase client instance
     */
    async init() {
        if (supabaseClient) {
            return supabaseClient;
        }

        try {
            // Load Supabase library dynamically
            if (typeof window !== 'undefined') {
                // Browser environment
                const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');

                supabaseClient = createClient(
                    Config.supabase.url,
                    Config.supabase.anonKey,
                    {
                        auth: {
                            autoRefreshToken: true,
                            persistSession: true,
                            detectSessionInUrl: true
                        }
                    }
                );
            } else {
                // Node.js environment (for API routes)
                const { createClient } = require('@supabase/supabase-js');

                supabaseClient = createClient(
                    Config.supabase.url,
                    Config.supabase.serviceKey // Use service key for API routes
                );
            }

            console.log('✅ Supabase client initialized');
            return supabaseClient;
        } catch (error) {
            console.error('❌ Failed to initialize Supabase:', error);
            throw error;
        }
    },

    /**
     * Get current Supabase client instance
     * @returns {Object|null} Supabase client or null if not initialized
     */
    getClient() {
        return supabaseClient;
    },

    // ========================================
    // AUTHENTICATION METHODS
    // ========================================

    /**
     * Sign up a new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {Object} metadata - Additional user metadata
     * @returns {Promise<Object>} Auth response
     */
    async signUp(email, password, metadata = {}) {
        const client = await this.init();
        const { data, error } = await client.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign in an existing user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Auth response
     */
    async signIn(email, password) {
        const client = await this.init();
        const { data, error } = await client.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign out current user
     * @returns {Promise<void>}
     */
    async signOut() {
        const client = await this.init();
        const { error } = await client.auth.signOut();
        if (error) throw error;
    },

    /**
     * Get current user
     * @returns {Promise<Object|null>} Current user or null
     */
    async getCurrentUser() {
        const client = await this.init();
        const { data: { user } } = await client.auth.getUser();
        return user;
    },

    /**
     * Get current session
     * @returns {Promise<Object|null>} Current session or null
     */
    async getSession() {
        const client = await this.init();
        const { data: { session } } = await client.auth.getSession();
        return session;
    },

    /**
     * Send password reset email
     * @param {string} email - User email
     * @returns {Promise<void>}
     */
    async resetPassword(email) {
        const client = await this.init();
        const { error } = await client.auth.resetPasswordForEmail(email);
        if (error) throw error;
    },

    // ========================================
    // DATABASE METHODS
    // ========================================

    /**
     * Insert a new row
     * @param {string} table - Table name
     * @param {Object} data - Data to insert
     * @returns {Promise<Object>} Inserted row
     */
    async insert(table, data) {
        const client = await this.init();
        const { data: result, error } = await client
            .from(table)
            .insert(data)
            .select()
            .single();

        if (error) throw error;
        return result;
    },

    /**
     * Update a row
     * @param {string} table - Table name
     * @param {Object} data - Data to update
     * @param {Object} match - Match criteria
     * @returns {Promise<Object>} Updated row
     */
    async update(table, data, match) {
        const client = await this.init();
        const { data: result, error} = await client
            .from(table)
            .update(data)
            .match(match)
            .select()
            .single();

        if (error) throw error;
        return result;
    },

    /**
     * Delete a row
     * @param {string} table - Table name
     * @param {Object} match - Match criteria
     * @returns {Promise<void>}
     */
    async delete(table, match) {
        const client = await this.init();
        const { error } = await client
            .from(table)
            .delete()
            .match(match);

        if (error) throw error;
    },

    /**
     * Select rows
     * @param {string} table - Table name
     * @param {Object} options - Query options
     * @returns {Promise<Array>} Selected rows
     */
    async select(table, options = {}) {
        const client = await this.init();
        let query = client.from(table).select(options.columns || '*');

        // Apply filters
        if (options.match) {
            query = query.match(options.match);
        }

        // Apply ordering
        if (options.order) {
            query = query.order(options.order.column, {
                ascending: options.order.ascending !== false
            });
        }

        // Apply limit
        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    },

    /**
     * Select a single row
     * @param {string} table - Table name
     * @param {Object} match - Match criteria
     * @returns {Promise<Object|null>} Selected row or null
     */
    async selectOne(table, match) {
        const client = await this.init();
        const { data, error } = await client
            .from(table)
            .select('*')
            .match(match)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
        return data;
    },

    // ========================================
    // FILE STORAGE METHODS
    // ========================================

    /**
     * Upload a file
     * @param {string} bucket - Bucket name
     * @param {string} path - File path
     * @param {File|Blob} file - File to upload
     * @returns {Promise<string>} Public URL
     */
    async uploadFile(bucket, path, file) {
        const client = await this.init();
        const { data, error } = await client.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = client.storage
            .from(bucket)
            .getPublicUrl(path);

        return publicUrl;
    },

    /**
     * Delete a file
     * @param {string} bucket - Bucket name
     * @param {string} path - File path
     * @returns {Promise<void>}
     */
    async deleteFile(bucket, path) {
        const client = await this.init();
        const { error } = await client.storage
            .from(bucket)
            .remove([path]);

        if (error) throw error;
    },

    /**
     * Get file URL
     * @param {string} bucket - Bucket name
     * @param {string} path - File path
     * @returns {string} Public URL
     */
    async getFileUrl(bucket, path) {
        const client = await this.init();
        const { data } = client.storage
            .from(bucket)
            .getPublicUrl(path);

        return data.publicUrl;
    },

    // ========================================
    // REAL-TIME SUBSCRIPTIONS
    // ========================================

    /**
     * Subscribe to table changes
     * @param {string} table - Table name
     * @param {Function} callback - Callback function
     * @returns {Object} Subscription object
     */
    async subscribe(table, callback) {
        const client = await this.init();
        const subscription = client
            .channel(`public:${table}`)
            .on('postgres_changes',
                { event: '*', schema: 'public', table: table },
                callback
            )
            .subscribe();

        return subscription;
    },

    /**
     * Unsubscribe from changes
     * @param {Object} subscription - Subscription object
     * @returns {Promise<void>}
     */
    async unsubscribe(subscription) {
        const client = await this.init();
        await client.removeChannel(subscription);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseClient;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.SupabaseClient = SupabaseClient;
}
