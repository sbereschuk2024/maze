import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// TODO: Замініть на ваші Firebase конфігураційні дані
// Отримайте їх на: https://console.firebase.google.com
// Project Settings -> General -> Your apps -> Firebase SDK snippet -> Config
const firebaseConfig = {
  apiKey: "AIzaSyBdR578XLxU2k0eBcshB4wJORDD_aXl1bo",
  authDomain: "maze-9af3d.firebaseapp.com",
  databaseURL: "https://maze-9af3d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "maze-9af3d",
  storageBucket: "maze-9af3d.firebasestorage.app",
  messagingSenderId: "534727704829",
  appId: "1:534727704829:web:f0b338ea0d76824cd63e94"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Отримання посилання на базу даних
export const database = getDatabase(app);
