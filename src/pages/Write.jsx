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
    const [videoUrl, setVideoUrl] = useState("");
    const [audioUrl, setAudioUrl] = useState("");

    const isPodcast = category === "podcast";

    useEffect(() => {
        if (isPodcast) return;
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
    }, [isPodcast]);

    // Reset quill instance when switching to/from podcast
    useEffect(() => {
        if (isPodcast) {
            quillRef.current = null;
        }
    }, [isPodcast]);

    const handleConfirmSubmit = () => {
        const contentHtml = isPodcast ? "" : (quillRef.current?.root?.innerHTML || "");
        const trimmedTitle = title.trim();
        const trimmedCategory = category.trim();

        if (!trimmedTitle || !trimmedCategory) {
            setShowModal(false);
            navigate("/write-success");
            return;
        }

        saveArticle({
            id: Date.now(),
            title: trimmedTitle,
            category: trimmedCategory,
            image: "/images/smanda.png",
            content: contentHtml,
            videoUrl: isPodcast ? videoUrl.trim() : "",
            audioUrl: isPodcast ? audioUrl.trim() : "",
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

                    {isPodcast ? (
                        <>
                            <div className="form-row">
                                <label className="form-label">URL/Link Video</label>
                                <div className="form-input-icon">
                                    <svg className="link-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                    <input
                                        className="form-input-no-border"
                                        placeholder="Https://contoh.com/video"
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <label className="form-label">URL/Link Audio</label>
                                <div className="form-input-icon">
                                    <svg className="link-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                    <input
                                        className="form-input-no-border" // Pakai class ini
                                        placeholder="Https://contoh.com/Audio"
                                        value={audioUrl}
                                        onChange={(e) => setAudioUrl(e.target.value)}
                                    />
                                </div>
                                 <small className="form-hint">Pastikan link dapat diakses publik</small>
                            </div>
                        </>
                    ) : (
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
                    )}

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
                        <p className="modal-subtitle">"Pastikan tulisanmu sudah rapi sebelum dipublikasikan."</p>
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