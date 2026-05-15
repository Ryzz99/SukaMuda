import React from 'react';
import './About.css'; // Gunakan CSS terpisah agar lebih rapi

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-main-title">TENTANG KAMI</h1>
      
      <div className="about-section">
        <p className="welcome-text">Selamat Datang di Sukamuda</p>
        <p>
          Sukamuda adalah platform digital yang hadir sebagai ruang berbagi informasi, 
          gagasan, dan kreativitas bagi generasi muda. Kami menyediakan wadah bagi 
          siapa saja yang ingin menulis, membaca, dan berdiskusi dalam suasana yang 
          positif, inspiratif, dan membangun.
        </p>
      </div>

      <div className="about-section">
        <h2>Visi</h2>
        <p>
          Menjadi platform media digital yang mendorong kreativitas, literasi, 
          dan kontribusi positif generasi muda di era digital.
        </p>
      </div>

      <div className="about-section">
        <h2>Misi</h2>
        <ul>
          <li>Menyediakan ruang publikasi yang aman dan terpercaya.</li>
          <li>Mendorong penulis muda untuk berkarya dan berkembang.</li>
          <li>Menyajikan konten informatif, edukatif, dan inspiratif.</li>
          <li>Membangun komunitas digital yang saling mendukung dan menghargai.</li>
        </ul>
      </div>

      <div className="about-section">
        <h2>Apa yang Ada di Sukamuda?</h2>
        <p>Di Sukamuda, Anda dapat menemukan berbagai kategori konten seperti:</p>
        <ul className="category-list">
          <li>Edukasi, Teknologi, Fashion & Kecantikan</li>
          <li>Opini, Inspirasi, Gaya Hidup</li>
        </ul>
        <p className="note">
          Seluruh artikel yang masuk akan melalui proses verifikasi sebelum 
          dipublikasikan untuk menjaga kualitas dan kredibilitas informasi.
        </p>
      </div>

      <div className="about-section">
        <h2>Komitmen Kami</h2>
        <ul>
          <li>Menjaga kualitas dan keaslian konten</li>
          <li>Melindungi privasi pengguna</li>
          <li>Menyediakan pengalaman membaca yang nyaman</li>
          <li>Mengembangkan platform secara berkelanjutan</li>
        </ul>
      </div>

      <div className="tentang">
        <h2>Bergabung Bersama Kami</h2>
        <p>
          Sukamuda terbuka bagi siapa saja yang ingin berbagi ide, pengalaman, 
          dan wawasan. Mari tumbuh, belajar, dan berkarya bersama di Sukamuda.
        </p>
      </div>
    </div>
  );
};

export default About;