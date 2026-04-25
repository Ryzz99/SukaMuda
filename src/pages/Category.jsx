import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/axiosConfig"; 
import "./Category.css";

const Category = () => {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/public-articles');
        
        // Filter berdasarkan kategori (Case Insensitive)
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
        <h2 style={{ textTransform: 'capitalize', color: '#f97316', marginBottom: '30px' }}>
          Kategori: {slug}
        </h2>
      </header>

      {loading ? (
        <div className="category-empty">Memuat Berita {slug}...</div>
      ) : (
        <div className="article-grid">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link className="article-card" key={article.id} to={`/article/${article.id}`}>
                <div className="article-image-wrapper">
                  <img
                    src={article.image ? `http://localhost:8000/storage/${article.image}` : "https://via.placeholder.com/400x250?text=SukaMuda"}
                    alt={article.title}
                    onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x250?text=Image+Error"; }}
                  />
                </div>
                
                <div className="article-content-preview">
                   <span className="badge-category">{article.category}</span>
                   <h3>{article.title}</h3>
                   
                   {/* Preview isi berita (mengambil 100 karakter pertama tanpa tag HTML) */}
                   <div 
                     className="article-excerpt" 
                     dangerouslySetInnerHTML={{ __html: article.content.substring(0, 100) + '...' }}
                   />

                   <p className="article-author">
                     Oleh: <strong>{article.user?.name || 'Anonim'}</strong>
                   </p>
                </div>
              </Link>
            ))
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