import React, { useState } from 'react';
import { initialArticles } from '../data/articles';
import { IoPencilSharp } from 'react-icons/io5'; 
import './Profile.css';

const Profile = () => {
  const [semuaArtikel, setSemuaArtikel] = useState(initialArticles);
  const [activeTab, setActiveTab] = useState('Posts');

  // --- LOGIKA EDIT PROFIL ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "Insiyya Zakiyyatul Wafda",
    bio: "BIO",
    profession: "Profession", 
    interest: ["News", "Lifestyle"] 
  });

  const [tempData, setTempData] = useState(userData);

  const daftarProfession = ["Content Writer", "Blogger", "Freelance Writer", "Contributor"];
  const pilihanInterest = ["News", "Lifestyle", "Music & Film", "Health", "Hobby", "Science", "Sport", "Gadget", "Automotive"];

  const toggleInterest = (it) => {
    if (tempData.interest.includes(it)) {
      setTempData({ ...tempData, interest: tempData.interest.filter(i => i !== it) });
    } else {
      setTempData({ ...tempData, interest: [...tempData.interest, it] });
    }
  };

  const handleSaveProfile = () => {
    setUserData(tempData);
    setIsEditModalOpen(false);
  };

  // --- LOGIKA MODAL CUSTOM (FAVORITE & DRAFT) ---
  const [showModal, setShowModal] = useState(false);
  const [artikelAkanDihapus, setArtikelAkanDihapus] = useState(null);
  const [tipeHapus, setTipeHapus] = useState('');

  const handleToggleLike = (id) => {
    const artikelTarget = semuaArtikel.find(art => art.id === id);
    if (artikelTarget && artikelTarget.isLiked) {
      setArtikelAkanDihapus(id);
      setTipeHapus('favorite');
      setShowModal(true);
      return;
    }
    prosesEksekusiHapus(id, 'favorite');
  };

  const handleKlikHapusDraft = (id) => {
    setArtikelAkanDihapus(id);
    setTipeHapus('draft');
    setShowModal(true);
  };

  const prosesEksekusiHapus = (id, tipe) => {
    setSemuaArtikel(prev => prev.map(art => {
      if (art.id === id) {
        if (tipe === 'favorite') {
          const statusBaru = !art.isLiked;
          return { ...art, isLiked: statusBaru, likes: statusBaru ? art.likes + 1 : art.likes - 1 };
        } else if (tipe === 'draft') {
          return { ...art, status: 'deleted' };
        }
      }
      return art;
    }));
    setShowModal(false);
  };

  const listPosts = semuaArtikel.filter(a => a.status === 'published');
  const listDraft = semuaArtikel.filter(a => a.status === 'draft');
  const listFavorite = semuaArtikel.filter(a => a.isLiked === true);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="banner-gray"></div>
        <div className="profile-info-container">
          <div className="user-details">
            {/* WRAPPER NAMA & EDIT */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1>{userData.name}</h1>
                <IoPencilSharp 
                  style={{ cursor: 'pointer', color: '#666', fontSize: '20px' }} 
                  onClick={() => {
                    setTempData(userData);
                    setIsEditModalOpen(true);
                  }}
                />
            </div>
            <p className="bio-text">{userData.bio}</p>
            <p className="sub-text" style={{fontWeight: 'bold', color: '#333'}}>{userData.profession}</p>

            {/* KAPSUL INTEREST HITAM (GAMBAR 1) */}
            <div className="interest-capsule-wrapper">
              {userData.interest.map((it, index) => (
                <span key={index} className="interest-capsule">
                  {it} +
                </span>
              ))}
            </div>
          </div>
          <div className="profile-avatar-large"></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <span className={`tab-item ${activeTab === 'Posts' ? 'active' : ''}`} onClick={() => setActiveTab('Posts')}>Posts</span> |
        <span className={`tab-item ${activeTab === 'Favorite' ? 'active' : ''}`} onClick={() => setActiveTab('Favorite')}>Favorite</span> |
        <span className={`tab-item ${activeTab === 'Draft' ? 'active' : ''}`} onClick={() => setActiveTab('Draft')}>Draft</span>
      </div>

      <div className="profile-content-placeholder">
        {/* Konten tetap sama seperti kodemu */}
        {activeTab === 'Posts' && (
          <div className="posts-container">
            {listPosts.map((artikel) => (
              <div className="post-card" key={artikel.id}>
                {/* ... detail card ... */}
              </div>
            ))}
          </div>
        )}
        {/* (Tab Draft & Favorite sesuaikan seperti kode sebelumnya) */}
      </div>

      {/* --- MODAL EDIT PROFIL --- */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ textAlign: 'left', maxWidth: '450px' }}>
            <h2 className="modal-title">Edit Profil</h2>
            
            <div className="edit-form-scrollable" style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <label>Nama</label>
              <input type="text" value={tempData.name} onChange={(e) => setTempData({...tempData, name: e.target.value})} className="form-input" />
              
              <label>Bio</label>
              <textarea value={tempData.bio} onChange={(e) => setTempData({...tempData, bio: e.target.value})} className="form-input" />

              <label>Profession</label>
              <select 
                className="form-input" 
                value={tempData.profession} 
                onChange={(e) => setTempData({...tempData, profession: e.target.value})}
              >
                {daftarProfession.map((p, idx) => (
                  <option key={idx} value={p}>{p}</option>
                ))}
              </select>

              <label>Interest (Pilih kategori)</label>
              <div className="interest-selection-grid">
                {pilihanInterest.map((it, idx) => (
                  <button 
                    key={idx}
                    className={`interest-capsule-btn ${tempData.interest.includes(it) ? 'active' : ''}`}
                    onClick={() => toggleInterest(it)}
                  >
                    {it} {tempData.interest.includes(it) ? '✓' : '+'}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-buttons" style={{ marginTop: '20px' }}>
              <button className="btn-batal" onClick={() => setIsEditModalOpen(false)}>Batal</button>
              <button className="btn-konfirmasi-hapus" style={{ backgroundColor: '#000' }} onClick={handleSaveProfile}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus tetap sama */}
    </div>
  );
};

export default Profile;