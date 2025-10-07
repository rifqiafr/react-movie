// src/components/MovieCard.jsx

import React from 'react';

// Fungsi bantuan untuk menampilkan rating sebagai bintang (tetap sama)
const renderStars = (rating) => {
  const fullStar = '★'; 
  const emptyStar = '☆'; 
  const stars = Array(5).fill(emptyStar); 

  for (let i = 0; i < rating; i++) {
    stars[i] = fullStar;
  }
  
  return <span className="rating-stars">{stars.join('')}</span>;
};


function MovieCard({ movie, onCardClick }) { // Menerima onCardClick
    
  return (
    // Tambahkan onClick ke div utama untuk membuka modal
    <div className="movie-card" onClick={onCardClick} style={{ cursor: 'pointer' }}>
      
      {/* Gambar Poster dan Placeholder tetap sama */}
      {movie.posterUrl ? (
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="card-poster"
          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/200x300?text=No+Poster"; }}
        />
      ) : (
        <div className="card-poster placeholder">
            No Poster
        </div>
      )}

      <div className="card-content">
        <div>
            <span className="card-genre">[{movie.genre || 'Lainnya'}]</span> 
            <h4 className="card-title">{movie.title}</h4>
        </div>
        
        <div className="card-rating">
            {renderStars(movie.rating)} <span style={{ marginLeft: '5px' }}>({movie.rating}/5)</span>
        </div>

        {/* TOMBOL ACTION TELAH DIHAPUS DARI SINI (Dipindahkan ke Modal) */}

      </div>
    </div>
  );
}

export default MovieCard;