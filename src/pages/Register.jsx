import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';
// Pastikan import axios dan ensureCsrfToken dari utils yang sudah kita buat
import axios, { ensureCsrfToken } from '../utils/axiosConfig'; 

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Pancing CSRF Token biar nggak error 419
      await ensureCsrfToken();

      // 2. Tembak ke endpoint /api/register
      const response = await axios.post('/api/register', formData);
      
      // 3. Cek respon sukses
      if (response.data.status === 'success' || response.status === 200 || response.status === 201) {
        alert("Kode OTP telah dikirim ke email kamu!");
        
        // Pindah ke halaman OTP sambil bawa data nama & password
        navigate('/verify-otp', { state: formData }); 
      }

    } catch (error) {
      console.error("Detail Error:", error.response?.data);
      
      const serverMessage = error.response?.data?.message;
      const validationErrors = error.response?.data?.errors;
      
      let finalMessage = "Terjadi kesalahan saat mendaftar.";
      
      if (validationErrors) {
        finalMessage = Object.values(validationErrors)[0][0]; // Ambil pesan error validasi (misal: Email sudah dipakai)
      } else if (serverMessage) {
        finalMessage = serverMessage;
      }

      alert(finalMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <button className="back-button" onClick={() => navigate('/')}> ← </button>
        <h2>Daftar SukaMuda</h2>
        
        <form className="register-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Nama Lengkap</label>
            <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Masukkan Nama" 
                required 
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="Email Aktif" 
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
                placeholder="Minimal 8 Karakter" 
                required 
            />
          </div>

          <div className="input-group">
            <label>Konfirmasi Password</label>
            <input 
                type="password" 
                name="password_confirmation" 
                value={formData.password_confirmation} 
                onChange={handleChange} 
                placeholder="Ulangi Password" 
                required 
            />
          </div>

          <div className="register-actions">
            <button type="submit" className="btn-daftar-reg" disabled={loading}>
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;