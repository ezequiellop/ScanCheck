const CACHE='scancheck-v194';
const ASSETS=['./','./index.html','./css/style.css','./js/app.js','./js/firebase.js','./js/logo.js','./qr-scanner.html','./manifest.json',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>
    Promise.all(ASSETS.map(url=>
      c.add(url).catch(err=>console.warn('SW cache fail:',url,err))
    ))
  ).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.url.includes('firestore.googleapis')||e.request.url.includes('identitytoolkit')||
     e.request.url.includes('securetoken')||
     e.request.url.includes('nominatim')||e.request.url.includes('qrserver')||
     e.request.url.includes('fonts.googleapis')||e.request.url.includes('fonts.gstatic')||
     e.request.url.includes('accounts.google')||e.request.url.includes('sheets.googleapis')||
     e.request.url.includes('workers.dev'))return;
  e.respondWith(caches.match(e.request).then(cached=>{
    if(cached)return cached;
    return fetch(e.request).then(res=>{
      if(!res||res.status!==200||res.type==='opaque')return res;
      const clone=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
      return res;
    }).catch(()=>{
      if(e.request.mode==='navigate') return caches.match('./index.html');
      return new Response('', {status:503});
    });
  }));
});
