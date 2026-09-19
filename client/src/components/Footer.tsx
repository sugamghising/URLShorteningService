import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{ background: '#0f172a', color: '#ccc', padding: '60px 0 28px', borderTop: '3px solid #c9a227' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <h4 style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#fff', fontSize: '1.1rem', margin: '0 0 6px' }}>URL Shortener</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#889' }}>Built with React 19, TypeScript, Tailwind, Express, MongoDB.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>
            <a href="#" style={{ color: '#fff', opacity: 0.9 }}>About</a> &middot; <a href="#" style={{ color: '#fff', opacity: 0.9 }}>Privacy</a> &middot; <a href="#" style={{ color: '#fff', opacity: 0.9 }}>Terms</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
