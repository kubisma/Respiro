const CACHE_NAME = 'respiro-v1';

const APP_ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'favicon.ico',

  'css/style.css',
  'fonts/lato-regular.woff2',

  'src/app.js',
  'src/data.js',
  'src/dom.js',
  'src/features.js',
  'src/offline.js',
  'src/session.js',
  'src/sound.js',
  'src/state.js',
  'src/texts.js',
  'src/theme.js',
  'src/ui.js',

  'sounds/inhale.mp3',
  'sounds/hold.mp3',
  'sounds/exhale.mp3',
  'sounds/finish.mp3',
  'sounds/breathe.mp3',

  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Instalacja
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_ASSETS);
    })
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
    ).then(() => self.clients.claim())
  );
});

// Obsługa żądań
self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') return;
  const { request } = event;
  const url = request.url;

  if (url.includes('/sounds/') || url.includes('/fonts/') || url.includes('/icons/')) {
    event.respondWith(
      caches.match(request).then(response => {
        
        return response || fetch(request);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      const networkFetch = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    })
  );
});
