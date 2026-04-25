import React, { useState, useRef, useEffect } from 'react';
import axios from '../utils/axiosConfig'; 
import { useNavigate, useLocation } from 'react-router-dom';
import './VerifyOtp.css';

const VerifyOtp = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60); 
    const inputRefs = useRef([]); 
    
    const navigate = useNavigate();
    const location = useLocation();
    const userData = location.state; 

    useEffect(() => {
        if (!userData) {
            navigate('/register');
            return;
        }
        if (timer > 0) {
            const interval = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [userData, navigate, timer]);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (isNaN(val)) return; 

        const newOtp = [...otp];
        newOtp[index] = val.substring(val.length - 1);
        setOtp(newOtp);

        if (val && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        try {
            await axios.post('/api/resend-otp', { email: userData?.email });
            alert("Kode baru terkirim!");
            setTimer(60); 
            setOtp(new Array(6).fill("")); 
            inputRefs.current[0].focus();
        } catch (error) {
            alert(error.response?.data?.message || "Gagal kirim ulang kode.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/verify-otp', {
                email: userData?.email,
                name: userData?.name,
                password: userData?.password,
                otp: otp.join("")
            });
            alert("Selamat! Akun kamu sudah aktif.");
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || "OTP Salah atau Expired!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="otp-page-wrapper">
            <div className="otp-card-premium">
                <h2>Verifikasi Akun</h2>
                <p>Masukkan 6 digit kode yang dikirim ke:<br/>
                   <span className="user-email-highlight">{userData?.email}</span>
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div className="otp-input-group">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                className="otp-individual-box"
                                maxLength={1}
                                value={data}
                                ref={(el) => (inputRefs.current[index] = el)}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                autoComplete="off"
                            />
                        ))}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn-otp-submit" 
                        disabled={loading || otp.join("").length < 6}
                    >
                        {loading ? "Memproses..." : "Verifikasi Sekarang"}
                    </button>
                </form>

                <div className="otp-footer">
                    {timer > 0 ? (
                        <p>Kirim ulang dalam <b>{timer}</b> detik</p>
                    ) : (
                        <p>Tidak terima kode? <span className="resend-link" onClick={handleResend}>Kirim Ulang Email</span></p>
                    )}
                    <div className="back-to-reg" onClick={() => navigate('/register')}>Daftar Ulang</div>
                </div>
            </div>
        </div>
    );
};

// --- BAGIAN INI YANG WAJIB ADA AGAR TIDAK BLANK SCREEN ---
export default VerifyOtp;