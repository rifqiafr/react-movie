// src/pages/AddPage.jsx

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieForm from '../components/MovieForm';

function AddPage({ saveMovie, movies, editingMovie, setEditingMovie, showToast }) { 
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    // Efek untuk memuat data film jika ada ID di URL (Mode Edit)
    useEffect(() => {
        if (id) {
            const movieToEdit = movies.find(movie => movie.id === id);
            if (movieToEdit) {
                setEditingMovie(movieToEdit);
            } else if (!editingMovie) {
                navigate('/add', { replace: true }); 
            }
        } else {
            setEditingMovie(null); 
        }
    }, [id, movies, setEditingMovie, navigate, editingMovie]);

    // Fungsi handleSave menggantikan alert() dengan showToast()
    const handleSave = async (movieData) => {
        const isNew = !movieData.id;
        
        // Panggil fungsi saveMovie (CREATE/UPDATE) dari App.jsx
        await saveMovie(movieData);
        
        // Menggunakan Toast untuk feedback non-intrusif
        if (showToast) {
            showToast(isNew ? "Film berhasil ditambahkan secara online!" : "Film berhasil diubah secara online!", 'success');
        } else {
            // Fallback (sebaiknya dihapus setelah Toast berfungsi penuh di App.jsx)
            alert(isNew ? "Film berhasil ditambahkan secara online!" : "Film berhasil diubah secara online!");
        }
        
        navigate('/'); // Navigasi ke halaman utama setelah sukses
    }

    return (
        // Menggunakan kelas Tailwind untuk Dark Theme, padding, dan min-height
        <section 
            id="tambah" 
            className="pt-24 md:pt-32 pb-10 min-h-screen" 
        >
            <div className="max-w-4xl mx-auto px-4">
                {/* Judul Halaman */}
                <h2 className="text-center text-3xl font-bold text-black mb-6">
                    {id ? '📝 Edit Entri' : '➕ Tambah Entri Baru'}
                </h2>
                
                {/* Komponen Formulir */}
                <MovieForm 
                    saveMovie={handleSave} 
                    editingMovie={editingMovie}
                    setEditingMovie={setEditingMovie}
                />
            </div>
        </section>
    );
}

export default AddPage;