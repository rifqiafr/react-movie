// src/pages/Home.jsx

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import DetailModal from '../components/DetailModal';

// --- KONSTANTA ---
const GENRES = ['Semua', 'Indonesia', 'Anime', 'Drakor', 'Western', 'Lainnya']; 

const SORT_OPTIONS = [
    { value: 'recent', label: 'Terbaru Ditambahkan (Default)' },
    { value: 'rating_desc', label: 'Rating Tertinggi' },
    { value: 'title_asc', label: 'Judul (A-Z)' },
    { value: 'title_desc', label: 'Judul (Z-A)' },
];
// -----------------


function Home({ movies, deleteMovie, startEdit, isLoading }) {
    const [activeGenre, setActiveGenre] = useState('Semua'); 
    const [sortCriteria, setSortCriteria] = useState('recent'); // STATE BARU UNTUK SORTIR
    const [selectedMovie, setSelectedMovie] = useState(null); 
    
    // --- LOGIKA FILTER DAN SORTIR UTAMA ---
    const sortedAndFilteredMovies = useMemo(() => {
        // 1. FILTER BERDASARKAN GENRE
        let currentMovies = activeGenre === 'Semua'
            ? movies
            : movies.filter(movie => movie.genre === activeGenre);

        // 2. SORTIR BERDASARKAN KRITERIA
        // Perhatian: Gunakan spread operator [...] untuk membuat copy array agar tidak memutasi state asli
        return [...currentMovies].sort((a, b) => {
            switch (sortCriteria) {
                case 'rating_desc':
                    // Rating Tertinggi (dari 5 ke 1)
                    return b.rating - a.rating; 
                    
                case 'title_asc':
                    // Judul A-Z
                    return a.title.localeCompare(b.title);
                    
                case 'title_desc':
                    // Judul Z-A
                    return a.title.localeCompare(b.title) * -1; // Membalikkan A-Z
                    
                case 'recent':
                default:
                    // Urutan default (Firebase ID/timestamp descending)
                    // Jika ID adalah number/timestamp: b.id - a.id; 
                    // Jika ID adalah string (default Firebase), kita biarkan urutan asli dari fetch.
                    return 0; 
            }
        });
    }, [movies, activeGenre, sortCriteria]);

    // FUNGSI UNTUK MENGUBAH KRITERIA SORTIR
    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
    };

    // --- LOGIKA MODAL (TETAP SAMA) ---
    const openModal = (movie) => setSelectedMovie(movie);
    const closeModal = () => setSelectedMovie(null);

    const handleDeleteFromModal = (id) => {
        closeModal(); 
        deleteMovie(id); 
    };

    const handleEditFromModal = (movie) => {
        closeModal(); 
        startEdit(movie); 
    };
    
    return (
        <section id="daftar">
            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>
                Daftar Tontonan
            </h2>
            
            {/* Filter Button */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                {GENRES.map(g => (
                    <button
                        key={g}
                        onClick={() => setActiveGenre(g)}
                        className={`btn-filter ${activeGenre === g ? 'active' : ''}`}
                    >
                        {g} ({movies.filter(m => g === 'Semua' || m.genre === g).length})
                    </button>
                ))}
            </div>

            {/* KONTROL SORTIR BARU */}
            <div className="sort-controls">
                <label htmlFor="sort-select">Urutkan Berdasarkan:</label>
                <select id="sort-select" value={sortCriteria} onChange={handleSortChange} className="form-input sort-select">
                    {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tampilan Movie Grid */}
            {isLoading ? (
                <p style={{ textAlign: 'center', fontSize: '1.2em' }}>Memuat data dari Firebase...</p>
            ) : sortedAndFilteredMovies.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#777' }}>
                    {activeGenre === 'Semua' ? 'Daftar tontonan masih kosong.' : `Tidak ada entri untuk genre ${activeGenre}.`}
                    <br/><Link to="/add" style={{color: '#3b82f6', textDecoration: 'none'}}>Tambahkan sekarang!</Link>
                </p>
            ) : (
                <div className="movie-grid">
                    {sortedAndFilteredMovies.map(movie => (
                        <MovieCard 
                            key={movie.id} 
                            movie={movie} 
                            onCardClick={() => openModal(movie)} 
                        />
                    ))}
                </div>
            )}

            {/* KOMPONEN MODAL */}
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