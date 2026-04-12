import React, { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { categories, categoryGroups } from "../data/articles";
import { getAllArticles } from "../data/articlesStore";
import "./Category.css";

const Category = () => {
  const { slug } = useParams();
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const group = useMemo(
    () => categoryGroups.find((item) => item.slug === slug),
    [slug]
  );
  const category = useMemo(
    () => categories.find((item) => item.slug === slug),
    [slug]
  );

  const selectedSlugs = group?.categorySlugs || (category ? [category.slug] : []);
  const title = group?.label || category?.label || "Category";

  useEffect(() => {
    setVisibleCount(6);
  }, [slug, query]);

  const filteredArticles = getAllArticles().filter((item) => {
    if (selectedSlugs.length === 0) {
      return false;
    }

    const matchesCategory = selectedSlugs.includes(item.category);
    const matchesQuery = item.title.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <div className="category-container">
      <header className="category-header">
        <div>
          <h2>{title}</h2>
          {group && (
            <div className="category-sublist">
              {group.categorySlugs.map((item) => {
                const label = categories.find((cat) => cat.slug === item)?.label || item;
                return (
                  <span key={item} className="category-chip">
                    {label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        <input
          className="category-search"
          type="text"
          placeholder="Cari artikel..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </header>

      {selectedSlugs.length === 0 && (
        <p className="category-empty">Kategori tidak ditemukan.</p>
      )}

      {selectedSlugs.length > 0 && (
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
            <p className="category-empty">Belum ada artikel.</p>
          )}

          {hasMore && (
            <div className="category-actions">
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
  );
};

export default Category;
