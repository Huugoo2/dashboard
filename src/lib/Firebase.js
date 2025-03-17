import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
 
 // Firebase configuration
 const firebaseConfig = {
    apiKey: "AIzaSyBv-fuZNRswlsUuAM1yWRZbP0YJHlVyH00",
    authDomain: "roomv1-2f2b3.firebaseapp.com",
    projectId: "roomv1-2f2b3",
    storageBucket: "roomv1-2f2b3.firebasestorage.app",
    messagingSenderId: "7896807631",
    appId: "1:7896807631:web:ccaa668a0bc273c39edfba",
    measurementId: "G-HNC63GCPR0"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export {db, collection, getDocs};