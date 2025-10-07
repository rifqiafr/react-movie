// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import AddPage from './pages/AddPage';
import Toast from './components/Toast'; // PENTING: Import Toast
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

function MainApp() { 
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // --- STATE BARU UNTUK TOAST ---
  const [toast, setToast] = useState({ 
      message: '', 
      type: 'success', 
      isVisible: false 
  });

  // Fungsi untuk menampilkan Toast
  const showToast = (message, type = 'success') => {
      setToast({ message, type, isVisible: true });
  };

  // Fungsi untuk menyembunyikan Toast
  const hideToast = () => {
      setToast(prev => ({ ...prev, isVisible: false }));
  };
  // -----------------------------

  // ===================================
  // FUNGSI R (READ)
  // ===================================
  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, MOVIES_COLLECTION));
      const moviesList = querySnapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data() 
      }));
      setMovies(moviesList);
    } catch (error) {
      console.error("Error fetching documents: ", error);
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
        
        // GANTI ALERT
        showToast("Perubahan film berhasil disimpan!", 'success'); 
        
      } else {
        // Logic CREATE
        await addDoc(collection(db, MOVIES_COLLECTION), movieData);
        
        // GANTI ALERT
        showToast("Film baru berhasil ditambahkan!", 'success');
      }
      fetchMovies(); 
    } catch (error) {
      console.error("Error saving movie: ", error);
      // GANTI ALERT
      showToast("Gagal menyimpan data ke Firebase.", 'error');
    }
    setEditingMovie(null); 
  };

  const deleteMovie = async (id) => {
    if (window.confirm("Yakin ingin menghapus film ini?")) {
      try {
        await deleteDoc(doc(db, MOVIES_COLLECTION, id));
        fetchMovies(); 
        
        // GANTI ALERT
        showToast("Film berhasil dihapus dari daftar.", 'success');
        
      } catch (error) {
        console.error("Error deleting movie: ", error);
        // GANTI ALERT
        showToast("Gagal menghapus data dari Firebase.", 'error');
      }
    }
  };

  const startEdit = (movie) => {
    navigate(`/add/${movie.id}`);
  };

  return (
    <div className="app-container">
      <Header movieCount={movies.length} />

      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={<Home movies={movies} deleteMovie={deleteMovie} startEdit={startEdit} isLoading={isLoading} />} 
          />
          <Route 
            path="/add" 
            element={<AddPage saveMovie={saveMovie} movies={movies} editingMovie={editingMovie} setEditingMovie={setEditingMovie} />} 
          />
          <Route 
            path="/add/:id" 
            element={<AddPage saveMovie={saveMovie} movies={movies} editingMovie={editingMovie} setEditingMovie={setEditingMovie} />} 
          />
        </Routes>
      </main>
      
      {/* INTEGRASI KOMPONEN TOAST */}
      <Toast 
          message={toast.message} 
          type={toast.type} 
          isVisible={toast.isVisible} 
          onClose={hideToast}
      />

    </div>
  );
}

// Fungsi utama App yang mengaktifkan Router
function App() {
  return (
    <Router basename={import.meta.env.BASE_URL || '/react-movie/'}> 
        <MainApp />
    </Router>
  );
}

export default App;