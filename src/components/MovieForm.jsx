import React, { useState, useEffect } from 'react';

const initialFormState = {
  title: '',
  posterUrl: '',
  rating: 3,
};

function MovieForm({ saveMovie, editingMovie, setEditingMovie }) {
  const [formData, setFormData] = useState(initialFormState);

  // Mengisi form saat mode edit
  useEffect(() => {
    if (editingMovie) {
      setFormData(editingMovie); 
    } else {
      setFormData(initialFormState);
    }
  }, [editingMovie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Mengubah rating menjadi angka
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
    setFormData(initialFormState);
  };
  
  const handleCancelEdit = () => {
      setEditingMovie(null);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        
        {['title', 'posterUrl', 'rating'].map((field) => (
            <div className="form-group" key={field}>
                <label htmlFor={field}>{field === 'title' ? 'Judul' : field === 'posterUrl' ? 'URL Poster' : 'Rating (1-5)'}:</label>
                <input
                    type={field === 'rating' ? 'number' : 'text'}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required={field !== 'posterUrl'}
                    min={field === 'rating' ? "1" : null}
                    max={field === 'rating' ? "5" : null}
                    className="form-input"
                />
            </div>
        ))}

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