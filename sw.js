const CACHE='scancheck-v23';
const ASSETS=['./','./index.html','./css/style.css','./js/app.js','./js/firebase.js','./js/logo.js','./qr-scanner.html','./manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.url.includes('firestore')||e.request.url.includes('firebase')||e.request.url.includes('nominatim')||e.request.url.includes('qrserver'))return;
  e.respondWith(caches.match(e.request).then(cached=>{
    if(cached)return cached;
    return fetch(e.request).then(res=>{
      if(!res||res.status!==200||res.type==='opaque')return res;
      const clone=res.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));return res;
    }).catch(()=>caches.match('./index.html'));
  }));
});
