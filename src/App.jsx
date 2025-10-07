import React, { useState, useEffect } from 'react';
import MovieForm from './components/MovieForm';
import MovieCard from './components/MovieCard';
import Header from './components/Header';
import './index.css'; 

// IMPORT FIREBASE FUNCTIONS
import { db } from './firebase'; // Import db instance
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore'; 

// Nama koleksi di Firestore
const MOVIES_COLLECTION = 'watchlist'; 

function App() {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State untuk loading

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
      alert("Gagal memuat data dari Firebase!");
    } finally {
      setIsLoading(false);
    }
  };

  // Panggil fetchMovies saat komponen pertama kali dimuat
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
        // Hapus ID dari data sebelum update agar tidak tersimpan di Firestore data
        const { id: _id, ...dataToUpdate } = movieData;  
        await updateDoc(movieRef, dataToUpdate);
        alert("Film berhasil diubah!");
      } else {
        // Logic CREATE
        await addDoc(collection(db, MOVIES_COLLECTION), movieData);
        alert("Film berhasil ditambahkan!");
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
        alert("Film berhasil dihapus!");
        // Ambil data terbaru setelah operasi
        fetchMovies(); 
      } catch (error) {
        console.error("Error deleting movie: ", error);
        alert("Gagal menghapus data dari Firebase.");
      }
    }
  };

  const startEdit = (movie) => {
    setEditingMovie(movie);
    document.getElementById('tambah').scrollIntoView({ behavior: 'smooth' });
  };
  
  // Perubahan pada tampilan saat loading
  return (
    <div className="app-container">
      <Header movieCount={movies.length} />

      <main className="main-content">
        
        {/* Form untuk Add atau Edit */}
        <section id="tambah" className="form-section">
            {/* ... (Tampilan h2 dan MovieForm tetap sama) ... */}
            <h2 style={{ textAlign: 'center', color: '#333' }}>
                {editingMovie ? '📝 Edit Entri' : '➕ Tambah Entri Baru'}
            </h2>
            <MovieForm 
              saveMovie={saveMovie} 
              editingMovie={editingMovie}
              setEditingMovie={setEditingMovie}
            />
        </section>

        <hr className="divider" />

        {/* Daftar Film */}
        <section id="daftar">
          <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
            Daftar Tontonan ({movies.length} Entri)
          </h2>
          
          {isLoading ? (
            <p style={{ textAlign: 'center', fontSize: '1.2em' }}>Memuat data dari Firebase...</p>
          ) : movies.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#777' }}>
                Daftar tontonan masih kosong. Tambahkan film pertama Anda!
            </p>
          ) : (
            <div className="movie-grid">
              {movies.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  deleteMovie={deleteMovie}
                  startEdit={startEdit}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;