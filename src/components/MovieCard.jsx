import React from 'react';

// Fungsi bantuan untuk menampilkan rating sebagai bintang
const renderStars = (rating) => {
  const fullStar = '★'; 
  const emptyStar = '☆'; 
  const stars = Array(5).fill(emptyStar); 

  for (let i = 0; i < rating; i++) {
    stars[i] = fullStar;
  }
  
  return <span className="rating-stars">{stars.join('')}</span>;
};


function MovieCard({ movie, deleteMovie, startEdit }) {
    
  return (
    <div className="movie-card">
      
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
        <h4 className="card-title">{movie.title}</h4>
        <div className="card-rating">
            {renderStars(movie.rating)} <span style={{ marginLeft: '5px' }}>({movie.rating}/5)</span>
        </div>

        <div className="card-actions">
          <button 
            onClick={() => startEdit(movie)} 
            className="btn-action btn-edit"
          >
            Edit
          </button>
          <button 
            onClick={() => deleteMovie(movie.id)} 
            className="btn-action btn-delete"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;