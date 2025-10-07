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
// PENTING: GANTI DENGAN KUNCI API TMDB ANDA!
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
    
    // FIX ESLINT: Deklarasi isEdit dan digunakan di logic bawah
    const isEdit = !!editingMovie; 

    // Efek untuk mengisi form saat mode edit
    useEffect(() => {
        if (isEdit) { // MENGGUNAKAN isEdit
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
    }, [editingMovie]);

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
    } catch (error) { // Menangkap objek error
        
        // FIX ESLINT: Variabel 'error' digunakan untuk mencatat kesalahan ke konsol (debugging)
        console.error("Error fetching movie data from TMDB:", error); 
        
        // Memberikan feedback ke pengguna
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
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                
                {/* FIELD PENCARIAN TMDB (Hanya tampil di mode ADD - MENGGUNAKAN isEdit) */}
                {!isEdit && ( 
                    <div className="form-group tmdb-search-box">
                        <label>🔎 **Cari Poster Otomatis (via TMDB):**</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Masukkan judul film/acara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="form-input"
                                style={{ flexGrow: 1 }}
                            />
                            <button 
                                type="button" 
                                onClick={searchMovie}
                                className="btn-submit btn-edit"
                                disabled={isSearching}
                                style={{ padding: '0 15px', minWidth: '100px' }}
                            >
                                {isSearching ? 'Mencari...' : 'Cari'}
                            </button>
                        </div>
                        
                        {/* HASIL PENCARIAN */}
                        {searchResults.length > 0 && (
                            <div className="search-results-list">
                                <p style={{ margin: '0 0 10px 0', fontSize: '0.9em', fontWeight: 'bold' }}>Pilih Hasil:</p>
                                {searchResults.map(result => (
                                    <div 
                                        key={result.id} 
                                        onClick={() => selectResult(result)} 
                                        className="search-result-item"
                                    >
                                        <img 
                                            src={TMDB_IMAGE_BASE_URL + result.poster_path} 
                                            alt={result.title || result.name} 
                                            className="search-result-poster"
                                        />
                                        <div>
                                            <strong style={{ fontSize: '0.9em' }}>{result.title || result.name}</strong> 
                                            <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '10px' }}>
                                                ({result.media_type === 'movie' ? 'Film' : 'Acara TV/Anime'})
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {/* INPUT: Judul */}
                <div className="form-group">
                    <label htmlFor="title">Judul:</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="form-input" />
                </div>

                {/* INPUT: URL Poster */}
                <div className="form-group">
                    <label htmlFor="posterUrl">URL Poster (Otomatis terisi dari Pencarian):</label>
                    <input type="text" id="posterUrl" name="posterUrl" value={formData.posterUrl} onChange={handleChange} className="form-input" placeholder="URL Poster (Diisi otomatis atau manual)" />
                </div>
                
                {/* INPUT: GENRE */}
                <div className="form-group">
                    <label htmlFor="genre">Genre:</label>
                    <select id="genre" name="genre" value={formData.genre} onChange={handleChange} className="form-input">
                        {GENRES.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>

                {/* INPUT: Status Tontonan */}
                <div className="form-group">
                    <label htmlFor="status">Status Tontonan:</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className="form-input">
                        {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>
                
                {/* INPUT: Rating (Bintang Interaktif) */}
                <div className="form-group">
                    <label>Rating (1-5):</label>
                    <div className="star-rating-input">
                        {[...Array(5)].map((star, index) => {
                            const ratingValue = index + 1;
                            return (
                                <span
                                    key={index}
                                    className="star-icon"
                                    style={{
                                        color: ratingValue <= (hover || formData.rating) ? "#ffc107" : "#e4e5e9",
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
                    <p style={{marginTop: '5px', fontSize: '0.9em', color: '#666'}}>
                        Rating saat ini: **{formData.rating}**
                    </p>
                </div>
                
                {/* INPUT: Overview/Sinopsis (Edit Manual - MENGGUNAKAN isEdit) */}
                {isEdit && (
                    <div className="form-group">
                        <label htmlFor="overview">Sinopsis (Edit Manual):</label>
                        <textarea 
                            id="overview" 
                            name="overview" 
                            value={formData.overview} 
                            onChange={handleChange} 
                            className="form-input"
                            rows="4"
                            placeholder="Masukkan sinopsis atau catatan Anda..."
                        ></textarea>
                    </div>
                )}
                
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className={isEdit ? "btn-submit btn-edit" : "btn-submit btn-add"} // MENGGUNAKAN isEdit
                    >
                        {isEdit ? '💾 Simpan Perubahan' : '➕ Tambah ke Daftar'}
                    </button>
                    
                    {isEdit && ( // MENGGUNAKAN isEdit
                        <button 
                            type="button" 
                            onClick={handleCancel} 
                            className="btn-cancel"
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