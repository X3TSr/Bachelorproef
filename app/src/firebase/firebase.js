import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDy-wU0BjvyQ1rkiOi8e52-qKZd9h7sMJo",
  authDomain: "budget-buddy-ad31d.firebaseapp.com",
  projectId: "budget-buddy-ad31d",
  storageBucket: "budget-buddy-ad31d.firebasestorage.app",
  messagingSenderId: "158907696524",
  appId: "1:158907696524:web:e5a55d4cb196739d4342a9",
  measurementId: "G-6VWVXYMM76"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const analytics = getAnalytics(app);

export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)