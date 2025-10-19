// app/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBrHNps-Eh5_THIl2a9OdrU8uMG9vo8kw8",
    authDomain: "prueba-3c072.firebaseapp.com",
    projectId: "prueba-3c072",
    storageBucket: "prueba-3c072.firebasestorage.app",
    messagingSenderId: "664846782451",
    appId: "1:664846782451:web:a69eac2b06413a1bf0cc86",
    measurementId: "G-0RPV0ZLMYT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;