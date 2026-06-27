// ======== FIREBASE IMPORTS ========
import {
  fbRegister, fbLogin, fbLogout, fbOnAuthChange, fbSendPasswordReset, fbResendVerification,
  fbSaveScan, fbGetMyScans, fbDeleteScan, fbSoftDeleteScan, fbRestoreScan, fbGetDeletedScans,
  fbSaveReport, fbUpdateReport, fbGetSignature, fbGetMyReports, fbGetAllReports, fbDeleteReport, fbSoftDeleteReport, fbRestoreReport, fbGetDeletedReports,
  fbUpdateLocation, fbWatchLocations, fbGetAllLocations, fbWatchAllReports,
  fbGetAllUsers, fbGetVersionesObjetivo, fbWatchVersionesObjetivo, fbMarcarVersionesVistas, fbUpdateScan, fbReplaceScan,
  fbSaveViaje, fbUpdateViaje, fbGetMyViajes, fbGetAllViajes,
  fbSoftDeleteViaje, fbRestoreViaje, fbHardDeleteViaje, fbGetDeletedViajes,
  fbSaveServiceData, fbGetServiceData
} from './firebase.js';

// ======== DANAIDE LOGO (embedded) ========
const DANAIDE_LOGO = 'data:image/jpeg;base64,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RERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERF//2Q==';

// ======== OFFLINE QUEUE ========
const QUEUE_KEY = 'scancheck_sync_queue';
function queueGetAll() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch(e) { return []; }
}
function queueSave(items) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(items)); } catch(e) {}
}
function queueAdd(type, data) {
  const items = queueGetAll();
  if (!items.find(i => i.type===type && i.id===data.id)) {
    items.push({ type, id: data.id||data.fbId||Date.now(), data, ts: Date.now() });
    queueSave(items);
  }
}

async function processSyncQueue() {
  if (!navigator.onLine) return;
  const items = queueGetAll();
  if (!items.length) return;
  setSyncStatus('syncing');
  let remaining = [];
  for (const item of items) {
    try {
      if (item.type === 'scan') {
        const fbId = await fbSaveScan(item.data);
        const si = localScans.findIndex(s => s.id === item.data.id);
        if (si !== -1) localScans[si].fbId = fbId;
        // Subir fotos a R2 que quedaron pendientes por falta de conexión
        // Las fotos pueden estar en item.data.photos (si se guardaron en la cola)
        // o en localStorage con la clave scancheck_photos_{id}
        let photos = item.data.photos || [];
        if (photos.length === 0) {
          try {
            const stored = localStorage.getItem('scancheck_photos_' + item.data.id);
            if (stored) photos = JSON.parse(stored);
          } catch(e) {}
        }
        if (photos.length > 0 && fbId) {
          uploadPhotosToR2(fbId, photos).then(async urls => {
            if (urls.length > 0) {
              if (si !== -1) localScans[si].photoUrls = urls;
              try { await fbUpdateScan(fbId, { photoUrls: urls }); } catch(e) {}
              console.log(`✓ ${urls.length} foto(s) sincronizadas a R2 (offline→online)`);
            }
          }).catch(e => console.warn('Error subiendo fotos offline a R2:', e.message));
        }
      } else if (item.type === 'report') {
        const repFb = {
          ...item.data,
          scansSnapshot: (item.data.scansSnapshot||[]).map(({photos,...m})=>({...m,photoCount:(photos||[]).length}))
        };
        const fbId = await fbSaveReport(repFb);
        const ri = localReports.findIndex(r=>r.id===item.id);
        if (ri>=0) localReports[ri].fbId = fbId;
      } else if (item.type === 'viaje') {
        // Sincronizar viaje que no llegó a Firestore por falta de conexión
        const fbId = await fbSaveViaje(item.data);
        const vi = localViajes.findIndex(v => v.id === item.data.id);
        if (vi !== -1) {
          localViajes[vi].fbId = fbId;
          if (viajeAbierto?.id === item.data.id) viajeAbierto.fbId = fbId;
          // Actualizar localStorage con el fbId
          try {
            const stored = localStorage.getItem('scancheck_viaje_abierto_'+item.data.userId);
            if (stored) {
              const v = JSON.parse(stored);
              if (v.id === item.data.id) {
                localStorage.setItem('scancheck_viaje_abierto_'+item.data.userId, JSON.stringify({...v, fbId}));
              }
            }
          } catch(e) {}
        }
        console.log('✓ Viaje sincronizado a Firestore (offline→online):', fbId);
      }
    } catch(e) {
      console.warn('Sync queue item failed:', item.type, item.id, e.message);
      remaining.push(item);
    }
  }
  queueSave(remaining);
  setSyncStatus(remaining.length === 0 ? 'ok' : 'error');
  if (remaining.length < items.length) {
    // Persistir los fbId recién asignados, para que el borrado funcione bien
    // en la misma sesión sin necesitar otra recarga de página.
    try {
      const scansForStorage = localScans.map(({photos,...s}) => ({...s, photoCount:(photos||[]).length}));
      localStorage.setItem('scancheck_local_scans_' + currentUser.id, JSON.stringify(scansForStorage));
    } catch(e) {}
    if (currentPage === 'history') renderHistory();
    if (currentPage === 'supervisor') renderSupervisor();
    showToast('✓ Datos sincronizados con Firebase', 'success');
  }
}

window.addEventListener('online', () => {
  setSyncStatus('syncing');
  showToast('Conexión restaurada — sincronizando...', 'success');
  setTimeout(processSyncQueue, 1000);
});
window.addEventListener('offline', () => {
  setSyncStatus('offline');
  showToast('Sin conexión — guardando localmente', '');
});

// ======== LOCAL STATE ========
let currentUser = null;
let currentPage = 'home';
let pageHistory = [];
let currentReport = null;
let viewingReportId = null;
let modalScanId = null;
let editingScanId = null; // ID del scan que se está editando (null = registro nuevo)
let localViajes = []; // viajes del técnico actual
let viajeAbierto = null; // viaje en curso (sin fecha de llegada)
let cameraStream = null;
let qrStream = null;
let capturedPhotos = [];
let currentOpType = 'mantenimiento';
let currentLocation = null;
let sigCanvas, sigCtx, sigDrawing = false, sigHasDraw = false;
let overlayTimer = null;
let qrScanning = false;
let qrAssureEngine = null, qrAssureDocLib = null, qrAssureLicKey = null;
let qrDatosSistema = {}; // campos nuevos del ps1 v2: disco, USB, uptime, actualizaciones
let localScans = [];
let localReports = [];
let unsubLocations = null;
let unsubReports = null;
let locationUpdateTimer = null;

// ======== INIT ========
window.addEventListener('DOMContentLoaded', () => {
  initSignatureCanvas();
  requestLocation();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      // Detectar cuando hay una nueva versión del SW disponible
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
            // Hay una versión nueva activa — avisar al usuario sin forzar recarga
            showToast('Nueva versión disponible — recargá para actualizar', 'success');
          }
        });
      });
    }).catch(() => {});
    // Detectar si el SW controló la página (puede causar recarga en algunos casos)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW] Controller changed — nueva versión activa');
    });
  }
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
  document.getElementById('reg-error').classList.add('hidden');
  if (!name || !email || !pass) { showRegError('Completá todos los campos'); return; }
  if (pass.length < 6) { showRegError('La contraseña debe tener al menos 6 caracteres'); return; }
  setLoading('btn-register', true, 'Creando cuenta...');
  try {
    await fbRegister(name, email, pass);
    showToast('✓ Cuenta creada. Revisá tu email para verificarla.', 'success');
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

function showForgotPassword() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('forgot-form').classList.remove('hidden');
  document.getElementById('forgot-error').classList.add('hidden');
  document.getElementById('forgot-success').classList.add('hidden');
  const le = document.getElementById('login-email').value;
  if (le) document.getElementById('forgot-email').value = le;
}
function hideForgotPassword() {
  document.getElementById('forgot-form').classList.add('hidden');
  document.getElementById('login-form').classList.remove('hidden');
}
window.showForgotPassword = showForgotPassword;
window.hideForgotPassword = hideForgotPassword;

async function doForgotPassword() {
  const email = document.getElementById('forgot-email').value.trim();
  const errEl = document.getElementById('forgot-error');
  const okEl  = document.getElementById('forgot-success');
  errEl.classList.add('hidden'); okEl.classList.add('hidden');
  if (!email) { errEl.textContent='Ingresá tu email'; errEl.classList.remove('hidden'); return; }
  setLoading('btn-forgot', true, 'Enviando...');
  try {
    await fbSendPasswordReset(email);
    okEl.textContent = 'Listo. Revisá tu correo (y la carpeta de spam) para restablecer tu contraseña.';
    okEl.classList.remove('hidden');
  } catch(e) {
    errEl.textContent = e.code==='auth/invalid-email' ? 'Email inválido' :
                         e.code==='auth/user-not-found' ? 'No existe una cuenta con ese email' :
                         'Error al enviar el correo. Probá de nuevo.';
    errEl.classList.remove('hidden');
  }
  setLoading('btn-forgot', false, 'Enviar enlace');
}
window.doForgotPassword = doForgotPassword;
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

  if (!navigator.onLine) {
    setSyncStatus('offline');
    loadLocalData();
    showToast('Modo sin conexión — datos locales', '');
  } else {
    setSyncStatus('syncing');
    try {
      await loadMyData();
      setSyncStatus('ok');
      setTimeout(processSyncQueue, 2000);
    } catch(e) {
      console.warn('Firebase load failed, using local:', e.message);
      setSyncStatus('error');
      loadLocalData();
    }
  }

  updateStats();
  renderTodayList();
  showPage('home', false);
  updateVersionBadge();
  startLocationTracking();
  // Cargar tickets Jira asignados al técnico (con delay para no bloquear el render inicial)
  setTimeout(() => loadJiraTickets(), 2000);

  // Supervisor: watch all reports live
  if (currentUser.role === 'supervisor') {
    unsubReports = fbWatchAllReports(reports => {
      localReports = reports;
      updateStats();
      if (currentPage === 'supervisor') renderSupervisor();
    });
    unsubVersionesObjetivo = fbWatchVersionesObjetivo(v => {
      versionesObjetivo = v;
      updateVersionBadge();
      if (currentPage === 'supervisor') renderSupervisor();
    });
  }
}

// Load data from localStorage only (offline mode)
function loadLocalData() {
  const photoCache = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('scancheck_photos_')) {
        try { photoCache[key.replace('scancheck_photos_','')] = JSON.parse(localStorage.getItem(key)); } catch(e) {}
      }
    }
  } catch(e) {}

  try {
    const stored = localStorage.getItem('scancheck_local_scans_' + currentUser.id);
    localScans = stored ? JSON.parse(stored).map(s => ({ ...s, photos: s.photos?.length ? s.photos : (photoCache[s.id]||photoCache[s.fbId]||[]) })) : [];
  } catch(e) { localScans = []; }

  try {
    const stored = localStorage.getItem('scancheck_local_reports_' + currentUser.id);
    localReports = stored ? JSON.parse(stored).map(rep => ({
      ...rep,
      scansSnapshot: (rep.scansSnapshot||[]).map(s => ({ ...s, photos: s.photos?.length ? s.photos : (photoCache[s.id]||photoCache[s.fbId]||[]) }))
    })) : [];
  } catch(e) { localReports = []; }
}

async function loadMyData() {
  // Build photo cache from localStorage
  const photoCache = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('scancheck_photos_')) {
        try { photoCache[key.replace('scancheck_photos_','')] = JSON.parse(localStorage.getItem(key)); } catch(e) {}
      }
    }
  } catch(e) {}

  const restorePhotos = (s) => {
    // URLs de R2 siempre se preservan en photoUrls para acceso cross-device
    const photoUrls = s.photoUrls && s.photoUrls.length > 0 ? s.photoUrls : null;
    if (s.photos && s.photos.length > 0) return photoUrls ? { ...s, photoUrls } : s;
    // Fotos en localStorage (legacy / offline)
    const localPhotos = photoCache[s.id] || photoCache[s.fbId] || [];
    if (localPhotos.length > 0) return { ...s, photos: localPhotos, ...(photoUrls ? { photoUrls } : {}) };
    // Solo URLs de R2
    if (photoUrls) return { ...s, photoUrls };
    return s;
  };

  const [fbScans, fbReports] = await Promise.all([
    fbGetMyScans(currentUser.id),
    fbGetMyReports(currentUser.id)
  ]);

  // Load local-only items (not yet synced — no fbId)
  let localOnlyScans = [], localOnlyReports = [];
  try {
    const ls = localStorage.getItem('scancheck_local_scans_' + currentUser.id);
    if (ls) {
      const parsed = JSON.parse(ls);
      const fbIds = new Set(fbScans.map(s => s.id||s.fbId));
      localOnlyScans = parsed.filter(s => !fbIds.has(s.id) && !fbIds.has(s.fbId));
    }
  } catch(e) {}
  try {
    const lr = localStorage.getItem('scancheck_local_reports_' + currentUser.id);
    if (lr) {
      const parsed = JSON.parse(lr);
      const fbIds = new Set(fbReports.map(r => r.id||r.fbId));
      localOnlyReports = parsed.filter(r => !r.fbId && !fbIds.has(r.id));
    }
  } catch(e) {}

  localScans = [...fbScans.map(restorePhotos), ...localOnlyScans.map(restorePhotos)];
  localReports = [
    ...fbReports.map(rep => ({ ...rep, scansSnapshot: (rep.scansSnapshot||[]).map(restorePhotos) })),
    ...localOnlyReports.map(rep => ({ ...rep, scansSnapshot: (rep.scansSnapshot||[]).map(restorePhotos) }))
  ];

  localScans.sort((a,b) => new Date(b.timestamp||0) - new Date(a.timestamp||0));
  localReports.sort((a,b) => new Date(b.createdAt||b.date||0) - new Date(a.createdAt||a.date||0));
}

function updateUserUI() {
  if (!currentUser) return;
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
  document.getElementById('user-avatar').textContent = initials;
  document.getElementById('menu-user-name').textContent = currentUser.name;
  document.getElementById('menu-user-email').textContent = currentUser.email;
  document.getElementById('menu-user-role').textContent = currentUser.role === 'supervisor' ? 'Supervisor' : 'Técnico';
  if (currentUser.role === 'supervisor') document.getElementById('btn-supervisor-menu').classList.remove('hidden');
  // Inject Danaide logo into header
  const logoWrap = document.getElementById('header-logo');
  if (logoWrap && DANAIDE_LOGO) {
    logoWrap.innerHTML = `<img src="${DANAIDE_LOGO}" style="height:28px;object-fit:contain;opacity:.9">`;
  }
  // Show email verification reminder if applicable
  const banner = document.getElementById('verify-email-banner');
  if (banner) {
    if (currentUser.emailVerified === false) banner.classList.remove('hidden');
    else banner.classList.add('hidden');
  }
}

async function resendVerification() {
  try {
    await fbResendVerification();
    showToast('✓ Email de verificación reenviado — revisá spam','success');
  } catch(e) {
    console.error('Verification error:', e.code, e.message);
    let msg = 'Error al reenviar';
    if (e.code === 'auth/too-many-requests') msg = 'Demasiados intentos. Esperá unos minutos.';
    else if (e.code) msg = 'Error: ' + e.code;
    showToast(msg, 'error');
  }
}
window.resendVerification = resendVerification;

function setSyncStatus(state) {
  const dot = document.querySelector('.sync-dot');
  if (!dot) return;
  const colors = { ok:'#00d4aa', syncing:'#ffa040', error:'#ff5555', offline:'#888888' };
  dot.style.background = colors[state] || '#ff5555';
  dot.title = state === 'ok' ? 'Sincronizado' : state === 'syncing' ? 'Sincronizando...' : state === 'offline' ? 'Sin conexión' : 'Error de sincronización';
}

// ======== PASOS FRONTERIZOS — BASE DE DATOS GPS ========
// Coordenadas de cada paso/aeropuerto para autocompletar el campo "Nombre del paso"
// cuando el técnico está dentro de un radio de 1000m del punto.
const PASOS_COORDS = [
  // ── NEUQUÉN / RÍO NEGRO ──
  { nombre: 'AERO CHAPELCO',                           lat: -40.0750, lon: -71.1361 },
  { nombre: 'AERO NEUQUEN',                            lat: -38.9489, lon: -68.1556 },
  { nombre: 'Cardenal Antonio Samoré',                 lat: -40.7000, lon: -71.9333 },
  { nombre: 'Pérez Rosales',                           lat: -41.0167, lon: -71.8167 },
  { nombre: 'Pino Hachado',                            lat: -38.6500, lon: -70.8833 },
  // ── BUENOS AIRES ──
  { nombre: 'AERO MAR DEL PLATA',                      lat: -37.9342, lon: -57.5733 },
  // ── BUENOS AIRES METROPOLITANA / PUERTO ──
  { nombre: 'GUARDIA DE PUERTO',                       lat: -34.6100, lon: -58.3700 },
  { nombre: 'PUERTO TIGRE',                            lat: -34.4333, lon: -58.5833 },
  { nombre: 'TERMINAL DE CRUCEROS',                    lat: -34.6150, lon: -58.3650 },
  { nombre: 'Terminal Cruceros Pto.Madryn',             lat: -42.762279, lon: -65.025183 },
  // ── INTERNOS / OFICINAS ──
  { nombre: 'ANTARTIDA ARGENTINA - CAPACITACIONES',    lat: -34.6000, lon: -58.4500 },
  { nombre: 'ANTARTIDA ARGENTINA - CONTROL MIGRATORIO',lat: -34.6000, lon: -58.4500 },
  { nombre: 'ANTARTIDA ARGENTINA - INFORMATICA',       lat: -34.6000, lon: -58.4500 },
  { nombre: 'RENAPER - CONTROL DE CALIDAD - INFORMATICA', lat: -34.6050, lon: -58.4550 },
  // ── ENTRE RÍOS (Uruguay) ──
  { nombre: 'Colón - Paysandú',                        lat: -32.2646, lon: -58.1015 },
  { nombre: 'Concordia - Salto',                       lat: -31.2751, lon: -57.9383 },
  { nombre: 'Gualeguaychú - Fray Bentos',              lat: -33.1006, lon: -58.2487 },
  // ── AYSÉN (Chile) ──
  { nombre: 'Coyhaique',                               lat: -45.528841, lon: -71.565858 },
  { nombre: 'Huemules',                                lat: -45.910672, lon: -71.686750 },
  { nombre: 'Jeinemeni',                               lat: -46.559708, lon: -71.654742 },
  { nombre: 'Triana',                                  lat: -45.572500, lon: -71.698341 },
  // ── CÓRDOBA / SANTA FE / SAN LUIS ──
  { nombre: 'AERO CORDOBA',                            lat: -31.3236, lon: -64.2083 },
  { nombre: 'AERO MERLO - CONLARA',                    lat: -32.3800, lon: -65.1797 },
  { nombre: 'AERO ROSARIO',                            lat: -32.9036, lon: -60.7850 },
  { nombre: 'AERO SAUCE VIEJO',                        lat: -31.7117, lon: -60.8117 },
  // ── FORMOSA / CHACO ──
  { nombre: 'AERO FORMOSA',                            lat: -26.2127, lon: -58.2281 },
  { nombre: 'AERO RESISTENCIA',                        lat: -27.4500, lon: -59.0561 },
  { nombre: 'Clorinda - Puerto José A. Falcón (ENTRADA)', lat: -25.3013, lon: -57.7200 },
  { nombre: 'Clorinda - Puerto José A. Falcón (SALIDA)',  lat: -25.3013, lon: -57.7200 },
  { nombre: 'Colonia General Belgrano - General Bruguez', lat: -25.1833, lon: -58.0833 },
  { nombre: 'Pasarela La Fraternidad',                  lat: -24.8833, lon: -57.9333 },
  { nombre: 'Puerto Formosa - Puerto Alberdi',          lat: -26.1833, lon: -58.1833 },
  { nombre: 'Puerto Pilcomayo - Puerto Itá Enramada',   lat: -25.3667, lon: -57.6500 },
  // ── MISIONES (Brasil/Paraguay) ──
  { nombre: 'AERO IGUAZU',                             lat: -25.7373, lon: -54.4734 },
  { nombre: 'Andresito - Capanema',                    lat: -26.0500, lon: -53.9000 },
  { nombre: 'Bernardo de Irigoyen - Dionisio Cerqueira', lat: -26.2553, lon: -53.6469 },
  { nombre: 'Iguazú - Foz do Iguaçú',                  lat: -25.5950, lon: -54.5800 },
  { nombre: 'Pepirí Guazú - Sao Miguel',               lat: -27.1167, lon: -53.7833 },
  { nombre: 'Puerto Eldorado - Puerto Mayor Julio Otaño', lat: -26.3833, lon: -54.6167 },
  { nombre: 'Puerto Iguazú - Puerto Tres Fronteras',   lat: -25.5833, lon: -54.5833 },
  { nombre: 'San Antonio - Santo Antonio',              lat: -26.0833, lon: -53.7000 },
  { nombre: 'Alba Posse - Porto Maua',                  lat: -27.5667, lon: -54.6667 },
  { nombre: 'El Soberbio - Porto Soberbo',              lat: -27.2833, lon: -54.1833 },
  { nombre: 'Panambí - Vera Cruz',                     lat: -27.3500, lon: -54.0333 },
  { nombre: 'Paso de La Barca - Porto Xavier',          lat: -28.0000, lon: -55.1500 },
  { nombre: 'Posadas - Encarnación',                   lat: -27.3667, lon: -55.8667 },
  { nombre: 'Posadas - Encarnación (FFCC)',             lat: -27.3833, lon: -55.8833 },
  { nombre: 'Puerto Candelaria - Campichuelo',          lat: -27.4167, lon: -55.7500 },
  { nombre: 'Puerto Maní - Puerto Bella Vista - Sur',   lat: -28.5000, lon: -56.0000 },
  { nombre: 'Puerto Rico - Puerto Triunfo (Puerto Gral San Martin)', lat: -26.8000, lon: -55.0500 },
  // ── CORRIENTES (Brasil) ──
  { nombre: 'Paso de los Libres - Uruguayana',         lat: -29.7431, lon: -57.0931 },
  { nombre: 'Santo Tomé - Sao Borja',                  lat: -28.5500, lon: -56.0333 },
  { nombre: 'Yaciretá - Yaciretá',                     lat: -27.4667, lon: -56.6167 },
  // ── JUJUY / SALTA (Bolivia/Chile/Paraguay) ──
  { nombre: 'AERO JUJUY',                              lat: -24.3833, lon: -65.0833 },
  { nombre: 'Aguas Blancas- Bermejo',                  lat: -22.730179, lon: -64.359882 },
  { nombre: 'El Condado - La Mámora',                  lat: -21.8667, lon: -63.7167 },
  { nombre: 'Jama',                                    lat: -23.237279, lon: -67.022829 },
  { nombre: 'La Quiaca - Villazón',                    lat: -22.097996, lon: -65.595876 },
  { nombre: 'Misión La Paz - Pozo Hondo',              lat: -22.379117, lon: -62.522833 },
  { nombre: 'Puerto "Las Chalanas"',                   lat: -22.733238, lon: -64.352446 },
  { nombre: 'Salvador Mazza-Yacuiba',                  lat: -22.053606, lon: -63.684486 },
  { nombre: 'Sico',                                    lat: -23.873750, lon: -67.156933 },
  // ── MENDOZA (Chile) ──
  { nombre: 'Pehuenche',                               lat: -35.6000, lon: -70.3833 },
  { nombre: 'Portillo de Piuquenes',                   lat: -33.5000, lon: -69.8500 },
  { nombre: 'Sistema Cristo Redentor (HORCONES)',      lat: -32.8167, lon: -69.8000 },
  { nombre: 'Sistema Cristo Redentor (LIBERTADORES)',  lat: -32.8333, lon: -70.0667 },
  { nombre: 'Sistema Cristo Redentor (USPALLATA)',     lat: -32.5833, lon: -69.3500 },
  { nombre: 'Vergara',                                 lat: -35.2005, lon: -70.5191 },
  // ── SANTIAGO DEL ESTERO ──
  { nombre: 'AERO TERMAS DE RIO HONDO',                lat: -27.4950, lon: -64.9350 },
  { nombre: 'San Francisco',                           lat: -26.913700, lon: -68.129025 },
  // ── SANTA CRUZ / TDF ──
  { nombre: 'AERO RIO GALLEGOS',                       lat: -51.6089, lon: -69.3127 },
  { nombre: 'AERO USHUAIA',                            lat: -54.8433, lon: -68.2958 },
  { nombre: 'Laurita - Casas Viejas',                  lat: -51.690333, lon: -72.297350 },
  { nombre: 'Río Bella Vista (ex Radman)',              lat: -54.0167, lon: -68.5000 },
  { nombre: 'Río Don Guillermo',                       lat: -51.255800, lon: -72.236200 },
  { nombre: 'San Sebastián',                           lat: -53.299560, lon: -68.459107 },
  { nombre: 'Paso San Sebastián Entrada',               lat: -53.299847, lon: -68.457673 },
  { nombre: 'Paso San Sebastián Salida',                lat: -53.299355, lon: -68.460136 },
];

// Calcula distancia en metros entre dos puntos GPS (fórmula de Haversine)
function gpsDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLon = (lon2-lon1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Intenta autocompletar el campo "Nombre del paso" si el técnico está dentro de 1000m de algún paso conocido.
// Solo autocompleta si el campo está vacío (no sobreescribe lo que el técnico ya ingresó).
function autoFillPasoFromGPS(lat, lon) {
  const campo = document.getElementById('inp-paso');
  if (!campo || campo.value.trim()) return; // no sobreescribir si ya tiene algo
  const RADIO_METROS = 200;
  let masNear = null, minDist = Infinity;
  for (const p of PASOS_COORDS) {
    const d = gpsDistanceMeters(lat, lon, p.lat, p.lon);
    if (d < minDist) { minDist = d; masNear = p; }
  }
  if (masNear && minDist <= RADIO_METROS) {
    campo.value = masNear.nombre;
    showToast(`📍 Paso detectado: ${masNear.nombre}`, 'success');
  }
}

// ======== LOCATION TRACKING ========
window.autoFillPasoFromGPS = autoFillPasoFromGPS;
function requestLocation() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(pos => {
    currentLocation = { lat: pos.coords.latitude, lon: pos.coords.longitude, acc: Math.round(pos.coords.accuracy) };
    reverseGeocode(currentLocation.lat, currentLocation.lon);
    autoFillPasoFromGPS(currentLocation.lat, currentLocation.lon);
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
  const lines = [`${fecha}  ${hora}`, coords];
  if (currentLocation?.address) {
    // Dirección completa en la marca de agua — el canvas se ajusta al ancho disponible
    const addr = currentLocation.address;
    lines.push(addr);
  }
  return lines;
}

// ======== NAVIGATION ========
const pageTitles = {
  'home':'Inicio','new-scan':'Nuevo Registro','report':'Informe del Día',
  'view-report':'Ver Informe','history':'Historial',
  'supervisor':'Panel Supervisor','viajes':'Mis Viajes'
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
  if (name === 'home')        { updateStats(); renderTodayList(); }
  if (name === 'mis-tickets') { loadJiraTickets(); }
  if (name === 'history')    renderHistory();
  if (name === 'new-scan')   resetNewScanForm();
  if (name === 'viajes')     { loadViajes(); window.scrollTo(0,0); }
  if (name === 'supervisor') renderSupervisor();
}
window.showPage = showPage;

function goBack() {
  if (!pageHistory.length) return;
  stopCamera(); stopQRScan();
  showPage(pageHistory.pop(), false);
}
window.goBack = goBack;

function toggleMenu() {
  const vEl = document.getElementById('app-version-label');
  if (vEl) vEl.textContent = typeof APP_VERSION !== 'undefined' ? 'ScanCheck ' + APP_VERSION : ''; document.getElementById('dropdown-menu').classList.toggle('hidden'); }
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
function getOrphanScans() {
  // Registros que no tienen informe cerrado — incluye días anteriores
  const reportedIds = new Set(localReports.filter(r=>!r.eliminado).flatMap(r=>r.scanIds||[]));
  const seen = new Set();
  return localScans.filter(s => {
    if (s.eliminado) return false;
    if (reportedIds.has(s.id) || reportedIds.has(s.fbId)) return false;
    // Deduplicar por fbId (puede haber duplicados si el scan está en localScans dos veces)
    const key = s.fbId || s.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function updateStats() {
  const today = getTodayKey();
  const todayScans = localScans.filter(s => localDateKey(s.timestamp) === today);
  document.getElementById('stat-today').textContent   = todayScans.length;
  document.getElementById('stat-total').textContent   = localScans.length;
  document.getElementById('stat-reports').textContent = localReports.filter(r => !r.eliminado).length;
  document.getElementById('btn-close-day-wrap').classList.toggle('hidden', todayScans.length === 0);
  // Badge naranja en "Total Registros" si hay registros sin informe de días anteriores
  const orphans = getOrphanScans().filter(s => localDateKey(s.timestamp) !== today);
  const badge = document.getElementById('orphan-badge');
  if (badge) {
    badge.classList.toggle('hidden', orphans.length === 0);
    badge.textContent = orphans.length > 0 ? orphans.length : '';
  }
}

// ======== TODAY LIST ========
function localDateKey(timestamp) {
  const d = timestamp ? new Date(timestamp) : new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function renderTodayList() {
  const today = getTodayKey();
  const scans = localScans.filter(s => localDateKey(s.timestamp) === today).slice().reverse();
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

function opLabel(op) {
  if (op === 'instalacion_nueva') return 'Instalación - Puesto nuevo';
  if (op === 'instalacion_reemplazo') return 'Instalación - Reemplazo';
  if (op === 'instalacion') return 'Instalación';
  if (op === 'cambio_equipo') return 'Cambio de equipo';
  if (op === 'reemplazo') return 'Cambio de equipo'; // compatibilidad registros viejos
  if (op === 'falla_reparable') return 'Falla reparable en sitio';
  if (op === 'incidencia') return 'Incidencia';
  return 'Mantenimiento Preventivo';
}

let currentIncidenciaSubtipo = 'cambio_equipo'; // 'cambio_equipo' o 'falla_reparable'
let currentInstalacionSubtipo = 'instalacion_nueva'; // 'instalacion_nueva' o 'instalacion_reemplazo'

// ======== OP TYPE ========
function setOpType(type, btn) {
  currentOpType = type;
  document.querySelectorAll('.op-btn[data-op]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const esIncidencia = type === 'incidencia';
  const esInstalacion = type === 'instalacion';

  document.getElementById('incidencia-fields').classList.toggle('hidden', !esIncidencia);
  document.getElementById('instalacion-fields').classList.toggle('hidden', !esInstalacion);
  document.getElementById('checklist-mantenimiento-fields').classList.toggle('hidden', esIncidencia || esInstalacion);
  document.getElementById('checklist-instalacion-fields').classList.toggle('hidden', !esInstalacion);
  document.getElementById('serie-normal-group').style.display =
    (esIncidencia && currentIncidenciaSubtipo === 'cambio_equipo') ? 'none' : '';

  if (esIncidencia) setIncidenciaSubtipo(currentIncidenciaSubtipo);
  if (esInstalacion) setInstalacionSubtipo(currentInstalacionSubtipo);
}
window.setOpType = setOpType;

function setInstalacionSubtipo(subtipo) {
  currentInstalacionSubtipo = subtipo;
  const esReemplazo = subtipo === 'instalacion_reemplazo';
  document.getElementById('instalacion-reemplazo-fields').classList.toggle('hidden', !esReemplazo);
  document.getElementById('inst-btn-nueva').classList.toggle('active', !esReemplazo);
  document.getElementById('inst-btn-reemplazo').classList.toggle('active', esReemplazo);
}
window.setInstalacionSubtipo = setInstalacionSubtipo;

function setIncidenciaSubtipo(subtipo) {
  currentIncidenciaSubtipo = subtipo;
  const esCambio = subtipo === 'cambio_equipo';
  document.getElementById('incidencia-reemplazo-fields').classList.toggle('hidden', !esCambio);
  document.getElementById('incidencia-falla-fields').classList.toggle('hidden', esCambio);
  document.getElementById('serie-normal-group').style.display = esCambio ? 'none' : '';
  document.getElementById('inc-btn-cambio').classList.toggle('active', esCambio);
  document.getElementById('inc-btn-falla').classList.toggle('active', !esCambio);
}
window.setIncidenciaSubtipo = setIncidenciaSubtipo;

// ======== RESET FORM ========
function resetNewScanForm() {
  ['inp-paso','inp-puesto','inp-serie','inp-notas','inp-serie-retira','inp-serie-nuevo','inp-pc-nombre','inp-scanner-serie','inp-scanner-modelo','inp-scanner-estado','inp-inv-dnd','inp-inv-dnm','inp-nuevo-marca-modelo','falla-otro-texto','rep-otro-texto','inp-inst-serie-retira'].forEach(id => { const el=document.getElementById(id); if(el)el.value=''; });
  { const el=document.getElementById('inp-scanner-estado'); if(el) el.classList.add('select-placeholder'); }
  const marcaVieja = document.getElementById('inp-marca-vieja'); if(marcaVieja) marcaVieja.value = '';
  ['chk-vidrio','chk-cable-usb','chk-fuente','chk-limpieza','chk-update-assureid','chk-update-librerias','chk-autoinicio-doc-auth','chk-autoinicio-sentinel',
   'chki-fuente-conectada','chki-usb3','chki-drivers-desko','chki-librerias-desko','chki-aplicativos-desko','chki-assureid-librerias','chki-autoinicio-doc-auth','chki-autoinicio-sentinel','chki-settings-sensitivity','chki-prueba-revealid','chki-prueba-sicam',
   'falla-alimentacion','falla-cristal','falla-usb','falla-mrz','falla-chip','falla-sensor','falla-irrojo','falla-mecanica','falla-intermitente','falla-dano-fisico','falla-obsolescencia','falla-otro-check',
   'rep-fuente','rep-cristal','rep-usb','rep-software','rep-esponja','rep-otro-check'
  ].forEach(id => { const el=document.getElementById(id); if(el)el.checked=false; });
  capturedPhotos = []; currentOpType = 'mantenimiento';
  // NO limpiamos editingScanId aquí — lo gestiona editScan/saveScan directamente
  // Restaurar botón guardar por si se cancela una edición
  const btnG = document.getElementById('btn-save-scan');
  if (btnG) { btnG.textContent = '✓ Guardar Registro'; btnG.style.background = ''; }
  // Si se navega a new-scan SIN pasar por editScan, limpiar el modo edición
  if (!window._keepEditId) editingScanId = null;
  window._keepEditId = false;
  currentIncidenciaSubtipo = 'cambio_equipo'; currentInstalacionSubtipo = 'instalacion_nueva';
  qrAssureEngine = null; qrAssureDocLib = null; qrAssureLicKey = null; qrDatosSistema = {};
  document.querySelectorAll('.op-btn[data-op]').forEach(b=>b.classList.remove('active'));
  document.querySelector('.op-btn[data-op="mantenimiento"]').classList.add('active');
  document.getElementById('incidencia-fields').classList.add('hidden');
  document.getElementById('instalacion-fields').classList.add('hidden');
  document.getElementById('incidencia-reemplazo-fields').classList.remove('hidden');
  document.getElementById('incidencia-falla-fields').classList.add('hidden');
  document.getElementById('instalacion-reemplazo-fields').classList.add('hidden');
  document.getElementById('checklist-mantenimiento-fields').classList.remove('hidden');
  document.getElementById('checklist-instalacion-fields').classList.add('hidden');
  document.getElementById('serie-normal-group').style.display = '';
  document.getElementById('qr-data-preview').classList.add('hidden');
  const instBtnNueva = document.getElementById('inst-btn-nueva'); if(instBtnNueva) instBtnNueva.classList.add('active');
  const instBtnRemp = document.getElementById('inst-btn-reemplazo'); if(instBtnRemp) instBtnRemp.classList.remove('active');
  const incBtnCambio = document.getElementById('inc-btn-cambio'); if(incBtnCambio) incBtnCambio.classList.add('active');
  const incBtnFalla = document.getElementById('inc-btn-falla'); if(incBtnFalla) incBtnFalla.classList.remove('active');
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
    vid.srcObject = cameraStream;
    document.getElementById('camera-container').style.display = 'block';
    try { await vid.play(); } catch(e) {}
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
  if (vid) vid.srcObject=null;
  const container = document.getElementById('camera-container');
  if (container) container.style.display = 'none';
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
  const maxW = w - pad*2;
  ctx.font=`${fontSize}px monospace`;
  // Si una línea es más ancha que el canvas, reducir font size hasta que entre
  const fittedLines = lines.map(l => {
    let fs = fontSize;
    ctx.font=`${fs}px monospace`;
    while(ctx.measureText(l).width > maxW && fs > 8) {
      fs -= 0.5;
      ctx.font=`${fs}px monospace`;
    }
    return { text: l, fontSize: fs };
  });
  const boxH=lines.length*lineH+pad*2;
  ctx.fillStyle='rgba(0,0,0,0.62)';
  ctx.fillRect(0,h-boxH,w,boxH);
  ctx.fillStyle='rgba(255,255,255,0.92)'; ctx.textAlign='left';
  fittedLines.forEach(({text,fontSize:fs},i)=>{
    ctx.font=`${fs}px monospace`;
    ctx.fillText(text,pad,h-boxH+pad+(i+1)*lineH-3);
  });
  ctx.fillStyle='#00d4aa'; ctx.fillRect(0,h-boxH,4,boxH);
}

// ======== QR SCAN ========
let qrScanInterval = null;

function startQRScan() {
  // Usar modal inline — funciona en PWA y en APK con Capacitor
  const modal = document.getElementById('modal-qr-scanner');
  if (!modal) return;
  modal.classList.remove('hidden');

  const video = document.getElementById('qr-video-inline');
  const canvas = document.getElementById('qr-canvas-inline');
  const ctx = canvas.getContext('2d');

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      video.srcObject = stream;
      video.play();
      const hint = document.getElementById('qr-scan-hint');
      let frames = 0;
      qrScanInterval = setInterval(() => {
        frames++;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (hint) hint.textContent = `📷 ${canvas.width}x${canvas.height} | frame ${frames} | jsQR: ${typeof jsQR}`;
          if (typeof jsQR === 'undefined') {
            if (hint) hint.textContent = '❌ jsQR no está cargado';
            return;
          }
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            stopQRScannerModal();
            processQRData(code.data);
          } else if (frames % 10 === 0) {
            if (hint) hint.textContent = `🔍 Buscando QR... (${canvas.width}x${canvas.height})`;
          }
        } else {
          if (hint) hint.textContent = `⏳ Iniciando cámara... (estado: ${video.readyState})`;
        }
      }, 150);
    })
    .catch(e => {
      showToast('No se pudo acceder a la cámara: '+e.message, 'error');
      modal.classList.add('hidden');
    });
}
window.startQRScan = startQRScan;

function stopQRScannerModal() {
  if (qrScanInterval) { clearInterval(qrScanInterval); qrScanInterval = null; }
  const video = document.getElementById('qr-video-inline');
  if (video?.srcObject) { video.srcObject.getTracks().forEach(t => t.stop()); video.srcObject = null; }
  document.getElementById('modal-qr-scanner')?.classList.add('hidden');
}

function closeQRScannerModal() {
  stopQRScannerModal();
}
window.closeQRScannerModal = closeQRScannerModal;

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

    // Mapeo completo de claves cortas y largas del inventario.ps1
    const g = (a,b,c) => data[a]||data[b]||data[c]||''; // get with fallbacks
    const puestoVal = g('PC','NombrePC','ComputerName');
    const serieVal  = g('SN','Serial','SerialNumber');
    const dskSerie  = g('DSKS','DESKO_Scanner_Serial','');
    const dskModelo = g('DSKM','DESKO_Scanner_Modelo','');
    const dskEstado = g('DKOS','DESKO_Scanner_Status','') || g('DSKO','DESKO_Scanner_Status','');
    const assureEngine = g('AEV','AssureID_Engine_Version','');
    const assureDocLib = g('ADL','AssureID_DocLib_Version','');
    const assureLicKey = g('ALK','AssureID_LicenseKey','');
    const assureDocLibFecha = g('ADLF','AssureID_DocLib_Fecha','');
    const assureDocLibRuta  = g('ADLR','AssureID_DocLib_Ruta','');
    const assureServicio    = g('ASVC','AssureID_Servicio_Estado','');

    // ── Campos nuevos v2 ──
    const qrUptime      = g('UPT','Uptime','');
    const qrUltimoRein  = g('LBT','UltimoReinicio','');
    const qrReinPend    = g('RPD','ReinicioPendiente','');
    const qrUpdPend     = g('UPD','UpdatesPendientes','');
    const qrDiscoModelo = g('DSM','Disco_Modelo','');
    const qrDiscoSerial = g('DSS','Disco_Serial','');
    const qrDiscoTipo   = g('DST','Disco_Tipo','');
    const qrDiscoSMART  = g('DSH','Disco_Estado_SMART','');
    const qrDiscoTotalGB= g('DSTG','Disco_Total_GB','');
    const qrDiscoLibreGB= g('DSLG','Disco_Libre_GB','');
    const qrDiscoUsoPct = g('DSUP','Disco_Uso_Porcentaje','');
    const qrDiscoTempC  = g('DSTC','Disco_Temperatura_C','');
    const qrUsbTotal    = g('USBT','USB_Dispositivos_Total','');
    const qrUsbErrores  = g('USBE','USB_Dispositivos_Error','');

    // Guardar en estado de módulo para saveScan
    if (qrUptime)      qrDatosSistema.uptime      = qrUptime;
    if (qrUltimoRein)  qrDatosSistema.ultimoRein  = qrUltimoRein;
    if (qrReinPend)    qrDatosSistema.reinPend     = qrReinPend;
    if (qrUpdPend)     qrDatosSistema.updPend      = qrUpdPend;
    if (qrDiscoModelo) qrDatosSistema.discoModelo  = qrDiscoModelo;
    if (qrDiscoSerial) qrDatosSistema.discoSerial  = qrDiscoSerial;
    if (qrDiscoTipo)   qrDatosSistema.discoTipo    = qrDiscoTipo;
    if (qrDiscoSMART)  qrDatosSistema.discoSMART   = qrDiscoSMART;
    if (qrDiscoTotalGB)qrDatosSistema.discoTotalGB = qrDiscoTotalGB;
    if (qrDiscoLibreGB)qrDatosSistema.discoLibreGB = qrDiscoLibreGB;
    if (qrDiscoUsoPct) qrDatosSistema.discoUsoPct  = qrDiscoUsoPct;
    if (qrDiscoTempC)  qrDatosSistema.discoTempC   = qrDiscoTempC;
    if (qrUsbTotal)    qrDatosSistema.usbTotal      = qrUsbTotal;
    if (qrUsbErrores)  qrDatosSistema.usbErrores    = qrUsbErrores;
    if (assureDocLibFecha) qrDatosSistema.docLibFecha = assureDocLibFecha;
    if (assureDocLibRuta)  qrDatosSistema.docLibRuta  = assureDocLibRuta;
    if (assureServicio)    qrDatosSistema.servicioEstado = assureServicio;

    // El QR siempre sobreescribe los campos de hardware — son datos de la PC actual,
    // no del técnico, así que siempre deben reflejar lo que leyó el script.
    if (puestoVal) { const el=document.getElementById('inp-pc-nombre'); if(el) el.value=puestoVal; }
    if (serieVal)  { const el=document.getElementById('inp-serie');  if(el) el.value=serieVal; }
    if (dskSerie && dskSerie!=='N/A')  { const el=document.getElementById('inp-scanner-serie');  if(el) el.value=dskSerie; }
    if (dskModelo && dskModelo!=='No detectado') { const el=document.getElementById('inp-scanner-modelo'); if(el) el.value=dskModelo; }
    if (dskEstado && dskEstado!=='N/A') { const el=document.getElementById('inp-scanner-estado'); if(el) { el.value=dskEstado; el.classList.toggle('select-placeholder', !el.value); } }
    if (assureEngine) qrAssureEngine = assureEngine;
    if (assureDocLib) qrAssureDocLib = assureDocLib;
    if (assureLicKey) qrAssureLicKey = assureLicKey;

    // Construir notas completas con TODA la info del inventario
    const notasEl = document.getElementById('inp-notas');
    if (notasEl && !notasEl.value) {
      const fab  = g('FAB','Fabricante','');
      const mod  = g('MOD','Modelo','');
      const ip   = g('IP','','');
      const mac  = g('MAC','','');
      const cpu  = g('CPU','','');
      const cpup = g('CPUP','UsoCPU_Porcentaje','');
      const ramt = g('RAMT','MemoriaTotal_GB','');
      const ramu = g('RAMU','MemoriaUsada_GB','');
      const ramp = g('RAMP','UsoMemoria_Porcentaje','');
      const usr  = g('USR','Usuario','');
      const aev  = g('AEV','AssureID_Engine_Version','AssureID_Engine');
      const adl  = g('ADL','AssureID_DocLib_Version','AssureID_DocLib');
      const aed  = g('AED','AssureID_Edicion','');
      const alk  = g('ALK','AssureID_LicenseKey','');
      const ati  = g('ATI','AssureID_Tipo','');
      const aac  = g('AAC','AssureID_Activacion','');
      const avn  = g('AVN','AssureID_Vencimiento','');
      const aai  = g('AAI','AssureID_ActivationID','');
      const ts   = g('TS','Fecha','');
      const lines = [];
      if (fab||mod)  lines.push('Equipo: '+[fab,mod].filter(Boolean).join(' '));
      if (usr)       lines.push('Usuario PC: '+usr);
      if (ip)        lines.push('IP: '+ip+'  MAC: '+mac);
      if (cpu)       lines.push('CPU: '+cpu+' ('+cpup+'%)');
      if (ramt)      lines.push('RAM: '+ramu+'/'+ramt+' GB ('+ramp+'% uso)');
      // Campos nuevos en notas
      if (qrUptime)       lines.push('Uptime: '+qrUptime+' | Ultimo reinicio: '+qrUltimoRein);
      if (qrReinPend && qrReinPend!=='No') lines.push('⚠ Reinicio pendiente: '+qrReinPend);
      if (qrUpdPend && qrUpdPend!=='0' && qrUpdPend!=='N/D') lines.push('⚠ Actualizaciones de Windows pendientes: '+qrUpdPend);
      if (qrDiscoModelo)  lines.push('Disco: '+qrDiscoModelo+' ('+qrDiscoTipo+') — SMART: '+qrDiscoSMART);
      if (qrDiscoTotalGB) lines.push('Espacio disco: '+qrDiscoLibreGB+' GB libres / '+qrDiscoTotalGB+' GB total ('+qrDiscoUsoPct+'% uso)');
      if (qrDiscoTempC && qrDiscoTempC!=='N/D') lines.push('Temp disco: '+qrDiscoTempC+'°C');
      if (qrUsbTotal)     lines.push('USB: '+qrUsbTotal+' disp. detectados, '+qrUsbErrores+' con error');
      if (aev && aev!=='No instalado') {
        lines.push('--- AssureID ---');
        lines.push('Engine: v'+aev);
        if (adl && adl!=='No instalado') lines.push('DocLib: v'+adl);
        if (assureDocLibFecha && assureDocLibFecha!=='N/A') lines.push('DocLib actualizado: '+assureDocLibFecha);
        if (assureDocLibRuta) lines.push('DocLib ruta: '+assureDocLibRuta);
        if (assureServicio) {
          const servicioOk = assureServicio.toLowerCase().includes('corriendo') || assureServicio.toLowerCase()==='running';
          lines.push((servicioOk?'':'⚠ ')+'Servicio AssureID: '+assureServicio);
        }
        if (aed && aed!=='N/A')          lines.push('Edicion: '+aed);
        if (ati && ati!=='N/A')          lines.push('Tipo lic: '+ati);
        if (alk && alk!=='N/A')          lines.push('LicKey: '+alk);
        if (aac && aac!=='N/A')          lines.push('Activacion: '+aac);
        if (avn && avn!=='N/A')          lines.push('Vencimiento: '+avn);
        if (aai && aai!=='N/A')          lines.push('ActivationID: '+aai);
      }
      if (ts) lines.push('Relevado: '+ts);
      notasEl.value = lines.join('\n');
    }

    // Preview completo
    const preview = Object.entries(data).map(([k,v])=>`${k}: ${v}`).join('\n');
    const el = document.getElementById('qr-data-preview');
    el.textContent = preview; el.classList.remove('hidden');
    showToast(`✓ QR leído — ${Object.keys(data).length} campos`,'success');
  } catch(e) { showToast('No se pudo leer el QR','error'); }
}

// ======== SAVE SCAN ========
// ── Fotos → Cloudflare R2 ────────────────────────────────────
// Sube las fotos de un scan al bucket R2 y devuelve array de URLs públicas.
// Si no hay conexión o falla alguna foto, guarda las que pudo y sigue.
async function uploadPhotosToR2(scanId, photos) {
  if (!photos || photos.length === 0) return [];
  const urls = [];
  for (let i = 0; i < photos.length; i++) {
    try {
      const dataUrl = typeof photos[i] === 'string' ? photos[i] : photos[i].dataUrl;
      if (!dataUrl) continue;
      // Convertir base64 a blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const filename = `foto_${i+1}_${Date.now()}.jpg`;
      const uploadRes = await fetch(`${PHOTOS_PROXY_URL}/upload/${scanId}/${filename}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/jpeg',
          'X-ScanCheck-Token': PHOTOS_TOKEN
        },
        body: blob
      });
      if (uploadRes.ok) {
        const data = await uploadRes.json();
        urls.push(data.url);
      }
    } catch(e) {
      console.warn(`Error subiendo foto ${i+1}:`, e.message);
    }
  }
  return urls;
}

// Carga las URLs de fotos de un scan desde R2 (para mostrar en modal/PDF).
async function loadPhotosFromR2(scanId) {
  try {
    const res = await fetch(`${PHOTOS_PROXY_URL}/list/${scanId}`, {
      headers: { 'X-ScanCheck-Token': PHOTOS_TOKEN }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.photos || []).map(p => p.url);
  } catch(e) {
    return [];
  }
}

async function saveScan() {
  const paso  = document.getElementById('inp-paso').value.trim();
  const puesto= document.getElementById('inp-puesto').value.trim();
  const notas = document.getElementById('inp-notas').value.trim();
  if (!paso)   { showToast('Ingresá el nombre del paso','error'); return; }
  if (!puesto) { showToast('Ingresá el número de puesto','error'); return; }

  let serie='', serieRetira='', serieNuevo='';
  // Determinar opType real según el modo principal y sub-tipo seleccionado
  let opTypeReal = currentOpType;
  if (currentOpType === 'incidencia') {
    opTypeReal = currentIncidenciaSubtipo; // 'cambio_equipo' o 'falla_reparable'
  } else if (currentOpType === 'instalacion') {
    opTypeReal = currentInstalacionSubtipo; // 'instalacion_nueva' o 'instalacion_reemplazo'
  }

  if (opTypeReal === 'cambio_equipo') {
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

  const pcNombre      = document.getElementById('inp-pc-nombre').value.trim();
  const scannerSerie  = document.getElementById('inp-scanner-serie').value.trim();
  const scannerModelo = document.getElementById('inp-scanner-modelo').value.trim();
  const scannerEstado = document.getElementById('inp-scanner-estado').value.trim();
  const invDnd        = document.getElementById('inp-inv-dnd').value.trim();
  const invDnm        = document.getElementById('inp-inv-dnm').value.trim();

  const checklist = {
    vidrio:   document.getElementById('chk-vidrio').checked,
    cableUsb: document.getElementById('chk-cable-usb').checked,
    fuente:   document.getElementById('chk-fuente').checked,
    limpieza: document.getElementById('chk-limpieza').checked,
    updateAssureId:  document.getElementById('chk-update-assureid').checked,
    updateLibrerias: document.getElementById('chk-update-librerias').checked,
    autoInicioDocAuth:  document.getElementById('chk-autoinicio-doc-auth').checked,
    autoInicioSentinel: document.getElementById('chk-autoinicio-sentinel').checked
  };

  // Checklist de instalación (equipo nuevo) — solo relevante cuando opTypeReal es instalacion_*
  const checklistInstalacion = {
    fuenteConectada:    document.getElementById('chki-fuente-conectada').checked,
    usb3:               document.getElementById('chki-usb3').checked,
    driversDesko:       document.getElementById('chki-drivers-desko').checked,
    libreriasDesko:     document.getElementById('chki-librerias-desko').checked,
    aplicativosDesko:   document.getElementById('chki-aplicativos-desko').checked,
    assureIdLibrerias:  document.getElementById('chki-assureid-librerias').checked,
    autoInicioDocAuth:  document.getElementById('chki-autoinicio-doc-auth').checked,
    autoInicioSentinel: document.getElementById('chki-autoinicio-sentinel').checked,
    settingsSensitivity:document.getElementById('chki-settings-sensitivity').checked,
    pruebaRevealId:     document.getElementById('chki-prueba-revealid').checked,
    pruebaSicam:        document.getElementById('chki-prueba-sicam').checked,
    loggingFilter:      document.getElementById('chki-logging-filter')?.checked || false
  };

  // Datos del Acta de Reemplazo — solo cuando es cambio_equipo (Incidencia)
  let actaReemplazo = null;
  if (opTypeReal === 'cambio_equipo') {
    const fallaChecklist = {
      alimentacion:   document.getElementById('falla-alimentacion').checked,
      cristal:        document.getElementById('falla-cristal').checked,
      usb:            document.getElementById('falla-usb').checked,
      mrz:            document.getElementById('falla-mrz').checked,
      chip:           document.getElementById('falla-chip').checked,
      sensor:         document.getElementById('falla-sensor').checked,
      irrojo:         document.getElementById('falla-irrojo').checked,
      mecanica:       document.getElementById('falla-mecanica').checked,
      intermitente:   document.getElementById('falla-intermitente').checked,
      danoFisico:     document.getElementById('falla-dano-fisico').checked,
      obsolescencia:  document.getElementById('falla-obsolescencia').checked,
      otro:           document.getElementById('falla-otro-check').checked,
      otroTexto:      document.getElementById('falla-otro-texto').value.trim()
    };
    actaReemplazo = {
      fallaChecklist,
      nuevoMarcaModelo: document.getElementById('inp-nuevo-marca-modelo').value.trim()
    };
  }

  // Datos de instalación reemplazo de contrato anterior (equipo viejo Thales/3M)
  let instalacionReemplazoData = null;
  if (opTypeReal === 'instalacion_reemplazo') {
    instalacionReemplazoData = {
      marcaVieja: document.getElementById('inp-marca-vieja')?.value || 'Thales',
      serieVieja: document.getElementById('inp-inst-serie-retira')?.value.trim() || ''
    };
  }

  // Checklist de falla reparable en sitio — solo cuando es falla_reparable
  let fallaReparable = null;
  if (opTypeReal === 'falla_reparable') {
    fallaReparable = {
      fuente:    document.getElementById('rep-fuente').checked,
      cristal:   document.getElementById('rep-cristal').checked,
      usb:       document.getElementById('rep-usb').checked,
      software:  document.getElementById('rep-software').checked,
      esponja:   document.getElementById('rep-esponja').checked,
      otro:      document.getElementById('rep-otro-check').checked,
      otroTexto: document.getElementById('rep-otro-texto').value.trim()
    };
  }

  const scan = {
    id: 'sc_'+Date.now(),
    userId: currentUser.id,
    userName: currentUser.name,
    opType: opTypeReal,
    paso, puesto, serie, serieRetira, serieNuevo, notas,
    pcNombre, scannerSerie, scannerModelo, scannerEstado, invDnd, invDnm, checklist, checklistInstalacion, actaReemplazo, fallaReparable, instalacionReemplazoData,
    assureEngine: qrAssureEngine, assureDocLib: qrAssureDocLib, assureLicKey: qrAssureLicKey,
    datosSistema: Object.keys(qrDatosSistema).length ? {...qrDatosSistema} : null,
    jiraTicket: null,
    photos: capturedPhotos.map(p=>p.dataUrl),
    pcData,
    lat: currentLocation?.lat||null,
    lon: currentLocation?.lon||null,
    address: currentLocation?.address||null,
    timestamp: new Date().toISOString()
  };

  stopCamera(); stopQRScan();

  // Aviso si no hay fotos — no bloqueante, igual que el aviso de ticket de Jira
  if (capturedPhotos.length === 0) {
    const continuar = await new Promise(resolve => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
      modal.innerHTML = `<div style="background:var(--bg2);border-radius:16px;padding:24px;max-width:320px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.4)">
        <div style="font-size:20px;margin-bottom:12px;text-align:center">📷</div>
        <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:8px;text-align:center">Sin fotos adjuntas</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:20px;text-align:center;line-height:1.4">No agregaste ninguna foto al registro.<br>Se recomienda documentar el estado del equipo con al menos una foto.</div>
        <div style="display:flex;gap:10px">
          <button id="modal-foto-agregar" style="flex:1;padding:12px;border-radius:10px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:14px;font-weight:600;cursor:pointer">Agregar foto</button>
          <button id="modal-foto-continuar" style="flex:1;padding:12px;border-radius:10px;border:none;background:var(--accent);color:#0a1628;font-size:14px;font-weight:700;cursor:pointer">Guardar igual</button>
        </div>
      </div>`;
      document.body.appendChild(modal);
      document.getElementById('modal-foto-agregar').onclick = () => { document.body.removeChild(modal); resolve(false); };
      document.getElementById('modal-foto-continuar').onclick = () => { document.body.removeChild(modal); resolve(true); };
    });
    if (!continuar) return; // vuelve al formulario para agregar fotos
  }

  // ── MODO EDICIÓN: reemplazar registro existente ───────────
  if (editingScanId) {
    console.log('[Edit] editingScanId:', editingScanId);
    console.log('[Edit] localScans ids:', localScans.map(s=>({id:s.id,fbId:s.fbId})));
    const existingIdx = localScans.findIndex(s => s.id===editingScanId || s.fbId===editingScanId);
    console.log('[Edit] existingIdx:', existingIdx);
    const existing = existingIdx !== -1 ? localScans[existingIdx] : null;
    // Preservar campos que no se pueden cambiar desde el formulario
    // editingScanId puede ser el id local (sc_...) o el fbId de Firestore
    // Lo usamos directamente como fbId si existing no lo tiene definido
    const editFbId = (existing?.fbId) ||
      (editingScanId?.startsWith('sc_') ? null : editingScanId) || null;
    if (existing || editFbId) {
      scan.id        = existing?.id        || editingScanId;
      scan.fbId      = editFbId;
      scan.timestamp = existing?.timestamp || scan.timestamp;
      scan.userId    = existing?.userId    || currentUser.id;
      scan.userName  = existing?.userName  || currentUser.name;
      scan.photoUrls = existing?.photoUrls || [];
      // Reemplazar en el array — eliminar TODOS los duplicados con mismo id/fbId
      localScans = localScans.filter(s =>
        s.id !== (existing?.id || editingScanId) &&
        (editFbId ? s.fbId !== editFbId : true)
      );
      localScans.push(scan);
    }
    editingScanId = null;
    // Restaurar botón guardar
    const btnGuardar = document.getElementById('btn-save-scan');
    if (btnGuardar) { btnGuardar.textContent = '✓ Guardar Registro'; btnGuardar.style.background = ''; }
  } else {
    localScans.push(scan);
  }
  // Persist photos to localStorage — survives app close/reload
  if (scan.photos && scan.photos.length > 0) {
    try { localStorage.setItem('scancheck_photos_' + scan.id, JSON.stringify(scan.photos)); } catch(e) { console.warn('Photo storage failed:', e.message); }
  }
  // Persist scan list (without photos, to save space)
  try {
    const scansForStorage = localScans.map(({photos,...s}) => ({...s, photoCount:(photos||[]).length}));
    localStorage.setItem('scancheck_local_scans_' + currentUser.id, JSON.stringify(scansForStorage));
  } catch(e) {}
  updateStats(); renderTodayList();
  showPage('home');
  showToast('✓ Scanner registrado','success');

  // Save to Firebase (or queue if offline)
  // En modo edición usamos updateDoc sobre el documento existente (mismo fbId)
  // En modo creación usamos addDoc (fbSaveScan devuelve el nuevo fbId)
  // Fallback: si el bloque de edición en memoria no encontró el existing y no
  // asignó fbId, lo tomamos directamente de editingScanId para no crear duplicado
  // Si estábamos editando pero el bloque de memoria no encontró el scan (raro),
  // buscamos el fbId directamente para no crear un duplicado con fbSaveScan
  if (!scan.fbId && editingScanId) {
    const src = localScans.find(s => s.id===editingScanId || s.fbId===editingScanId);
    if (src?.fbId) scan.fbId = src.fbId;
  }
  const isEdit = !!scan.fbId;
  if (navigator.onLine) {
    setSyncStatus('syncing');
    try {
      let fbId;
      if (isEdit) {
        try {
          await fbReplaceScan(scan.fbId, {...scan});
          console.log('[Edit] Firestore reemplazado OK, fbId:', scan.fbId);
          fbId = scan.fbId;
        } catch(e) {
          console.error('[Edit] ERROR en fbReplaceScan:', e.message);
          fbId = scan.fbId;
        }
      } else {
        // Verificar que no exista ya un documento con este id local en Firestore
        // (puede pasar si una edición anterior falló a medias y quedó un fbId huérfano)
        // Si existe, usamos fbReplaceScan en vez de crear un duplicado
        const existingInFb = (await window.fbGetMyScans(scan.userId))
          .find(s => s.id === scan.id && s.fbId && s.fbId !== scan.fbId);
        if (existingInFb?.fbId) {
          console.warn('[Save] Documento duplicado detectado, reemplazando en vez de crear:', existingInFb.fbId);
          await fbReplaceScan(existingInFb.fbId, {...scan, fbId: existingInFb.fbId});
          fbId = existingInFb.fbId;
        } else {
          fbId = await fbSaveScan(scan);
        }
      }
      // Importante: guardar el fbId devuelto tanto en el objeto en memoria como
      // en localStorage. Sin esto, si el técnico borra el registro en la MISMA
      // sesión (sin recargar la página), deleteScanFromModal() no encuentra
      // fbId y el borrado lógico nunca llega a tocar Firestore — el registro
      // "eliminado" reaparecería intacto al recargar.
      scan.fbId = fbId;
      const idx = localScans.findIndex(s => s.id === scan.id);
      if (idx !== -1) localScans[idx].fbId = fbId;
      try {
        const scansForStorage = localScans.map(({photos,...s}) => ({...s, photoCount:(photos||[]).length}));
        localStorage.setItem('scancheck_local_scans_' + currentUser.id, JSON.stringify(scansForStorage));
      } catch(e) {}
      setSyncStatus('ok');
      // Subir fotos a R2 en segundo plano (no bloquea el flujo principal).
      // Capturamos el fbId en una const local para que el closure de la Promise
      // siempre tenga el valor correcto independientemente del scope externo.
      if (scan.photos && scan.photos.length > 0 && navigator.onLine) {
        const scanFbId = fbId; // captura explícita para el closure
        uploadPhotosToR2(scanFbId, scan.photos).then(async urls => {
          if (urls.length > 0) {
            scan.photoUrls = urls;
            if (idx !== -1) localScans[idx].photoUrls = urls;
            // Persistir las URLs en Firestore usando updateDoc directo
            try {
              await fbUpdateScan(scanFbId, { photoUrls: urls });
              console.log(`✓ ${urls.length} foto(s) subidas a R2 y URLs guardadas en Firestore`);
            } catch(e) {
              console.warn('Error guardando photoUrls en Firestore:', e.message);
            }
          }
        }).catch(e => console.warn('Error subiendo fotos a R2:', e.message));
      }
    } catch(e) {
      setSyncStatus('error');
      queueAdd('scan', scan);
      showToast('Guardado local. Se sincronizará al reconectar','');
    }
  } else {
    queueAdd('scan', scan);
    setSyncStatus('offline');
  }
}
window.saveScan = saveScan;

// ======== VIEW SCAN MODAL ========
async function viewScan(id) {
  const scan = localScans.find(s=>(s.id===id||s.fbId===id));
  if (!scan) return;
  modalScanId = id;
  // Prioridad de fotos:
  // 1) URLs de R2 (válidas en cualquier dispositivo, preferidas)
  // 2) base64 en memoria (solo disponible en el dispositivo que las tomó)
  // 3) Cargar desde R2 si no hay nada
  let photoSrcs = scan.photoUrls && scan.photoUrls.length > 0
    ? scan.photoUrls
    : scan.photos && scan.photos.length > 0
      ? scan.photos
      : [];
  if (photoSrcs.length === 0 && navigator.onLine) {
    const scanKey = scan.fbId || scan.id;
    photoSrcs = await loadPhotosFromR2(scanKey);
    if (photoSrcs.length > 0) {
      scan.photoUrls = photoSrcs;
    }
  }
  const photos = photoSrcs.map(p=>`<img src="${p}" class="modal-photo" style="margin-bottom:6px" alt="foto">`).join('');
  document.getElementById('modal-scan-content').innerHTML = `
    ${photos||'<div style="height:70px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:12px;background:var(--bg3);border-radius:10px;margin-bottom:14px">Sin fotos</div>'}

    <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:4px 0 6px">General</div>
    <div class="modal-fields">
      ${fTag('Paso',scan.paso)} ${fTag('Puesto',scan.puesto)}
      ${fTag('Tipo',opLabel(scan.opType))}
      ${scan.jiraTicket?fTagHtml('Jira',jiraTicketLink(scan.jiraTicket)):''}
      <div style="font-size:11px;color:var(--text3);font-family:var(--mono);grid-column:1/-1">${new Date(scan.timestamp).toLocaleString('es-AR')}</div>
      ${scan.address?`<div style="font-size:11px;color:var(--text3);grid-column:1/-1">📍 ${escHtml(scan.address)}</div>`:''}
    </div>

    <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">🖨 Scanner DESKO</div>
    <div class="modal-fields">
      ${scan.scannerSerie?fTag('Serie',scan.scannerSerie):''} ${scan.scannerModelo?fTag('Modelo',scan.scannerModelo):''}
      ${scan.scannerEstado?fTag('Estado',scan.scannerEstado):''}
      ${scan.invDnd?fTag('N° Inv. DND',scan.invDnd):''} ${scan.invDnm?fTag('N° Inv. DNM',scan.invDnm):''}
      ${scan.serieRetira?fTag('Serie retira',scan.serieRetira):''} ${scan.serieNuevo?fTag('Serie nueva',scan.serieNuevo):''}
      ${scan.instalacionReemplazoData?fTag('Equipo retirado',`${scan.instalacionReemplazoData.marcaVieja} — ${scan.instalacionReemplazoData.serieVieja}`):''}
    </div>

    ${(scan.assureEngine && scan.assureEngine!=='No instalado')?`
    <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">🔑 AssureID</div>
    <div class="modal-fields">
      ${fTag('Engine',scan.assureEngine)} ${fTag('DocLib',scan.assureDocLib)}
      ${scan.assureLicKey&&scan.assureLicKey!=='N/A'?fTag('License Key',scan.assureLicKey):''}
    </div>`:''}

    <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">💻 PC</div>
    <div class="modal-fields">
      ${scan.pcNombre?fTag('Nombre PC',scan.pcNombre):''} ${fTag('Serie PC',scan.serie)}
    </div>
    ${datosSistemaHtml(scan.datosSistema)}

    <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">✅ Checklists</div>
    ${scan.opType==='instalacion_nueva'||scan.opType==='instalacion_reemplazo'?checklistInstalacionHtml(scan.checklistInstalacion):checklistHtml(scan.checklist)}
    ${scan.opType==='reemplazo'?fallaChecklistHtml(scan.actaReemplazo):''}
    ${scan.opType==='falla_reparable'?fallaReparableHtml(scan.fallaReparable):''}
    ${scan.opType==='cambio_equipo'?fallaChecklistHtml(scan.actaReemplazo):''}

    ${scan.notas?`<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">📝 Notas</div><div class="modal-notas">${notasListHtml(scan.notas)}</div>`:''}

    ${scan.opType==='reemplazo'||scan.opType==='cambio_equipo'?`<button class="btn-secondary" style="margin-top:10px;width:100%" onclick="downloadActaReemplazo('${id}')">📄 Descargar Acta de Reemplazo</button>`:''}

    ${!scanTieneInforme(scan) ? `<button class="btn-secondary" style="margin-top:12px;width:100%;border-color:var(--accent);color:var(--accent)" onclick="editScan('${id}')">✏️ Editar registro</button>` : ''}
  `;
  document.getElementById('modal-scan').classList.remove('hidden');
}
window.viewScan = viewScan;

// Devuelve true si el scan ya tiene informe cerrado (en cuyo caso no se puede editar)
function scanTieneInforme(scan) {
  const id = scan.id || scan.fbId;
  return localReports.some(r =>
    !r.eliminado && (r.scanIds||[]).some(sid => sid === id || sid === scan.id || sid === scan.fbId)
  );
}

// Abre el formulario de registro pre-completado con los datos del scan para editarlo
function editScan(id) {
  const scan = localScans.find(s => s.id===id || s.fbId===id);
  if (!scan) return;
  if (scanTieneInforme(scan)) { showToast('Este registro ya tiene informe — no se puede editar','error'); return; }

  // Cerrar el modal actual
  document.getElementById('modal-scan').classList.add('hidden');

  // Guardar referencia al scan que se está editando
  editingScanId = id;

  // Navegar al formulario — resetNewScanForm() se llama automáticamente dentro de showPage
  // IMPORTANTE: guardamos el ID antes de llamar showPage porque resetNewScanForm()
  // limpia editingScanId. Lo restauramos dentro del setTimeout.
  const savedEditId = id;
  window._keepEditId = true; // evitar que resetNewScanForm limpie editingScanId
  editingScanId = savedEditId; // setear ANTES del showPage
  showPage('new-scan');

  setTimeout(() => {
    // Confirmar editingScanId por si algo lo limpió
    editingScanId = savedEditId;
    // Preseleccionar el tipo de operación
    const opKey = scan.opType==='mantenimiento' ? 'mantenimiento'
                : (scan.opType==='instalacion_nueva'||scan.opType==='instalacion_reemplazo') ? 'instalacion'
                : 'incidencia';
    const opBtn = document.querySelector(`.op-btn[data-op="${opKey}"]`);
    if (opBtn) setOpType(opKey, opBtn);

    // Pre-completar campos
    const setVal = (id, val) => { const el = document.getElementById(id); if (el && val != null) el.value = val; };
    setVal('inp-paso', scan.paso);
    setVal('inp-puesto', scan.puesto);
    setVal('inp-serie', scan.serie);
    setVal('inp-scanner-serie', scan.scannerSerie);
    setVal('inp-scanner-modelo', scan.scannerModelo);
    setVal('inp-notas', scan.notas);
    setVal('inp-inv-dnd', scan.invDnd);
    setVal('inp-inv-dnm', scan.invDnm);

    // Estado scanner
    const estadoEl = document.getElementById('inp-scanner-estado');
    if (estadoEl && scan.scannerEstado) {
      estadoEl.value = scan.scannerEstado;
      estadoEl.classList.toggle('select-placeholder', !scan.scannerEstado);
    }

    // Series incidencia / cambio equipo
    if (scan.serieRetira) setVal('inp-serie-retira', scan.serieRetira);
    if (scan.serieNuevo)  setVal('inp-serie-nuevo',  scan.serieNuevo);
    if (scan.actaReemplazo?.nuevoMarcaModelo) setVal('inp-nuevo-marca-modelo', scan.actaReemplazo.nuevoMarcaModelo);

    // Restaurar datos del QR en variables globales y el preview
    if (scan.datosSistema) {
      Object.assign(qrDatosSistema, scan.datosSistema);
      const preview = Object.entries(scan.datosSistema).map(([k,v])=>`${k}: ${v}`).join('\n');
      const el = document.getElementById('qr-data-preview');
      if (el) { el.textContent = preview; el.classList.remove('hidden'); }
    }

    // Restaurar fotos — las URLs de R2 se usan como thumbnails
    capturedPhotos = (scan.photoUrls||scan.photos||[]).map(p =>
      typeof p === 'string' ? { dataUrl: p, info: '' } : p
    );
    renderPhotosGrid();

    // Restaurar checklist — mapeo explícito porque las claves del objeto (camelCase)
    // no coinciden directamente con los IDs del HTML (kebab-case)
    if (scan.checklist) {
      const chkMap = {
        vidrio:             'chk-vidrio',
        cableUsb:           'chk-cable-usb',
        fuente:             'chk-fuente',
        limpieza:           'chk-limpieza',
        updateAssureId:     'chk-update-assureid',
        updateLibrerias:    'chk-update-librerias',
        autoInicioDocAuth:  'chk-autoinicio-doc-auth',
        autoInicioSentinel: 'chk-autoinicio-sentinel'
      };
      Object.entries(chkMap).forEach(([key, elId]) => {
        const el = document.getElementById(elId);
        if (el) el.checked = !!scan.checklist[key];
      });
    }
    if (scan.checklistInstalacion) {
      const chkiMap = {
        fuenteConectada:      'chki-fuente-conectada',
        usb3:                 'chki-usb3',
        driversDesko:         'chki-drivers-desko',
        libreriasDesko:       'chki-librerias-desko',
        aplicativosDesko:     'chki-aplicativos-desko',
        assureIdLibrerias:    'chki-assureid-librerias',
        autoInicioDocAuth:    'chki-autoinicio-doc-auth',
        autoInicioSentinel:   'chki-autoinicio-sentinel',
        settingsSensitivity:  'chki-settings-sensitivity',
        pruebaRevealId:       'chki-prueba-revealid',
        pruebaSicam:          'chki-prueba-sicam',
        loggingFilter:        'chki-logging-filter'
      };
      Object.entries(chkiMap).forEach(([key, elId]) => {
        const el = document.getElementById(elId);
        if (el) el.checked = !!scan.checklistInstalacion[key];
      });
    }

    // Cambiar botón Guardar a "Actualizar registro"
    const btnGuardar = document.getElementById('btn-save-scan');
    if (btnGuardar) {
      btnGuardar.textContent = '✓ Actualizar registro';
      btnGuardar.style.background = 'var(--warning)';
    }

    showToast('Editando registro — modificá los campos y guardá', 'success');
  }, 50);
}
window.editScan = editScan;

function fTag(label,val) { return val?`<div class="field-tag"><span>${label}</span><strong>${escHtml(val)}</strong></div>`:''; }
function fTagHtml(label,htmlVal) { return htmlVal?`<div class="field-tag"><span>${label}</span><strong>${htmlVal}</strong></div>`:''; }
function jiraTicketLink(key) { return key?`<a href="${JIRA_BASE_URL}/browse/${escHtml(key)}" target="_blank" style="color:var(--accent);text-decoration:underline">${escHtml(key)}</a>`:''; }

const CHECKLIST_LABELS = {
  vidrio:   'Estado de Vidrio/Vidrio protector',
  cableUsb: 'Estado Cable USB',
  fuente:   'Estado de Fuente de alimentación (15Vdc)',
  limpieza: 'Inspección visual y limpieza del scanner',
  updateAssureId:  'Actualización de AssureID',
  updateLibrerias: 'Actualización de Librerías',
  autoInicioDocAuth:  'Inicio Auto AssureID Document Authentication',
  autoInicioSentinel: 'Inicio Auto AssureID Sentinel Rest API'
};

const CHECKLIST_INSTALACION_LABELS = {
  fuenteConectada:     'Fuente Conectada',
  usb3:                'USB 3.0',
  driversDesko:        'Drivers DESKO',
  libreriasDesko:      'Librerías DESKO',
  aplicativosDesko:    'Aplicativos DESKO',
  assureIdLibrerias:   'AssureID Librerías',
  autoInicioDocAuth:   'Inicio Auto AssureID Document Authentication',
  autoInicioSentinel:  'Inicio Auto AssureID Sentinel Rest API',
  settingsSensitivity: 'AssureID Settings/Authentication/Sensitivity Low',
  loggingFilter:       'Logging Filter Solo marcar Fatal Errors',
  pruebaRevealId:      'Prueba Reveal ID',
  pruebaSicam:         'Prueba Sicam'
};

// Renderiza el checklist de instalación como lista de items con OK/— (mismo estilo que checklistHtml)
function checklistInstalacionHtml(checklist) {
  if (!checklist) return '';
  const items = Object.keys(CHECKLIST_INSTALACION_LABELS).map(key => {
    const ok = !!checklist[key];
    return `<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
      <span style="font-size:12px;font-weight:700;color:${ok?'var(--accent)':'var(--text3)'};min-width:28px">${ok?'OK':'—'}</span>
      <span style="font-size:12px;color:${ok?'var(--text)':'var(--text3)'}">${escHtml(CHECKLIST_INSTALACION_LABELS[key])}</span>
    </div>`;
  }).join('');
  return `<div style="background:var(--bg3);border-radius:10px;padding:10px 12px;margin:8px 0">${items}</div>`;
}
function checklistInstalacionLines(checklist) {
  if (!checklist) return [];
  return Object.keys(CHECKLIST_INSTALACION_LABELS).map(key => `${checklist[key]?'OK':'—'} — ${CHECKLIST_INSTALACION_LABELS[key]}`);
}

// Renderiza el checklist como lista de items con OK/— según corresponda (para modal, vista de informe, etc.)
function checklistHtml(checklist) {
  if (!checklist) return '';
  const items = Object.keys(CHECKLIST_LABELS).map(key => {
    const ok = !!checklist[key];
    return `<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
      <span style="font-size:12px;font-weight:700;color:${ok?'var(--accent)':'var(--text3)'};min-width:28px">${ok?'OK':'—'}</span>
      <span style="font-size:12px;color:${ok?'var(--text)':'var(--text3)'}">${escHtml(CHECKLIST_LABELS[key])}</span>
    </div>`;
  }).join('');
  return `<div style="background:var(--bg3);border-radius:10px;padding:10px 12px;margin:8px 0">${items}</div>`;
}
// Checklist de "Tipo de falla detectada" (Acta de Reemplazo), para mostrar en pantalla junto al checklist general
function fallaChecklistHtml(actaReemplazo) {
  const fk = actaReemplazo?.fallaChecklist;
  if (!fk) return '';
  const items = Object.keys(FALLA_LABELS).map(key => {
    const ok = !!fk[key];
    return `<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
      <span style="font-size:12px;font-weight:700;color:${ok?'var(--warning)':'var(--text3)'};min-width:28px">${ok?'OK':'—'}</span>
      <span style="font-size:12px;color:${ok?'var(--text)':'var(--text3)'}">${escHtml(FALLA_LABELS[key])}</span>
    </div>`;
  }).join('');
  const otroItem = fk.otro ? `<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
      <span style="font-size:12px;font-weight:700;color:var(--warning);min-width:28px">OK</span>
      <span style="font-size:12px;color:var(--text)">Otro: ${escHtml(fk.otroTexto||'(sin especificar)')}</span>
    </div>` : '';
  return `<div style="margin:8px 0">
    <div style="font-size:11px;font-weight:700;color:var(--warning);margin-bottom:4px">TIPO DE FALLA DETECTADA (Acta de Reemplazo)</div>
    <div style="background:var(--bg3);border-radius:10px;padding:10px 12px">${items}${otroItem}</div>
  </div>`;
}

const FALLA_REPARABLE_LABELS = {
  fuente:   'Falla Fuente de Alimentación',
  cristal:  'Protector de cristal roto/rayado',
  usb:      'Falla de conexión USB / Cables / comunicación con estación de trabajo',
  software: 'Problemas de configuración / Actualización de Software',
  esponja:  'Reemplazo de esponja'
};
function fallaReparableHtml(fallaReparable) {
  if (!fallaReparable) return '';
  const items = Object.keys(FALLA_REPARABLE_LABELS).map(key => {
    const ok = !!fallaReparable[key];
    return `<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
      <span style="font-size:12px;font-weight:700;color:${ok?'var(--accent)':'var(--text3)'};min-width:28px">${ok?'OK':'—'}</span>
      <span style="font-size:12px;color:${ok?'var(--text)':'var(--text3)'}">${escHtml(FALLA_REPARABLE_LABELS[key])}</span>
    </div>`;
  }).join('');
  const otroItem = fallaReparable.otro ? `<div style="display:flex;align-items:center;gap:6px;padding:3px 0">
      <span style="font-size:12px;font-weight:700;color:var(--accent);min-width:28px">OK</span>
      <span style="font-size:12px;color:var(--text)">Otro: ${escHtml(fallaReparable.otroTexto||'')}</span>
    </div>` : '';
  return `<div style="margin:8px 0">
    <div style="font-size:11px;font-weight:700;color:var(--accent);margin-bottom:4px">FALLA REPARADA EN SITIO</div>
    <div style="background:var(--bg3);border-radius:10px;padding:10px 12px">${items}${otroItem}</div>
  </div>`;
}
function fallaReparableLines(fallaReparable) {
  if (!fallaReparable) return [];
  const lines = Object.keys(FALLA_REPARABLE_LABELS).map(key => `${fallaReparable[key]?'OK':'—'} — ${FALLA_REPARABLE_LABELS[key]}`);
  if (fallaReparable.otro) lines.push(`OK — Otro: ${fallaReparable.otroTexto||''}`);
  return lines;
}

// Muestra los datos del sistema (disco, USB, uptime) capturados del QR del ps1 v2
// Convierte el texto de notas (líneas separadas por \n, generadas automáticamente
// desde el QR o escritas a mano) en una lista visual prolija, en vez de texto
// corrido — un <div> normal colapsa los saltos de línea simples, por eso antes
// se veía todo seguido pese a tener \n internamente.
function notasListHtml(notas) {
  if (!notas || !notas.trim()) return '';
  const lineas = notas.split('\n').map(l => l.trim()).filter(Boolean);
  const items = lineas.map(linea => {
    const esAlerta = linea.startsWith('⚠');
    const texto = esAlerta ? linea.replace(/^⚠\s*/, '') : linea;
    const esSeparador = linea.startsWith('---') && linea.endsWith('---');
    if (esSeparador) {
      return `<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 2px">${escHtml(linea.replace(/-/g,'').trim())}</div>`;
    }
    return `<div style="display:flex;gap:6px;padding:2px 0;font-size:12px;color:${esAlerta?'var(--warning)':'var(--text2)'}">
      <span style="flex-shrink:0">${esAlerta?'⚠':'•'}</span>
      <span style="${esAlerta?'font-weight:600':''}">${escHtml(texto)}</span>
    </div>`;
  }).join('');
  return `<div style="margin-top:4px">${items}</div>`;
}

function datosSistemaHtml(ds) {
  if (!ds || !Object.keys(ds).length) return '';
  const smartColor = ds.discoSMART === 'Healthy' ? 'var(--accent)' : ds.discoSMART ? 'var(--warning)' : 'var(--text3)';
  const usbColor = ds.usbErrores === '0' || ds.usbErrores === 0 ? 'var(--accent)' : 'var(--danger)';
  const reinColor = ds.reinPend === 'No' ? 'var(--accent)' : 'var(--warning)';
  let rows = '';
  if (ds.uptime)      rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Uptime</span><span>${escHtml(ds.uptime)}</span></div>`;
  if (ds.ultimoRein)  rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Último reinicio</span><span>${escHtml(ds.ultimoRein)}</span></div>`;
  if (ds.reinPend)    rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Reinicio pendiente</span><span style="color:${reinColor};font-weight:700">${escHtml(ds.reinPend)}</span></div>`;
  if (ds.updPend)     rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Updates de Windows pendientes</span><span style="color:${ds.updPend==='0'?'var(--accent)':'var(--warning)'};font-weight:700">${escHtml(ds.updPend)}</span></div>`;
  if (ds.discoModelo) rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Disco</span><span>${escHtml(ds.discoModelo)} (${escHtml(ds.discoTipo||'')})</span></div>`;
  if (ds.discoSMART)  rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Estado SMART</span><span style="color:${smartColor};font-weight:700">${escHtml(ds.discoSMART)}</span></div>`;
  if (ds.discoTotalGB)rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Espacio disco C:</span><span>${escHtml(ds.discoLibreGB)} GB libres / ${escHtml(ds.discoTotalGB)} GB (${escHtml(ds.discoUsoPct)}% uso)</span></div>`;
  if (ds.discoTempC && ds.discoTempC!=='N/D') rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Temp. disco</span><span>${escHtml(ds.discoTempC)}°C</span></div>`;
  if (ds.usbTotal)    rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">USB detectados</span><span>${escHtml(ds.usbTotal)} disp. — <span style="color:${usbColor};font-weight:700">${escHtml(ds.usbErrores)} con error</span></span></div>`;
  if (ds.servicioEstado) {
    const servicioColor = ds.servicioEstado.toLowerCase().includes('corriendo') ? 'var(--accent)' : 'var(--warning)';
    rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">Servicio AssureID</span><span style="color:${servicioColor};font-weight:700">${escHtml(ds.servicioEstado)}</span></div>`;
  }
  if (ds.docLibFecha) rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:12px"><span style="color:var(--text3)">DocLib actualizado</span><span>${escHtml(ds.docLibFecha)}</span></div>`;
  if (ds.docLibRuta)  rows += `<div style="display:flex;justify-content:space-between;padding:3px 0;font-size:11px;gap:8px"><span style="color:var(--text3);white-space:nowrap">DocLib ruta</span><span style="text-align:right;word-break:break-all">${escHtml(ds.docLibRuta)}</span></div>`;
  if (!rows) return '';
  return `<div style="margin:8px 0">
    <div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:4px">💻 ESTADO DEL SISTEMA (PC)</div>
    <div style="background:var(--bg3);border-radius:10px;padding:10px 12px">${rows}</div>
  </div>`;
}

// Versión para el PDF (texto plano, sin HTML) — array de líneas "OK/— — etiqueta"
function checklistLines(checklist) {
  if (!checklist) return [];
  return Object.keys(CHECKLIST_LABELS).map(key => `${checklist[key]?'OK':'—'} — ${CHECKLIST_LABELS[key]}`);
}
// Líneas del checklist de "Tipo de falla detectada" (Acta de Reemplazo), para mostrar también
// en el informe PDF general cuando el registro es un reemplazo.
function fallaChecklistLines(actaReemplazo) {
  const fk = actaReemplazo?.fallaChecklist;
  if (!fk) return [];
  const lines = Object.keys(FALLA_LABELS).map(key => `${fk[key]?'OK':'—'} — ${FALLA_LABELS[key]}`);
  if (fk.otro) lines.push(`OK — Otro: ${fk.otroTexto || '(sin especificar)'}`);
  return lines;
}

// Convierte el trazo verde de la firma (dibujado así en pantalla) a negro, solo para uso en PDFs.
// La firma en pantalla se mantiene verde; esta función no modifica el dato guardado.
function signatureToBlack(sigDataUrl) {
  return new Promise((resolve) => {
    if (!sigDataUrl) { resolve(null); return; }
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        if (px[i+3] > 0) { px[i] = 0; px[i+1] = 0; px[i+2] = 0; } // mismo alpha, RGB → negro
      }
      ctx.putImageData(data, 0, 0);
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => resolve(sigDataUrl); // si falla la conversión, usar la original como respaldo
    img.src = sigDataUrl;
  });
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
window.closeModal = closeModal;

async function deleteScanFromModal() {
  if (!modalScanId) return;
  if (!confirm('¿Eliminar este registro?')) return;
  const scan = localScans.find(s=>(s.id===modalScanId||s.fbId===modalScanId));
  localScans = localScans.filter(s=>(s.id!==modalScanId&&s.fbId!==modalScanId));
  closeModal('modal-scan'); updateStats(); renderTodayList();
  showToast('Registro eliminado');

  // Borrado lógico — el documento sigue en Firestore (eliminado:true) para no
  // perder datos de métricas; solo deja de aparecer en la lista del técnico.
  if (scan?.fbId) {
    try { await fbSoftDeleteScan(scan.fbId, currentUser?.id); } catch(e) {}
    return;
  }

  // Si el scan local no tenía fbId guardado (se guardó offline y nunca se
  // refrescó el objeto local tras sincronizar), buscamos en Firestore un scan
  // que coincida, para no dejar el documento sin marcar — de lo contrario,
  // al recargar la app, ese registro "eliminado" reaparecería intacto desde
  // la nube, porque nunca se tocó el documento remoto.
  if (scan) {
    try {
      const remotos = await fbGetMyScans(currentUser.id);
      const match = remotos.find(s =>
        s.timestamp === scan.timestamp &&
        s.serie === scan.serie &&
        s.paso === scan.paso
      );
      if (match?.fbId) await fbSoftDeleteScan(match.fbId, currentUser?.id);
    } catch(e) {}
  }
}
window.deleteScanFromModal = deleteScanFromModal;
window.fbDeleteScan = fbDeleteScan;
window.fbGetAllReports = fbGetAllReports;
window.fbGetMyScans = fbGetMyScans;
window.getInternalScans = () => localScans;
window.getOrphanScans = getOrphanScans;
window.getInternalReports = () => localReports;
window.debugOrphans = () => {
  const reportedIds = new Set(localReports.filter(r=>!r.eliminado).flatMap(r=>r.scanIds||[]));
  console.log('reportedIds:', [...reportedIds]);
  const result = localScans.map(s=>({
    id: s.id, fbId: s.fbId, eliminado: s.eliminado,
    enInforme: reportedIds.has(s.id)||reportedIds.has(s.fbId)
  }));
  console.table(result);
  const orphans = localScans.filter(s => !s.eliminado && !reportedIds.has(s.id) && !reportedIds.has(s.fbId));
  console.log('Huérfanos encontrados:', orphans.length);
  return orphans;
};
window.fbUpdateScan = fbUpdateScan;
window.fbGetMyViajes = fbGetMyViajes;
window.fbGetAllViajes = fbGetAllViajes;
window.fbReplaceScan = fbReplaceScan;
window.fbDeleteReport = fbDeleteReport;
window.getLocalReports = () => localReports;
window.getLocalScans = () => localScans;

// ======== CLOSE DAY / REPORT ========
let pendingReportQueue = []; // cola de grupos {paso, scans} pendientes de generar informe, uno por Paso
let pendingReportTotal = 0;  // cantidad total de informes en esta tanda (para mostrar "Informe X de Y")

function closeDayReport() {
  // Buscamos TODOS los registros sin informe todavía, no solo los de hoy —
  // si un técnico se olvida de cerrar el día, esos registros no deben quedar
  // huérfanos para siempre. Se agrupan por Paso + categoría + FECHA real de
  // cada registro, así un registro del lunes nunca se mezcla con uno del
  // martes, ni con uno de otro Paso, aunque todos queden pendientes juntos.
  const reportedScanIds = new Set(localReports.flatMap(r => r.scanIds || []));
  const scans = localScans.filter(s => !reportedScanIds.has(s.id||s.fbId));
  if (!scans.length) { showToast('No hay registros pendientes','error'); return; }

  // Agrupar por Paso + categoría de ticket (Incidencia vs Solicitud) + fecha —
  // un informe independiente por cada combinación distinta, para que el tipo
  // de ticket en Jira sea siempre homogéneo (no se mezclan Mantenimiento/
  // Instalación con Incidencias) y para que días distintos del mismo Paso no
  // se mezclen entre sí si quedaron pendientes de cerrar varios días seguidos.
  // Las Incidencias además NO se agrupan entre sí ni siquiera dentro del mismo
  // Paso/día: cada equipo con falla suele corresponder a un ticket de cliente
  // distinto en Jira, así que cada registro de Incidencia genera su propio
  // informe individual.
  const categoriaDe = (opType) => (opType === 'cambio_equipo' || opType === 'falla_reparable' || opType === 'reemplazo')
    ? 'Incidencia' : 'Solicitud';

  const groups = new Map();
  scans.forEach(s => {
    const paso = (s.paso||'').trim() || '(Sin paso especificado)';
    const categoria = categoriaDe(s.opType);
    const fecha = localDateKey(s.timestamp);
    // Incidencia: clave única por scan (id) → nunca se agrupa con otro registro.
    // Solicitud: clave por paso+categoria+fecha → se agrupan solo si son del
    // mismo Paso Y del mismo día.
    const key = categoria === 'Incidencia' ? `incidencia|||${s.id||s.fbId}` : `${paso}|||${categoria}|||${fecha}`;
    if (!groups.has(key)) groups.set(key, { paso, categoria, fecha, scans: [] });
    groups.get(key).scans.push(s);
  });

  // Ordenar los informes pendientes por fecha (más viejo primero), para que
  // el técnico los vaya firmando en orden cronológico.
  const gruposOrdenados = Array.from(groups.values()).sort((a,b) => a.fecha.localeCompare(b.fecha));

  pendingReportQueue = gruposOrdenados.map(({paso, categoria, fecha, scans}) => ({
    paso: categoria === 'Incidencia' ? `${paso} (Incidencia)` : paso,
    scans,
    fecha
  }));
  pendingReportTotal = pendingReportQueue.length;
  showNextPendingReport();
}
window.closeDayReport = closeDayReport;

// ── VIAJES ───────────────────────────────────────────────────
async function loadViajes() {
  try {
    const todos = await fbGetMyViajes(currentUser.id);
    localViajes = todos.filter(v => !v.eliminado);
    viajeAbierto = localViajes.find(v => v.estado === 'abierto') || null;
    // Si Firestore no tiene viaje abierto pero sí hay uno en localStorage
    // (por ejemplo si la app se recargó antes de sincronizar), restaurarlo
    if (!viajeAbierto) {
      try {
        const stored = localStorage.getItem('scancheck_viaje_abierto_'+currentUser.id);
        if (stored) {
          const v = JSON.parse(stored);
          // Solo restaurar si tiene menos de 7 días (viaje muy viejo probablemente es basura)
          const age = Date.now() - new Date(v.fechaSalida).getTime();
          if (age < 7*24*60*60*1000) viajeAbierto = v;
          else localStorage.removeItem('scancheck_viaje_abierto_'+currentUser.id);
        }
      } catch(e) {}
    }
  } catch(e) {
    localViajes = [];
    // Si Firestore falla, intentar con localStorage
    try {
      const stored = localStorage.getItem('scancheck_viaje_abierto_'+currentUser.id);
      if (stored) viajeAbierto = JSON.parse(stored);
    } catch(e2) {}
  }
  renderViajes();
  renderViajeAbiertoBanner();
}

function renderViajeAbiertoBanner() {
  const el = document.getElementById('viaje-abierto-banner');
  if (!el) return;
  if (!viajeAbierto) { el.innerHTML = ''; return; }
  const km = viajeAbierto.kmSalida;
  const fecha = new Date(viajeAbierto.fechaSalida).toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short'});
  el.innerHTML = `<div style="background:rgba(0,212,170,.12);border:1px solid rgba(0,212,170,.3);border-radius:12px;padding:12px 16px;margin-bottom:16px">
    <div style="font-size:12px;font-weight:700;color:var(--accent);margin-bottom:4px">🚗 Viaje en curso</div>
    <div style="font-size:13px;color:var(--text)">Salida: ${fecha} · ${km.toLocaleString()} km</div>
    ${viajeAbierto.destinoLabel?`<div style="font-size:12px;color:var(--text2)">Destino: ${escHtml(viajeAbierto.destinoLabel)}</div>`:''}
    <button class="btn-primary" style="width:100%;margin-top:10px" onclick="showCerrarViaje()">🏁 Registrar llegada</button>
  </div>`;
}

function renderViajes() {
  const el = document.getElementById('viajes-list');
  if (!el) return;
  const cerrados = localViajes.filter(v => v.estado === 'cerrado');
  if (cerrados.length === 0) { el.innerHTML = '<div class="empty-state"><p>Sin viajes cerrados</p></div>'; return; }
  // Agrupar por mes
  const byMes = {};
  cerrados.forEach(v => {
    const mes = v.fechaSalida?.substring(0,7) || '—';
    if (!byMes[mes]) byMes[mes] = [];
    byMes[mes].push(v);
  });
  el.innerHTML = Object.keys(byMes).sort((a,b)=>b.localeCompare(a)).map(mes => {
    const label = new Date(mes+'-15').toLocaleDateString('es-AR',{month:'long',year:'numeric'});
    const totalKm = byMes[mes].reduce((s,v)=>s+(v.kmRecorridos||0),0);
    const items = byMes[mes].map(v => {
      const fechaSal = new Date(v.fechaSalida).toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short'});
      const fechaLleg = v.fechaLlegada ? new Date(v.fechaLlegada).toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short'}) : '—';
      return `<div style="background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border);position:relative"><button onclick="eliminarViaje('${v.fbId}')" title="Eliminar viaje" style="position:absolute;top:8px;right:8px;background:transparent;border:none;color:rgba(238,85,51,.5);font-size:16px;cursor:pointer;padding:2px;line-height:1">🗑</button>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--text)">${escHtml(v.destinoLabel||'Sin destino especificado')}</div>
            <div style="font-size:11px;color:var(--text3)">Salida: ${fechaSal} · Llegada: ${fechaLleg}</div>
            <div style="font-size:11px;color:var(--text3)">Od. salida: ${v.kmSalida?.toLocaleString()} km → Od. llegada: ${v.kmLlegada?.toLocaleString()||'—'} km</div>
            ${v.distanciaGPS?`<div style="font-size:11px;color:var(--text3)">Distancia GPS estimada: ~${v.distanciaGPS} km</div>`:''}
          </div>
          <div style="text-align:right;flex-shrink:0;padding-left:12px">
            <div style="font-size:22px;font-weight:700;color:var(--accent)">${(v.kmRecorridos||0).toLocaleString()}</div>
            <div style="font-size:10px;color:var(--text3)">km</div>
          </div>

        </div>

      </div>`;
    }).join('');
    return `<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:8px 0 4px">${label} — Total: ${totalKm.toLocaleString()} km</div>${items}`;
  }).join('');
}

function showIniciarViaje() {
  if (viajeAbierto) { showToast('Ya tenés un viaje en curso — registrá la llegada primero','error'); return; }
  const el = document.getElementById('modal-viaje-content');
  el.innerHTML = `
    <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:16px">🚗 Iniciar viaje</div>
    <div class="form-group">
      <label>Km odómetro de SALIDA *</label>
      <input type="number" id="inp-km-salida" placeholder="Ej: 125430" min="0" style="font-size:18px;font-weight:700">
    </div>
    <div class="form-group">
      <label>Destino / descripción del viaje</label>
      <input type="text" id="inp-viaje-destino" placeholder="Ej: Jama, Clorinda, Paso de los Libres..." maxlength="100">
    </div>
    <div class="form-group">
      <label>Vehículo (patente)</label>
      <input type="text" id="inp-viaje-vehiculo" placeholder="Ej: AB 123 CD" maxlength="20" value="${currentUser?.vehiculo||''}">
    </div>
    <div class="form-group">
      <label>Foto del odómetro de salida <span style="color:var(--text3);font-size:11px">(recomendado)</span></label>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="file" id="inp-foto-odometro-salida" accept="image/*" capture="environment" style="display:none" onchange="previewFotoOdometro(this,'preview-odo-salida')">
        <button type="button" onclick="document.getElementById('inp-foto-odometro-salida').click()" 
          style="padding:8px 14px;border-radius:8px;border:1px dashed var(--border2);background:var(--bg3);color:var(--text2);font-size:13px;cursor:pointer">
          📷 Sacar foto
        </button>
        <img id="preview-odo-salida" style="display:none;width:60px;height:45px;object-fit:cover;border-radius:6px;border:1px solid var(--border)">
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:8px">
      <button class="btn-secondary" style="flex:1" onclick="closeModal('modal-viaje')">Cancelar</button>
      <button class="btn-primary" style="flex:1" onclick="guardarInicioViaje()">Iniciar viaje</button>
    </div>`;
  document.getElementById('modal-viaje').classList.remove('hidden');
}

async function guardarInicioViaje() {
  const kmSalida = parseInt(document.getElementById('inp-km-salida')?.value);
  if (!kmSalida || kmSalida <= 0) { showToast('Ingresá el km del odómetro','error'); return; }
  const destino = document.getElementById('inp-viaje-destino')?.value.trim() || '';
  const vehiculo = document.getElementById('inp-viaje-vehiculo')?.value.trim() || '';
  // Subir foto del odómetro de salida a R2 si la adjuntaron
  let fotoOdometroSalidaUrl = null;
  const fotoInput = document.getElementById('inp-foto-odometro-salida');
  if (fotoInput?.files?.[0]) {
    try {
      const viajeId = 'vj_'+Date.now();
      const reader = new FileReader();
      const dataUrl = await new Promise(res => { reader.onload = e => res(e.target.result); reader.readAsDataURL(fotoInput.files[0]); });
      const blob = await (await fetch(dataUrl)).blob();
      const uploadRes = await fetch(`${PHOTOS_PROXY_URL}/upload/${viajeId}/odometro_salida.jpg`, {
        method: 'PUT', headers: { 'Content-Type': 'image/jpeg', 'X-ScanCheck-Token': PHOTOS_TOKEN }, body: blob
      });
      if (uploadRes.ok) fotoOdometroSalidaUrl = (await uploadRes.json()).url;
    } catch(e) { console.warn('Error subiendo foto odómetro:', e.message); }
  }

  // Capturar GPS de salida
  let latSalida = null, lonSalida = null;
  try {
    if (navigator.geolocation) {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {timeout:5000})
      );
      latSalida = pos.coords.latitude;
      lonSalida = pos.coords.longitude;
    }
  } catch(e) { console.warn('GPS salida no disponible:', e.message); }

  const viaje = {
    id: 'vj_'+Date.now(),
    userId: currentUser.id,
    userName: currentUser.name,
    vehiculo,
    fechaSalida: new Date().toISOString(),
    kmSalida,
    destinoLabel: destino,
    latSalida,
    lonSalida,
    fechaLlegada: null,
    kmLlegada: null,
    latLlegada: null,
    lonLlegada: null,
    kmRecorridos: null,
    distanciaGPS: null,
    fotoOdometroSalida: fotoOdometroSalidaUrl,
    estado: 'abierto',
    createdAt: new Date().toISOString()
  };
  localViajes.unshift(viaje);
  viajeAbierto = viaje;
  try { localStorage.setItem('scancheck_viaje_abierto_'+currentUser.id, JSON.stringify(viaje)); } catch(e) {}
  closeModal('modal-viaje');
  renderViajeAbiertoBanner();
  renderViajes();

  if (navigator.onLine) {
    try {
      const fbId = await fbSaveViaje(viaje);
      viaje.fbId = fbId;
      localViajes[0].fbId = fbId;
      // Actualizar localStorage con fbId
      try { localStorage.setItem('scancheck_viaje_abierto_'+currentUser.id, JSON.stringify(viaje)); } catch(e) {}
      showToast('✓ Viaje iniciado','success');
    } catch(e) {
      queueAdd('viaje', viaje);
      showToast('✓ Viaje iniciado (se sincronizará al recuperar conexión)','success');
    }
  } else {
    queueAdd('viaje', viaje);
    showToast('✓ Viaje iniciado sin conexión — se sincronizará automáticamente','success');
  }
}

function showCerrarViaje() {
  if (!viajeAbierto) return;
  const el = document.getElementById('modal-viaje-content');
  const kmSalida = viajeAbierto.kmSalida;
  el.innerHTML = `
    <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:16px">🏁 Registrar llegada</div>
    <div style="background:var(--bg3);border-radius:10px;padding:10px 14px;margin-bottom:14px;font-size:13px;color:var(--text2)">
      Km odómetro de salida: <strong>${kmSalida?.toLocaleString()} km</strong>
    </div>
    <div class="form-group">
      <label>Km odómetro de LLEGADA *</label>
      <input type="number" id="inp-km-llegada" placeholder="Ej: 126150" min="${kmSalida+1}" style="font-size:18px;font-weight:700">
    </div>
    <div id="km-diff-preview" style="text-align:center;font-size:28px;font-weight:700;color:var(--accent);margin:8px 0;display:none"></div>
    <div class="form-group" style="margin-top:8px">
      <label>Foto del odómetro de llegada <span style="color:var(--text3);font-size:11px">(recomendado)</span></label>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="file" id="inp-foto-odometro-llegada" accept="image/*" capture="environment" style="display:none" onchange="previewFotoOdometro(this,'preview-odo-llegada')">
        <button type="button" onclick="document.getElementById('inp-foto-odometro-llegada').click()"
          style="padding:8px 14px;border-radius:8px;border:1px dashed var(--border2);background:var(--bg3);color:var(--text2);font-size:13px;cursor:pointer">
          📷 Sacar foto
        </button>
        <img id="preview-odo-llegada" style="display:none;width:60px;height:45px;object-fit:cover;border-radius:6px;border:1px solid var(--border)">
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:8px">
      <button class="btn-secondary" style="flex:1" onclick="closeModal('modal-viaje')">Cancelar</button>
      <button class="btn-primary" style="flex:1" onclick="guardarCierreViaje()">Guardar llegada</button>
    </div>`;
  document.getElementById('inp-km-llegada').addEventListener('input', function() {
    const diff = parseInt(this.value) - kmSalida;
    const preview = document.getElementById('km-diff-preview');
    if (diff > 0) { preview.textContent = diff.toLocaleString()+' km recorridos'; preview.style.display='block'; }
    else { preview.style.display='none'; }
  });
  document.getElementById('modal-viaje').classList.remove('hidden');
}

async function guardarCierreViaje() {
  const kmLlegada = parseInt(document.getElementById('inp-km-llegada')?.value);
  if (!kmLlegada || kmLlegada <= viajeAbierto.kmSalida) { showToast('El km de llegada debe ser mayor al de salida','error'); return; }
  const kmRecorridos = kmLlegada - viajeAbierto.kmSalida;
  // Calcular distancia GPS estimada usando los registros del día
  const hoy = localScans.filter(s => localDateKey(s.timestamp) === localDateKey(viajeAbierto.fechaSalida) && s.userId === currentUser.id);
  let distanciaGPS = null;
  if (hoy.length >= 2) {
    let total = 0;
    for (let i = 1; i < hoy.length; i++) {
      const a = hoy[i-1], b = hoy[i];
      if (a.lat && b.lat) {
        const R = 6371, dLat = (b.lat-a.lat)*Math.PI/180, dLon = (b.lon-a.lon)*Math.PI/180;
        const x = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2;
        total += R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
      }
    }
    distanciaGPS = Math.round(total);
  }
  try {
  // Capturar GPS de llegada
  let latLlegada = null, lonLlegada = null;
  try {
    if (navigator.geolocation) {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {timeout:5000})
      );
      latLlegada = pos.coords.latitude;
      lonLlegada = pos.coords.longitude;
    }
  } catch(e) { console.warn('GPS llegada no disponible:', e.message); }

  // Subir foto del odómetro de llegada a R2
  let fotoOdometroLlegadaUrl = null;
  const fotoLlegadaInput = document.getElementById('inp-foto-odometro-llegada');
  if (fotoLlegadaInput?.files?.[0]) {
    try {
      const viajeId = viajeAbierto.fbId || viajeAbierto.id;
      const reader2 = new FileReader();
      const dataUrl2 = await new Promise(res => { reader2.onload = e => res(e.target.result); reader2.readAsDataURL(fotoLlegadaInput.files[0]); });
      const blob2 = await (await fetch(dataUrl2)).blob();
      const uploadRes2 = await fetch(`${PHOTOS_PROXY_URL}/upload/${viajeId}/odometro_llegada.jpg`, {
        method: 'PUT', headers: { 'Content-Type': 'image/jpeg', 'X-ScanCheck-Token': PHOTOS_TOKEN }, body: blob2
      });
      if (uploadRes2.ok) fotoOdometroLlegadaUrl = (await uploadRes2.json()).url;
    } catch(e) { console.warn('Error subiendo foto odómetro llegada:', e.message); }
  }

    await fbUpdateViaje(viajeAbierto.fbId, {
      fechaLlegada: new Date().toISOString(),
      kmLlegada,
      kmRecorridos,
      distanciaGPS,
      latLlegada,
      lonLlegada,
      fotoOdometroLlegada: fotoOdometroLlegadaUrl,
      estado: 'cerrado'
    });
    // Update local
    const idx = localViajes.findIndex(v => v.fbId === viajeAbierto.fbId);
    if (idx !== -1) {
      localViajes[idx] = { ...localViajes[idx], fechaLlegada: new Date().toISOString(), kmLlegada, kmRecorridos, distanciaGPS, estado: 'cerrado' };
    }
    viajeAbierto = null;
    // Limpiar viaje abierto del localStorage
    try { localStorage.removeItem('scancheck_viaje_abierto_'+currentUser.id); } catch(e) {}
    closeModal('modal-viaje');
    renderViajeAbiertoBanner();
    renderViajes();
    showToast(`✓ Viaje cerrado — ${kmRecorridos.toLocaleString()} km recorridos`,'success');
  } catch(e) { showToast('Error al guardar: '+e.message,'error'); }
}
window.showIniciarViaje = showIniciarViaje;
window.guardarInicioViaje = guardarInicioViaje;
window.showCerrarViaje = showCerrarViaje;
window.guardarCierreViaje = guardarCierreViaje;

// ── REPORTE SERVICE ───────────────────────────────────────────
async function showReporteService() {
  const el = document.getElementById('modal-service-content');
  // Recuperar datos guardados previamente
  let saved = {};
  try {
    // Intentar cargar desde Firestore primero, localStorage como fallback
    const fromFirestore = await fbGetServiceData(currentUser.id);
    if (fromFirestore) {
      saved = fromFirestore;
    } else {
      const local = localStorage.getItem('scancheck_service_'+currentUser.id);
      if (local) saved = JSON.parse(local);
    }
  } catch(e) {
    try { saved = JSON.parse(localStorage.getItem('scancheck_service_'+currentUser.id)||'{}'); } catch(e2) {}
  }
  window._serviceDataSaved = saved; // hacer disponible para calcularReporteService

  el.innerHTML = `
    <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:16px">🔧 Reporte para Service</div>
    <div style="font-size:12px;color:var(--text3);margin-bottom:14px">Ingresá los datos del último service para calcular los km laborales del período.</div>
    <div class="form-group">
      <label>Fecha del último service *</label>
      <input type="date" id="inp-service-fecha" value="${saved.fecha||''}">
    </div>
    <div class="form-group">
      <label>Km del odómetro en el último service *</label>
      <input type="number" id="inp-service-km" placeholder="Ej: 95000" value="${saved.km||''}" min="0">
    </div>
    <div class="form-group">
      <label>Km actuales del odómetro *</label>
      <input type="number" id="inp-service-km-actual" placeholder="Ej: 106500" value="${saved.kmActual||''}" min="0">
      <div style="font-size:11px;color:var(--text3);margin-top:4px">Si tenés un viaje reciente, se puede tomar del último odómetro registrado.</div>
    </div>
    <div class="form-group">
      <label>Nombre del titular del vehículo</label>
      <input type="text" id="inp-service-titular" placeholder="Ej: Juan Pérez" value="${saved.titular||currentUser?.name||''}">
    </div>
    <div class="form-group">
      <label>Vehículo (marca, modelo, patente)</label>
      <input type="text" id="inp-service-vehiculo" placeholder="Ej: Renault Kangoo - AB 123 CD" value="${saved.vehiculo||''}">
    </div>
    <div id="service-preview" style="display:none;background:var(--bg3);border-radius:10px;padding:12px;margin:12px 0"></div>
    <div style="display:flex;gap:10px;margin-top:8px">
      <button class="btn-secondary" style="flex:1" onclick="closeModal('modal-service')">Cancelar</button>
      <button class="btn-primary" style="flex:1" onclick="calcularReporteService()">Calcular</button>
    </div>
    <div id="service-pdf-btn" style="display:none;margin-top:10px">
      <button class="btn-primary" style="width:100%;background:var(--accent2)" onclick="generarPDFService()">📄 Descargar PDF</button>
    </div>
  `;

  // Autocompletar km actual desde el último viaje cerrado
  const ultimoViaje = localViajes.filter(v=>v.estado==='cerrado'&&v.kmLlegada).sort((a,b)=>new Date(b.fechaLlegada)-new Date(a.fechaLlegada))[0];
  if (ultimoViaje?.kmLlegada && !saved.kmActual) {
    setTimeout(()=>{
      const inp = document.getElementById('inp-service-km-actual');
      if (inp && !inp.value) inp.value = ultimoViaje.kmLlegada;
    }, 50);
  }

  document.getElementById('modal-service').classList.remove('hidden');
}
window.showReporteService = showReporteService;

async function calcularReporteService() {
  const fechaService = document.getElementById('inp-service-fecha')?.value;
  const kmService = parseInt(document.getElementById('inp-service-km')?.value);
  const kmActual = parseInt(document.getElementById('inp-service-km-actual')?.value);
  const titular = document.getElementById('inp-service-titular')?.value.trim();
  const vehiculo = document.getElementById('inp-service-vehiculo')?.value.trim();

  if (!fechaService || !kmService || !kmActual) { showToast('Completá todos los campos obligatorios','error'); return; }
  if (kmActual <= kmService) { showToast('El km actual debe ser mayor al km del service','error'); return; }

  // Guardar en Firestore (persiste aunque se limpie el caché) y localStorage como respaldo
  const serviceDataToSave = {fecha:fechaService, km:kmService, kmActual, titular, vehiculo};
  try { await fbSaveServiceData(currentUser.id, serviceDataToSave); } catch(e) {}
  try { localStorage.setItem('scancheck_service_'+currentUser.id, JSON.stringify(serviceDataToSave)); } catch(e) {}

  // Usar fechaCorte si existe (último reporte generado), sino usar fecha del service
  // Esto evita que los viajes ya reportados se cuenten de nuevo
  const saved = window._serviceDataSaved || {};
  const fechaCorte = saved.fechaCorte || null;
  const desdeFecha = fechaCorte
    ? new Date(fechaCorte)
    : new Date(fechaService+'T00:00:00');
  const viajesLaboral = localViajes.filter(v =>
    v.estado === 'cerrado' && !v.eliminado &&
    v.kmRecorridos > 0 &&
    new Date(v.fechaSalida) >= desdeFecha
  );
  const esPrimerReporte = !fechaCorte;
  const kmLaborales = viajesLaboral.reduce((s,v) => s+(v.kmRecorridos||0), 0);
  const kmTotales = kmActual - kmService;
  const pct = kmTotales > 0 ? Math.round(kmLaborales/kmTotales*100) : 0;

  const preview = document.getElementById('service-preview');
  preview.style.display = 'block';
  preview.innerHTML = `
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:10px">Resumen del período</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
      <div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center">
        <div style="font-size:22px;font-weight:700;color:var(--accent)">${kmTotales.toLocaleString()}</div>
        <div style="font-size:10px;color:var(--text3)">Km totales recorridos</div>
      </div>
      <div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center">
        <div style="font-size:22px;font-weight:700;color:var(--accent2)">${kmLaborales.toLocaleString()}</div>
        <div style="font-size:10px;color:var(--text3)">Km laborales</div>
      </div>
      <div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center">
        <div style="font-size:22px;font-weight:700;color:var(--text)">${pct}%</div>
        <div style="font-size:10px;color:var(--text3)">Uso laboral</div>
      </div>
      <div style="background:var(--bg2);border-radius:8px;padding:10px;text-align:center">
        <div style="font-size:22px;font-weight:700;color:var(--text)">${viajesLaboral.length}</div>
        <div style="font-size:10px;color:var(--text3)">Viajes registrados</div>
      </div>
    </div>
    <div style="font-size:11px;color:var(--text3)">
      ${esPrimerReporte
        ? 'Período: desde ' + new Date(fechaService+'T12:00:00').toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'}) + ' → hoy'
        : 'Período: desde el último reporte generado (' + new Date(fechaCorte).toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'}) + ') → hoy'
      }
    </div>
    ${viajesLaboral.length === 0 ? '<div style="margin-top:8px;padding:8px;background:rgba(238,85,51,.1);border-radius:8px;font-size:12px;color:#e53;text-align:center">No hay viajes nuevos desde el último reporte generado</div>' : ''}
  `;

  // Guardar para el PDF
  window._serviceData = { fechaService, kmService, kmActual, kmTotales, kmLaborales, pct, titular, vehiculo, viajesLaboral, fechaCorte };
  document.getElementById('service-pdf-btn').style.display = 'block';
}
window.calcularReporteService = calcularReporteService;

async function generarPDFService() {
  const d = window._serviceData;
  if (!d) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const M = 18, W = 210, CW = W-M*2;
  let y = 12;

  // Logo
  try { doc.addImage(DANAIDE_LOGO,'JPEG',M,y,38,14); } catch(e) {}

  // Título
  doc.setFontSize(16); doc.setFont(undefined,'bold');
  doc.setTextColor(0,212,170);
  doc.text('REPORTE DE KM LABORALES', W/2, y+8, {align:'center'});
  doc.setFontSize(10); doc.setFont(undefined,'normal');
  doc.setTextColor(120,140,160);
  doc.text('Para reimbursement proporcional de service vehicular', W/2, y+14, {align:'center'});
  y += 24;

  // Datos del técnico y vehículo
  doc.setFillColor(15,32,39); doc.roundedRect(M,y,CW,28,3,3,'F');
  doc.setFontSize(9); doc.setTextColor(200,220,230);
  doc.text('TÉCNICO', M+6, y+7);
  doc.setFont(undefined,'bold'); doc.setFontSize(12); doc.setTextColor(255,255,255);
  doc.text(d.titular||currentUser?.name||'—', M+6, y+14);
  doc.setFont(undefined,'normal'); doc.setFontSize(9); doc.setTextColor(180,200,220);
  doc.text(`Vehículo: ${d.vehiculo||'—'}`, M+6, y+21);
  const periodoLabel = d.fechaCorte
    ? 'Desde: ' + new Date(d.fechaCorte).toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'}) + ' → ' + new Date().toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'})
    : new Date(d.fechaService+'T12:00:00').toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'}) + ' → ' + new Date().toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'});
  doc.text('Período: ' + periodoLabel, M+6, y+27);
  y += 34;

  // Resumen
  doc.setFontSize(11); doc.setFont(undefined,'bold'); doc.setTextColor(0,212,170);
  doc.text('RESUMEN DEL PERÍODO', M, y); y += 6;
  const cols = [
    ['Km odómetro en el último service', d.kmService.toLocaleString()+' km'],
    ['Km odómetro actuales', d.kmActual.toLocaleString()+' km'],
    ['Total km recorridos en el período', d.kmTotales.toLocaleString()+' km'],
    ['Km recorridos por trabajo (ScanCheck)', d.kmLaborales.toLocaleString()+' km'],
    ['Porcentaje de uso laboral', d.pct+'%'],
  ];
  cols.forEach(([label, val], i) => {
    const bg = i%2===0 ? [20,40,55] : [15,32,39];
    doc.setFillColor(...bg); doc.rect(M, y, CW, 7, 'F');
    doc.setFontSize(9); doc.setFont(undefined,'normal'); doc.setTextColor(180,200,220);
    doc.text(label, M+4, y+5);
    doc.setFont(undefined,'bold'); doc.setTextColor(0,212,170);
    doc.text(val, W-M-4, y+5, {align:'right'});
    y += 7;
  });
  y += 8;

  // Detalle de viajes
  doc.setFontSize(11); doc.setFont(undefined,'bold'); doc.setTextColor(0,212,170);
  doc.text('DETALLE DE VIAJES LABORALES', M, y); y += 6;

  // Header
  doc.setFillColor(0,212,170); doc.rect(M, y, CW, 7, 'F');
  doc.setFontSize(8); doc.setFont(undefined,'bold'); doc.setTextColor(10,22,40);
  doc.text('Fecha salida', M+3, y+5);
  doc.text('Destino', M+35, y+5);
  doc.text('Km salida', M+100, y+5);
  doc.text('Km llegada', M+125, y+5);
  doc.text('Km rec.', W-M-4, y+5, {align:'right'});
  y += 7;

  d.viajesLaboral.forEach((v,i) => {
    if (y > 265) { doc.addPage(); y = 20; }
    const bg = i%2===0 ? [20,40,55] : [15,32,39];
    doc.setFillColor(...bg); doc.rect(M, y, CW, 6, 'F');
    doc.setFontSize(7.5); doc.setFont(undefined,'normal'); doc.setTextColor(180,200,220);
    const fecha = new Date(v.fechaSalida).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'2-digit'});
    doc.text(fecha, M+3, y+4);
    const dest = (v.destinoLabel||'—').substring(0,30);
    doc.text(dest, M+35, y+4);
    doc.text((v.kmSalida||0).toLocaleString(), M+100, y+4);
    doc.text((v.kmLlegada||0).toLocaleString(), M+125, y+4);
    doc.setFont(undefined,'bold'); doc.setTextColor(0,212,170);
    doc.text((v.kmRecorridos||0).toLocaleString()+' km', W-M-4, y+4, {align:'right'});
    y += 6;
  });

  // Total
  y += 2;
  doc.setFillColor(0,80,60); doc.rect(M, y, CW, 8, 'F');
  doc.setFontSize(9); doc.setFont(undefined,'bold'); doc.setTextColor(0,212,170);
  doc.text('TOTAL KM LABORALES', M+4, y+5.5);
  doc.text(d.kmLaborales.toLocaleString()+' km', W-M-4, y+5.5, {align:'right'});
  y += 14;

  // Footer note
  doc.setFontSize(8); doc.setFont(undefined,'italic'); doc.setTextColor(100,120,140);
  const nota = `Este reporte fue generado automáticamente por ScanCheck (Danaide Enterprise) el ${new Date().toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'})}. Los kilómetros laborales corresponden a viajes registrados en el sistema durante el período indicado.`;
  const notaLines = doc.splitTextToSize(nota, CW);
  doc.text(notaLines, M, y);

  doc.save(`Reporte_Service_${(d.titular||currentUser?.name||'Tecnico').replace(/\s+/g,'_')}_${new Date().toISOString().substring(0,10)}.pdf`);
  // Guardar fecha de corte — los viajes anteriores a este momento no entran en el próximo reporte
  try {
    const stored = JSON.parse(localStorage.getItem('scancheck_service_'+currentUser.id)||'{}');
    const updated = { ...stored, fechaCorte: new Date().toISOString() };
    await fbSaveServiceData(currentUser.id, updated);
    localStorage.setItem('scancheck_service_'+currentUser.id, JSON.stringify(updated));
  } catch(e) {}
  showToast('✓ PDF generado — próximo reporte solo incluirá viajes nuevos', 'success');
}
window.generarPDFService = generarPDFService;

// ── VIAJES SUPERVISOR ─────────────────────────────────────────
async function loadSupViajes() {
  const el = document.getElementById('sup-viajes-content');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3)">Cargando...</div>';
  try {
    const viajes = await fbGetAllViajes();
    if (viajes.length === 0) { el.innerHTML = '<div class="empty-state"><p>Sin viajes registrados</p></div>'; return; }
    // Agrupar por técnico
    const byTech = {};
    viajes.filter(v=>v.estado==='cerrado').forEach(v => {
      const t = v.userName||'—';
      if (!byTech[t]) byTech[t] = { viajes:[], totalKm:0 };
      byTech[t].viajes.push(v);
      byTech[t].totalKm += v.kmRecorridos||0;
    });
    el.innerHTML = Object.keys(byTech).sort().map(tech => {
      const { viajes: tvs, totalKm } = byTech[tech];
      const rows = tvs.map(v => {
        const fechaSal = new Date(v.fechaSalida).toLocaleDateString('es-AR',{day:'numeric',month:'short',year:'2-digit'});
        const fechaLleg = v.fechaLlegada ? new Date(v.fechaLlegada).toLocaleDateString('es-AR',{day:'numeric',month:'short',year:'2-digit'}) : '—';
        return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:12px">
          <div>
            <div style="font-weight:600;color:var(--text)">${escHtml(v.destinoLabel||'Sin destino')}</div>
            <div style="color:var(--text3)">${fechaSal} → ${fechaLleg} · Od: ${v.kmSalida?.toLocaleString()} → ${v.kmLlegada?.toLocaleString()}</div>
            ${v.distanciaGPS?`<div style="color:var(--text3)">GPS estimado: ~${v.distanciaGPS} km</div>`:''}
            <div style="display:flex;gap:8px;margin-top:6px">
              ${v.fotoOdometroSalida?`<div style="text-align:center"><div style="font-size:10px;color:var(--text3);margin-bottom:2px">Salida</div><img src="${v.fotoOdometroSalida}" style="width:80px;height:60px;object-fit:cover;border-radius:6px;border:1px solid var(--border);cursor:pointer" onclick="window.open('${v.fotoOdometroSalida}')"></div>`:''}
              ${v.fotoOdometroLlegada?`<div style="text-align:center"><div style="font-size:10px;color:var(--text3);margin-bottom:2px">Llegada</div><img src="${v.fotoOdometroLlegada}" style="width:80px;height:60px;object-fit:cover;border-radius:6px;border:1px solid var(--border);cursor:pointer" onclick="window.open('${v.fotoOdometroLlegada}')"></div>`:''}
            </div>
          </div>
          <div style="font-size:18px;font-weight:700;color:var(--accent);padding-left:12px">${(v.kmRecorridos||0).toLocaleString()} km</div>
        </div>
        <button onclick="mostrarMapaRecorrido(JSON.parse(this.dataset.v))" data-v="${escHtml(JSON.stringify(v))}"
          style="width:100%;margin-top:6px;padding:6px;border-radius:8px;border:1px solid var(--accent);background:transparent;color:var(--accent);font-size:11px;font-weight:600;cursor:pointer">
          🗺️ Ver recorrido
        </button>`;
      }).join('');
      return `<div style="background:var(--bg2);border-radius:12px;padding:14px;margin-bottom:12px;border:1px solid var(--border)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <div style="font-size:13px;font-weight:700;color:var(--text)">👤 ${escHtml(tech)}</div>
          <div style="font-size:20px;font-weight:700;color:var(--accent)">${totalKm.toLocaleString()} km total</div>
        </div>
        ${rows}
      </div>`;
    }).join('');
  } catch(e) {
    el.innerHTML = `<div style="text-align:center;padding:20px;color:#e53">Error: ${e.message}</div>`;
  }
}
window.loadSupViajes = loadSupViajes;

async function eliminarViaje(fbId) {
  if (!confirm('¿Eliminar este viaje? Irá a la papelera del supervisor.')) return;
  try {
    await fbSoftDeleteViaje(fbId, currentUser?.id);
    localViajes = localViajes.filter(v => v.fbId !== fbId);
    if (viajeAbierto?.fbId === fbId) {
      viajeAbierto = null;
      try { localStorage.removeItem('scancheck_viaje_abierto_'+currentUser.id); } catch(e) {}
    }
    renderViajes();
    renderViajeAbiertoBanner();
    showToast('Viaje eliminado — visible en papelera del supervisor', 'success');
  } catch(e) { showToast('Error al eliminar: '+e.message, 'error'); }
}
window.eliminarViaje = eliminarViaje;

async function showPapeleraViajes() {
  const el = document.getElementById('papelera-viajes-content');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3)">Cargando...</div>';
  document.getElementById('modal-papelera-viajes').classList.remove('hidden');
  try {
    const deleted = await fbGetDeletedViajes();
    if (deleted.length === 0) {
      el.innerHTML = '<div class="empty-state"><p>La papelera está vacía</p></div>';
      return;
    }
    el.innerHTML = deleted.map(v => {
      const fecha = new Date(v.fechaSalida).toLocaleDateString('es-AR',{day:'numeric',month:'short',year:'2-digit'});
      return `<div style="background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border);position:relative"><button onclick="eliminarViaje('${v.fbId}')" title="Eliminar viaje" style="position:absolute;top:8px;right:8px;background:transparent;border:none;color:rgba(238,85,51,.5);font-size:16px;cursor:pointer;padding:2px;line-height:1">🗑</button>
        <div style="font-size:13px;font-weight:700;color:var(--text)">${escHtml(v.userName||'—')} — ${escHtml(v.destinoLabel||'Sin destino')}</div>
        <div style="font-size:11px;color:var(--text3)">${fecha} · ${(v.kmRecorridos||0).toLocaleString()} km</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button onclick="restaurarViaje('${v.fbId}')" style="flex:1;padding:7px;border-radius:8px;border:none;background:var(--accent);color:#0a1628;font-size:12px;font-weight:600;cursor:pointer">↩ Restaurar</button>
          <button onclick="borrarViajeDefinitivo('${v.fbId}')" style="flex:1;padding:7px;border-radius:8px;border:none;background:#e53;color:#fff;font-size:12px;font-weight:600;cursor:pointer">✕ Borrar definitivamente</button>
        </div>
      </div>`;
    }).join('');
  } catch(e) {
    el.innerHTML = `<div style="text-align:center;padding:20px;color:#e53">Error: ${e.message}</div>`;
  }
}
window.showPapeleraViajes = showPapeleraViajes;

async function restaurarViaje(fbId) {
  try {
    await fbRestoreViaje(fbId);
    showToast('Viaje restaurado', 'success');
    showPapeleraViajes();
    loadSupViajes();
  } catch(e) { showToast('Error: '+e.message, 'error'); }
}
window.restaurarViaje = restaurarViaje;

async function borrarViajeDefinitivo(fbId) {
  if (!confirm('¿Borrar definitivamente? Esta acción no se puede deshacer.')) return;
  try {
    await fbHardDeleteViaje(fbId);
    showToast('Viaje eliminado definitivamente', 'success');
    showPapeleraViajes();
  } catch(e) { showToast('Error: '+e.message, 'error'); }
}
window.borrarViajeDefinitivo = borrarViajeDefinitivo;

// ── EXPORT VIAJES A GOOGLE SHEETS ────────────────────────────
async function exportViajesSheets() {
  showToast('Exportando viajes a Sheets...', 'success');
  try {
    const viajes = await fbGetAllViajes();
    const cerrados = viajes.filter(v => !v.eliminado && v.estado === 'cerrado');
    if (cerrados.length === 0) { showToast('No hay viajes cerrados para exportar', 'error'); return; }

    // Para cada viaje, obtener los pasos y provincia de los scans asociados
    const rows = cerrados.map(v => {
      const fechaSalida = v.fechaSalida ? new Date(v.fechaSalida).toLocaleDateString('es-AR') : '';
      const fechaLlegada = v.fechaLlegada ? new Date(v.fechaLlegada).toLocaleDateString('es-AR') : '';
      // Buscar scans del técnico en el rango del viaje
      const salida = new Date(v.fechaSalida);
      const llegada = v.fechaLlegada ? new Date(v.fechaLlegada) : new Date();
      const scansViaje = localScans.filter(s =>
        s.userId === v.userId && s.lat && s.lon &&
        new Date(s.timestamp) >= salida && new Date(s.timestamp) <= llegada
      );
      const pasos = scansViaje.length > 0
        ? [...new Set(scansViaje.map(s => s.paso).filter(Boolean))].join(', ')
        : (v.destinoLabel || '');
      const provincia = scansViaje.length > 0
        ? [...new Set(scansViaje.map(s => s.address?.split(',').slice(-3,-2)[0]?.trim()).filter(Boolean))].join(', ')
        : '';
      return [
        fechaSalida,
        fechaLlegada,
        v.userName || '',
        v.vehiculo || '',
        v.destinoLabel || '',
        pasos,
        provincia,
        v.kmSalida || '',
        v.kmLlegada || '',
        v.kmRecorridos || '',
        v.distanciaGPS || ''
      ];
    });

    const headers = ['Fecha Salida','Fecha Llegada','Técnico','Vehículo','Destino','Pasos Visitados','Provincia','Km Salida','Km Llegada','Km Recorridos','Distancia GPS'];
    const values = [headers, ...rows];

    const token = await getGoogleAccessToken();
    // Clear and update Viajes sheet
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Viajes!A:K:clear`, {
      method: 'POST', headers: { 'Authorization': 'Bearer '+token, 'Content-Type': 'application/json' }
    });
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Viajes!A1:K${values.length}?valueInputOption=RAW`, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer '+token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values })
    });
    if (!res.ok) throw new Error('Error Sheets: '+(await res.text()).substring(0,100));
    showToast(`✓ ${rows.length} viajes exportados a Sheets`, 'success');
  } catch(e) { showToast('Error exportando: '+e.message, 'error'); }
}
window.exportViajesSheets = exportViajesSheets;

// ── MAPA DE RECORRIDO (OpenRouteService) ─────────────────────
async function mostrarMapaRecorrido(viaje) {
  // Obtener puntos GPS de los scans del día del viaje
  const fechaSalida = new Date(viaje.fechaSalida);
  const fechaLlegada = viaje.fechaLlegada ? new Date(viaje.fechaLlegada) : new Date();
  let scansDelDia = [];
  try {
    // Buscar todos los scans del técnico entre la fecha de salida y llegada
    scansDelDia = localScans.filter(s => {
      if (s.userId !== viaje.userId || !s.lat || !s.lon) return false;
      const ts = new Date(s.timestamp);
      return ts >= fechaSalida && ts <= fechaLlegada;
    });
  } catch(e) {}

  // Verificar que haya al menos 2 puntos GPS (scans + salida/llegada del viaje)
  const totalPuntos = scansDelDia.length +
    (viaje.latSalida ? 1 : 0) +
    (viaje.latLlegada ? 1 : 0);
  if (totalPuntos < 2) {
    showToast('Se necesitan al menos 2 puntos GPS para trazar el recorrido','error');
    return;
  }

  // Armar array de puntos GPS: salida → scans → llegada
  const puntosGPS = [];
  if (viaje.latSalida && viaje.lonSalida) {
    puntosGPS.push({ lat: viaje.latSalida, lon: viaje.lonSalida, timestamp: viaje.fechaSalida, paso: '📍 Punto de salida', puesto: '', esPuntoViaje: true });
  }
  scansDelDia.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
  puntosGPS.push(...scansDelDia);
  if (viaje.latLlegada && viaje.lonLlegada) {
    puntosGPS.push({ lat: viaje.latLlegada, lon: viaje.lonLlegada, timestamp: viaje.fechaLlegada, paso: '🏁 Punto de llegada', puesto: '', esPuntoViaje: true });
  }
  const todosLosPuntos = puntosGPS.length >= 2 ? puntosGPS : scansDelDia;
  const coords = todosLosPuntos.map(s => [s.lon, s.lat]); // ORS usa [lon, lat]

  // Mostrar modal con mapa
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9999;display:flex;flex-direction:column;padding:16px';
  modal.id = 'modal-mapa-recorrido';
  modal.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div style="font-size:15px;font-weight:700;color:#fff">🗺️ Recorrido — ${escHtml(viaje.destinoLabel||'Sin destino')}</div>
      <button onclick="document.getElementById('modal-mapa-recorrido').remove()" style="background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:8px;padding:6px 12px;font-size:14px;cursor:pointer">✕ Cerrar</button>
    </div>
    <div id="mapa-recorrido" style="flex:1;border-radius:12px;overflow:hidden;min-height:300px"></div>
    <div id="mapa-recorrido-info" style="color:#fff;font-size:12px;text-align:center;padding:8px">Calculando ruta...</div>
  `;
  document.body.appendChild(modal);

  // Init Leaflet map
  await new Promise(r => setTimeout(r, 100));
  const map = L.map('mapa-recorrido');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  // Agregar marcadores de cada paso (incluyendo salida y llegada)
  todosLosPuntos.forEach((s, i) => {
    const color = i === 0 ? '#00d4aa' : i === scansDelDia.length-1 ? '#ff5555' : '#1a6fbd';
    const icon = L.divIcon({
      html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.4)">${i+1}</div>`,
      iconSize: [28,28], iconAnchor: [14,14], className: ''
    });
    L.marker([s.lat, s.lon], {icon})
      .addTo(map)
      .bindPopup(`<strong>${escHtml(s.paso||'Paso '+i)}</strong><br>${escHtml(s.puesto||'')}<br><small>${new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}</small>`);
  });

  // Llamar a OpenRouteService para obtener la ruta real por carreteras
  try {
    const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car/geojson', {
      method: 'POST',
      headers: {
        'Authorization': ORS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ coordinates: coords })
    });
    if (!res.ok) throw new Error('ORS error ' + res.status);
    const data = await res.json();
    const route = data.features?.[0];
    if (route) {
      // Dibujar la ruta en el mapa
      L.geoJSON(route, {
        style: { color: '#1a6fbd', weight: 4, opacity: 0.85 }
      }).addTo(map);
      // Ajustar vista al recorrido
      const bounds = L.geoJSON(route).getBounds();
      map.fitBounds(bounds, { padding: [20,20] });
      // Mostrar distancia real
      const distKm = (route.properties?.summary?.distance / 1000).toFixed(1);
      const durMin = Math.round(route.properties?.summary?.duration / 60);
      document.getElementById('mapa-recorrido-info').innerHTML =
        `📍 ${scansDelDia.length} pasos visitados · 🛣️ ${distKm} km por ruta · ⏱️ ~${durMin} min de conducción`;
    }
  } catch(e) {
    // Fallback: línea recta entre puntos
    const latlngs = scansDelDia.map(s => [s.lat, s.lon]);
    L.polyline(latlngs, { color: '#1a6fbd', weight: 3, dashArray: '8,6' }).addTo(map);
    map.fitBounds(L.polyline(latlngs).getBounds(), { padding: [20,20] });
    document.getElementById('mapa-recorrido-info').innerHTML =
      `📍 ${scansDelDia.length} pasos visitados · ⚠️ Ruta aproximada (sin conexión a ORS)`;
  }
}
window.mostrarMapaRecorrido = mostrarMapaRecorrido;

// Extrae el valor del odómetro de una foto usando Claude API (vision)
async function extraerKmDesdefoto(dataUrl) {
  try {
    const base64 = dataUrl.split(',')[1];
    const mediaType = dataUrl.split(';')[0].split(':')[1] || 'image/jpeg';
    console.log('[Odómetro] Enviando foto a Claude, mediaType:', mediaType, 'base64 length:', base64?.length);
    const res = await fetch(CLAUDE_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-ScanCheck-Token': PHOTOS_TOKEN },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
            { type: 'text', text: 'Esta es una foto del odómetro de un vehículo. Extraé SOLO el número de kilómetros que se ve en el display (sin puntos, sin comas, solo el número entero). Si no podés leerlo claramente, respondé "ERROR". Respondé ÚNICAMENTE con el número, sin texto adicional.' }
          ]
        }]
      })
    });
    console.log('[Odómetro] HTTP status:', res.status);
    const data = await res.json();
    console.log('[Odómetro] Respuesta Claude:', JSON.stringify(data).substring(0, 200));
    if (!res.ok) return null;
    const text = data.content?.[0]?.text?.trim();
    console.log('[Odómetro] Texto extraído:', text);
    if (!text || text === 'ERROR') return null;
    const num = parseInt(text.replace(/[^0-9]/g,''));
    return isNaN(num) ? null : num;
  } catch(e) {
    console.error('[Odómetro] Error:', e.message);
    return null;
  }
}

function previewFotoOdometro(input, previewId) {
  const preview = document.getElementById(previewId);
  if (!input.files?.[0]) return;
  const reader = new FileReader();
  reader.onload = async e => {
    preview.src = e.target.result;
    preview.style.display = 'block';
    // Determinar qué campo de km llenar según el preview
    const kmFieldId = previewId === 'preview-odo-salida' ? 'inp-km-salida' : 'inp-km-llegada';
    const kmField = document.getElementById(kmFieldId);
    if (kmField) {
      kmField.placeholder = '⏳ Leyendo odómetro...';
      kmField.disabled = true;
      const km = await extraerKmDesdefoto(e.target.result);
      kmField.disabled = false;
      if (km) {
        kmField.value = km;
        kmField.style.borderColor = 'var(--accent)';
        showToast(`✓ Odómetro leído: ${km.toLocaleString()} km`, 'success');
        // Disparar evento input para actualizar el preview de diferencia (en cierre)
        kmField.dispatchEvent(new Event('input'));
      } else {
        kmField.placeholder = 'No se pudo leer — ingresá manualmente';
      }
    }
  };
  reader.readAsDataURL(input.files[0]);
}
window.previewFotoOdometro = previewFotoOdometro;

// ── Vista de registros sin informe ──────────────────────────
function showOrphanScans() {
  const orphans = getOrphanScans();
  const el = document.getElementById('orphan-list-content');
  if (!el) return;

  if (orphans.length === 0) {
    el.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text3);font-size:14px">
      ✅ Todos los registros tienen informe cerrado
    </div>`;
  } else {
    // Agrupar por fecha para mejor visualización
    const byDate = {};
    orphans.forEach(s => {
      const fecha = localDateKey(s.timestamp);
      if (!byDate[fecha]) byDate[fecha] = [];
      byDate[fecha].push(s);
    });
    const today = getTodayKey();
    el.innerHTML = Object.keys(byDate).sort((a,b) => b.localeCompare(a)).map(fecha => {
      const label = fecha === today ? 'Hoy' : new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', {weekday:'long', day:'numeric', month:'long'});
      const items = byDate[fecha].map(s => `
        <div style="background:var(--bg2);border-radius:10px;padding:12px;margin-bottom:8px;border:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--text)">${escHtml(s.paso||'Sin paso')} — ${escHtml(s.puesto||'Sin puesto')}</div>
              <div style="font-size:11px;color:var(--text3)">${opLabel(s.opType)} · ${new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}</div>
              ${s.scannerSerie ? `<div style="font-size:11px;color:var(--text2);margin-top:2px">Scanner: ${escHtml(s.scannerSerie)}</div>` : ''}
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0">
              <button onclick="closeModal('modal-orphans');editScan('${s.id||s.fbId}')" 
                style="background:var(--accent);color:#fff;border:none;border-radius:8px;padding:6px 10px;font-size:12px;cursor:pointer">✏️ Editar</button>
              <button onclick="deleteOrphanScan('${s.id||s.fbId}')" 
                style="background:var(--danger,#e53);color:#fff;border:none;border-radius:8px;padding:6px 10px;font-size:12px;cursor:pointer">🗑</button>
            </div>
          </div>
          ${s.notas ? `<div style="font-size:11px;color:var(--text3);margin-top:4px">${escHtml(s.notas.substring(0,80))}${s.notas.length>80?'…':''}</div>` : ''}
        </div>`).join('');
      return `<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:12px 0 6px">${label}</div>${items}`;
    }).join('');
  }

  document.getElementById('modal-orphans').classList.remove('hidden');
}
window.showOrphanScans = showOrphanScans;

async function deleteOrphanScan(id) {
  if (!confirm('¿Eliminar este registro? Pasará a la papelera del supervisor.')) return;
  const scan = localScans.find(s => s.id===id || s.fbId===id);
  if (!scan) return;
  // Soft delete
  if (scan.fbId) {
    try { await fbSoftDeleteScan(scan.fbId, currentUser?.id); } catch(e) {}
  }
  localScans = localScans.filter(s => s.id!==id && s.fbId!==id);
  try {
    const scansForStorage = localScans.map(({photos,...s})=>({...s,photoCount:(photos||[]).length}));
    localStorage.setItem('scancheck_local_scans_' + currentUser.id, JSON.stringify(scansForStorage));
  } catch(e) {}
  updateStats();
  showOrphanScans(); // refresh the list
  showToast('Registro eliminado — visible en papelera del supervisor','success');
}
window.deleteOrphanScan = deleteOrphanScan;

function showNextPendingReport() {
  if (pendingReportQueue.length === 0) { pendingReportTotal = 0; showPage('home'); return; }
  const { paso, scans, fecha } = pendingReportQueue[0];
  const posicionActual = pendingReportTotal - pendingReportQueue.length + 1;
  currentReport = { date: fecha, scanIds: scans.map(s=>s.id||s.fbId), paso };
  renderReportPage(scans, fecha, paso, posicionActual, pendingReportTotal);
  showPage('report');
}

function renderReportPage(scans, dateKey, paso, posicionActual, totalEnCola) {
  const d     = new Date(dateKey+'T12:00:00');
  const label = d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const progresoLabel = totalEnCola > 1 ? ` · Informe ${posicionActual} de ${totalEnCola}` : '';
  document.getElementById('report-date-label').textContent = label.charAt(0).toUpperCase()+label.slice(1) + (paso ? ` — ${paso}` : '') + progresoLabel;
  document.getElementById('report-count-label').textContent = `${scans.length} scanner${scans.length!==1?'s':''}`;
  if (totalEnCola > 1 && posicionActual === 1) {
    showToast(`Se generarán ${totalEnCola} informes pendientes`, 'success');
  }
  document.getElementById('inp-inspector-name').value = '';
  const jiraTicketInput = document.getElementById('inp-jira-ticket-numero');
  if (jiraTicketInput) jiraTicketInput.value = '';
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

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:8px 14px 4px">🖨 Scanner DESKO</div>
      <div class="report-item-fields">
        ${s.scannerSerie?fTag('Serie',s.scannerSerie):''} ${s.scannerModelo?fTag('Modelo',s.scannerModelo):''}
        ${s.scannerEstado?fTag('Estado',s.scannerEstado):''}
        ${s.invDnd?fTag('N° Inv. DND',s.invDnd):''} ${s.invDnm?fTag('N° Inv. DNM',s.invDnm):''}
        ${s.serieRetira?fTag('Serie retira',s.serieRetira):''} ${s.serieNuevo?fTag('Serie nueva',s.serieNuevo):''}
        ${s.instalacionReemplazoData?fTag('Equipo retirado',`${s.instalacionReemplazoData.marcaVieja} — ${s.instalacionReemplazoData.serieVieja}`):''}
      </div>

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:8px 14px 4px">💻 PC</div>
      <div class="report-item-fields">
        ${s.pcNombre?fTag('Nombre PC',s.pcNombre):''} ${fTag('Serie PC',s.serie)}
        ${fTag('Hora',new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'}))}
        ${s.jiraTicket?fTagHtml('Jira',jiraTicketLink(s.jiraTicket)):''}
        ${fTag('GPS',s.lat?`${s.lat.toFixed(5)},${s.lon.toFixed(5)}`:'—')}
        ${s.address?fTag('Dirección',s.address):''}
      </div>
      <div style="padding:0 14px">
        ${datosSistemaHtml(s.datosSistema)}
        ${notasListHtml(s.notas)}
      </div>

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:8px 14px 4px">✅ Checklists</div>
      <div style="padding:0 14px">
        ${s.opType==='instalacion_nueva'||s.opType==='instalacion_reemplazo'?checklistInstalacionHtml(s.checklistInstalacion):checklistHtml(s.checklist)}
        ${s.opType==='reemplazo'?fallaChecklistHtml(s.actaReemplazo):''}
        ${s.opType==='falla_reparable'?fallaReparableHtml(s.fallaReparable):''}
      </div>
      ${s.opType==='reemplazo'?`<div style="padding:8px 14px"><button class="btn-secondary" style="width:100%;font-size:12px" onclick="downloadActaReemplazo('${s.id||s.fbId}')">📄 Descargar Acta de Reemplazo</button></div>`:''}
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

  // Construir el N° de ticket completo desde el campo numérico (DND- + número)
  const ticketNumero = (document.getElementById('inp-jira-ticket-numero')?.value||'').trim();
  const jiraTicketPadreExistente = ticketNumero ? `DND-${ticketNumero}` : null;

  // Si no se ingresó número de ticket, pedir confirmación antes de continuar
  if (!jiraTicketPadreExistente) {
    const confirmar = await new Promise(resolve => {
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px';
      modal.innerHTML = `<div style="background:var(--bg2);border-radius:16px;padding:24px;max-width:320px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.4)">
        <div style="font-size:20px;margin-bottom:12px;text-align:center">🎫</div>
        <div style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:8px;text-align:center">N° de ticket no completado</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:20px;text-align:center;line-height:1.4">No ingresaste un número de ticket de Jira existente.<br>¿Querés crear un ticket nuevo automáticamente?</div>
        <div style="display:flex;gap:10px">
          <button id="modal-ticket-cancelar" style="flex:1;padding:12px;border-radius:10px;border:1px solid var(--border);background:var(--bg3);color:var(--text);font-size:14px;font-weight:600;cursor:pointer">Cancelar</button>
          <button id="modal-ticket-confirmar" style="flex:1;padding:12px;border-radius:10px;border:none;background:var(--accent);color:#0a1628;font-size:14px;font-weight:700;cursor:pointer">Crear nuevo</button>
        </div>
      </div>`;
      document.body.appendChild(modal);
      document.getElementById('modal-ticket-cancelar').onclick = () => { document.body.removeChild(modal); resolve(false); };
      document.getElementById('modal-ticket-confirmar').onclick = () => { document.body.removeChild(modal); resolve(true); };
    });
    if (!confirmar) return; // el técnico canceló — vuelve a la pantalla para ingresar el número
  }

  if (!currentReport) return;

  // Embed full scan data in report (photos stored separately)
  const todayScans = localScans.filter(s => currentReport.scanIds.includes(s.id||s.fbId));
  const scansSnapshot = todayScans.map(s => ({
    id: s.id, fbId: s.fbId,
    paso: s.paso, puesto: s.puesto, serie: s.serie,
    serieRetira: s.serieRetira, serieNuevo: s.serieNuevo,
    pcNombre: s.pcNombre, scannerSerie: s.scannerSerie, scannerModelo: s.scannerModelo, scannerEstado: s.scannerEstado, invDnd: s.invDnd, invDnm: s.invDnm, checklist: s.checklist, checklistInstalacion: s.checklistInstalacion, actaReemplazo: s.actaReemplazo, fallaReparable: s.fallaReparable, instalacionReemplazoData: s.instalacionReemplazoData,
    assureEngine: s.assureEngine, assureDocLib: s.assureDocLib, assureLicKey: s.assureLicKey, jiraTicket: s.jiraTicket,
    datosSistema: s.datosSistema || null,
    opType: s.opType, notas: s.notas,
    lat: s.lat, lon: s.lon, address: s.address,
    timestamp: s.timestamp, userId: s.userId, userName: s.userName,
    photos: s.photos || [],
    pcData: s.pcData
  }));

  const report = {
    id: 'rep_'+Date.now(),
    date: currentReport.date,
    scanIds: currentReport.scanIds,
    scansSnapshot,
    signature: sigCanvas.toDataURL('image/png'),
    inspectorName,
    technicianName: currentUser.name,
    technicianEmail: currentUser.email,
    userId: currentUser.id,
    jiraTicketExistente: jiraTicketPadreExistente, // N° de ticket padre preexistente (si lo ingresó el técnico)
    createdAt: new Date().toISOString()
  };

  localReports.unshift(report);
  // Persist reports to localStorage (without photos in snapshot)
  try {
    const repsForStorage = localReports.map(rep => ({
      ...rep,
      scansSnapshot: (rep.scansSnapshot||[]).map(({photos,...s})=>({...s}))
    }));
    localStorage.setItem('scancheck_local_reports_' + currentUser.id, JSON.stringify(repsForStorage));
  } catch(e) {}

  showToast('✓ Informe guardado','success');
  currentReport=null;

  // Si quedan más Pasos/días pendientes en esta tanda, continuar automáticamente con el siguiente informe
  pendingReportQueue.shift();
  if (pendingReportQueue.length > 0) {
    showNextPendingReport();
  } else {
    pendingReportTotal = 0;
    showPage('history');
  }

  // Save to Firebase (or queue if offline)
  if (navigator.onLine) {
    setSyncStatus('syncing');
    try {
      const repFb = {
        ...report,
        scansSnapshot: (report.scansSnapshot||[]).map(({photos,...m})=>({...m,photoCount:(photos||[]).length}))
      };
      const fbId = await fbSaveReport(repFb);
      const ri = localReports.findIndex(r=>r.id===report.id);
      if (ri>=0) localReports[ri].fbId = fbId;
      setSyncStatus('ok');
    } catch(e) {
      setSyncStatus('error');
      queueAdd('report', report);
      showToast('Guardado local. Se sincronizará al reconectar','');
    }
  } else {
    queueAdd('report', report);
    setSyncStatus('offline');
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
  const unsynced = localReports.filter(r => !r.fbId);
  const syncBanner = unsynced.length > 0 ? `
    <div style="background:rgba(0,174,255,.1);border:1px solid rgba(0,174,255,.25);border-radius:10px;padding:12px 14px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;gap:10px">
      <div style="font-size:12px;color:var(--accent2)">${unsynced.length} informe${unsynced.length!==1?'s':''} pendiente${unsynced.length!==1?'s':''} de sincronizar</div>
      <button onclick="syncAllReports()" style="background:var(--accent2);color:#0a1628;border:none;border-radius:8px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap">Sincronizar</button>
    </div>` : '';
  // Orden cronológico: más reciente primero
  const sortedReports = [...localReports].sort((a,b) => {
    const ta = a.createdAt?.seconds ? a.createdAt.seconds*1000 : new Date((a.date||'1970-01-01')+'T12:00:00').getTime();
    const tb = b.createdAt?.seconds ? b.createdAt.seconds*1000 : new Date((b.date||'1970-01-01')+'T12:00:00').getTime();
    return tb - ta;
  });
  const renderRepCard = (rep) => {
    const d=new Date(rep.date+'T12:00:00');
    const label=d.toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
    const count=rep.scanIds.length;
    const paso = rep.paso || rep.scansSnapshot?.[0]?.paso || '';
    const opType = rep.scansSnapshot?.[0]?.opType || '';
    const opBadge = opType ? `<span class="op-badge ${opType}" style="font-size:10px;padding:1px 7px;margin-left:6px">${opLabel(opType)}</span>` : '';
    const jiraBadge=rep.jiraKey?`<a href="${JIRA_BASE_URL}/browse/${escHtml(rep.jiraKey)}" target="_blank" onclick="event.stopPropagation()" style="font-size:10px;background:rgba(0,174,255,.15);color:var(--accent2);padding:2px 8px;border-radius:8px;margin-left:6px;font-family:var(--mono);text-decoration:underline">${rep.jiraKey}</a>`:'';
    return `<div class="history-item" onclick="viewReport('${rep.id||rep.fbId}')">
      <div class="history-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg></div>
      <div class="history-info">
        <div class="history-date">${paso?`<span style="color:var(--accent);font-weight:700">${escHtml(paso)}</span>`:''} ${opBadge} ${jiraBadge}</div>
        <div class="history-meta">${label} · ${count} scanner${count!==1?'s':''}</div>
        <div class="history-meta">Inspector: ${escHtml(rep.inspectorName||'—')}</div>
        ${currentUser?.role==='supervisor'?`<div class="history-meta" style="color:var(--text3)">Técnico: ${escHtml(rep.technicianName||'—')}</div>`:''}
      </div>
      <div class="history-badge">${count}</div>
    </div>`;
  };

  if (currentUser?.role === 'supervisor') {
    // Supervisor: agrupar por técnico, ordenado cronológicamente dentro de cada grupo
    const byTech = new Map();
    sortedReports.forEach(rep => {
      const tech = rep.technicianName || '—';
      if (!byTech.has(tech)) byTech.set(tech, []);
      byTech.get(tech).push(rep);
    });
    // Ordenar técnicos por informe más reciente
    const techsSorted = [...byTech.entries()].sort((a,b) => {
      const ta = a[1][0].createdAt?.seconds ? a[1][0].createdAt.seconds*1000 : new Date(a[1][0].date+'T12:00:00').getTime();
      const tb = b[1][0].createdAt?.seconds ? b[1][0].createdAt.seconds*1000 : new Date(b[1][0].date+'T12:00:00').getTime();
      return tb - ta;
    });
    container.innerHTML = syncBanner + techsSorted.map(([techName, reps]) =>
      `<div style="margin-bottom:6px;padding:8px 12px;background:var(--bg3);border-radius:10px;font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px">
        👤 ${escHtml(techName)} <span style="font-weight:400">(${reps.length} informe${reps.length!==1?'s':''})</span>
      </div>
      ${reps.map(renderRepCard).join('')}`
    ).join('');
  } else {
    // Técnico: lista cronológica simple (solo ve sus propios informes)
    container.innerHTML = syncBanner + sortedReports.map(renderRepCard).join('');
  }
}

// ======== VIEW REPORT ========
async function viewReport(id) {
  const rep = localReports.find(r=>(r.id===id||r.fbId===id));
  if (!rep) return;
  viewingReportId = id;

  // Auto-sync to Firebase if not yet saved (and online)
  if (!rep.fbId && currentUser && navigator.onLine) {
    const repFb = {
      ...rep,
      scansSnapshot: (rep.scansSnapshot||[]).map(({photos,...m})=>({...m,photoCount:(photos||[]).length}))
    };
    fbSaveReport(repFb).then(fbId => {
      const ri = localReports.findIndex(r=>r.id===id);
      if (ri>=0) { localReports[ri].fbId = fbId; rep.fbId = fbId; }
      setSyncStatus('ok');
    }).catch(e => console.warn('Auto-sync failed:', e.code||e.message));
  }

  let sig = rep.signature;
  if (!sig && rep.fbId) {
    try { sig = await fbGetSignature(rep.fbId); } catch(e) {}
  }
  // Prioridad para mostrar scans: 1) localScans (tiene fotos en memoria)
  // 2) scansSnapshot del informe (tiene datos pero no fotos)
  // Luego cargamos fotos desde R2 si no están en memoria
  let scans = localScans.filter(s=>rep.scanIds.includes(s.id||s.fbId));
  if (scans.length === 0 && rep.scansSnapshot?.length > 0) {
    scans = rep.scansSnapshot;
  }
  // Para cada scan sin fotos en memoria, intentar cargar desde R2
  const scansConFotos = await Promise.all(scans.map(async s => {
    if ((s.photos?.length || 0) > 0 || (s.photoUrls?.length || 0) > 0) return s;
    const scanKey = s.fbId || s.id;
    if (scanKey && navigator.onLine) {
      const urls = await loadPhotosFromR2(scanKey);
      if (urls.length > 0) return { ...s, photoUrls: urls };
    }
    return s;
  }));
  const d=new Date(rep.date+'T12:00:00');
  const label=d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const scanRows=scansConFotos.map((s,i)=>{
    // Priorizar URLs de R2 sobre base64 en memoria
    const photoSrcs = s.photoUrls?.length > 0 ? s.photoUrls : (s.photos||[]);
    const photos=photoSrcs.map(p=>`<img src="${p}" style="width:100%;border-radius:8px;margin:6px 0;display:block">`).join('');
    return `<div style="border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:10px;background:var(--bg3)">
      <div style="font-size:13px;font-weight:600;color:var(--accent);margin-bottom:8px">${i+1}. ${escHtml(s.paso||'—')} <span class="op-badge ${s.opType||'mantenimiento'}">${opLabel(s.opType)}</span></div>
      ${photos}

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 4px">🖨 Scanner DESKO</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:12px;font-family:var(--mono)">
        ${s.scannerSerie?`<div style="color:var(--text2)">Serie: <span style="color:var(--text)">${escHtml(s.scannerSerie)}</span></div>`:''}
        ${s.scannerModelo?`<div style="color:var(--text2)">Modelo: <span style="color:var(--text)">${escHtml(s.scannerModelo)}</span></div>`:''}
        ${s.scannerEstado?`<div style="color:var(--text2)">Estado: <span style="color:var(--text)">${escHtml(s.scannerEstado)}</span></div>`:''}
        ${s.invDnd?`<div style="color:var(--text2)">N° Inv. DND: <span style="color:var(--text)">${escHtml(s.invDnd)}</span></div>`:''}
        ${s.invDnm?`<div style="color:var(--text2)">N° Inv. DNM: <span style="color:var(--text)">${escHtml(s.invDnm)}</span></div>`:''}
        ${s.serieRetira?`<div style="color:var(--text2)">Serie retira: <span style="color:var(--warning)">${escHtml(s.serieRetira)}</span></div>`:''}
        ${s.serieNuevo?`<div style="color:var(--text2)">Serie nueva: <span style="color:var(--accent)">${escHtml(s.serieNuevo)}</span></div>`:''}
        ${s.instalacionReemplazoData?`<div style="color:var(--text2);grid-column:1/-1">Equipo retirado: <span style="color:var(--text)">${escHtml(s.instalacionReemplazoData.marcaVieja)} — ${escHtml(s.instalacionReemplazoData.serieVieja)}</span></div>`:''}
      </div>

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 4px">💻 PC</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:12px;font-family:var(--mono)">
        ${s.pcNombre?`<div style="color:var(--text2)">Nombre PC: <span style="color:var(--text)">${escHtml(s.pcNombre)}</span></div>`:''}
        <div style="color:var(--text2)">Puesto: <span style="color:var(--text)">${escHtml(s.puesto||'—')}</span></div>
        ${s.lat?`<div style="color:var(--text3);font-size:10px;grid-column:1/-1">📍 ${s.lat.toFixed(6)}, ${s.lon.toFixed(6)}${s.address?' — '+escHtml(s.address):''}</div>`:''}
      </div>
      ${datosSistemaHtml(s.datosSistema)}
      ${s.notas?`<div style="border-top:1px solid var(--border);padding-top:6px;margin-top:6px">${notasListHtml(s.notas)}</div>`:''}

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 4px">✅ Checklists</div>
      ${s.opType==='instalacion_nueva'||s.opType==='instalacion_reemplazo'?checklistInstalacionHtml(s.checklistInstalacion):checklistHtml(s.checklist)}
      ${s.opType==='reemplazo'?fallaChecklistHtml(s.actaReemplazo):''}
      ${s.opType==='falla_reparable'?fallaReparableHtml(s.fallaReparable):''}
      ${s.opType==='reemplazo'?`<button class="btn-secondary" style="margin-top:8px;width:100%;font-size:12px" onclick="downloadActaReemplazo('${s.id||s.fbId}')">📄 Descargar Acta de Reemplazo</button>`:''}
    </div>`;
  }).join('');
  document.getElementById('view-report-content').innerHTML=`
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div class="vr-title" style="margin:0">Informe de Visita</div>
      <img src="${DANAIDE_LOGO}" style="height:24px;object-fit:contain;opacity:.85">
    </div>
    <div class="vr-sub">${label} · ${scans.length} scanner${scans.length!==1?'s':''}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${fTag('Técnico',rep.technicianName)} ${fTag('Inspector DNM',rep.inspectorName)}
    </div>
    ${rep.jiraKey?`<div style="font-size:12px;color:var(--accent2);background:rgba(0,174,255,.1);padding:8px 12px;border-radius:8px;margin-bottom:12px;font-family:var(--mono)">🔗 Jira: <a href="${JIRA_BASE_URL}/browse/${escHtml(rep.jiraKey)}" target="_blank" style="color:var(--accent2);text-decoration:underline">${escHtml(rep.jiraKey)}</a></div>`:''}
    ${scanRows}
    <div class="vr-sig-label">Firma del Inspector DNM — ${escHtml(rep.inspectorName||'')}</div>
    ${sig?`<img src="${sig}" class="vr-sig-img" alt="Firma">`:'<div style="color:var(--text3);font-size:12px">Sin firma guardada</div>'}
  `;
  showPage('view-report');
}
window.viewReport = viewReport;

async function deleteReport() {
  if (!viewingReportId) return;
  if (!confirm('¿Eliminar este informe de tu lista?')) return;
  const rep=localReports.find(r=>(r.id===viewingReportId||r.fbId===viewingReportId));
  localReports=localReports.filter(r=>(r.id!==viewingReportId&&r.fbId!==viewingReportId));
  showToast('Informe eliminado'); goBack();

  // Borrado lógico: el documento sigue existiendo en Firestore (marcado
  // eliminado:true) para no perder datos de métricas/export — solo deja de
  // aparecer en la lista del técnico. El supervisor puede verlo/restaurarlo
  // desde la papelera.
  if (rep?.fbId) {
    try { await fbSoftDeleteReport(rep.fbId, currentUser?.id); } catch(e) {}
    return;
  }

  // Si el informe local no tiene fbId guardado (puede pasar si se guardó offline
  // y nunca se refrescó el objeto local tras sincronizar), buscamos en Firestore
  // un informe que coincida para aplicar el mismo borrado lógico ahí.
  if (rep) {
    try {
      const remotos = await fbGetAllReports(true);
      const match = remotos.find(r =>
        r.userId === rep.userId &&
        r.createdAt?.seconds && rep.createdAt?.seconds &&
        Math.abs(r.createdAt.seconds - rep.createdAt.seconds) < 5
      );
      if (match?.fbId) await fbSoftDeleteReport(match.fbId, currentUser?.id);
    } catch(e) {}
  }
}
window.deleteReport = deleteReport;

// ======== PDF EXPORT ========
async function buildReportPDFDoc(rep) {
  // Scan lookup priority:
  // 1. scansSnapshot embedded in report (most reliable)
  // 2. localScans cache
  // 3. Firebase fetch
  const scanIds = rep.scanIds || [];

  // Build photo cache from localStorage
  const photoCache = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('scancheck_photos_')) {
        try { photoCache[key.replace('scancheck_photos_','')] = JSON.parse(localStorage.getItem(key)); } catch(e) {}
      }
    }
  } catch(e) {}
  const restorePhotos = (s) => {
    const photoUrls = s.photoUrls && s.photoUrls.length > 0 ? s.photoUrls : null;
    if (s.photos && s.photos.length > 0) return photoUrls ? { ...s, photoUrls } : s;
    const localPhotos = photoCache[s.id] || photoCache[s.fbId] || [];
    if (localPhotos.length > 0) return { ...s, photos: localPhotos, ...(photoUrls ? { photoUrls } : {}) };
    if (photoUrls) return { ...s, photos: photoUrls, photoUrls };
    return s;
  };

  // Priority 1: localScans (in-memory, has photos)
  let scans = localScans.filter(s => scanIds.includes(s.id) || scanIds.includes(s.fbId)).map(restorePhotos);

  // Priority 2: embedded snapshot
  if (scans.length === 0 && rep.scansSnapshot?.length > 0) {
    scans = rep.scansSnapshot.map(restorePhotos);
  }

  // Priority 3: Firebase
  if (scans.length === 0 && rep.userId) {
    try {
      const fbScans = await fbGetMyScans(rep.userId);
      const fbM = fbScans.filter(s => scanIds.includes(s.id) || scanIds.includes(s.fbId));
      if (fbM.length > 0) scans = fbM.map(restorePhotos);
    } catch(e) {}
  }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    const W=210, M=15;
    let y = M;

    // ── HEADER ──
    doc.setFillColor(15,32,39);
    doc.rect(0,0,W,32,'F');
    try { doc.addImage(DANAIDE_LOGO,'JPEG',M,5,44,18); } catch(e){}
    doc.setTextColor(0,212,170); doc.setFontSize(17); doc.setFont('helvetica','bold');
    doc.text('ScanCheck', M+48, 14);
    doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(139,175,196);
    doc.text('Control de Mantenimiento Preventivo — Danaide Enterprise', M+48, 21);
    const d = new Date(rep.date+'T12:00:00');
    const dateLabel = d.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    doc.setTextColor(180,210,225); doc.setFontSize(8);
    doc.text(dateLabel.charAt(0).toUpperCase()+dateLabel.slice(1), W-M, 14, {align:'right'});
    doc.text('Generado: '+new Date().toLocaleString('es-AR'), W-M, 21, {align:'right'});
    y = 38;

    // ── INFO BOX ──
    doc.setFillColor(22,36,54);
    doc.roundedRect(M,y,W-M*2,20,3,3,'F');
    const infoItems = [
      ['Técnico',      rep.technicianName||'—'],
      ['Inspector DNM',    rep.inspectorName||'—'],
      ['Dispositivos', String(scanIds.length)],
      ['Jira',         rep.jiraKey || rep.jiraTicketExistente || 'Pendiente']
    ];
    infoItems.forEach(([lbl,val],i) => {
      const cx = M+4+(i*(W-M*2)/4);
      doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(74,106,125);
      doc.text(lbl, cx, y+7);
      doc.setFont('helvetica','normal'); doc.setTextColor(232,244,248);
      doc.text(String(val).substring(0,24), cx, y+14);
    });
    y += 26;

    // ── SCANS NOT FOUND MESSAGE ──
    if (scans.length === 0) {
      doc.setFillColor(40,10,10);
      doc.roundedRect(M,y,W-M*2,20,3,3,'F');
      doc.setFontSize(10); doc.setFont('helvetica','bold'); doc.setTextColor(255,100,100);
      doc.text('No se encontraron registros de dispositivos', M+4, y+9);
      doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(200,150,150);
      doc.text('Los registros fueron generados en otra sesión. Sincronizá y volvé a intentar.', M+4, y+16);
      y += 26;
    }

    // ── EACH SCAN ──
    for (let i=0; i<scans.length; i++) {
      const s = scans[i];
      if (y > 248) { doc.addPage(); y = M; }

      // Scan header
      doc.setFillColor(30,51,71);
      doc.roundedRect(M,y,W-M*2,10,2,2,'F');
      doc.setFillColor(0,212,170);
      doc.circle(M+6,y+5,3.5,'F');
      doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(15,32,39);
      doc.text(String(i+1), M+6, y+6, {align:'center'});
      doc.setTextColor(232,244,248); doc.setFontSize(9);
      doc.text((s.paso||'Sin descripcion').substring(0,55), M+13, y+6.5);
      const opCol = s.opType==='instalacion'?[0,174,255]:s.opType==='reemplazo'?[255,160,64]:[0,212,170];
      doc.setTextColor(...opCol); doc.setFontSize(7.5);
      doc.text(opLabel(s.opType), W-M-2, y+6.5, {align:'right'});
      y += 12;

      // Fields grid (2 rows x 4 cols)
      const fields = [
        ['PUESTO',    s.puesto||'—'],
        ['SERIE PC',  s.serie||'—'],
        ['NOMBRE PC', s.pcNombre||'—'],
        ['HORA',      new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})],
        ['TIPO OP.',  opLabel(s.opType)],
      ];
      if (s.scannerSerie)  fields.push(['SERIE SCANNER', s.scannerSerie]);
      if (s.scannerModelo) fields.push(['MODELO SCANNER', s.scannerModelo]);
      if (s.scannerEstado) fields.push(['ESTADO SCANNER', s.scannerEstado]);
      if (s.invDnd) fields.push(['N° INV. DND', s.invDnd]);
      if (s.serieRetira) { fields.push(['SERIE RETIRA', s.serieRetira]); fields.push(['SERIE NUEVA', s.serieNuevo||'—']); }
      if (s.lat) fields.push(['GPS', s.lat.toFixed(5)+', '+s.lon.toFixed(5)]);

      const colW = (W-M*2)/4;
      const rowH = 13;
      const rows = Math.ceil(fields.length/4);
      // Reserve extra space for address line inside the same box
      const addrLines = s.address ? doc.splitTextToSize('Dirección: '+s.address, W-M*2-8) : [];
      const addrH = addrLines.length ? (addrLines.length*4 + 4) : 0;
      doc.setFillColor(22,36,54);
      doc.roundedRect(M,y,W-M*2,rows*rowH+addrH,2,2,'F');
      fields.forEach(([lbl,val],fi) => {
        const col = fi%4, row = Math.floor(fi/4);
        const cx = M+4+col*colW;
        const cy = y+row*rowH;
        doc.setFontSize(6.5); doc.setFont('helvetica','bold'); doc.setTextColor(74,106,125);
        doc.text(lbl, cx, cy+5);
        doc.setFont('helvetica','normal'); doc.setTextColor(232,244,248); doc.setFontSize(8);
        doc.text(String(val).substring(0,22), cx, cy+11);
      });
      // Dirección dentro del mismo recuadro, debajo de los campos
      if (addrLines.length) {
        doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(139,175,196);
        doc.text(addrLines, M+4, y+rows*rowH+4);
      }
      y += rows*rowH + addrH + 3;

      // Checklist de inspección — Instalación usa su propio checklist, el resto usa el de mantenimiento
      const esInstalacionPdf = s.opType === 'instalacion_nueva' || s.opType === 'instalacion_reemplazo';
      const cklLines = esInstalacionPdf ? checklistInstalacionLines(s.checklistInstalacion) : checklistLines(s.checklist);
      if (cklLines.length > 0) {
        if (y > 250) { doc.addPage(); y = M; }
        doc.setFillColor(18,30,44);
        doc.roundedRect(M, y, W-M*2, cklLines.length*5.5+4, 2, 2, 'F');
        cklLines.forEach((line, li) => {
          const isOk = line.startsWith('OK');
          doc.setFontSize(7.5); doc.setFont('helvetica','bold');
          doc.setTextColor(...(isOk ? [0,212,170] : [120,140,155]));
          doc.text(line, M+4, y+5.5+li*5.5);
        });
        y += cklLines.length*5.5+4 + 3;
      }

      // Checklist de Tipo de Falla detectada (solo para reemplazos, viene del Acta)
      const fallaLines = s.opType === 'reemplazo' ? fallaChecklistLines(s.actaReemplazo)
                       : s.opType === 'falla_reparable' ? fallaReparableLines(s.fallaReparable)
                       : [];
      const fallaTitulo = s.opType === 'reemplazo' ? 'TIPO DE FALLA DETECTADA (Acta de Reemplazo)'
                        : s.opType === 'falla_reparable' ? 'FALLA REPARADA EN SITIO'
                        : '';
      if (fallaLines.length > 0) {
        if (y + fallaLines.length*5.5+10 > 270) { doc.addPage(); y = M; }
        doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(255,160,64);
        doc.text(fallaTitulo, M+4, y+3.5);
        y += 5.5;
        doc.setFillColor(18,30,44);
        doc.roundedRect(M, y, W-M*2, fallaLines.length*5.5+4, 2, 2, 'F');
        fallaLines.forEach((line, li) => {
          const isOk = line.startsWith('OK');
          doc.setFontSize(7.5); doc.setFont('helvetica','bold');
          doc.setTextColor(...(isOk ? [255,160,64] : [120,140,155]));
          doc.text(line, M+4, y+5.5+li*5.5);
        });
        y += fallaLines.length*5.5+4 + 3;
      }

      // Datos del sistema PC (disco, USB, uptime) — si vienen del QR del ps1 v2
      const ds = s.datosSistema;
      if (ds && Object.keys(ds).length) {
        const dsLines = [];
        if (ds.uptime)       dsLines.push(`Uptime: ${ds.uptime}  |  Último reinicio: ${ds.ultimoRein||''}`);
        if (ds.reinPend)     dsLines.push(`Reinicio pendiente: ${ds.reinPend}`);
        if (ds.updPend)      dsLines.push(`Actualizaciones de Windows pendientes: ${ds.updPend}`);
        if (ds.discoModelo)  dsLines.push(`Disco: ${ds.discoModelo} (${ds.discoTipo||''}) — SMART: ${ds.discoSMART||''}`);
        if (ds.discoTotalGB) dsLines.push(`Espacio C: ${ds.discoLibreGB} GB libres / ${ds.discoTotalGB} GB (${ds.discoUsoPct}% uso)`);
        if (ds.discoTempC && ds.discoTempC!=='N/D') dsLines.push(`Temperatura disco: ${ds.discoTempC}°C`);
        if (ds.usbTotal)     dsLines.push(`USB: ${ds.usbTotal} dispositivos detectados — ${ds.usbErrores} con error`);
        if (ds.servicioEstado) dsLines.push(`Servicio AssureID: ${ds.servicioEstado}`);
        if (ds.docLibFecha)  dsLines.push(`Librería AssureID actualizada: ${ds.docLibFecha}`);
        if (dsLines.length) {
          if (y + dsLines.length*5.5+12 > 270) { doc.addPage(); y = M; }
          doc.setFontSize(7); doc.setFont('helvetica','bold'); doc.setTextColor(150,180,200);
          doc.text('ESTADO DEL SISTEMA (PC)', M+4, y+3.5);
          y += 5.5;
          doc.setFillColor(18,30,44);
          doc.roundedRect(M, y, W-M*2, dsLines.length*5.5+4, 2, 2, 'F');
          dsLines.forEach((line, li) => {
            const isAlert = line.includes('SI -') || (line.includes('Error') && !line.includes('0 con error')) || (line.includes('Servicio AssureID:') && !line.toLowerCase().includes('corriendo'));
            doc.setFontSize(7.5); doc.setFont('helvetica', isAlert ? 'bold' : 'normal');
            doc.setTextColor(...(isAlert ? [255,160,64] : [160,190,210]));
            doc.text(line, M+4, y+5.5+li*5.5);
          });
          y += dsLines.length*5.5+4 + 3;
        }
      }

      // Photos — TODAS en grilla de 2 columnas
      // Prioridad: 1) base64 en memoria, 2) photoUrls en scan, 3) buscar en R2 por fbId
      const urlToB64 = url => new Promise(res => {
        const img = new Image(); img.crossOrigin = 'anonymous';
        img.onload = () => { const c=document.createElement('canvas'); c.width=img.naturalWidth; c.height=img.naturalHeight; c.getContext('2d').drawImage(img,0,0); res(c.toDataURL('image/jpeg',0.85)); };
        img.onerror = () => res(null);
        img.src = url;
      });
      let photos = [];
      if (s.photos?.length > 0) {
        photos = s.photos;
      } else {
        let urls = s.photoUrls?.length > 0 ? s.photoUrls : [];
        if (urls.length === 0 && (s.fbId||s.id) && navigator.onLine) {
          urls = await loadPhotosFromR2(s.fbId||s.id);
        }
        if (urls.length > 0) {
          photos = (await Promise.all(urls.map(urlToB64))).filter(Boolean);
        }
      }
      if (photos.length > 0) {
        const cols = Math.min(photos.length, 2);
        const pw = (W - M*2 - (cols > 1 ? 4 : 0)) / cols;
        const ph = pw * 0.62;
        for (let pi = 0; pi < photos.length; pi++) {
          const col = pi % cols;
          if (col === 0 && (y + ph) > 272) { doc.addPage(); y = M; }
          try { doc.addImage(photos[pi], 'JPEG', M + col*(pw+4), y, pw, ph, '', 'FAST'); } catch(e){}
          if (col === cols-1 || pi === photos.length-1) { y += ph + 4; }
        }
      }

      // Notas — formatted as list (each line on its own row)
      if (s.notas && s.notas.trim()) {
        const noteLines = s.notas.split('\n').filter(l => l.trim());
        if (noteLines.length > 0) {
          if (y+4+noteLines.length*5 > 275) { doc.addPage(); y=M; }
          doc.setFillColor(18,28,42);
          doc.roundedRect(M,y,W-M*2,4+noteLines.length*5+2,2,2,'F');
          doc.setDrawColor(0,212,170,50); doc.setLineWidth(0.3);
          doc.line(M+3,y+1,M+3,y+3+noteLines.length*5);
          doc.setFontSize(7.5); doc.setFont('helvetica','normal');
          noteLines.forEach((line,li) => {
            const isSection = line.startsWith('---');
            if (isSection) {
              doc.setTextColor(0,212,170); doc.setFont('helvetica','bold');
              doc.text(line.replace(/---/g,'').trim(), M+6, y+5+li*5);
              doc.setFont('helvetica','normal');
            } else {
              // Split key: value lines
              const colonIdx = line.indexOf(':');
              if (colonIdx > 0) {
                const key = line.substring(0,colonIdx).trim();
                const val = line.substring(colonIdx+1).trim();
                doc.setTextColor(74,106,125); doc.setFont('helvetica','bold');
                doc.text(key+':', M+6, y+5+li*5);
                doc.setTextColor(220,236,244); doc.setFont('helvetica','normal');
                doc.text(val.substring(0,60), M+6+doc.getTextWidth(key+':')+2, y+5+li*5);
              } else {
                doc.setTextColor(220,236,244);
                doc.text(line.substring(0,70), M+6, y+5+li*5);
              }
            }
          });
          y += 4+noteLines.length*5+4;
        }
      }
      y += 5;
    }

    // ── FIRMA ──
    doc.addPage(); y=M;
    doc.setFillColor(15,32,39); doc.rect(0,0,W,18,'F');
    try { doc.addImage(DANAIDE_LOGO,'JPEG',M,2,36,14); } catch(e){}
    doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.setTextColor(0,180,130);
    doc.text('Firma del Inspector DNM Responsable', M+40, 11);
    y = 28;
    doc.setFontSize(10); doc.setFont('helvetica','bold'); doc.setTextColor(80,80,80);
    doc.text('Inspector DNM:', M, y);
    doc.setFont('helvetica','normal'); doc.setTextColor(20,20,20);
    doc.text(rep.inspectorName||'—', M+28, y); y+=8;
    doc.setFont('helvetica','bold'); doc.setTextColor(80,80,80);
    doc.text('Técnico:', M, y);
    doc.setFont('helvetica','normal'); doc.setTextColor(20,20,20);
    doc.text(rep.technicianName||'—', M+28, y); y+=8;
    doc.setFont('helvetica','bold'); doc.setTextColor(80,80,80);
    doc.text('Fecha:', M, y);
    doc.setFont('helvetica','normal'); doc.setTextColor(20,20,20);
    doc.text(dateLabel, M+28, y); y+=14;
    doc.setDrawColor(0,180,130); doc.setLineWidth(0.5);
    doc.line(M, y, W-M, y); y+=8;

    let sig = rep.signature;
    if (!sig && rep.fbId) { try { sig = await fbGetSignature(rep.fbId); } catch(e){} }
    if (sig) { try { sig = await signatureToBlack(sig); } catch(e){} }
    if (sig) {
      try {
        doc.addImage(sig,'PNG',M,y,90,40);
        doc.setDrawColor(0,180,130); doc.setLineWidth(0.4);
        doc.rect(M,y,90,40);
        y += 44;
        doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(20,20,20);
        doc.text(rep.inspectorName||'', M, y);
        doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(80,80,80);
        doc.text('Firma del inspector responsable', M, y+5);
      } catch(e){}
    }
    y += 20;
    doc.setFillColor(15,32,39); doc.rect(0,275,W,22,'F');
    doc.setFontSize(7); doc.setTextColor(180,200,210);
    doc.text('ScanCheck — Danaide Enterprise  |  '+new Date().toLocaleString('es-AR'), W/2, 283, {align:'center'});

    return { doc, filename: 'informe-scancheck-'+rep.date+'.pdf' };

  } catch(e) {
    console.error('PDF error:', e);
    throw e;
  }
}

async function downloadReportPDF() {
  const rep = localReports.find(r => r.id===viewingReportId || r.fbId===viewingReportId);
  if (!rep) { showToast('Informe no encontrado','error'); return; }
  showToast('Generando PDF...','success');
  try {
    const { doc, filename } = await buildReportPDFDoc(rep);
    doc.save(filename);
    showToast('✓ PDF descargado','success');
  } catch(e) {
    showToast('Error al generar PDF','error');
  }
}
window.downloadReportPDF = downloadReportPDF;

async function downloadActaReemplazo(scanId) {
  const scan = localScans.find(s=>(s.id===scanId||s.fbId===scanId));
  if (!scan) { showToast('Registro no encontrado','error'); return; }
  // Buscar el informe que contiene este scan, para obtener técnico/inspector
  let rep = localReports.find(r => (r.scanIds||[]).includes(scan.id) || (r.scanIds||[]).includes(scan.fbId));
  if (!rep) {
    // Respaldo: usar datos del propio scan/usuario actual si no se encuentra un informe asociado todavía
    rep = { technicianName: scan.userName || currentUser?.name || '—', inspectorName: '—', date: scan.timestamp?.slice(0,10) };
  }
  showToast('Generando Acta...','success');
  try {
    const { doc, filename } = await buildActaReemplazoPDFDoc(rep, scan);
    doc.save(filename);
    showToast('✓ Acta descargada','success');
  } catch(e) {
    console.error('Error generando Acta de Reemplazo:', e);
    showToast('Error al generar el Acta','error');
  }
}
window.downloadActaReemplazo = downloadActaReemplazo;

// ======== ACTA DE CONSTATACIÓN TÉCNICA Y REEMPLAZO ========
// Documento legal — el texto y estructura NO deben modificarse (Licitación Pública N° 21-0004-LPU25,
// Orden de Compra N° 21-0009-OCA25, Renglón N° 1, DNM / Danaide S.A.)
const FALLA_LABELS = {
  alimentacion:  'Falla de alimentación eléctrica',
  cristal:       'Cristal roto u opaco / desgastado',
  usb:           'Falla de conexión USB / Cables / comunicación con la estación de trabajo',
  mrz:           'Falla de lectura MRZ',
  chip:          'Falla de lectura de chip / documento electrónico',
  sensor:        'Falla de sensor óptico',
  irrojo:        'Falla de lectura infrarroja / ultravioleta',
  mecanica:      'Falla mecánica',
  intermitente:  'Falla intermitente recurrente',
  danoFisico:    'Daño físico visible',
  obsolescencia: 'Obsolescencia / desgaste'
};

async function buildActaReemplazoPDFDoc(rep, scan) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
  const W=210, H=297, M=15;
  let y;

  const drawHeader = () => {
    doc.setFillColor(15,32,39);
    doc.rect(0,0,W,24,'F');
    try { doc.addImage(DANAIDE_LOGO,'JPEG',M,4,38,16); } catch(e){}
    doc.setTextColor(0,212,170); doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.text('ACTA DE CONSTATACIÓN TÉCNICA Y REEMPLAZO DE EQUIPAMIENTO', W-M, 11, {align:'right'});
    doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(180,210,225);
    doc.text('Licitación Pública N° 21-0004-LPU25 — Orden de Compra N° 21-0009-OCA25 — Renglón N° 1', W-M, 17, {align:'right'});
    return 30;
  };

  const drawFooter = (pageNum, totalPages) => {
    doc.setFillColor(15,32,39); doc.rect(0,287,W,10,'F');
    doc.setFontSize(7); doc.setTextColor(180,200,210);
    doc.text('DANAIDE S.A.', M, 293);
    doc.text(`Página ${pageNum} de ${totalPages}`, W-M, 293, {align:'right'});
  };

  y = drawHeader();

  // Texto introductorio
  doc.setFontSize(8.5); doc.setFont('helvetica','normal'); doc.setTextColor(30,30,30);
  const introText = 'Entre la DIRECCIÓN NACIONAL DE MIGRACIONES, en adelante "la DNM", y la firma DANAIDE S.A., en adelante "el Proveedor", se suscribe la presente Acta de Constatación Técnica y Reemplazo de equipamiento.';
  let lines = doc.splitTextToSize(introText, W-M*2);
  doc.text(lines, M, y); y += lines.length*4.2 + 2;

  const introText2 = 'La presente tiene por objeto dejar constancia de la evaluación técnica efectuada sobre un lector documental comprendido en el servicio contratado, su condición de fuera de servicio y el reemplazo por un nuevo equipo, conforme las previsiones contractuales aplicables.';
  lines = doc.splitTextToSize(introText2, W-M*2);
  doc.text(lines, M, y); y += lines.length*4.2 + 6;

  // ── SECCIÓN 1: DATOS DEL LECTOR DOCUMENTAL ──
  doc.setFont('helvetica','bold'); doc.setFontSize(9.5); doc.setTextColor(15,32,39);
  doc.text('1. DATOS DEL LECTOR DOCUMENTAL', M, y); y += 6;

  const fecha = new Date(scan.timestamp);
  const fechaStr = fecha.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'});
  const horaStr = fecha.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
  const marcaModeloViejo = scan.scannerModelo || '—';

  const drawField = (label, value) => {
    doc.setFont('helvetica','bold'); doc.setFontSize(8.5); doc.setTextColor(60,60,60);
    doc.text(label, M, y);
    doc.setFont('helvetica','normal'); doc.setTextColor(15,15,15);
    doc.text(String(value||'—'), M+62, y);
    y += 6.5;
  };

  drawField('Fecha de revisión técnica:', `${fechaStr}   Hora: ${horaStr}`);
  drawField('Dependencia / Paso fronterizo / Sede:', scan.paso || '—');
  drawField('Marca/Modelo:', marcaModeloViejo);
  drawField('Nro. de serie:', scan.scannerSerie||scan.serieRetira||'—');
  drawField('Nro. Inventario DNM:', scan.invDnm || '—');
  drawField('Técnico interviniente del Proveedor:', rep.technicianName || '—');
  y += 3;

  // ── SECCIÓN 2: DESCRIPCIÓN DE LA FALLA ──
  doc.setFont('helvetica','bold'); doc.setFontSize(9.5); doc.setTextColor(15,32,39);
  doc.text('2. DESCRIPCIÓN DE LA FALLA', M, y); y += 6;

  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(30,30,30);
  const fallaIntro = 'Se deja constancia de que el lector documental identificado precedentemente fue evaluado técnicamente, constatándose que no se encuentra en condiciones de continuar prestando el servicio requerido.';
  lines = doc.splitTextToSize(fallaIntro, W-M*2);
  doc.text(lines, M, y); y += lines.length*4.2 + 3;

  doc.setFont('helvetica','bold'); doc.setFontSize(8.5);
  doc.text('Tipo de falla detectada:', M, y); y += 6;

  const ck = scan.actaReemplazo?.fallaChecklist || {};
  doc.setFont('helvetica','normal'); doc.setFontSize(8);
  Object.keys(FALLA_LABELS).forEach(key => {
    const checked = !!ck[key];
    doc.setDrawColor(80,80,80);
    doc.rect(M, y-3, 4, 4);
    if (checked) {
      doc.setFont('helvetica','bold');
      doc.text('X', M+0.8, y-0.1);
      doc.setFont('helvetica','normal');
    }
    doc.text(FALLA_LABELS[key], M+7, y);
    y += 5.5;
    if (y > 265) { drawFooter(doc.internal.getNumberOfPages(),0); doc.addPage(); y = drawHeader(); }
  });
  // Otro
  doc.rect(M, y-3, 4, 4);
  if (ck.otro) { doc.setFont('helvetica','bold'); doc.text('X', M+0.8, y-0.1); doc.setFont('helvetica','normal'); }
  doc.text(`Otro: ${ck.otroTexto || '_______________________________'}`, M+7, y);
  y += 8;

  doc.setFont('helvetica','normal'); doc.setFontSize(8.5);
  const fallaConclusion = 'En función de lo expuesto, el Proveedor deja constancia de que el lector documental indicado se encuentra fuera de servicio y no resulta apto para garantizar la continuidad operativa del puesto documental en condiciones adecuadas.';
  lines = doc.splitTextToSize(fallaConclusion, W-M*2);
  if (y + lines.length*4.2 > 265) { drawFooter(doc.internal.getNumberOfPages(),0); doc.addPage(); y = drawHeader(); }
  doc.text(lines, M, y); y += lines.length*4.2 + 6;

  // ── SECCIÓN 3: CONSTANCIA DE REEMPLAZO ──
  if (y > 245) { drawFooter(doc.internal.getNumberOfPages(),0); doc.addPage(); y = drawHeader(); }
  doc.setFont('helvetica','bold'); doc.setFontSize(9.5); doc.setTextColor(15,32,39);
  doc.text('3. CONSTANCIA DE REEMPLAZO', M, y); y += 6;

  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(30,30,30);
  const reemplazoIntro = 'A efectos de asegurar la continuidad operativa del servicio, el Proveedor procede al reemplazo del lector documental indicado por un nuevo equipo, conforme el siguiente detalle:';
  lines = doc.splitTextToSize(reemplazoIntro, W-M*2);
  doc.text(lines, M, y); y += lines.length*4.2 + 4;

  doc.setFont('helvetica','bold'); doc.setFontSize(8.5);
  doc.text('DATOS DEL NUEVO LECTOR DOCUMENTAL INSTALADO', M, y); y += 6.5;

  const nuevoMarcaModelo = scan.actaReemplazo?.nuevoMarcaModelo || scan.scannerModelo || '—';
  drawField('Marca/Modelo:', nuevoMarcaModelo);
  drawField('N° Serie:', scan.serieNuevo || '—');
  y += 3;

  doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.setTextColor(30,30,30);
  const comodatoText = 'El equipo provisto en reemplazo se entrega en carácter de comodato, sin costo adicional para la DNM, durante la vigencia del servicio contratado, conforme las previsiones del Renglón N° 1 del Pliego.';
  lines = doc.splitTextToSize(comodatoText, W-M*2);
  if (y + lines.length*4.2 > 250) { drawFooter(doc.internal.getNumberOfPages(),0); doc.addPage(); y = drawHeader(); }
  doc.setTextColor(30,30,30);
  doc.text(lines, M, y); y += lines.length*4.2 + 8;

  // ── FIRMA ──
  let sig = rep.signature;
  if (!sig && rep.fbId) { try { sig = await fbGetSignature(rep.fbId); } catch(e){} }
  if (sig) { try { sig = await signatureToBlack(sig); } catch(e){} }
  const sigW = 80, sigH = 30;
  if (y + sigH + 16 > 270) { drawFooter(doc.internal.getNumberOfPages(),0); doc.addPage(); y = drawHeader(); }
  if (sig) {
    try { doc.addImage(sig,'PNG',M+30,y,sigW,sigH); } catch(e) {}
    y += sigH + 3;
  } else {
    y += 10;
  }
  doc.setDrawColor(60,60,60);
  doc.line(M+30, y, M+30+sigW, y); y += 5;
  doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(15,32,39);
  doc.text('Inspector DNM', M+30+sigW/2, y, {align:'center'}); y += 5;
  doc.setFont('helvetica','normal'); doc.setFontSize(8); doc.setTextColor(60,60,60);
  doc.text(rep.inspectorName || '—', M+30+sigW/2, y, {align:'center'});

  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawFooter(p, totalPages);
  }

  const fechaArchivo = scan.timestamp ? scan.timestamp.slice(0,10) : rep.date;
  return { doc, filename: `acta-reemplazo-${scan.scannerSerie||scan.serie||'sn'}-${fechaArchivo}.pdf` };
}


// ======== JIRA ========
// Configuración fija — el proyecto y tipo de incidencia no son sensibles.
// Las credenciales reales (email/token de Atlassian) viven solo como Secrets
// en el Cloudflare Worker, nunca en el celular del técnico.
function loadJiraConfig() {
  return { project: 'DND', issueType: 'Incidente' };
}

async function sendToJira() {
  const cfg=loadJiraConfig();
  if(!cfg.project){showToast('Error de configuración interna de Jira','error');return;}

  // Buscar el informe: primero en cache local (técnico propio), sino en Firestore (supervisor viendo otro técnico)
  let rep=localReports.find(r=>(r.id===viewingReportId||r.fbId===viewingReportId));
  if(!rep){
    try{
      const allReports=await fbGetAllReports();
      rep=allReports.find(r=>(r.id===viewingReportId||r.fbId===viewingReportId));
    }catch(e){}
  }
  if(!rep){ showToast('No se encontró el informe','error'); return; }

  // Buscar los scans del informe: localScans (propio) → scansSnapshot embebido → Firestore del técnico dueño
  let scans=localScans.filter(s=>rep.scanIds?.includes(s.id||s.fbId));
  if(scans.length===0 && rep.scansSnapshot?.length>0){
    scans=rep.scansSnapshot;
  }
  if(scans.length===0 && rep.userId){
    try{
      const fbScans=await fbGetMyScans(rep.userId);
      scans=fbScans.filter(s=>rep.scanIds?.includes(s.id||s.fbId));
    }catch(e){}
  }
  if(scans.length===0){
    console.warn('sendToJira: no se encontraron scans para el informe', rep.id||rep.fbId, '— scanIds esperados:', rep.scanIds);
  }
  console.log('sendToJira: scans a procesar =', scans.length, scans);

  const d=new Date(rep.date+'T12:00:00');
  const dateLabel=d.toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'});
  showToast('Enviando a Jira...','success');
  const mkDoc=(text)=>({version:1,type:'doc',content:[{type:'paragraph',content:[{type:'text',text}]}]});

  // Llamada via proxy (Cloudflare Worker) — las credenciales de Jira viven solo en el Worker (Secrets),
  // nunca se mandan desde el celular del técnico.
  const jiraCall = async (path, jiraBody, method='POST') => {
    const r = await fetch(JIRA_PROXY_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        path, method, jiraBody
      })
    });
    return r;
  };

  // Sube un archivo adjunto a un ticket de Jira (PDF, etc.) via el proxy
  const jiraUpload = async (issueKey, filename, base64, contentType) => {
    const r = await fetch(JIRA_PROXY_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        path: `/rest/api/3/issue/${issueKey}/attachments`,
        attachment: { filename, base64, contentType }
      })
    });
    return r;
  };

  // Busca el accountId de Jira correspondiente a un email, para poder asignar tickets automáticamente
  const jiraFindAccountId = async (email) => {
    if (!email) return null;
    try {
      const r = await jiraCall(`/rest/api/3/user/search?query=${encodeURIComponent(email)}`, null, 'GET');
      if (!r.ok) return null;
      const users = await r.json();
      const match = users.find(u => (u.emailAddress||'').toLowerCase() === email.toLowerCase()) || users[0];
      return match ? match.accountId : null;
    } catch(e) {
      console.warn('No se pudo resolver accountId de Jira para', email, e);
      return null;
    }
  };

  // Resolver el técnico dueño del informe — puede ser distinto de quien envía (ej: supervisor)
  const technicianEmail = rep.technicianEmail || (rep.userId===currentUser?.id ? currentUser?.email : null);
  const assigneeAccountId = await jiraFindAccountId(technicianEmail);
  if (technicianEmail && !assigneeAccountId) {
    console.warn('No se encontró cuenta de Jira para el email', technicianEmail, '— los tickets quedarán sin asignar');
  }
  const ASSIGNEE_FIELD = assigneeAccountId ? { assignee: { id: assigneeAccountId } } : {};

  // Campos fijos requeridos en todos los tickets ScanCheck
  const FIXED_FIELDS = {
    customfield_10058: { id: '10061' }, // Equipo asignado = Operaciones
    customfield_10102: { id: '10337' }  // Contratos = Dirección Nacional de Migraciones
  };

  // Determinar el tipo de ticket padre según las operaciones del informe:
  // - Si hay algún reemplazo → Incidente
  // - Mantenimiento / Instalación → Solicitud de servicio
  const tieneReemplazo = scans.some(s => s.opType === 'cambio_equipo' || s.opType === 'reemplazo');
  const tieneInstalacion = scans.some(s => s.opType === 'instalacion_nueva' || s.opType === 'instalacion_reemplazo' || s.opType === 'instalacion');
  const tieneFallaReparable = scans.some(s => s.opType === 'falla_reparable');
  const esIncidencia = tieneReemplazo || tieneFallaReparable;
  const issueTypePadre = esIncidencia ? 'Incidente' : 'Solicitud de servicio';

  const modoLabel = tieneReemplazo ? 'Incidencia - Cambio de equipo'
    : tieneFallaReparable ? 'Incidencia - Falla reparable en sitio'
    : scans.some(s => s.opType === 'instalacion_reemplazo') ? 'Instalación - Reemplazo'
    : tieneInstalacion ? 'Instalación - Puesto nuevo'
    : 'Mantenimiento Preventivo';

  // Extraer provincia de la dirección GPS (Nominatim: "..., Provincia, CódigoPostal, Argentina")
  const primerScan = scans.find(s => s.address) || scans[0];
  const address = primerScan?.address || '';
  const provincia = (() => {
    if (!address) return '';
    const parts = address.split(',').map(p => p.trim()).filter(Boolean);
    // Nominatim termina en "Argentina", antes viene el código postal, y antes la provincia
    const argIdx = parts.findLastIndex(p => p.toLowerCase() === 'argentina');
    if (argIdx >= 2) return parts[argIdx - 2];
    if (argIdx >= 1) return parts[argIdx - 1];
    return parts[parts.length - 2] || '';
  })();

  // Paso del informe (primer scan con paso definido)
  const pasoLabel = primerScan?.paso || rep.paso || '—';

  // Título formateado del ticket: DND - Modo - Paso - Provincia
  const tituloTicket = `DND - ${modoLabel} - ${pasoLabel}${provincia ? ' - ' + provincia : ''}`;

  // Campo Hardware = Escaner (id: 10802), fijo para todos los tickets de ScanCheck
  const HARDWARE_FIELD = { customfield_10049: { id: '10802' } };

  try {
    let parentKey;
    const ticketExistente = rep.jiraTicketExistente?.trim().toUpperCase() || null;

    if (ticketExistente) {
      // ── FLUJO: ticket ya existente en Jira ──
      // Verificar que el ticket existe y es accesible
      showToast('Verificando ticket existente...','success');
      const checkRes = await jiraCall(`/rest/api/3/issue/${ticketExistente}`, null, 'GET');
      if (!checkRes.ok) {
        const err = await checkRes.text();
        showJiraError(`No se encontró el ticket ${ticketExistente}. Verificá el número. Detalle: ${err}`);
        return;
      }
      parentKey = ticketExistente;

      // Si el trabajo lleva varios días con el mismo ticket (ej: un preventivo
      // grande en un Paso), no queremos PISAR la descripción cada vez — sumamos
      // un bloque nuevo por cada día/informe, conservando el historial completo
      // de fechas, inspectores que firmaron, y dispositivos atendidos por día.
      const ticketData = await checkRes.json();
      const descActual = ticketData.fields?.description;
      // Extrae el texto plano ya guardado (mkDoc genera un único nodo de texto
      // por párrafo); si la descripción tiene otro formato (vacía, editada a
      // mano con formato ADF más complejo), simplemente no se reutiliza y
      // arrancamos un bloque nuevo limpio.
      let textoPrevio = '';
      try {
        const parrafos = descActual?.content || [];
        textoPrevio = parrafos
          .map(p => (p.content || []).map(c => c.text || '').join(''))
          .join('\n')
          .trim();
      } catch(e) {}

      const bloqueNuevo = `Fecha: ${dateLabel}\nDispositivos atendidos: ${scans.length}\nInspector DNM: ${rep.inspectorName}`;
      const descripcionFinal = textoPrevio
        ? `${textoPrevio}\n\n— — —\n\n${bloqueNuevo}`
        : `[ScanCheck] Informe cargado automáticamente\nTécnico: ${rep.technicianName}\n\n${bloqueNuevo}`;

      const updateRes = await jiraCall(`/rest/api/3/issue/${parentKey}`, {
        fields: { description: mkDoc(descripcionFinal) }
      }, 'PUT');
      if (!updateRes.ok) {
        console.warn('No se pudo actualizar la descripción del ticket existente:', await updateRes.text());
      }

      // Asignar al técnico si se resolvió el accountId
      if (assigneeAccountId) {
        await jiraCall(`/rest/api/3/issue/${parentKey}`, { fields: { assignee: { id: assigneeAccountId } } }, 'PUT');
      }

      showToast(`Usando ticket existente: ${parentKey}`, 'success');

    } else {
      // ── FLUJO: crear ticket nuevo ──
      const issueRes = await jiraCall('/rest/api/3/issue', {
        fields:{project:{key:cfg.project},summary:tituloTicket,description:mkDoc(`Técnico: ${rep.technicianName}\nInspector DNM: ${rep.inspectorName}\nDispositivos: ${scans.length}`),issuetype:{name:issueTypePadre},...FIXED_FIELDS,...HARDWARE_FIELD,...ASSIGNEE_FIELD}
      });
      if(!issueRes.ok){const err=await issueRes.text();showJiraError(err);return;}
      const issue=await issueRes.json();
      parentKey=issue.key;
    }

    // Generar el PDF del informe y adjuntarlo al ticket padre (existente o nuevo)
    try {
      showToast('Adjuntando PDF al ticket...','success');
      const { doc, filename } = await buildReportPDFDoc(rep);
      const dataUri = doc.output('datauristring'); // "data:application/pdf;base64,XXXX"
      const base64 = dataUri.split(',')[1];
      const upRes = await jiraUpload(parentKey, filename, base64, 'application/pdf');
      if (!upRes.ok) {
        const errTxt = await upRes.text();
        console.error('Error al adjuntar PDF:', errTxt);
        showToast('Ticket actualizado, pero no se pudo adjuntar el PDF', 'error');
      }
    } catch(e) {
      console.error('Error generando/adjuntando PDF:', e);
    }

    // Algunos workflows de Jira exigen que el ticket padre esté "En proceso" antes de
    // permitir crear/transicionar subtareas. Intentamos esa transición automáticamente.
    try {
      const transRes = await jiraCall(`/rest/api/3/issue/${parentKey}/transitions`, null, 'GET');
      if (transRes.ok) {
        const transData = await transRes.json();
        const enProceso = (transData.transitions||[]).find(t => t.name === 'En proceso' || t.to?.name === 'En proceso');
        if (enProceso) {
          const doTransRes = await jiraCall(`/rest/api/3/issue/${parentKey}/transitions`, { transition: { id: enProceso.id } }, 'POST');
          if (doTransRes.ok) {
            console.log('sendToJira: ticket padre transicionado a En proceso');
          } else {
            console.warn('sendToJira: no se pudo transicionar el padre a En proceso:', await doTransRes.text());
          }
        }
      }
    } catch(transErr) {
      console.warn('sendToJira: error al intentar transicionar el padre:', transErr);
    }

    const subtaskKeys=[];
    console.log('sendToJira: empezando loop de', scans.length, 'subtareas');
    for(const s of scans){
      console.log('sendToJira: creando subtarea para', s.id||s.fbId, s.serie);
      // Si el scan tiene GPS pero no se llegó a resolver la dirección en el momento del relevamiento, la buscamos ahora
      if (s.lat && s.lon && !s.address) {
        try {
          const gr = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${s.lat}&lon=${s.lon}&zoom=16`);
          const gd = await gr.json();
          if (gd.display_name) s.address = gd.display_name;
        } catch(e) {}
      }
      const hardwareAsociado = [
        s.scannerModelo ? `Modelo: ${s.scannerModelo}` : null,
        s.scannerSerie ? `N° Serie: ${s.scannerSerie}` : null
      ].filter(Boolean).join('\n') || undefined;
      let sr;
      try {
        sr = await jiraCall('/rest/api/3/issue', {
          fields:{project:{key:cfg.project},parent:{key:parentKey},summary:`[${opLabel(s.opType)}] ${s.paso||'Sin paso'} — Serie ${s.serie} — Puesto ${s.puesto||'—'} (Ref: ${parentKey})`,
            description:mkDoc(`Paso: ${s.paso}\nPuesto: ${s.puesto}\nSerie PC: ${s.serie}\nTipo: ${opLabel(s.opType)}${s.serieRetira?`\nRetira: ${s.serieRetira}\nNuevo: ${s.serieNuevo}`:''}${s.invDnd?`\nN° Inv. DND: ${s.invDnd}`:''}\nHora: ${new Date(s.timestamp).toLocaleString('es-AR')}${s.lat?`\nGPS: ${s.lat.toFixed(6)}, ${s.lon.toFixed(6)}${s.address?` — ${s.address}`:''}`:''}${checklistLines(s.checklist).length?`\n\nChecklist:\n${checklistLines(s.checklist).join('\n')}`:''}${s.notas?`\n\nNotas:\n${s.notas}`:''}`),
            issuetype:{id:'10003'},...FIXED_FIELDS,...ASSIGNEE_FIELD,
            ...(hardwareAsociado ? { customfield_10050: mkDoc(hardwareAsociado) } : {})}
        });
        console.log('sendToJira: respuesta subtarea status=', sr.status, 'ok=', sr.ok);
      } catch(loopErr) {
        console.error('sendToJira: EXCEPCIÓN al llamar jiraCall para subtarea', s.id||s.fbId, loopErr);
        continue;
      }
      if(sr.ok){
        const st=await sr.json();
        subtaskKeys.push(st.key);
        console.log('sendToJira: subtarea creada OK:', st.key);
        // Save Jira ticket key onto the scan object itself (covers both localScans and scansSnapshot-sourced scans)
        s.jiraTicket = st.key;
        const si = localScans.findIndex(ls=>ls.id===s.id||ls.fbId===s.fbId);
        if (si>=0) localScans[si].jiraTicket = st.key;

        // Si es un cambio de equipo (incidencia), generar y adjuntar el Acta
        // → a la subtarea (uso interno) Y al ticket padre (visible para el cliente en el portal)
        if (s.opType === 'cambio_equipo') {
          try {
            const { doc: actaDoc, filename: actaFilename } = await buildActaReemplazoPDFDoc(rep, s);
            const actaDataUri = actaDoc.output('datauristring');
            const actaBase64 = actaDataUri.split(',')[1];
            // Adjuntar a la subtarea (uso interno de Danaide)
            const actaUpSubtask = await jiraUpload(st.key, actaFilename, actaBase64, 'application/pdf');
            if (!actaUpSubtask.ok) {
              console.error('Error al adjuntar Acta a subtarea:', await actaUpSubtask.text());
            } else {
              console.log('Acta adjuntada a subtarea', st.key);
            }
            // Adjuntar también al ticket padre (visible para el cliente en el portal JSM)
            const actaUpPadre = await jiraUpload(parentKey, actaFilename, actaBase64, 'application/pdf');
            if (!actaUpPadre.ok) {
              console.error('Error al adjuntar Acta al ticket padre:', await actaUpPadre.text());
            } else {
              console.log('Acta adjuntada al ticket padre', parentKey);
            }
          } catch(actaErr) {
            console.error('Error generando/adjuntando Acta de Reemplazo:', actaErr);
          }
        }
      } else {
        const errTxt = await sr.text();
        console.error(`Error creando subtarea para scan ${s.id||s.fbId} (${s.serie}):`, errTxt);
      }
    }
    console.log('sendToJira: loop terminado. subtaskKeys =', subtaskKeys);
    // Update report with Jira key (busca en localReports; si no está ahí, se actualiza igual en Firestore más abajo)
    const idx=localReports.findIndex(r=>(r.id===viewingReportId||r.fbId===viewingReportId));
    let updatedSnapshot = scans; // scans ya tiene jiraTicket asignado en cada item del loop anterior
    if(idx>=0){
      localReports[idx].jiraKey=parentKey;
      localReports[idx].scansSnapshot = updatedSnapshot;
    }
    if(rep.fbId){
      try{
        await fbUpdateReport(rep.fbId,{jiraKey:parentKey, scansSnapshot: updatedSnapshot});
      }catch(e){}
    }
    // Persist locally
    try {
      localStorage.setItem('scancheck_local_scans_' + currentUser.id, JSON.stringify(localScans.map(({photos,...s})=>({...s,photoCount:(photos||[]).length}))));
      localStorage.setItem('scancheck_local_reports_' + currentUser.id, JSON.stringify(localReports.map(r=>({...r,scansSnapshot:(r.scansSnapshot||[]).map(({photos,...s})=>({...s}))}))));
    } catch(e) {}
    document.getElementById('modal-jira-content').innerHTML=`
      <div style="text-align:center;padding:16px 0">
        <div style="font-size:36px;margin-bottom:10px">✅</div>
        <div style="font-size:15px;font-weight:700;color:var(--accent);margin-bottom:6px">${ticketExistente ? 'Informe cargado en ticket existente' : 'Ticket creado en Jira'}</div>
        <div style="font-size:24px;font-weight:700;font-family:var(--mono);color:var(--text);margin-bottom:6px">${parentKey}</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:12px">${subtaskKeys.length} subtarea${subtaskKeys.length!==1?'s':''} creada${subtaskKeys.length!==1?'s':''}</div>
        <div style="font-size:11px;font-family:var(--mono);color:var(--text3);background:var(--bg3);padding:8px;border-radius:8px">${subtaskKeys.join(' · ')}</div>
        <a href="${JIRA_BASE_URL}/browse/${parentKey}" target="_blank" style="display:inline-block;margin-top:16px;padding:12px 24px;background:var(--accent);color:#0a1628;border-radius:12px;font-weight:700;text-decoration:none;font-size:14px">Abrir en Jira →</a>
      </div>`;
    document.getElementById('modal-jira').classList.remove('hidden');
    showToast(`✓ Jira: ${parentKey}`,'success');
  } catch(e) { showJiraError(e.message); }
}
window.sendToJira = sendToJira;

function showJiraError(msg) {
  document.getElementById('modal-jira-content').innerHTML=`<div style="text-align:center;padding:16px 0"><div style="font-size:32px;margin-bottom:10px">❌</div><div style="font-size:15px;font-weight:600;color:var(--danger);margin-bottom:8px">Error al conectar con Jira</div><div style="font-size:11px;color:var(--text2);background:var(--bg3);padding:12px;border-radius:8px;font-family:var(--mono);text-align:left;word-break:break-all">${escHtml(msg)}</div></div>`;
  document.getElementById('modal-jira').classList.remove('hidden');
}

// ======== PAPELERA (informes/registros eliminados por técnicos) ========
let papeleraVisible = false;

async function togglePapelera() {
  papeleraVisible = !papeleraVisible;
  document.getElementById('sup-informes-list').classList.toggle('hidden', papeleraVisible);
  document.getElementById('sup-papelera-list').classList.toggle('hidden', !papeleraVisible);
  const btn = document.getElementById('btn-toggle-papelera');
  if (btn) btn.textContent = papeleraVisible ? '📋 Ver informes' : '🗑 Papelera';
  if (papeleraVisible) await renderPapelera();
}
window.togglePapelera = togglePapelera;

async function renderPapelera() {
  const cont = document.getElementById('sup-papelera-list');
  cont.innerHTML = `<div class="empty-state"><p>Cargando...</p></div>`;
  try {
    const [reports, scans] = await Promise.all([fbGetDeletedReports(), fbGetDeletedScans()]);
    if (!reports.length && !scans.length) {
      cont.innerHTML = `<div class="empty-state"><p>La papelera está vacía</p></div>`;
      return;
    }
    const fmtFecha = (ts) => ts?.seconds ? new Date(ts.seconds*1000).toLocaleString('es-AR') : '—';
    let html = '';
    if (reports.length) {
      html += `<div class="section-label" style="margin:10px 0">Informes eliminados (${reports.length})</div>`;
      html += reports.map(rep => `
        <div class="sup-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
            <div>
              <div style="font-weight:600">${escHtml(rep.technicianName||'—')} — ${escHtml(rep.paso||'(sin paso)')}</div>
              <div style="font-size:11px;color:var(--text3)">Eliminado el ${fmtFecha(rep.eliminadoEn)} · ${rep.scanIds?.length||0} registros</div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0">
              <button class="btn-secondary small" onclick="restaurarInforme('${rep.fbId}')">↩ Restaurar</button>
              <button class="btn-ghost danger small" onclick="eliminarInformeDefinitivo('${rep.fbId}')">🗑 Eliminar</button>
            </div>
          </div>
        </div>`).join('');
    }
    if (scans.length) {
      html += `<div class="section-label" style="margin:14px 0 10px">Registros sueltos eliminados (${scans.length})</div>`;
      html += scans.map(s => `
        <div class="sup-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
            <div>
              <div style="font-weight:600">${escHtml(s.paso||'(sin paso)')} — ${escHtml(s.puesto||'')}</div>
              <div style="font-size:11px;color:var(--text3)">Eliminado el ${fmtFecha(s.eliminadoEn)} · Serie: ${escHtml(s.serie||'—')}</div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0">
              <button class="btn-secondary small" onclick="restaurarRegistro('${s.fbId}')">↩ Restaurar</button>
              <button class="btn-ghost danger small" onclick="eliminarRegistroDefinitivo('${s.fbId}')">🗑 Eliminar</button>
            </div>
          </div>
        </div>`).join('');
    }
    cont.innerHTML = html;
  } catch(e) {
    cont.innerHTML = `<div class="empty-state"><p>Error al cargar la papelera</p></div>`;
  }
}

async function restaurarInforme(fbId) {
  try {
    await fbRestoreReport(fbId);
    showToast('Informe restaurado');
    await renderPapelera();
  } catch(e) { showToast('Error al restaurar'); }
}
window.restaurarInforme = restaurarInforme;

async function restaurarRegistro(fbId) {
  try {
    await fbRestoreScan(fbId);
    showToast('Registro restaurado');
    await renderPapelera();
  } catch(e) { showToast('Error al restaurar'); }
}
window.restaurarRegistro = restaurarRegistro;

async function eliminarInformeDefinitivo(fbId) {
  if (!confirm('Esto borra el informe DEFINITIVAMENTE, sin posibilidad de recuperarlo. ¿Continuar?')) return;
  try {
    await fbDeleteReport(fbId);
    showToast('Informe eliminado definitivamente');
    await renderPapelera();
  } catch(e) { showToast('Error al eliminar'); }
}
window.eliminarInformeDefinitivo = eliminarInformeDefinitivo;

async function eliminarRegistroDefinitivo(fbId) {
  if (!confirm('Esto borra el registro DEFINITIVAMENTE, sin posibilidad de recuperarlo. ¿Continuar?')) return;
  try {
    await fbDeleteScan(fbId);
    showToast('Registro eliminado definitivamente');
    await renderPapelera();
  } catch(e) { showToast('Error al eliminar'); }
}
window.eliminarRegistroDefinitivo = eliminarRegistroDefinitivo;

// ======== SUPERVISOR ========
function supTab(tab, btn) {
  document.querySelectorAll('.sup-tab').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  ['informes','tecnicos','versiones','mapa','export','storage','viajes'].forEach(t=>document.getElementById('sup-'+t).classList.toggle('hidden',t!==tab));
  if (tab==='mapa') {
    startLiveMap();
    // Leaflet necesita recalcular el tamaño si el mapa se inicializó mientras la pestaña estaba oculta
    setTimeout(() => { if (liveMapInstance) liveMapInstance.invalidateSize(); }, 100);
  }
  // Al abrir la pestaña Versiones, marcar la notificación como vista →
  // cambioDetectado=false en Firestore → el badge naranja desaparece automáticamente
  // via el onSnapshot de fbWatchVersionesObjetivo que ya está suscripto.
  if (tab==='versiones' && versionesObjetivo?.cambioDetectado) {
    fbMarcarVersionesVistas().catch(e => console.warn('Error marcando versiones vistas:', e));
  }
}
window.supTab = supTab;

// ── Monitor de Storage R2 ────────────────────────────────────
async function loadStorageStats() {
  const el = document.getElementById('storage-stats-content');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3)">Consultando storage...</div>';
  try {
    const res = await fetch(`${PHOTOS_PROXY_URL}/stats`, {
      headers: { 'X-ScanCheck-Token': PHOTOS_TOKEN }
    });
    if (!res.ok) throw new Error('Error ' + res.status);
    const d = await res.json();
    const pct = d.usePct || 0;
    const color = pct < 60 ? 'var(--accent)' : pct < 85 ? 'var(--warning)' : '#e53';
    el.innerHTML = `
      <div style="background:var(--bg2);border-radius:12px;padding:16px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-size:13px;font-weight:700;color:var(--text)">Uso del bucket scancheck-photos</span>
          <span style="font-size:13px;font-weight:700;color:${color}">${pct}%</span>
        </div>
        <div style="background:var(--bg3);border-radius:99px;height:10px;overflow:hidden;margin-bottom:12px">
          <div style="background:${color};height:100%;width:${Math.min(pct,100)}%;border-radius:99px;transition:width .5s"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div style="background:var(--bg3);border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:20px;font-weight:700;color:var(--text)">${d.totalSizeMB} MB</div>
            <div style="font-size:11px;color:var(--text3)">Usado</div>
          </div>
          <div style="background:var(--bg3);border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:20px;font-weight:700;color:var(--text3)">${(d.limitFreeMB/1024).toFixed(0)} GB</div>
            <div style="font-size:11px;color:var(--text3)">Límite gratuito</div>
          </div>
          <div style="background:var(--bg3);border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:20px;font-weight:700;color:var(--text)">${d.totalFiles}</div>
            <div style="font-size:11px;color:var(--text3)">Fotos almacenadas</div>
          </div>
          <div style="background:var(--bg3);border-radius:8px;padding:10px;text-align:center">
            <div style="font-size:20px;font-weight:700;color:var(--accent)">${(d.limitFreeMB - d.totalSizeMB).toFixed(0)} MB</div>
            <div style="font-size:11px;color:var(--text3)">Disponible</div>
          </div>
        </div>
        ${pct > 80 ? `<div style="margin-top:12px;padding:10px;background:#e5330022;border-radius:8px;font-size:12px;color:#e53;font-weight:600">⚠️ Uso elevado — considerá limpiar fotos antiguas para evitar cargos</div>` : ''}
      </div>
      <div style="font-size:11px;color:var(--text3);text-align:center">Límite gratuito de Cloudflare R2: 10 GB / mes · Sin costo de egress</div>
    `;
  } catch(e) {
    el.innerHTML = `<div style="text-align:center;padding:20px;color:#e53;font-size:13px">Error al consultar storage: ${e.message}</div>`;
  }
}
window.loadStorageStats = loadStorageStats;

let liveMapStarted=false;
async function renderSupervisor() {
  // Informes
  let allReports=localReports;
  try { allReports=await fbGetAllReports(); } catch(e) {}
  // Orden cronológico: más reciente primero (usa createdAt de Firestore si existe, sino la fecha del informe)
  // Ordenar cronológicamente dentro de cada técnico (más reciente primero)
  allReports = [...allReports].sort((a,b) => {
    const ta = a.createdAt?.seconds ? a.createdAt.seconds*1000 : new Date(a.date+'T12:00:00').getTime();
    const tb = b.createdAt?.seconds ? b.createdAt.seconds*1000 : new Date(b.date+'T12:00:00').getTime();
    return tb - ta;
  });
  const supList=document.getElementById('sup-informes-list');
  if(!allReports.length) { supList.innerHTML=`<div class="empty-state"><p>Sin informes</p></div>`; }
  else {
    // Agrupar por técnico manteniendo el orden cronológico dentro de cada grupo
    const byTech = new Map();
    allReports.forEach(rep => {
      const tech = rep.technicianName || '—';
      if (!byTech.has(tech)) byTech.set(tech, []);
      byTech.get(tech).push(rep);
    });
    // Ordenar técnicos por fecha del informe más reciente
    const techsSorted = [...byTech.entries()].sort((a,b) => {
      const ta = a[1][0].createdAt?.seconds ? a[1][0].createdAt.seconds*1000 : new Date(a[1][0].date+'T12:00:00').getTime();
      const tb = b[1][0].createdAt?.seconds ? b[1][0].createdAt.seconds*1000 : new Date(b[1][0].date+'T12:00:00').getTime();
      return tb - ta;
    });
    supList.innerHTML = techsSorted.map(([techName, reps]) => {
      const cards = reps.map(rep => {
        const d = new Date(rep.date+'T12:00:00');
        const label = d.toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
        const count = rep.scanIds?.length||0;
        // Obtener el paso del primer scan del snapshot si está disponible
        const paso = rep.paso || rep.scansSnapshot?.[0]?.paso || '—';
        const opType = rep.scansSnapshot?.[0]?.opType || '';
        const opBadge = opType ? `<span class="op-badge ${opType}" style="font-size:10px;padding:1px 7px;margin-left:6px">${opLabel(opType)}</span>` : '';
        return `<div class="sup-card" onclick="viewReportSupervisor('${rep.fbId||rep.id}')">
          <div class="sup-card-top">
            <div style="flex:1;min-width:0">
              <div class="sup-card-title" style="color:var(--accent)">${escHtml(paso)} ${opBadge}</div>
              <div class="sup-card-meta">${label} · ${count} dispositivo${count!==1?'s':''}</div>
              <div class="sup-card-meta">Inspector: ${escHtml(rep.inspectorName||'—')}</div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              ${rep.jiraKey?`<a href="${JIRA_BASE_URL}/browse/${escHtml(rep.jiraKey)}" target="_blank" onclick="event.stopPropagation()" style="font-size:10px;background:rgba(0,174,255,.15);color:var(--accent2);padding:3px 8px;border-radius:8px;font-family:var(--mono);display:block;margin-bottom:6px;text-decoration:underline">${rep.jiraKey}</a>`:''}
              <div class="history-badge">${count}</div>
            </div>
          </div>
        </div>`;
      }).join('');
      return `
        <div style="margin-bottom:6px;padding:8px 12px;background:var(--bg3);border-radius:10px;font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px">
          👤 ${escHtml(techName)} <span style="font-weight:400;color:var(--text3)">(${reps.length} informe${reps.length!==1?'s':''})</span>
        </div>
        ${cards}`;
    }).join('');
  }

  // Versiones AssureID — cumplimiento contra config/versiones_objetivo
  // Usamos TODOS los informes (incluidos los eliminados por técnicos desde su
  // panel) para que las métricas de cumplimiento no pierdan datos históricos.
  try {
    if (!versionesObjetivo) versionesObjetivo = await fbGetVersionesObjetivo();
    let allReportsParaMetricas = allReports;
    try { allReportsParaMetricas = await fbGetAllReports(true); } catch(e) {}
    const allScansVersion = allReportsParaMetricas.flatMap(r => r.scansSnapshot || []);
    const cump = calcularCumplimientoVersiones(allScansVersion);
    const vCont = document.getElementById('sup-versiones-content');
    if (!versionesObjetivo) {
      vCont.innerHTML = `<div class="empty-state"><p>Todavía no hay versión objetivo configurada (el monitor de GBG aún no corrió o no escribió datos).</p></div>`;
    } else {
      const pct = (ok, total) => total > 0 ? Math.round((ok/total)*100) : 0;
      const sentinelPct = pct(cump.sentinelOk, cump.sentinelTotal);
      const libraryPct = pct(cump.libraryOk, cump.libraryTotal);
      const fechaActualizado = versionesObjetivo.actualizadoEn?.seconds
        ? new Date(versionesObjetivo.actualizadoEn.seconds*1000).toLocaleString('es-AR')
        : '—';
      const pasosHtml = [...cump.porPaso.entries()].map(([paso, st]) => {
        const sp = pct(st.sentinelOk, st.sentinelTotal), lp = pct(st.libraryOk, st.libraryTotal);
        return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
          <span style="font-size:13px">${escHtml(paso)}</span>
          <span style="font-size:12px;color:var(--text3)">Sentinel <b style="color:${sp===100?'var(--accent)':'var(--warning)'}">${sp}%</b> · Library <b style="color:${lp===100?'var(--accent)':'var(--warning)'}">${lp}%</b></span>
        </div>`;
      }).join('') || '<div class="empty-state"><p>Sin datos de versión en los registros aún</p></div>';

      vCont.innerHTML = `
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:14px">
          <h3 style="margin-bottom:4px">Versión objetivo actual</h3>
          <div style="font-size:12px;color:var(--text3);margin-bottom:12px">Detectada en GBG el ${fechaActualizado}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div style="background:var(--bg3);border-radius:10px;padding:12px">
              <div style="font-size:11px;color:var(--text3);text-transform:uppercase">Sentinel</div>
              <div style="font-size:18px;font-weight:700">v${escHtml(versionesObjetivo.sentinel||'—')}</div>
              <div style="font-size:12px;color:var(--text3);margin-top:4px">${cump.sentinelOk}/${cump.sentinelTotal} PCs al día (${sentinelPct}%)</div>
            </div>
            <div style="background:var(--bg3);border-radius:10px;padding:12px">
              <div style="font-size:11px;color:var(--text3);text-transform:uppercase">Library</div>
              <div style="font-size:18px;font-weight:700">v${escHtml(versionesObjetivo.library||'—')}</div>
              <div style="font-size:12px;color:var(--text3);margin-top:4px">Promedio ${libraryPct}% (tolerancia 90 días)</div>
            </div>
          </div>
        </div>
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:14px">
          <h3 style="margin-bottom:10px">Cumplimiento por Paso</h3>
          ${pasosHtml}
        </div>
        ${cump.pcsDesactualizadas.length ? `
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:18px">
          <h3 style="margin-bottom:10px">PCs desactualizadas (${cump.pcsDesactualizadas.length})</h3>
          ${cump.pcsDesactualizadas.map(pc => `
            <div style="padding:8px 0;border-bottom:1px solid var(--border);font-size:12px">
              <div style="font-weight:600">${escHtml(pc.paso)} — ${escHtml(pc.pcNombre||pc.puesto||'—')}</div>
              <div style="color:var(--text3)">${pc.sentinelOk===false?`Sentinel v${escHtml(pc.engine||'?')} `:''}${pc.libraryOk===false?`Library v${escHtml(pc.docLib||'?')}`:''}</div>
            </div>
          `).join('')}
        </div>` : ''}
      `;
    }
  } catch(e) { console.error('Error calculando cumplimiento de versiones:', e); }

  // Técnicos
  try {
    const users=await fbGetAllUsers();
    let locsByUser={};
    try {
      const locs=await fbGetAllLocations();
      locs.forEach(l=>{ if(l.userId) locsByUser[l.userId]=l; });
    } catch(e){}
    const tecList=document.getElementById('sup-tecnicos-list');
    const tecs=users.filter(u=>u.role==='tecnico');
    if(!tecs.length){tecList.innerHTML=`<div class="empty-state"><p>Sin técnicos registrados</p></div>`;}
    else {
      tecList.innerHTML=tecs.map(u=>{
        const uReports=allReports.filter(r=>r.userId===u.id);
        const loc=locsByUser[u.id];
        const t=loc?.updatedAt?.seconds?new Date(loc.updatedAt.seconds*1000).toLocaleString('es-AR'):'';
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
          ${loc?.lat?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-end;gap:10px">
            <div>
              <div style="font-size:11px;color:var(--accent);font-family:var(--mono)">📍 ${loc.lat.toFixed(6)}, ${loc.lon.toFixed(6)}</div>
              <div style="font-size:11px;color:var(--text3);margin-top:2px">${escHtml((loc.address||'').split(',').slice(0,2).join(','))}</div>
              ${t?`<div style="font-size:10px;color:var(--text3);margin-top:2px">${t}</div>`:''}
            </div>
            <a href="https://maps.google.com/?q=${loc.lat},${loc.lon}" target="_blank" style="background:rgba(0,212,170,.1);border:1px solid rgba(0,212,170,.2);color:var(--accent);padding:6px 10px;border-radius:8px;font-size:11px;text-decoration:none;white-space:nowrap">Ver mapa →</a>
          </div>`:`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;color:var(--text3)">Sin ubicación reciente</div>`}
        </div>`;
      }).join('');
    }
  } catch(e) {}
}

let liveMapInstance = null;
let liveMapMarkers = {}; // userId -> L.marker

function startLiveMap() {
  if (liveMapStarted) return;
  liveMapStarted = true;

  // Centro inicial aproximado (Buenos Aires); se ajusta automáticamente cuando llegan ubicaciones reales
  liveMapInstance = L.map('leaflet-map', { zoomControl: true }).setView([-34.6, -58.4], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(liveMapInstance);

  unsubLocations = fbWatchLocations(locs => {
    // Marcadores en el mapa Leaflet
    if (!liveMapInstance) return;
    const seenIds = new Set();
    locs.forEach(l => {
      if (!l.lat || !l.lon) return;
      const uid = l.userId || l.userName;
      seenIds.add(uid);
      const t = l.updatedAt?.seconds ? new Date(l.updatedAt.seconds*1000).toLocaleString('es-AR') : '';
      const popupHtml = `<strong>${escHtml(l.userName||'—')}</strong><br>${escHtml((l.address||'').split(',').slice(0,2).join(','))}<br><span style="color:#888;font-size:11px">${t}</span>`;
      if (liveMapMarkers[uid]) {
        liveMapMarkers[uid].setLatLng([l.lat, l.lon]).setPopupContent(popupHtml);
      } else {
        liveMapMarkers[uid] = L.marker([l.lat, l.lon]).addTo(liveMapInstance).bindPopup(popupHtml);
      }
    });
    // Quitar marcadores de técnicos que ya no están en la lista (dejaron de compartir ubicación)
    Object.keys(liveMapMarkers).forEach(uid => {
      if (!seenIds.has(uid)) {
        liveMapInstance.removeLayer(liveMapMarkers[uid]);
        delete liveMapMarkers[uid];
      }
    });
    // Encuadrar el mapa para mostrar todos los marcadores activos
    const activeMarkers = Object.values(liveMapMarkers);
    if (activeMarkers.length === 1) {
      liveMapInstance.setView(activeMarkers[0].getLatLng(), 14);
    } else if (activeMarkers.length > 1) {
      const group = L.featureGroup(activeMarkers);
      liveMapInstance.fitBounds(group.getBounds(), { padding: [30,30] });
    }
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
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div class="vr-title" style="margin:0">Informe de Visita</div>
      <img src="${DANAIDE_LOGO}" style="height:24px;object-fit:contain;opacity:.85">
    </div>
    <div class="vr-sub">${label} · ${scans.length} scanner${scans.length!==1?'s':''}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${fTag('Técnico',rep.technicianName)} ${fTag('Inspector DNM',rep.inspectorName)}
    </div>
    ${rep.jiraKey?`<div style="font-size:12px;color:var(--accent2);background:rgba(0,174,255,.1);padding:8px 12px;border-radius:8px;margin-bottom:12px;font-family:var(--mono)">🔗 Jira: <a href="${JIRA_BASE_URL}/browse/${escHtml(rep.jiraKey)}" target="_blank" style="color:var(--accent2);text-decoration:underline">${escHtml(rep.jiraKey)}</a></div>`:''}
    ${scans.map((s,i)=>`<div style="border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:10px;background:var(--bg3)">
      <div style="font-size:13px;font-weight:600;color:var(--accent);margin-bottom:8px">${i+1}. ${escHtml(s.paso||'—')} <span class="op-badge ${s.opType||'mantenimiento'}">${opLabel(s.opType)}</span></div>
      ${(s.photoUrls?.length>0?s.photoUrls:(s.photos||[])).map(p=>`<img src="${p}" style="width:100%;border-radius:8px;margin:6px 0;display:block">`).join('')}

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:6px 0 4px">🖨 Scanner DESKO</div>
      <div style="font-size:12px;color:var(--text2)">
        ${s.scannerSerie?`Serie: <strong style="color:var(--text)">${escHtml(s.scannerSerie)}</strong> · `:''}
        ${s.scannerModelo?`Modelo: <strong style="color:var(--text)">${escHtml(s.scannerModelo)}</strong> · `:''}
        Puesto: <strong style="color:var(--text)">${escHtml(s.puesto||'—')}</strong>
        ${s.invDnd?` · N° Inv. DND: <strong>${escHtml(s.invDnd)}</strong>`:''}
        ${s.invDnm?` · N° Inv. DNM: <strong>${escHtml(s.invDnm)}</strong>`:''}
        ${s.serieRetira?`<br>Retira: <span style="color:var(--warning)">${escHtml(s.serieRetira)}</span> → Nuevo: <span style="color:var(--accent)">${escHtml(s.serieNuevo||'—')}</span>`:''}
        ${s.instalacionReemplazoData?`<br>Equipo retirado: <span style="color:var(--text)">${escHtml(s.instalacionReemplazoData.marcaVieja)} — ${escHtml(s.instalacionReemplazoData.serieVieja)}</span>`:''}
      </div>

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 4px">💻 PC</div>
      <div style="font-size:12px;color:var(--text2)">
        ${s.pcNombre?`Nombre: <strong>${escHtml(s.pcNombre)}</strong> · `:''}Serie PC: <strong>${escHtml(s.serie||'—')}</strong>
      </div>
      ${s.lat?`<div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-top:2px">📍 ${s.lat.toFixed(6)}, ${s.lon.toFixed(6)}${s.address?' — '+escHtml(s.address):''}</div>`:''}
      ${s.jiraTicket?`<div style="font-size:10px;color:var(--accent2);font-family:var(--mono);margin-top:2px">🎫 <a href="${JIRA_BASE_URL}/browse/${escHtml(s.jiraTicket)}" target="_blank" style="color:var(--accent2);text-decoration:underline">${escHtml(s.jiraTicket)}</a></div>`:''}
      ${datosSistemaHtml(s.datosSistema)}

      <div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin:8px 0 4px">✅ Checklists</div>
      ${s.opType==='instalacion_nueva'||s.opType==='instalacion_reemplazo'?checklistInstalacionHtml(s.checklistInstalacion):checklistHtml(s.checklist)}
      ${s.opType==='reemplazo'?fallaChecklistHtml(s.actaReemplazo):''}
      ${s.opType==='falla_reparable'?fallaReparableHtml(s.fallaReparable):''}
      ${s.opType==='reemplazo'?`<button class="btn-secondary" style="margin-top:8px;width:100%;font-size:12px" onclick="downloadActaReemplazo('${s.id||s.fbId}')">📄 Descargar Acta de Reemplazo</button>`:''}
    </div>`).join('')}
    <div class="vr-sig-label">Firma del Inspector DNM — ${escHtml(rep.inspectorName||'')}</div>
    ${sig?`<img src="${sig}" class="vr-sig-img" alt="Firma">`:'<div style="color:var(--text3);font-size:12px;padding:8px">Sin firma</div>'}
  `;
  showPage('view-report');
}
window.viewReportSupervisor = viewReportSupervisor;

// ======== MIS TICKETS JIRA ========
// Carga los tickets de Jira asignados al técnico actual, filtrados por contrato DNM
// y estado pendiente (no resueltos ni cerrados).
let cachedJiraTickets = [];
let jiraTicketsLoading = false;

async function loadJiraTickets(forceRefresh = false) {
  if (jiraTicketsLoading) return;
  if (!currentUser?.email) return;
  if (cachedJiraTickets.length && !forceRefresh) {
    renderJiraTickets(cachedJiraTickets);
    return;
  }
  jiraTicketsLoading = true;

  // JQL: tickets del proyecto DND asignados al técnico, contrato DNM, no cerrados
  const jql = `project = DND AND assignee = "${currentUser.email}" AND "Contratos" = "Dirección Nacional de Migraciones" AND status not in (Resuelto, Cerrado, Done, Closed) ORDER BY created DESC`;

  try {
    const res = await fetch(JIRA_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: '/rest/api/3/search/jql',
        method: 'POST',
        jiraBody: {
          jql,
          maxResults: 20,
          fields: ['summary', 'status', 'priority', 'created', 'issuetype', 'customfield_10051']
        }
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cachedJiraTickets = (data.issues || []).map(issue => ({
      key: issue.key,
      summary: issue.fields.summary,
      status: issue.fields.status?.name || '—',
      statusCategory: issue.fields.status?.statusCategory?.key || 'new',
      priority: issue.fields.priority?.name || '—',
      issuetype: issue.fields.issuetype?.name || '—',
      tipoTarea: issue.fields.customfield_10051?.value || null,
      created: issue.fields.created
    }));
    renderJiraTickets(cachedJiraTickets);
    updateJiraBadge(cachedJiraTickets.length);
  } catch(e) {
    console.error('Error cargando tickets Jira:', e);
    renderJiraTickets(null); // muestra error
  } finally {
    jiraTicketsLoading = false;
  }
}
window.loadJiraTickets = loadJiraTickets;

function updateVersionBadge() {
  const wrap = document.getElementById('version-badge-wrap');
  const badge = document.getElementById('version-badge');
  if (!wrap || !badge) return;
  if (currentUser?.role !== 'supervisor') { wrap.classList.add('hidden'); return; }
  wrap.classList.remove('hidden');
  if (versionesObjetivo?.cambioDetectado) {
    badge.classList.remove('hidden'); badge.style.display = 'flex';
  } else {
    badge.classList.add('hidden');
  }
}

function updateJiraBadge(count) {
  const badge = document.getElementById('jira-badge');
  const badgeMenu = document.getElementById('jira-badge-menu');
  const homeWrap = document.getElementById('jira-tickets-home-wrap');
  if (count > 0) {
    if (badge) { badge.textContent = count > 9 ? '9+' : count; badge.classList.remove('hidden'); badge.style.display = 'flex'; }
    if (badgeMenu) { badgeMenu.textContent = count; badgeMenu.classList.remove('hidden'); }
    if (homeWrap) homeWrap.classList.remove('hidden');
  } else {
    if (badge) { badge.classList.add('hidden'); }
    if (badgeMenu) { badgeMenu.classList.add('hidden'); }
    if (homeWrap) homeWrap.classList.add('hidden');
  }
}

function jiraStatusColor(statusCategory) {
  if (statusCategory === 'done') return 'var(--accent)';
  if (statusCategory === 'indeterminate') return 'var(--warning)';
  return 'var(--text3)';
}

function renderJiraTicketCard(t, compact = false) {
  const fecha = t.created ? new Date(t.created).toLocaleDateString('es-AR', {day:'2-digit',month:'2-digit'}) : '';
  const color = jiraStatusColor(t.statusCategory);
  return `<div class="scan-item" style="cursor:pointer" onclick="window.open('${JIRA_BASE_URL}/browse/${escHtml(t.key)}','_blank')">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px">
      <span style="font-family:var(--mono);font-size:12px;font-weight:700;color:var(--accent)">${escHtml(t.key)}</span>
      <span style="font-size:10px;font-weight:600;color:${color};background:${color}22;padding:2px 8px;border-radius:10px;white-space:nowrap">${escHtml(t.status)}</span>
    </div>
    <div style="font-size:13px;color:var(--text);margin-bottom:4px;line-height:1.3">${escHtml(t.summary)}</div>
    ${!compact ? `<div style="display:flex;gap:8px;flex-wrap:wrap">
      ${t.tipoTarea ? `<span style="font-size:10px;color:var(--text3)">📋 ${escHtml(t.tipoTarea)}</span>` : ''}
      <span style="font-size:10px;color:var(--text3)">🏷 ${escHtml(t.issuetype)}</span>
      ${fecha ? `<span style="font-size:10px;color:var(--text3)">📅 ${fecha}</span>` : ''}
    </div>` : ''}
  </div>`;
}

function renderJiraTickets(tickets) {
  const homeList = document.getElementById('jira-tickets-home-list');
  const pageList = document.getElementById('jira-tickets-page-list');

  if (tickets === null) {
    // Error al cargar
    const errHtml = `<div class="empty-state"><p style="color:var(--danger)">No se pudieron cargar los tickets. Verificá tu conexión.</p></div>`;
    if (homeList) homeList.innerHTML = errHtml;
    if (pageList) pageList.innerHTML = errHtml;
    return;
  }

  if (tickets.length === 0) {
    const emptyHtml = `<div class="empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2"/></svg><p>Sin tickets pendientes asignados</p></div>`;
    if (homeList) homeList.innerHTML = emptyHtml;
    if (pageList) pageList.innerHTML = emptyHtml;
    return;
  }

  // Home: mostrar máximo 3 en modo compacto
  if (homeList) {
    homeList.innerHTML = tickets.slice(0, 3).map(t => renderJiraTicketCard(t, true)).join('');
  }
  // Página completa: todos con detalle
  if (pageList) {
    pageList.innerHTML = tickets.map(t => renderJiraTicketCard(t, false)).join('');
  }
}





// ======== SYNC ALL ========
async function syncAllReports() {
  const unsynced = localReports.filter(r => !r.fbId);
  if (!unsynced.length) { showToast('Todo sincronizado','success'); return; }
  showToast(`Sincronizando ${unsynced.length} informe${unsynced.length!==1?'s':''}...`);
  let ok = 0, lastErr = '';
  for (const rep of unsynced) {
    try {
      const repFb = {
        ...rep,
        scansSnapshot: (rep.scansSnapshot||[]).map(({photos,...m})=>({...m,photoCount:(photos||[]).length}))
      };
      const fbId = await fbSaveReport(repFb);
      const ri = localReports.findIndex(r=>r.id===rep.id);
      if (ri>=0) localReports[ri].fbId = fbId;
      ok++;
    } catch(e) {
      lastErr = e.code||e.message||'Error';
      console.error('Sync failed:', rep.id, lastErr);
    }
  }
  // Persist updated fbIds
  try {
    const repsForStorage = localReports.map(rep => ({
      ...rep,
      scansSnapshot: (rep.scansSnapshot||[]).map(({photos,...s})=>({...s}))
    }));
    localStorage.setItem('scancheck_local_reports_' + currentUser.id, JSON.stringify(repsForStorage));
  } catch(e) {}
  renderHistory();
  if (ok > 0) showToast(`✓ ${ok} informe${ok!==1?'s':''} sincronizado${ok!==1?'s':''}`, 'success');
  else showToast(`Fallo: ${lastErr}`, 'error');
}
window.syncAllReports = syncAllReports;

// ======== GOOGLE SHEETS EXPORT ========
const CLAUDE_PROXY_URL = 'https://scancheck-claude-proxy.elopapa.workers.dev';
const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImJkYjcxYTYzOTE1YzQxMTVhYjBmMzdjN2FjYjJiNGE3IiwiaCI6Im11cm11cjY0In0=';
const APP_VERSION = '25.06.2026-v201'; // Fecha + nro de SW — actualizar junto con sw.js

// ── Cloudflare R2 Photos Proxy ───────────────────────────────
const PHOTOS_PROXY_URL = 'https://scancheck-photos-proxy.elopapa.workers.dev';
const PHOTOS_TOKEN     = 'SC_Photos2026_Danaide_XkP9mQ3rTv59828daNa'; // mismo valor que SCANCHECK_PHOTOS_TOKEN en el Worker

const JIRA_PROXY_URL = 'https://scancheck-jira-proxy.elopapa.workers.dev';
const JIRA_BASE_URL = 'https://danaide-enterprise.atlassian.net';
const GOOGLE_CLIENT_ID = '1033851892465-fdfkguq9uba6pfie61id75rhnnn4fj1h.apps.googleusercontent.com';
const GOOGLE_SHEET_ID  = '17lJBVQaLyxrYC_KoTjalnoZ7UhOkX2pT9xm0LhoIA54';
const SHEET_RANGE      = 'ScanCheck-App!A:Z';

let gsiTokenClient = null;
let gsiAccessToken = null;

function getGsiTokenClient() {
  if (gsiTokenClient) return gsiTokenClient;
  if (!window.google || !window.google.accounts) return null;
  gsiTokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    callback: () => {} // overridden per-request
  });
  return gsiTokenClient;
}

function getGoogleAccessToken() {
  return new Promise((resolve, reject) => {
    const client = getGsiTokenClient();
    if (!client) { reject(new Error('Google Identity Services no cargó. Verificá tu conexión.')); return; }
    gsiTokenClient.callback = (resp) => {
      if (resp.error) { reject(new Error(resp.error)); return; }
      gsiAccessToken = resp.access_token;
      resolve(gsiAccessToken);
    };
    gsiTokenClient.requestAccessToken({ prompt: gsiAccessToken ? '' : 'consent' });
  });
}

// Parse AssureID fields from legacy pcData text (older scans before structured fields existed)
function parsePcDataAssure(pcData) {
  if (!pcData) return {};
  const get = (re) => { const m = pcData.match(re); return m ? m[1].trim() : ''; };
  return {
    engine: get(/Engine:\s*([^\s]+)/i),
    docLib: get(/DocLib:\s*([^\s]+)/i),
    licKey: get(/LicKey:\s*([^\s]+)/i)
  };
}

// Build flat rows from all scans (supervisor sees all via fbGetAllReports)
// Para cálculo de cumplimiento de versiones: nos interesa la ÚLTIMA visita de
// cada PC en TODA la historia (no por día como deduplicateScans), para no
// contar la misma PC más de una vez si tuvo varias visitas en momentos distintos.
function ultimaVisitaPorPC(allScans) {
  const map = new Map();
  allScans.forEach(s => {
    // Clave de PC: preferimos serie de PC, si no hay usamos paso+puesto+nombrePC como fallback
    const key = (s.serie || '').trim() || `${(s.paso||'').trim()}__${(s.puesto||'').trim()}__${(s.pcNombre||'').trim()}`;
    if (!key) return;
    const existing = map.get(key);
    const ts = s.timestamp ? new Date(s.timestamp).getTime() : 0;
    const existingTs = existing?.timestamp ? new Date(existing.timestamp).getTime() : -1;
    if (!existing || ts > existingTs) map.set(key, s);
  });
  return [...map.values()];
}

// Calcula el cumplimiento de versiones (Sentinel y Library, por separado) agrupado
// globalmente, por Paso, y por Provincia — a partir de la última visita de cada PC.
function calcularCumplimientoVersiones(allScans) {
  const ultimas = ultimaVisitaPorPC(allScans).filter(s => s.assureEngine || s.assureDocLib);
  const resultado = {
    total: ultimas.length,
    sentinelOk: 0, sentinelTotal: 0,
    libraryOk: 0, libraryTotal: 0,
    porPaso: new Map(),   // paso -> {sentinelOk, sentinelTotal, libraryOk, libraryTotal, pcs: []}
    pcsDesactualizadas: []
  };

  ultimas.forEach(s => {
    const { sentinelOk, libraryOk, libraryScore } = evaluarCumplimientoVersion(s);
    const paso = (s.paso||'').trim() || '(Sin paso)';
    if (!resultado.porPaso.has(paso)) resultado.porPaso.set(paso, { sentinelOk:0, sentinelTotal:0, libraryOk:0, libraryTotal:0 });
    const pasoStats = resultado.porPaso.get(paso);

    if (sentinelOk !== null) {
      resultado.sentinelTotal++; pasoStats.sentinelTotal++;
      if (sentinelOk) { resultado.sentinelOk++; pasoStats.sentinelOk++; }
    }
    if (libraryOk !== null) {
      resultado.libraryTotal++; pasoStats.libraryTotal++;
      const lScore = libraryScore ?? (libraryOk ? 1 : 0);
      resultado.libraryOk += lScore; pasoStats.libraryOk += lScore;
    }
    if (sentinelOk === false || libraryOk === false) {
      resultado.pcsDesactualizadas.push({
        paso, puesto: s.puesto, pcNombre: s.pcNombre, serie: s.serie,
        engine: s.assureEngine, docLib: s.assureDocLib,
        sentinelOk, libraryOk, timestamp: s.timestamp
      });
    }
  });

  return resultado;
}

function deduplicateScans(allScans) {
  // Regla: un registro por scanner por día, pero:
  // - Si el mismo scanner aparece en un PASO distinto ese día (cambia de PC, lo trasladan junto con
  //   la PC a otro puesto, o cualquier combinación), se considera otro evento — no se fusiona.
  // - Los reemplazos (serie retira + serie nueva) SIEMPRE se conservan aparte, nunca se fusionan con
  //   otro evento del mismo día, porque documentan un cambio físico de equipo.
  const reemplazos = [];
  const normales = [];
  allScans.forEach(s => {
    // cambio_equipo (nuevo nombre) y reemplazo (legacy) son siempre eventos únicos no deduplicables
    if (s.opType === 'cambio_equipo' || s.opType === 'reemplazo' || s.serieRetira) reemplazos.push(s);
    else normales.push(s);
  });

  const map = new Map();
  normales.forEach(s => {
    const day = s.timestamp ? new Date(s.timestamp).toISOString().slice(0,10) : 'sin-fecha';
    const serie = (s.scannerSerie || '').trim();
    const contextKey = `${(s.paso||'').trim()}__${(s.pcNombre||'').trim()}__${(s.puesto||'').trim()}__${(s.serie||'').trim()}`;
    const key = serie
      ? `${day}__serie:${serie}__ctx:${contextKey}`
      : `${day}__sinserie__ctx:${contextKey}`;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, s);
    } else {
      // Quedarse con el más reciente
      const existingTs = existing.timestamp ? new Date(existing.timestamp).getTime() : 0;
      const newTs = s.timestamp ? new Date(s.timestamp).getTime() : 0;
      if (newTs > existingTs) map.set(key, s);
    }
  });
  // Los reemplazos se devuelven todos, sin pasar por deduplicación
  return [...Array.from(map.values()), ...reemplazos];
}

// Traduce el valor técnico de scannerEstado (el mismo que devuelve Get-PnpDevice en
// Windows: OK/Unknown/Error/Degraded, más "Dañado" que es de selección manual) a la
// misma etiqueta en español que ve el técnico en el desplegable de la app.
// ── Versiones objetivo de AssureID (alimentadas por el GBG Monitor externo) ──
let versionesObjetivo = null; // {library, sentinel, actualizadoEn, fuente, cambioDetectado}
let unsubVersionesObjetivo = null;

// Compara dos strings de versión tipo "6.13.30.48" numéricamente, segmento a
// segmento. Devuelve true si `actual` es igual o más nueva que `objetivo`.
// Tolerante a formatos con distinta cantidad de segmentos (ej: "6.13.30" vs "6.13.30.48").
function versionEsActualOMasNueva(actual, objetivo) {
  if (!actual || !objetivo) return null; // sin datos suficientes para comparar
  const a = String(actual).split('.').map(n => parseInt(n, 10) || 0);
  const o = String(objetivo).split('.').map(n => parseInt(n, 10) || 0);
  const len = Math.max(a.length, o.length);
  for (let i = 0; i < len; i++) {
    const av = a[i] || 0, ov = o[i] || 0;
    if (av > ov) return true;
    if (av < ov) return false;
  }
  return true; // iguales
}

// Evalúa el cumplimiento de un scan contra las versiones objetivo vigentes.
// Devuelve {sentinelOk, libraryOk, libraryScore} donde:
// - sentinelOk: true/false/null (binario — Engine no cambia frecuentemente)
// - libraryOk: true si libraryScore >= 0.5, false si no
// - libraryScore: 0.0-1.0 con tolerancia de 90 días (fórmula lineal)
//   0 días de retraso → 1.0 (100%), 45 días → 0.5 (50%), 90+ días → 0.0 (0%)
const DOCLIB_TOLERANCIA_DIAS = 90;

function calcLibraryScore(scan) {
  if (!versionesObjetivo?.library) return null;
  // Primero verificar si la versión es igual o más nueva
  const esActual = versionEsActualOMasNueva(scan.assureDocLib, versionesObjetivo.library);
  if (esActual) return 1.0;
  if (esActual === null) return null;
  // Si no es actual, calcular score basado en fecha de actualización del scan
  const fechaActualizacion = scan.datosSistema?.docLibFecha || null;
  if (!fechaActualizacion) return 0.0; // sin fecha = sin dato = score mínimo
  const diasRetraso = (Date.now() - new Date(fechaActualizacion).getTime()) / (1000 * 60 * 60 * 24);
  // Fecha de la versión objetivo (cuándo se publicó la versión actual)
  // Como no tenemos esa fecha, usamos los días desde la última actualización del scan
  // comparado con la tolerancia configurada
  return Math.max(0, 1 - diasRetraso / DOCLIB_TOLERANCIA_DIAS);
}

function evaluarCumplimientoVersion(scan) {
  if (!versionesObjetivo) return { sentinelOk: null, libraryOk: null, libraryScore: null };
  const sentinelOk = versionEsActualOMasNueva(scan.assureEngine, versionesObjetivo.sentinel);
  const libraryScore = calcLibraryScore(scan);
  const libraryOk = libraryScore === null ? null : libraryScore >= 0.5;
  return { sentinelOk, libraryOk, libraryScore };
}

const SCANNER_ESTADO_LABELS = {
  'OK': 'OK',
  'Unknown': 'Desconectado',
  'Error': 'Error',
  'Degraded': 'Falla',
  'Dañado': 'Dañado'
};
function scannerEstadoLabel(estado) {
  if (!estado) return '';
  return SCANNER_ESTADO_LABELS[estado] || estado;
}

function buildExportRows(allScans) {
  const deduplicated = deduplicateScans(allScans);
  const headers = [
    'Fecha', 'Técnico', 'Inspector DNM', 'Paso', 'Tipo Operación',
    'Puesto', 'Nombre PC', 'Serie PC',
    'Serie Scanner', 'Modelo Scanner', 'Estado Scanner', 'N° Inv. DND', 'N° Inv. DNM',
    'AssureID Engine', 'AssureID DocLib', 'AssureID LicKey',
    'Sentinel Actualizado', 'Library Actualizado',
    'Latitud', 'Longitud', 'Dirección',
    'Serie Retira', 'Serie Nueva', 'Falla Detectada (Acta)',
    'Equipo Retirado (Contrato Anterior) Marca', 'Equipo Retirado (Contrato Anterior) Serie',
    'Ticket Jira',
    'Check Vidrio', 'Check Cable USB', 'Check Fuente', 'Check Limpieza'
  ];
  console.log(`Export: ${allScans.length} registros → ${deduplicated.length} tras deduplicar`);
  const rows = deduplicated.map(s => {
    const legacy = parsePcDataAssure(s.pcData);
    if (!s.assureEngine && !legacy.engine) console.warn('No AssureID data for scan', s.id, '— pcData:', s.pcData?.substring(0,100));
    const ck = s.checklist || {};
    const fk = s.actaReemplazo?.fallaChecklist;
    const fallaResumen = fk ? Object.keys(FALLA_LABELS).filter(k=>fk[k]).map(k=>FALLA_LABELS[k]).concat(fk.otro?[`Otro: ${fk.otroTexto||''}`]:[]).join(' | ') : '';
    // Cumplimiento de versión: "Sí"/"No" si hay dato para comparar, vacío si no aplica
    // (sin versión objetivo configurada, o el scan no tiene esa versión registrada).
    const { sentinelOk, libraryOk, libraryScore } = evaluarCumplimientoVersion(s);
    const cumplimientoLabel = (ok) => ok === null ? '' : (ok ? 'Sí' : 'No');
    return [
      s.timestamp ? new Date(s.timestamp).toLocaleString('es-AR') : '',
      s.userName || s.technicianName || '',
      s.inspectorName || '',
      s.paso || '',
      opLabel(s.opType),
      s.puesto || '',
      s.pcNombre || '',
      s.serie || '',
      s.scannerSerie || '',
      s.scannerModelo || '',
      scannerEstadoLabel(s.scannerEstado),
      s.invDnd || '',
      s.invDnm || '',
      s.assureEngine || legacy.engine || '',
      s.assureDocLib || legacy.docLib || '',
      s.assureLicKey || legacy.licKey || '',
      cumplimientoLabel(sentinelOk),
      cumplimientoLabel(libraryOk),
      s.lat != null ? s.lat : '',
      s.lon != null ? s.lon : '',
      s.address || '',
      s.serieRetira || '',
      s.serieNuevo || '',
      fallaResumen,
      s.instalacionReemplazoData?.marcaVieja || '',
      s.instalacionReemplazoData?.serieVieja || '',
      s.jiraTicket || '',
      ck.vidrio ? 'OK' : '',
      ck.cableUsb ? 'OK' : '',
      ck.fuente ? 'OK' : '',
      ck.limpieza ? 'OK' : ''
    ];
  });
  return [headers, ...rows];
}

async function exportToGoogleSheets() {
  const btn = document.getElementById('btn-export-sheets');
  const statusEl = document.getElementById('export-status');
  btn.disabled = true; btn.style.opacity = '0.6';
  statusEl.textContent = 'Iniciando sesión con Google...';

  try {
    await getGoogleAccessToken();
    statusEl.textContent = 'Recopilando datos de todos los técnicos...';

    // Asegurar que tengamos la versión objetivo cargada para las columnas de
    // cumplimiento, sin depender de que el supervisor haya abierto antes la
    // pestaña "Versiones" (que es la que normalmente la carga).
    if (!versionesObjetivo) {
      try { versionesObjetivo = await fbGetVersionesObjetivo(); } catch(e) {}
    }

    // Collect all scans: from all reports' scansSnapshot (supervisor sees all reports)
    let allReports = [];
    try {
      allReports = await fbGetAllReports(true); // incluye eliminados: el export conserva todo el histórico
    } catch(e) {
      // Fallback to local data if offline
      allReports = localReports;
    }

    const allScans = [];
    allReports.forEach(rep => {
      (rep.scansSnapshot||[]).forEach(s => {
        allScans.push({ ...s, inspectorName: rep.inspectorName, technicianName: rep.technicianName });
      });
    });

    if (allScans.length === 0) {
      statusEl.textContent = 'No hay registros para exportar.';
      btn.disabled = false; btn.style.opacity = '1';
      return;
    }

    statusEl.textContent = `Exportando ${allScans.length} registros...`;

    const rows = buildExportRows(allScans);
    const exportedCount = rows.length - 1; // -1 por headers
    const duplicatesRemoved = allScans.length - exportedCount;

    // Clear existing content first, then write
    const sheetRangeEncoded = encodeURIComponent(SHEET_RANGE);
    const clearRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${sheetRangeEncoded}:clear`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${gsiAccessToken}`, 'Content-Type': 'application/json' }
    });
    if (!clearRes.ok) {
      const err = await clearRes.json().catch(()=>({}));
      throw new Error(`Error al limpiar la hoja: ${err.error?.message || `HTTP ${clearRes.status}`}`);
    }

    const writeRange = encodeURIComponent('ScanCheck-App!A1');
    const writeRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${writeRange}?valueInputOption=RAW`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${gsiAccessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: rows })
    });

    if (!writeRes.ok) {
      const err = await writeRes.json().catch(()=>({}));
      throw new Error(err.error?.message || `HTTP ${writeRes.status}`);
    }

    const dupMsg = duplicatesRemoved > 0 ? ` (${duplicatesRemoved} duplicados eliminados)` : '';
    statusEl.textContent = `✓ ${exportedCount} registros exportados${dupMsg}.`;
    showToast(`✓ ${exportedCount} registros exportados a Sheets${dupMsg}`, 'success');

  } catch(e) {
    console.error('Export error:', e);
    statusEl.textContent = 'Error: ' + e.message;
    showToast('Error al exportar: ' + e.message, 'error');
  } finally {
    btn.disabled = false; btn.style.opacity = '1';
  }
}
window.exportToGoogleSheets = exportToGoogleSheets;

// ======== TOAST ========
let toastTimer;
function showToast(msg,type=''){
  const t=document.getElementById('toast');
  t.textContent=msg; t.className='toast'+(type?' '+type:''); t.classList.remove('hidden');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.add('hidden'),2800);
}

function escHtml(str){return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
