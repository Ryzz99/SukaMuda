import React from 'react';
import './Footer.css';
import logoSukaMuda from '../assets/logo.png';

// 1. PASTIKAN NAMANYA "Footer" (F-nya besar)
const Footer = () => { 
  return (
    <footer className="profile-footer">
      <div className="footer-content">
        <div className="footer-logo-section">
          <div className="footer-logo-circle">
            <img src={logoSukaMuda} alt="SukaMuda" />
          </div>
          <p>Follow us 📸</p>
        </div>

        <div className="footer-links">
          <h3>Tentang</h3>
          <p>Syarat dan ketentuan</p>
          <p>Privasi & Simbol</p>
          <p>Iklan</p>
          <p>Bantuan</p>
        </div>

        <div className="footer-categories">
          <h3>Kategori</h3>
          <div className="category-grid">
            <div className="cat-col">
              <p>News</p>
              <p>Lifestyle</p>
              <p>Sport & E-Sport</p>
              <p>Music & Film</p>
              <p>Hobby</p>
            </div>
            <div className="cat-col">
              <p>Otomotif</p>
              <p>Health</p>
              <p>Science</p>
              <p>Device</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 2. PASTIKAN INI SAMA DENGAN NAMA DI ATAS
export default Footer;