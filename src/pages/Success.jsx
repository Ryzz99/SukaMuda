import React from 'react';
import './Success.css';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="success-container">
      <div className="success-card">
        <h2>Welcome to SUKAMUDA</h2>
        
        <p className="welcome-text">
          Hallo Zakiyya, Selamat datang di Sukamuda! 
          Ruang berbagi cerita, inspirasi, dan informasi yang 
          menghadirkan berbagai kisah menarik, wawasan, 
          serta semangat kebersamaan untuk semua pembaca.
        </p>

        <div className="check-icon-container">
          <div className="check-circle">
            <span className="check-mark">L</span>
          </div>
        </div>

        <button className="btn-final-selanjutnya" onClick={() => navigate('/')}>
          Selanjutnya <span>❯</span>
        </button>
      </div>
    </div>
  );
};

export default Success;