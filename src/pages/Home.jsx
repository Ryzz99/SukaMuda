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

  const formatCategory = (cat) =>
    cat ? cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase() : "Umum";

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const renderTrendingItem = (article, index) => {
    const imageUrl = article.image
      ? (article.image.startsWith('http') ? article.image : `${baseUrl}/storage/${article.image}`)
      : "https://via.placeholder.com/150x100?text=SukaMuda";

    const authorPhoto = article.user?.avatar || article.user?.profile_photo_url;
    const authorName = article.user?.name || 'Anonim';

    return (
      <Link className="trending-item" key={article.id} to={`/article/${article.id}`}>
        <div className="trending-rank">
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>

        <div className="trending-thumb">
          <img
            src={imageUrl}
            alt={article.title}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/150x100?text=Image";
            }}
          />
        </div>

        <div className="trending-details">
          <span className="tag-category">
            {formatCategory(article.category)}
          </span>

          <h4>{article.title}</h4>

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
    const imageUrl = article.image
      ? (article.image.startsWith('http') ? article.image : `${baseUrl}/storage/${article.image}`)
      : "https://via.placeholder.com/600x400?text=SukaMuda";

    const authorPhoto = article.user?.avatar || article.user?.profile_photo_url;
    const authorName = article.user?.name || 'Anonim';

    return (
      <Link
        className={`article-card card-index-${index}`}
        key={article.id}
        to={`/article/${article.id}`}
      >
        <div className="card-image">
          <img src={imageUrl} alt={article.title} loading="lazy" />
          <div className="card-image-overlay"></div>

          <span className="card-badge">
            {formatCategory(article.category)}
          </span>
        </div>

        <div className="card-body">
          <h3>{article.title}</h3>

          <div className="card-footer">
            <div className="author-info">
              <div className="author-avatar">
                {authorPhoto ? (
                  <img src={authorPhoto} alt={authorName} />
                ) : (
                  <span>{getInitials(authorName)}</span>
                )}
              </div>

              <span className="author-name">{authorName}</span>
            </div>

            <span className="read-time">3 min baca</span>
          </div>
        </div>
      </Link>
    );
  };

  const SkeletonCard = () => (
    <div className="article-card skeleton">
      <div className="skeleton-img"></div>

      <div className="card-body">
        <div className="skeleton-line short"></div>
        <div className="skeleton-line long"></div>
        <div className="skeleton-line medium"></div>
      </div>
    </div>
  );

  const SkeletonTrending = () => (
    <div className="trending-item skeleton">
      <div className="trending-rank">
        <div className="skeleton-box"></div>
      </div>

      <div className="trending-thumb">
        <div className="skeleton-img"></div>
      </div>

      <div className="trending-details">
        <div className="skeleton-line short"></div>
        <div className="skeleton-line long"></div>
      </div>
    </div>
  );

  const top5Trending = trendingLoading
    ? []
    : trendingArticles.slice(0, 5);

  return (
    <div className="home-container">

      {/* Section Trending */}
      <section className="section-trending">
        <div className="section-header">
          <div className="header-left">
            <div className="bar-orange"></div>
            <h2>Trending Hari Ini</h2>
          </div>

          <div className="trending-count">
            <span>
              Top {trendingLoading ? '...' : top5Trending.length} Berita
            </span>
          </div>
        </div>

        <div className="trending-grid">
          {trendingLoading ? (
            Array(5).fill(0).map((_, i) => (
              <SkeletonTrending key={i} />
            ))
          ) : (
            top5Trending.map((article, index) =>
              renderTrendingItem(article, index)
            )
          )}
        </div>
      </section>

      {/* Section Categories */}
      {categoryGroups.map((group) => {
        const groupArticles = allArticles
          .filter((item) =>
            group.categorySlugs.some(
              (slug) =>
                slug.toLowerCase() === item.category.toLowerCase()
            )
          )
          .slice(0, 6);

        if (groupArticles.length === 0 && !articleLoading) return null;

        return (
          <section key={group.slug} className="section-category">
            <div className="section-header">
              <div className="header-left">
                <div className="bar-red"></div>
                <h2>{group.label}</h2>
              </div>

              <Link
                to={`/category/${group.slug}`}
                className="view-all"
              >
                Lihat Semua
                <span className="icon-arrow">→</span>
              </Link>
            </div>

            <div className="articles-grid">
              {articleLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              ) : (
                groupArticles.map((article, index) =>
                  renderCard(article, index)
                )
              )}
            </div>
          </section>
        );
      })}

      {/* Empty State */}
      {allArticles.length === 0 && !articleLoading && (
        <div className="empty-state">
          <p>Belum ada artikel yang diterbitkan saat ini.</p>
        </div>
      )}
    </div>
  );
}

export default Home;