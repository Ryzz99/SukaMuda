import { useState, useEffect } from 'react';
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
  
  const [isSent, setIsSent] = useState(false);

  // FIXED: Diganti menjadi scroll ke atas agar konsisten dengan halaman About & Terms
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { 
        if (entry.isIntersecting) { 
          entry.target.classList.add('is-visible'); 
          observer.unobserve(entry.target); 
        } 
      });
    }, { threshold: 0.1 });
    
    const els = document.querySelectorAll('.fade-in-up');
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    if (isSent) setIsSent(false);
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return alert("Format email salah! Contoh: nama@email.com");
    }
    setIsSent(true);
    setFormData({ perihal: '', kategori: '', nama: '', email: '', pesan: '' });
  };

  return (
    <section className="rules-about">
      {/* HERO MINI */}
      <div className="rules-help-hero">
        <div className="container fade-in">
          <div style={{ marginBottom: '16px' }}>
            <span className="rules-hero-badge">Support Center</span>
          </div>
          <h1 className="rules-help-hero-title">Bantuan & Kontak</h1>
          <p className="rules-help-hero-sub">
            Tidak menemukan solusi? Kirimkan pertanyaan, saran, atau laporan bug langsung ke tim inti Sukamuda.
          </p>
        </div>
      </div>

      <div className="container"><div className="rules-section-divider"></div></div>

      {/* SPLIT LAYOUT */}
      {/* FIXED: Menghapus ref={contentRef} karena tidak lagi dipakai */}
      <div className="container rules-section-large">
        <div className="rules-help-grid">
          
          {/* --- KOLOM KIRI: INFORMASI --- */}
          <div className="fade-in-up delay-1">
            <div className="rules-help-info-sticky">
              <span className="rules-label-eyebrow" style={{ marginBottom: '12px', display: 'block' }}>Sebelum Mengirim</span>
              <h2 className="rules-help-col-title">Panduan Cepat</h2>
              
              <div className="rules-help-info-cards">
                <div className="rules-help-info-item">
                  <div className="rules-help-info-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Cek Dokumentasi</h4>
                    <p>Jawaban untuk masalah umum mungkin sudah tersedia di halaman FAQ kami.</p>
                  </div>
                </div>

                <div className="rules-help-info-item">
                  <div className="rules-help-info-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Email Valid</h4>
                    <p>Pastikan email aktif. Kami tidak bisa membalas jika alamat email salah atau penuh.</p>
                  </div>
                </div>

                <div className="rules-help-info-item">
                  <div className="rules-help-info-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Waktu Respon</h4>
                    <p>Tim kami membutuhkan waktu maksimal 1x24 jam di hari kerja untuk merespon pesan.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- KOLOM KANAN: FORM --- */}
          <div className="fade-in-up delay-2">
            <div className="rules-help-form-card">
              <span className="rules-label-eyebrow" style={{ marginBottom: '12px', display: 'block' }}>Formulir</span>
              <h2 className="rules-help-col-title">Kirim Pesan</h2>

              {isSent && (
                <div className="rules-help-success-banner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>Pesan berhasil dikirim! Tim kami akan segera menghubungi Anda.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="rules-help-form-wrapper">
                
                <div className="rules-help-form-group">
                  <label>Perihal</label>
                  <input type="text" name="perihal" placeholder="Topik pesan Anda..." value={formData.perihal} onChange={handleChange} required />
                </div>

                <div className="rules-help-form-group">
                  <label>Kategori</label>
                  <div className="rules-help-radio-group">
                    {['Konten', 'Kerjasama', 'Teknis'].map((cat) => (
                      <label key={cat} className="rules-help-radio-pill">
                        <input type="radio" name="kategori" value={cat} onChange={handleChange} required />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rules-help-form-row">
                  <div className="rules-help-form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" name="nama" placeholder="John Doe" value={formData.nama} onChange={handleChange} required />
                  </div>
                  <div className="rules-help-form-group">
                    <label>Email Balasan</label>
                    <input type="email" name="email" placeholder="nama@email.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="rules-help-form-group">
                  <label>Detail Pesan</label>
                  <textarea name="pesan" placeholder="Jelaskan secara detail agar kami bisa membantu lebih cepat..." rows="6" value={formData.pesan} onChange={handleChange} required></textarea>
                </div>

                <button type="submit" className="rules-help-submit-btn">
                  <span>Kirim Pesan</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* TOMBOL KEMBALI DIBAWAH */}
      <div className="container" style={{ textAlign: 'center' }}>
        <button className="rules-help-back-btn-bottom" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali Ke Halaman Sebelumnya
        </button>
      </div>

      <div className="container">
        <div className="rules-footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sukamuda. Dibangun untuk generasi yang berpikir maju.</p>
        </div>
      </div>
    </section>
  );
};

export default Help;