import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCSx2ka2cHD4kOVrfk5p4aHzgdg278mylY",
  authDomain: "inventorymanagement-aaf5d.firebaseapp.com",
  projectId: "inventorymanagement-aaf5d",
  storageBucket: "inventorymanagement-aaf5d.appspot.com",
  messagingSenderId: "430198761131",
  appId: "1:430198761131:web:1349fc39c77f1b5d9cf9ee",
  measurementId: "G-27B5Q40Z3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
