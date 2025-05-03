// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVhd1ESd2NJbBbrWob-qv8U4kOtC51v-s",
    authDomain: "todoforum-f0064.firebaseapp.com",
    projectId: "todoforum-f0064",
    storageBucket: "todoforum-f0064.firebasestorage.app",
    messagingSenderId: "1081433926473",
    appId: "1:1081433926473:web:22dfb6fb0842ec78348898"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;