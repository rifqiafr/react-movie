// src/components/MovieForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// OPSI STATUS BARU
const STATUS_OPTIONS = [
    { value: 'Planned', label: 'Akan Ditonton' },
    { value: 'Watching', label: 'Sedang Ditonton' },
    { value: 'Finished', label: 'Selesai Ditonton' },
];

// OPSI GENRE
const GENRES = ['Indonesia', 'Anime', 'Drakor', 'Western', 'Lainnya'];


const initialFormState = {
    title: '',
    posterUrl: '',
    rating: 3, // Default rating 3
    genre: GENRES[0], 
    overview: '', 
    status: 'Planned', // Default status
};

// ===========================================
// PENTING: Kunci API Anda telah disalin
// ===========================================
const TMDB_API_KEY = "31d97d6787fa4847e1693a6dc7b9cd90";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; 
// ===========================================


function MovieForm({ saveMovie, editingMovie, setEditingMovie }) {
    const [formData, setFormData] = useState(initialFormState);
    const [searchQuery, setSearchQuery] = useState('');     
    const [searchResults, setSearchResults] = useState([]); 
    const [isSearching, setIsSearching] = useState(false);  
    const [hover, setHover] = useState(0); 
    const navigate = useNavigate();
    
    const isEdit = !!editingMovie; 

    // Efek untuk mengisi form saat mode edit
    useEffect(() => {
        if (isEdit) { 
            setFormData({ 
                ...editingMovie, 
                genre: editingMovie.genre || GENRES[4],
                status: editingMovie.status || 'Planned'
            });
        } else {
            setFormData(initialFormState);
            setSearchResults([]); 
            setSearchQuery('');
        }
    // TAMBAHKAN isEdit DI SINI
    }, [editingMovie, isEdit]); 

    // FUNGSI HANDLE CHANGE UNTUK INPUT NON-RATING
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'rating' ? parseInt(value) : value 
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || formData.rating < 0 || formData.rating > 5) {
            alert("Judul tidak boleh kosong dan Rating harus antara 0-5.");
            return;
        }
        
        saveMovie(formData); 
    };

    const handleCancel = () => {
        setEditingMovie(null);
        navigate('/');
    };
    
    // FUNGSI PENCARIAN TMDB
    const searchMovie = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchResults([]);
        
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&language=id-ID`
            );
            const data = await response.json();
            
            const validResults = data.results
                .filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path)
                .slice(0, 5);
                
            setSearchResults(validResults);
        } catch (error) { 
            console.error("Error fetching movie data from TMDB:", error); 
            alert("Gagal mencari film. Pastikan API Key TMDB benar."); 
        } finally {
            setIsSearching(false);
        }
    };


    const selectResult = (result) => {
        let title = result.media_type === 'movie' ? result.title : result.name;

        setFormData(prev => ({
            ...prev,
            title: title,
            posterUrl: TMDB_IMAGE_BASE_URL + result.poster_path, 
            overview: result.overview || 'Sinopsis tidak tersedia.', 
        }));

        setSearchResults([]);
        setSearchQuery('');
    };


    return (
        // Mengganti form-container dengan class Tailwind untuk Dark Theme
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
            <form onSubmit={handleSubmit}>
                
                {/* FIELD PENCARIAN TMDB (Hanya tampil di mode ADD) */}
                {!isEdit && ( 
                    <div className="border border-blue-500 p-4 rounded-lg mb-6 bg-gray-700">
                        <label className="block mb-2 text-blue-300 font-bold">🔎 Cari Poster Otomatis (via TMDB):</label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Masukkan judul film/acara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <button 
                                type="button" 
                                onClick={searchMovie}
                                className="bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-150 disabled:opacity-50"
                                disabled={isSearching}
                            >
                                {isSearching ? 'Mencari...' : 'Cari'}
                            </button>
                        </div>
                        
                        {/* HASIL PENCARIAN */}
                        {searchResults.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-gray-600 max-h-52 overflow-y-auto">
                                <p className="text-sm font-bold mb-2 text-gray-300">Pilih Hasil:</p>
                                {searchResults.map(result => (
                                    <div 
                                        key={result.id} 
                                        onClick={() => selectResult(result)} 
                                        className="flex items-center p-2 mb-1 cursor-pointer bg-gray-700 hover:bg-gray-600 rounded-lg transition duration-100"
                                    >
                                        <img 
                                            src={TMDB_IMAGE_BASE_URL + result.poster_path} 
                                            alt={result.title || result.name} 
                                            className="w-10 h-16 object-cover mr-3 rounded-md shadow-lg"
                                        />
                                        <div>
                                            <strong className="text-sm text-white">{result.title || result.name}</strong> 
                                            <span className="text-xs text-gray-400 ml-2">
                                                ({result.media_type === 'movie' ? 'Film' : 'Acara TV/Anime'})
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {/* INPUT GROUP REFACTORING */}
                {[
                    { id: 'title', label: 'Judul', type: 'text', value: formData.title, required: true },
                    { id: 'posterUrl', label: 'URL Poster', type: 'text', value: formData.posterUrl, placeholder: 'URL Poster (Otomatis terisi)' },
                ].map((input) => (
                    <div className="mb-4" key={input.id}>
                        <label htmlFor={input.id} className="block text-gray-300 font-semibold mb-2">{input.label}:</label>
                        <input 
                            type={input.type} 
                            id={input.id} 
                            name={input.id} 
                            value={input.value} 
                            onChange={handleChange} 
                            required={input.required} 
                            placeholder={input.placeholder}
                            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-150"
                        />
                    </div>
                ))}
                
                {/* INPUT: GENRE & STATUS */}
                <div className="flex gap-4 mb-4">
                    {/* GENRE */}
                    <div className="w-1/2">
                        <label htmlFor="genre" className="block text-gray-300 font-semibold mb-2">Genre:</label>
                        <select id="genre" name="genre" value={formData.genre} onChange={handleChange} className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-150">
                            {GENRES.map(g => (<option key={g} value={g} className="bg-gray-800">{g}</option>))}
                        </select>
                    </div>

                    {/* Status Tontonan */}
                    <div className="w-1/2">
                        <label htmlFor="status" className="block text-gray-300 font-semibold mb-2">Status Tontonan:</label>
                        <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-150">
                            {STATUS_OPTIONS.map(s => (<option key={s.value} value={s.value} className="bg-gray-800">{s.label}</option>))}
                        </select>
                    </div>
                </div>
                
                {/* INPUT: Rating (Bintang Interaktif) */}
                <div className="mb-6">
                    <label className="block text-gray-300 font-semibold mb-2">Rating (1-5):</label>
                    <div className="text-4xl">
                        {[...Array(5)].map((star, index) => {
                            const ratingValue = index + 1;
                            return (
                                <span
                                    key={index}
                                    className="cursor-pointer transition duration-100"
                                    style={{
                                        color: ratingValue <= (hover || formData.rating) ? "#ffc107" : "#4b5563", // Yellow/Gray-600
                                    }}
                                    onClick={() => setFormData({ ...formData, rating: ratingValue })}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    ★
                                </span>
                            );
                        })}
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                        Rating saat ini: **{formData.rating}**
                    </p>
                </div>
                
                {/* INPUT: Overview/Sinopsis (Edit Manual) */}
                {isEdit && (
                    <div className="mb-6">
                        <label htmlFor="overview" className="block text-gray-300 font-semibold mb-2">Sinopsis (Edit Manual):</label>
                        <textarea 
                            id="overview" 
                            name="overview" 
                            value={formData.overview} 
                            onChange={handleChange} 
                            rows="4"
                            placeholder="Masukkan sinopsis atau catatan Anda..."
                            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition duration-150"
                        ></textarea>
                    </div>
                )}
                
                <div className="flex gap-4 pt-4 border-t border-gray-700">
                    <button 
                        type="submit" 
                        className={`font-bold py-3 px-6 rounded-lg transition duration-150 flex-1 
                            ${isEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"} text-white`}
                    >
                        {isEdit ? '💾 Simpan Perubahan' : '➕ Tambah ke Daftar'}
                    </button>
                    
                    {isEdit && ( 
                        <button 
                            type="button" 
                            onClick={handleCancel} 
                            className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition duration-150"
                        >
                            ❌ Batalkan Edit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default MovieForm;