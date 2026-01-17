const CACHE_NAME = 'respiro-cache-v1';

const APP_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',

  '/css/style.css',

  '/fonts/lato-regular.woff2',

  '/src/app.js',
  '/src/data.js',
  '/src/features.js',
  '/src/session.js',
  '/src/sound.js',
  '/src/state.js',
  '/src/theme.js',
  '/src/ui.js',

  '/sounds/inhale.mp3',
  '/sounds/hold.mp3',
  '/sounds/exhale.mp3',

  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Instalacja
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_ASSETS))      
  );
});

// Aktywacja
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );  
});

// Zasoby (cache first)
const isCacheFirstAsset = request => {
  const url = new URL(request.url);

  return (
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/sounds/') ||
    url.pathname.startsWith('/fonts/') ||
    url.pathname.match(/\.(png|mp3|woff2)$/)
  );
};

// Strategia cache first
const cacheFirst = request =>
  caches.match(request).then(cached => {
    if (cached) return cached;

    return fetch(request).then(response => {
      if (!response || response.status !== 200) return response;

      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, clone));

      return response;
    });
  });

// Strategia stale while revalidate
const staleWhileRevalidate = request =>
  caches.match(request).then(cached => {
    const fetchPromise = fetch(request)
      .then(response => {
        if (!response || response.status !== 200) return response;

        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));

        return response;
      })
      .catch(() => cached);

    return cached || fetchPromise;
  });

// Obsługa zasobów
self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isCacheFirstAsset(request)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});
