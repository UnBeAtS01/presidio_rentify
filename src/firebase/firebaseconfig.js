// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBmdz-8CE4y6ZKCJn9BZmPtAEYyw9hlJok",
    authDomain: "presidio-challenge.firebaseapp.com",
    projectId: "presidio-challenge",
    storageBucket: "presidio-challenge.appspot.com",
    messagingSenderId: "707836565782",
    appId: "1:707836565782:web:20266c09f4455f56879837",
    measurementId: "G-XZTQQN2SHM"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
