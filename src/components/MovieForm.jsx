import React, { useState, useEffect } from 'react';

// Nilai awal formulir
const initialFormState = {
  title: '',
  posterUrl: '',
  rating: 3, // Default rating 3
};

function MovieForm({ saveMovie, editingMovie, setEditingMovie }) {
  const [formData, setFormData] = useState(initialFormState);

  // Efek untuk mengisi form ketika ada film yang sedang di-edit
  useEffect(() => {
    if (editingMovie) {
      // Mengisi form dengan data film yang sedang di-edit, termasuk ID
      setFormData(editingMovie); 
    } else {
      // Reset form jika tidak ada film yang di-edit
      setFormData(initialFormState);
    }
  }, [editingMovie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
        alert("Judul tidak boleh kosong!");
        return;
    }
    
    saveMovie(formData);
    // Setelah menyimpan, reset form ke nilai awal
    setFormData(initialFormState); 
  };
  
  const handleCancelEdit = () => {
      setEditingMovie(null);
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
      <h3>{editingMovie ? 'Edit Film/Acara' : 'Tambah Film/Acara Baru'}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="title">Judul:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="posterUrl">URL Poster (Link Gambar):</label>
          <input
            type="text"
            id="posterUrl"
            name="posterUrl"
            value={formData.posterUrl}
            onChange={handleChange}
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="rating">Rating (1-5):</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: editingMovie ? 'orange' : 'green', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
          {editingMovie ? 'Simpan Perubahan' : 'Tambah ke Daftar'}
        </button>
        
        {editingMovie && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 15px', backgroundColor: 'gray', color: 'white', border: 'none', cursor: 'pointer' }}>
                Batalkan Edit
            </button>
        )}
      </form>
    </div>
  );
}

export default MovieForm;