import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './Write.css';
import { categories } from '../data/articles';
import { saveArticle } from '../data/articlesStore';

// 1. Menggabungkan semua state form menjadi satu objek awal
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

  const [showModal, setShowModal] = useState(false);
  const [form, dispatch] = useReducer(formReducer, initialState);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailData, setThumbnailData] = useState(null);

  // 2. Inisialisasi Quill lebih bersih
  useEffect(() => {
    if (quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
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

  // 3. Handler perubahan input form (reusable)
  const handleInputChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  // 4. Handler upload thumbnail
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      setThumbnailData(result);
      setThumbnailPreview(result);
    };
    reader.readAsDataURL(file);
  };

  // 5. Validasi & Submit Logic
  const handleConfirmSubmit = () => {
    const contentHtml = quillRef.current?.root?.innerHTML || "";

    // Validasi sederhana (bisa diganti toast/alert jika ada)
    if (!form.title.trim() || !form.category.trim() || !thumbnailData) {
      alert("Mohon lengkapi Kategori, Judul, dan Thumbnail terlebih dahulu.");
      setShowModal(false);
      return;
    }

    const articleData = {
      id: Date.now(),
      title: form.title.trim(),
      category: form.category.trim(),
      image: thumbnailData,
      content: contentHtml,
      teaser: form.teaser.trim(),
      tags: form.tags.split(",").map((item) => item.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    saveArticle(articleData);
    setShowModal(false);
    navigate("/write-success");
  };

  return (
    <div className="page menulis-form-page">
      <main className="content">
        <section className="write-form">
          
          {/* Header */}
          <div className="write-header">
            <button className="back-link-btn" onClick={() => navigate('/profile')}>
              <span className="back-icon"> ← </span>
            </button>
            <h2 className="write-heading">WRITE</h2>
            <div /> {/* Spacer untuk flexbox centering */}
          </div>

          {/* Category Field */}
          <div className="form-row">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={form.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>{item.label}</option>
              ))}
            </select>
          </div>

          {/* Title Field */}
          <div className="form-row">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              placeholder="Write Here"
              value={form.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>

          {/* Thumbnail Field */}
          <div className="form-row">
            <label className="form-label">Thumbnail</label>
            <div className="thumbnail-input">
              <input
                className="form-input"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {thumbnailPreview && (
                <img className="thumbnail-preview" src={thumbnailPreview} alt="Preview" />
              )}
            </div>
          </div>

          {/* Quill Editor */}
          <div className="editor-wrapper">
            <div id="quill-toolbar" className="editor-toolbar">
              <button className="ql-undo" type="button">
                <svg viewBox="0 0 18 18"><polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon><path className="ql-stroke" d="M6,10a4,4,0,1,1,1.5,3.1"></path></svg>
              </button>
              <button className="ql-redo" type="button">
                <svg viewBox="0 0 18 18"><polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon><path className="ql-stroke" d="M12,10a4,4,0,1,0-1.5,3.1"></path></svg>
              </button>
              <button className="ql-bold" type="button" />
              <button className="ql-italic" type="button" />
              <button className="ql-strike" type="button" />
              <button className="ql-underline" type="button" />
              <button className="ql-blockquote" type="button" />
              <button className="ql-list" value="ordered" type="button" />
              <button className="ql-list" value="bullet" type="button" />
              <button className="ql-align" value="" type="button" />
              <button className="ql-align" value="center" type="button" />
              <button className="ql-align" value="right" type="button" />
              <button className="ql-link" type="button" />
              <button className="ql-image" type="button" />
            </div>
            <div ref={editorRef} className="editor-body" />
          </div>

          {/* Teaser Field (Typo diperbaiki) */}
          <div className="form-row">
            <label className="form-label">Teaser</label>
            <input
              className="form-input"
              placeholder="Write Here"
              value={form.teaser}
              onChange={(e) => handleInputChange('teaser', e.target.value)}
            />
          </div>

          {/* Tags Field */}
          <div className="form-row">
            <label className="form-label">Tag</label>
            <input
              className="form-input"
              placeholder="Pisahkan dengan koma"
              value={form.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button className="btn-draft" type="button">Draft</button>
            <button className="btn-submit" type="button" onClick={() => setShowModal(true)}>
              Kirim
            </button>
          </div>

        </section>
      </main>

      {/* Modal Konfirmasi */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Kirim artikel ini sekarang?</h2>
            <p className="modal-subtitle">“Pastikan tulisanmu sudah rapi sebelum dipublikasikan.”</p>
            <div className="modal-buttons">
              <button className="btn-batal" onClick={() => setShowModal(false)}>Batal</button>
              <button
                className="btn-konfirmasi-hapus"
                style={{ backgroundColor: '#007bff' }}
                onClick={handleConfirmSubmit}
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Write;