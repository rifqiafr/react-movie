// src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom'; 

function Header({ movieCount }) {
  const headerStyle = {
    // Background Dark Navy/Black yang elegan
    backgroundColor: '#0f172a', 
    color: '#fff',
    padding: '18px 30px', // Padding lebih tebal
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    // Shadow kuat untuk efek 'high-end'
    boxShadow: '0 5px 15px rgba(0,0,0,0.4)', 
  };

  const logoStyle = {
    fontSize: '2.0em', // Logo lebih besar
    fontWeight: '800', // Lebih Bold
    letterSpacing: '1px',
    color: '#cbd5e1', 
    textDecoration: 'none',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
  };

  const navItemStyle = {
      color: '#cbd5e1',
      textDecoration: 'none',
      marginLeft: '25px',
      fontSize: '1.1em',
      transition: 'color 0.3s ease',
  };

  return (
    <header style={headerStyle}>
      {/* Ganti teks logo dan ikon */}
      <Link to="/" style={logoStyle}>🍿 MovieTime</Link>
      <nav>
        <Link to="/add" style={navItemStyle} className="nav-link-hover">Tambah Baru</Link>
        <Link to="/" style={navItemStyle} className="nav-link-hover">Daftar ({movieCount})</Link>
      </nav>
    </header>
  );
}

export default Header;