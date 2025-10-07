import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// GANTI DENGAN CONFIG ANDA YANG DIDAPAT DARI KONSOL FIREBASE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID", // PENTING: Ganti dengan Project ID Anda
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore
export const db = getFirestore(app);

// Catatan: Jika Anda ingin menyembunyikan API Key, Anda harus menggunakan Environment Variables
// (misalnya .env file), tetapi untuk proyek belajar ini, kita bisa menaruhnya di sini dulu.