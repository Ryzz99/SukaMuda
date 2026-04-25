import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WriteSuccess.css';

function WriteSuccess() {
    const navigate = useNavigate();

    return (
        <div className="success-page-container">
            {/* Decorative floating elements */}
            <div className="deco-circle deco-circle-1"></div>
            <div className="deco-circle deco-circle-2"></div>
            <div className="deco-circle deco-circle-3"></div>

            <div className="success-card">
                {/* Checkmark Animation */}
                <div className="checkmark-wrapper">
                    <svg className="checkmark-svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>

                {/* Badge */}
                <div className="success-badge">
                    <span>Artikel Terkirim</span>
                </div>

                <div className="success-content">
                    <h2 className="success-title">
                        Pengajuan Berhasil Dikirim
                    </h2>

                    <p className="success-desc">
                        Terima kasih telah mengirimkan artikel Anda ke <strong>Sukamuda</strong>. 
                        Artikel yang Anda kirimkan telah kami terima dan saat ini sedang 
                        dalam proses peninjauan serta verifikasi oleh tim editorial kami.
                    </p>

                    <div className="info-cards">
                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                            </div>
                            <div>
                                <p className="info-label">Estimasi Waktu</p>
                                <p className="info-value">1–3 Hari Kerja</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                            </div>
                            <div>
                                <p className="info-label">Status</p>
                                <p className="info-value">Dalam Review</p>
                            </div>
                        </div>
                    </div>

                    <p className="success-note">
                        Kami akan menginformasikan kembali melalui notifikasi setelah artikel 
                        dinyatakan lolos verifikasi dan siap dipublikasikan.
                    </p>

                    <div className="success-actions">
                        <button 
                            className="btn-primary" 
                            onClick={() => navigate('/profile')}
                        >
                            <span>Lanjutkan ke Profil</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"/>
                                <polyline points="12 5 19 12 12 19"/>
                            </svg>
                        </button>
                        <button 
                            className="btn-secondary" 
                            onClick={() => navigate('/write')}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            <span>Tulis Artikel Baru</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom branding */}
            <p className="bottom-brand">
                © {new Date().getFullYear()} Sukamuda — Platform Artikel Terpercaya
            </p>
        </div>
    );
}

export default WriteSuccess;