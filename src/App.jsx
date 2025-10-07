import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AddPage from './pages/AddPage';
import './index.css';

// Import Firebase
import { db } from './firebase'; 
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'; 

const MOVIES_COLLECTION = 'watchlist'; 

// MainApp menampung semua logika data dan membagikannya ke Pages
function MainApp() { 
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ===================================
  // FUNGSI R (READ): Mengambil Data dari Firestore
  // ===================================
  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, MOVIES_COLLECTION));
      const moviesList = querySnapshot.docs.map(doc => ({
        id: doc.id, // ID DARI FIREBASE
        ...doc.data() // data film
      }));
      setMovies(moviesList);
    } catch (error) {
      console.error("Error fetching documents: ", error);
      // alert("Gagal memuat data dari Firebase!"); // Komentar sementara saat dev
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // ===================================
  // FUNGSI C, U, D (CREATE, UPDATE, DELETE)
  // ===================================
  const saveMovie = async (movieData) => {
    try {
      if (movieData.id) {
        // Logic UPDATE
        const movieRef = doc(db, MOVIES_COLLECTION, movieData.id);
        const { id: _id, ...dataToUpdate } = movieData; 
        await updateDoc(movieRef, dataToUpdate);
      } else {
        // Logic CREATE
        await addDoc(collection(db, MOVIES_COLLECTION), movieData);
      }
      // Ambil data terbaru setelah operasi
      fetchMovies(); 
    } catch (error) {
      console.error("Error saving movie: ", error);
      alert("Gagal menyimpan data ke Firebase.");
    }
    setEditingMovie(null); // Tutup form edit
  };

  const deleteMovie = async (id) => {
    if (window.confirm("Yakin ingin menghapus film ini? (Data akan terhapus online)")) {
      try {
        await deleteDoc(doc(db, MOVIES_COLLECTION, id));
        fetchMovies(); 
      } catch (error) {
        console.error("Error deleting movie: ", error);
        alert("Gagal menghapus data dari Firebase.");
      }
    }
  };

  // Fungsi untuk memulai edit (hanya navigasi ke halaman Edit)
  const startEdit = (movie) => {
    navigate(`/add/${movie.id}`);
  };

  return (
    <div className="app-container">
      <Header movieCount={movies.length} />

      <main className="main-content">
        <Routes>
          {/* Halaman Utama: Daftar Tontonan */}
          <Route 
            path="/" 
            element={<Home movies={movies} deleteMovie={deleteMovie} startEdit={startEdit} isLoading={isLoading} />} 
          />
          {/* Halaman Tambah Baru */}
          <Route 
            path="/add" 
            element={<AddPage saveMovie={saveMovie} movies={movies} editingMovie={editingMovie} setEditingMovie={setEditingMovie} />} 
          />
          {/* Halaman Edit Berdasarkan ID */}
          <Route 
            path="/add/:id" 
            element={<AddPage saveMovie={saveMovie} movies={movies} editingMovie={editingMovie} setEditingMovie={setEditingMovie} />} 
          />
        </Routes>
      </main>
    </div>
  );
}

// Fungsi utama App yang mengaktifkan Router
function App() {
  // BASE_URL disetel di vite.config.js untuk GitHub Pages
  return (
    <Router basename={import.meta.env.BASE_URL || '/react-movie/'}> 
        <MainApp />
    </Router>
  );
}

export default App;