// ======== STATE ========
const DB = {
  scans: [], // {id, paso, puesto, serie, notas, photoData, lat, lon, address, timestamp}
  reports: [] // {id, date, scans, signature, createdAt}
};

let currentPage = 'home';
let pageHistory = [];
let currentScan = null; // scan being edited/viewed
let currentReport = null;
let cameraStream = null;
let capturedPhoto = null;
let capturedPhotoInfo = null;
let sigCanvas, sigCtx, sigDrawing = false, sigHasDraw = false;
let currentLocation = null;

// ======== INIT ========
window.addEventListener('DOMContentLoaded', () => {
  loadData();
  initSignatureCanvas();
  updateHeroDate();
  updateStats();
  renderTodayList();
  requestLocation();

  // Hide splash after 1.8s
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.classList.add('hidden');
      document.getElementById('app').classList.remove('hidden');
    }, 600);
  }, 1800);

  // Register SW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});

// ======== STORAGE ========
function saveData() {
  try { localStorage.setItem('scancheck_db', JSON.stringify(DB)); } catch(e) {}
}
function loadData() {
  try {
    const d = localStorage.getItem('scancheck_db');
    if (d) { const p = JSON.parse(d); DB.scans = p.scans||[]; DB.reports = p.reports||[]; }
  } catch(e) {}
}

// ======== GEOLOCATION ========
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
    if (currentLocation) currentLocation.address = d.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  } catch(e) {
    if (currentLocation) currentLocation.address = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  }
}

function getLocationString() {
  if (!currentLocation) return 'Ubicación no disponible';
  const addr = currentLocation.address || `${currentLocation.lat.toFixed(5)}, ${currentLocation.lon.toFixed(5)}`;
  // Shorten to ~50 chars
  return addr.length > 60 ? addr.substring(0, 57) + '...' : addr;
}

function getWatermarkLines() {
  const now = new Date();
  const fecha = now.toLocaleDateString('es-AR', { weekday:'short', day:'2-digit', month:'short', year:'numeric' });
  const hora = now.toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const loc = getLocationString();
  return [fecha + '  ' + hora, loc];
}

// ======== NAVIGATION ========
function showPage(name, addHistory = true) {
  const current = document.getElementById('page-' + currentPage);
  const next = document.getElementById('page-' + name);
  if (!next) return;

  if (current) current.classList.remove('active');
  next.classList.add('active');

  if (addHistory && name !== currentPage) pageHistory.push(currentPage);
  currentPage = name;

  document.getElementById('page-title').textContent = pageTitles[name] || name;
  document.getElementById('btn-back').classList.toggle('hidden', pageHistory.length === 0);

  // Page-specific setup
  if (name === 'home') { updateStats(); renderTodayList(); }
  if (name === 'history') renderHistory();
  if (name === 'new-scan') resetNewScanForm();
}

const pageTitles = {
  'home': 'Inicio',
  'new-scan': 'Nuevo Registro',
  'report': 'Informe del Día',
  'view-report': 'Ver Informe',
  'history': 'Historial'
};

function goBack() {
  if (pageHistory.length === 0) return;
  const prev = pageHistory.pop();
  showPage(prev, false);
}

function toggleMenu() {
  document.getElementById('dropdown-menu').classList.toggle('hidden');
}

document.addEventListener('click', e => {
  const menu = document.getElementById('dropdown-menu');
  if (!menu.classList.contains('hidden') && !e.target.closest('#dropdown-menu') && !e.target.closest('#btn-menu')) {
    menu.classList.add('hidden');
  }
});

// ======== DATE / STATS ========
function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function updateHeroDate() {
  const now = new Date();
  const label = now.toLocaleDateString('es-AR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  document.getElementById('hero-date').textContent = label.charAt(0).toUpperCase() + label.slice(1);
}

function updateStats() {
  const today = getTodayKey();
  const todayScans = DB.scans.filter(s => s.timestamp.startsWith(today));
  document.getElementById('stat-today').textContent = todayScans.length;
  document.getElementById('stat-total').textContent = DB.scans.length;
  document.getElementById('stat-reports').textContent = DB.reports.length;

  const wrap = document.getElementById('btn-close-day-wrap');
  wrap.classList.toggle('hidden', todayScans.length === 0);
}

// ======== TODAY LIST ========
function renderTodayList() {
  const today = getTodayKey();
  const scans = DB.scans.filter(s => s.timestamp.startsWith(today)).reverse();
  const container = document.getElementById('today-list');

  if (scans.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
      <p>Sin registros hoy</p>
    </div>`;
    return;
  }

  container.innerHTML = scans.map(s => {
    const time = new Date(s.timestamp).toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit' });
    const thumb = s.photoData
      ? `<img src="${s.photoData}" alt="foto">`
      : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`;
    return `<div class="scan-item" onclick="viewScan('${s.id}')">
      <div class="scan-item-thumb">${thumb}</div>
      <div class="scan-item-info">
        <div class="scan-item-paso">${escHtml(s.paso || '(Sin nombre)')}</div>
        <div class="scan-item-meta">Puesto: ${escHtml(s.puesto||'—')} · Serie: ${escHtml(s.serie||'—')}</div>
      </div>
      <div class="scan-item-time">${time}</div>
      <div class="scan-item-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,18 15,12 9,6"/></svg></div>
    </div>`;
  }).join('');
}

// ======== NEW SCAN ========
function resetNewScanForm() {
  document.getElementById('inp-paso').value = '';
  document.getElementById('inp-puesto').value = '';
  document.getElementById('inp-serie').value = '';
  document.getElementById('inp-notas').value = '';
  capturedPhoto = null;
  capturedPhotoInfo = null;
  document.getElementById('camera-preview-wrap').classList.add('hidden');
  document.getElementById('camera-placeholder').classList.remove('hidden');
  stopCamera();
  updateLiveOverlay();
}

// ======== CAMERA ========
async function startCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } }
    });
    const vid = document.getElementById('camera-stream');
    vid.srcObject = cameraStream;
    vid.classList.remove('hidden');

    document.getElementById('camera-placeholder').classList.add('hidden');
    document.getElementById('camera-controls').classList.remove('hidden');
    document.getElementById('camera-zone').style.display = 'none';

    updateLiveOverlay();
    startLiveOverlayTimer();
    requestLocation();
  } catch(e) {
    showToast('No se pudo acceder a la cámara', 'error');
  }
}

let overlayTimer = null;
function startLiveOverlayTimer() {
  clearInterval(overlayTimer);
  overlayTimer = setInterval(updateLiveOverlay, 1000);
}
function stopLiveOverlayTimer() { clearInterval(overlayTimer); overlayTimer = null; }

function updateLiveOverlay() {
  const el = document.getElementById('cam-live-overlay');
  if (!el) return;
  const lines = getWatermarkLines();
  el.textContent = lines.join('\n');
}

function stopCamera() {
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
  const vid = document.getElementById('camera-stream');
  vid.classList.add('hidden');
  vid.srcObject = null;
  document.getElementById('camera-controls').classList.add('hidden');
  document.getElementById('camera-zone').style.display = '';
  if (!capturedPhoto) document.getElementById('camera-placeholder').classList.remove('hidden');
  stopLiveOverlayTimer();
}

function capturePhoto() {
  const vid = document.getElementById('camera-stream');
  const canvas = document.getElementById('camera-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = vid.videoWidth || 1280;
  canvas.height = vid.videoHeight || 960;
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

  // Watermark
  const lines = getWatermarkLines();
  capturedPhotoInfo = lines.join(' | ');
  drawWatermark(ctx, canvas.width, canvas.height, lines);

  capturedPhoto = canvas.toDataURL('image/jpeg', 0.82);

  stopCamera();
  document.getElementById('camera-preview-wrap').classList.remove('hidden');
  document.getElementById('camera-placeholder').classList.add('hidden');
  document.getElementById('cam-overlay-info').textContent = lines.join('\n');
}

function drawWatermark(ctx, w, h) {
  const lines = getWatermarkLines();
  const pad = 14;
  const lineH = 20;
  const boxH = lines.length * lineH + pad * 2;
  const fontSize = Math.max(12, Math.min(16, w * 0.012));

  // Semi-transparent box at bottom
  ctx.fillStyle = 'rgba(0,0,0,0.62)';
  ctx.fillRect(0, h - boxH, w, boxH);

  ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.textAlign = 'left';
  lines.forEach((line, i) => {
    ctx.fillText(line, pad, h - boxH + pad + (i + 1) * lineH - 4);
  });

  // Accent line
  ctx.fillStyle = '#00d4aa';
  ctx.fillRect(0, h - boxH, 4, boxH);
}

function retakePhoto() {
  capturedPhoto = null;
  capturedPhotoInfo = null;
  document.getElementById('camera-preview-wrap').classList.add('hidden');
  document.getElementById('camera-placeholder').classList.remove('hidden');
}

// ======== SAVE SCAN ========
function saveScan() {
  const paso = document.getElementById('inp-paso').value.trim();
  const puesto = document.getElementById('inp-puesto').value.trim();
  const serie = document.getElementById('inp-serie').value.trim();
  const notas = document.getElementById('inp-notas').value.trim();

  if (!paso) { showToast('Ingresá el nombre del paso', 'error'); document.getElementById('inp-paso').focus(); return; }
  if (!puesto) { showToast('Ingresá el número de puesto', 'error'); document.getElementById('inp-puesto').focus(); return; }
  if (!serie) { showToast('Ingresá el número de serie', 'error'); document.getElementById('inp-serie').focus(); return; }

  const scan = {
    id: 'sc_' + Date.now(),
    paso, puesto, serie, notas,
    photoData: capturedPhoto || null,
    photoInfo: capturedPhotoInfo || null,
    lat: currentLocation?.lat || null,
    lon: currentLocation?.lon || null,
    address: currentLocation?.address || null,
    timestamp: new Date().toISOString()
  };

  DB.scans.push(scan);
  saveData();
  showToast('✓ Scanner registrado', 'success');
  showPage('home');
}

// ======== VIEW SCAN ========
let modalScanId = null;
function viewScan(id) {
  const scan = DB.scans.find(s => s.id === id);
  if (!scan) return;
  modalScanId = id;

  const time = new Date(scan.timestamp).toLocaleString('es-AR');
  const photo = scan.photoData
    ? `<img src="${scan.photoData}" class="modal-photo" alt="foto">`
    : `<div style="height:100px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:13px;background:var(--bg3);border-radius:10px;margin-bottom:14px">Sin foto</div>`;

  document.getElementById('modal-scan-content').innerHTML = `
    ${photo}
    <div class="modal-fields">
      ${fieldTag('Paso', scan.paso)}
      ${fieldTag('Puesto', scan.puesto)}
      ${fieldTag('Serie', scan.serie)}
      ${fieldTag('Hora', new Date(scan.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'}))}
    </div>
    ${scan.notas ? `<div class="modal-notas">${escHtml(scan.notas)}</div>` : ''}
    <div style="font-size:11px;color:var(--text3);font-family:var(--mono);margin-bottom:8px">${time}</div>
    ${scan.address ? `<div style="font-size:11px;color:var(--text3);margin-bottom:14px">📍 ${escHtml(scan.address)}</div>` : ''}
  `;

  document.getElementById('modal-scan').classList.remove('hidden');
}

function fieldTag(label, val) {
  return `<div class="field-tag"><span>${label}</span><strong>${escHtml(val||'—')}</strong></div>`;
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function deleteScanFromModal() {
  if (!modalScanId) return;
  if (!confirm('¿Eliminar este registro?')) return;
  DB.scans = DB.scans.filter(s => s.id !== modalScanId);
  saveData();
  closeModal('modal-scan');
  updateStats();
  renderTodayList();
  showToast('Registro eliminado');
}

// ======== CLOSE DAY / REPORT ========
function closeDayReport() {
  const today = getTodayKey();
  const scans = DB.scans.filter(s => s.timestamp.startsWith(today));
  if (scans.length === 0) { showToast('No hay registros hoy', 'error'); return; }

  currentReport = { date: today, scans: scans.map(s => s.id) };
  renderReportPage(scans, today);
  showPage('report');
}

function renderReportPage(scans, dateKey) {
  const d = new Date(dateKey + 'T12:00:00');
  const label = d.toLocaleDateString('es-AR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  document.getElementById('report-date-label').textContent = label.charAt(0).toUpperCase() + label.slice(1);
  document.getElementById('report-count-label').textContent = `${scans.length} scanner${scans.length !== 1 ? 's' : ''}`;

  const list = document.getElementById('report-scan-list');
  list.innerHTML = scans.map((s, i) => {
    const photo = s.photoData
      ? `<img src="${s.photoData}" class="report-item-photo" alt="foto">`
      : `<div class="report-item-photo-none">Sin fotografía</div>`;
    return `<div class="report-item">
      <div class="report-item-header">
        <div class="report-item-num">${i+1}</div>
        <div class="report-item-title">
          <strong>${escHtml(s.paso||'—')}</strong>
          <small>Puesto ${escHtml(s.puesto||'—')} · Serie ${escHtml(s.serie||'—')}</small>
        </div>
      </div>
      ${photo}
      <div class="report-item-fields">
        ${fieldTag('Puesto', s.puesto)}
        ${fieldTag('N° Serie', s.serie)}
        ${fieldTag('Hora', new Date(s.timestamp).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'}))}
        ${fieldTag('Ubicación', s.address ? s.address.split(',')[0] : '—')}
      </div>
      ${s.notas ? `<div style="padding:0 14px 12px;font-size:12px;color:var(--text2)">${escHtml(s.notas)}</div>` : ''}
    </div>`;
  }).join('');

  // Reset signature
  sigHasDraw = false;
  if (sigCtx) { sigCtx.clearRect(0,0,sigCanvas.width,sigCanvas.height); }
  document.getElementById('sig-hint').classList.remove('hidden');
}

// ======== SIGNATURE ========
function initSignatureCanvas() {
  sigCanvas = document.getElementById('sig-canvas');
  sigCtx = sigCanvas.getContext('2d');

  const getPos = e => {
    const rect = sigCanvas.getBoundingClientRect();
    const scaleX = sigCanvas.width / rect.width;
    const scaleY = sigCanvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * scaleX, y: (src.clientY - rect.top) * scaleY };
  };

  const start = e => {
    e.preventDefault();
    sigDrawing = true;
    const p = getPos(e);
    sigCtx.beginPath();
    sigCtx.moveTo(p.x, p.y);
    if (!sigHasDraw) { sigHasDraw = true; document.getElementById('sig-hint').classList.add('hidden'); }
  };
  const move = e => {
    e.preventDefault();
    if (!sigDrawing) return;
    const p = getPos(e);
    sigCtx.lineTo(p.x, p.y);
    sigCtx.strokeStyle = '#00d4aa';
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';
    sigCtx.lineJoin = 'round';
    sigCtx.stroke();
  };
  const end = e => { e.preventDefault(); sigDrawing = false; sigCtx.beginPath(); };

  sigCanvas.addEventListener('mousedown', start);
  sigCanvas.addEventListener('mousemove', move);
  sigCanvas.addEventListener('mouseup', end);
  sigCanvas.addEventListener('touchstart', start, { passive: false });
  sigCanvas.addEventListener('touchmove', move, { passive: false });
  sigCanvas.addEventListener('touchend', end, { passive: false });
}

function clearSignature() {
  sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  sigHasDraw = false;
  document.getElementById('sig-hint').classList.remove('hidden');
}

function saveReport() {
  if (!sigHasDraw) { showToast('Por favor firmá el informe', 'error'); return; }
  if (!currentReport) return;

  const sigData = sigCanvas.toDataURL('image/png');
  const report = {
    id: 'rep_' + Date.now(),
    date: currentReport.date,
    scanIds: currentReport.scans,
    signature: sigData,
    createdAt: new Date().toISOString()
  };

  DB.reports.push(report);
  saveData();
  showToast('✓ Informe guardado', 'success');
  currentReport = null;
  showPage('history');
}

// ======== HISTORY ========
function renderHistory() {
  const container = document.getElementById('history-list');
  if (DB.reports.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.3"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      <p>Sin informes guardados</p>
    </div>`;
    return;
  }

  const sorted = [...DB.reports].reverse();
  container.innerHTML = sorted.map(rep => {
    const d = new Date(rep.date + 'T12:00:00');
    const label = d.toLocaleDateString('es-AR', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
    const count = rep.scanIds.length;
    return `<div class="history-item" onclick="viewReport('${rep.id}')">
      <div class="history-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
      </div>
      <div class="history-info">
        <div class="history-date">${label}</div>
        <div class="history-meta">${count} scanner${count !== 1 ? 's' : ''} inspeccionado${count !== 1 ? 's' : ''}</div>
      </div>
      <div class="history-badge">${count}</div>
    </div>`;
  }).join('');
}

// ======== VIEW REPORT ========
let viewingReportId = null;
function viewReport(id) {
  const rep = DB.reports.find(r => r.id === id);
  if (!rep) return;
  viewingReportId = id;

  const scans = DB.scans.filter(s => rep.scanIds.includes(s.id));
  const d = new Date(rep.date + 'T12:00:00');
  const label = d.toLocaleDateString('es-AR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  const scanRows = scans.map((s, i) => {
    const time = new Date(s.timestamp).toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit' });
    const photo = s.photoData ? `<img src="${s.photoData}" style="width:100%;border-radius:8px;margin:8px 0;display:block">` : '';
    return `<div style="border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:10px;background:var(--bg3)">
      <div style="font-size:13px;font-weight:600;color:var(--accent);margin-bottom:6px">${i+1}. ${escHtml(s.paso||'—')}</div>
      ${photo}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;font-family:var(--mono)">
        <div style="color:var(--text2)">Puesto: <span style="color:var(--text)">${escHtml(s.puesto||'—')}</span></div>
        <div style="color:var(--text2)">Serie: <span style="color:var(--text)">${escHtml(s.serie||'—')}</span></div>
        <div style="color:var(--text2)">Hora: <span style="color:var(--text)">${time}</span></div>
        ${s.address ? `<div style="color:var(--text2);grid-column:1/-1">📍 ${escHtml(s.address.split(',')[0])}</div>` : ''}
      </div>
      ${s.notas ? `<div style="font-size:12px;color:var(--text2);margin-top:8px;border-top:1px solid var(--border);padding-top:8px">${escHtml(s.notas)}</div>` : ''}
    </div>`;
  }).join('');

  document.getElementById('view-report-content').innerHTML = `
    <div class="vr-title">Informe de Visita</div>
    <div class="vr-sub">${label} &nbsp;·&nbsp; ${scans.length} scanner${scans.length!==1?'s':''}</div>
    ${scanRows}
    <div class="vr-sig-label">Firma del Inspector</div>
    <img src="${rep.signature}" class="vr-sig-img" alt="Firma">
  `;

  showPage('view-report');
}

function deleteReport() {
  if (!viewingReportId) return;
  if (!confirm('¿Eliminar este informe permanentemente?')) return;
  DB.reports = DB.reports.filter(r => r.id !== viewingReportId);
  saveData();
  showToast('Informe eliminado');
  goBack();
}

function downloadReport() {
  if (!viewingReportId) return;
  const rep = DB.reports.find(r => r.id === viewingReportId);
  if (!rep) return;

  const scans = DB.scans.filter(s => rep.scanIds.includes(s.id));
  const d = new Date(rep.date + 'T12:00:00');
  const label = d.toLocaleDateString('es-AR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  const scanHtml = scans.map((s, i) => {
    const time = new Date(s.timestamp).toLocaleString('es-AR');
    const photo = s.photoData ? `<img src="${s.photoData}" style="width:100%;max-height:300px;object-fit:cover;border-radius:8px;margin:10px 0">` : '<p style="color:#888;font-style:italic">Sin fotografía</p>';
    return `<div style="border:1px solid #e0e0e0;border-radius:10px;padding:16px;margin-bottom:16px;page-break-inside:avoid">
      <h3 style="color:#0077cc;margin:0 0 12px">${i+1}. ${escHtml(s.paso||'—')}</h3>
      ${photo}
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr><td style="padding:4px 8px;color:#666;width:120px">Puesto N°</td><td style="padding:4px 8px;font-weight:600">${escHtml(s.puesto||'—')}</td></tr>
        <tr><td style="padding:4px 8px;color:#666">N° de Serie</td><td style="padding:4px 8px;font-weight:600;font-family:monospace">${escHtml(s.serie||'—')}</td></tr>
        <tr><td style="padding:4px 8px;color:#666">Fecha/Hora</td><td style="padding:4px 8px">${time}</td></tr>
        ${s.address ? `<tr><td style="padding:4px 8px;color:#666">Ubicación</td><td style="padding:4px 8px;font-size:12px">${escHtml(s.address)}</td></tr>` : ''}
        ${s.notas ? `<tr><td style="padding:4px 8px;color:#666;vertical-align:top">Notas</td><td style="padding:4px 8px">${escHtml(s.notas)}</td></tr>` : ''}
      </table>
    </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Informe ScanCheck - ${rep.date}</title>
<style>
  body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:24px;color:#222}
  h1{color:#0077cc;margin-bottom:4px} .subtitle{color:#666;margin-bottom:24px}
  .sig-section{margin-top:32px;border-top:2px solid #eee;padding-top:20px}
  @media print{body{padding:0}.no-print{display:none}}
</style></head>
<body>
  <h1>Informe de Visita — Mantenimiento de Scanners</h1>
  <p class="subtitle">${label} &nbsp;|&nbsp; ${scans.length} scanner${scans.length!==1?'s':''} inspeccionados &nbsp;|&nbsp; Generado: ${new Date().toLocaleString('es-AR')}</p>
  ${scanHtml}
  <div class="sig-section">
    <p style="color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Firma del Inspector Responsable</p>
    <img src="${rep.signature}" style="max-width:280px;border:1px solid #ddd;border-radius:6px">
  </div>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `informe-scancheck-${rep.date}.html`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('✓ Informe descargado', 'success');
}

function exportAllData() {
  const data = JSON.stringify(DB, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scancheck-backup-${getTodayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('✓ Datos exportados', 'success');
}

// ======== TOAST ========
let toastTimer;
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (type ? ' ' + type : '');
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2800);
}

// ======== UTILS ========
function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
