// ============================================================
// SCANCHECK — Firebase Integration Layer
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, updateDoc, deleteDoc, collection, query, where, orderBy, onSnapshot, getDocs, getDocsFromServer, serverTimestamp, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjid5hHW5v_wWjXM0sI3fuEdE3CYNV5KQ",
  authDomain: "scancheck-danaide.firebaseapp.com",
  projectId: "scancheck-danaide",
  storageBucket: "scancheck-danaide.firebasestorage.app",
  messagingSenderId: "78081500378",
  appId: "1:78081500378:web:392bcb3517f6cad19071e3",
  measurementId: "G-PTZF07RG53"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline cache — allows reads to work without network
try {
  enableIndexedDbPersistence(db).catch(err => {
    console.warn('Firestore persistence not enabled:', err.code);
  });
} catch(e) {}

// ── AUTH ──────────────────────────────────────────────────
export async function fbRegister(name, email, password) {
  // Role is always "tecnico" on self-registration.
  // Supervisor access must be granted manually in Firestore by an administrator.
  const role = 'tecnico';
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, "users", cred.user.uid), {
    name, email, role,
    createdAt: serverTimestamp()
  });
  // Send email verification (non-blocking)
  try { await sendEmailVerification(cred.user); } catch(e) { console.warn('Email verification failed:', e.message); }
  return { id: cred.user.uid, name, email, role };
}

export async function fbSendPasswordReset(email) {
  await sendPasswordResetEmail(auth, email);
}

export async function fbResendVerification() {
  if (auth.currentUser) await sendEmailVerification(auth.currentUser);
}

export async function fbLogin(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  const data = snap.exists() ? snap.data() : {};
  return { id: cred.user.uid, name: cred.user.displayName || data.name || email, email, role: data.role || 'tecnico' };
}

export async function fbLogout() {
  await signOut(auth);
}

export function fbOnAuthChange(cb) {
  return onAuthStateChanged(auth, async user => {
    if (!user) { cb(null); return; }

    // Try to load cached profile first (works offline)
    let cached = null;
    try {
      const stored = localStorage.getItem('scancheck_user_' + user.uid);
      if (stored) cached = JSON.parse(stored);
    } catch(e) {}

    if (!navigator.onLine) {
      // Offline — use cached profile or fallback, don't wait for Firestore
      if (cached) {
        cb({ ...cached, emailVerified: user.emailVerified });
      } else {
        cb({ id: user.uid, name: user.displayName || user.email, email: user.email, role: 'tecnico', emailVerified: user.emailVerified });
      }
      return;
    }

    // Online — fetch fresh, with timeout fallback
    try {
      const snap = await Promise.race([
        getDoc(doc(db, "users", user.uid)),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))
      ]);
      const data = snap.exists() ? snap.data() : {};
      const profile = { id: user.uid, name: user.displayName || data.name || user.email, email: user.email, role: data.role || 'tecnico', emailVerified: user.emailVerified };
      try { localStorage.setItem('scancheck_user_' + user.uid, JSON.stringify(profile)); } catch(e) {}
      cb(profile);
    } catch(e) {
      console.warn('Profile fetch failed/timeout, using cache:', e.message);
      if (cached) cb({ ...cached, emailVerified: user.emailVerified });
      else cb({ id: user.uid, name: user.displayName || user.email, email: user.email, role: 'tecnico', emailVerified: user.emailVerified });
    }
  });
}

// ── SCANS ─────────────────────────────────────────────────
export async function fbSaveScan(scan) {
  const { photos, ...meta } = scan;
  meta.photoCount = (photos || []).length;
  meta.createdAt = serverTimestamp();
  const cleanMeta = cleanForFirestore(meta);
  const ref = await addDoc(collection(db, "scans"), cleanMeta);
  return ref.id;
}

export async function fbGetMyScans(userId) {
  const q = query(collection(db, "scans"), where("userId","==",userId));
  // Usar getDocsFromServer para saltear el caché local de Firestore y siempre
  // traer los datos más recientes del servidor — evita que ediciones recientes
  // queden ocultas por el caché offline de IndexedDB.
  const snap = await getDocsFromServer(q);
  const r = snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
  r.sort((a,b) => new Date(b.timestamp||0) - new Date(a.timestamp||0));
  return r.filter(s => !s.eliminado);
}

// Borrado lógico: el registro deja de aparecer para el técnico (filtrado por
// !eliminado en fbGetMyScans), pero el documento sigue existiendo en Firestore
// para que las métricas, exports a Sheets, y cálculos de cumplimiento no se
// vean afectados. El supervisor puede verlo y restaurarlo desde la papelera.
export async function fbSoftDeleteScan(fbId, deletedByUserId) {
  await updateDoc(doc(db, "scans", fbId), {
    eliminado: true,
    eliminadoEn: serverTimestamp(),
    eliminadoPor: deletedByUserId || null
  });
}

export async function fbRestoreScan(fbId) {
  await updateDoc(doc(db, "scans", fbId), {
    eliminado: false,
    eliminadoEn: null,
    eliminadoPor: null
  });
}

export async function fbDeleteScan(fbId) {
  await deleteDoc(doc(db, "scans", fbId));
}

// ── REPORTS ───────────────────────────────────────────────
// Remove undefined/NaN/Infinity — Firestore rejects them with invalid-argument
function cleanForFirestore(obj) {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) return obj.map(cleanForFirestore).filter(v => v !== undefined);
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const clean = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined) continue;
      if (typeof v === 'number' && (isNaN(v) || !isFinite(v))) { clean[k] = null; continue; }
      clean[k] = cleanForFirestore(v);
    }
    return clean;
  }
  return obj;
}

export async function fbSaveReport(report) {
  const { signature, scansSnapshot, ...meta } = report;
  meta.createdAt = serverTimestamp();
  if (scansSnapshot && scansSnapshot.length > 0) {
    meta.scansSnapshot = scansSnapshot.map(({ photos, ...s }) => ({
      ...s, photoCount: (photos||[]).length
    }));
  }
  const cleanMeta = cleanForFirestore(meta);
  const ref = await addDoc(collection(db, "reports"), cleanMeta);
  await setDoc(doc(db, "signatures", ref.id), { data: signature||'', reportId: ref.id });
  return ref.id;
}

export async function fbUpdateScan(fbId, fields) {
  await updateDoc(doc(db, "scans", fbId), fields);
}

// Reemplaza completamente un documento de scan en Firestore (para edición de registros).
// A diferencia de fbUpdateScan (que hace merge), esto sobreescribe el documento entero.
export async function fbReplaceScan(fbId, scanData) {
  const { photos, ...dataWithoutPhotos } = scanData; // no guardar base64 en Firestore
  await setDoc(doc(db, "scans", fbId), dataWithoutPhotos);
}

export async function fbUpdateReport(fbId, fields) {
  // Strip photos from scansSnapshot if present, and clean undefined/NaN
  const clean = { ...fields };
  if (clean.scansSnapshot) {
    clean.scansSnapshot = clean.scansSnapshot.map(({photos,...s}) => ({...s, photoCount:(photos||[]).length}));
  }
  await updateDoc(doc(db, "reports", fbId), cleanForFirestore(clean));
}

export async function fbGetSignature(reportFbId) {
  const snap = await getDoc(doc(db, "signatures", reportFbId));
  return snap.exists() ? snap.data().data : null;
}

// incluirEliminados=false (default): para vistas normales de la UI (lista de
// informes del técnico/supervisor). incluirEliminados=true: para cálculos de
// métricas, exports a Sheets, y la papelera del supervisor — donde SÍ
// necesitamos conservar el dato aunque el técnico lo haya "eliminado".
export async function fbGetAllReports(incluirEliminados = false) {
  const snap = await getDocs(collection(db, "reports"));
  let r = snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
  r.sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
  return incluirEliminados ? r : r.filter(rep => !rep.eliminado);
}

export async function fbGetMyReports(userId) {
  const q = query(collection(db, "reports"), where("userId","==",userId));
  const snap = await getDocs(q);
  const r = snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
  r.sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
  return r.filter(rep => !rep.eliminado);
}

// Borrado lógico de informes: mismo criterio que fbSoftDeleteScan — el informe
// deja de aparecer para el técnico, pero sigue existiendo en Firestore para
// métricas/export, y el supervisor puede restaurarlo desde la papelera.
export async function fbSoftDeleteReport(fbId, deletedByUserId) {
  await updateDoc(doc(db, "reports", fbId), {
    eliminado: true,
    eliminadoEn: serverTimestamp(),
    eliminadoPor: deletedByUserId || null
  });
}

export async function fbRestoreReport(fbId) {
  await updateDoc(doc(db, "reports", fbId), {
    eliminado: false,
    eliminadoEn: null,
    eliminadoPor: null
  });
}

// Para la papelera del supervisor: trae únicamente los registros/informes
// marcados como eliminados por los técnicos (borrado lógico).
export async function fbGetDeletedScans() {
  const snap = await getDocs(collection(db, "scans"));
  return snap.docs.map(d => ({ fbId: d.id, ...d.data() })).filter(s => s.eliminado);
}

export async function fbGetDeletedReports() {
  const snap = await getDocs(collection(db, "reports"));
  return snap.docs.map(d => ({ fbId: d.id, ...d.data() })).filter(r => r.eliminado);
}

export async function fbDeleteReport(fbId) {
  await deleteDoc(doc(db, "reports", fbId));
  try { await deleteDoc(doc(db, "signatures", fbId)); } catch(e) {}
}

// ── LOCATION TRACKING ────────────────────────────────────
export async function fbUpdateLocation(userId, userName, lat, lon, address) {
  await setDoc(doc(db, "locations", userId), {
    userId, userName, lat, lon, address,
    updatedAt: serverTimestamp()
  });
}

export function fbWatchLocations(cb) {
  return onSnapshot(collection(db, "locations"), snap => {
    cb(snap.docs.map(d => d.data()));
  });
}

export async function fbGetAllLocations() {
  const snap = await getDocs(collection(db, "locations"));
  return snap.docs.map(d => d.data());
}

export function fbWatchAllReports(cb) {
  return onSnapshot(collection(db, "reports"), snap => {
    const r = snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
    r.sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0));
    cb(r);
  });
}

// ── USERS ─────────────────────────────────────────────────
export async function fbGetAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── VIAJES (control de km) ────────────────────────────────────
export async function fbSaveViaje(viaje) {
  const { id, fbId, ...data } = viaje;
  if (fbId) {
    await setDoc(doc(db, "viajes", fbId), data);
    return fbId;
  }
  const ref = await addDoc(collection(db, "viajes"), data);
  return ref.id;
}

export async function fbUpdateViaje(fbId, fields) {
  await updateDoc(doc(db, "viajes", fbId), fields);
}

export async function fbGetMyViajes(userId) {
  // Traer todos los viajes del usuario sin ordenar por campo que puede no existir
  // (viajes de km tienen fechaSalida, programados tienen fechaCreacion)
  const q = query(collection(db, "viajes"), where("userId","==",userId));
  const snap = await getDocsFromServer(q);
  const docs = snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
  // Ordenar en memoria: viajes de km por fechaSalida, programados por fechaCreacion
  return docs.sort((a, b) => {
    const fa = a.fechaSalida || a.fechaCreacion || '';
    const fb2 = b.fechaSalida || b.fechaCreacion || '';
    return fb2.localeCompare(fa);
  });
}

export async function fbGetAllViajes() {
  // Sin orderBy para que incluya tanto viajes de km como programados
  const q = query(collection(db, "viajes"));
  const snap = await getDocsFromServer(q);
  const docs = snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
  return docs.sort((a, b) => {
    const fa = a.fechaSalida || a.fechaCreacion || '';
    const fb2 = b.fechaSalida || b.fechaCreacion || '';
    return fb2.localeCompare(fa);
  });
}

export async function fbSoftDeleteViaje(fbId, deletedByUserId) {
  await updateDoc(doc(db, "viajes", fbId), {
    eliminado: true,
    eliminadoEn: serverTimestamp(),
    eliminadoPor: deletedByUserId || null
  });
}

export async function fbRestoreViaje(fbId) {
  await updateDoc(doc(db, "viajes", fbId), {
    eliminado: false,
    eliminadoEn: null,
    eliminadoPor: null
  });
}

export async function fbHardDeleteViaje(fbId) {
  await deleteDoc(doc(db, "viajes", fbId));
}

export async function fbGetDeletedViajes() {
  const q = query(collection(db, "viajes"), where("eliminado","==",true));
  const snap = await getDocsFromServer(q);
  return snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
}

// ── Reportes de Service (agrupan tramos de viajes ya calculados) ──
export async function fbSaveServiceReport(report) {
  const ref = await addDoc(collection(db, "serviceReports"), report);
  return ref.id;
}

export async function fbGetMyServiceReports(userId) {
  const q = query(collection(db, "serviceReports"), where("userId","==",userId));
  const snap = await getDocsFromServer(q);
  return snap.docs.map(d => ({ fbId: d.id, ...d.data() }))
    .filter(r => !r.eliminado)
    .sort((a,b) => (b.fechaGeneracion||'').localeCompare(a.fechaGeneracion||''));
}

export async function fbGetAllServiceReports() {
  const q = query(collection(db, "serviceReports"));
  const snap = await getDocsFromServer(q);
  return snap.docs.map(d => ({ fbId: d.id, ...d.data() }))
    .filter(r => !r.eliminado)
    .sort((a,b) => (b.fechaGeneracion||'').localeCompare(a.fechaGeneracion||''));
}

export async function fbSoftDeleteServiceReport(fbId, deletedByUserId) {
  await updateDoc(doc(db, "serviceReports", fbId), {
    eliminado: true,
    eliminadoEn: serverTimestamp(),
    eliminadoPor: deletedByUserId || null
  });
}

export async function fbRestoreServiceReport(fbId) {
  await updateDoc(doc(db, "serviceReports", fbId), {
    eliminado: false,
    eliminadoEn: null,
    eliminadoPor: null
  });
}

export async function fbHardDeleteServiceReport(fbId) {
  await deleteDoc(doc(db, "serviceReports", fbId));
}

export async function fbGetDeletedServiceReports() {
  const q = query(collection(db, "serviceReports"), where("eliminado","==",true));
  const snap = await getDocsFromServer(q);
  return snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
}

// ── VIÁTICOS: rendiciones y gastos ────────────────────────────
// ── GESTIÓN DE FLOTA ──────────────────────────────────────────
// Vehículos, grúas, eventos y parámetros de amortización.

// Parámetros (documento único config/flota_parametros con vida útil por tipo)
export async function fbGetFlotaParametros() {
  const ref = doc(db, "config", "flota_parametros");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}
export async function fbSaveFlotaParametros(data) {
  await setDoc(doc(db, "config", "flota_parametros"), data, { merge: true });
}

// Vehículos
export async function fbSaveFlotaVehiculo(v) {
  if (v.fbId) {
    const { fbId, ...data } = v;
    await updateDoc(doc(db, "flotaVehiculos", fbId), data);
    return fbId;
  }
  const ref = await addDoc(collection(db, "flotaVehiculos"), v);
  return ref.id;
}
export async function fbGetFlotaVehiculos() {
  const q = query(collection(db, "flotaVehiculos"));
  const snap = await getDocsFromServer(q);
  return snap.docs.map(d => ({ fbId: d.id, ...d.data() }))
    .filter(v => !v.eliminado)
    .sort((a,b) => (a.patente||'').localeCompare(b.patente||''));
}
export async function fbDeleteFlotaVehiculo(fbId) {
  await updateDoc(doc(db, "flotaVehiculos", fbId), { eliminado: true, eliminadoEn: serverTimestamp() });
}

// Grúas (equipos independientes)
export async function fbSaveFlotaGrua(g) {
  if (g.fbId) {
    const { fbId, ...data } = g;
    await updateDoc(doc(db, "flotaGruas", fbId), data);
    return fbId;
  }
  const ref = await addDoc(collection(db, "flotaGruas"), g);
  return ref.id;
}
export async function fbGetFlotaGruas() {
  const q = query(collection(db, "flotaGruas"));
  const snap = await getDocsFromServer(q);
  return snap.docs.map(d => ({ fbId: d.id, ...d.data() }))
    .filter(g => !g.eliminado)
    .sort((a,b) => (a.codigo||'').localeCompare(b.codigo||''));
}
export async function fbDeleteFlotaGrua(fbId) {
  await updateDoc(doc(db, "flotaGruas", fbId), { eliminado: true, eliminadoEn: serverTimestamp() });
}

// Eventos (combustible, peaje, service, avería, lecturas)
export async function fbSaveFlotaEvento(e) {
  if (e.fbId) {
    const { fbId, ...data } = e;
    await updateDoc(doc(db, "flotaEventos", fbId), data);
    return fbId;
  }
  const ref = await addDoc(collection(db, "flotaEventos"), e);
  return ref.id;
}
export async function fbGetFlotaEventos(filtroRef) {
  // filtroRef opcional: { tipoRef:'vehiculo'|'grua', refId }
  let q;
  if (filtroRef && filtroRef.refId) {
    q = query(collection(db, "flotaEventos"), where("refId","==",filtroRef.refId));
  } else {
    q = query(collection(db, "flotaEventos"));
  }
  const snap = await getDocsFromServer(q);
  return snap.docs.map(d => ({ fbId: d.id, ...d.data() }))
    .filter(e => !e.eliminado)
    .sort((a,b) => (b.fecha||'').localeCompare(a.fecha||''));
}
export async function fbDeleteFlotaEvento(fbId) {
  await updateDoc(doc(db, "flotaEventos", fbId), { eliminado: true, eliminadoEn: serverTimestamp() });
}

export async function fbSaveViaticoRendicion(rendicion) {
  const ref = await addDoc(collection(db, "viaticos"), rendicion);
  return ref.id;
}

export async function fbUpdateViaticoRendicion(fbId, data) {
  await updateDoc(doc(db, "viaticos", fbId), data);
}

export async function fbGetMyViaticos(userId) {
  const q = query(collection(db, "viaticos"), where("userId","==",userId));
  const snap = await getDocsFromServer(q);
  return snap.docs.map(d => ({ fbId: d.id, ...d.data() }))
    .sort((a,b) => (b.fechaCreacion||'').localeCompare(a.fechaCreacion||''));
}

export async function fbGetAllViaticos() {
  const q = query(collection(db, "viaticos"));
  const snap = await getDocsFromServer(q);
  return snap.docs.map(d => ({ fbId: d.id, ...d.data() }))
    .sort((a,b) => (b.fechaCreacion||'').localeCompare(a.fechaCreacion||''));
}

export async function fbSoftDeleteViatico(fbId, deletedByUserId) {
  await updateDoc(doc(db, "viaticos", fbId), {
    eliminado: true, eliminadoEn: serverTimestamp(), eliminadoPor: deletedByUserId || null
  });
}

export async function fbRestoreViatico(fbId) {
  await updateDoc(doc(db, "viaticos", fbId), {
    eliminado: false, eliminadoEn: null, eliminadoPor: null
  });
}

export async function fbHardDeleteViatico(fbId) {
  await deleteDoc(doc(db, "viaticos", fbId));
}

export async function fbGetDeletedViaticos() {
  const q = query(collection(db, "viaticos"), where("eliminado","==",true));
  const snap = await getDocsFromServer(q);
  return snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
}

// ── VIÁTICOS (rendiciones de gastos) ──────────────────────────
export async function fbSaveServiceData(userId, data) {
  await updateDoc(doc(db, "users", userId), { serviceData: data });
}

export async function fbGetServiceData(userId) {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? snap.data().serviceData || null : null;
}

// ── CONFIG (versiones objetivo de AssureID, detectadas por el GBG Monitor) ──
export async function fbGetVersionesObjetivo() {
  const snap = await getDoc(doc(db, "config", "versiones_objetivo"));
  return snap.exists() ? snap.data() : null;
}

export function fbWatchVersionesObjetivo(cb) {
  return onSnapshot(doc(db, "config", "versiones_objetivo"), snap => {
    cb(snap.exists() ? snap.data() : null);
  });
}

// Marca cambioDetectado=false en config/versiones_objetivo — se llama cuando
// el supervisor abre la pestaña Versiones o toca el badge, indicando que ya vio
// la notificación de versión nueva. El badge naranja desaparece automáticamente
// porque fbWatchVersionesObjetivo actualiza versionesObjetivo en tiempo real.
export async function fbMarcarVersionesVistas() {
  await updateDoc(doc(db, "config", "versiones_objetivo"), { cambioDetectado: false });
}
