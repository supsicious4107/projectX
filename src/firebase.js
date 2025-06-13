// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth }       from "firebase/auth";        // 👈 добавили
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCHSw0Nt1Y5mZQmMRiJq0pyByjbvjUXGu8",
    authDomain: "yuubi-525d7.firebaseapp.com",
    projectId: "yuubi-525d7",
    storageBucket: "yuubi-525d7.firebasestorage.app",
    messagingSenderId: "1029391764903",
    appId: "1:1029391764903:web:7719ea63fe05a584a1fa82",
    measurementId: "G-PDKQW87L9K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);      // 👈 ОБЯЗАТЕЛЬНЫЙ экспорт