import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBm1fVRK_4TF2x6EYmh62nmu0AmP3GWpqQ',
  authDomain: 'dutch-courage-chat.firebaseapp.com',
  projectId: 'dutch-courage-chat',
  storageBucket: 'dutch-courage-chat.firebasestorage.app',
  messagingSenderId: '352326670573',
  appId: '1:352326670573:web:3233b780c6c6b67d1554e4',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
const db = getFirestore(app)

export { db }
