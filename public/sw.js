// GoldGroveco service worker — deliberately conservative. This app shows
// live balances and pending requests, so nothing dynamic (pages, /api/*) is
// ever cached or served stale. The only job here is: cache the static build
// assets so the app shell loads instantly on repeat visits, and show a
// friendly offline page if a navigation fails with no network at all.

const CACHE_VERSION = "ggc-static-v1";
const OFFLINE_URL = "/offline.html";

const PRECACHE_URLS = [OFFLINE_URL, "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never touch API calls or any cross-origin request — always live, never cached.
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  // Page navigations: go to the network for the real, current page; only
  // fall back to the offline page if there's truly no connection.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // Static build assets (hashed, immutable) and icons: cache-first.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        });
      }),
    );
  }
});

self.addEventListener("push", (event) => {
  let data = { title: "GoldGroveco", body: "You have a new notification.", url: "/dashboard" };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: data.url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  // Always open the Notifications page rather than the event's own deep
  // link — the whole point is that a dismissed/expired OS banner is never
  // the last chance to see the full message; it stays readable in-app.
  const url = "/dashboard/notifications";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (clientsList.length > 0 && "focus" in clientsList[0]) {
        clientsList[0].navigate(url);
        return clientsList[0].focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});
