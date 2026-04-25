import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

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
        <button
          className="rules-modal-close-x"
          onClick={onClose}
          aria-label="Tutup modal"
        >
          &times;
        </button>
        <div className="rules-modal-body">
          <div className="rules-modal-icon-wrap">{icon}</div>
          <span className="rules-modal-badge">Detail Informasi</span>
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

const About = () => {
  const navigate = useNavigate();

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    icon: null,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const categories = [
    { name: 'News', slug: 'news' },
    { name: 'Lifestyle', slug: 'lifestyle' },
    { name: 'Sport & E-Sport', slug: 'sport-esport' },
    { name: 'Music & Film', slug: 'music-film' },
    { name: 'Otomotif', slug: 'otomotif' },
    { name: 'Science', slug: 'science' },
    { name: 'Health', slug: 'health' },
    { name: 'Hobby', slug: 'hobby' },
    { name: 'Device', slug: 'device' },
  ];

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const openModal = (title, message, icon) => {
    setModal({ isOpen: true, title, message, icon });
  };

  const handleCategoryClick = (slug) => {
    navigate(`/berita/${slug}`);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    const heroBadge = document.getElementById('hero-badge');
    if (heroBadge) {
      const offset = 24;
      const position = heroBadge.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: position - offset,
        behavior: 'smooth',
      });
    }
  };

  const iconVisi = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const iconMisi = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );

  return (
    <section className="rules-about">
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        icon={modal.icon}
        onClose={closeModal}
      />

      {/* ===== HERO ===== */}
      <div className="rules-hero">
        <div className="container rules-hero-content fade-in">
          <div className="rules-hero-badge-container" id="hero-badge">
            <span className="rules-hero-badge">Digital Mindsets</span>
          </div>
          <h1 className="rules-hero-title">
            Evolusi Literasi{' '}
            <span className="rules-hero-title-muted">Digital Muda</span>
          </h1>
          <p className="rules-hero-text">
            Sukamuda Berdiri Sebagai Garda Terdepan Dalam Mendigitalisasi
            Pemikiran Kritis Kreativitas Tanpa Batas dan Kolaborasi Teknologi
            Untuk Pemuda Indonesia.
          </p>
          <button
            className="rules-btn-primary-custom"
            onClick={() => scrollToSection('arah-section')}
          >
            Jelajahi Misi
          </button>
        </div>
      </div>

      <div className="container"><div className="rules-section-divider"></div></div>

      {/* ===== ARAH DAN TUJUAN ===== */}
      <div id="arah-section" className="container rules-section-large">
        <div className="fade-in-up" style={{ marginBottom: '28px' }}>
          <span className="rules-label-eyebrow">Tentang Kami</span>
        </div>

        <div className="rules-card-arah fade-in-up delay-1">
          <div className="rules-card-arah-inner">
            <div className="rules-card-arah-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </div>
            <div className="rules-card-arah-body">
              <h2 className="rules-card-arah-title">Arah dan Tujuan</h2>
              <div className="rules-card-arah-line"></div>
              <div className="rules-card-arah-grid">
                <div className="rules-card-arah-col">
                  <p>
                    <strong>Dunia bergerak cepat, pemahaman tidak boleh tertinggal. Sukamuda menghubungkan ide, pengetahuan, dan teknologi dalam satu ekosistem yang relevan — bukan wadah sekadar menampung konten.</strong>
                  </p>
                </div>
                <div className="rules-card-arah-col">
                  <p>
                    <strong>Setiap konten melewati standar ketat: terverifikasi, relevan, dan memberi dampak nyata bagi pembaca. Kualitas bukan opsi — itu harga mati.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container"><div className="rules-section-divider"></div></div>

      {/* ===== VISI & MISI ===== */}
      <div className="container rules-section-large">
        <div className="fade-in-up" style={{ marginBottom: '28px' }}>
          <span className="rules-label-eyebrow">Visi & Misi</span>
        </div>

        <div className="rules-grid-visi-misi">
          {/* VISI */}
          <div
            className="rules-card-vm fade-in-up delay-1"
            onClick={() => openModal(
              'Visi',
              'Membangun standar baru ekosistem informasi digital yang cerdas, transparan, dan berkelanjutan — di mana setiap orang tidak perlu meragukan apa yang mereka baca.',
              iconVisi
            )}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') openModal('Visi', 'Membangun standar baru ekosistem informasi digital yang cerdas, transparan, dan berkelanjutan — di mana setiap orang tidak perlu meragukan apa yang mereka baca.', iconVisi);
            }}
            aria-label="Lihat detail Visi"
          >
            <div className="rules-card-vm-header">
              <span className="rules-card-vm-number">01</span>
              <div className="rules-card-vm-icon">{iconVisi}</div>
            </div>
            <h3 className="rules-card-vm-title">Visi</h3>
            <div className="rules-card-vm-line"></div>
            <p className="rules-card-vm-desc">
              <strong>Standar baru informasi digital — lebih cerdas, lebih terpercaya. Setiap data yang beredar bisa diverifikasi tanpa keraguan.</strong>
            </p>
            <div className="rules-card-vm-footer">
              <span className="rules-card-vm-footer-text">Lihat Detail</span>
              <svg className="rules-card-vm-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>

          {/* MISI */}
          <div
            className="rules-card-vm fade-in-up delay-2"
            onClick={() => openModal(
              'Misi',
              'Mengintegrasikan teknologi dan etika untuk menghadirkan informasi berkualitas dan berdampak. Inovasi tanpa mengorbankan kebenaran — karena kredibilitas adalah fondasi kepercayaan.',
              iconMisi
            )}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') openModal('Misi', 'Mengintegrasikan teknologi dan etika untuk menghadirkan informasi berkualitas dan berdampak. Inovasi tanpa mengorbankan kebenaran — karena kredibilitas adalah fondasi kepercayaan.', iconMisi);
            }}
            aria-label="Lihat detail Misi"
          >
            <div className="rules-card-vm-header">
              <span className="rules-card-vm-number">02</span>
              <div className="rules-card-vm-icon">{iconMisi}</div>
            </div>
            <h3 className="rules-card-vm-title">Misi</h3>
            <div className="rules-card-vm-line"></div>
            <p className="rules-card-vm-desc">
              <strong>Teknologi dan etika menyatu di setiap informasi. Tidak ada kompromi — kredibilitas adalah fondasi dari segala kepercayaan.</strong>
            </p>
            <div className="rules-card-vm-footer">
              <span className="rules-card-vm-footer-text">Lihat Detail</span>
              <svg className="rules-card-vm-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container"><div className="rules-section-divider"></div></div>

      {/* ===== RUANG EKSPLORASI ===== */}
      <div className="container rules-section-large">
        <div className="fade-in-up" style={{ textAlign: 'center' }}>
          <span className="rules-label-eyebrow" style={{ justifyContent: 'center' }}>
            Eksplorasi
          </span>
        </div>
        <div className="fade-in-up delay-1" style={{ textAlign: 'center', marginTop: '16px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', margin: 0 }}>
            Ruang Eksplorasi
          </h3>
        </div>
        <div className="fade-in-up delay-2" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <p style={{ color: 'var(--text-gray)', fontSize: '15px', maxWidth: '440px', margin: '0 auto', lineHeight: 1.75 }}>
            Temukan konten berdasarkan minatmu. Setiap kategori dikurasi untuk pengalaman baca terbaik.
          </p>
        </div>
        
        <div className="rules-tags-flex fade-in-up delay-3">
          {categories.map((cat) => (
            <span
              key={cat.slug}
              className="rules-tag-pill"
              onClick={() => handleCategoryClick(cat.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(cat.slug)}
            >
              {cat.name}
            </span>
          ))}
        </div>
        
        <div className="fade-in-up delay-4" style={{ textAlign: 'center' }}>
          <button className="rules-btn-back-top" onClick={scrollToTop}>
            Kembali Ke Atas
          </button>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div className="container">
        <div className="rules-footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Sukamuda. Dibangun untuk generasi yang berpikir maju.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About; 