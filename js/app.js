// ======== FIREBASE IMPORTS ========
import {
  fbRegister, fbLogin, fbLogout, fbOnAuthChange,
  fbSaveScan, fbGetMyScans, fbDeleteScan,
  fbSaveReport, fbUpdateReport, fbGetSignature, fbGetMyReports, fbGetAllReports, fbDeleteReport,
  fbUpdateLocation, fbWatchLocations, fbWatchAllReports,
  fbGetAllUsers
} from './firebase.js';

// ======== LOCAL STATE ========
let currentUser = null;
let currentPage = 'home';
let pageHistory = [];
let currentReport = null;
let viewingReportId = null;
let modalScanId = null;
let cameraStream = null;
let qrStream = null;
let capturedPhotos = [];
let currentOpType = 'mantenimiento';
let currentLocation = null;
let sigCanvas, sigCtx, sigDrawing = false, sigHasDraw = false;
let overlayTimer = null;
let qrScanning = false;
let localScans = [];
let localReports = [];
let unsubLocations = null;
let unsubReports = null;
let locationUpdateTimer = null;

// ======== INIT ========
window.addEventListener('DOMContentLoaded', () => {
  initSignatureCanvas();
  requestLocation();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  // Check if we returned from QR scanner page
  const qrResult = sessionStorage.getItem('scancheck_qr_result');
  if (qrResult) {
    sessionStorage.removeItem('scancheck_qr_result');
    // Process after app loads
    setTimeout(() => processQRData(qrResult), 1500);
  }

  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.classList.add('fade-out');
    setTimeout(() => splash.classList.add('hidden'), 600);
  }, 1800);

  // Firebase auth state listener — this is the main entry point
  fbOnAuthChange(user => {
    if (user) {
      currentUser = user;
      document.getElementById('login-page').classList.add('hidden');
      startApp();
    } else {
      currentUser = null;
      document.getElementById('app').classList.add('hidden');
      document.getElementById('login-page').classList.remove('hidden');
      setLoading('btn-login', false, 'Ingresar');
    }
  });
});

// ======== AUTH ========
async function doLogin() {
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pass  = document.getElementById('login-pass').value;
  clearLoginError();
  if (!email || !pass) { showLoginError('Completá todos los campos'); return; }
  setLoading('btn-login', true, 'Ingresando...');
  try {
    await fbLogin(email, pass);
    // onAuthChange handles the rest
  } catch(e) {
    setLoading('btn-login', false, 'Ingresar');
    showLoginError(firebaseErrorMsg(e.code));
  }
}
window.doLogin = doLogin;

async function doRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const pass  = document.getElementById('reg-pass').value;
  const role  = document.getElementById('reg-role').value;
  document.getElementById('reg-error').classList.add('hidden');
  if (!name || !email || !pass) { showRegError('Completá todos los campos'); return; }
  if (pass.length < 6) { showRegError('La contraseña debe tener al menos 6 caracteres'); return; }
  setLoading('btn-register', true, 'Creando cuenta...');
  try {
    await fbRegister(name, email, pass, role);
    // onAuthChange handles the rest
  } catch(e) {
    setLoading('btn-register', false, 'Crear cuenta');
    showRegError(firebaseErrorMsg(e.code));
  }
}
window.doRegister = doRegister;

async function doLogout() {
  toggleMenu();
  if (unsubLocations) unsubLocations();
  if (unsubReports) unsubReports();
  clearInterval(locationUpdateTimer);
  await fbLogout();
}
window.doLogout = doLogout;

function showLoginError(msg) { const e = document.getElementById('login-error'); e.textContent = msg; e.classList.remove('hidden'); }
function clearLoginError() { document.getElementById('login-error').classList.add('hidden'); }
function showRegError(msg) { const e = document.getElementById('reg-error'); e.textContent = msg; e.classList.remove('hidden'); }
function showRegister() { document.getElementById('login-form').classList.add('hidden'); document.getElementById('register-form').classList.remove('hidden'); }
function hideRegister() { document.getElementById('register-form').classList.add('hidden'); document.getElementById('login-form').classList.remove('hidden'); }
window.showRegister = showRegister;
window.hideRegister = hideRegister;
function togglePass() { const i = document.getElementById('login-pass'); i.type = i.type === 'password' ? 'text' : 'password'; }
window.togglePass = togglePass;

function firebaseErrorMsg(code) {
  const map = {
    'auth/user-not-found': 'No existe una cuenta con ese email',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese email',
    'auth/invalid-email': 'Email inválido',
    'auth/weak-password': 'La contraseña es muy débil',
    'auth/invalid-credential': 'Email o contraseña incorrectos',
    'auth/too-many-requests': 'Demasiados intentos. Esperá unos minutos.',
    'auth/network-request-failed': 'Sin conexión a internet'
  };
  return map[code] || 'Error: ' + (code || 'desconocido');
}

function setLoading(btnId, loading, text) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = text;
  btn.style.opacity = loading ? '0.7' : '1';
}

// ======== START APP ========
async function startApp() {
  document.getElementById('app').classList.remove('hidden');
  updateUserUI();
  updateHeroDate();
  setSyncStatus('syncing');

  try {
    await loadMyData();
    setSyncStatus('ok');
  } catch(e) {
    setSyncStatus('error');
  }

  updateStats();
  renderTodayList();
  showPage('home', false);
  startLocationTracking();

  // Supervisor: watch all reports live
  if (currentUser.role === 'supervisor') {
    unsubReports = fbWatchAllReports(reports => {
      localReports = reports;
      if (currentPage === 'supervisor') renderSupervisor();
    });
  }
}

async function loadMyData() {
  const [scans, reports] = await Promise.all([
    fbGetMyScans(currentUser.id),
    fbGetMyReports(currentUser.id)
  ]);
  localScans = scans;
  localReports = reports;
}

function updateUserUI() {
  if (!currentUser) return;
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('user-avatar').textContent = initials;
  document.getElementById('menu-user-name').textContent = currentUser.name;
  document.getElementById('menu-user-email').textContent = currentUser.email;
  document.getElementById('menu-user-role').textContent = currentUser.role === 'supervisor' ? 'Supervisor' : 'Técnico';
  if (currentUser.role === 'supervisor') document.getElementById('btn-supervisor-menu').classList.remove('hidden');
}

function setSyncStatus(state) {
  const dot = document.querySelector('.sync-dot');
  if (!dot) return;
  dot.style.background = state === 'ok' ? '#00d4aa' : state === 'syncing' ? '#ffa040' : '#ff5555';
}

// ======== LOCATION TRACKING ========
function requestLocation() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    currentLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude, acc: Math.round(pos.coords.accuracy) };
    reverseGeocode(currentLocation.lat, currentLocation.lon);
  }, () => {}, { enableHighAccuracy: true, timeout: 10000 });
}

async function reverseGeocode(lat, lon) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16`);
    const d = await r.json();
    if (currentLocation) currentLocation.address = d.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    if (currentUser) pushLocationToFirebase();
  } catch(e) {
    if (currentLocation) currentLocation.address = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  }
}

async function pushLocationToFirebase() {
  if (!currentUser || !currentLocation) return;
  try {
    await fbUpdateLocation(currentUser.id, currentUser.name, currentLocation.lat, currentLocation.lon, currentLocation.address || '');
  } catch(e) {}
}

function startLocationTracking() {
  // Update location every 3 minutes
  locationUpdateTimer = setInterval(() => {
    navigator.geolocation?.getCurrentPosition(pos => {
      currentLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude, acc: Math.round(pos.coords.accuracy) };
      reverseGeocode(currentLocation.lat, currentLocation.lon);
    }, () => {}, { enableHighAccuracy: false });
  }, 180000);
}

function getWatermarkLines() {
  const now = new Date();
  const fecha = now.toLocaleDateString('es-AR', { day:'2-digit', month:'short', year:'numeric' });
  const hora  = now.toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const coords = currentLocation ? `${currentLocation.lat.toFixed(6)}, ${currentLocation.lon.toFixed(6)}` : 'GPS no disponible';
  return [`${fecha}  ${hora}`, coords];
}

// ======== NAVIGATION ========
const pageTitles = {
  'home':'Inicio','new-scan':'Nuevo Registro','report':'Informe del Día',
  'view-report':'Ver Informe','history':'Historial',
  'supervisor':'Panel Supervisor','jira-config':'Configurar Jira'
};

function showPage(name, addHistory=true) {
  const current = document.getElementById('page-'+currentPage);
  const next    = document.getElementById('page-'+name);
  if (!next) return;
  if (current) current.classList.remove('active');
  next.classList.add('active');
  if (addHistory && name !== currentPage) pageHistory.push(currentPage);
  currentPage = name;
  document.getElementById('page-title').textContent = pageTitles[name] || name;
  document.getElementById('btn-back').classList.toggle('hidden', pageHistory.length === 0);
  if (name === 'home')       { updateStats(); renderTodayList(); }
  if (name === 'history')    renderHistory();
  if (name === 'new-scan')   resetNewScanForm();
  if (name === 'supervisor') renderSupervisor();
}
window.showPage = showPage;

function goBack() {
  if (!pageHistory.length) return;
  stopCamera(); stopQRScan();
  showPage(pageHistory.pop(), false);
}
window.goBack = goBack;

function toggleMenu() { document.getElementById('dropdown-menu').classList.toggle('hidden'); }
window.toggleMenu = toggleMenu;
document.addEventListener('click', e => {
  const m = document.getElementById('dropdown-menu');
  if (!m.classList.contains('hidden') && !e.target.closest('#dropdown-menu') && !e.target.closest('#header-user')) m.classList.add('hidden');
});

// ======== DATE / STATS ========
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function updateHeroDate() {
  const label = new Date().toLocaleDateString('es-AR', {weekday:'long',day:'numeric',month:'long',year:'numeric'});
  document.getElementById('hero-date').textContent = label.charAt(0).toUpperCase()+label.slice(1);
}
function updateStats() {
  const today = getTodayKey();
  const todayScans = localScans.filter(s => (s.timestamp||'').startsWith(today));
  document.getElementById('stat-today').textContent   = todayScans.length;
  document.getElementById('stat-total').textContent   = localScans.length;
  document.getElementById('stat-reports').textContent = localReports.length;
  document.getElementById('btn-close-day-wrap').classList.toggle('hidden', todayScans.length === 0);
}

// ======== TODAY LIST ========
function renderTodayList() {
  const today = getTodayKey();
  const scans = localScans.filter(s => (s.timestamp||'').startsWith(today)).slice().reverse();
  const container = document.getElementById('today-list');
  if (!scans.length) {
    container.innerHTML = `<div class="empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg><p>Sin registros hoy</p></div>`;
    return;
  }
  container.innerHTML = scans.map(s => {
    const time  = new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
    const thumb = s.photos?.[0] ? `<img src="${s.photos[0]}" alt="foto">` : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
    return `<div class="scan-item" onclick="viewScan('${s.id||s.fbId}')">
      <div class="scan-item-thumb">${thumb}</div>
      <div class="scan-item-info">
        <div class="scan-item-paso">${escHtml(s.paso||'(Sin nombre)')}</div>
        <div class="scan-item-meta">Puesto: ${escHtml(s.puesto||'—')} · Serie: ${escHtml(s.serie||'—')}</div>
        <span class="op-badge ${s.opType||'mantenimiento'}">${opLabel(s.opType)}</span>
      </div>
      <div class="scan-item-time">${time}</div>
      <div class="scan-item-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9,18 15,12 9,6"/></svg></div>
    </div>`;
  }).join('');
}

function opLabel(op) { return op==='instalacion'?'Instalación':op==='reemplazo'?'Reemplazo':'Mantenimiento'; }

// ======== OP TYPE ========
function setOpType(type, btn) {
  currentOpType = type;
  document.querySelectorAll('.op-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('reemplazo-fields').classList.toggle('hidden', type!=='reemplazo');
  document.getElementById('serie-normal-group').style.display = type==='reemplazo' ? 'none' : '';
}
window.setOpType = setOpType;

// ======== RESET FORM ========
function resetNewScanForm() {
  ['inp-paso','inp-puesto','inp-serie','inp-notas','inp-serie-retira','inp-serie-nuevo'].forEach(id => { const el=document.getElementById(id); if(el)el.value=''; });
  capturedPhotos = []; currentOpType = 'mantenimiento';
  document.querySelectorAll('.op-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector('.op-btn[data-op="mantenimiento"]').classList.add('active');
  document.getElementById('reemplazo-fields').classList.add('hidden');
  document.getElementById('serie-normal-group').style.display = '';
  document.getElementById('qr-data-preview').classList.add('hidden');
  renderPhotosGrid(); stopCamera(); stopQRScan();
}

// ======== PHOTOS ========
function renderPhotosGrid() {
  document.getElementById('photo-count-badge').textContent = `${capturedPhotos.length}/10`;
  document.getElementById('photos-grid').innerHTML = capturedPhotos.map((p,i)=>`
    <div class="photo-thumb"><img src="${p.dataUrl}" alt="foto ${i+1}">
    <button class="del-photo" onclick="removePhoto(${i})">×</button></div>`).join('');
  const btn = document.getElementById('btn-add-photo');
  btn.disabled = capturedPhotos.length >= 10;
  btn.style.opacity = capturedPhotos.length >= 10 ? '0.4' : '1';
}
window.removePhoto = i => { capturedPhotos.splice(i,1); renderPhotosGrid(); };

function handleFileUpload(e) {
  const files = Array.from(e.target.files).slice(0, 10-capturedPhotos.length);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 1280; let w=img.width, h=img.height;
        if (w>maxW) { h=Math.round(h*maxW/w); w=maxW; }
        canvas.width=w; canvas.height=h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0,w,h);
        drawWatermarkOnCanvas(ctx,w,h);
        capturedPhotos.push({ dataUrl:canvas.toDataURL('image/jpeg',0.82), info:getWatermarkLines().join(' | ') });
        renderPhotosGrid();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
  e.target.value='';
}
window.handleFileUpload = handleFileUpload;

// ======== CAMERA ========
async function startCamera() {
  if (capturedPhotos.length>=10) { showToast('Máximo 10 fotos','error'); return; }
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment',width:{ideal:1280},height:{ideal:960}}});
    const vid = document.getElementById('camera-stream');
    vid.srcObject = cameraStream; vid.classList.remove('hidden');
    document.getElementById('camera-controls').classList.remove('hidden');
    updateLiveOverlay();
    overlayTimer = setInterval(updateLiveOverlay, 1000);
    requestLocation();
  } catch(e) { showToast('No se pudo acceder a la cámara','error'); }
}
window.startCamera = startCamera;

function stopCamera() {
  if (cameraStream) { cameraStream.getTracks().forEach(t=>t.stop()); cameraStream=null; }
  clearInterval(overlayTimer); overlayTimer=null;
  const vid = document.getElementById('camera-stream');
  vid.classList.add('hidden'); vid.srcObject=null;
  document.getElementById('camera-controls').classList.add('hidden');
}
window.stopCamera = stopCamera;

function updateLiveOverlay() {
  const el = document.getElementById('cam-live-overlay');
  if (el) el.textContent = getWatermarkLines().join('\n');
}

function capturePhoto() {
  const vid = document.getElementById('camera-stream');
  const canvas = document.createElement('canvas');
  canvas.width=vid.videoWidth||1280; canvas.height=vid.videoHeight||960;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(vid,0,0,canvas.width,canvas.height);
  drawWatermarkOnCanvas(ctx,canvas.width,canvas.height);
  capturedPhotos.push({ dataUrl:canvas.toDataURL('image/jpeg',0.82), info:getWatermarkLines().join(' | ') });
  renderPhotosGrid();
  if (capturedPhotos.length>=10) stopCamera();
  showToast(`Foto ${capturedPhotos.length}/10 capturada`,'success');
}
window.capturePhoto = capturePhoto;

function drawWatermarkOnCanvas(ctx,w,h) {
  const lines=getWatermarkLines(), pad=12, lineH=18;
  const fontSize=Math.max(11,Math.min(15,w*0.011));
  const boxH=lines.length*lineH+pad*2;
  ctx.fillStyle='rgba(0,0,0,0.62)';
  ctx.fillRect(0,h-boxH,w,boxH);
  ctx.font=`${fontSize}px monospace`; ctx.fillStyle='rgba(255,255,255,0.92)'; ctx.textAlign='left';
  lines.forEach((l,i)=>ctx.fillText(l,pad,h-boxH+pad+(i+1)*lineH-3));
  ctx.fillStyle='#00d4aa'; ctx.fillRect(0,h-boxH,4,boxH);
}

// ======== QR SCAN ========
function startQRScan() {
  // Listen for result from the QR scanner window
  window.addEventListener('message', onQRMessage);

  // Also check sessionStorage in case we came back from the scanner page
  const stored = sessionStorage.getItem('scancheck_qr_result');
  if (stored) {
    sessionStorage.removeItem('scancheck_qr_result');
    processQRData(stored);
    return;
  }

  // Open the standalone QR scanner page (avoids ES module scope issues with jsQR)
  const scannerUrl = new URL('qr-scanner.html', window.location.href).href;
  const popup = window.open(scannerUrl, 'qr_scanner', 'width=400,height=700');

  // If popup was blocked, navigate in same tab
  if (!popup || popup.closed) {
    sessionStorage.setItem('scancheck_return_page', currentPage);
    window.location.href = scannerUrl;
  }
}
window.startQRScan = startQRScan;

function onQRMessage(event) {
  if (event.data && event.data.type === 'QR_DATA') {
    window.removeEventListener('message', onQRMessage);
    processQRData(event.data.data);
  } else if (event.data && event.data.type === 'QR_CANCEL') {
    window.removeEventListener('message', onQRMessage);
  }
}

function stopQRScan() {
  // QR scanning now handled by qr-scanner.html popup
  qrScanning = false;
}
window.stopQRScan = stopQRScan;

function scanQRFrame(vid) {
  if (!qrScanning) return;
  if (vid.readyState === vid.HAVE_ENOUGH_DATA) {
    const c = document.createElement('canvas');
    c.width  = vid.videoWidth  || 640;
    c.height = vid.videoHeight || 480;
    const ctx = c.getContext('2d');
    ctx.drawImage(vid, 0, 0, c.width, c.height);
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    // jsQR loaded as regular script — accessible via window.jsQR
    const jsQRFn = window.jsQR || (typeof jsQR !== 'undefined' ? jsQR : null);
    if (jsQRFn) {
      const code = jsQRFn(imgData.data, imgData.width, imgData.height, { inversionAttempts: 'dontInvert' });
      if (code && code.data) {
        processQRData(code.data);
        stopQRScan();
        return;
      }
    }
  }
  requestAnimationFrame(() => scanQRFrame(vid));
}

function processQRData(raw) {
  try {
    let data;
    try { data=JSON.parse(raw); } catch(e) {
      data={};
      raw.split('\n').forEach(line=>{ const [k,...v]=line.split('='); if(k&&v.length) data[k.trim()]=v.join('=').trim(); });
    }

    // Mapeo campos del inventario.ps1 de Danaide a campos del formulario
    const fieldMap = {
      // Puesto (nombre de PC)
      'NombrePC':    'inp-puesto',
      'ComputerName':'inp-puesto',
      'Hostname':    'inp-puesto',
      // Serie del scanner/PC
      'Serial':      'inp-serie',
      'SerialNumber':'inp-serie',
      // Notas: armar resumen con datos relevantes
    };
    Object.entries(fieldMap).forEach(([key,fid])=>{
      if(data[key]){ const el=document.getElementById(fid); if(el&&!el.value) el.value=data[key]; }
    });

    // Armar notas automáticas con info del sistema
    const notasEl = document.getElementById('inp-notas');
    if (notasEl && !notasEl.value) {
      const parts = [];
      if (data.Fabricante && data.Modelo) parts.push(`Equipo: ${data.Fabricante} ${data.Modelo}`);
      if (data.CPU)                        parts.push(`CPU: ${data.CPU} (${data.UsoCPU_Porcentaje}% uso)`);
      if (data.MemoriaTotal_GB)            parts.push(`RAM: ${data.MemoriaUsada_GB}/${data.MemoriaTotal_GB} GB (${data.UsoMemoria_Porcentaje}% uso)`);
      if (data.IP)                         parts.push(`IP: ${data.IP} | MAC: ${data.MAC}`);
      if (data.AssureID_Engine && data.AssureID_Engine !== 'No instalado') {
        parts.push(`AssureID Engine: v${data.AssureID_Engine}`);
        if (data.AssureID_DocLib && data.AssureID_DocLib !== 'No instalado') parts.push(`DocLib: v${data.AssureID_DocLib}`);
        if (data.AssureID_Edicion && data.AssureID_Edicion !== 'N/A')       parts.push(`Edición: ${data.AssureID_Edicion}`);
        if (data.AssureID_Vencimiento && data.AssureID_Vencimiento !== 'N/A') parts.push(`Lic. vence: ${data.AssureID_Vencimiento}`);
        if (data.AssureID_LicenseKey && data.AssureID_LicenseKey !== 'N/A') parts.push(`LicKey: ${data.AssureID_LicenseKey}`);
      }
      notasEl.value = parts.join('\n');
    }

    // Preview completo
    const preview = Object.entries(data).map(([k,v])=>`${k}: ${v}`).join('\n');
    const el = document.getElementById('qr-data-preview');
    el.textContent = preview; el.classList.remove('hidden');
    showToast(`✓ QR leído — ${Object.keys(data).length} campos`,'success');
  } catch(e) { showToast('No se pudo leer el QR','error'); }
}

// ======== SAVE SCAN ========
async function saveScan() {
  const paso  = document.getElementById('inp-paso').value.trim();
  const puesto= document.getElementById('inp-puesto').value.trim();
  const notas = document.getElementById('inp-notas').value.trim();
  if (!paso)   { showToast('Ingresá el nombre del paso','error'); return; }
  if (!puesto) { showToast('Ingresá el número de puesto','error'); return; }

  let serie='', serieRetira='', serieNuevo='';
  if (currentOpType==='reemplazo') {
    serieRetira=document.getElementById('inp-serie-retira').value.trim();
    serieNuevo =document.getElementById('inp-serie-nuevo').value.trim();
    if (!serieRetira||!serieNuevo) { showToast('Ingresá ambos números de serie','error'); return; }
    serie=serieNuevo;
  } else {
    serie=document.getElementById('inp-serie').value.trim();
    if (!serie) { showToast('Ingresá el número de serie','error'); return; }
  }

  const qrEl=document.getElementById('qr-data-preview');
  const pcData=!qrEl.classList.contains('hidden') ? qrEl.textContent : null;

  const scan = {
    id: 'sc_'+Date.now(),
    userId: currentUser.id,
    userName: currentUser.name,
    opType: currentOpType,
    paso, puesto, serie, serieRetira, serieNuevo, notas,
    photos: capturedPhotos.map(p=>p.dataUrl),
    pcData,
    lat: currentLocation?.lat||null,
    lon: currentLocation?.lon||null,
    address: currentLocation?.address||null,
    timestamp: new Date().toISOString()
  };

  stopCamera(); stopQRScan();
  localScans.push(scan);
  updateStats(); renderTodayList();
  showPage('home');
  showToast('✓ Scanner registrado','success');

  // Save to Firebase async
  setSyncStatus('syncing');
  try {
    await fbSaveScan(scan);
    setSyncStatus('ok');
  } catch(e) {
    setSyncStatus('error');
    showToast('Guardado local. Sin conexión','');
  }
}
window.saveScan = saveScan;

// ======== VIEW SCAN MODAL ========
function viewScan(id) {
  const scan = localScans.find(s=>(s.id===id||s.fbId===id));
  if (!scan) return;
  modalScanId = id;
  const photos = (scan.photos||[]).map(p=>`<img src="${p}" class="modal-photo" style="margin-bottom:6px" alt="foto">`).join('');
  document.getElementById('modal-scan-content').innerHTML = `
    ${photos||'<div style="height:70px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:12px;background:var(--bg3);border-radius:10px;margin-bottom:14px">Sin fotos</div>'}
    <div class="modal-fields">
      ${fTag('Paso',scan.paso)} ${fTag('Puesto',scan.puesto)}
      ${fTag('Serie',scan.serie)} ${fTag('Tipo',opLabel(scan.opType))}
      ${scan.serieRetira?fTag('Retira',scan.serieRetira):''} ${scan.serieNuevo?fTag('Nuevo',scan.serieNuevo):''}
    </div>
    ${scan.notas?`<div class="modal-notas">${escHtml(scan.notas)}</div>`:''}
    ${scan.pcData?`<div class="modal-notas" style="font-family:var(--mono);font-size:11px;color:var(--accent2)">${escHtml(scan.pcData)}</div>`:''}
    <div style="font-size:11px;color:var(--text3);font-family:var(--mono);margin-bottom:6px">${new Date(scan.timestamp).toLocaleString('es-AR')}</div>
    ${scan.address?`<div style="font-size:11px;color:var(--text3)">📍 ${escHtml(scan.address)}</div>`:''}
  `;
  document.getElementById('modal-scan').classList.remove('hidden');
}
window.viewScan = viewScan;

function fTag(label,val) { return val?`<div class="field-tag"><span>${label}</span><strong>${escHtml(val)}</strong></div>`:''; }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
window.closeModal = closeModal;

async function deleteScanFromModal() {
  if (!modalScanId) return;
  if (!confirm('¿Eliminar este registro?')) return;
  const scan = localScans.find(s=>(s.id===modalScanId||s.fbId===modalScanId));
  localScans = localScans.filter(s=>(s.id!==modalScanId&&s.fbId!==modalScanId));
  closeModal('modal-scan'); updateStats(); renderTodayList();
  showToast('Registro eliminado');
  if (scan?.fbId) { try { await fbDeleteScan(scan.fbId); } catch(e) {} }
}
window.deleteScanFromModal = deleteScanFromModal;

// ======== CLOSE DAY / REPORT ========
function closeDayReport() {
  const today = getTodayKey();
  const scans = localScans.filter(s=>(s.timestamp||'').startsWith(today));
  if (!scans.length) { showToast('No hay registros hoy','error'); return; }
  currentReport = { date:today, scanIds:scans.map(s=>s.id||s.fbId) };
  renderReportPage(scans, today);
  showPage('report');
}
window.closeDayReport = closeDayReport;

function renderReportPage(scans, dateKey) {
  const d     = new Date(dateKey+'T12:00:00');
  const label = d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  document.getElementById('report-date-label').textContent = label.charAt(0).toUpperCase()+label.slice(1);
  document.getElementById('report-count-label').textContent = `${scans.length} scanner${scans.length!==1?'s':''}`;
  document.getElementById('inp-inspector-name').value = '';
  document.getElementById('report-scan-list').innerHTML = scans.map((s,i)=>{
    const photos=(s.photos||[]);
    const strip=photos.length>0
      ?`<div class="report-photos-strip">${photos.map(p=>`<img src="${p}" alt="foto">`).join('')}</div>`
      :`<div style="height:50px;display:flex;align-items:center;justify-content:center;background:var(--bg3);color:var(--text3);font-size:12px">Sin fotos</div>`;
    return `<div class="report-item">
      <div class="report-item-header">
        <div class="report-item-num">${i+1}</div>
        <div class="report-item-title"><strong>${escHtml(s.paso||'—')}</strong>
          <small>Puesto ${escHtml(s.puesto||'—')} · Serie ${escHtml(s.serie||'—')}</small>
        </div>
        <span class="op-badge ${s.opType||'mantenimiento'}">${opLabel(s.opType)}</span>
      </div>
      ${strip}
      <div class="report-item-fields">
        ${fTag('Puesto',s.puesto)} ${fTag('N° Serie',s.serie)}
        ${s.serieRetira?fTag('Retira',s.serieRetira):''} ${s.serieNuevo?fTag('Nuevo',s.serieNuevo):''}
        ${fTag('Hora',new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'}))}
        ${fTag('GPS',s.lat?`${s.lat.toFixed(5)},${s.lon.toFixed(5)}`:'—')}
      </div>
      ${s.notas?`<div style="padding:0 14px 12px;font-size:12px;color:var(--text2)">${escHtml(s.notas)}</div>`:''}
    </div>`;
  }).join('');
  sigHasDraw=false;
  if(sigCtx) sigCtx.clearRect(0,0,sigCanvas.width,sigCanvas.height);
  document.getElementById('sig-hint').classList.remove('hidden');
}

// ======== SIGNATURE ========
function initSignatureCanvas() {
  sigCanvas=document.getElementById('sig-canvas');
  sigCtx=sigCanvas.getContext('2d');
  const getPos=e=>{ const r=sigCanvas.getBoundingClientRect(),sx=sigCanvas.width/r.width,sy=sigCanvas.height/r.height,src=e.touches?e.touches[0]:e; return{x:(src.clientX-r.left)*sx,y:(src.clientY-r.top)*sy}; };
  const start=e=>{ e.preventDefault();sigDrawing=true;const p=getPos(e);sigCtx.beginPath();sigCtx.moveTo(p.x,p.y);if(!sigHasDraw){sigHasDraw=true;document.getElementById('sig-hint').classList.add('hidden');} };
  const move=e=>{ e.preventDefault();if(!sigDrawing)return;const p=getPos(e);sigCtx.lineTo(p.x,p.y);sigCtx.strokeStyle='#00d4aa';sigCtx.lineWidth=2.5;sigCtx.lineCap='round';sigCtx.lineJoin='round';sigCtx.stroke(); };
  const end=e=>{ e.preventDefault();sigDrawing=false;sigCtx.beginPath(); };
  sigCanvas.addEventListener('mousedown',start);sigCanvas.addEventListener('mousemove',move);sigCanvas.addEventListener('mouseup',end);
  sigCanvas.addEventListener('touchstart',start,{passive:false});sigCanvas.addEventListener('touchmove',move,{passive:false});sigCanvas.addEventListener('touchend',end,{passive:false});
}
function clearSignature() { sigCtx.clearRect(0,0,sigCanvas.width,sigCanvas.height);sigHasDraw=false;document.getElementById('sig-hint').classList.remove('hidden'); }
window.clearSignature = clearSignature;

async function saveReport() {
  if (!sigHasDraw) { showToast('Por favor firmá el informe','error'); return; }
  const inspectorName=document.getElementById('inp-inspector-name').value.trim();
  if (!inspectorName) { showToast('Ingresá el nombre del inspector','error'); return; }
  if (!currentReport) return;

  const report = {
    id: 'rep_'+Date.now(),
    date: currentReport.date,
    scanIds: currentReport.scanIds,
    signature: sigCanvas.toDataURL('image/png'),
    inspectorName,
    technicianName: currentUser.name,
    technicianEmail: currentUser.email,
    userId: currentUser.id,
    createdAt: new Date().toISOString()
  };

  localReports.unshift(report);
  showToast('✓ Informe guardado','success');
  currentReport=null;
  showPage('history');

  setSyncStatus('syncing');
  try {
    const fbId = await fbSaveReport(report);
    const idx = localReports.findIndex(r=>r.id===report.id);
    if(idx>=0) localReports[idx].fbId=fbId;
    setSyncStatus('ok');
  } catch(e) {
    setSyncStatus('error');
    showToast('Guardado local. Sin conexión','');
  }
}
window.saveReport = saveReport;

// ======== HISTORY ========
function renderHistory() {
  const container=document.getElementById('history-list');
  if (!localReports.length) {
    container.innerHTML=`<div class="empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.3"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><p>Sin informes guardados</p></div>`;
    return;
  }
  container.innerHTML=localReports.map(rep=>{
    const d=new Date(rep.date+'T12:00:00');
    const label=d.toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
    const count=rep.scanIds.length;
    const jiraBadge=rep.jiraKey?`<span style="font-size:10px;background:rgba(0,174,255,.15);color:var(--accent2);padding:2px 8px;border-radius:8px;margin-left:6px;font-family:var(--mono)">${rep.jiraKey}</span>`:'';
    return `<div class="history-item" onclick="viewReport('${rep.id||rep.fbId}')">
      <div class="history-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg></div>
      <div class="history-info">
        <div class="history-date">${label}${jiraBadge}</div>
        <div class="history-meta">${count} scanner${count!==1?'s':''} · Inspector: ${escHtml(rep.inspectorName||'—')}</div>
        <div class="history-meta" style="color:var(--text3)">Técnico: ${escHtml(rep.technicianName||'—')}</div>
      </div>
      <div class="history-badge">${count}</div>
    </div>`;
  }).join('');
}

// ======== VIEW REPORT ========
async function viewReport(id) {
  const rep = localReports.find(r=>(r.id===id||r.fbId===id));
  if (!rep) return;
  viewingReportId = id;
  let sig = rep.signature;
  if (!sig && rep.fbId) {
    try { sig = await fbGetSignature(rep.fbId); } catch(e) {}
  }
  const scans = localScans.filter(s=>rep.scanIds.includes(s.id||s.fbId));
  const d=new Date(rep.date+'T12:00:00');
  const label=d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const scanRows=scans.map((s,i)=>{
    const photos=(s.photos||[]).map(p=>`<img src="${p}" style="width:100%;border-radius:8px;margin:6px 0;display:block">`).join('');
    return `<div style="border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:10px;background:var(--bg3)">
      <div style="font-size:13px;font-weight:600;color:var(--accent);margin-bottom:4px">${i+1}. ${escHtml(s.paso||'—')} <span class="op-badge ${s.opType||'mantenimiento'}">${opLabel(s.opType)}</span></div>
      ${photos}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;font-family:var(--mono)">
        <div style="color:var(--text2)">Puesto: <span style="color:var(--text)">${escHtml(s.puesto||'—')}</span></div>
        <div style="color:var(--text2)">Serie: <span style="color:var(--text)">${escHtml(s.serie||'—')}</span></div>
        ${s.serieRetira?`<div style="color:var(--text2)">Retira: <span style="color:var(--warning)">${escHtml(s.serieRetira)}</span></div>`:''}
        ${s.serieNuevo?`<div style="color:var(--text2)">Nuevo: <span style="color:var(--accent)">${escHtml(s.serieNuevo)}</span></div>`:''}
        ${s.lat?`<div style="color:var(--text3);font-size:10px;grid-column:1/-1">📍 ${s.lat.toFixed(6)}, ${s.lon.toFixed(6)}</div>`:''}
      </div>
      ${s.notas?`<div style="font-size:12px;color:var(--text2);margin-top:8px;border-top:1px solid var(--border);padding-top:8px">${escHtml(s.notas)}</div>`:''}
    </div>`;
  }).join('');
  document.getElementById('view-report-content').innerHTML=`
    <div class="vr-title">Informe de Visita</div>
    <div class="vr-sub">${label} · ${scans.length} scanner${scans.length!==1?'s':''}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${fTag('Técnico',rep.technicianName)} ${fTag('Inspector',rep.inspectorName)}
    </div>
    ${rep.jiraKey?`<div style="font-size:12px;color:var(--accent2);background:rgba(0,174,255,.1);padding:8px 12px;border-radius:8px;margin-bottom:12px;font-family:var(--mono)">🔗 Jira: ${rep.jiraKey}</div>`:''}
    ${scanRows}
    <div class="vr-sig-label">Firma del Inspector — ${escHtml(rep.inspectorName||'')}</div>
    ${sig?`<img src="${sig}" class="vr-sig-img" alt="Firma">`:'<div style="color:var(--text3);font-size:12px">Sin firma guardada</div>'}
  `;
  showPage('view-report');
}
window.viewReport = viewReport;

async function deleteReport() {
  if (!viewingReportId) return;
  if (!confirm('¿Eliminar este informe permanentemente?')) return;
  const rep=localReports.find(r=>(r.id===viewingReportId||r.fbId===viewingReportId));
  localReports=localReports.filter(r=>(r.id!==viewingReportId&&r.fbId!==viewingReportId));
  showToast('Informe eliminado'); goBack();
  if (rep?.fbId) { try { await fbDeleteReport(rep.fbId); } catch(e) {} }
}
window.deleteReport = deleteReport;

// ======== PDF EXPORT ========
async function downloadReportPDF() {
  const rep=localReports.find(r=>(r.id===viewingReportId||r.fbId===viewingReportId));
  if (!rep) return;
  showToast('Generando PDF...','success');
  try {
    const {jsPDF}=window.jspdf;
    const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
    const W=210, M=15; let y=M;
    doc.setFillColor(15,32,39); doc.rect(0,0,W,28,'F');
    doc.setTextColor(0,212,170); doc.setFontSize(18); doc.setFont('helvetica','bold');
    doc.text('ScanCheck',M,12);
    doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(139,175,196);
    doc.text('Control de Mantenimiento Preventivo — Danaide Enterprise',M,18);
    const d=new Date(rep.date+'T12:00:00');
    const label=d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    doc.setTextColor(200,220,230); doc.setFontSize(8);
    doc.text(label.charAt(0).toUpperCase()+label.slice(1),W-M,12,{align:'right'});
    doc.text(`Generado: ${new Date().toLocaleString('es-AR')}`,W-M,18,{align:'right'});
    y=34;
    doc.setFillColor(22,36,54); doc.roundedRect(M,y,W-M*2,20,3,3,'F');
    const infoItems=[['Técnico',rep.technicianName||'—'],['Inspector',rep.inspectorName||'—'],['Dispositivos',String(rep.scanIds.length)],['Jira',rep.jiraKey||'Pendiente']];
    infoItems.forEach(([lbl,val],i)=>{
      const cx=M+4+(i*(W-M*2)/4);
      doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(74,106,125); doc.text(lbl,cx,y+7);
      doc.setFont('helvetica','normal'); doc.setTextColor(232,244,248); doc.text(val,cx,y+14);
    });
    y+=26;
    const scans=localScans.filter(s=>rep.scanIds.includes(s.id||s.fbId));
    for (let i=0;i<scans.length;i++) {
      const s=scans[i];
      if (y>252){doc.addPage();y=M;}
      doc.setFillColor(30,51,71); doc.roundedRect(M,y,W-M*2,9,2,2,'F');
      doc.setFillColor(0,212,170); doc.circle(M+5,y+4.5,3,'F');
      doc.setFont('helvetica','bold'); doc.setFontSize(8); doc.setTextColor(15,32,39);
      doc.text(String(i+1),M+5,y+5.5,{align:'center'});
      doc.setTextColor(232,244,248); doc.text(s.paso||'—',M+11,y+5.5);
      const opCol=s.opType==='instalacion'?[0,174,255]:s.opType==='reemplazo'?[255,160,64]:[0,212,170];
      doc.setTextColor(...opCol); doc.text(opLabel(s.opType),W-M-2,y+5.5,{align:'right'});
      y+=11;
      doc.setFillColor(22,36,54); doc.roundedRect(M,y,W-M*2,12,2,2,'F');
      const cols=[['PUESTO',s.puesto],['SERIE',s.serie],['HORA',new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})],['GPS',s.lat?`${s.lat.toFixed(4)},${s.lon.toFixed(4)}`:'—']];
      cols.forEach(([lbl,val],ci)=>{
        const cx=M+4+ci*((W-M*2)/4);
        doc.setFontSize(6.5); doc.setFont('helvetica','bold'); doc.setTextColor(74,106,125); doc.text(lbl,cx,y+5);
        doc.setFont('helvetica','normal'); doc.setTextColor(232,244,248); doc.text(String(val||'—'),cx,y+10);
      });
      y+=14;
      if (s.serieRetira) {
        doc.setFillColor(30,20,10); doc.roundedRect(M,y,W-M*2,9,2,2,'F');
        doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(255,160,64); doc.text('RETIRA:',M+4,y+5.5);
        doc.setFont('helvetica','normal'); doc.setTextColor(232,244,248); doc.text(s.serieRetira,M+22,y+5.5);
        doc.setFont('helvetica','bold'); doc.setTextColor(0,212,170); doc.text('NUEVO:',W/2,y+5.5);
        doc.setFont('helvetica','normal'); doc.setTextColor(232,244,248); doc.text(s.serieNuevo||'—',W/2+18,y+5.5);
        y+=11;
      }
      const photos=s.photos||[];
      if (photos.length>0) {
        const pw=(W-M*2-8)/Math.min(photos.length,3), ph=pw*0.6;
        if(y+ph>275){doc.addPage();y=M;}
        for(let pi=0;pi<Math.min(photos.length,3);pi++) {
          try { doc.addImage(photos[pi],'JPEG',M+pi*(pw+4),y,pw,ph,'','FAST'); } catch(e){}
        }
        y+=ph+3;
        if(photos.length>3){doc.setFontSize(7);doc.setTextColor(74,106,125);doc.text(`+${photos.length-3} fotos más`,M,y);y+=4;}
      }
      if(s.notas){const ls=doc.splitTextToSize(s.notas,W-M*2-8);doc.setFontSize(7.5);doc.setFont('helvetica','italic');doc.setTextColor(139,175,196);doc.text(ls,M+4,y+3);y+=ls.length*4+4;}
      y+=4;
    }
    doc.addPage(); y=M;
    doc.setFillColor(15,32,39); doc.rect(0,0,W,14,'F');
    doc.setFontSize(10); doc.setFont('helvetica','bold'); doc.setTextColor(0,212,170);
    doc.text('Firma del Inspector Responsable',M,9);
    y=20;
    doc.setFontSize(9); doc.setFont('helvetica','normal'); doc.setTextColor(139,175,196);
    doc.text(`Inspector: ${rep.inspectorName||'—'}`,M,y); y+=6;
    doc.text(`Técnico:   ${rep.technicianName||'—'}`,M,y); y+=6;
    doc.text(`Fecha:     ${label}`,M,y); y+=10;
    let sig=rep.signature;
    if(!sig&&rep.fbId){try{sig=await fbGetSignature(rep.fbId);}catch(e){}}
    if(sig){try{doc.addImage(sig,'PNG',M,y,80,34);doc.setDrawColor(0,212,170);doc.setLineWidth(0.3);doc.rect(M,y,80,34);}catch(e){}}
    y+=40;
    doc.setFontSize(7); doc.setTextColor(74,106,125);
    doc.text(`Documento generado por ScanCheck — Danaide Enterprise — ${new Date().toLocaleString('es-AR')}`,M,y);
    doc.save(`informe-scancheck-${rep.date}.pdf`);
    showToast('✓ PDF descargado','success');
  } catch(e) { showToast('Error al generar PDF','error'); console.error(e); }
}
window.downloadReportPDF = downloadReportPDF;

// ======== JIRA ========
function loadJiraConfig() { try{return JSON.parse(localStorage.getItem('scancheck_jira')||'{}');}catch(e){return {};} }
function saveJiraConfig() {
  const cfg={domain:'danaide-enterprise.atlassian.net',email:document.getElementById('jira-email').value.trim(),token:document.getElementById('jira-token').value.trim(),project:document.getElementById('jira-project').value.trim().toUpperCase()};
  if(!cfg.email||!cfg.token||!cfg.project){showToast('Completá todos los campos','error');return;}
  localStorage.setItem('scancheck_jira',JSON.stringify(cfg));
  showToast('✓ Configuración Jira guardada','success'); goBack();
}
window.saveJiraConfig = saveJiraConfig;

async function sendToJira() {
  const cfg=loadJiraConfig();
  if(!cfg.token||!cfg.email||!cfg.project){showToast('Configurá Jira primero','error');showPage('jira-config');return;}
  const rep=localReports.find(r=>(r.id===viewingReportId||r.fbId===viewingReportId));
  if(!rep) return;
  const scans=localScans.filter(s=>rep.scanIds.includes(s.id||s.fbId));
  const d=new Date(rep.date+'T12:00:00');
  const dateLabel=d.toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'});
  const auth=btoa(`${cfg.email}:${cfg.token}`);
  const base=`https://${cfg.domain}`;
  showToast('Enviando a Jira...','success');
  const mkDoc=(text)=>({version:1,type:'doc',content:[{type:'paragraph',content:[{type:'text',text}]}]});
  try {
    const issueRes=await fetch(`${base}/rest/api/3/issue`,{method:'POST',headers:{'Authorization':`Basic ${auth}`,'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({fields:{project:{key:cfg.project},summary:`Informe ScanCheck — ${dateLabel} — ${rep.technicianName}`,description:mkDoc(`Técnico: ${rep.technicianName}\nInspector: ${rep.inspectorName}\nDispositivos: ${scans.length}`),issuetype:{name:'Task'}}})});
    if(!issueRes.ok){const err=await issueRes.text();showJiraError(err);return;}
    const issue=await issueRes.json();
    const parentKey=issue.key;
    const subtaskKeys=[];
    for(const s of scans){
      const sr=await fetch(`${base}/rest/api/3/issue`,{method:'POST',headers:{'Authorization':`Basic ${auth}`,'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({fields:{project:{key:cfg.project},parent:{key:parentKey},summary:`[${opLabel(s.opType)}] Puesto ${s.puesto} — Serie ${s.serie}`,
          description:mkDoc(`Paso: ${s.paso}\nPuesto: ${s.puesto}\nSerie: ${s.serie}\nTipo: ${opLabel(s.opType)}${s.serieRetira?`\nRetira: ${s.serieRetira}\nNuevo: ${s.serieNuevo}`:''}\nHora: ${new Date(s.timestamp).toLocaleString('es-AR')}${s.lat?`\nGPS: ${s.lat.toFixed(6)}, ${s.lon.toFixed(6)}`:''}`),
          issuetype:{name:'Subtask'}}})});
      if(sr.ok){const st=await sr.json();subtaskKeys.push(st.key);}
    }
    // Update report with Jira key
    const idx=localReports.findIndex(r=>(r.id===viewingReportId||r.fbId===viewingReportId));
    if(idx>=0){localReports[idx].jiraKey=parentKey;}
    if(rep.fbId){try{await fbUpdateReport(rep.fbId,{jiraKey:parentKey});}catch(e){}}
    document.getElementById('modal-jira-content').innerHTML=`
      <div style="text-align:center;padding:16px 0">
        <div style="font-size:36px;margin-bottom:10px">✅</div>
        <div style="font-size:15px;font-weight:700;color:var(--accent);margin-bottom:6px">Ticket creado en Jira</div>
        <div style="font-size:24px;font-weight:700;font-family:var(--mono);color:var(--text);margin-bottom:6px">${parentKey}</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:12px">${subtaskKeys.length} subtareas creadas</div>
        <div style="font-size:11px;font-family:var(--mono);color:var(--text3);background:var(--bg3);padding:8px;border-radius:8px">${subtaskKeys.join(' · ')}</div>
        <a href="${base}/browse/${parentKey}" target="_blank" style="display:inline-block;margin-top:16px;padding:12px 24px;background:var(--accent);color:#0a1628;border-radius:12px;font-weight:700;text-decoration:none;font-size:14px">Abrir en Jira →</a>
      </div>`;
    document.getElementById('modal-jira').classList.remove('hidden');
    showToast(`✓ Jira: ${parentKey}`,'success');
  } catch(e) { showJiraError(e.message); }
}
window.sendToJira = sendToJira;

function showJiraError(msg) {
  document.getElementById('modal-jira-content').innerHTML=`<div style="text-align:center;padding:16px 0"><div style="font-size:32px;margin-bottom:10px">❌</div><div style="font-size:15px;font-weight:600;color:var(--danger);margin-bottom:8px">Error al conectar con Jira</div><div style="font-size:11px;color:var(--text2);background:var(--bg3);padding:12px;border-radius:8px;font-family:var(--mono);text-align:left;word-break:break-all">${escHtml(msg)}</div><button class="btn-secondary" style="margin-top:12px" onclick="showPage('jira-config');closeModal('modal-jira')">Revisar configuración</button></div>`;
  document.getElementById('modal-jira').classList.remove('hidden');
}

// ======== SUPERVISOR ========
function supTab(tab, btn) {
  document.querySelectorAll('.sup-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  ['informes','tecnicos','mapa'].forEach(t=>document.getElementById('sup-'+t).classList.toggle('hidden',t!==tab));
  if (tab==='mapa') startLiveMap();
}
window.supTab = supTab;

let liveMapStarted=false;
async function renderSupervisor() {
  // Informes
  let allReports=localReports;
  try { allReports=await fbGetAllReports(); } catch(e) {}
  const supList=document.getElementById('sup-informes-list');
  if(!allReports.length) { supList.innerHTML=`<div class="empty-state"><p>Sin informes</p></div>`; }
  else {
    supList.innerHTML=allReports.map(rep=>{
      const d=new Date(rep.date+'T12:00:00');
      const label=d.toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
      const count=rep.scanIds?.length||0;
      return `<div class="sup-card" onclick="viewReportSupervisor('${rep.fbId||rep.id}')">
        <div class="sup-card-top">
          <div><div class="sup-card-title">${escHtml(rep.technicianName||'—')}</div>
            <div class="sup-card-meta">${label} · ${count} dispositivo${count!==1?'s':''}</div>
            <div class="sup-card-meta">Inspector: ${escHtml(rep.inspectorName||'—')}</div>
          </div>
          <div style="text-align:right">
            ${rep.jiraKey?`<span style="font-size:10px;background:rgba(0,174,255,.15);color:var(--accent2);padding:3px 8px;border-radius:8px;font-family:var(--mono);display:block;margin-bottom:6px">${rep.jiraKey}</span>`:''}
            <div class="history-badge">${count}</div>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  // Técnicos
  try {
    const users=await fbGetAllUsers();
    const tecList=document.getElementById('sup-tecnicos-list');
    const tecs=users.filter(u=>u.role==='tecnico');
    if(!tecs.length){tecList.innerHTML=`<div class="empty-state"><p>Sin técnicos registrados</p></div>`;}
    else {
      tecList.innerHTML=tecs.map(u=>{
        const uReports=allReports.filter(r=>r.userId===u.id);
        return `<div class="sup-card">
          <div class="sup-card-top">
            <div>
              <div class="sup-card-title">${escHtml(u.name)}</div>
              <div class="sup-card-meta">${escHtml(u.email)}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:11px;color:var(--text3)">Informes</div>
              <div style="font-size:22px;font-weight:700;color:var(--accent);font-family:var(--mono)">${uReports.length}</div>
            </div>
          </div>
        </div>`;
      }).join('');
    }
  } catch(e) {}
}

function startLiveMap() {
  if (liveMapStarted) return;
  liveMapStarted=true;
  document.getElementById('map-placeholder').innerHTML=`<div class="pulse-dot"></div><p>Escuchando ubicaciones en tiempo real...</p><span>Actualizando con Firebase</span>`;
  unsubLocations=fbWatchLocations(locs=>{
    const list=document.getElementById('live-locations-list');
    if(!locs.length){list.innerHTML='';return;}
    list.innerHTML=`<div class="section-label" style="margin-top:16px">Ubicaciones activas — ${locs.length} técnico${locs.length!==1?'s':''}</div>`+
      locs.map(l=>{
        const t=l.updatedAt?.seconds?new Date(l.updatedAt.seconds*1000).toLocaleString('es-AR'):new Date().toLocaleString('es-AR');
        return `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div style="font-weight:600;font-size:14px;color:var(--text)">${escHtml(l.userName||'—')}</div>
              <div style="font-size:11px;color:var(--accent);font-family:var(--mono);margin-top:3px">📍 ${l.lat?.toFixed(6)}, ${l.lon?.toFixed(6)}</div>
              <div style="font-size:11px;color:var(--text3);margin-top:2px">${escHtml((l.address||'').split(',').slice(0,2).join(','))}</div>
              <div style="font-size:10px;color:var(--text3);margin-top:2px">${t}</div>
            </div>
            <a href="https://maps.google.com/?q=${l.lat},${l.lon}" target="_blank" style="background:rgba(0,212,170,.1);border:1px solid rgba(0,212,170,.2);color:var(--accent);padding:6px 10px;border-radius:8px;font-size:11px;text-decoration:none;white-space:nowrap">Ver mapa →</a>
          </div>
        </div>`;
      }).join('');
  });
}

async function viewReportSupervisor(id) {
  let allReports=[]; try{allReports=await fbGetAllReports();}catch(e){allReports=localReports;}
  const rep=allReports.find(r=>(r.fbId===id||r.id===id));
  if(!rep) return;
  viewingReportId=id;
  let allScans=localScans;
  try{const ms=await fbGetMyScans(rep.userId);allScans=[...localScans,...ms];}catch(e){}
  const scans=allScans.filter(s=>rep.scanIds?.includes(s.id||s.fbId));
  let sig=rep.signature;
  if(!sig&&rep.fbId){try{sig=await fbGetSignature(rep.fbId);}catch(e){}}
  const d=new Date(rep.date+'T12:00:00');
  const label=d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  document.getElementById('view-report-content').innerHTML=`
    <div class="vr-title">Informe de Visita</div>
    <div class="vr-sub">${label} · ${scans.length} scanner${scans.length!==1?'s':''}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${fTag('Técnico',rep.technicianName)} ${fTag('Inspector',rep.inspectorName)}
    </div>
    ${rep.jiraKey?`<div style="font-size:12px;color:var(--accent2);background:rgba(0,174,255,.1);padding:8px 12px;border-radius:8px;margin-bottom:12px;font-family:var(--mono)">🔗 Jira: ${rep.jiraKey}</div>`:''}
    ${scans.map((s,i)=>`<div style="border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:10px;background:var(--bg3)">
      <div style="font-size:13px;font-weight:600;color:var(--accent)">${i+1}. ${escHtml(s.paso||'—')} <span class="op-badge ${s.opType||'mantenimiento'}">${opLabel(s.opType)}</span></div>
      ${(s.photos||[]).map(p=>`<img src="${p}" style="width:100%;border-radius:8px;margin:6px 0;display:block">`).join('')}
      <div style="font-size:12px;color:var(--text2);margin-top:6px">Puesto: ${escHtml(s.puesto||'—')} · Serie: ${escHtml(s.serie||'—')}</div>
      ${s.lat?`<div style="font-size:10px;color:var(--text3);font-family:var(--mono)">📍 ${s.lat.toFixed(6)}, ${s.lon.toFixed(6)}</div>`:''}
    </div>`).join('')}
    <div class="vr-sig-label">Firma del Inspector — ${escHtml(rep.inspectorName||'')}</div>
    ${sig?`<img src="${sig}" class="vr-sig-img" alt="Firma">`:'<div style="color:var(--text3);font-size:12px;padding:8px">Sin firma</div>'}
  `;
  showPage('view-report');
}
window.viewReportSupervisor = viewReportSupervisor;

// ======== TOAST ========
let toastTimer;
function showToast(msg,type=''){
  const t=document.getElementById('toast');
  t.textContent=msg; t.className='toast'+(type?' '+type:''); t.classList.remove('hidden');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.add('hidden'),2800);
}

function escHtml(str){return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
