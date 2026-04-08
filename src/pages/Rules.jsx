import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Rules.css';

const Rules = () => {
  const navigate = useNavigate();

  return (
    <div className="rules-container">
      {/* Tombol Back */}
      <button className="back-button" onClick={() => navigate(-1)}>
        ← 
      </button>

      <h1 className="rules-main-title">Kebijakan Privasi & <br/> Kebijakan Penggunaan</h1>

      {/* --- BAGIAN 1: KEBIJAKAN PRIVASI --- */}
      <section className="rules-section">
        <h2 className="section-title">Kebijakan Privasi</h2>
        
        <div className="rule-item">
          <h3>1. Informasi Umum</h3>
          <p>Sukamuda berkomitmen untuk melindungi privasi dan keamanan data setiap pengguna yang mengakses dan menggunakan layanan di website ini.</p>
        </div>

        <div className="rule-item">
          <h3>2. Informasi yang Kami Kumpulkan</h3>
          <p>Kami dapat mengumpulkan beberapa jenis informasi, antara lain:</p>
          <ul>
            <li>Nama dan alamat email saat pendaftaran atau pengiriman artikel</li>
            <li>Data aktivitas pengguna di website</li>
            <li>Informasi perangkat, browser, dan alamat IP</li>
            <li>Konten yang dikirim seperti artikel, komentar, atau media lainnya</li>
          </ul>
        </div>

        <div className="rule-item">
          <h3>3. Penggunaan Informasi</h3>
          <p>Informasi yang dikumpulkan digunakan untuk:</p>
          <ul>
            <li>Mengelola akun pengguna</li>
            <li>Proses verifikasi dan publikasi konten</li>
            <li>Meningkatkan kualitas layanan dan fitur website</li>
            <li>Menjaga keamanan sistem dan mencegah penyalahgunaan</li>
          </ul>
        </div>

        <div className="rule-item">
          <h3>4. Perlindungan Data Pengguna</h3>
          <p>Kami menjaga keamanan data pengguna dengan sistem perlindungan yang wajar dan sesuai standar untuk mencegah akses, penggunaan, atau perubahan data tanpa izin.</p>
        </div>

        <div className="rule-item">
          <h3>5. Cookie</h3>
          <p>Website Sukamuda menggunakan cookie untuk meningkatkan pengalaman pengguna, seperti menyimpan preferensi, data login, dan analisis penggunaan website.</p>
        </div>

        <div className="rule-item">
          <h3>6. Pembagian Data kepada Pihak Ketiga</h3>
          <p>Kami tidak menjual, menukar, atau menyewakan data pribadi pengguna kepada pihak ketiga. Data hanya dapat dibagikan apabila diperlukan oleh hukum atau kepentingan keamanan operasional.</p>
        </div>

        <div className="rule-item">
          <h3>7. Hak Pengguna</h3>
          <ul>
            <li>Mengakses, memperbarui, atau memperbaiki data pribadi</li>
            <li>Menghapus akun dan data terkait</li>
            <li>Menarik persetujuan penggunaan data</li>
          </ul>
        </div>
      </section>

      <hr className="rules-divider" />

      {/* --- BAGIAN 2: KEBIJAKAN PENGGUNAAN --- */}
      <section className="rules-section">
        <h2 className="section-title">Kebijakan Penggunaan (Website Policy)</h2>

        <div className="rule-item">
          <h3>1. Kebijakan Konten</h3>
          <ul>
            <li>Pengguna dapat mengirim artikel sesuai kategori yang tersedia.</li>
            <li>Konten harus orisinal, informatif, dan tidak melanggar hukum.</li>
            <li>Konten akan melalui proses verifikasi sebelum dipublikasikan.</li>
          </ul>
        </div>

        <div className="rule-item">
          <h3>2. Larangan Konten</h3>
          <p>Dilarang mengunggah konten yang mengandung:</p>
          <ul>
            <li>Ujaran kebencian (SARA), Pornografi, atau Kekerasan</li>
            <li>Hoaks atau informasi menyesatkan</li>
            <li>Plagiarisme atau pelanggaran hak cipta</li>
            <li>Spam dan promosi berlebihan tanpa izin</li>
          </ul>
        </div>

        <div className="rule-item">
          <h3>3. Kebijakan Komentar dan Interaksi</h3>
          <p>Pengguna wajib menjaga kesopanan, komentar harus relevan, dan yang melanggar akan dihapus tanpa pemberitahuan.</p>
        </div>

        <div className="rule-item">
          <h3>4. Hak Cipta</h3>
          <p>Konten tetap milik penulis, namun pengguna memberikan izin kepada Sukamuda untuk menampilkan dan mempublikasikan konten di platform.</p>
        </div>

        <div className="rule-item">
          <h3>5. Sanksi Pelanggaran</h3>
          <p>Pelanggaran dapat mengakibatkan peringatan, penghapusan konten, hingga pemblokiran permanen akun.</p>
        </div>

        <div className="rule-item penutup">
          <h3>8. Penutup</h3>
          <p>Dengan menggunakan Sukamuda, pengguna dianggap menyetujui seluruh Kebijakan Privasi dan Penggunaan yang berlaku.</p>
        </div>
      </section>
    </div>
  );
};

export default Rules;