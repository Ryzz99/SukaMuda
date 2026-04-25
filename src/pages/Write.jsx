import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './Write.css';
import axios from '../utils/axiosConfig'; 
import { useQueryClient } from '@tanstack/react-query';

const categories = [
    { slug: 'school', label: 'School' },
    { slug: 'college', label: 'College' },
    { slug: 'general', label: 'General' },
    { slug: 'style', label: 'Style' },
    { slug: 'culinary', label: 'Culinary' },
    { slug: 'traveling', label: 'Traveling' },
    { slug: 'sport', label: 'Sport & E-Sport' },
    { slug: 'music', label: 'Music & Film' },
    { slug: 'otomotif', label: 'Otomotif' },
    { slug: 'science', label: 'Science' },
    { slug: 'health', label: 'Health' },
    { slug: 'tech', label: 'Tech' },
    { slug: 'podcast', label: 'Podcast' }
];

const initialState = {
  title: "",
  category: "",
  teaser: "",
  tags: "",
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

function Write() {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("publish");
  const [form, dispatch] = useReducer(formReducer, initialState);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize Quill Editor
  useEffect(() => {
    if (quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Tulis isi berita di sini...",
      modules: {
        toolbar: {
          container: "#quill-toolbar",
          handlers: {
            undo() { this.quill.history.undo(); },
            redo() { this.quill.history.redo(); },
          },
        },
        history: { delay: 1000, maxStack: 100 },
      },
    });
  }, []);

  const handleInputChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Prevent scroll jump when selecting category
  const handleCategoryChange = (e) => {
    const currentScrollY = window.scrollY;
    handleInputChange('category', e.target.value);
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollY);
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const processFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Ukuran file maksimal 5MB." }));
      return;
    }
    setThumbnailFile(file);
    setErrors(prev => ({ ...prev, image: null }));
    const reader = new FileReader();
    reader.onload = (event) => setThumbnailPreview(event.target?.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.category) newErrors.category = "Kategori wajib dipilih.";
    if (!form.title.trim()) newErrors.title = "Judul tidak boleh kosong.";
    if (!thumbnailFile) newErrors.image = "Thumbnail wajib diunggah (Rasio 16:9 disarankan).";
    
    // Only validate content for publish, not draft
    if (modalType === 'publish') {
      const content = quillRef.current?.root?.innerHTML || "";
      if (!content || content === '<p><br></p>') {
        newErrors.content = "Isi berita tidak boleh kosong.";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = async () => {
    if (!validateForm()) {
      setShowModal(false);
      return;
    }

    setLoading(true);
    const contentHtml = quillRef.current?.root?.innerHTML || "";

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('category', form.category);
    formData.append('content', contentHtml);
    formData.append('image', thumbnailFile);
    formData.append('summary', form.teaser);
    formData.append('tags', form.tags);
    formData.append('status', modalType === 'draft' ? 'draft' : 'published');

    try {
      const response = await axios.post('/api/articles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201 || response.status === 200) {
        // Invalidate query cache to refresh articles list
        queryClient.invalidateQueries(['publicArticles']);
        queryClient.invalidateQueries(['userArticles']);
        
        navigate(modalType === 'draft' ? "/profile" : "/write-success");
      }
    } catch (error) {
      console.error("Gagal kirim ke database:", error.response?.data);
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
        const formattedErrors = {};
        for (let key in apiErrors) {
          formattedErrors[key] = apiErrors[key][0];
        }
        setErrors(formattedErrors);
      } else {
        alert("Gagal mengirim: " + (error.response?.data?.message || "Cek koneksi/login"));
      }
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <div className="page menulis-form-page">
      <main className="content">
        <section className="write-form">
          
          {/* Header */}
          <div className="write-header">
            <button className="back-link-btn" onClick={() => navigate('/profile')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h2 className="write-heading">WRITE</h2>
            <div className="header-status-badge">
              <span className="status-dot"></span> Draft
            </div>
          </div>

          {/* Category Select */}
          <div className={`form-row ${errors.category ? 'has-error' : ''}`}>
            <label className="form-label">Kategori</label>
            <select
              className="form-select"
              value={form.category}
              onChange={handleCategoryChange}
            >
              <option value="" disabled>Pilih Kategori Berita</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>{item.label}</option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          {/* Title Input */}
          <div className={`form-row ${errors.title ? 'has-error' : ''}`}>
            <label className="form-label">Judul Berita</label>
            <input
              className="form-input"
              placeholder="Tulis judul yang menarik perhatian..."
              value={form.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              maxLength={150}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Thumbnail Upload */}
          <div className={`form-row form-row-thumbnail ${errors.image ? 'has-error' : ''}`}>
            <label className="form-label">Thumbnail</label>
            <div 
              className="thumbnail-dropzone"
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/png, image/jpg, image/webp"
                onChange={handleThumbnailChange}
                style={{ display: 'none' }}
              />
              {thumbnailPreview ? (
                <div className="preview-container">
                  <img className="thumbnail-preview" src={thumbnailPreview} alt="Preview" />
                  <div className="preview-overlay">
                    <span>Ganti Gambar</span>
                  </div>
                </div>
              ) : (
                <div className="dropzone-placeholder">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p>Klik atau seret gambar ke sini</p>
                  <span>Rasio 16:9 Direkomendasikan</span>
                </div>
              )}
            </div>
            {errors.image && <span className="error-text error-text-img">{errors.image}</span>}
          </div>

          {/* Quill Editor */}
          <div className={`editor-wrapper ${errors.content ? 'has-error' : ''}`}>
            <div className="editor-label-row">
              <label className="form-label" style={{ margin: 0 }}>Isi Berita</label>
            </div>
            <div id="quill-toolbar" className="editor-toolbar">
              <button className="ql-undo" type="button">
                <svg viewBox="0 0 18 18">
                  <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon>
                  <path className="ql-stroke" d="M6,10a4,4,0,1,1,1.5,3.1"></path>
                </svg>
              </button>
              <button className="ql-redo" type="button">
                <svg viewBox="0 0 18 18">
                  <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon>
                  <path className="ql-stroke" d="M12,10a4,4,0,1,0-1.5,3.1"></path>
                </svg>
              </button>
              <span className="ql-divider"></span>
              <button className="ql-bold" type="button" />
              <button className="ql-italic" type="button" />
              <button className="ql-strike" type="button" />
              <button className="ql-underline" type="button" />
              <span className="ql-divider"></span>
              <button className="ql-blockquote" type="button" />
              <button className="ql-list" value="ordered" type="button" />
              <button className="ql-list" value="bullet" type="button" />
              <span className="ql-divider"></span>
              <button className="ql-align" value="" type="button" />
              <button className="ql-align" value="center" type="button" />
              <button className="ql-align" value="right" type="button" />
              <span className="ql-divider"></span>
              <button className="ql-link" type="button" />
              <button className="ql-image" type="button" />
            </div>
            <div ref={editorRef} className="editor-body" />
            {errors.content && <span className="error-text">{errors.content}</span>}
          </div>

          {/* Teaser Input */}
          <div className="form-row">
            <label className="form-label">Ringkasan (Teaser)</label>
            <input
              className="form-input"
              placeholder="Tulis satu atau dua kalimat pengantar..."
              value={form.teaser}
              onChange={(e) => handleInputChange('teaser', e.target.value)}
              maxLength={300}
            />
          </div>

          {/* Tags Input */}
          <div className="form-row">
            <label className="form-label">Tag</label>
            <input
              className="form-input"
              placeholder="Contoh: politik, ekonomi, jakarta (pisahkan koma)"
              value={form.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button 
              className="btn-draft" 
              type="button" 
              onClick={() => openModal('draft')}
              disabled={loading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Simpan Draf
            </button>
            <button 
              className="btn-submit" 
              type="button" 
              onClick={() => openModal('publish')}
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading-spinner"></span>
              ) : (
                <>
                  Publikasikan
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </>
              )}
            </button>
          </div>

        </section>
      </main>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              {modalType === 'draft' ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              )}
            </div>
            <h2 className="modal-title">
              {modalType === 'draft' ? 'Simpan sebagai Draf?' : 'Publikasikan Sekarang?'}
            </h2>
            <p className="modal-subtitle">
              {modalType === 'draft' 
                ? "Artikel akan disimpan dan bisa kamu lanjutkan nanti di menu Profil." 
                : "Artikel akan langsung tayang dan bisa dilihat oleh seluruh pembaca."
              }
            </p>
            <div className="modal-buttons">
              <button className="btn-batal" onClick={() => setShowModal(false)}>Batal</button>
              <button
                className={`btn-konfirmasi ${modalType === 'draft' ? 'btn-draft-confirm' : 'btn-publish-confirm'}`}
                onClick={handleFinalSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading-spinner light"></span>
                ) : (
                  modalType === 'draft' ? 'Ya, Simpan Draf' : 'Ya, Publikasikan'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Write;