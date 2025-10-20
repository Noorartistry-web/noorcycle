// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Optional: only enable messaging when you add VAPID later
// import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYovGMEAwRPuRPmN-BRU-7ejb0t0vndb8",
  authDomain: "noor-cycle.firebaseapp.com",
  projectId: "noor-cycle",
  storageBucket: "noor-cycle.firebasestorage.app",
  messagingSenderId: "236005026201",
  appId: "1:236005026201:web:b85173242ac0767964cb08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Export for other files
export { app, auth, db };
