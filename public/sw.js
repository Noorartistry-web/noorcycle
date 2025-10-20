// Minimal service worker for offline caching (very simple)
const CACHE_NAME = 'noorcycle-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assetsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (ev) => {
  ev.respondWith(
    caches.match(ev.request).then(resp => resp || fetch(ev.request))
  );
});
