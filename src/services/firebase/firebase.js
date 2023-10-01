import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";

import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyC2snaUwJ4mpnyX4UQKXXgySfxvxevVu8g',
  authDomain: 'ngo-fcd6e.firebaseapp.com',
  databaseURL: 'https://ngo-fcd6e.appspot.com',
  projectId: 'ngo-fcd6e',
  storageBucket: 'ngo-fcd6e.appspot.com',
  messagingSenderId: '751180202429',
  appId: '1:751180202429:web:54376181950ae2335492d4',
  measurementId: 'G-VN1S2DP5ED',
};

const firebase = initializeApp(firebaseConfig);

const db = getFirestore(firebase);
const auth = getAuth(firebase);

export { db, auth };
