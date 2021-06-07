// give your cache a name
const cacheName = 'offline-cache';

// put the static assets and routes you want to cache here
const filesToCache = [
  {
    method: 'GET',
    url: '/'
  },
  {
    method: 'GET',
    url: '/index.html'
  },
  {
    method: 'GET',
    url: '/favicon.ico'
  },
  {
    method: 'GET',
    url: '/manifest.json'
  },
  {
    method: 'GET',
    url: '/service-worker.js'
  },
  {
    method: 'GET',
    url: '/assets/js/script.js'
  },
  {
    method: 'GET',
    url: '/assets/css/style.css'
  }
];

// the event handler for the activate event
self.addEventListener('activate', e => self.clients.claim());

// the event handler for the install event 
// typically used to cache assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll( filesToCache.map((e) => e.url).flat() ))
  );
});

// the fetch event handler, to intercept requests and serve all 
// static assets from the cache
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(resp => {
        if( filesToCache.find(el => (e.request.url===self.origin+el.url) && (e.request.method===el.method)) ) //we need to cache this respose
        {
          return caches.open(cacheName).then((cache) => { 
            cache.put(e.request, resp.clone())        //caching the new version
            return resp
          })
        }
        else{
          return resp
        }
    })
    .catch(err => {
      console.log(err)
      return caches.match(e.request).then((cache_resp) => {
        return cache_resp ? cache_resp : (new Response('you are offline & cache is unavailble.'))
      })
    })
  )
});