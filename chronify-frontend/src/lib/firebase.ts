// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Firebase config (jo dashboard se mila hai)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: "1:908532689791:web:f6fa13de949e2c7f65484a",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (sirf ek baar)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Export messaging (sirf client-side pe available)
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;