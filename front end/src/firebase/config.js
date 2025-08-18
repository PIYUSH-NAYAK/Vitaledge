// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzRKioZ-Ed3N6vli7h_3m38lHEK4pjhDA",
  authDomain: "vitaledge-b9586.firebaseapp.com",
  projectId: "vitaledge-b9586",
  storageBucket: "vitaledge-b9586.firebasestorage.app",
  messagingSenderId: "24593354948",
  appId: "1:24593354948:web:35492714e4f7a295793991",
  measurementId: "G-KTN9MMQN4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export { analytics };
export default app;
