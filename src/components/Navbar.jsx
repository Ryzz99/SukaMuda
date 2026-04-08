import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logoSukaMuda from '../assets/logo.png';
import { IoNotificationsSharp, IoCreateOutline, IoMenu, IoClose } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // STATE UNTUK DROPDOWN MENU (NEWS & LIFESTYLE)
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const navigate = useNavigate();
  const sidebarRef = useRef();

  // FUNGSI UNTUK BUKA/TUTUP DROPDOWN
  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  // Menutup sidebar jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <nav className="navbar-container">
        {/* --- NAVBAR ATAS (Logo, Search, Icons) --- */}
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
              <div className="logged-in-icons">
                <IoNotificationsSharp 
                  className="icon" 
                  onClick={() => navigate('/notifications')} 
                />
                <IoCreateOutline 
                  className="icon" 
                  onClick={() => navigate('/write')} 
                />
                <IoMenu className="icon menu-btn" onClick={toggleSidebar} />
              </div>
            ) : (
              <div className="auth-buttons">
                <button className="btn-daftar" onClick={() => navigate('/register')}>Daftar</button>
                <button className="btn-masuk" onClick={() => navigate('/login')}>Masuk</button>
              </div>
            )}
          </div>
        </div>

        {/* --- NAVBAR BAWAH (Menu Kategori & Dropdown) --- */}
        <div className="navbar-bottom">
          <ul className="nav-menu">
            {/* ITEM MENU: NEWS */}
            <li className="nav-item">
              <div className="menu-header" onClick={() => toggleDropdown('news')}>
                News <span className={`arrow ${activeDropdown === 'news' ? 'up' : 'down'}`}></span>
              </div>
              {activeDropdown === 'news' && (
                <ul className="dropdown-menu">
                  <li onClick={() => navigate('/category/osis')}>Osis</li>
                  <li onClick={() => navigate('/category/kampus')}>Kampus</li>
                  <li onClick={() => navigate('/category/general')}>General</li>
                </ul>
              )}
            </li>

            {/* ITEM MENU: LIFESTYLE */}
            <li className="nav-item">
              <div className="menu-header" onClick={() => toggleDropdown('lifestyle')}>
                Lifestyle <span className={`arrow ${activeDropdown === 'lifestyle' ? 'up' : 'down'}`}></span>
              </div>
              {activeDropdown === 'lifestyle' && (
                <ul className="dropdown-menu">
                  <li onClick={() => navigate('/category/style')}>Style</li>
                  <li onClick={() => navigate('/category/culinary')}>Culinary</li>
                  <li onClick={() => navigate('/category/traveling')}>Traveling</li>
                </ul>
              )}
            </li>

            <li className="nav-item" onClick={() => navigate('/category/sport')}>Sport & E-Sport</li>
            <li className="nav-item" onClick={() => navigate('/category/music')}>Music & Film</li>
            <li className="nav-item" onClick={() => navigate('/category/otomotif')}>Otomotif</li>
            <li className="nav-item" onClick={() => navigate('/category/science')}>Science</li>
            <li className="nav-item" onClick={() => navigate('/category/health')}>Health</li>
            <li className="nav-item" onClick={() => navigate('/category/hobby')}>Hobby</li>
            <li className="nav-item" onClick={() => navigate('/category/device')}>Device</li>
          </ul>
        </div>
      </nav>

      {/* --- SIDEBAR POP UP --- */}
      <div className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}>
        <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
          <div className="sidebar-header">
             <div className="sidebar-icons">
                <IoClose className="s-icon close-btn" onClick={toggleSidebar} />
             </div>
          </div>

          <div className="sidebar-content">
            <ul className="sidebar-menu-list">
              <li onClick={() => { navigate('/profile'); toggleSidebar(); }}>Profil Saya</li>
              <li onClick={() => { navigate('/about'); toggleSidebar(); }}>About</li>
              <li onClick={() => { navigate('/terms'); toggleSidebar(); }}>Syarat & Ketentuan</li>
              <li onClick={() => { navigate('/rules'); toggleSidebar(); }}>Privacy & Policy</li>
              <li onClick={() => { navigate('/help'); toggleSidebar(); }}>Bantuan</li>
            </ul>
          </div>

          <div className="sidebar-footer">
            <button className="btn-logout" onClick={() => { logout(); toggleSidebar(); }}>Keluar</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;