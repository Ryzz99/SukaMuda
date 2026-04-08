import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const notifications = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    user: i % 2 === 0 ? "Nays" : "Haris",
    action: i % 2 === 0 ? "liked your article" : "liked your article",
  }));

  return (
    <div className="notif-page-wrapper">
      <div className="notif-container">
        {/* Header: Tombol back dan Judul */}
        <header className="notif-header-section">
          <button className="btn-back-notif" onClick={() => navigate(-1)}>
            ←
          </button>
          <h2 className="notif-page-title">NOTIFICATION</h2>
        </header>

        {/* List Notifikasi (Ini bagian yang kamu minta pindahin) */}
        <main className="notif-main-content">
          <div className="notif-list-id" id="notifications">
            {notifications.map((item) => (
              <div className="notif-row-item" key={item.id}>
                <div className="notif-avatar-circle">👤</div>
                <div className="notif-bubble-box">
                  <strong>{item.user}</strong> {item.action}
                </div>
                <div className="notif-note-icon">📄</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;