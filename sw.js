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

  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Instalacja
self.addEventListener('install', event => {
  self.skipWaiting();    
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

// Obsługa zasobów cache first
self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then(cached => {
      return cached || fetch(request);
    })
  );
});
