import React, { useEffect, useRef, useState } from 'react'; // Tambah useState
import { useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './Write.css';

function Write() {
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const [showModal, setShowModal] = useState(false);

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

    // 2. Fungsi Eksekusi Kirim
    const handleConfirmSubmit = () => {
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
                        <select className="form-select" defaultValue="">
                            <option value="" disabled>Kategori</option>
                            <option>News</option>
                            <option>Lifestyle</option>
                            <option>Sport</option>
                            <option>E-Sport</option>
                            <option>Music</option>
                            <option>Film</option>
                            <option>Hobby</option>
                            <option>Otomotif</option>
                            <option>Health</option>
                            <option>Science</option>
                            <option>Device</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <label className="form-label">Title</label>
                        <input className="form-input" placeholder="Write Here" />
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
                        <input className="form-input" placeholder="Write Here" />
                    </div>

                    <div className="form-row">
                        <label className="form-label">Tag</label>
                        <input className="form-input" placeholder="Write Here" />
                    </div>

                    <div className="form-actions">
                        <button className="btn-draft" type="button">Draft</button>
                        {/* 3. Ubah onClick untuk memicu modal */}
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

            {/* 4. MODAL CUSTOM */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h2 className="modal-title">Kirim artikel ini sekarang?</h2>
                        <p className="modal-subtitle">“Pastikan tulisanmu sudah rapi sebelum dipublikasikan.”</p>
                        <div className="modal-buttons">
                            <button className="btn-batal" onClick={() => setShowModal(false)}>Batal</button>
                            <button
                                className="btn-konfirmasi-hapus"
                                style={{ backgroundColor: '#007bff' }} // Ganti warna jadi biru/hijau agar tidak seperti tombol hapus
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