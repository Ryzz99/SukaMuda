import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logoSukaMuda from '../assets/logo.png';
// Import icon dari react-icons
import { IoSettingsSharp, IoNotificationsSharp, IoCreateOutline, IoPersonCircle } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn } = useAuth(); 
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-top">
        <div className="logo-section">
          <div className="logo-circle" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img src={logoSukaMuda} alt="SukaMuda" />
          </div>
        </div>
        
        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Pencarian" />
          </div>
        </div>

        <div className="nav-actions">
          {isLoggedIn ? (
            /* Tampilan USER SUDAH LOGIN */
            <div className="logged-in-icons">
              <IoSettingsSharp className="icon" title="Pengaturan" />
              <IoNotificationsSharp className="icon" title="Notifikasi" />
              <IoCreateOutline className="icon" title="Tulis Artikel" />
              {/* Tambahkan onClick disini untuk ke Profile */}
              <IoPersonCircle 
                className="icon profile-icon" 
                title="Akun" 
                onClick={() => navigate('/profile')} 
                style={{ cursor: 'pointer' }}
              />
            </div>
          ) : (
            /* Tampilan USER BELUM LOGIN */
            <div className="auth-buttons">
              <button className="btn-daftar" onClick={() => navigate('/register')}>
                Daftar
              </button>
              <button className="btn-masuk" onClick={() => navigate('/login')}>
                Masuk
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="navbar-bottom">
        <ul className="nav-menu">
          <li className="nav-item">
            <div className="menu-header" onClick={() => toggleDropdown('news')}>
              News <span className={`arrow ${activeDropdown === 'news' ? 'up' : 'down'}`}></span>
            </div>
            {activeDropdown === 'news' && (
              <ul className="dropdown-menu">
                <li>Osis</li>
                <li>Kampus</li>
                <li>General</li>
              </ul>
            )}
          </li>
          <li className="nav-item">
            <div className="menu-header" onClick={() => toggleDropdown('lifestyle')}>
              Lifestyle <span className={`arrow ${activeDropdown === 'lifestyle' ? 'up' : 'down'}`}></span>
            </div>
            {activeDropdown === 'lifestyle' && (
              <ul className="dropdown-menu">
                <li>Style</li>
                <li>Culinary</li>
                <li>Traveling</li>
              </ul>
            )}
          </li>
          <li className="nav-item">Sport & E-Sport</li>
          <li className="nav-item">Music & Film</li>
          <li className="nav-item">Otomotif</li>
          <li className="nav-item">Science</li>
          <li className="nav-item">Health</li>
          <li className="nav-item">Hobby</li>
          <li className="nav-item">Device</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;