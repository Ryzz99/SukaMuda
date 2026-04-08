import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WriteSuccess.css';

function WriteSuccess() {
    const navigate = useNavigate();

    return (
        <div className="success-page-container">
            <div className="success-card">
                <div className="success-content">
                    <p>
                        Terima kasih telah mengirimkan artikel Anda ke website Sukamuda. 
                        Artikel yang Anda kirimkan telah kami terima dan saat ini sedang 
                        dalam proses peninjauan serta verifikasi oleh tim kami. 
                        Mohon menunggu hingga proses evaluasi selesai.
                    </p>
                    <p>
                        Kami akan menginformasikan kembali setelah artikel dinyatakan lolos 
                        verifikasi dan siap untuk dipublikasikan. Terima kasih atas kesabaran 
                        dan partisipasi Anda bersama Sukamuda.
                    </p>
                    
                    <button className="btn-lanjutkan" onClick={() => navigate('/profile')}>
                        Lanjutkan <span className="arrow-icon">›</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WriteSuccess;