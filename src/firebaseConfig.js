import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
let messaging = null;
try {
  import { getMessaging } from 'firebase/messaging';
  messaging = null; // initialized later if you add VAPID key
} catch(e) { messaging = null; }

const firebaseConfig = {
  apiKey: "AIzaSyCYovGMEAwRPuRPmN-BRU-7ejb0t0vndb8",
  authDomain: "noor-cycle.firebaseapp.com",
  projectId: "noor-cycle",
  storageBucket: "noor-cycle.firebasestorage.app",
  messagingSenderId: "236005026201",
  appId: "1:236005026201:web:b85173242ac0767964cb08"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { messaging };
export default app;
