import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { IoPencilSharp, IoHeartOutline, IoHeart, IoEyeOutline, IoShareSocialOutline, IoTrashOutline } from 'react-icons/io5';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth(); // Ambil user dari context
  const [semuaArtikel, setSemuaArtikel] = useState([]);
  const [activeTab, setActiveTab] = useState('Posts');
  const [stats, setStats] = useState({ total_articles: 0, total_views: 0, total_likes: 0, draft_count: 0 });
  const [loading, setLoading] = useState(true);

  // --- LOGIKA EDIT PROFIL ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempData, setTempData] = useState({
    name: "",
    bio: "",
    profession: "", // Bisa disimpan di bio atau buat kolom baru nanti
    interest: []
  });

  const daftarProfession = ["Content Writer", "Blogger", "Freelance Writer", "Contributor", "Other"];
  const pilihanInterest = ["News", "Lifestyle", "Music & Film", "Health", "Hobby", "Science", "Sport", "Gadget", "Automotive"];

  // 1. FETCH DATA DARI BACKEND
  const fetchAllData = async () => {
    try {
      setLoading(true);
      // Ambil data profil & stats
      const resProfile = await axios.get('/api/profile-data');
      setStats(resProfile.data.stats);
      
      // Ambil semua artikel milik user (Laravel index)
      const resArticles = await axios.get('/api/articles');
      setSemuaArtikel(resArticles.data.data || []);
      
    } catch (error) {
      console.error("Gagal ambil data profil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const res = await axios.post('/api/profile-update', {
        name: tempData.name,
        bio: tempData.bio,
        // instagram_url, linkedin_url bisa ditambah di sini
      });
      setUser(res.data.user); // Update context
      setIsEditModalOpen(false);
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      alert("Gagal update profil");
    }
  };

  const toggleInterest = (it) => {
    if (tempData.interest.includes(it)) {
      setTempData({ ...tempData, interest: tempData.interest.filter(i => i !== it) });
    } else {
      setTempData({ ...tempData, interest: [...tempData.interest, it] });
    }
  };

  // --- LOGIKA HAPUS (Nyambung ke Laravel destroy) ---
  const [showModal, setShowModal] = useState(false);
  const [artikelAkanDihapus, setArtikelAkanDihapus] = useState(null);

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/articles/${artikelAkanDihapus}`);
      setSemuaArtikel(prev => prev.filter(art => art.id !== artikelAkanDihapus));
      setShowModal(false);
      // Refresh stats
      fetchAllData();
    } catch (error) {
      alert("Gagal menghapus artikel.");
    }
  };

  const listPosts = semuaArtikel.filter(a => a.status === 'approved');
  const listDraft = semuaArtikel.filter(a => a.status === 'draft');
  const listFavorite = semuaArtikel.filter(a => a.is_liked === true); // Pastikan backend kirim is_liked

  if (loading) return <div className="loading-screen">Memuat Profil SukaMuda...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="banner-gray"></div>
        <div className="profile-info-container">
          <div className="user-details">
            <div className="name-edit-wrapper">
              <h1>{user?.name}</h1>
              <IoPencilSharp
                className="edit-icon-btn"
                onClick={() => {
                  setTempData({ name: user.name, bio: user.bio || "", interest: [] });
                  setIsEditModalOpen(true);
                }}
              />
            </div>
            <p className="bio-text">{user?.bio || "Belum ada bio."}</p>
            
            {/* STATS BAR SEDERHANA */}
            <div className="stats-mini-bar">
                <span><b>{stats.total_views}</b> Views</span>
                <span><b>{stats.total_likes}</b> Likes</span>
                <span><b>{stats.total_articles}</b> Posts</span>
            </div>
          </div>
          <div className="profile-avatar-large">
            {user?.avatar && <img src={`http://localhost:8000/storage/${user.avatar}`} alt="Avatar" />}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <span className={`tab-item ${activeTab === 'Posts' ? 'active' : ''}`} onClick={() => setActiveTab('Posts')}>Posts ({stats.total_articles})</span>
        <span className={`tab-item ${activeTab === 'Favorite' ? 'active' : ''}`} onClick={() => setActiveTab('Favorite')}>Favorite</span>
        <span className={`tab-item ${activeTab === 'Draft' ? 'active' : ''}`} onClick={() => setActiveTab('Draft')}>Draft ({stats.draft_count})</span>
      </div>

      <div className="profile-content-placeholder">
        {activeTab === 'Posts' && (
          <div className="posts-container">
            {listPosts.map((artikel) => (
              <div className="post-card" key={artikel.id}>
                <div className="post-thumbnail">
                    <img src={artikel.image ? `http://localhost:8000/storage/${artikel.image}` : ""} alt="" className="post-img" />
                    <span className="post-category">{artikel.category}</span>
                </div>
                <div className="post-details">
                  <h3 className="post-title">{artikel.title}</h3>
                  <div className="post-actions">
                    <span className="icon-group"><IoEyeOutline className="icon" /> {artikel.views}</span>
                    <IoTrashOutline className="delete-icon" onClick={() => { setArtikelAkanDihapus(artikel.id); setShowModal(true); }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Draft & Favorite logic serupa dengan listPosts */}
        {activeTab === 'Draft' && (
            <div className="posts-container">
                {listDraft.map(draft => (
                    <div className="post-card draft-mode" key={draft.id}>
                        <div className="post-details">
                            <h3>{draft.title}</h3>
                            <button className="btn-edit-draft" onClick={() => navigate(`/edit/${draft.id}`)}>Lanjutkan Menulis</button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* MODAL EDIT PROFIL */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-edit-container">
            <h2 className="modal-edit-title">Edit Profil</h2>
            <label className="modal-edit-label">Nama</label>
            <input type="text" className="modal-edit-nama" value={tempData.name} onChange={(e) => setTempData({ ...tempData, name: e.target.value })} />
            
            <label className="modal-edit-label">Bio</label>
            <textarea className="modal-edit-bio" value={tempData.bio} onChange={(e) => setTempData({ ...tempData, bio: e.target.value })} />

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
            <h2 className="modal-title">Hapus Artikel?</h2>
            <p className="modal-subtitle">Tindakan ini permanen.</p>
            <div className="modal-buttons">
              <button className="btn-batal" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn-konfirmasi-hapus" onClick={confirmDelete}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;