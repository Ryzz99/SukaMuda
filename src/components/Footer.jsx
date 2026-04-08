import React from 'react';
import { Link } from 'react-router-dom';
import { IoLogoInstagram } from 'react-icons/io5';
import './Footer.css';
import logoSukaMuda from '../assets/logo.png';

const Footer = () => { 
  return (
    <footer className="profile-footer">
      <div className="footer-content">
        
        {/* Bagian Kiri */}
        <div className="footer-logo-section">
          <div className="footer-logo-circle">
            <img src={logoSukaMuda} alt="SukaMuda" />
          </div>
          <div className="social-follow">
            <span>Follow us</span>
            <a href="https://www.instagram.com/sukamudaid/" target="_blank" rel="noopener noreferrer">
              <IoLogoInstagram className="instagram-icon" />
            </a>
          </div>
        </div>

        {/* Bagian Tengah */}
        <div className="footer-links">
          <Link to="/About">Tentang</Link>
          <Link to="/Terms">Syarat dan ketentuan</Link>
          <Link to="/Rules">Kebijakan Privasi & Kebijakan Penggunaan</Link>
          <Link to="/iklan">Iklan</Link>
          <Link to="/Help">Bantuan</Link>
        </div>

        {/* Bagian Kanan */}
        <div className="footer-categories">
          <h3>Kategori</h3>
          <div className="category-grid">
            <div className="cat-col">
              <Link to="/category/news">News</Link>
              <Link to="/category/lifestyle">Lifestyle</Link>
              <Link to="/category/sport">Sport & E-Sport</Link>
              <Link to="/category/music">Music & Film</Link>
              <Link to="/category/hobby">Hobby</Link>
            </div>
            <div className="cat-col">
              <Link to="/category/otomotif">Otomotif</Link>
              <Link to="/category/health">Health</Link>
              <Link to="/category/science">Science</Link>
              <Link to="/category/device">Device</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;