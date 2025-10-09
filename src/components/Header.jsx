// src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom'; 

function Header({ movieCount }) {
  
  return (
    <header className="
        fixed top-0 left-0 w-full z-[2000] 
        bg-gray-900/95 
        text-white 
        px-4 py-4 md:px-10 md:py-5 /* Padding disesuaikan untuk mobile */
        flex justify-between items-center 
        shadow-xl
    ">
      {/* Logo: Dibuat selalu terlihat (block) dengan font yang lebih kecil di mobile */}
      <Link to="/" className="
        text-xl sm:text-3xl font-extrabold tracking-wider 
        text-gray-200 
        hover:text-white 
        transition duration-200 
        block /* Selalu tampil */
      ">
        🍿 MovieTime
      </Link>
      
      <nav className="flex items-center">
        <Link 
          to="/add" 
          className="app-nav-link nav-link-hover text-sm sm:text-lg ml-4 sm:ml-6 text-gray-300 hover:text-white transition duration-200"
        >
          Tambah Baru
        </Link>
        <Link 
          to="/" 
          className="app-nav-link nav-link-hover text-sm sm:text-lg ml-4 sm:ml-6 text-gray-300 hover:text-white transition duration-200"
        >
          Daftar ({movieCount})
        </Link>
      </nav>
    </header>
  );
}

export default Header;