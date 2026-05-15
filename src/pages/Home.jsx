import React from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/axiosConfig";
import { categoryGroups } from "../data/articles";
import AdSlot from '../components/AdSlot';
import "./home.css";

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const resolveImageUrl = (value) => {
  if (!value) return null;
  return value.startsWith('http') ? value : `${baseUrl}/storage/${value}`;
};

const fetchArticles = async () => {
  const response = await axios.get('/api/public-articles');
  return Array.isArray(response.data) ? response.data : [];
};

const fetchTrending = async () => {
  const response = await axios.get('/api/trending-articles');
  return Array.isArray(response.data) ? response.data : [];
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

  const formatCategory = (cat) =>
    cat ? cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase() : "Umum";

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const renderTrendingItem = (article, index) => {
    if (!article) return null;

    const imageUrl = article.image
      ? (article.image.startsWith('http') ? article.image : `${baseUrl}/storage/${article.image}`)
      : "https://via.placeholder.com/150x100?text=SukaMuda";

    const authorPhoto = resolveImageUrl(article.user?.avatar || article.user?.profile_photo_url);
    const authorName = article.user?.name || 'Anonim';

    return (
      <Link className="trending-item" key={article.id || index} to={`/article/${article.id}`}>
        <div className="trending-rank">
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="trending-thumb">
          <img
            src={imageUrl}
            alt={article.title}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/150x100?text=Image"; }}
          />
        </div>
        <div className="trending-details">
          <span className="tag-category">{formatCategory(article.category)}</span>
          <h4>{article.title || "Judul tidak tersedia"}</h4>
          <div className="meta-info">
            <div className="author-avatar-xs">
              {authorPhoto ? (
                <img src={authorPhoto} alt={authorName} />
              ) : (
                <span>{getInitials(authorName)}</span>
              )}
            </div>
            <span>{authorName}</span>
          </div>
        </div>
      </Link>
    );
  };

  const renderCard = (article, index) => {
    if (!article) return null;

    const imageUrl = article.image
      ? (article.image.startsWith('http') ? article.image : `${baseUrl}/storage/${article.image}`)
      : "https://via.placeholder.com/600x400?text=SukaMuda";

    const authorPhoto = resolveImageUrl(article.user?.avatar || article.user?.profile_photo_url);
    const authorName = article.user?.name || 'Anonim';

    return (
      <Link className="article-card" key={article.id || index} to={`/article/${article.id}`}>
        <div className="article-image-wrapper">
          <img
            src={imageUrl}
            alt={article.title}
            loading="lazy"
            onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/600x400?text=Image"; }}
          />
        </div>
        <div className="card-content">
          <h3>{article.title || "Judul tidak tersedia"}</h3>
          <div className="card-meta">
            <div className="card-author">
              <div className="card-author-avatar-wrap">
                {authorPhoto ? (
                  <img src={authorPhoto} alt={authorName} className="card-author-avatar" />
                ) : (
                  <span className="card-author-initials">{getInitials(authorName)}</span>
                )}
              </div>
              <span className="card-author-name">{authorName}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const SkeletonCard = () => (
    <div className="article-card skeleton">
      <div className="article-image-wrapper skeleton-img"></div>
      <div className="card-content">
        <div className="skeleton-line short"></div>
        <div className="skeleton-line long"></div>
        <div className="skeleton-line medium"></div>
      </div>
    </div>
  );

  const SkeletonTrending = () => (
    <div className="trending-item skeleton">
      <div className="trending-rank"><div className="skeleton-box"></div></div>
      <div className="trending-thumb"><div className="skeleton-img"></div></div>
      <div className="trending-details">
        <div className="skeleton-line short"></div>
        <div className="skeleton-line long"></div>
      </div>
    </div>
  );

  const top5Trending = trendingLoading
    ? []
    : (Array.isArray(trendingArticles) ? trendingArticles.slice(0, 5) : []);

  return (
    <div className="home-container">

      {/* ===== LAYOUT: Iklan Kiri | Konten | Iklan Kanan ===== */}
      <div className="home-layout-wrapper">

        {/* Iklan Vertikal Kiri */}
        <div className="ad-sidebar ad-sidebar-left">
          <div className="ad-sidebar-sticky">
            <AdSlot type="vertical" label="Iklan" />
          </div>
        </div>

        {/* ===== KONTEN UTAMA ===== */}
        <div className="home-main-content">

          {/* Section Trending */}
          <section className="section-trending">
            <div className="section-header">
              <h2>Trending Hari Ini</h2>
              <div className="trending-count">
                <span>Top {trendingLoading ? '...' : top5Trending.length} Berita</span>
              </div>
            </div>
            <div className="trending-grid">
              {trendingLoading
                ? Array(5).fill(0).map((_, i) => <SkeletonTrending key={i} />)
                : top5Trending?.map((article, index) => renderTrendingItem(article, index))
              }
            </div>
          </section>

          {/* Iklan Horizontal Tengah */}
          <div className="ad-center">
            <AdSlot type="horizontal" label="Iklan" />
          </div>

          {/* Section Categories */}
          {categoryGroups?.map((group) => {
            const groupArticles = (Array.isArray(allArticles) ? allArticles : [])
              .filter((item) =>
                item?.category && group.categorySlugs?.some(
                  (slug) => slug.toLowerCase() === item.category.toLowerCase()
                )
              )
              .slice(0, 3);

            if (groupArticles.length === 0 && !articleLoading) return null;

            return (
              <section key={group.slug} className="home-section">
                <div className="section-header">
                  <h2>{group.label}</h2>
                  <Link to={`/category/${group.slug}`} className="section-link">
                    Lihat semua <span className="arrow-right">→</span>
                  </Link>
                </div>
                <div className="article-grid">
                  {articleLoading
                    ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    : groupArticles.map((article, index) => renderCard(article, index))
                  }
                </div>
              </section>
            );
          })}

          {/* Empty State */}
          {(Array.isArray(allArticles) ? allArticles.length === 0 : true) && !articleLoading && (
            <div className="empty-state">
              <p>Belum ada artikel yang diterbitkan saat ini.</p>
            </div>
          )}

        </div>
        {/* ===== END KONTEN UTAMA ===== */}

        {/* Iklan Vertikal Kanan */}
        <div className="ad-sidebar ad-sidebar-right">
          <div className="ad-sidebar-sticky">
            <AdSlot type="vertical" label="Iklan" />
          </div>
        </div>

      </div>
      {/* ===== END LAYOUT WRAPPER ===== */}

      {/* Iklan Horizontal sebelum Footer */}
      <div className="ad-before-footer">
        <AdSlot type="horizontal" label="Iklan" />
      </div>

    </div>
  );
}

export default Home;