import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

const GENRES = ['Semua', 'Indonesia', 'Anime', 'Drakor', 'Western']; 

function Home({ movies, deleteMovie, startEdit, isLoading }) {
  const [filter, setFilter] = useState('Semua'); 
  
  // Logika filter berdasarkan genre
  const filteredMovies = movies.filter(movie => {
    if (filter === 'Semua') return true;
    return movie.genre === filter;
  });
  
  // Mengurutkan film agar yang baru ditambahkan biasanya muncul di atas
  const sortedMovies = [...filteredMovies].sort((a, b) => b.id - a.id);

  return (
    <section id="daftar">
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
        Daftar Tontonan
      </h2>
      
      {/* Filter Button */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          {/* LOOPING SEKARANG MENCETAK WESTERN JUGA */}
          {GENRES.map(g => (
              <button
                  key={g}
                  onClick={() => setFilter(g)}
                  className={`btn-filter ${filter === g ? 'active' : ''}`}
              >
                  {g} ({movies.filter(m => g === 'Semua' || m.genre === g).length})
              </button>
          ))}
      </div>
      
      {/* Tampilan Loading/Data Kosong */}
      {isLoading ? (
        <p style={{ textAlign: 'center', fontSize: '1.2em' }}>Memuat data dari Firebase...</p>
      ) : sortedMovies.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>
            {filter === 'Semua' ? 'Daftar tontonan masih kosong.' : `Tidak ada entri untuk genre ${filter}.`}
            <br/><Link to="/add" style={{color: '#3b82f6', textDecoration: 'none'}}>Tambahkan sekarang!</Link>
        </p>
      ) : (
        <div className="movie-grid">
          {sortedMovies.map(movie => (
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
  );
}

export default Home;