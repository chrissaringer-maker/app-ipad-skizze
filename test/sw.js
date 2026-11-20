// Probeseite Stufe 0: hält die eigenen Dateien bereit, damit die App ohne Netz startet. Lädt nichts von anderen Adressen.
// Mit Netz kommt immer die neueste Fassung (erst Netz, dann Vorrat), damit eine verbesserte Probeseite sofort ankommt.
const NAME = "skizze-stufe0-v03";
const DATEIEN = ["./", "index.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(NAME).then((c) => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((n) => n !== NAME).map((n) => caches.delete(n)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then((antwort) => {
      const kopie = antwort.clone();
      caches.open(NAME).then((c) => c.put(e.request, kopie));
      return antwort;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
