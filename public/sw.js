// Service worker de Prospections Longrich : garde sur le téléphone les pages déjà ouvertes,
// pour pouvoir s'en servir sans internet (zones sans réseau).
// Les données (annonces, stocks, stockistes…) sont gardées à part par l'application (offlineCache).
const VERSION = "v1";
const PAGES = `lr-pages-${VERSION}`;
const STATIC = `lr-static-${VERSION}`;
const IMAGES = `lr-images-${VERSION}`;
const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/logo-longrich.png", "/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(PAGES).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("lr-") && !k.endsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Garde au plus `max` éléments dans un cache (les plus anciens partent).
async function trim(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

const cacheable = (res) => res && res.ok && !res.redirected && (res.type === "basic" || res.type === "default");

// Réseau d'abord, copie de secours ensuite.
async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(request);
    if (cacheable(res)) cache.put(request, res.clone());
    return res;
  } catch (err) {
    const saved = await cache.match(request, { ignoreSearch: request.mode === "navigate" });
    if (saved) return saved;
    if (fallbackUrl) return (await cache.match(fallbackUrl)) || Response.error();
    throw err;
  }
}

// Copie d'abord (fichiers qui ne changent jamais : le nom change à chaque mise à jour).
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const saved = await cache.match(request);
  if (saved) return saved;
  const res = await fetch(request);
  if (cacheable(res)) {
    cache.put(request, res.clone());
    trim(cacheName, 600);
  }
  return res;
}

// Copie tout de suite si on l'a, mise à jour en arrière-plan.
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const saved = await cache.match(request);
  const update = fetch(request)
    .then((res) => {
      if (res && (res.ok || res.type === "opaque")) {
        cache.put(request, res.clone());
        trim(cacheName, 250);
      }
      return res;
    })
    .catch(() => saved);
  return saved || update;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // actions, envois de formulaires : jamais mis de côté
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (request.destination === "image") {
    event.respondWith(staleWhileRevalidate(request, IMAGES));
    return;
  }
  if (!sameOrigin) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC));
    return;
  }
  // La session reste connue hors connexion : sinon la personne serait renvoyée vers la connexion.
  if (url.pathname === "/api/auth/session") {
    event.respondWith(networkFirst(request, PAGES));
    return;
  }
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, PAGES, OFFLINE_URL));
  }
});

// Préparer les pages principales (et leurs fichiers) pour qu'elles marchent hors connexion,
// même si la personne ne les a pas encore ouvertes.
self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "clear") {
    event.waitUntil(caches.open(PAGES).then((c) => c.delete("/api/auth/session")));
    return;
  }
  if (data.type !== "warm" || !Array.isArray(data.urls)) return;
  event.waitUntil(
    (async () => {
      const pages = await caches.open(PAGES);
      const statics = await caches.open(STATIC);
      for (const path of data.urls) {
        try {
          const res = await fetch(path, { credentials: "include" });
          if (!cacheable(res)) continue;
          const html = await res.clone().text();
          await pages.put(path, res);
          const assets = new Set(html.match(/\/_next\/static\/[^"'\s)\\]+/g) || []);
          for (const asset of assets) {
            if (await statics.match(asset)) continue;
            const a = await fetch(asset);
            if (cacheable(a)) await statics.put(asset, a);
          }
        } catch {
          // Pas de réseau : on réessaiera à la prochaine ouverture.
        }
      }
    })(),
  );
});
