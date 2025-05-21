// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyASh47VWTTtDlA9pMAXJ_KbD6aNj7D4sNc",
  authDomain: "servidores-4515c.firebaseapp.com",
  projectId: "servidores-4515c",
  storageBucket: "servidores-4515c.firebasestorage.app",
  messagingSenderId: "88969854331",
  appId: "1:88969854331:web:7513811dbbc4cadd6511de",
  measurementId: "G-92NPK3VCMJ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// ✅ Exporta db para poder usarlo en otros archivos
export { db };
