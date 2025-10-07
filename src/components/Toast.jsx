// src/components/Toast.jsx

import React, { useEffect } from 'react';

function Toast({ message, type, isVisible, onClose }) {
    
    // Panggil useEffect TANPA SYARAT di level teratas
    useEffect(() => {
        let timer;
        
        // Cek kondisi di DALAM useEffect
        if (isVisible) {
            timer = setTimeout(() => {
                onClose();
            }, 3000); // Toast akan hilang setelah 3 detik

            // Cleanup function: Membersihkan timer saat komponen di-unmount atau isVisible berubah
            return () => clearTimeout(timer); 
        }
        
        // Pastikan cleanup dijalankan jika isVisible berubah menjadi false
        return () => { 
            if (timer) clearTimeout(timer);
        };
        
    }, [isVisible, onClose]); // isVisible dan onClose harus ada di dependency array

    // Jika tidak terlihat, jangan tampilkan apa-apa (ini di luar hook)
    if (!isVisible) return null;

    // Menentukan style berdasarkan tipe
    const toastStyle = {
        backgroundColor: type === 'error' ? '#dc2626' : '#10b981', 
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: '3000', 
        fontSize: '1em',
        fontWeight: '600',
        transition: 'transform 0.3s ease-out',
        display: 'flex',
        alignItems: 'center',
    };

    const icon = type === 'error' ? '❌ ' : '✅ ';

    return (
        <div style={toastStyle}>
            {icon} {message}
        </div>
    );
}

export default Toast;