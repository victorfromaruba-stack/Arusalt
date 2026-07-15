const CACHE_NAME = 'arusalt-v2';
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/site.webmanifest',
    '/arusalt-logo.png',
    '/arusalt-logo-192.png',
    '/arusalt-logo-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CORE_ASSETS))
            .catch(() => {})
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return; // leave Tailwind CDN / Google Fonts alone

    // CMS content and the CMS admin panel must always be fresh — never served stale from cache
    if (url.pathname.startsWith('/content/') || url.pathname.startsWith('/admin/')) {
        event.respondWith(fetch(request).catch(() => caches.match(request)));
        return;
    }

    // Network-first for the page itself, so a live edit shows up without needing a hard
    // refresh, with the cached copy as an offline fallback
    if (request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
        );
        return;
    }

    // Cache-first for everything else same-origin (images, manifest, icons) — these rarely change
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                return response;
            });
        })
    );
});
