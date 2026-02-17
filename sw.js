/* ========================================
   SERVICE WORKER - Progressive Web App
   Enables offline functionality and caching
   ======================================== */

const CACHE_NAME = 'pegrio-v1.0.0';
const RUNTIME_CACHE = 'pegrio-runtime';

// Files to cache immediately on install
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/analytics.js',
    '/manifest.json',
    '/chatbot/core/chatbot-config.js',
    '/chatbot/core/chatbot-core.js',
    '/chatbot/core/chatbot-utils.js',
    '/chatbot/ui/chatbot-ui.js',
    '/chatbot/ui/chatbot-premium.css',
    '/chatbot/ui/chatbot-animations.css'
];

// ========================================
// INSTALL - Cache core files
// ========================================

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// ========================================
// ACTIVATE - Clean up old caches
// ========================================

self.addEventListener('activate', event => {
    const currentCaches = [CACHE_NAME, RUNTIME_CACHE];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// ========================================
// FETCH - Network first, fallback to cache
// ========================================

self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Skip API calls (always go to network)
    if (event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return caches.open(RUNTIME_CACHE).then(cache => {
                return fetch(event.request).then(response => {
                    // Cache successful GET requests
                    if (event.request.method === 'GET' && response.status === 200) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                }).catch(() => {
                    // Offline fallback page
                    if (event.request.mode === 'navigate') {
                        return caches.match('/');
                    }
                });
            });
        })
    );
});

// ========================================
// BACKGROUND SYNC (future enhancement)
// ========================================

self.addEventListener('sync', event => {
    if (event.tag === 'sync-quotes') {
        event.waitUntil(syncQuotes());
    }
});

async function syncQuotes() {
    // TODO: Implement background sync for offline form submissions
    console.log('Background sync triggered');
}

// ========================================
// PUSH NOTIFICATIONS (optional)
// ========================================

self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'New update available!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Pegrio', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
