// src/pages/Home.jsx

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import DetailModal from '../components/DetailModal';

// --- KONSTANTA ---
const GENRES = ['Semua', 'Indonesia', 'Anime', 'Drakor', 'Western', 'Lainnya']; 

const STATUS_OPTIONS = ['Semua', 'Planned', 'Watching', 'Finished']; // OPSI FILTER STATUS
const DISPLAY_STATUS_MAP = {
    'Semua': 'Semua',
    'Planned': 'Akan Ditonton',
    'Watching': 'Sedang Ditonton',
    'Finished': 'Selesai'
};

const SORT_OPTIONS = [
    { value: 'recent', label: 'Terbaru Ditambahkan (Default)' },
    { value: 'rating_desc', label: 'Rating Tertinggi' },
    { value: 'title_asc', label: 'Judul (A-Z)' },
    { value: 'title_desc', label: 'Judul (Z-A)' },
];
// -----------------


function Home({ movies, deleteMovie, startEdit, isLoading }) {
    const [activeGenre, setActiveGenre] = useState('Semua'); 
    const [activeStatus, setActiveStatus] = useState('Semua'); // STATE BARU UNTUK STATUS FILTER
    const [sortCriteria, setSortCriteria] = useState('recent'); 
    const [selectedMovie, setSelectedMovie] = useState(null); 
    
    // --- LOGIKA FILTER DAN SORTIR UTAMA ---
    const sortedAndFilteredMovies = useMemo(() => {
        let currentMovies = movies;
        
        // 1. FILTER BERDASARKAN GENRE
        currentMovies = activeGenre === 'Semua'
            ? currentMovies
            : currentMovies.filter(movie => movie.genre === activeGenre);

        // 2. FILTER BERDASARKAN STATUS BARU
        currentMovies = activeStatus === 'Semua'
            ? currentMovies
            : currentMovies.filter(movie => (movie.status || 'Planned') === activeStatus); 

        // 3. SORTIR BERDASARKAN KRITERIA
        return [...currentMovies].sort((a, b) => {
            switch (sortCriteria) {
                case 'rating_desc':
                    return b.rating - a.rating; 
                case 'title_asc':
                    return a.title.localeCompare(b.title);
                case 'title_desc':
                    return a.title.localeCompare(b.title) * -1;
                case 'recent':
                default:
                    return 0; 
            }
        });
    }, [movies, activeGenre, activeStatus, sortCriteria]);


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
            
            {/* Filter Genre */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <strong style={{ display: 'block', marginBottom: '10px' }}>Filter Genre:</strong>
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

            {/* Filter Status BARU */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <strong style={{ display: 'block', marginBottom: '10px' }}>Filter Status:</strong>
                {STATUS_OPTIONS.map(s => (
                    <button
                        key={s}
                        onClick={() => setActiveStatus(s)}
                        className={`btn-filter ${activeStatus === s ? 'active' : ''}`}
                    >
                        {DISPLAY_STATUS_MAP[s]} ({movies.filter(m => s === 'Semua' || (m.status || 'Planned') === s).length})
                    </button>
                ))}
            </div>

            {/* KONTROL SORTIR */}
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
                    Tidak ada film yang cocok dengan filter saat ini.
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