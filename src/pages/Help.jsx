import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Help.css';

const Help = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    perihal: '',
    kategori: '',
    nama: '',
    email: '',
    pesan: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi email di Frontend
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      alert("Format email salah! Gunakan contoh: nama@email.com");
      return;
    }

    console.log("Data dikirim ke Backend:", formData);
    alert("Pesan terkirim! Tim Sukamuda akan menghubungi email Anda.");
  };

  return (
    <div className="help-page-bg">
      <div className="help-header-section">
        <button className="help-back-icon" onClick={() => navigate(-1)}> ← </button>
        <h1 className="help-main-title">HELP</h1>
      </div>

      <div className="help-content-wrapper">
        <h2 className="help-question">Tidak menemukan bantuan yang Anda cari?</h2>
        <p className="help-instruction">
          Silakan isi formulir di bawah ini untuk menyampaikan pertanyaan, saran, atau kritik kepada Sukamuda.
        </p>

        <form onSubmit={handleSubmit} className="help-main-form">
          
          {/* PERIHAL (DI ATAS) */}
          <label className="help-label-text">Perihal:</label>
          <input 
            type="text" 
            name="perihal" 
            placeholder="Alasan menghubungi kami..." 
            className="help-input-field" 
            onChange={handleChange} 
            required 
          />

          {/* KATEGORI PILIHAN */}
          <div className="help-category-list">
            <label className="help-radio-box">
              <input type="radio" name="kategori" value="Konten" onChange={handleChange} required />
              <span className="radio-text">Konten</span>
            </label>
            <label className="help-radio-box">
              <input type="radio" name="kategori" value="Kerjasama" onChange={handleChange} />
              <span className="radio-text">Kerjasama Konten/Bisnis</span>
            </label>
            <label className="help-radio-box">
              <input type="radio" name="kategori" value="Teknis" onChange={handleChange} />
              <span className="radio-text">Teknis</span>
            </label>
          </div>

          {/* INPUT FORM LAINNYA */}
          <input 
            type="text" 
            name="nama" 
            placeholder="Name" 
            className="help-input-field" 
            onChange={handleChange} 
            required 
          />

          <textarea 
            name="pesan" 
            placeholder="Tulis pesan atau detail bantuan..." 
            className="help-textarea-field" 
            onChange={handleChange} 
            required
          ></textarea>

          <input 
            type="email" 
            name="email" 
            placeholder="Email (Alamat balasan)" 
            className="help-input-field" 
            onChange={handleChange} 
            required 
          />

          <button type="submit" className="help-submit-btn">Kirim</button>
        </form>
      </div>
    </div>
  );
};

export default Help;