const CACHE='tm-trainer-v16';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const url=new URL(e.request.url);
 // De HTML-pagina altijd eerst vers ophalen; voorkom dat een oude gecachte
 // startpagina na een GitHub Pages-update de eerste start blokkeert.
 if(e.request.mode==='navigate' || url.pathname.endsWith('/index.html')){
  e.respondWith(fetch(e.request).then(res=>{
   const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res;
  }).catch(()=>caches.match(e.request).then(hit=>hit||caches.match('./index.html'))));
  return;
 }
 e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
  const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res;
 }).catch(()=>caches.match('./index.html'))));
});
