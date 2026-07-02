import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAo3WIVeTIjJKR-fPI8eeBExNuB1uP5PUI",
  authDomain: "gym-c648c.firebaseapp.com",
  projectId: "gym-c648c",
  storageBucket: "gym-c648c.firebasestorage.app",
  messagingSenderId: "1053279735664",
  appId: "1:1053279735664:web:3b6ecf9fda41392a8cc9b5",
  measurementId: "G-ECNHZDY6M5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export default app;
