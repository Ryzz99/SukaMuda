import { Link } from "react-router-dom";
import { categoryGroups } from "../data/articles";
import { getAllArticles } from "../data/articlesStore";
import "./home.css";

function Home() {
  const allArticles = getAllArticles();

  const renderCard = (article) => {
    return (
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
    );
  };

  return (
    <div className="home-container">
      {categoryGroups.map((group) => {
        const groupArticles = allArticles
          .filter((item) => group.categorySlugs.includes(item.category))
          .slice(0, 6);

        if (groupArticles.length === 0) {
          return null;
        }

        return (
          <section key={group.slug} className="home-section">
            <div className="section-header">
              <h2>{group.label}</h2>
              <Link className="section-link" to={`/category/${group.slug}`}>
                Lihat semua
              </Link>
            </div>
            <div className="article-grid">
              {groupArticles.map(renderCard)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default Home;