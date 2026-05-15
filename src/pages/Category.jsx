import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/axiosConfig";
import "./Category.css";

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getInitials = (name) => {
  if (!name) return "?";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

const Category = () => {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/public-articles');

        const filtered = response.data.filter((item) => {
          return item.category.toLowerCase() === slug.toLowerCase();
        });

        setArticles(filtered);
      } catch (error) {
        console.error("Gagal ambil berita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [slug]);

  return (
    <div className="category-container">
      <header className="category-header">
        <h2 style={{ textTransform: 'capitalize', color: '#000', marginBottom: '30px' }}>
          Kategori: {slug}
        </h2>
      </header>

      {loading ? (
        <div className="category-empty">Memuat Berita {slug}...</div>
      ) : (
        <div className="article-grid">
          {articles.length > 0 ? (
            articles.map((article) => {
              const authorName = article.user?.name || 'Anonim';
              const authorPhoto = article.user?.avatar
                || article.user?.profile_photo_url
                || article.user?.photo
                || article.user?.image
                || article.user?.picture
                || null;
              const authorPhotoUrl = authorPhoto
                ? (authorPhoto.startsWith('http') ? authorPhoto : `${baseUrl}/storage/${authorPhoto}`)
                : null;

              return (
                <Link className="article-card" key={article.id} to={`/article/${article.id}`}>
                  <div className="article-image-wrapper">
                    <img
                      src={article.image
                        ? (article.image.startsWith('http') ? article.image : `${baseUrl}/storage/${article.image}`)
                        : "https://via.placeholder.com/400x250?text=SukaMuda"}
                      alt={article.title}
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x250?text=Image+Error"; }}
                    />
                  </div>

                  <div className="article-content-preview">
                    <span className="badge-category">{article.category}</span>
                    <h3>{article.title}</h3>

                    <div
                      className="article-excerpt"
                      dangerouslySetInnerHTML={{ __html: article.content.substring(0, 100) + '...' }}
                    />

                    <div className="article-author">
                      <div className="author-avatar-wrap">
                        {authorPhotoUrl ? (
                          <img
                            src={authorPhotoUrl}
                            alt={authorName}
                            className="author-avatar-img"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span
                          className="author-avatar-initials"
                          style={{ display: authorPhotoUrl ? 'none' : 'flex' }}
                        >
                          {getInitials(authorName)}
                        </span>
                      </div>
                      <span className="author-name">{authorName}</span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="category-empty">
              <p>Belum ada artikel di kategori <strong>{slug}</strong>.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Category;