import React from 'react';

function Header({ movieCount }) {
  // Styling inline untuk header
  const headerStyle = {
    backgroundColor: '#1f2937', // Darker background
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
      <div style={logoStyle}>🎬 My Watchlist</div>
      <nav>
        <a href="#tambah" style={navItemStyle} className="nav-link-hover">Tambah Baru</a>
        <a href="#daftar" style={navItemStyle} className="nav-link-hover">Daftar ({movieCount})</a>
      </nav>
    </header>
  );
}

export default Header;