import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './Write.css';
import axios from '../utils/axiosConfig';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

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
];

const MIN_IMAGE_WIDTH = 800;
const MIN_IMAGE_HEIGHT = 450;

const MAX_IMAGE_WIDTH = 1280;
const MAX_IMAGE_HEIGHT = 720;

const initialState = {
  title: "",
  category: "",
  teaser: "",
  tags: "",
  thumbnailCaption: "",
  audioLink: "",
  videoLink: "",
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
}

const getSpotifyEmbedUrl = (url) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('spotify.com')) return url;
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return `https://open.spotify.com/embed/${parts[0]}/${parts[1]}`;
    }
    return url;
  } catch {
    return url;
  }
};

const getYoutubeEmbedUrl = (url) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    let videoId = '';
    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.slice(1);
    } else if (parsed.pathname.includes('/watch')) {
      videoId = parsed.searchParams.get('v');
    } else if (parsed.pathname.startsWith('/embed/')) {
      videoId = parsed.pathname.split('/embed/')[1];
    } else if (parsed.pathname.startsWith('/shorts/')) {
      videoId = parsed.pathname.split('/shorts/')[1];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
};

const buildPodcastContentHtml = (audioLink, videoLink) => {
  let html = '';
  const spotifyEmbed = getSpotifyEmbedUrl(audioLink);
  const youtubeEmbed = getYoutubeEmbedUrl(videoLink);

  if (audioLink) {
    html += `
      <div class="podcast-embed podcast-audio">
        <iframe
          src="${spotifyEmbed}"
          width="100%"
          height="232"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </div>
    `;
  }

  if (videoLink) {
    html += `
      <div class="podcast-embed podcast-video" style="margin-top:24px;">
        <iframe
          src="${youtubeEmbed}"
          width="100%"
          height="360"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    `;
  }

  if (!html) {
    html = '<p>Podcast akan segera hadir.</p>';
  }

  return html;
};

function Write() {
  const navigate = useNavigate();
  const location = useLocation();
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const editData = location.state?.draft;
  const returnPath = location.state?.returnPath || '/profile';

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("publish");
  const [form, dispatch] = useReducer(formReducer, initialState);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isAdmin = user?.role === 'admin';

  // ─── Proses file thumbnail (tanpa validasi resolusi) ───
  const processFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Ukuran file maksimal 5MB." }));
      return;
    }
    setThumbnailFile(file);
    setErrors(prev => ({ ...prev, image: null }));
    const reader = new FileReader();
    reader.onload = (e) => setThumbnailPreview(e.target?.result);
    reader.readAsDataURL(file);
  };

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

              // ─── Custom image handler: validasi resolusi + ikuti alignment ───
              image() {
                const quill = this.quill;
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();

                input.onchange = () => {
                  const file = input.files?.[0];
                  if (!file) return;

                  if (file.size > 5 * 1024 * 1024) {
                    alert("Ukuran file maksimal 5MB.");
                    return;
                  }

                  // Step 1: baca file jadi base64 dulu
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const base64 = e.target.result;

                    // Step 2: validasi dimensi dari base64 (bukan dari objectURL)
                    const checkImg = new Image();
                    checkImg.onload = () => {
                      const width = checkImg.width;
const height = checkImg.height;

const isTooSmall =
  width < MIN_IMAGE_WIDTH ||
  height < MIN_IMAGE_HEIGHT;

const isTooLarge =
  width > MAX_IMAGE_WIDTH ||
  height > MAX_IMAGE_HEIGHT;

if (isTooSmall || isTooLarge) {
  alert(
    `Ukuran gambar tidak didukung (${width}×${height} px).\n\n` +
    `Minimal: 800×450 px\n` +
    `Maksimal: 1920×1080 px`
  );
  return;
}

                      // Step 3: ambil posisi kursor & alignment sebelum insert
                      const range = quill.getSelection(true);
                      const alignValue = quill.getFormat(range)?.align || null;

                      // Step 4: insert gambar
                      quill.insertEmbed(range.index, 'image', base64, 'user');

                      // Step 5: terapkan alignment ke baris gambar setelah insert
                      quill.setSelection(range.index + 1, 0, 'silent');
                      if (alignValue) {
                        quill.formatLine(range.index, 1, 'align', alignValue, 'user');
                      }
                    };
                    checkImg.src = base64;
                  };
                  reader.readAsDataURL(file);
                };
              },
            },
          },
          history: { delay: 1000, maxStack: 100 },
        },
      });
    }

    if (editData) {
      dispatch({ type: 'SET_FIELD', field: 'title', value: editData.title || "" });
      dispatch({ type: 'SET_FIELD', field: 'category', value: editData.category || "" });
      dispatch({ type: 'SET_FIELD', field: 'teaser', value: editData.summary || editData.teaser || "" });
      dispatch({ type: 'SET_FIELD', field: 'tags', value: editData.tags || "" });
      dispatch({ type: 'SET_FIELD', field: 'thumbnailCaption', value: editData.image_caption || editData.thumbnailCaption || "" });
      dispatch({ type: 'SET_FIELD', field: 'audioLink', value: editData.audio_link || editData.audioLink || "" });
      dispatch({ type: 'SET_FIELD', field: 'videoLink', value: editData.video_link || editData.videoLink || "" });

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

  const availableCategories = categories.filter((item) => item.slug !== 'podcast' || isAdmin || form.category === 'podcast');
  const isPodcast = form.category === 'podcast';

  const handleCategoryChange = (e) => {
    const currentScrollY = window.scrollY;
    handleInputChange('category', e.target.value);
    requestAnimationFrame(() => { window.scrollTo(0, currentScrollY); });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.category) newErrors.category = "Kategori wajib dipilih.";
    if (!form.title.trim()) newErrors.title = "Judul tidak boleh kosong.";

    const tagsArray = form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (tagsArray.length < 2 || tagsArray.length > 10) {
      newErrors.tags = "Tag minimal 2 dan maksimal 10.";
    }

    if (isPodcast) {
      if (modalType === 'publish' && !form.audioLink.trim() && !form.videoLink.trim()) {
        newErrors.audioLink = "Masukkan link Spotify atau YouTube untuk podcast.";
        newErrors.videoLink = "Masukkan link Spotify atau YouTube untuk podcast.";
      }
    } else {
      if (!thumbnailFile && !thumbnailPreview) newErrors.image = "Thumbnail wajib diunggah.";
      if (modalType === 'publish') {
        const content = quillRef.current?.root?.innerHTML || "";
        if (!content || content === '<p><br></p>') newErrors.content = "Isi berita tidak boleh kosong.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = async () => {
    if (!validateForm()) { setShowModal(false); return; }

    setLoading(true);
    const contentHtml = isPodcast
      ? buildPodcastContentHtml(form.audioLink.trim(), form.videoLink.trim())
      : quillRef.current?.root?.innerHTML || "";
    const formData = new FormData();

    formData.append('title', form.title);
    formData.append('category', form.category);
    formData.append('content', contentHtml);
    formData.append('summary', form.teaser);
    formData.append('tags', form.tags);
    formData.append('image_caption', form.thumbnailCaption);
    formData.append('thumbnailCaption', form.thumbnailCaption);
    if (isPodcast) {
      if (form.audioLink.trim()) formData.append('audio_link', form.audioLink.trim());
      if (form.videoLink.trim()) formData.append('video_link', form.videoLink.trim());
    }
    if (modalType === 'draft') {
      formData.append('status', 'draft');
    } else if (!editData?.id) {
      formData.append('status', 'review');
    }
    if (!isPodcast && thumbnailFile) formData.append('image', thumbnailFile);
    if (editData?.id) {
      formData.append('id', editData.id);
      formData.append('_method', 'PUT');
    }

    try {
      const url = editData?.id ? `/api/articles/${editData.id}` : '/api/articles';
      const response = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201 || response.status === 200) {
        queryClient.invalidateQueries(['publicArticles']);
        queryClient.invalidateQueries(['userArticles']);
        if (editData?.id) {
          navigate(returnPath);
        } else {
          navigate(modalType === 'draft' ? "/profile" : "/write-success");
        }
      }
    } catch (error) {
      console.error("Gagal kirim ke database:", error.response?.data);
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors;
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
            <button className="back-link-btn" onClick={() => navigate(returnPath)}>
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
              {availableCategories.map((item) => (
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

          {isPodcast ? (
            <>
              <div className="form-row">
                <label className="form-label">Link Spotify</label>
                <input
                  className="form-input"
                  placeholder="Masukkan link Spotify episode"
                  value={form.audioLink}
                  onChange={(e) => handleInputChange('audioLink', e.target.value)}
                />
                {errors.audioLink && <small style={{ color: 'red', marginTop: 4, display: 'block' }}>{errors.audioLink}</small>}
              </div>

              <div className="form-row">
                <label className="form-label">Link YouTube</label>
                <input
                  className="form-input"
                  placeholder="Masukkan link YouTube video"
                  value={form.videoLink}
                  onChange={(e) => handleInputChange('videoLink', e.target.value)}
                />
                {errors.videoLink && <small style={{ color: 'red', marginTop: 4, display: 'block' }}>{errors.videoLink}</small>}
              </div>

              <div className="form-row">
                <p style={{ color: '#555', margin: '0 0 16px' }}>
                  Podcast hanya bisa dibuat oleh admin. Kamu dapat memasukkan link Spotify audio dan/atau YouTube video.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Thumbnail */}
              <div className="form-row">
                <label className="form-label">Thumbnail</label>

                <div className="thumbnail-upload-row">

                  {/* Input Upload / Box Dasar */}
                  <div
                    className="thumbnail-drop-mini"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file && file.type.startsWith("image/")) {
                        processFile(file);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      className="hidden-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                    <span>Choose File</span>
                  </div>

                  {/* Preview Box */}
                  {thumbnailPreview && (
                    <div className="thumbnail-preview-box">
                      <img
                        className="thumbnail-preview-mini"
                        src={thumbnailPreview}
                        alt="Preview"
                      />
                      <button
                        type="button"
                        className="remove-thumbnail-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setThumbnailPreview(null);
                          setThumbnailFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {errors.image && (
                  <small style={{ color: "red", marginTop: 4, display: "block" }}>
                    {errors.image}
                  </small>
                )}
              </div>

              {/* Caption Thumbnail */}
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
            {errors.content && <small style={{ color: 'red', marginTop: 4, display: 'block' }}>{errors.content}</small>}
          </div>
        </>
      )}

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
            {errors.tags && <small style={{ color: 'red', marginTop: 4, display: 'block' }}>{errors.tags}</small>}
          </div>

          {/* Action buttons */}
          <div className="form-actions">
            <button className="btn-draft" type="button" onClick={() => openModal('draft')} disabled={loading}>Draft</button>
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