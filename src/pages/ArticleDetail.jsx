import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { categories } from "../data/articles";
import "./ArticleDetail.css";

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ArticleDetail = () => {
  const { id } = useParams();
  const { isLoggedIn, user } = useAuth();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copyText, setCopyText] = useState("Salin");
  const [showShareFloat, setShowShareFloat] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [commentSort, setCommentSort] = useState("latest");
  const [viewCount, setViewCount] = useState(0);
  const contentRef = useRef(null);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  // 1. Fetch articles dari cache
  const { data: allArticles = [], isLoading: articleLoading } = useQuery({
    queryKey: ['publicArticles'],
    queryFn: async () => {
      const res = await axios.get('/api/public-articles');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // 2. Fetch komentar
  const { data: initialComments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const res = await axios.get(`/api/articles/${id}/comments`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (initialComments.length > 0 && comments.length === 0) {
      setComments(initialComments);
    }
  }, [initialComments]);

  // Cari artikel spesifik dari cache
  useEffect(() => {
    const found = allArticles.find((item) => String(item.id) === String(id));
    setArticle(found || null);

    if (found) {
      setLikeCount(found.likes_count || 0);
      setIsLiked(found.is_liked_by_user || false);
      setIsBookmarked(found.is_bookmarked_by_user || false);
      setViewCount(found.views_count || 0);
    }
    window.scrollTo(0, 0);
  }, [id, allArticles]);

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setReadProgress(Math.min(progress, 100));
      setShowBackTop(scrollTop > 600);
      setShowShareFloat(scrollTop > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const response = await axios.post(`/api/articles/${id}/comments`, {
        body: newComment,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      alert("Gagal mengirim komentar.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Yakin mau hapus komentar ini?")) {
      try {
        await axios.delete(`/api/comments/${commentId}`);
        setComments(comments.filter((c) => c.id !== commentId));
      } catch (error) {
        alert("Gagal menghapus komentar.");
      }
    }
  };

  const getReadingTime = (text) => {
    if (!text) return "< 1 menit baca";
    const wordCount = text.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return `${Math.ceil(wordCount / 200)} menit baca`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyText("Tersalin!");
    setTimeout(() => setCopyText("Salin"), 2000);
  };

  const handleLike = async () => {
    if (!isLoggedIn)
      return alert("Kamu harus login dulu untuk menyukai artikel ini.");

    const prevLiked = isLiked;
    const prevCount = likeCount;

    try {
      setIsLiked(!prevLiked);
      setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);
      const res = await axios.post(`/api/articles/${id}/like`);
      setLikeCount(res.data.likes_count);
    } catch (error) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  const handleBookmark = async () => {
    if (!isLoggedIn)
      return alert("Kamu harus login dulu untuk menyimpan artikel ini.");

    const prev = isBookmarked;
    setIsBookmarked(!prev);
    try {
      await axios.post(`/api/articles/${id}/bookmark`);
    } catch {
      setIsBookmarked(prev);
    }
  };

  const handlePrint = () => window.print();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const sortedComments = [...comments].sort((a, b) =>
    commentSort === "latest"
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at)
  );

  if (articleLoading || commentsLoading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Menyelami berita...</p>
      </div>
    );
    
  if (!article)
    return (
      <div className="error-container">
        <h2>Waduh!</h2>
        <p>Artikelnya nggak ketemu, Bi.</p>
        <Link to="/">Balik ke Home</Link>
      </div>
    );

  const categoryLabel =
    categories.find((item) => item.slug === article.category)?.label ||
    article.category;
  const relatedArticles = allArticles
    .filter(
      (item) =>
        item.category === article.category && String(item.id) !== String(id)
    )
    .slice(0, 3);

  const imageUrl = article.image
    ? article.image.startsWith("http")
      ? article.image
      : `${baseUrl}/storage/${article.image}`
    : "http://via.placeholder.com/1200x600";

  const tagsArray = article.tags
    ? typeof article.tags === "string"
      ? article.tags
          .split(/[ ,#]+/)
          .filter((t) => t.trim() !== "")
          .map((t) => t.trim())
      : article.tags
    : [];

  const isDraft = article.status === "draft";

  const encodedTitle = encodeURIComponent(article.title);
  const encodedUrl = encodeURIComponent(shareUrl);

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="reading-progress-bar" style={{ width: `${readProgress}%` }} />

      {/* Back to Top */}
      <button
        className={`back-to-top ${showBackTop ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Kembali ke atas"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>

      <div className="article-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </Link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <Link to={`/category/${article.category}`}>{categoryLabel}</Link>
        </nav>

        {/* Header */}
        <header className="article-header">
          <div className="header-top-row">
            <span className="badge-category">{categoryLabel}</span>
            {isDraft && (
              <span className="badge-draft">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Draf
              </span>
            )}
            <div className="view-count">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {viewCount.toLocaleString("id-ID")}
            </div>
          </div>

          <h1 className="article-title">{article.title}</h1>

          {article.summary && (
            <p className="article-summary">"{article.summary}"</p>
          )}

          <div className="author-meta">
            <div className="author-avatar">
              {article.user?.avatar ? (
                <img
                  src={
                    article.user.avatar.startsWith("http")
                      ? article.user.avatar
                      : `${baseUrl}/storage/${article.user.avatar}`
                  }
                  alt={article.user?.name}
                />
              ) : (
                article.user?.name?.charAt(0) || "A"
              )}
            </div>
            <div className="author-info">
              <span className="author-name">
                {article.user?.name || "Anonim"}
              </span>
              <div className="meta-bottom">
                <span className="publish-date">
                  {new Date(article.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="meta-dot">·</span>
                <span className="read-time">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {getReadingTime(article.content)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="hero-wrapper">
          <img src={imageUrl} alt={article.title} className="hero-img" loading="lazy" />
          {article.image_caption && (
            <span className="image-caption">{article.image_caption}</span>
          )}
        </div>

        <div className="main-content-wrapper">
          {/* Floating Share (Desktop) */}
          <div className={`floating-share ${showShareFloat ? "visible" : ""}`}>
            <button className="float-share-btn" onClick={handleLike} title="Suka">
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isLiked ? "#d83a34" : "none"} stroke={isLiked ? "#d83a34" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button className="float-share-btn" onClick={handleBookmark} title="Simpan">
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isBookmarked ? "#f59e0b" : "none"} stroke={isBookmarked ? "#f59e0b" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <div className="float-divider" />
            <a href={`http://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="float-share-btn" title="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a href={`http://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="float-share-btn" title="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href={`http://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="float-share-btn" title="X (Twitter)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href={`http://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="float-share-btn" title="Telegram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0088cc">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
            <a href={`http://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="float-share-btn" title="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a66c2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <div className="float-divider" />
            <button className="float-share-btn" onClick={handlePrint} title="Cetak">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
            </button>
          </div>

          <article className="content-body" ref={contentRef}>
            {/* Draft Banner */}
            {isDraft && (
              <div className="draft-banner">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <strong>Artikel ini masih berstatus draf</strong>
                  <p>Konten belum dipublikasikan secara resmi dan dapat berubah sewaktu-waktu.</p>
                </div>
              </div>
            )}

            <div
              className="text-render"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {tagsArray.length > 0 && (
              <div className="tags-container">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                {tagsArray.map((tag, i) => (
                  <span key={i} className="tag-chip">#{tag}</span>
                ))}
              </div>
            )}

            {/* Interactions Bar */}
            <div className="interactions-section">
              <div className="interactions-left">
                <button className={`like-btn ${isLiked ? "active" : ""}`} onClick={handleLike}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? "#d83a34" : "none"} stroke="#d83a34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span>{likeCount > 0 ? likeCount : "Suka"}</span>
                </button>

                <button className={`bookmark-btn ${isBookmarked ? "active" : ""}`} onClick={handleBookmark}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isBookmarked ? "#f59e0b" : "none"} stroke={isBookmarked ? "#f59e0b" : "#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{isBookmarked ? "Tersimpan" : "Simpan"}</span>
                </button>
              </div>

              <div className="share-row">
                <span className="share-label">Bagikan:</span>
                <button onClick={() => window.open(`http://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`, "_blank")} className="soc-btn wa" title="WhatsApp">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </button>
                <button onClick={() => window.open(`http://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank")} className="soc-btn fb" title="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </button>
                <button onClick={() => window.open(`http://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, "_blank")} className="soc-btn x" title="X (Twitter)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </button>
                <button onClick={() => window.open(`http://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, "_blank")} className="soc-btn tg" title="Telegram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                </button>
                <button onClick={() => window.open(`http://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, "_blank")} className="soc-btn li" title="LinkedIn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </button>
                <button onClick={() => window.open(`mailto:?subject=${encodedTitle}&body=${encodedUrl}`, "_blank")} className="soc-btn email" title="Email">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </button>
                <button onClick={handleCopyLink} className="soc-btn copy" title="Salin tautan">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <span>{copyText}</span>
                </button>
              </div>
            </div>

            {/* Author Bio Card */}
            {article.user && (
              <div className="author-bio-card">
                <div className="author-bio-avatar">
                  {article.user.avatar ? (
                    <img src={article.user.avatar.startsWith("http") ? article.user.avatar : `${baseUrl}/storage/${article.user.avatar}`} alt={article.user.name} />
                  ) : (
                    article.user.name?.charAt(0) || "A"
                  )}
                </div>
                <div className="author-bio-info">
                  <h4>{article.user.name}</h4>
                  {article.user.bio && <p>{article.user.bio}</p>}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar Komentar */}
          <aside className="discussion-sidebar">
            <div className="sidebar-header">
              <h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Diskusi ({comments.length})
              </h3>
              <div className="comment-sort">
                <button className={commentSort === "latest" ? "active" : ""} onClick={() => setCommentSort("latest")}>Terbaru</button>
                <button className={commentSort === "oldest" ? "active" : ""} onClick={() => setCommentSort("oldest")}>Terlama</button>
              </div>
            </div>

            {isLoggedIn ? (
              <div className="comment-input-box">
                <div className="input-top">
                  <div className="mini-avatar">{user?.name?.charAt(0) || "U"}</div>
                  <span>{user?.name}</span>
                </div>
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Tulis pendapatmu..." rows={3} />
                <div className="input-bottom">
                  <span className="char-count">{newComment.length} karakter</span>
                  <button onClick={handleCommentSubmit} disabled={commentLoading || !newComment.trim()}>
                    {commentLoading ? (
                      <span className="mini-spinner" />
                    ) : (
                      <>Kirim<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg></>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="login-prompt">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d83a34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <p>Mau join diskusi? <Link to="/login">Masuk dulu, Bi!</Link></p>
              </div>
            )}

            <div className="comments-feed">
              {sortedComments.length === 0 && (
                <div className="no-comments">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <p>Belum ada komentar. Jadilah yang pertama!</p>
                </div>
              )}
              {sortedComments.map((com) => (
                <div key={com.id} className="comment-bubble">
                  <div className="comment-header">
                    <div className="comment-user">
                      <div className="comment-avatar">
                        {com.user?.avatar ? (
                          <img src={com.user.avatar.startsWith("http") ? com.user.avatar : `${baseUrl}/storage/${com.user.avatar}`} alt={com.user?.name} />
                        ) : (
                          com.user?.name?.charAt(0) || "U"
                        )}
                      </div>
                      <strong>{com.user?.name}</strong>
                    </div>
                    {(user?.id === com.user_id || user?.role === "admin") && (
                      <button onClick={() => handleDeleteComment(com.id)} className="btn-del" title="Hapus">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p>{com.body}</p>
                  <small>{new Date(com.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</small>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="related-section-new">
            <div className="section-header">
              <h2 className="section-title">Baca Juga</h2>
              <Link to={`/category/${article.category}`} className="see-all-link">
                Lihat Semua
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </div>
            <div className="related-grid-new">
              {relatedArticles.map((item) => (
                <Link className="related-card" key={item.id} to={`/article/${item.id}`}>
                  <div className="related-img-wrap">
                    <img src={item.image?.startsWith("http") ? item.image : `${baseUrl}/storage/${item.image}`} alt={item.title} loading="lazy" />
                    <span className="related-cat">{categories.find((c) => c.slug === item.category)?.label || item.category}</span>
                  </div>
                  <div className="related-text">
                    <h4>{item.title}</h4>
                    <span className="related-date">{new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ArticleDetail;