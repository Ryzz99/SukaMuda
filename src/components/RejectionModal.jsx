import React, { useState } from 'react';
import './RejectionModal.css';

const RejectionModal = ({ isOpen, articleTitle, onConfirm, onCancel, isLoading }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      alert('Mohon masukkan alasan penolakan');
      return;
    }
    onConfirm(reason);
    setReason('');
  };

  const handleCancel = () => {
    setReason('');
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="rejection-modal-overlay">
      <div className="rejection-modal">
        <div className="rejection-modal-header">
          <h3>Tolak Artikel</h3>
          <button className="rejection-modal-close" onClick={handleCancel}>
            ✕
          </button>
        </div>

        <div className="rejection-modal-content">
          <p className="article-title-label">Artikel: <strong>{articleTitle}</strong></p>
          
          <label htmlFor="rejection-reason" className="rejection-reason-label">
            Alasan Penolakan:
          </label>
          <textarea
            id="rejection-reason"
            className="rejection-reason-textarea"
            placeholder="Jelaskan mengapa artikel ini ditolak..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={1000}
            disabled={isLoading}
          />
          <p className="char-count">{reason.length}/1000</p>
        </div>

        <div className="rejection-modal-footer">
          <button
            className="btn-cancel"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            className="btn-reject"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Tolak Artikel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal;
