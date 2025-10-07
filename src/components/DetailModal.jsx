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
    return <span style={{ color: '#fbbf24' }}>{stars.join('')}</span>;
};

function DetailModal({ movie, onClose, onDelete, onEdit }) {
    if (!movie) return null; 

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                <button className="modal-close-btn" onClick={onClose}>×</button>
                
                <div className="modal-body">
                    
                    {/* Poster */}
                    <div className="modal-poster-container">
                        {movie.posterUrl ? (
                            <img 
                                src={movie.posterUrl} 
                                alt={movie.title} 
                                className="modal-poster"
                                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300x450?text=No+Poster"; }}
                            />
                        ) : (
                            <div className="modal-poster placeholder-lg">
                                No Poster
                            </div>
                        )}
                    </div>
                    
                    {/* Detail Teks */}
                    <div className="modal-text-detail">
                        <h3 className="modal-title">{movie.title}</h3>
                        
                        <p className="modal-info">
                            **Genre:** <span className="card-genre">{movie.genre || 'Lainnya'}</span>
                        </p>
                        
                        <p className="modal-info">
                            **Rating Saya:** {renderStars(movie.rating)} ({movie.rating}/5)
                        </p>
                        
                        <div className="modal-action-buttons">
                            <button 
                                onClick={onEdit} 
                                className="btn-action btn-modal-edit"
                            >
                                📝 Edit
                            </button>
                            <button 
                                onClick={onDelete} 
                                className="btn-action btn-modal-delete"
                            >
                                🗑️ Hapus
                            </button>
                        </div>

                        {/* FITUR BARU: SINOPSIS */}
                        <div style={{ marginTop: '20px', color: '#333' }}>
                            <h4 style={{ margin: '10px 0', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Sinopsis:</h4>
                            <p style={{ lineHeight: '1.6', fontSize: '0.95em' }}>
                                **{movie.overview || "Sinopsis tidak tersedia. Anda dapat menambahkannya melalui tombol Edit."}**
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailModal;