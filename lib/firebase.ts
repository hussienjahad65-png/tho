
declare const firebase: any;

const firebaseConfig = {
  apiKey: "AIzaSyA2j3EsitYTy6fIYfObxpzf9LbbwvUeJ38",
  authDomain: "thoalfgar-ab906.firebaseapp.com",
  databaseURL: "https://thoalfgar-ab906-default-rtdb.firebaseio.com",
  projectId: "thoalfgar-ab906",
  storageBucket: "thoalfgar-ab906.firebasestorage.app",
  messagingSenderId: "768702267760",
  appId: "1:768702267760:web:6b67c6b3ac0d69b42acfb5",
  measurementId: "G-80RGR7B7TQ"
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
