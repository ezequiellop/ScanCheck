// ============================================================
// SCANCHECK — Firebase Integration Layer
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, updateDoc, deleteDoc, collection, query, where, orderBy, onSnapshot, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// ── AUTH ──────────────────────────────────────────────────
export async function fbRegister(name, email, password, role) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, "users", cred.user.uid), {
    name, email, role,
    createdAt: serverTimestamp()
  });
  return { id: cred.user.uid, name, email, role };
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
    const snap = await getDoc(doc(db, "users", user.uid));
    const data = snap.exists() ? snap.data() : {};
    cb({ id: user.uid, name: user.displayName || data.name || user.email, email: user.email, role: data.role || 'tecnico' });
  });
}

// ── SCANS ─────────────────────────────────────────────────
export async function fbSaveScan(scan) {
  // Strip large base64 photos from Firestore (store only metadata, photos stay local)
  const { photos, ...meta } = scan;
  meta.photoCount = (photos || []).length;
  meta.createdAt = serverTimestamp();
  const ref = await addDoc(collection(db, "scans"), meta);
  return ref.id;
}

export async function fbGetMyScans(userId) {
  const q = query(collection(db, "scans"), where("userId","==",userId), orderBy("timestamp","desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
}

export async function fbDeleteScan(fbId) {
  await deleteDoc(doc(db, "scans", fbId));
}

// ── REPORTS ───────────────────────────────────────────────
export async function fbSaveReport(report) {
  const { signature, ...meta } = report;
  meta.createdAt = serverTimestamp();
  const ref = await addDoc(collection(db, "reports"), meta);
  // Store signature separately (can be large)
  await setDoc(doc(db, "signatures", ref.id), { data: signature, reportId: ref.id });
  return ref.id;
}

export async function fbUpdateReport(fbId, fields) {
  await updateDoc(doc(db, "reports", fbId), fields);
}

export async function fbGetSignature(reportFbId) {
  const snap = await getDoc(doc(db, "signatures", reportFbId));
  return snap.exists() ? snap.data().data : null;
}

export async function fbGetAllReports() {
  // Try with orderBy first, fall back without if index missing
  try {
    const q = query(collection(db, "reports"), orderBy("createdAt","desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
  } catch(e) {
    console.warn("fbGetAllReports fallback (no orderBy):", e.code);
    const snap = await getDocs(collection(db, "reports"));
    const r = snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
    r.sort((a,b) => {
      const ta = a.createdAt?.seconds||new Date(a.date||0).getTime()/1000;
      const tb = b.createdAt?.seconds||new Date(b.date||0).getTime()/1000;
      return tb-ta;
    });
    return r;
  }
}

export async function fbGetMyReports(userId) {
  try {
    const q = query(collection(db, "reports"), where("userId","==",userId), orderBy("createdAt","desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
  } catch(e) {
    console.warn("fbGetMyReports fallback:", e.code);
    const q = query(collection(db, "reports"), where("userId","==",userId));
    const snap = await getDocs(q);
    const r = snap.docs.map(d => ({ fbId: d.id, ...d.data() }));
    r.sort((a,b) => new Date(b.createdAt?.seconds*1000||b.date||0)-new Date(a.createdAt?.seconds*1000||a.date||0));
    return r;
  }
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

export function fbWatchAllReports(cb) {
  const q = query(collection(db, "reports"), orderBy("createdAt","desc"));
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => ({ fbId: d.id, ...d.data() })));
  });
}

// ── USERS ─────────────────────────────────────────────────
export async function fbGetAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
