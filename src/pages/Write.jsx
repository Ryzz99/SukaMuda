import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './Write.css';
import axios from '../utils/axiosConfig';
import { useQueryClient } from '@tanstack/react-query';

const categories = [
  { slug: 'school',    label: 'School' },
  { slug: 'college',   label: 'College' },
  { slug: 'general',   label: 'General' },
  { slug: 'style',     label: 'Style' },
  { slug: 'culinary',  label: 'Culinary' },
  { slug: 'traveling', label: 'Traveling' },
  { slug: 'sport',     label: 'Sport & E-Sport' },
  { slug: 'music',     label: 'Music & Film' },
  { slug: 'otomotif',  label: 'Otomotif' },
  { slug: 'science',   label: 'Science' },
  { slug: 'health',    label: 'Health' },
  { slug: 'tech',      label: 'Tech' },
];

const initialState = {
  title:            "",
  category:         "",
  teaser:           "",
  tags:             "",
  thumbnailCaption: "", // ← ditambahkan dari kode 1
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
  const navigate     = useNavigate();
  const location     = useLocation();
  const editorRef    = useRef(null);
  const quillRef     = useRef(null);
  const fileInputRef = useRef(null);
  const queryClient  = useQueryClient();

  const editData = location.state?.draft;

  const [showModal, setShowModal]               = useState(false);
  const [modalType, setModalType]               = useState("publish");
  const [form, dispatch]                        = useReducer(formReducer, initialState);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile]       = useState(null);
  const [loading, setLoading]                   = useState(false);
  const [errors, setErrors]                     = useState({});

  useEffect(() => {
    if (!quillRef.current) {
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
    }

    if (editData) {
      dispatch({ type: 'SET_FIELD', field: 'title',            value: editData.title    || "" });
      dispatch({ type: 'SET_FIELD', field: 'category',         value: editData.category || "" });
      dispatch({ type: 'SET_FIELD', field: 'teaser',           value: editData.summary || editData.teaser || "" });
      dispatch({ type: 'SET_FIELD', field: 'tags',             value: editData.tags    || "" });
      dispatch({ type: 'SET_FIELD', field: 'thumbnailCaption', value: editData.thumbnailCaption || "" }); // ← dari kode 1

      if (editData.image) setThumbnailPreview(editData.image);
      if (quillRef.current && editData.content) {
        quillRef.current.root.innerHTML = editData.content;
      }
    }
  }, [editData]);

  const handleInputChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleCategoryChange = (e) => {
    const currentScrollY = window.scrollY;
    handleInputChange('category', e.target.value);
    requestAnimationFrame(() => { window.scrollTo(0, currentScrollY); });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
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
    if (!thumbnailFile && !thumbnailPreview) newErrors.image = "Thumbnail wajib diunggah.";
    if (modalType === 'publish') {
      const content = quillRef.current?.root?.innerHTML || "";
      if (!content || content === '<p><br></p>') newErrors.content = "Isi berita tidak boleh kosong.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = async () => {
    if (!validateForm()) { setShowModal(false); return; }

    setLoading(true);
    const contentHtml = quillRef.current?.root?.innerHTML || "";
    const formData    = new FormData();

    formData.append('title',            form.title);
    formData.append('category',         form.category);
    formData.append('content',          contentHtml);
    formData.append('summary',          form.teaser);
    formData.append('tags',             form.tags);
    formData.append('thumbnailCaption', form.thumbnailCaption); // ← dari kode 1
    formData.append('status',           modalType === 'draft' ? 'draft' : 'review');
    if (thumbnailFile) formData.append('image', thumbnailFile);
    if (editData?.id) {
      formData.append('id', editData.id);
      formData.append('_method', 'PUT');
    }

    try {
      const url      = editData?.id ? `/api/articles/${editData.id}` : '/api/articles';
      const response = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201 || response.status === 200) {
        queryClient.invalidateQueries(['publicArticles']);
        queryClient.invalidateQueries(['userArticles']);
        navigate(modalType === 'draft' ? "/profile" : "/write-success");
      }
    } catch (error) {
      console.error("Gagal kirim ke database:", error.response?.data);
      if (error.response?.data?.errors) {
        const apiErrors       = error.response.data.errors;
        const formattedErrors = {};
        for (let key in apiErrors) formattedErrors[key] = apiErrors[key][0];
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
              <span className="back-icon"> ← </span>
            </button>
            <h2 className="write-heading">WRITE</h2>
            <div />
          </div>

          {/* Category */}
          <div className="form-row">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={form.category}
              onChange={handleCategoryChange}
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>{item.label}</option>
              ))}
            </select>
            {errors.category && <small style={{ color: 'red', marginTop: 4, display: 'block' }}>{errors.category}</small>}
          </div>

          {/* Title */}
          <div className="form-row">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              placeholder="Write Here"
              value={form.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
            {errors.title && <small style={{ color: 'red', marginTop: 4, display: 'block' }}>{errors.title}</small>}
          </div>

          {/* Thumbnail */}
          <div className="form-row">
            <label className="form-label">Thumbnail</label>
            <div className="thumbnail-input">
              <input
                ref={fileInputRef}
                className="form-input"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {thumbnailPreview && (
                <img className="thumbnail-preview" src={thumbnailPreview} alt="Preview" />
              )}
            </div>
            {errors.image && <small style={{ color: 'red', marginTop: 4, display: 'block' }}>{errors.image}</small>}
          </div>

          {/* Caption Thumbnail — ditambahkan dari kode 1 */}
          <div className="form-row">
            <label className="form-label">Caption Thumbnail</label>
            <div>
              <input
                className="form-input"
                placeholder="Tulis caption gambar thumbnail"
                value={form.thumbnailCaption}
                onChange={(e) => handleInputChange('thumbnailCaption', e.target.value)}
              />
              <p className="thumbnail-caption-hint">Caption ini akan tampil di bawah gambar utama artikel.</p>
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
              <button className="ql-bold"       type="button" />
              <button className="ql-italic"     type="button" />
              <button className="ql-strike"     type="button" />
              <button className="ql-underline"  type="button" />
              <button className="ql-blockquote" type="button" />
              <button className="ql-list" value="ordered" type="button" />
              <button className="ql-list" value="bullet"  type="button" />
              <button className="ql-align" value=""       type="button" />
              <button className="ql-align" value="center" type="button" />
              <button className="ql-align" value="right"  type="button" />
              <button className="ql-link"  type="button" />
              <button className="ql-image" type="button" />
            </div>
            <div ref={editorRef} className="editor-body" />
            {errors.content && <small style={{ color: 'red', marginTop: 4, display: 'block' }}>{errors.content}</small>}
          </div>

          {/* Description */}
          <div className="form-row">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              placeholder="Write Here"
              value={form.teaser}
              onChange={(e) => handleInputChange('teaser', e.target.value)}
              maxLength={300}
            />
          </div>

          {/* Tags */}
          <div className="form-row">
            <label className="form-label">Tag</label>
            <input
              className="form-input"
              placeholder="Pisahkan dengan koma"
              value={form.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="form-actions">
            <button className="btn-draft"  type="button" onClick={() => openModal('draft')}   disabled={loading}>Draft</button>
            <button className="btn-submit" type="button" onClick={() => openModal('publish')} disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>

        </section>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">
              {modalType === 'draft' ? 'Simpan sebagai Draft?' : 'Kirim artikel untuk ditinjau admin?'}
            </h2>
            <p className="modal-subtitle">
              {modalType === 'draft'
                ? 'Artikel akan disimpan dan bisa kamu lanjutkan nanti.'
                : '"Artikel akan masuk antrian review sebelum dipublikasikan."'}
            </p>
            <div className="modal-buttons">
              <button className="btn-batal" onClick={() => setShowModal(false)}>Batal</button>
              <button
                className="btn-konfirmasi-hapus"
                style={{ backgroundColor: modalType === 'draft' ? '#555' : '#007bff' }}
                onClick={handleFinalSubmit}
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : modalType === 'draft' ? 'Simpan Draft' : 'Kirim ke Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Write;