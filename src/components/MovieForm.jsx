import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GENRES = ['Indonesia', 'Anime', 'Drakor', 'Lainnya']; // Tambahkan 'Lainnya'
const initialFormState = {
  title: '',
  posterUrl: '',
  rating: 3,
  genre: GENRES[0], 
};

function MovieForm({ saveMovie, editingMovie, setEditingMovie }) {
  const [formData, setFormData] = useState(initialFormState);
  const navigate = useNavigate();

  // Efek untuk mengisi form saat mode edit
  useEffect(() => {
    if (editingMovie) {
      setFormData({...editingMovie, genre: editingMovie.genre || GENRES[3]}); // Default ke 'Lainnya' jika genre tidak ada
    } else {
      setFormData(initialFormState);
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
    
    saveMovie(formData); // Memanggil handleSave di AddPage
  };
  
  const handleCancelEdit = () => {
      setEditingMovie(null);
      navigate('/'); // Kembali ke halaman utama
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
            <label htmlFor="title">Judul:</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="form-input" />
        </div>

        <div className="form-group">
            <label htmlFor="posterUrl">URL Poster (Link Gambar):</label>
            <input type="text" id="posterUrl" name="posterUrl" value={formData.posterUrl} onChange={handleChange} className="form-input" />
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