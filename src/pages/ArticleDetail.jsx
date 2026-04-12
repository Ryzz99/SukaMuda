import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { categories } from "../data/articles";
import { getAllArticles, getArticleById } from "../data/articlesStore";
import "./ArticleDetail.css";

const ArticleDetail = () => {
  const { id } = useParams();
  const article = getArticleById(id);

  if (!article) {
    return (
      <div className="article-detail">
        <p className="detail-empty">Artikel tidak ditemukan.</p>
      </div>
    );
  }

  const categoryLabel =
    categories.find((item) => item.slug === article.category)?.label || article.category;

  const hasBlocks = Array.isArray(article.contentBlocks) && article.contentBlocks.length > 0;
  const hasHtmlContent =
    typeof article.content === "string" && article.content.includes("<");
  const tags = Array.isArray(article.tags) ? article.tags : [];

  const relatedArticles = getAllArticles()
    .filter((item) => item.category === article.category && String(item.id) !== String(article.id))
    .slice(0, 3);

  return (
    <div className="article-detail">
      <div className="detail-hero">
        <img src={article.image} alt={article.title} />
      </div>
      <div className="detail-body">
        <span className="detail-category">{categoryLabel}</span>
        <h1>{article.title}</h1>
        {article.teaser && <p className="detail-teaser">{article.teaser}</p>}
        {article.link && (
          <a className="detail-source" href={article.link} target="_blank" rel="noopener noreferrer">
            Baca sumber
          </a>
        )}

        {hasBlocks && (
          <div className="detail-content">
            {article.contentBlocks.map((block, index) => {
              if (block.type === "callout") {
                return (
                  <a
                    key={index}
                    className="detail-callout"
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {block.text}
                  </a>
                );
              }

              if (block.type === "quote") {
                return (
                  <blockquote key={index} className="detail-quote">
                    {block.text}
                  </blockquote>
                );
              }

              if (block.type === "list") {
                const ListTag = block.ordered ? "ol" : "ul";
                return (
                  <ListTag key={index} className="detail-list">
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ListTag>
                );
              }

              if (block.type === "meta") {
                return (
                  <p key={index} className="detail-meta">
                    {block.text}
                  </p>
                );
              }

              if (block.type === "paragraph") {
                return (
                  <p
                    key={index}
                    className={block.lead ? "detail-lead" : undefined}
                  >
                    {block.highlight ? (
                      <>
                        <span className="detail-highlight">{block.highlight}</span>
                        {" "}
                        {block.text}
                      </>
                    ) : (
                      block.text
                    )}
                  </p>
                );
              }

              return null;
            })}
          </div>
        )}

        {!hasBlocks && hasHtmlContent && (
          <div
            className="detail-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {!hasBlocks && !hasHtmlContent && (
          <p className="detail-empty">Konten artikel belum tersedia.</p>
        )}

        {tags.length > 0 && (
          <div className="detail-tags">
            <p className="tags-label">Tags:</p>
            <div className="tags-list">
              {tags.map((tag) => (
                <span className="tag-chip" key={tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {relatedArticles.length > 0 && (
          <section className="related-section">
            <h2>Berita terkait</h2>
            <div className="related-grid">
              <Link className="related-main" to={`/article/${relatedArticles[0].id}`}>
                <img src={relatedArticles[0].image} alt={relatedArticles[0].title} />
                <h3>{relatedArticles[0].title}</h3>
              </Link>
              <div className="related-list">
                {relatedArticles.slice(1).map((item) => (
                  <Link className="related-item" key={item.id} to={`/article/${item.id}`}>
                    <img src={item.image} alt={item.title} />
                    <div>
                      <h4>{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
