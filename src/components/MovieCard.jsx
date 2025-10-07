// src/components/MovieCard.jsx

import React from 'react';

// Fungsi bantuan: Menampilkan rating sebagai bintang (tetap sama)
const renderStars = (rating) => {
  const fullStar = '★'; 
  const emptyStar = '☆'; 
  const stars = Array(5).fill(emptyStar); 

  for (let i = 0; i < rating; i++) {
    stars[i] = fullStar;
  }
  
  return <span className="rating-stars">{stars.join('')}</span>;
};

// Fungsi bantuan: Menentukan kelas CSS berdasarkan rating (untuk warna dinamis)
const getRatingColorClass = (rating) => {
    if (rating >= 4) return 'rating-high';      
    if (rating >= 3) return 'rating-medium';    
    return 'rating-low';                       
};

// Fungsi bantuan BARU: Menentukan kelas CSS badge berdasarkan status
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Watching':
            return 'status-watching'; 
        case 'Finished':
            return 'status-finished'; 
        case 'Planned':
        default:
            return 'status-planned'; 
    }
}


function MovieCard({ movie, onCardClick }) {
    
  const ratingClass = getRatingColorClass(movie.rating);
  const statusClass = getStatusBadgeClass(movie.status || 'Planned'); // Gunakan default 'Planned'
    
  return (
    <div className="movie-card" onClick={onCardClick} style={{ cursor: 'pointer', position: 'relative' }}>
        
      {/* BADGE STATUS BARU */}
      <div className={`status-badge ${statusClass}`}>
          {movie.status || 'Planned'}
      </div>
      
      {/* Gambar Poster */}
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
            {/* Tampilan Genre */}
            <span className="card-genre">[{movie.genre || 'Lainnya'}]</span> 
            <h4 className="card-title">{movie.title}</h4>
        </div>
        
        {/* Rating */}
        <div className={`card-rating ${ratingClass}`}>
            {renderStars(movie.rating)} 
            <span style={{ marginLeft: '5px' }}>({movie.rating}/5)</span>
        </div>

      </div>
    </div>
  );
}

export default MovieCard;