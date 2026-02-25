'use strict';

const CACHE_NAME = 'alcopilot-v1.0.4';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/beer.png',
  './icons/wine.png',
  './icons/shot.png',
];

/* Instalace — předcachovat všechny statické soubory */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* Aktivace — smazat staré cache */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* Fetch — stale-while-revalidate strategie
   Vrátí okamžitě z cache (rychlost), ale na pozadí stáhne čerstvou verzi
   a uloží do cache (aktuálnost při příštím načtení). */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request).then((response) => {
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => cached);   // offline fallback
        return cached || fetchPromise;
      })
    )
  );
});
