import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { Platform } from 'react-native'

let firebaseConfig

if (Platform.OS === 'android') {
  firebaseConfig = {
    apiKey: 'AIzaSyDdj1x8W7_J2ELuwEmh8vg-5h90j-dYiUc',
    authDomain: 'dutch-courage-395806.firebaseapp.com',
    projectId: 'dutch-courage-395806',
    storageBucket: 'dutch-courage-395806.firebasestorage.app',
    messagingSenderId: '325941001538',
    appId: '1:325941001538:android:133aeab0386ac455341cdb',
  }
} else {
  firebaseConfig = {
    apiKey: 'AIzaSyD6s45alS1bcvwcN-vA6FL-Dtu9x_Vw_Gg',
    authDomain: 'dutch-courage-395806.firebaseapp.com',
    projectId: 'dutch-courage-395806',
    storageBucket: 'dutch-courage-395806.firebasestorage.app',
    messagingSenderId: '325941001538',
    appId: '1:325941001538:web:62253212a270a71c341cdb',
  }
}

// const firebaseConfig = {
//   apiKey: 'AIzaSyD6s45alS1bcvwcN-vA6FL-Dtu9x_Vw_Gg',
//   authDomain: 'dutch-courage-395806.firebaseapp.com',
//   projectId: 'dutch-courage-395806',
//   storageBucket: 'dutch-courage-395806.firebasestorage.app',
//   messagingSenderId: '325941001538',
//   appId: '1:325941001538:web:62253212a270a71c341cdb',
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
const firestore = getFirestore(app)

export { firestore }
