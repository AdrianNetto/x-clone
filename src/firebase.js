// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "x-clone-f8a9c.firebaseapp.com",
  projectId: "x-clone-f8a9c",
  storageBucket: "x-clone-f8a9c.appspot.com",
  messagingSenderId: "704799660870",
  appId: "1:704799660870:web:c13ccd9bbad582c756a347",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);