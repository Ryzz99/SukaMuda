import React, { useState, useEffect } from 'react';
import './Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios, { ensureCsrfToken } from '../utils/axiosConfig';
import logoSukaMuda from '../assets/logo.png';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/login', formData);

      // ✅ FIX: Parse response.data kalau masih string (terjadi kalau backend tidak set Content-Type: application/json)
      const data = typeof response.data === 'string'
        ? JSON.parse(response.data)
        : response.data;

      console.log('=== DEBUG LOGIN ===');
      console.log('data:', data);
      console.log('data.user:', data.user);
      console.log('data.access_token:', data.access_token);
      console.log('data.token:', data.token);

      // ✅ FIX: Ambil user dan token dari data yang sudah di-parse
      const userData = data.user;
      const token = data.access_token || data.token;

      if (!userData || !token) {
        console.error('userData atau token kosong:', { userData, token });
        alert('Login gagal: respons server tidak valid. Cek console.');
        return;
      }

      // ✅ Panggil login dari AuthContext — ini yang update navbar
      login(userData, token);

      // ✅ Navigate ke home setelah login berhasil
      navigate('/');

    } catch (error) {
      console.error('Login gagal:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Email atau kata sandi salah';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- SVG ICONS ---
  const IconMail = (
    <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13L2 4" />
    </svg>
  );

  const IconLock = (
    <svg className="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  const IconEyeOff = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  const IconEyeOn = (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  return (
    <div className={`login-page ${mounted ? 'is-mounted' : ''}`}>

      <div className="particles" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              '--delay': `${i * 0.8}s`,
              '--duration': `${14 + i * 2}s`,
              '--x': `${15 + i * 14}%`,
              '--size': `${4 + (i % 3) * 2}px`,
            }}
          />
        ))}
      </div>

      <div className="deco-line deco-line-1" aria-hidden="true" />
      <div className="deco-line deco-line-2" aria-hidden="true" />
      <div className="deco-line deco-line-3" aria-hidden="true" />
      <div className="deco-shape deco-shape-1" aria-hidden="true" />
      <div className="deco-shape deco-shape-2" aria-hidden="true" />

      <button className="back-btn" onClick={() => navigate('/')} aria-label="Kembali">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      <div className="login-card">
        <div className="logo-wrap anim-item" style={{ '--i': 0 }}>
          <img src={logoSukaMuda} alt="Logo SUKAMUDA" className="logo-img" />
        </div>
        <h1 className="login-heading anim-item" style={{ '--i': 1 }}>Login</h1>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group anim-item" style={{ '--i': 2 }}>
            <label htmlFor="email">Email</label>
            <div className="input-box">
              {IconMail}
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contoh@email.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="input-group anim-item" style={{ '--i': 3 }}>
            <label htmlFor="password">Kata Sandi</label>
            <div className="input-box">
              {IconLock}
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan kata sandi"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-pw"
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPw ? IconEyeOff : IconEyeOn}
              </button>
            </div>
          </div>

          <div className="anim-item" style={{ '--i': 4 }}>
            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
              <p className="forgot-link">Lupa Kata Sandi?</p>
            </Link>
          </div>

          <button
            type="submit"
            className="btn-login anim-item"
            style={{ '--i': 5 }}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Masuk'}
          </button>
        </form>

        <div className="login-sep" />
        <p className="login-footer anim-item" style={{ '--i': 6 }}>
          Belum punya akun? <Link to="/register" className="link-dark">Daftar</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;