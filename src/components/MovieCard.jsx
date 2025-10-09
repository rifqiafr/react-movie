// src/components/MovieCard.jsx

import React from 'react';

// Fungsi bantuan: Menampilkan rating sebagai bintang (TETAP SAMA - Tidak menggunakan Tailwind di sini)
const renderStars = (rating) => {
  const fullStar = '★'; 
  const emptyStar = '☆'; 
  const stars = Array(5).fill(emptyStar); 

  for (let i = 0; i < rating; i++) {
    stars[i] = fullStar;
  }
  
  // class 'text-yellow-400' akan ditambahkan di Tailwind
  return <span className="rating-stars">{stars.join('')}</span>;
};

// Fungsi bantuan: Menentukan kelas CSS berdasarkan rating (untuk warna dinamis)
const getRatingColorClass = (rating) => {
    if (rating >= 4) return 'text-green-500';      // Hijau
    if (rating >= 3) return 'text-yellow-500';      // Kuning/Oranye
    return 'text-red-500';                       // Merah
};

// Fungsi bantuan: Menentukan kelas CSS badge berdasarkan status
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'Watching':
            return 'bg-blue-600'; 
        case 'Finished':
            return 'bg-green-600'; 
        case 'Planned':
        default:
            return 'bg-gray-600'; 
    }
}


function MovieCard({ movie, onCardClick }) {
    
  const ratingColorClass = getRatingColorClass(movie.rating);
  const statusClass = getStatusBadgeClass(movie.status || 'Planned'); 

  // LOGIC BARU: Gold Tier Status (Jika ada implementasi rating 5 bintang)
  const isMasterpiece = (movie.rating === 5 && movie.status === 'Finished');

    
  return (
    // Mengganti .movie-card dan styling dengan utility classes
    <div 
        className={`
            bg-gray-800 rounded-xl overflow-hidden shadow-lg 
            transition duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl 
            cursor-pointer relative flex flex-col 
            ${isMasterpiece ? 'border-4 border-yellow-400 shadow-yellow-500/50' : 'border border-transparent'}
        `} 
        onClick={onCardClick} 
    >
        
        {/* BADGE STATUS BARU */}
        <div className={`
            absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-bold text-white 
            ${statusClass} shadow-md z-10
        `}>
            {movie.status || 'Planned'}
        </div>
        
        {/* Gambar Poster */}
        <div className="relative">
            {movie.posterUrl ? (
                <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-full h-[300px] object-cover relative z-0 shadow-lg shadow-black/50"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/200x300?text=No+Poster"; }}
                />
            ) : (
                <div className="w-full h-[300px] bg-gray-700 flex items-center justify-center text-gray-400 text-lg font-semibold">
                    No Poster
                </div>
            )}
        </div>

        {/* Konten Card */}
        <div className="p-3 flex flex-col justify-between flex-grow text-left">
            <div>
                {/* Tampilan Genre */}
                <span className="inline-block px-2 py-0.5 rounded-md text-xs font-bold text-gray-400 bg-gray-700 mb-1 border border-gray-600">
                    [{movie.genre || 'Lainnya'}]
                </span> 
                
                <h4 className="text-white text-base font-semibold mt-1 mb-1">
                    {movie.title}
                </h4>
            </div>
            
            {/* Rating */}
            <div className={`flex items-center text-sm font-semibold mt-1 ${ratingColorClass}`}>
                <span className="text-xl">
                    {/* Bintang akan mengambil warna dari ratingColorClass */}
                    {renderStars(movie.rating)} 
                </span>
                <span className="ml-1 text-gray-400 text-sm">
                    ({movie.rating}/5)
                </span>
            </div>

        </div>
    </div>
  );
}

export default MovieCard;