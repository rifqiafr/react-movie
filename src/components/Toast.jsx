// src/components/Toast.jsx

import React, { useEffect } from 'react';

function Toast({ message, type, isVisible, onClose }) {
    
    // Panggil useEffect di level teratas (tetap benar)
    useEffect(() => {
        let timer;
        
        // Cek kondisi di DALAM useEffect (tetap benar)
        if (isVisible) {
            timer = setTimeout(() => {
                onClose();
            }, 3000); 

            // Cleanup function
            return () => clearTimeout(timer); 
        }
        
        // Cleanup untuk timer yang mungkin belum tereksekusi
        return () => { 
            if (timer) clearTimeout(timer);
        };
        
    }, [isVisible, onClose]); 

    // Jika tidak terlihat, jangan tampilkan apa-apa (tetap benar)
    if (!isVisible) return null;

    // Menentukan class dinamis berdasarkan tipe
    const typeClass = type === 'error' 
        ? 'bg-red-600' // Error color
        : 'bg-green-600'; // Success color
    
    const icon = type === 'error' ? '❌ ' : '✅ ';

    return (
        // MENGHILANGKAN STYLE INLINE transform: translateY(0)
        <div 
            className={`
                ${typeClass} 
                text-white 
                p-4 
                rounded-lg 
                shadow-2xl 
                fixed 
                bottom-8 
                right-8 
                z-[3000] 
                text-base 
                font-semibold 
                flex 
                items-center 
                transition 
                duration-300 
                ease-out
                
                /* Class yang mengontrol transform/posisi */
                transform 
                /* Menggunakan transform-y-0 untuk menunjukkan posisi terlihat */
                translate-y-0 
            `}
        >
            {icon} {message}
        </div>
    );
}

export default Toast;