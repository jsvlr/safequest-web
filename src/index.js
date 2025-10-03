// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
