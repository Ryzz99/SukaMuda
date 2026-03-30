import React from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/interests');
  };

 return (
    <div className="register-container">
      <div className="register-card">
        <button className="back-button" onClick={() => navigate('/')}>
          ←
        </button>

        <h2>Welcome to SUKAMUDA</h2>
        
        <form className="register-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Name</label>
            <input type="text" placeholder="Name" />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Email" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Password" />
          </div>

          <div className="input-group">
            <label>Confirmation Password</label>
            <input type="password" placeholder="Password" />
          </div>

          <div className="register-actions">
            <button 
              type="button" 
              className="btn-masuk-reg" 
              onClick={() => navigate('/login')}
            >
              Masuk
            </button>
            {/* Tombol Daftar ini yang akan memicu onSubmit di atas */}
            <button type="submit" className="btn-daftar-reg">
              Daftar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;