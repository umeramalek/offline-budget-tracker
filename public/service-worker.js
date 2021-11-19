console.log("Service worker connected ")
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/styles.css",
    "/js/index.js",
    "/js/indexedDB.js",
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];
// 1. install
self.addEventListener("install", function(event){
    event.waitUntil(
        caches.open(DATA_CACHE_NAME).then((cache) => cache.add("/api/transaction")));
        event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
        //forces the waiting service worker to become the active service worker - reloads the service worke  
        self.skipWaiting();
});

//2. Clean Up / activate - Clear the CACHE of all items not matching in CACHE_NAME (old CACHE)
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    // Tells our new service worker to take over.
    self.clients.claim();
});

