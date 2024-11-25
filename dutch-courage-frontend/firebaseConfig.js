import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAmbnMr8--sHqNA3uZS9PQ6NcgBXkNPUoU',
  authDomain: 'dutch-courag-chat.firebaseapp.com',
  projectId: 'dutch-courag-chat',
  storageBucket: 'dutch-courag-chat.firebasestorage.app',
  messagingSenderId: '225687881217',
  appId: '1:225687881217:web:d620d07179213e4867e200',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
const db = getFirestore(app)

export { db }
