// src/components/MovieForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// DAFTAR GENRE
const GENRES = ['Indonesia', 'Anime', 'Drakor', 'Western', 'Lainnya']; 

const initialFormState = {
  title: '',
  posterUrl: '',
  rating: 3,
  genre: GENRES[0], 
  overview: '', // <--- BARIS INI DITAMBAHKAN
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
  const navigate = useNavigate();

  // Efek untuk mengisi form saat mode edit
  useEffect(() => {
    if (editingMovie) {
      // Mengisi form dengan data film yang sedang di-edit
      setFormData({...editingMovie, genre: editingMovie.genre || GENRES[3]}); 
    } else {
      // Reset form jika tidak ada film yang di-edit
      setFormData(initialFormState);
      setSearchResults([]); 
      setSearchQuery('');
    }
  }, [editingMovie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'rating' ? parseInt(value) : value;
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || formData.rating < 1 || formData.rating > 5) {
        alert("Judul tidak boleh kosong dan Rating harus antara 1-5.");
        return;
    }
    
    saveMovie(formData); 
  };
  
  const handleCancelEdit = () => {
      setEditingMovie(null);
      navigate('/'); 
  };

  // FUNGSI MENCARI FILM DARI TMDB (TETAP SAMA)
  const searchMovie = async () => {
  if (!searchQuery.trim()) return;

  setIsSearching(true);
  setSearchResults([]);
  
  try {
    // URL PENCARIAN DENGAN BAHASA INDONESIA DITAMBAHKAN
    const response = await fetch(
      // TAMBAHKAN "&language=id-ID" di akhir URL
      `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}&language=id-ID`
    );
    const data = await response.json();
    
    // ... (Filter hasil yang relevan tetap sama) ...
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



  // FUNGSI BARU: MENGISI FORM DENGAN HASIL PILIHAN
  const selectResult = (result) => {
    let title = result.media_type === 'movie' ? result.title : result.name;

    // Mengisi form dengan data yang ditemukan
    setFormData(prev => ({
        ...prev,
        title: title,
        posterUrl: TMDB_IMAGE_BASE_URL + result.poster_path, 
        overview: result.overview || 'Sinopsis tidak tersedia.', // <--- PENTING: SIMPAN OVERVIEW
    }));

    // Reset pencarian setelah dipilih
    setSearchResults([]);
    setSearchQuery('');
  };


  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        
        {/* FIELD PENCARIAN TMDB (Hanya tampil di mode ADD) */}
        {!editingMovie && ( 
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
        
        {/* INPUT: Rating */}
        <div className="form-group">
            <label htmlFor="rating">Rating (1-5):</label>
            <input type="number" id="rating" name="rating" value={formData.rating} onChange={handleChange} min="1" max="5" required className="form-input" />
        </div>
        
        {/* INPUT: Overview/Sinopsis (Optional: Bisa ditambahkan sebagai field edit manual) */}
        {editingMovie && (
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
                className={editingMovie ? "btn-submit btn-edit" : "btn-submit btn-add"}
            >
                {editingMovie ? '💾 Simpan Perubahan' : '➕ Tambah ke Daftar'}
            </button>
            
            {editingMovie && (
                <button 
                    type="button" 
                    onClick={handleCancelEdit} 
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