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
    if (rating >= 4) return 'rating-high';      // Hijau
    if (rating >= 3) return 'rating-medium';    // Kuning/Oranye
    return 'rating-low';                       // Merah
};


// Menerima onCardClick untuk membuka modal
function MovieCard({ movie, onCardClick }) {
    
  const ratingClass = getRatingColorClass(movie.rating);
    
  return (
    // Tambahkan onClick ke div utama untuk membuka modal
    <div className="movie-card" onClick={onCardClick} style={{ cursor: 'pointer' }}>
      
      {/* Gambar Poster */}
      {movie.posterUrl ? (
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="card-poster"
          // Placeholder jika gambar gagal dimuat
          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/200x300?text=No+Poster"; }}
        />
      ) : (
        <div className="card-poster placeholder">
            No Poster
        </div>
      )}

      <div className="card-content">
        <div>
            {/* Tampilan Genre (Style minimalist, rata kiri) */}
            <span className="card-genre">[{movie.genre || 'Lainnya'}]</span> 
            <h4 className="card-title">{movie.title}</h4>
        </div>
        
        {/* Rating (Menerapkan kelas untuk warna bintang dinamis) */}
        <div className={`card-rating ${ratingClass}`}>
            {renderStars(movie.rating)} 
            <span style={{ marginLeft: '5px' }}>({movie.rating}/5)</span>
        </div>

        {/* Tombol aksi (Edit/Hapus) dihapus dari sini karena sudah dipindahkan ke Modal Detail */}

      </div>
    </div>
  );
}

export default MovieCard;