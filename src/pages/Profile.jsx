import React from 'react';
import './Profile.css';
import logoSukaMuda from '../assets/logo.png'; // Pastikan path benar

const Profile = () => {
  return (
    <div className="profile-page">
      {/* Bagian Header Profil */}
      <div className="profile-header">
        <div className="banner-gray"></div>
        <div className="profile-info-container">
          <div className="user-details">
            <h1>Insiyya Zakiyyatul Wafda</h1>
            <p className="bio-text">BIO</p>
            <p className="sub-text">Profession</p>
            <p className="sub-text">Interest</p>
          </div>
          <div className="profile-avatar-large"></div>
        </div>
      </div>

      {/* Menu Tab Profil */}
      <div className="profile-tabs">
        <span className="tab-item active">Beranda</span> |
        <span className="tab-item">Posts</span> |
        <span className="tab-item">Favorite</span> |
        <span className="tab-item">Draft</span> |
        <span className="tab-item">Edit</span>
      </div>

      <div className="profile-content-placeholder">
        {/* Konten postingan akan muncul di sini */}
      </div>
    </div>
  );
};

export default Profile;