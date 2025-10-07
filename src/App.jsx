import React, { useState, useEffect } from 'react';
import MovieForm from './components/MovieForm';
import MovieCard from './components/MovieCard';
// Buat folder 'components' dan file di dalamnya nanti

function App() {
  // 1. Inisialisasi state dengan data dari Local Storage atau array kosong
  const [movies, setMovies] = useState(() => {
    const savedMovies = localStorage.getItem('myWatchlist');
    return savedMovies ? JSON.parse(savedMovies) : [];
  });
  const [editingMovie, setEditingMovie] = useState(null); // Untuk menyimpan film yang sedang di-edit

  // 2. Efek untuk menyimpan data ke Local Storage setiap kali 'movies' berubah
  useEffect(() => {
    localStorage.setItem('myWatchlist', JSON.stringify(movies));
  }, [movies]);

  // 3. Fungsi untuk menambahkan/mengubah film
  const saveMovie = (newMovie) => {
    if (newMovie.id) {
      // Logic EDIT
      setMovies(movies.map(movie => 
        movie.id === newMovie.id ? newMovie : movie
      ));
      setEditingMovie(null); // Selesai edit, tutup form edit
    } else {
      // Logic ADD
      setMovies([...movies, { ...newMovie, id: Date.now() }]);
    }
  };

  // 4. Fungsi untuk menghapus film
  const deleteMovie = (id) => {
    if (window.confirm("Yakin ingin menghapus film ini?")) {
      setMovies(movies.filter(movie => movie.id !== id));
    }
  };

  // 5. Fungsi untuk memulai proses edit
  const startEdit = (movie) => {
    setEditingMovie(movie);
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>My Movie/Anime Watchlist</h1>

      {/* Form untuk Add atau Edit */}
      <MovieForm 
        saveMovie={saveMovie} 
        editingMovie={editingMovie}
        setEditingMovie={setEditingMovie} // Untuk membatalkan edit
      />

      <hr style={{ margin: '30px 0' }} />

      <h2>Daftar Tontonan ({movies.length} Entri)</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {movies.map(movie => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            deleteMovie={deleteMovie}
            startEdit={startEdit}
          />
        ))}
      </div>
    </div>
  );
}

export default App;