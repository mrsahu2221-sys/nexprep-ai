import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// These should be in .env but I'll provide placeholders.
// The user MUST fill these in their Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSyD-OcskHIWhIAiJTQrQsil9YvF_wsCDfLs",
  authDomain: "nexprep-ai-6e83d.firebaseapp.com",
  projectId: "nexprep-ai-6e83d",
  storageBucket: "nexprep-ai-6e83d.firebasestorage.app",
  messagingSenderId: "1098180386701",
  appId: "1:1098180386701:web:4c375a38498fb4da3de7c4",
  measurementId: "G-7VL4L174FJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
