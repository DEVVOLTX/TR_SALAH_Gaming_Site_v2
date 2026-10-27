import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// هذه القيم عامة (مش سرية) — الحماية الحقيقية من قواعد Firestore في firestore.rules
const firebaseConfig = {
  apiKey: 'AIzaSyAboOZlKtO9l3SViQllF1_h85gspRQO2nY',
  authDomain: 'salah-store-5a9c8.firebaseapp.com',
  projectId: 'salah-store-5a9c8',
  storageBucket: 'salah-store-5a9c8.firebasestorage.app',
  messagingSenderId: '1019451143027',
  appId: '1:1019451143027:web:3d40881e558bd0a4680b06',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
