import React, { useState } from 'react';
import { initialArticles } from '../data/articles';
import { IoPencilSharp } from 'react-icons/io5';
import { IoHeartOutline, IoHeart, IoEyeOutline, IoShareSocialOutline, IoTrashOutline } from 'react-icons/io5';
import './Profile.css';


const Profile = () => {
  const [semuaArtikel, setSemuaArtikel] = useState(initialArticles);
  const [activeTab, setActiveTab] = useState('Posts');

  // --- LOGIKA EDIT PROFIL ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "Insiyya Zakiyyatul Wafda",
    bio: "BIO",
    profession: "Content Writer",
    interest: ["News", "Lifestyle"]
  });

  const [tempData, setTempData] = useState(userData);

  const daftarProfession = ["Content Writer", "Blogger", "Freelance Writer", "Contributor", "Other"];
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

  // --- LOGIKA MODAL CUSTOM (HAPUS FAVORITE / DRAFT) ---
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
    setArtikelAkanDihapus(null);
    setTipeHapus('');
  };

  const listPosts = semuaArtikel.filter(a => a.status === 'published');
  const listDraft = semuaArtikel.filter(a => a.status === 'draft');
  const listFavorite = semuaArtikel.filter(a => a.isLiked === true);

  return (
    <div className="profile-page">
      {/* Header Profil */}
      <div className="profile-header">
        <div className="banner-gray"></div>
        <div className="profile-info-container">
          <div className="user-details">
            <div className="name-edit-wrapper">
              <h1>{userData.name}</h1>
              <IoPencilSharp
                className="edit-icon-btn"
                onClick={() => {
                  setTempData(userData);
                  setIsEditModalOpen(true);
                }}
              />
            </div>
            <p className="bio-text">{userData.bio}</p>
            <p className="profession-display">{userData.profession}</p>

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
        {/* Tab Content (Posts/Draft/Favorite) */}
        {activeTab === 'Posts' && (
          <div className="posts-container">
            {listPosts.map((artikel) => (
              <div className="post-card" key={artikel.id}>
                <div className="post-thumbnail">
                  {artikel.foto ? <img src={artikel.foto} alt={artikel.judul} className="post-img" /> : <div className="gray-placeholder" />}
                  <span className="post-category">{artikel.kategori}</span>
                </div>
                <div className="post-details">
                  <p className="post-author">Nama : {artikel.nama}</p>
                  <p className="post-meta">Profesi | {artikel.tanggal || 'Tanggal'}</p>
                  <h3 className="post-title">{artikel.judul}</h3>

                  <div className="post-actions">

                    {/* LIKE */}
                    <span
                      className="icon-group"
                      onClick={() => handleToggleLike(artikel.id)}
                    >
                      {artikel.isLiked ? (
                        <IoHeart className="icon heart liked" />
                      ) : (
                        <IoHeartOutline className="icon heart" />
                      )}
                      <span className="action-count">{artikel.likes}</span>
                    </span>

                    {/* VIEW */}
                    <span className="icon-group">
                      <IoEyeOutline className="icon" />
                      <span className="action-count">{artikel.views || 120}</span>
                    </span>

                    {/* SHARE */}
                    <span className="icon-group">
                      <IoShareSocialOutline className="icon" />
                    </span>

                    {/* DELETE */}
                    <IoTrashOutline
                      className="delete-icon"
                      onClick={() => handleKlikHapusDraft(artikel.id)}
                    />

                    <button className="btn-selengkapnya">Selengkapnya &gt;</button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- TAB DRAFT --- */}
        {activeTab === 'Draft' && (
          <div className="posts-container">
            {listDraft.length > 0 ? listDraft.map((draft) => (
              <div className="post-card draft-mode" key={draft.id}>
                <div className="post-thumbnail"><span className="post-category draft-tag">Draft</span></div>
                <div className="post-details">
                  <p className="post-author">Terakhir diedit: {draft.tanggalEdit || 'Baru saja'}</p>
                  <h3 className="post-title">{draft.judul}</h3>
                  <div className="post-actions">
                    <button className="btn-hapus" onClick={() => handleKlikHapusDraft(draft.id)}>Hapus</button>
                    <button className="btn-edit-draft">Lanjutkan Menulis</button>
                  </div>
                </div>
              </div>
            )) : <p className="empty-state">Tidak ada draft.</p>}
          </div>
        )}

        {/* --- TAB FAVORITE --- */}
        {activeTab === 'Favorite' && (
          <div className="posts-container">
            {listFavorite.length > 0 ? listFavorite.map((fav) => (
              <div className="post-card" key={fav.id}>
                <div className="post-thumbnail">
                  {fav.foto ? <img src={fav.foto} alt={fav.judul} className="post-img" /> : <div className="gray-placeholder"></div>}
                  <span className="post-category">{fav.kategori}</span>
                </div>
                <div className="post-details">
                  <p className="post-author">Nama : {fav.nama}</p>
                  <p className="post-meta">Profesi | {fav.tanggal}</p>
                  <h3 className="post-title">{fav.judul}</h3>

                  {/* PERBAIKAN DI SINI: Satukan semua dalam post-actions */}
                  <div className="post-actions">
                    <span className="icon-group" onClick={() => handleToggleLike(fav.id)}>
                      <IoHeart className="icon heart liked" />
                      <span className="action-count">{fav.likes}</span>
                    </span>

                    <span className="icon-group">
                      <IoEyeOutline className="icon" />
                      <span className="action-count">{fav.views || 2}</span>
                    </span>

                    <IoShareSocialOutline className="icon share-icon" />

                    {/* Sekarang tombol ini jadi bagian dari Flexbox dan akan sejajar ke kanan */}
                    <button className="btn-selengkapnya">Selengkapnya &gt;</button>
                  </div>

                </div>
              </div>
            )) : <div className="empty-state"><p>Belum ada artikel yang kamu sukai.</p></div>}
          </div>
        )}

        {/* Render Draft & Favorite logic tetap sama... */}
      </div>

      {/* MODAL EDIT PROFIL */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-edit-container">
            <h2 className="modal-edit-title">Edit Profil</h2>

            <label className="modal-edit-label">Nama</label>
            <input
              type="text"
              className="modal-edit-nama"
              value={tempData.name}
              onChange={(e) => setTempData({ ...tempData, name: e.target.value })}
            />

            <label className="modal-edit-label">Bio</label>
            <textarea
              className="modal-edit-bio"
              value={tempData.bio}
              onChange={(e) => setTempData({ ...tempData, bio: e.target.value })}
            />

            <label className="modal-edit-label">Profession</label>
            <select
              className="modal-edit-profession"
              value={tempData.profession}
              onChange={(e) => setTempData({ ...tempData, profession: e.target.value })}
            >
              {daftarProfession.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>

            <label className="modal-edit-label">Interest (Pilih kategori)</label>
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

            <div className="modal-edit-actions">
              <button className="btn-batal" onClick={() => setIsEditModalOpen(false)}>Batal</button>
              <button className="btn-simpan-profil" onClick={handleSaveProfile}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Yakin ingin menghapus konten ini?</h2>
            <p className="modal-subtitle">"Tindakan ini bersifat permanen dan tidak dapat dibatalkan."</p>
            <div className="modal-buttons">
              <button className="btn-batal" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-konfirmasi-hapus" onClick={() => prosesEksekusiHapus(artikelAkanDihapus, tipeHapus)}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;