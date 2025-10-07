import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// GANTI DENGAN CONFIG ANDA YANG DIDAPAT DARI KONSOL FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyA0iZSxZnxQbJQ7Klm9ylwiLIluzx9BZLY",
  authDomain: "react-movie-7f54e.firebaseapp.com",
  projectId: "react-movie-7f54e",
  storageBucket: "react-movie-7f54e.firebasestorage.app",
  messagingSenderId: "175515459943",
  appId: "1:175515459943:web:6e74d94bbbcd30102ecfc2"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore
export const db = getFirestore(app);

// Catatan: Jika Anda ingin menyembunyikan API Key, Anda harus menggunakan Environment Variables
// (misalnya .env file), tetapi untuk proyek belajar ini, kita bisa menaruhnya di sini dulu.