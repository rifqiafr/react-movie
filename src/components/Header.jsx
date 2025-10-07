// src/components/Header.jsx
import React from 'react';

// Styling untuk header (bisa dipindah ke file CSS terpisah)
const headerStyle = {
  backgroundColor: '#333',
  color: '#fff',
  padding: '15px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'sticky', // Membuat navbar tetap di atas saat di-scroll
  top: 0,
  zIndex: 1000,
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
};

const logoStyle = {
  fontSize: '1.5em',
  fontWeight: 'bold',
  letterSpacing: '1px',
};

const navItemStyle = {
    color: '#fff',
    textDecoration: 'none',
    marginLeft: '20px',
    transition: 'color 0.3s ease', // Transisi
};

function Header({ movieCount }) {
  return (
    <header style={headerStyle}>
      <div style={logoStyle}>🎬 My Watchlist</div>
      <nav>
        <a href="#tambah" style={navItemStyle}>Tambah Baru</a>
        <a href="#daftar" style={navItemStyle}>Daftar Tontonan ({movieCount})</a>
      </nav>
    </header>
  );
}

export default Header;