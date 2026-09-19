import React from "react";

const Header: React.FC = () => {
  return (
    <header style={{
      background: '#162540',
      color: '#fff',
      padding: '20px 0',
      borderBottom: '3px solid #c9a227',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="/logo.svg" alt="URL Shortener" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
          <div>
            <h1 style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '1.35rem',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              margin: 0,
              color: '#fff',
            }}>URL Shortener</h1>
            <p style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: '0.78rem',
              fontWeight: 300,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              margin: '4px 0 0',
              opacity: 0.7,
            }}>Link compression service</p>
          </div>
        </div>
        <nav style={{
          display: 'flex',
          gap: '28px',
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: '0.88rem',
          letterSpacing: '0.02em',
        }}>
          <a href="#" style={{ color: '#fff', opacity: 0.9, textDecoration: 'none' }}>Features</a>
          <a href="#" style={{ color: '#fff', opacity: 0.9, textDecoration: 'none' }}>Docs</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
