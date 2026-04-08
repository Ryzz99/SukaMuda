import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Terms.css';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="terms-page-container">
      {/* Tombol Back */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← 
      </button>

      <header className="terms-header">
        <h1 className="terms-main-title">Syarat dan Ketentuan <br/> Penggunaan Sukamuda</h1>
        <p className="terms-subtitle">Update Terakhir: April 2026</p>
      </header>

      <main className="terms-content">
        <section className="terms-item">
          <h2>1. Ketentuan Umum</h2>
          <p>Dengan mengakses dan menggunakan website Sukamuda, Anda dianggap telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan yang berlaku. Jika Anda tidak setuju dengan ketentuan ini, mohon untuk tidak menggunakan layanan website.</p>
        </section>

        <section className="terms-item">
          <h2>2. Definisi Layanan</h2>
          <p>Sukamuda merupakan platform yang menyediakan konten, artikel, dan informasi untuk pengguna. Layanan dapat diperbarui, diubah, atau dihentikan sewaktu-waktu tanpa pemberitahuan sebelumnya.</p>
        </section>

        <section className="terms-item">
          <h2>3. Akun Pengguna</h2>
          <ul>
            <li>Pengguna bertanggung jawab atas keamanan akun masing-masing.</li>
            <li>Dilarang menggunakan identitas palsu atau data yang tidak valid.</li>
            <li>Segala aktivitas yang terjadi pada akun menjadi tanggung jawab pengguna.</li>
          </ul>
        </section>

        <section className="terms-item">
          <h2>4. Konten Pengguna</h2>
          <ul>
            <li>Pengguna diperbolehkan mengirim artikel, komentar, atau konten lainnya sesuai kategori yang tersedia.</li>
            <li>Konten yang dikirim tidak boleh mengandung unsur SARA, pornografi, kekerasan, hoaks, atau melanggar hukum.</li>
            <li>Setiap konten yang dikirim akan melalui proses verifikasi sebelum dipublikasikan.</li>
          </ul>
        </section>

        <section className="terms-item">
          <h2>5. Hak dan Kewajiban</h2>
          <div className="sub-section">
            <h3>Hak Pengguna:</h3>
            <ul>
              <li>Mengakses dan membaca konten yang tersedia.</li>
              <li>Mengirimkan artikel sesuai ketentuan platform.</li>
            </ul>
          </div>
          <div className="sub-section">
            <h3>Kewajiban Pengguna:</h3>
            <ul>
              <li>Menggunakan layanan secara bijak dan tidak merugikan pihak lain.</li>
              <li>Menghormati hak cipta dan kekayaan intelektual.</li>
            </ul>
          </div>
        </section>

        <section className="terms-item">
          <h2>6. Hak Cipta dan Kekayaan Intelektual</h2>
          <p>Seluruh konten yang terdapat di website Sukamuda dilindungi oleh hak cipta. Dilarang menyalin, menyebarkan, atau mempublikasikan ulang konten tanpa izin resmi dari pihak pengelola.</p>
        </section>

        <section className="terms-item">
          <h2>7. Larangan Penggunaan</h2>
          <p>Pengguna dilarang:</p>
          <ul>
            <li>Melakukan spam, hacking, atau aktivitas yang merusak sistem.</li>
            <li>Menyebarkan informasi palsu atau menyesatkan.</li>
            <li>Menggunakan platform untuk kepentingan ilegal.</li>
          </ul>
        </section>

        <section className="terms-item">
          <h2>8. Penangguhan dan Penghapusan Konten</h2>
          <p>Pengelola berhak menolak, menunda, atau menghapus konten yang tidak sesuai dengan kebijakan, serta menangguhkan akun pengguna yang melanggar ketentuan.</p>
        </section>

        <section className="terms-item">
          <h2>9. Perubahan Syarat dan Ketentuan</h2>
          <p>Syarat dan Ketentuan dapat diperbarui sewaktu-waktu. Pengguna disarankan untuk meninjau halaman ini secara berkala.</p>
        </section>

        <section className="terms-item footer-note">
          <h2>10. Penutup</h2>
          <p>Dengan menggunakan website Sukamuda, Anda menyetujui seluruh kebijakan yang berlaku dan siap mematuhi aturan demi menjaga kenyamanan serta keamanan bersama di platform.</p>
        </section>
      </main>
    </div>
  );
};

export default Terms;