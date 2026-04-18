import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios, { ensureCsrfToken } from '../utils/axiosConfig';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Pastikan CSRF Token siap menggunakan helper yang sudah kita buat
      await ensureCsrfToken();

      // 2. PERBAIKAN: Gunakan /api/login agar tidak error 404
      const response = await axios.post('/api/login', formData);

      if (response.status === 200 || response.status === 204) {
        // Update auth context dengan data user
        login(response.data.user);
        alert("Login Berhasil!");
        navigate('/');
      }
    } catch (error) {
      console.error('Login gagal:', error.response?.data);
      
      // Ambil pesan error spesifik dari Laravel (misal: "Password salah")
      const errorMessage = error.response?.data?.message || 'Email atau password salah';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <button className="back-button" onClick={() => navigate('/')}>
          ←
        </button>

        <h2>Welcome to SUKAMUDA</h2>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan Email" 
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan Password" 
              required
            />
          </div>

          <p className="forgot-password" style={{cursor: 'pointer'}}>Lupa Password?</p>

          <div className="login-actions">
            <button type="submit" className="btn-masuk-login" disabled={loading}>
              {loading ? 'Sedang Masuk...' : 'Masuk'}
            </button>
            <button 
              type="button" 
              className="btn-daftar-login" 
              onClick={() => navigate('/register')}
            >
              Daftar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;