import { articles } from "./articles";

const STORAGE_KEY = "sukamuda.userArticles";

export function getStoredArticles() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export function saveStoredArticles(items) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function saveArticle(article) {
  const current = getStoredArticles();
  const next = [article, ...current];
  saveStoredArticles(next);
  return article;
}

export function getAllArticles() {
  return [...getStoredArticles(), ...articles];
}

export function getArticleById(id) {
  const lookup = String(id);
  return getAllArticles().find((item) => String(item.id) === lookup);
}
