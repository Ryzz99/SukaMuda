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

const Terms = () => {
  const navigate = useNavigate();

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    icon: null,
  });

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
      setScrollProgress(progress);
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

  const scrollToTerms = () => {
    const el = document.getElementById('terms-main');
    if (el) {
      const offset = 100;
      const position = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: position - offset, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    const heroBadge = document.getElementById('terms-hero-badge');
    if (heroBadge) {
      const offset = 24;
      const position = heroBadge.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: position - offset, behavior: 'smooth' });
    }
  };

  const terms = [
    {
      title: 'Pengguna',
      desc: 'Tanggung jawab penuh atas aktivitas akun.',
      modalTitle: 'Ketentuan Pengguna',
      modalDesc: 'Pengguna bertanggung jawab penuh atas seluruh aktivitas yang terjadi dalam akun mereka. Setiap tindakan yang dilakukan menggunakan akun dianggap dilakukan oleh pemilik akun. Kami menyarankan untuk tidak membagikan kredensial login kepada pihak lain dan selalu menggunakan fitur keamanan yang tersedia.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      title: 'Keamanan',
      desc: 'Perlindungan akun dan data prioritas utama.',
      modalTitle: 'Keamanan Akun',
      modalDesc: 'Kami menerapkan enkripsi end-to-end dan autentikasi dua faktor untuk melindungi data pengguna. Meskipun demikian, pengguna diharapkan untuk menggunakan password yang kuat dan tidak mengakses platform melalui jaringan publik yang tidak terpercaya.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      title: 'Larangan',
      desc: 'Tidak diperbolehkan aktivitas ilegal.',
      modalTitle: 'Larangan',
      modalDesc: 'Dilarang keras melakukan spam, penipuan, distribusi konten ilegal, atau aktivitas yang melanggar hukum Indonesia. Pelanggaran akan mengakibatkan suspensi atau penghapusan akun secara permanen tanpa pemberitahuan sebelumnya.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      ),
    },
    {
      title: 'Kebijakan',
      desc: 'Perubahan sistem dapat dilakukan kapan saja.',
      modalTitle: 'Kebijakan',
      modalDesc: 'Sukamuda berhak mengubah ketentuan layanan kapan saja. Perubahan signifikan akan diinformasikan melalui platform atau email terdaftar. Pengguna disarankan untuk meninjau halaman ini secara berkala untuk tetap mengetahui ketentuan terbaru.',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <section className="rules-about">
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        icon={modal.icon}
        onClose={closeModal}
      />

      <div className="rules-scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />

      <div className="rules-hero">
        <div className="container rules-hero-content fade-in">
          <div className="rules-hero-badge-container" id="terms-hero-badge">
            <span className="rules-hero-badge">Legal Framework</span>
          </div>
          <h1 className="rules-hero-title">
            Syarat
            <br />
            <span className="rules-hero-title-muted">& Ketentuan</span>
          </h1>
          <p className="rules-hero-text">
            Regulasi penggunaan platform Sukamuda untuk menjaga keamanan,
            transparansi, dan etika dalam ekosistem digital modern.
          </p>
          <button className="rules-btn-primary-custom" onClick={scrollToTerms}>
            Pelajari Ketentuan
          </button>
        </div>
      </div>

      <div className="container"><div className="rules-section-divider"></div></div>

      <div id="terms-main" className="container rules-section-large">
        <div className="fade-in-up" style={{ marginBottom: '28px' }}>
          <span className="rules-label-eyebrow">Tentang Legal</span>
        </div>

        <div className="rules-card-arah fade-in-up delay-1">
          <div className="rules-card-arah-inner">
            <div className="rules-card-arah-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <div className="rules-card-arah-body">
              <h2 className="rules-card-arah-title">Ketentuan Utama</h2>
              <div className="rules-card-arah-line"></div>
              <div className="rules-card-arah-grid">
                <div className="rules-card-arah-col">
                  <p><strong>Dengan mengakses platform Sukamuda, pengguna dianggap telah membaca, memahami, dan menyetujui seluruh kebijakan yang berlaku tanpa terkecuali.</strong></p>
                </div>
                <div className="rules-card-arah-col">
                  <p><strong>Kami menjaga integritas sistem dengan standar keamanan tinggi, serta memastikan pengalaman pengguna tetap aman dan terpercaya.</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container"><div className="rules-section-divider"></div></div>

      <div className="container rules-section-large">
        <div className="fade-in-up" style={{ marginBottom: '28px' }}>
          <span className="rules-label-eyebrow">Detail Per Bagian</span>
        </div>

        <div className="rules-grid-visi-misi">
          {terms.map((item, i) => (
            <div
              key={i}
              className="rules-card-vm fade-in-up"
              style={{ transitionDelay: `${i * 0.08}s` }}
              onClick={() => openModal(item.modalTitle, item.modalDesc, item.icon)}
              role="button"
              tabIndex={0}
              aria-label={`Lihat detail: ${item.title}`}
              onKeyDown={(e) => e.key === 'Enter' && openModal(item.modalTitle, item.modalDesc, item.icon)}
            >
              <div className="rules-card-vm-header">
                <span className="rules-card-vm-number">{String(i + 1).padStart(2, '0')}</span>
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

      <div className="container rules-section-large" style={{ textAlign: 'center' }}>
        <div className="fade-in-up delay-1">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', margin: '0 0 16px' }}>
            Persetujuan
          </h3>
        </div>
        <div className="fade-in-up delay-2" style={{ marginBottom: '36px' }}>
          <p style={{ color: 'var(--text-gray)', fontSize: '15px', maxWidth: '440px', margin: '0 auto', lineHeight: 1.75 }}>
            Dengan melanjutkan, Anda menyetujui seluruh ketentuan yang berlaku di platform Sukamuda.
          </p>
        </div>
        <div className="fade-in-up delay-3">
          <button className="rules-btn-primary-custom" onClick={() => navigate('/')}>
            Saya Setuju
          </button>
        </div>
        <div className="fade-in-up delay-4">
          <button className="rules-btn-back-top" onClick={scrollToTop}>
            Kembali Ke Atas
          </button>
        </div>
      </div>

      <div className="container">
        <div className="rules-footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sukamuda. Dibangun untuk generasi yang berpikir maju.</p>
        </div>
      </div>
    </section>
  );
};

export default Terms;