import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './Write.css';
import { categories } from '../data/articles';
import { saveArticle } from '../data/articlesStore';

function Write() {
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [teaser, setTeaser] = useState("");
    const [tags, setTags] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [thumbnailData, setThumbnailData] = useState(null);

    useEffect(() => {
        if (!editorRef.current || quillRef.current) return;

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
                history: {
                    delay: 1000,
                    maxStack: 100,
                },
            },
        });
    }, []);

    // 🔥 HANYA DIUBAH DI SINI
    const handleConfirmSubmit = () => {
        const contentHtml = quillRef.current?.root?.innerHTML || "";
        const trimmedTitle = title.trim();
        const trimmedCategory = category.trim();

        if (!trimmedTitle || !trimmedCategory || !thumbnailData) {
            setShowModal(false);
            navigate("/write-success"); // ⬅️ tambahan
            return;
        }

        saveArticle({
            id: Date.now(),
            title: trimmedTitle,
            category: trimmedCategory,
            image: thumbnailData,
            content: contentHtml,
            teaser: teaser.trim(),
            tags: tags
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            createdAt: new Date().toISOString()
        });

        setShowModal(false);
        navigate("/write-success");
    };

    const handleThumbnailChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = typeof reader.result === "string" ? reader.result : null;
            setThumbnailData(result);
            setThumbnailPreview(result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="page menulis-form-page">
            <main className="content">
                <section className="write-form">
                    <div className="write-header">
                        <button className="back-link-btn" onClick={() => navigate('/profile')}>
                            <span className="back-icon"> ← </span>
                        </button>
                        <h2 className="write-heading">WRITE</h2>
                        <div />
                    </div>

                    <div className="form-row">
                        <label className="form-label">Category</label>
                        <select
                            className="form-select"
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                        >
                            <option value="" disabled>Kategori</option>
                            {categories.map((item) => (
                                <option key={item.slug} value={item.slug}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <label className="form-label">Title</label>
                        <input
                            className="form-input"
                            placeholder="Write Here"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <label className="form-label">Thumbnail</label>
                        <div className="thumbnail-input">
                            <input
                                className="form-input"
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                required
                            />
                            {thumbnailPreview && (
                                <img
                                    className="thumbnail-preview"
                                    src={thumbnailPreview}
                                    alt="Preview"
                                />
                            )}
                        </div>
                    </div>

                    <div className="editor-wrapper">
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

                    <div className="form-row">
                        <label className="form-label">Treaser</label>
                        <input
                            className="form-input"
                            placeholder="Write Here"
                            value={teaser}
                            onChange={(event) => setTeaser(event.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <label className="form-label">Tag</label>
                        <input
                            className="form-input"
                            placeholder="Pisahkan dengan koma"
                            value={tags}
                            onChange={(event) => setTags(event.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button className="btn-draft" type="button">Draft</button>
                        <button
                            className="btn-submit"
                            type="button"
                            onClick={() => setShowModal(true)}
                        >
                            Kirim
                        </button>
                    </div>
                </section>
            </main>

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