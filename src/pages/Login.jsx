import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login();
    navigate('/');
  };

return (
  <div className="login-container">
      <div className="login-card">
        <button className="back-button" onClick={() => navigate('/')}>
          ←
        </button>

        <h2>Welcome to SUKAMUDA</h2>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Email" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Password" />
          </div>

          <p className="forgot-password">Lupa Password</p>

          <div className="login-actions">
            <button type="submit" className="btn-masuk-login">Masuk</button>
            {/* Tombol Daftar sekarang mengarah ke halaman register */}
            <button 
              type="button" 
              className="btn-daftar-login" 
              onClick={() => navigate('/register')}
            >
              Daftar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;