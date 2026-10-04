const CACHE_PREFIX = `auto-story-${self.registration.scope}-`;
const CACHE = `${CACHE_PREFIX}v2`;
const FILES = ['./', './index.html', './style.css', './app.js', './story.js', './settings.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || !url.href.startsWith(self.registration.scope)) return;
  // Only cache the published app shell, never story text or arbitrary requests.
  const known = FILES.some(file => new URL(file, self.registration.scope).href === url.href);
  if (event.request.mode !== 'navigate' && !known) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(event.request);
      if (response.ok && known) await cache.put(event.request, response.clone());
      if (response.ok) return response;
      const fallback = await cache.match(event.request);
      return fallback || response;
    } catch {
      const fallback = await cache.match(event.request) || (event.request.mode === 'navigate' ? await cache.match(new URL('./index.html', self.registration.scope)) : null);
      return fallback || Response.error();
    }
  })());
});
