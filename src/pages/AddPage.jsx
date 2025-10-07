import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieForm from '../components/MovieForm';

function AddPage({ saveMovie, movies, editingMovie, setEditingMovie }) {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // Efek untuk memuat data film jika ada ID di URL (Mode Edit)
  useEffect(() => {
    // Jika ada ID di URL, kita masuk mode edit
    if (id) {
      const movieToEdit = movies.find(movie => movie.id === id);
      if (movieToEdit) {
        setEditingMovie(movieToEdit);
      } else if (!editingMovie) {
        // Jika ID tidak valid (data tidak ditemukan), kembali ke form kosong
        navigate('/add', { replace: true }); 
      }
    } else {
        // Jika tidak ada ID, pastikan mode bukan edit
        setEditingMovie(null); 
    }
  }, [id, movies, setEditingMovie, navigate, editingMovie]);

  // Fungsi saveMovie yang diperbarui untuk navigasi setelah disimpan
  const handleSave = async (movieData) => {
      const isNew = !movieData.id;
      
      // Panggil fungsi saveMovie (CREATE/UPDATE) dari App.jsx
      await saveMovie(movieData);
      
      // Setelah sukses menyimpan, beri notifikasi dan navigasi
      alert(isNew ? "Film berhasil ditambahkan secara online!" : "Film berhasil diubah secara online!");
      navigate('/'); // Navigasi ke halaman utama setelah sukses
  }

  return (
    <section id="tambah" className="form-section">
      <h2 style={{ textAlign: 'center', color: '#333' }}>
          {id ? '📝 Edit Entri' : '➕ Tambah Entri Baru'}
      </h2>
      <MovieForm 
        saveMovie={handleSave} 
        editingMovie={editingMovie}
        setEditingMovie={setEditingMovie}
      />
    </section>
  );
}

export default AddPage;