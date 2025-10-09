// src/pages/Home.jsx

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import DetailModal from '../components/DetailModal';
import heroImage from '../assets/spd.png'

// --- KONSTANTA (TETAP SAMA) ---
const GENRES = ['Semua', 'Indonesia', 'Anime', 'Drakor', 'Western', 'Lainnya']; 
const STATUS_OPTIONS = ['Semua', 'Planned', 'Watching', 'Finished']; 
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
    const [activeStatus, setActiveStatus] = useState('Semua'); 
    const [sortCriteria, setSortCriteria] = useState('recent'); 
    const [selectedMovie, setSelectedMovie] = useState(null); 
    const [searchQuery, setSearchQuery] = useState(''); 
    
    // Logika sorting dan filtering
    const sortedAndFilteredMovies = useMemo(() => {
        let currentMovies = movies;
        
        if (searchQuery) {
            const queryLower = searchQuery.toLowerCase();
            currentMovies = currentMovies.filter(movie => 
                movie.title.toLowerCase().includes(queryLower)
            );
        }

        currentMovies = activeGenre === 'Semua'
            ? currentMovies
            : currentMovies.filter(movie => movie.genre === activeGenre);

        currentMovies = activeStatus === 'Semua'
            ? currentMovies
            : currentMovies.filter(movie => (movie.status || 'Planned') === activeStatus); 

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
    }, [movies, activeGenre, activeStatus, sortCriteria, searchQuery]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
    };

    // Logika Modal
    const openModal = (movie) => setSelectedMovie(movie);
    const closeModal = () => setSelectedMovie(null);
    const handleDeleteFromModal = (id) => { closeModal(); deleteMovie(id); };
    const handleEditFromModal = (movie) => { closeModal(); startEdit(movie); };
    
    // // Variabel untuk Hero Image (pakai public folder)
    // const heroImageUrl = "/src/assets/spd.jpg"; 
    const heroImageUrl = heroImage;


    return (
        <section id="daftar">
            
            {/* HERO SECTION */}
            <div 
                className="relative h-96 mb-10 bg-cover bg-center bg-fixed bg-gray-900"
                style={{backgroundImage: `url(${heroImageUrl})`,
            }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-start pt-16 md:pt-24 pl-5 md:pl-12">
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 pt-10 drop-shadow-lg">
                            My Watchlist
                        </h1>
                    </div>
                </div>
            </div>

            {/* Konten Utama */}
            <div className="max-w-7xl mx-auto px-5 md:px-0 mt-8">
                
                <h2 className="text-center text-3xl font-bold text-white mb-8">
                    Semua Tontonan
                </h2>
                
                {/* Pencarian */}
                <div className="search-input-group mb-6">
                    <input 
                        type="text"
                        placeholder="🔍 Cari Judul Film..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Panel Kontrol */}
                <div className="bg-gray-800 p-5 md:p-6 rounded-xl shadow-xl flex flex-wrap justify-between items-start mb-8">
                    
                    {/* Filter Genre */}
                    <div className="w-full md:w-5/12 mb-4 md:mb-0">
                        <strong className="block text-gray-400 font-bold text-sm mb-2">Filter Genre:</strong>
                        <div className="flex flex-wrap gap-2">
                            {GENRES.map(g => (
                                <button
                                    key={g}
                                    onClick={() => setActiveGenre(g)}
                                    className={`px-4 py-2 text-xs font-medium rounded-full transition duration-150 ease-in-out
                                        ${activeGenre === g 
                                            ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'}`}
                                >
                                    {g} ({movies.filter(m => g === 'Semua' || m.genre === g).length})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filter Status */}
                    <div className="w-full md:w-5/12">
                        <strong className="block text-gray-400 font-bold text-sm mb-2">Filter Status:</strong>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setActiveStatus(s)}
                                    className={`px-4 py-2 text-xs font-medium rounded-full transition duration-150 ease-in-out
                                        ${activeStatus === s 
                                            ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'}`}
                                >
                                    {DISPLAY_STATUS_MAP[s]} ({movies.filter(m => s === 'Semua' || (m.status || 'Planned') === s).length})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sortir */}
                    <div className="w-full mt-4 md:mt-0 md:w-auto flex items-center justify-end">
                        <label htmlFor="sort-select" className="text-gray-400 font-semibold text-sm mr-2">Urutkan:</label>
                        <select 
                            id="sort-select" 
                            value={sortCriteria} 
                            onChange={handleSortChange} 
                            className="bg-gray-700 text-white text-sm border-b-2 border-blue-500 focus:outline-none focus:border-blue-300 py-1 px-2 rounded-md transition duration-150"
                        >
                            {SORT_OPTIONS.map(option => (
                                <option key={option.value} value={option.value} className="bg-gray-700">
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* Grid Film */}
                {isLoading ? (
                    <p className="text-center text-gray-400 text-lg py-10">Memuat data dari Firebase...</p>
                ) : sortedAndFilteredMovies.length === 0 ? (
                    <p className="text-center text-gray-400 py-10">
                        Tidak ada film yang cocok dengan filter saat ini.
                        <br/>
                        <Link to="/add" className="text-blue-500 hover:text-blue-400 underline">Tambahkan sekarang!</Link>
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-12">
                        {sortedAndFilteredMovies.map(movie => (
                            <MovieCard 
                                key={movie.id} 
                                movie={movie} 
                                onCardClick={() => openModal(movie)} 
                            />
                        ))}
                    </div>
                )}

            </div>

            {/* Modal Detail */}
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
