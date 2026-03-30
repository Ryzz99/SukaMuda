import React, { useState } from 'react';
import './Interests.css';
import { useNavigate } from 'react-router-dom';

const Interests = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const interests = [
    "Music & Film", "HEALTH", "HOBBY", 
    "SPORT", "GADGET", "Automotive", 
    "Science", "Livestyle", "NEWS"
  ];

  const toggleInterest = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <div className="interests-container">
      <div className="interests-card">
        <h2>Your Interests</h2>
        
        <div className="interests-grid">
          {interests.map((item) => (
            <button 
              key={item} 
              className={`interest-tag ${selected.includes(item) ? 'active' : ''}`}
              onClick={() => toggleInterest(item)}
            >
              {item} <span>+</span>
            </button>
          ))}
        </div>

        <div className="interests-actions">
          <button className="btn-lewati" onClick={() => navigate('/success')}>Lewati</button>
          <button className="btn-selanjutnya" onClick={() => navigate('/success')}>
            Selanjutnya <span>❯</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Interests;