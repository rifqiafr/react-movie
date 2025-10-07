// src/pages/Home.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import DetailModal from '../components/DetailModal'; // PENTING: Import Modal

const GENRES = ['Semua', 'Indonesia', 'Anime', 'Drakor', 'Western']; 

function Home({ movies, deleteMovie, startEdit, isLoading }) {
  const [filter, setFilter] = useState('Semua'); 
  const [selectedMovie, setSelectedMovie] = useState(null); // STATE UNTUK MODAL
  
  const filteredMovies = movies.filter(movie => {
    if (filter === 'Semua') return true;
    return movie.genre === filter;
  });
  
  const sortedMovies = [...filteredMovies].sort((a, b) => b.id - a.id);

  // FUNGSI UNTUK MEMBUKA/MENUTUP MODAL
  const openModal = (movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  // FUNGSI UNTUK MENGHAPUS DARI MODAL
  const handleDeleteFromModal = (id) => {
    closeModal(); 
    deleteMovie(id); 
  };

  // FUNGSI UNTUK EDIT DARI MODAL
  const handleEditFromModal = (movie) => {
      closeModal(); 
      startEdit(movie); 
  };

  return (
    <section id="daftar">
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
        Daftar Tontonan
      </h2>
      
      {/* Filter Button tetap sama */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
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
      
      {/* Tampilan Movie Grid */}
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
              // PASSING FUNGSI KLIK UNTUK MEMBUKA MODAL
              onCardClick={() => openModal(movie)} 
            />
          ))}
        </div>
      )}

      {/* KOMPONEN MODAL DENGAN DATA YANG DIPILIH */}
      <DetailModal 
          movie={selectedMovie} 
          onClose={closeModal} 
          onDelete={() => handleDeleteFromModal(selectedMovie.id)}
          onEdit={() => handleEditFromModal(selectedMovie)}
      />
    </section>
  );
}

export default Home;