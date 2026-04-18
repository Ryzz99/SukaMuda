import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    { q: "Apa itu SukaMuda?", a: "SukaMuda adalah platform media informasi dan wadah kreativitas bagi anak muda untuk berbagi berita, gaya hidup, hingga hobi." },
    { q: "Siapa saja yang boleh membaca/menggunakan web ini?", a: "Siapa saja! Walaupun fokusnya untuk anak muda (pelajar/mahasiswa), konten kami terbuka untuk umum." },
    { q: "Bagaimana cara saya mengirim artikel?", a: "Kamu harus masuk (Login) terlebih dahulu, klik menu Write, isi kategori, judul, dan konten tulisanmu, lalu tekan kirim." },
    { q: "Kategori apa saja yang tersedia?", a: "Kami memiliki beragam rubrik mulai dari News, Lifestyle, Sport, Music & Film, Otomotif, Science, hingga Health." },
    { q: "Bolehkah saya menyertakan gambar di artikel?", a: "Tentu! Kamu wajib mengunggah thumbnail dan bisa menambahkan gambar di dalam isi artikel melalui editor yang tersedia." },
    { q: "Apakah tulisan saya langsung terbit?", a: "Setiap tulisan akan masuk ke sistem kami terlebih dahulu untuk dipastikan tidak melanggar aturan komunitas." },
    { q: "Apakah mendaftar di SukaMuda gratis?", a: "Ya, pendaftaran akun di SukaMuda 100% gratis." },
    { q: "Bagaimana jika saya lupa kata sandi?", a: "Kamu bisa menghubungi tim bantuan kami melalui halaman kontak atau menggunakan fitur reset password (jika sudah tersedia)." },
    { q: "Apakah data pribadi saya aman?", a: "Kami menjaga privasi pengguna dengan ketat sesuai dengan kebijakan Privacy Policy kami." },
    { q: "Hal apa saja yang dilarang dalam penulisan artikel?", a: "Dilarang keras memposting konten yang mengandung SARA, ujaran kebencian, pornografi, atau berita bohong (hoax)." },
    { q: "Bagaimana jika saya melihat konten yang tidak pantas?", a: "Kamu bisa melaporkannya kepada admin melalui menu Bantuan agar segera kami tindak lanjuti." }
  ];

  // GAYA CSS LANGSUNG DI SINI (Inline Styles)
  const styles = {
    page: { backgroundColor: 'white', minHeight: '100vh', padding: '40px 20px', color: 'black', fontFamily: 'sans-serif' },
    container: { maxWidth: '800px', margin: '0 auto' },
    backBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', marginBottom: '20px', fontWeight: 'bold' },
    title: { fontSize: '28px', fontWeight: '800', textTransform: 'uppercase', textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid black', paddingBottom: '10px' },
    item: { marginBottom: '15px', borderBottom: '1px solid #eee' },
    question: { fontWeight: '700', fontSize: '17px', cursor: 'pointer', padding: '15px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    answer: { fontSize: '16px', lineHeight: '1.6', color: '#333', paddingBottom: '15px' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        <h1 style={styles.title}>FAQ</h1>

        <div className="faq-list">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div key={index} style={styles.item}>
                {/* Bagian Pertanyaan */}
                <div style={styles.question} onClick={() => toggleFAQ(index)}>
                  <span>{item.q}</span>
                  <span style={{ fontSize: '20px' }}>{isOpen ? '−' : '+'}</span>
                </div>
                
                {/* Bagian Jawaban (Hanya muncul jika isOpen) */}
                {isOpen && (
                  <div style={styles.answer}>
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;