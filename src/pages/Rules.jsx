import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rules.css';

const Modal = ({ isOpen, title, message, icon, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const firstBtn = modalRef.current?.querySelector('button');
    if (firstBtn) firstBtn.focus();

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="rules-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="rules-modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className="rules-modal-close-x" onClick={onClose} aria-label="Tutup modal">
          &times;
        </button>
        <div className="rules-modal-body">
          <div className="rules-modal-icon-wrap">{icon}</div>
          <span className="rules-modal-badge">Detail Kebijakan</span>
          <div className="rules-modal-line"></div>
          <h2>{title}</h2>
          <p className="rules-modal-text-desc">{message}</p>
          <button className="rules-modal-btn-action" onClick={onClose}>
            Selesai Membaca
          </button>
        </div>
      </div>
    </div>
  );
};

const Rules = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', icon: null });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const openModal = (title, message, icon) => {
    setModal({ isOpen: true, title, message, icon });
  };

  const handleOpenModal = (title, message, icon) => () => openModal(title, message, icon);

  const scrollToRules = () => {
    const el = document.getElementById('rules-main');
    if (el) {
      const offset = 100;
      const position = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: position - offset, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    const heroBadge = document.getElementById('rules-hero-badge');
    if (heroBadge) {
      const offset = 24;
      const position = heroBadge.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: position - offset, behavior: 'smooth' });
    }
  };

  // Data Konten
  const privacyItems = [
    {
      num: '01', title: 'Informasi Umum', desc: 'Komitmen melindungi privasi dan keamanan data pengguna.',
      modalDesc: 'Sukamuda berkomitmen penuh untuk melindungi privasi dan keamanan data setiap pengguna yang mengakses dan menggunakan layanan di website ini. Kami menerapkan standar keamanan terbaik agar data Anda tetap tersimpan dengan aman.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    },
    {
      num: '02', title: 'Data yang Dikumpulkan', desc: 'Informasi dasar hingga aktivitas di website.',
      modalDesc: 'Kami dapat mengumpulkan beberapa jenis informasi, antara lain: Nama dan alamat email saat pendaftaran atau pengiriman artikel, Data aktivitas pengguna di website, Informasi perangkat, browser, dan alamat IP, serta Konten yang dikirim seperti artikel, komentar, atau media lainnya.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
    },
    {
      num: '03', title: 'Penggunaan Informasi', desc: 'Pengelolaan akun hingga peningkatan layanan.',
      modalDesc: 'Informasi yang dikumpulkan digunakan untuk: Mengelola akun pengguna, Proses verifikasi dan publikasi konten, Meningkatkan kualitas layanan dan fitur website, serta Menjaga keamanan sistem dan mencegah penyalahgunaan.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
    },
    {
      num: '04', title: 'Perlindungan Data', desc: 'Sistem keamanan standar tinggi.',
      modalDesc: 'Kami menjaga keamanan data pengguna dengan sistem perlindungan yang wajar dan sesuai standar untuk mencegah akses, penggunaan, atau perubahan data tanpa izin.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
    },
  ];

    const policyItems = [
    {
      num: '05', 
      title: 'Kebijakan Konten', 
      desc: 'Aturan pengiriman dan verifikasi artikel.',
      modalDesc: 'Pengguna dapat mengirim artikel sesuai kategori yang tersedia. Konten harus orisinal, informatif, dan tidak melanggar hukum. Konten akan melalui proses verifikasi internal sebelum akhirnya dipublikasikan ke platform.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
    },
    {
      num: '06', 
      title: 'Larangan Konten', 
      desc: 'Batasan tegas atas konten ilegal.',
      modalDesc: 'Dilarang keras mengunggah konten yang mengandung: Ujaran kebencian (SARA), Pornografi, atau Kekerasan, Hoaks atau informasi menyesatkan, Plagiarisme atau pelanggaran hak cipta, serta Spam dan promosi berlebihan tanpa izin.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
    },
    {
      num: '07', 
      title: 'Hak Cipta & Sanksi', 
      desc: 'Kepemilikan konten dan konsekuensi pelanggaran.',
      modalDesc: 'Konten tetap milik penulis, namun pengguna memberikan izin kepada Sukamuda untuk menampilkan dan mempublikasikan konten di platform. Pelanggaran aturan dapat mengakibatkan peringatan, penghapusan konten, hingga pemblokiran permanen akun.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
    },
    {
      num: '08', 
      title: 'Perubahan Kebijakan', 
      desc: 'Hak platform untuk memperbarui aturan.',
      modalDesc: 'Sukamuda berhak mengubah, memodifikasi, atau menambah kebijakan penggunaan ini kapan saja tanpa pemberitahuan terlebih dahulu. Perubahan signifikan akan diinformasikan melalui platform atau email terdaftar. Pengguna disarankan untuk selalu meninjau halaman ini secara berkala.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
    },
  ];

  return (
    <section className="rules-about">
      <Modal isOpen={modal.isOpen} title={modal.title} message={modal.message} icon={modal.icon} onClose={closeModal} />

      {/* SCROLL PROGRESS */}
      <div className="rules-scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />

      {/* HERO */}
      <div className="rules-hero">
        <div className="container rules-hero-content fade-in">
          <div className="rules-hero-badge-container" id="rules-hero-badge">
            <span className="rules-hero-badge">Legal & Policy</span>
          </div>
          <h1 className="rules-hero-title">
            Kebijakan Privasi
            <br />
            <span className="rules-hero-title-muted">& Penggunaan</span>
          </h1>
          <p className="rules-hero-text">
            Transparansi penuh mengenai pengelolaan data, aturan konten, dan hak pengguna di ekosistem Sukamuda.
          </p>
          <button className="rules-btn-primary-custom" onClick={scrollToRules}>
            Lihat Kebijakan
          </button>
        </div>
      </div>

      <div className="container"><div className="rules-section-divider"></div></div>

      {/* KEBIJAKAN PRIVASI */}
      <div id="rules-main" className="container rules-section-large">
        <div className="fade-in-up" style={{ marginBottom: '28px' }}>
          <span className="rules-label-eyebrow">Kebijakan Privasi</span>
        </div>

        <div className="rules-grid-visi-misi">
          {privacyItems.map((item, i) => (
            <div
              key={i}
              className="rules-card-vm fade-in-up"
              style={{ transitionDelay: `${i * 0.08}s` }}
              onClick={handleOpenModal(item.title, item.modalDesc, item.icon)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleOpenModal(item.title, item.modalDesc, item.icon)()}
              aria-label={`Lihat detail: ${item.title}`}
            >
              <div className="rules-card-vm-header">
                <span className="rules-card-vm-number">{item.num}</span>
                <div className="rules-card-vm-icon">{item.icon}</div>
              </div>
              <h3 className="rules-card-vm-title">{item.title}</h3>
              <div className="rules-card-vm-line"></div>
              <p className="rules-card-vm-desc">{item.desc}</p>
              <div className="rules-card-vm-footer">
                <span className="rules-card-vm-footer-text">Lihat Detail</span>
                <svg className="rules-card-vm-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container"><div className="rules-section-divider"></div></div>

      {/* KEBIJAKAN PENGGUNAAN */}
      <div className="container rules-section-large">
        <div className="fade-in-up" style={{ marginBottom: '28px' }}>
          <span className="rules-label-eyebrow">Kebijakan Penggunaan</span>
        </div>

        <div className="rules-grid-visi-misi">
          {policyItems.map((item, i) => (
            <div
              key={i}
              className="rules-card-vm fade-in-up"
              style={{ transitionDelay: `${i * 0.08}s` }}
              onClick={handleOpenModal(item.title, item.modalDesc, item.icon)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleOpenModal(item.title, item.modalDesc, item.icon)()}
              aria-label={`Lihat detail: ${item.title}`}
            >
              <div className="rules-card-vm-header">
                <span className="rules-card-vm-number">{item.num}</span>
                <div className="rules-card-vm-icon">{item.icon}</div>
              </div>
              <h3 className="rules-card-vm-title">{item.title}</h3>
              <div className="rules-card-vm-line"></div>
              <p className="rules-card-vm-desc">{item.desc}</p>
              <div className="rules-card-vm-footer">
                <span className="rules-card-vm-footer-text">Lihat Detail</span>
                <svg className="rules-card-vm-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container"><div className="rules-section-divider"></div></div>

      {/* PENUTUP */}
      <div className="container rules-section-large">
        <div className="rules-card-arah fade-in-up">
          <div className="rules-card-arah-inner">
            <div className="rules-card-arah-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className="rules-card-arah-body">
              <h2 className="rules-card-arah-title">Persetujuan Akhir</h2>
              <div className="rules-card-arah-line"></div>
              <p>
                <strong>Dengan menggunakan Sukamuda, pengguna dianggap telah membaca, memahami, dan menyetujui seluruh Kebijakan Privasi serta Kebijakan Penggunaan yang berlaku di platform ini tanpa terkecuali.</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="fade-in-up delay-2" style={{ textAlign: 'center', marginTop: '40px' }}>
          <button className="rules-btn-back-top" onClick={scrollToTop}>
            Kembali Ke Atas
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="container">
        <div className="rules-footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sukamuda. Dibangun untuk generasi yang berpikir maju.</p>
        </div>
      </div>
    </section>
  );
};

export default Rules;