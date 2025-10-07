import React from 'react';

// Fungsi bantuan untuk menampilkan rating sebagai bintang
const renderStars = (rating) => {
  const fullStar = '★'; // Unicode bintang penuh
  const emptyStar = '☆'; // Unicode bintang kosong
  const stars = Array(5).fill(emptyStar); // Membuat 5 bintang kosong

  // Mengisi bintang sesuai rating
  for (let i = 0; i < rating; i++) {
    stars[i] = fullStar;
  }
  
  // Menggabungkan array menjadi string
  return <span style={{ color: 'gold' }}>{stars.join('')}</span>;
};


function MovieCard({ movie, deleteMovie, startEdit }) {
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '10px', 
      width: '200px', 
      boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Jika ada URL poster, tampilkan gambar. Jika tidak, tampilkan teks placeholder. */}
      {movie.posterUrl ? (
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          style={{ width: '100%', height: '250px', objectFit: 'cover', marginBottom: '10px' }}
          // Penanganan jika gambar gagal dimuat (optional)
          onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/200x250?text=No+Poster"; }}
        />
      ) : (
        <div style={{ width: '100%', height: '250px', backgroundColor: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
            No Poster
        </div>
      )}

      <h4 style={{ margin: '5px 0', textAlign: 'center' }}>{movie.title}</h4>
      <p style={{ margin: '5px 0' }}>
        Rating: {renderStars(movie.rating)} ({movie.rating}/5)
      </p>

      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={() => startEdit(movie)} 
          style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: 'lightblue', border: 'none', cursor: 'pointer' }}
        >
          Edit
        </button>
        <button 
          onClick={() => deleteMovie(movie.id)} 
          style={{ padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}

export default MovieCard;