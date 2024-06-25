// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "debai-d0809.firebaseapp.com",
  projectId: "debai-d0809",
  storageBucket: "debai-d0809.appspot.com",
  messagingSenderId: "1048608548432",
  appId: "1:1048608548432:web:12593c8a86369d8ac31355",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
