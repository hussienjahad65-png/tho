
declare const firebase: any;

const firebaseConfig = {
  apiKey: "AIzaSyCVjo4V9A51mOvofo7qCEiLAi7RFITzKoU",
  authDomain: "hmza-5dc41.firebaseapp.com",
  databaseURL: "https://hmza-5dc41-default-rtdb.firebaseio.com",
  projectId: "hmza-5dc41",
  storageBucket: "hmza-5dc41.firebasestorage.app",
  messagingSenderId: "381700092287",
  appId: "1:381700092287:web:388c1f30c65ce6ee396a4a",
  measurementId: "G-294PRJ23BN"
};

// Use a more robust check for global firebase object
const getFirebase = () => {
    if (typeof window !== 'undefined' && (window as any).firebase) {
        return (window as any).firebase;
    }
    if (typeof firebase !== 'undefined') {
        return firebase;
    }
    return null;
};

const fb = getFirebase();

if (!fb) {
    console.error("Firebase library not found. Please check script imports in index.html.");
} else if (!fb.apps.length) {
    fb.initializeApp(firebaseConfig);
}

export const app = fb ? fb.app() : null;
export const db = fb ? fb.database() : { ref: () => ({ on: () => {}, off: () => {}, get: () => Promise.resolve({ exists: () => false, val: () => null }), set: () => Promise.resolve() }) };
export const auth = fb ? fb.auth() : { onAuthStateChanged: (cb: any) => cb(null), signInAnonymously: () => Promise.reject("Firebase not loaded") };
export const storage = fb ? fb.storage() : null;

export { fb as firebase };
