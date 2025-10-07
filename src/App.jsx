import React, { useState, useEffect } from 'react';
import MovieForm from './components/MovieForm';
import MovieCard from './components/MovieCard';
import Header from './components/Header';
import './index.css'; // Pastikan CSS global diimport

function App() {
  // Mengambil data dari Local Storage saat inisialisasi
  const [movies, setMovies] = useState(() => {
    const savedMovies = localStorage.getItem('myWatchlist');
    return savedMovies ? JSON.parse(savedMovies) : [];
  });
  const [editingMovie, setEditingMovie] = useState(null);

  // Menyimpan data ke Local Storage setiap kali 'movies' berubah
  useEffect(() => {
    localStorage.setItem('myWatchlist', JSON.stringify(movies));
  }, [movies]);

  // Fungsi untuk menambahkan atau mengubah film
  const saveMovie = (newMovie) => {
    if (newMovie.id) {
      // Logic EDIT
      setMovies(movies.map(movie => 
        movie.id === newMovie.id ? newMovie : movie
      ));
      setEditingMovie(null);
    } else {
      // Logic ADD
      setMovies([...movies, { ...newMovie, id: Date.now() }]);
    }
  };

  // Fungsi untuk menghapus film
  const deleteMovie = (id) => {
    if (window.confirm("Yakin ingin menghapus film ini?")) {
      setMovies(movies.filter(movie => movie.id !== id));
    }
  };

  // Fungsi untuk memulai proses edit
  const startEdit = (movie) => {
    setEditingMovie(movie);
    // Scroll ke bagian form edit setelah tombol edit diklik
    document.getElementById('tambah').scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="app-container">
      <Header movieCount={movies.length} />

      <main className="main-content">
        
        {/* Form untuk Add atau Edit */}
        <section id="tambah" className="form-section">
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
          {movies.length === 0 ? (
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