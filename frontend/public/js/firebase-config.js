import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDre7rAa9ZpjFsCPy0_yZWRLIS3xgSWIQo",
  authDomain: "safequest-db.firebaseapp.com",
  databaseURL: "https://safequest-db-default-rtdb.firebaseio.com",
  projectId: "safequest-db",
  storageBucket: "safequest-db.firebasestorage.app",
  messagingSenderId: "688619850297",
  appId: "1:688619850297:web:2f13a361ffb5235db69be8",
  measurementId: "G-5NRJHMP13D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, signInWithPopup, signOut };
