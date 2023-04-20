// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQ1glqT_XeN5Elj5NRYrLFWb0acZm64Zw",
  authDomain: "mobileappwoodinvillevenkat2023.firebaseapp.com",
  projectId: "mobileappwoodinvillevenkat2023",
  storageBucket: "gs://mobileappwoodinvillevenkat2023.appspot.com",
  messagingSenderId: "490751491477",
  appId: "1:490751491477:web:e124da17b42e77e5f3ca9c",
  measurementId: "G-D99R800G15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage();

export { auth, firestore, storage, ref };
