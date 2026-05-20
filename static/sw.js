// Service Worker — المساعد الذكي
const CACHE = "medical-lab-v1";
const ASSETS = ["/", "/static/manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // Network first — always get fresh data from the API
  if (e.request.url.includes("/chat") ||
      e.request.url.includes("/exam") ||
      e.request.url.includes("/grade") ||
      e.request.url.includes("/admin")) {
    return; // don't intercept API calls
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
