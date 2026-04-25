import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/axiosConfig";
import { categoryGroups } from "../data/articles";
import "./home.css";

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const fetchArticles = async () => {
  const response = await axios.get('/api/public-articles');
  return response.data;
};

const fetchTrending = async () => {
  const response = await axios.get('/api/trending-articles');
  return response.data;
};

function Home() {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    queryClient.prefetchQuery({ queryKey: ['publicArticles'], queryFn: fetchArticles });
    queryClient.prefetchQuery({ queryKey: ['trendingArticles'], queryFn: fetchTrending });
  }, [queryClient]);

  const { data: allArticles = [], isLoading: articleLoading } = useQuery({
    queryKey: ['publicArticles'], 
    queryFn: fetchArticles,
    staleTime: 1000 * 60 * 5,
  });

  const { data: trendingArticles = [], isLoading: trendingLoading } = useQuery({
    queryKey: ['trendingArticles'], 
    queryFn: fetchTrending,
    staleTime: 1000 * 60 * 5,
  });

  const formatCategory = (cat) => cat ? cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase() : "Umum";

  // --- FUNGSI RENDER UNTUK GRID BIASA ---
  const renderCard = (article) => {
    const imageUrl = article.image 
      ? (article.image.startsWith('http') ? article.image : `${baseUrl}/storage/${article.image}`)
      : "https://via.placeholder.com/400x250?text=SukaMuda";

    return (
      <Link className="article-card" key={article.id} to={`/article/${article.id}`}>
        <div className="article-image-wrapper">
          <img 
            src={imageUrl} 
            alt={article.title} 
            loading="lazy" 
            onError={(e) => { 
              e.currentTarget.src = "https://via.placeholder.com/400x250?text=Image+Error"; 
            }} 
          />
          <span className="card-badge">{formatCategory(article.category)}</span>
        </div>
        <div className="card-content">
          <h3>{article.title}</h3>
          <div className="card-meta">
            <span className="author-name">{article.user?.name || 'Anonim'}</span>
            <span className="dot-separator">•</span>
            <span className="read-time">3 menit baca</span>
          </div>
        </div>
      </Link>
    );
  };

  // --- FUNGSI RENDER KHUSUS TRENDING (LIST STYLE) ---
  const renderTrendingItem = (article, index) => {
    const imageUrl = article.image 
      ? (article.image.startsWith('http') ? article.image : `${baseUrl}/storage/${article.image}`)
      : "https://via.placeholder.com/150x100?text=SukaMuda";

    return (
      <Link className="trending-item" key={article.id} to={`/article/${article.id}`}>
        <div className="trending-rank-wrapper">
          <span className="trending-rank">{String(index + 1).padStart(2, '0')}</span>
          <img 
            src={imageUrl} 
            alt={article.title} 
            className="trending-img"
            loading="lazy"
            onError={(e) => { 
              e.currentTarget.src = "https://via.placeholder.com/150x100?text=Image"; 
            }}
          />
        </div>
        <div className="trending-info">
          <span className="trending-category">{formatCategory(article.category)}</span>
          <h4>{article.title}</h4>
          <p>Oleh: {article.user?.name || 'Anonim'}</p>
        </div>
      </Link>
    );
  };

  // --- SKELETON LOADING ---
  const SkeletonCard = () => (
    <div className="article-card skeleton-card">
      <div className="skeleton" style={{ width: '100%', height: '180px', borderRadius: '0' }}></div>
      <div className="card-content" style={{ padding: '15px' }}>
        <div className="skeleton" style={{ width: '60%', height: '12px', marginBottom: '10px' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '16px', marginBottom: '8px' }}></div>
        <div className="skeleton" style={{ width: '90%', height: '16px' }}></div>
      </div>
    </div>
  );

  const SkeletonTrending = () => (
    <div className="trending-item skeleton-trending">
      <div className="trending-rank-wrapper">
        <div className="skeleton" style={{ width: '30px', height: '20px', borderRadius: '4px' }}></div>
        <div className="skeleton" style={{ width: '100px', height: '75px', borderRadius: '6px' }}></div>
      </div>
      <div className="trending-info">
        <div className="skeleton" style={{ width: '60px', height: '12px', marginBottom: '8px' }}></div>
        <div className="skeleton" style={{ width: '90%', height: '14px', marginBottom: '6px' }}></div>
        <div className="skeleton" style={{ width: '70%', height: '14px' }}></div>
      </div>
    </div>
  );

  // Trick agar ticker text berjalan mulus tanpa putus
  const tickerData = trendingArticles.length > 0 ? [...trendingArticles, ...trendingArticles] : [];

  return (
    <div className="home-container">
      
      {/* === BREAKING NEWS TICKER === */}
      {trendingArticles.length > 0 && (
        <div className="breaking-news-bar">
          <span className="breaking-label">Trending</span>
          <div className="ticker-wrapper">
            <div className="ticker-content">
              {tickerData.map((a, i) => (
                <Link key={`ticker-${i}`} to={`/article/${a.id}`} className="ticker-item">
                  {a.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === TRENDING TERPOPULER (SEMUA MUNCUL) === */}
      <section className="home-section trending-section">
        <div className="section-header">
          <div className="section-title-wrapper">
            <div className="section-bar" style={{ background: '#ff9800' }}></div>
            <h2>Trending Hari Ini</h2>
          </div>
          <span className="trending-total">{trendingArticles.length} Berita</span>
        </div>

        <div className="trending-list">
          {trendingLoading ? (
            Array(5).fill(0).map((_, i) => <SkeletonTrending key={i} />)
          ) : (
            trendingArticles.map((article, index) => renderTrendingItem(article, index))
          )}
        </div>
      </section>

      {/* === KATEGORI BERITA TERKINI === */}
      {categoryGroups.map((group) => {
        const groupArticles = allArticles
          .filter((item) =>
            group.categorySlugs.some(
              (slug) => slug.toLowerCase() === item.category.toLowerCase()
            )
          )
          .slice(0, 6);

        if (groupArticles.length === 0 && !articleLoading) return null;

        return (
          <section key={group.slug} className="home-section">
            <div className="section-header">
              <div className="section-title-wrapper">
                <div className="section-bar"></div>
                <h2>{group.label}</h2>
              </div>
              <Link className="section-link" to={`/category/${group.slug}`}>
                Lihat Semua <span className="arrow-right">→</span>
              </Link>
            </div>

            <div className="article-grid">
              {articleLoading ? (
                Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                groupArticles.map(renderCard)
              )}
            </div>
          </section>
        );
      })}

      {allArticles.length === 0 && !articleLoading && (
        <div className="empty-state">
          <p>Belum ada berita yang diterbitkan.</p>
        </div>
      )}
    </div>
  );
}

export default Home;