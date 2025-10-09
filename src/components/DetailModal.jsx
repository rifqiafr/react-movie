// src/components/DetailModal.jsx

import React from 'react';

// Fungsi bantuan untuk menampilkan rating sebagai bintang
const renderStars = (rating) => {
    const fullStar = '★'; 
    const emptyStar = '☆'; 
    const stars = Array(5).fill(emptyStar); 

    for (let i = 0; i < rating; i++) {
        stars[i] = fullStar;
    }
    // Menggunakan class Tailwind untuk warna bintang
    return <span className="text-yellow-400">{stars.join('')}</span>;
};

// Fungsi untuk menentukan kelas badge status (opsional jika sudah ada di index.css)
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


function DetailModal({ movie, onClose, onDelete, onEdit }) {
    if (!movie) return null; 
    
    // Menghitung status class
    const statusClass = getStatusBadgeClass(movie.status || 'Planned'); 

    return (
        // Modal Overlay (Full screen, dark backdrop)
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[3000]" onClick={onClose}>
            
            {/* Modal Content */}
            <div className="bg-gray-800 text-white rounded-xl shadow-2xl w-11/12 max-w-3xl relative p-6 transition duration-300 transform scale-100" onClick={(e) => e.stopPropagation()}>
                
                {/* Close Button */}
                <button className="absolute top-4 right-4 text-gray-500 hover:text-white text-2xl transition duration-200" onClick={onClose}>
                    &times;
                </button>
                
                {/* Modal Body */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                    
                    {/* Poster */}
                    <div className="flex-shrink-0 w-full md:w-64">
                        {movie.posterUrl ? (
                            <img 
                                src={movie.posterUrl} 
                                alt={movie.title} 
                                className="w-full h-auto rounded-lg shadow-xl"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x450?text=No+Poster"; }}
                            />
                        ) : (
                            <div className="w-full h-96 bg-gray-700 flex items-center justify-center text-gray-400 text-lg font-semibold rounded-lg">
                                No Poster
                            </div>
                        )}
                        {/* Status Badge di bawah poster */}
                        <div className={`mt-3 text-center px-3 py-1 rounded-md text-sm font-bold text-white ${statusClass}`}>
                            Status: {movie.status || 'Planned'}
                        </div>
                    </div>
                    
                    {/* Detail Teks */}
                    <div className="flex-grow">
                        <h3 className="text-3xl font-bold text-white mb-3 border-b border-gray-700 pb-2">
                            {movie.title}
                        </h3>
                        
                        {/* Genre */}
                        <p className="text-lg text-gray-400 mb-2">
                            <strong className="text-white">Genre:</strong> <span className="inline-block px-2 py-0.5 rounded text-xs font-bold text-gray-400 bg-gray-700">{movie.genre || 'Lainnya'}</span>
                        </p>
                        
                        {/* Rating */}
                        <p className="text-lg text-gray-400 mb-4">
                            <strong className="text-white">Rating Saya:</strong> {renderStars(movie.rating)} <span className="ml-1 text-sm">({movie.rating}/5)</span>
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-6">
                            <button 
                                onClick={onEdit} 
                                className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-150"
                            >
                                📝 Edit
                            </button>
                            <button 
                                onClick={onDelete} 
                                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-150"
                            >
                                🗑️ Hapus
                            </button>
                        </div>

                        {/* Sinopsis */}
                        <div className="mt-4">
                            <h4 className="text-xl font-semibold text-white mb-2 border-b border-gray-700 pb-1">Sinopsis:</h4>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {movie.overview || "Sinopsis tidak tersedia. Anda dapat menambahkannya melalui tombol Edit."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailModal;