import React, { useMemo, useState } from "react";
import "./Interests.css";
import { useNavigate, useLocation } from "react-router-dom"; // <-- TAMBAH useLocation
import { categories } from "../data/articles";

const Interests = () => {
  const navigate = useNavigate();
  const location = useLocation();              // <-- TAMBAH INI
  const registerData = location.state || {};    // <-- TAMBAH INI
  const [selected, setSelected] = useState([]);

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

  return (
    <div className="interests-page">
      {/* Decorative */}
      <div className="deco-blob deco-blob-1"></div>
      <div className="deco-blob deco-blob-2"></div>

      <div className="interests-card">
        {/* Header */}
        <div className="card-header">
          <div className="card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h1 className="card-title">Pilih Minat Anda</h1>
          <p className="card-subtitle">
            Pilih satu atau lebih kategori untuk menemukan artikel yang relevan dengan Anda.
          </p>
        </div>

        {/* Tags */}
        <div className="tags-grid">
          {interestOptions.map((item, index) => {
            const isActive = selected.includes(item.slug);
            return (
              <button
                key={item.slug}
                className={`tag-btn ${isActive ? "tag-active" : ""}`}
                onClick={() => toggleInterest(item.slug)}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <span className="tag-text">{item.label}</span>
                <span className="tag-icon">
                  {isActive ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Count */}
        {selected.length > 0 && (
          <div className="selected-count">
            <span className="count-dot"></span>
            <span>{selected.length} kategori dipilih</span>
          </div>
        )}

        {/* Actions */}
        <div className="card-actions">
          {/* ✅ BENERIN: lempar registerData ke Success */}
          <button className="btn-skip" onClick={() => navigate("/success", { state: registerData })}>
            Lewati
          </button>
          <button
            className={`btn-next ${selected.length > 0 ? "btn-next-active" : ""}`}
            onClick={() => navigate("/success", { state: registerData })}  
            disabled={selected.length === 0}
          >
            <span>Selanjutnya</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Interests;