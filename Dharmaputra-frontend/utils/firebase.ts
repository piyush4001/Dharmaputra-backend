import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBUdT7WlKV0tt_6xKIzoffglhuY3rfJ9hA",
  authDomain: "dharmapurta-aeb56.firebaseapp.com",
  projectId: "dharmapurta-aeb56",
  storageBucket: "dharmapurta-aeb56.firebasestorage.app",
  messagingSenderId: "787167494072",
  appId: "1:787167494072:web:9213ecc117d47ceafa994d",
  measurementId: "G-D5Z2ZS8FBF",
};

const app = initializeApp(firebaseConfig);

// ✅ Works in Expo Go + Dev Client
// ⚠️ Auth state stored in memory (OK for OTP testing)
export const auth = getAuth(app);
