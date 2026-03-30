import { articles } from "../data/articles";
import "./home.css";

function Home() {

  const news = articles.filter(a => a.category === "news").slice(0,3);
  const lifestyle = articles.filter(a => a.category === "lifestyle").slice(0,3);
  const sport = articles.filter(a => a.category === "sport").slice(0,3);

  return (
    <div className="home-container">

      <h2>News</h2>
      <div className="article-grid">
        {news.map(article => (
          <div className="article-card" key={article.id}>
            <img src={article.image} alt={article.title}/>
            <h3>{article.title}</h3>
          </div>
        ))}
      </div>

      <h2>Lifestyle</h2>
      <div className="article-grid">
        {lifestyle.map(article => (
          <div className="article-card" key={article.id}>
            <img src={article.image} alt={article.title}/>
            <h3>{article.title}</h3>
          </div>
        ))}
      </div>

      <h2>Sport & E-Sport</h2>
      <div className="article-grid">
        {sport.map(article => (
          <div className="article-card" key={article.id}>
            <img src={article.image} alt={article.title}/>
            <h3>{article.title}</h3>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;