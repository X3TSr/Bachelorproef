import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA3PxKbyeXztX2YG7OBNKMyunDUZPtNK98",
  authDomain: "budgetbuddy-4ee82.firebaseapp.com",
  projectId: "budgetbuddy-4ee82",
  storageBucket: "budgetbuddy-4ee82.firebasestorage.app",
  messagingSenderId: "1065047798624",
  appId: "1:1065047798624:web:47f4477082a83de422e405",
  measurementId: "G-JCWG0QJ2YE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const analytics = getAnalytics(app);

export const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)