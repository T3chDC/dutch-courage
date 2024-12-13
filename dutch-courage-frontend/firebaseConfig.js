import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyD6s45alS1bcvwcN-vA6FL-Dtu9x_Vw_Gg',
  authDomain: 'dutch-courage-395806.firebaseapp.com',
  projectId: 'dutch-courage-395806',
  storageBucket: 'dutch-courage-395806.firebasestorage.app',
  messagingSenderId: '325941001538',
  appId: '1:325941001538:web:62253212a270a71c341cdb',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
const firestore = getFirestore(app)

export { firestore }
