import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  IoPencilSharp,
  IoHeart,
  IoTrashOutline,
  IoCloseCircleOutline,
  IoDocumentTextOutline,
  IoTimeOutline,
  IoFileTrayOutline,
} from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import axios, { ensureCsrfToken } from '../utils/axiosConfig';

/* ─────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────── */
const daftarProfession = ['Content Writer', 'Blogger', 'Freelance Writer', 'Contributor', 'Other'];
const pilihanInterest  = ['News', 'Lifestyle', 'Music & Film', 'Health', 'Hobby', 'Science', 'Sport', 'Gadget', 'Automotive'];

/* ─────────────────────────────────────────────
   STYLES  (injected once)
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

  :root {
    --bg: #f5f5f0;
    --white: #ffffff;
    --black: #111111;
    --border: #e0e0d8;
    --text-1: #111111;
    --text-2: #555550;
    --text-3: #999990;
    --accent: #1a1a1a;
    --accent-light: #f0f0eb;
    --danger: #dc2626;
    --radius: 12px;
    --shadow: 0 2px 12px rgba(0,0,0,.07);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pp-page {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    color: var(--text-1);
  }

  /* ── HEADER ── */
  .pp-header {
    background: var(--white);
    border-bottom: 1px solid var(--border);
  }
  .pp-banner {
    height: 140px;
    background: linear-gradient(135deg, #d4d4cc 0%, #c8c8be 100%);
  }
  .pp-info-row {
    max-width: 860px;
    margin: 0 auto;
    padding: 0 24px 28px;
    display: flex;
    align-items: flex-start;
    gap: 24px;
    position: relative;
  }
  .pp-avatar-wrap {
    position: relative;
    margin-top: -52px;
    flex-shrink: 0;
  }
  .pp-avatar {
    width: 104px;
    height: 104px;
    border-radius: 50%;
    background: var(--black);
    border: 4px solid var(--white);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: 'DM Serif Display', serif;
    font-size: 36px;
    color: var(--white);
    background-size: cover;
    background-position: center;
  }
  .pp-avatar-edit {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 26px;
    height: 26px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: var(--shadow);
  }
  .pp-meta {
    flex: 1;
    padding-top: 14px;
  }
  .pp-name-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }
  .pp-name {
    font-family: 'DM Serif Display', serif;
    font-size: 26px;
    font-weight: 400;
    color: var(--text-1);
  }
  .pp-edit-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-3);
    display: flex;
    align-items: center;
    padding: 2px;
    transition: color .15s;
  }
  .pp-edit-btn:hover { color: var(--text-1); }
  .pp-bio  { font-size: 14px; color: var(--text-2); margin-bottom: 4px; }
  .pp-prof { font-size: 14px; color: var(--text-2); margin-bottom: 10px; }
  .pp-pills { display: flex; flex-wrap: wrap; gap: 6px; }
  .pp-pill {
    font-size: 12px;
    font-weight: 600;
    background: var(--black);
    color: var(--white);
    padding: 4px 12px;
    border-radius: 999px;
    letter-spacing: .02em;
  }

  /* ── COMPLETION ── */
  .pp-completion {
    max-width: 860px;
    margin: 16px auto 0;
    padding: 0 24px;
  }
  .pp-cw {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .pp-cw-text h4 { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
  .pp-cw-text p  { font-size: 12px; color: var(--text-3); }
  .pp-cw-bar { flex: 1; height: 6px; background: var(--border); border-radius: 99px; overflow: hidden; }
  .pp-cw-fill { height: 100%; background: var(--black); border-radius: 99px; transition: width .4s ease; }
  .pp-cw-pct { font-size: 13px; font-weight: 700; white-space: nowrap; }

  /* ── TABS ── */
  .pp-tabs {
    max-width: 860px;
    margin: 20px auto 0;
    padding: 0 24px;
    display: flex;
    align-items: center;
    gap: 0;
    border-bottom: 1px solid var(--border);
  }
  .pp-tab {
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-3);
    padding: 10px 20px;
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color .15s;
  }
  .pp-tab::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 2px;
    background: var(--black);
    border-radius: 99px;
    opacity: 0;
    transition: opacity .15s;
  }
  .pp-tab.active { color: var(--text-1); }
  .pp-tab.active::after { opacity: 1; }
  .pp-tab-sep { color: var(--border); font-size: 18px; user-select: none; }

  /* ── CONTENT ── */
  .pp-content {
    max-width: 860px;
    margin: 24px auto 60px;
    padding: 0 24px;
  }

  /* ── ARTICLE CARD ── */
  .pp-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    display: flex;
    gap: 0;
    overflow: hidden;
    margin-bottom: 14px;
    transition: box-shadow .2s;
  }
  .pp-card:hover { box-shadow: var(--shadow); }
  .pp-card-thumb {
    width: 130px;
    flex-shrink: 0;
    background: #e8e8e0;
    position: relative;
    min-height: 110px;
  }
  .pp-card-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pp-card-cat {
    position: absolute;
    top: 8px; left: 8px;
    font-size: 10px;
    font-weight: 700;
    background: #2563eb;
    color: #fff;
    padding: 3px 8px;
    border-radius: 4px;
    letter-spacing: .04em;
    text-transform: uppercase;
  }
  .pp-card-badge {
    position: absolute;
    top: 8px; left: 8px;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: #fff;
  }
  .badge-pending  { background: #d97706; }
  .badge-rejected { background: var(--danger); }
  .badge-draft    { background: #6b7280; }

  .pp-card-body {
    flex: 1;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .pp-card-author { font-size: 13px; color: var(--text-2); margin-bottom: 2px; }
  .pp-card-submeta { font-size: 12px; color: var(--text-3); margin-bottom: 6px; }
  .pp-card-title  { font-family: 'DM Serif Display', serif; font-size: 17px; font-weight: 400; line-height: 1.35; color: var(--text-1); }

  .pp-card-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
  }
  .pp-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 14px;
    transition: opacity .15s;
  }
  .pp-btn:hover { opacity: .8; }
  .pp-btn-primary { background: var(--black); color: var(--white); }
  .pp-btn-ghost   { background: transparent; border: 1px solid var(--border); color: var(--text-2); }
  .pp-btn-danger  { background: var(--danger); color: var(--white); }
  .pp-btn-link    { background: transparent; color: var(--text-1); font-weight: 700; padding: 6px 0; }
  .pp-btn:disabled { opacity: .5; cursor: not-allowed; }

  .pp-trash { background: none; border: none; cursor: pointer; color: var(--text-3); display: flex; align-items: center; margin-left: auto; transition: color .15s; }
  .pp-trash:hover { color: var(--danger); }

  /* ── EMPTY ── */
  .pp-empty {
    text-align: center;
    padding: 60px 0;
    color: var(--text-3);
    font-size: 14px;
  }
  .pp-empty svg { margin-bottom: 10px; opacity: .35; }

  /* ── ERROR ── */
  .pp-error {
    max-width: 860px;
    margin: 16px auto 0;
    padding: 0 24px;
  }
  .pp-error-inner {
    background: #fef2f2;
    color: var(--danger);
    padding: 12px 16px;
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 600;
  }

  /* ── MODAL ── */
  .pp-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 20px;
  }
  .pp-modal {
    background: var(--white);
    border-radius: 16px;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,.18);
  }
  .pp-modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 0;
    margin-bottom: 18px;
  }
  .pp-modal-head h2 { font-family: 'DM Serif Display', serif; font-size: 20px; font-weight: 400; }
  .pp-modal-close { background: none; border: none; cursor: pointer; color: var(--text-3); display: flex; }
  .pp-modal-body { padding: 0 24px; }
  .pp-modal-foot { padding: 20px 24px 24px; display: flex; justify-content: flex-end; gap: 10px; }

  .pp-field { margin-bottom: 16px; }
  .pp-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--text-2); }
  .pp-input, .pp-select {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text-1);
    background: var(--white);
    outline: none;
    transition: border-color .15s;
  }
  .pp-input:focus, .pp-select:focus { border-color: var(--black); }

  .pp-interest-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .pp-interest-chip {
    font-size: 12px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 999px;
    border: 1.5px solid var(--border);
    cursor: pointer;
    transition: all .15s;
    background: var(--white);
    color: var(--text-2);
  }
  .pp-interest-chip.active {
    background: var(--black);
    color: var(--white);
    border-color: var(--black);
  }

  /* ── DELETE MODAL ── */
  .pp-del-modal {
    background: var(--white);
    border-radius: 16px;
    width: 100%;
    max-width: 340px;
    padding: 32px 28px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,.18);
  }
  .pp-del-icon { color: var(--danger); margin-bottom: 14px; }
  .pp-del-modal h2 { font-family: 'DM Serif Display', serif; font-size: 20px; font-weight: 400; margin-bottom: 8px; }
  .pp-del-modal p  { font-size: 13px; color: var(--text-3); margin-bottom: 24px; }
  .pp-del-btns { display: flex; gap: 10px; justify-content: center; }

  /* ── LOADING ── */
  .pp-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60vh;
    font-size: 14px;
    color: var(--text-3);
    font-family: 'DM Sans', sans-serif;
  }
`;

function useStyles(css) {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const Profile = () => {
  useStyles(CSS);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading]               = useState(true);
  const [activeTab, setActiveTab]           = useState('Posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError]                   = useState(null);

  const [userData, setUserData] = useState({
    name: '', email: '', bio: '', profession: 'Content Writer',
    schoolName: '', interest: [], avatar: '',
  });

  const [posts, setPosts]                     = useState([]);
  const [drafts, setDrafts]                   = useState([]);
  const [pendingArticles, setPendingArticles] = useState([]);
  const [rejectedArticles, setRejectedArticles] = useState([]);
  const [favorites, setFavorites]             = useState([]);

  const [tempData, setTempData]   = useState(userData);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving]       = useState(false);

  const [deleteTarget, setDeleteTarget] = useState({ id: null, type: null, title: '' });
  const [deleting, setDeleting]         = useState(false);

  /* ── completion ── */
  const profileData = useMemo(() => {
    const checks = [
      { done: Boolean(String(userData.profession || '').trim()) },
      { done: Boolean(String(userData.schoolName || '').trim()) },
      { done: Array.isArray(userData.interest) && userData.interest.length > 0 },
    ];
    const completed = checks.filter(c => c.done).length;
    return {
      percent: Math.round((completed / checks.length) * 100),
      isComplete: completed === checks.length,
    };
  }, [userData]);

  /* ── fetch ── */
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await axios.get('/api/profile');
        const d = res.data?.data;
        if (!d || !active) return;

        setUserData({
          name:       d.name       || 'User',
          email:      d.email      || '',
          bio:        d.bio        || '',
          profession: d.profession || 'Content Writer',
          schoolName: d.schoolName || '',
          interest:   Array.isArray(d.interests) ? d.interests : [],
          avatar:     d.avatar     || '',
        });

        const safe = arr => Array.isArray(arr) ? arr : [];
        setPosts(safe(d.posts));
        setDrafts(safe(d.drafts));
        setPendingArticles(safe(d.pending));
        setRejectedArticles(safe(d.rejected));
        setFavorites(safe(d.favorites));
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'Gagal mengambil data profil.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!loading && location.state?.openEditProfile) {
      setIsEditModalOpen(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [loading, location, navigate]);

  /* ── handlers ── */
  const openModal = () => {
    setTempData(userData);
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsEditModalOpen(true);
  };

  const toggleInterest = it => {
    const cur = Array.isArray(tempData.interest) ? tempData.interest : [];
    setTempData({
      ...tempData,
      interest: cur.includes(it) ? cur.filter(i => i !== it) : [...cur, it],
    });
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) { alert('Format file tidak didukung. Gunakan JPG/PNG/WEBP.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Ukuran file maksimal 5 MB.'); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveProfile = async () => {
    if (!tempData.name?.trim()) { alert('Nama tidak boleh kosong.'); return; }
    setSaving(true);
    try {
      await ensureCsrfToken();
      const fd = new FormData();
      fd.append('name',       tempData.name || '');
      fd.append('bio',        tempData.bio  || '');
      fd.append('profession', tempData.profession || '');
      fd.append('schoolName', tempData.schoolName || '');
      (Array.isArray(tempData.interest) ? tempData.interest : [])
        .forEach(item => fd.append('interests[]', item));
      if (avatarFile) fd.append('avatarFile', avatarFile);

      const res = await axios.post('/api/profile', fd);
      const sd  = res.data?.data;
      if (sd) {
        setUserData({
          name:       sd.name       || '',
          email:      sd.email      || '',
          bio:        sd.bio        || '',
          profession: sd.profession || '',
          schoolName: sd.schoolName || '',
          interest:   Array.isArray(sd.interests) ? sd.interests : [],
          avatar:     sd.avatar     || '',
        });
        if (refreshUser) await refreshUser();
      }
      setIsEditModalOpen(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan profil.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!deleteTarget.id) return;
    setDeleting(true);
    try {
      await ensureCsrfToken();
      await axios.delete(`/api/articles/${deleteTarget.id}`);
      const rm = (list, id) => list.filter(x => x.id !== id);
      const { id, type } = deleteTarget;
      if (type === 'post')     setPosts(p => rm(p, id));
      if (type === 'draft')    setDrafts(p => rm(p, id));
      if (type === 'pending')  setPendingArticles(p => rm(p, id));
      if (type === 'rejected') setRejectedArticles(p => rm(p, id));
      if (type === 'favorite') setFavorites(p => rm(p, id));
      setDeleteTarget({ id: null, type: null, title: '' });
    } catch {
      alert('Gagal menghapus artikel.');
    } finally {
      setDeleting(false);
    }
  };

  const clearDelete = () => !deleting && setDeleteTarget({ id: null, type: null, title: '' });

  /* ── loading ── */
  if (loading) return <div className="pp-loading">Memuat profil…</div>;

  const avatarBg = avatarPreview || userData.avatar;
  const initials = userData.name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="pp-page">

      {/* ── HEADER ── */}
      <div className="pp-header">
        <div className="pp-banner" />
        <div className="pp-info-row">
          <div className="pp-avatar-wrap">
            <div
              className="pp-avatar"
              style={avatarBg ? { backgroundImage: `url(${avatarBg})` } : {}}
              onClick={openModal}
            >
              {!avatarBg && initials}
            </div>
            <div className="pp-avatar-edit" onClick={openModal}>
              <IoPencilSharp size={12} />
            </div>
          </div>

          <div className="pp-meta">
            <div className="pp-name-row">
              <h1 className="pp-name">{userData.name}</h1>
              <button className="pp-edit-btn" onClick={openModal} aria-label="Edit profil">
                <IoPencilSharp size={14} />
              </button>
            </div>
            <p className="pp-bio">{userData.bio || 'Belum ada bio.'}</p>
            <p className="pp-prof">{userData.profession}{userData.schoolName ? ` · ${userData.schoolName}` : ''}</p>
            {Array.isArray(userData.interest) && userData.interest.length > 0 && (
              <div className="pp-pills">
                {userData.interest.map((it, i) => (
                  <span key={i} className="pp-pill">{it} +</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── ERROR ── */}
      {error && (
        <div className="pp-error">
          <div className="pp-error-inner">⚠️ {error}</div>
        </div>
      )}

      {/* ── COMPLETION ── */}
      {!profileData.isComplete && (
        <div className="pp-completion">
          <div className="pp-cw">
            <div className="pp-cw-text">
              <h4>Lengkapi Profil</h4>
              <p>Tingkatkan kredibilitasmu</p>
            </div>
            <div className="pp-cw-bar">
              <div className="pp-cw-fill" style={{ width: `${profileData.percent}%` }} />
            </div>
            <div className="pp-cw-pct">{profileData.percent}%</div>
          </div>
        </div>
      )}

      {/* ── TABS ── */}
      <div className="pp-tabs">
        {[
          { id: 'Posts',    label: 'Posts',    icon: <IoDocumentTextOutline size={15} /> },
          { id: 'Draft',    label: `Draft (${drafts.length})`, icon: <IoFileTrayOutline size={15} /> },
          { id: 'Favorite', label: 'Favorite', icon: <IoHeart size={14} style={{ color: '#ef4444' }} /> },
        ].map((tab, i, arr) => (
          <React.Fragment key={tab.id}>
            <button
              className={`pp-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
            {i < arr.length - 1 && <span className="pp-tab-sep">|</span>}
          </React.Fragment>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="pp-content">
        {activeTab === 'Posts' && (
          posts.length > 0
            ? posts.map(p => (
                <ArticleCard key={p.id} data={p} type="post" userName={userData.name}
                  onDelete={() => setDeleteTarget({ id: p.id, type: 'post', title: p.title })} />
              ))
            : <EmptyState message="Belum ada artikel yang diterbitkan." />
        )}

        {/*  */}

        {activeTab === 'Draft' && (
          drafts.length > 0
            ? drafts.map(d => (
                <ArticleCard key={d.id} data={d} type="draft" userName={userData.name}
                  onDelete={() => setDeleteTarget({ id: d.id, type: 'draft', title: d.title })}
                  onEdit={() => navigate('/write', { state: { draft: d } })} />
              ))
            : <EmptyState message="Draft kosong." />
        )}

        {activeTab === 'Favorite' && (
          favorites.length > 0
            ? favorites.map(fav => (
                <ArticleCard key={fav.id} data={fav} type="favorite" userName={fav.author?.name} />
              ))
            : <EmptyState message="Belum ada artikel yang disukai." />
        )}
      </div>

      {/* ── MODAL EDIT ── */}
      {isEditModalOpen && (
        <div className="pp-overlay" onClick={() => !saving && setIsEditModalOpen(false)}>
          <div className="pp-modal" onClick={e => e.stopPropagation()}>
            <div className="pp-modal-head">
              <h2>Edit Profil</h2>
              <button className="pp-modal-close" onClick={() => !saving && setIsEditModalOpen(false)}>
                <IoCloseCircleOutline size={24} />
              </button>
            </div>
            <div className="pp-modal-body">
              <div className="pp-field">
                <label className="pp-label">Nama Lengkap</label>
                <input className="pp-input" value={tempData.name}
                  onChange={e => setTempData({ ...tempData, name: e.target.value })} />
              </div>
              <div className="pp-field">
                <label className="pp-label">Bio</label>
                <input className="pp-input" value={tempData.bio}
                  onChange={e => setTempData({ ...tempData, bio: e.target.value })} />
              </div>
              <div className="pp-field">
                <label className="pp-label">Profesi</label>
                <select className="pp-select" value={tempData.profession}
                  onChange={e => setTempData({ ...tempData, profession: e.target.value })}>
                  {daftarProfession.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="pp-field">
                <label className="pp-label">Minat</label>
                <div className="pp-interest-grid">
                  {pilihanInterest.map(it => (
                    <div
                      key={it}
                      className={`pp-interest-chip ${(tempData.interest || []).includes(it) ? 'active' : ''}`}
                      onClick={() => toggleInterest(it)}
                    >
                      {it} {(tempData.interest || []).includes(it) ? '✓' : '+'}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pp-field">
                <label className="pp-label">Ganti Foto Profil</label>
                <input type="file" className="pp-input" accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange} />
                {avatarFile && (
                  <small style={{ color: 'green', marginTop: 5, display: 'block' }}>
                    {avatarFile.name}
                  </small>
                )}
              </div>
            </div>
            <div className="pp-modal-foot">
              <button className="pp-btn pp-btn-ghost" onClick={() => !saving && setIsEditModalOpen(false)}>
                Batal
              </button>
              <button className="pp-btn pp-btn-primary" onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Menyimpan…' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DELETE ── */}
      {deleteTarget.id && (
        <div className="pp-overlay" onClick={clearDelete}>
          <div className="pp-del-modal" onClick={e => e.stopPropagation()}>
            <div className="pp-del-icon"><IoTrashOutline size={40} /></div>
            <h2>Hapus Artikel?</h2>
            <p>"{deleteTarget.title}" akan dihapus permanen dan tidak dapat dikembalikan.</p>
            <div className="pp-del-btns">
              <button className="pp-btn pp-btn-ghost" onClick={clearDelete}>Batal</button>
              <button className="pp-btn pp-btn-danger" onClick={handleDeleteArticle} disabled={deleting}>
                {deleting ? 'Menghapus…' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   SUB COMPONENTS
───────────────────────────────────────────── */
const ArticleCard = ({ data, type, userName, onDelete, onEdit }) => {
  const date = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    : '-';

  return (
    <div className="pp-card">
      <div className="pp-card-thumb">
        {data.image
          ? <img src={data.image} alt={data.title} loading="lazy" />
          : null}
        {type === 'pending'  && <span className="pp-card-badge badge-pending">Review</span>}
        {type === 'rejected' && <span className="pp-card-badge badge-rejected">Revisi</span>}
        {type === 'draft'    && <span className="pp-card-badge badge-draft">Draft</span>}
        {type === 'post'     && data.category && <span className="pp-card-cat">{data.category}</span>}
        {type === 'favorite' && data.category && <span className="pp-card-cat">{data.category}</span>}
      </div>
      <div className="pp-card-body">
        <div>
          {userName && <p className="pp-card-author">Nama : {userName}</p>}
          <p className="pp-card-submeta">
            {data.category || 'Umum'} | {date}
          </p>
          <h3 className="pp-card-title">{data.title || 'Tanpa Judul'}</h3>
        </div>
        <div className="pp-card-actions">
          {type !== 'favorite' && type !== 'post' ? (
            <button className="pp-btn pp-btn-primary" onClick={onEdit}>
              {type === 'rejected' ? 'Revisi' : 'Lanjutkan Menulis'}
            </button>
          ) : (
            <Link to={`/article/${data.id}`} className="pp-btn pp-btn-link">
              Selengkapnya &rarr;
            </Link>
          )}
          {onDelete && (
            <button className="pp-trash" onClick={onDelete} aria-label="Hapus artikel">
              <IoTrashOutline size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="pp-empty">
    <IoFileTrayOutline size={40} />
    <p>{message}</p>
  </div>
);

export default Profile;