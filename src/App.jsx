import React, { useState, useEffect } from 'react';
import MovieForm from './components/MovieForm';
import MovieCard from './components/MovieCard';
import Header from './components/Header'; // <-- Import Header
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
    <div> {/* Hapus style padding di div ini */}
      <Header movieCount={movies.length} /> {/* Gunakan Header */}

      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
        
        {/* Form untuk Add atau Edit */}
        <div id="tambah"> {/* Anchor untuk navigasi */}
            <h2>{editingMovie ? 'Edit Entri' : 'Tambah Entri Baru'}</h2>
            <MovieForm 
              saveMovie={saveMovie} 
              editingMovie={editingMovie}
              setEditingMovie={setEditingMovie}
            />
        </div>

        <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #ddd' }} />

        {/* Daftar Film */}
        <div id="daftar"> {/* Anchor untuk navigasi */}
          <h2>Daftar Tontonan ({movies.length} Entri)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', paddingBottom: '50px' }}>
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
      </div>
    </div>
  );
}

export default App;