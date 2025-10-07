import React from 'react';
import { Link } from 'react-router-dom'; 

function Header({ movieCount }) {
  const headerStyle = {
    backgroundColor: '#1f2937', 
    color: '#fff',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  };

  const logoStyle = {
    fontSize: '1.8em',
    fontWeight: '700',
    letterSpacing: '0.5px',
    color: '#fff', // Tambahkan warna untuk Link
    textDecoration: 'none',
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
      <Link to="/" style={logoStyle}>🎬 MovieTime</Link>
      <nav>
        <Link to="/add" style={navItemStyle} className="nav-link-hover">Tambah Baru</Link>
        <Link to="/" style={navItemStyle} className="nav-link-hover">Daftar ({movieCount})</Link>
      </nav>
    </header>
  );
}

export default Header;