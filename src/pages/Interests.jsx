import React, { useEffect, useMemo, useState } from "react";
import "./Interests.css";
import { Link, useNavigate } from "react-router-dom";
import { categories } from "../data/articles";
import { getAllArticles } from "../data/articlesStore";

const Interests = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setVisibleCount(6);
  }, [selected, query]);

  const interestOptions = useMemo(
    () => categories.map((item) => ({ slug: item.slug, label: item.label })),
    []
  );

  const toggleInterest = (slug) => {
    if (selected.includes(slug)) {
      setSelected(selected.filter((item) => item !== slug));
    } else {
      setSelected([...selected, slug]);
    }
  };

  const filteredArticles = getAllArticles().filter((item) => {
    if (selected.length === 0) {
      return false;
    }

    const matchesCategory = selected.includes(item.category);
    const matchesQuery = item.title.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <div className="interests-container">
      <div className="interests-card">
        <h2>Your Interests</h2>

        <div className="interests-grid">
          {interestOptions.map((item) => (
            <button
              key={item.slug}
              className={`interest-tag ${selected.includes(item.slug) ? "active" : ""}`}
              onClick={() => toggleInterest(item.slug)}
            >
              {item.label} <span>+</span>
            </button>
          ))}
        </div>

        <div className="interests-actions">
          <button className="btn-lewati" onClick={() => navigate("/success")}>Lewati</button>
          <button className="btn-selanjutnya" onClick={() => navigate("/success")}>
            Selanjutnya <span>❯</span>
          </button>
        </div>
      </div>

      <div className="interests-results">
        <div className="results-header">
          <h3>Artikel sesuai minat</h3>
          <input
            className="interests-search"
            type="text"
            placeholder="Cari artikel..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {selected.length === 0 && (
          <p className="results-empty">Pilih minimal 1 kategori untuk melihat artikel.</p>
        )}

        {selected.length > 0 && (
          <>
            <div className="article-grid">
              {visibleArticles.map((article) => (
                <Link className="article-card" key={article.id} to={`/article/${article.id}`}>
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <h3>{article.title}</h3>
                </Link>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <p className="results-empty">Belum ada artikel.</p>
            )}

            {hasMore && (
              <div className="results-actions">
                <button
                  className="btn-load-more"
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Interests;