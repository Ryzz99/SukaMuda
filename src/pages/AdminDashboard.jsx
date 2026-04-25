import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [previewArticle, setPreviewArticle] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, draft: 0 });
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // 1. SINKRONISASI KATEGORI LENGKAP SESUAI NAVBAR (NEWS, LIFESTYLE & LAINNYA)
    const categoryList = [
        // News Dropdown
        { slug: 'school', label: 'School' },
        { slug: 'college', label: 'College' },
        { slug: 'general', label: 'General' },
        // Lifestyle Dropdown
        { slug: 'style', label: 'Style' },
        { slug: 'culinary', label: 'Culinary' },
        { slug: 'traveling', label: 'Traveling' },
        // Menu Utama
        { slug: 'sport', label: 'Sport & E-Sport' },
        { slug: 'music', label: 'Music & Film' },
        { slug: 'otomotif', label: 'Otomotif' },
        { slug: 'science', label: 'Science' },
        { slug: 'health', label: 'Health' },
        { slug: 'tech', label: 'Tech' },
        { slug: 'podcast', label: 'Podcast' }
    ];

    useEffect(() => {
        if (!isLoggedIn || user?.role !== 'admin') {
            navigate('/');
        }
    }, [isLoggedIn, user, navigate]);

    const fetchArticles = async (isSearch = false) => {
        try {
            // Jangan set loading true jika ini pencarian, supaya tabel tidak berkedip/menghilang
            if (!isSearch) setLoading(true);
            
            const response = await axios.get(`/api/articles`, {
                params: { 
                    page: currentPage,
                    status: filterStatus !== 'all' ? filterStatus : null,
                    category: filterCategory !== 'all' ? filterCategory : null,
                    search: searchQuery
                }
            });

            const dataFromServer = response.data.data || [];
            setArticles(dataFromServer);
            
            if(response.data.last_page) {
                setTotalPages(response.data.last_page);
            }

            setStats(prev => ({
                ...prev,
                total: response.data.total || 0
            }));

        } catch (error) {
            console.error("Gagal mengambil data berita:", error);
        } finally {
            setLoading(false);
        }
    };

    // Untuk ganti halaman & filter dropdown (boleh ada loading singkat)
    useEffect(() => {
        if (isLoggedIn && user?.role === 'admin') {
            fetchArticles(false);
        }
    }, [currentPage, filterStatus, filterCategory]);

    // KHUSUS UNTUK SEARCH: Anti scroll ke atas saat mengetik
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (isLoggedIn && user?.role === 'admin') {
                // Simpan posisi scroll sebelum fetch
                const scrollY = window.scrollY;
                
                setCurrentPage(1); 
                fetchArticles(true).then(() => {
                    // Kembalikan posisi scroll setelah data selesai di-fetch
                    window.scrollTo(0, scrollY);
                });
            }
        }, 600);
        
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleUpdateStatus = async (id, newStatus) => {
        const label = newStatus === 'approved' ? 'menyetujui' : 'menolak';
        if (!window.confirm(`Yakin ingin ${label} berita ini?`)) return;

        setActionLoading(id);
        try {
            await axios.patch(`/api/articles/${id}/status`, { status: newStatus });
            fetchArticles(); 
        } catch (error) {
            alert("Gagal memperbarui status berita.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus berita ini secara permanen?')) return;

        setActionLoading(id);
        try {
            await axios.delete(`/api/articles/${id}`);
            alert("Berita berhasil dihapus!");
            fetchArticles();
        } catch (error) {
            alert("Gagal menghapus berita.");
        } finally {
            setActionLoading(null);
        }
    };

    const getArticleImage = (art) => {
        if (!art.image) return "https://via.placeholder.com/150?text=SukaMuda";
        return art.image.startsWith('http') ? art.image : `http://localhost:8000/storage/${art.image}`;
    };

    const getCategoryLabel = (slug) => {
        const cat = categoryList.find(c => c.slug === slug);
        return cat ? cat.label : slug.charAt(0).toUpperCase() + slug.slice(1);
    };

    if (loading && articles.length === 0) {
        return (
            <div className="admin-loading-full">
                <div className="admin-spinner" />
                <p>Memuat Data SukaMuda...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-container">
            <header className="admin-header">
                <div className="admin-header-left">
                    <div className="admin-logo">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        <div>
                            <h1>Panel Kendali Admin</h1>
                            <p>Halo <strong>{user?.name}</strong> — moderasi berita dengan bijak.</p>
                        </div>
                    </div>
                </div>
                <div className="admin-header-right">
                    <Link to="/write" className="btn-create-new">
                        Tulis Artikel Baru
                    </Link>
                </div>
            </header>

            <div className="admin-stats-grid">
                <div className="stat-card stat-total" onClick={() => { setFilterStatus('all'); setFilterCategory('all'); setSearchQuery(''); setCurrentPage(1); }}>
                    <div className="stat-info">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">Total Artikel</span>
                    </div>
                </div>
            </div>

            <div className="admin-toolbar">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Cari judul atau penulis..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="toolbar-right">
                    <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="filter-select">
                        <option value="all">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    
                    {/* DROPDOWN KATEGORI UPDATE: SEMUA KATEGORI NAVBAR ADA DISINI */}
                    <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }} className="filter-select">
                        <option value="all">Semua Kategori</option>
                        {categoryList.map(cat => (
                            <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Artikel</th>
                            <th>Penulis</th>
                            <th>Kategori</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.length > 0 ? articles.map((art, index) => (
                            <tr key={art.id}>
                                <td>{index + 1 + (currentPage - 1) * 15}</td>
                                <td>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                                        <img src={getArticleImage(art)} alt="" style={{width: '40px', height: '30px', borderRadius: '4px', objectFit: 'cover'}} />
                                        <span style={{fontWeight: '600'}}>{art.title}</span>
                                    </div>
                                </td>
                                <td>{art.user?.name || 'Anonim'}</td>
                                <td>
                                    <span className="badge-category">{getCategoryLabel(art.category)}</span>
                                </td>
                                <td><span className={`status-badge status-${art.status}`}>{art.status.toUpperCase()}</span></td>
                                <td>
                                    <div className="action-group">
                                        <button className="btn-action" onClick={() => setPreviewArticle(art)} title="Preview">👁️</button>
                                        {art.status === 'pending' && (
                                            <button className="btn-action" onClick={() => handleUpdateStatus(art.id, 'approved')} disabled={actionLoading === art.id} title="Approve">✅</button>
                                        )}
                                        <button className="btn-action" onClick={() => handleDelete(art.id)} disabled={actionLoading === art.id} title="Hapus">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="empty-state">Data tidak ditemukan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="admin-pagination">
                    <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Sebelumnya</button>
                    <span className="page-info">Halaman {currentPage} dari {totalPages}</span>
                    <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Selanjutnya</button>
                </div>
            )}

            {previewArticle && (
                <div className="modal-overlay" onClick={() => setPreviewArticle(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{previewArticle.title}</h3>
                            <button className="modal-close" onClick={() => setPreviewArticle(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-meta">
                                <strong>Penulis:</strong> {previewArticle.user?.name} | <strong>Kategori:</strong> {getCategoryLabel(previewArticle.category)}
                            </div>
                            <img src={getArticleImage(previewArticle)} alt="Hero" style={{width: '100%', borderRadius: '8px', margin: '15px 0'}} />
                            <div className="modal-article-content" dangerouslySetInnerHTML={{ __html: previewArticle.content }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;