const CACHE_NAME = "ps5-web-os-shell-v1";
const SHELL_FILES = [
  "./",
  "./index.html",
  "./css/system.css",
  "./js/games.js",
  "./js/system.js",
  "./manifest.webmanifest",
  "./assets/ps5-mark.svg"
];


self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll(SHELL_FILES))
.then(() => self.skipWaiting())
);
});

self.addEventListener("activate", event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
).then(() => self.clients.claim())
);
});

self.addEventListener("fetch", event => {
const request = event.request;
if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
event.respondWith(
caches.match(request).then(cached => {
if (cached) return cached;
return fetch(request).then(response => {
if (response && response.ok) {
const copy = response.clone();
caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
}
return response;
}).catch(() => caches.match("./index.html"));
})
);
});
