import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // 1. Tambah import ini
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Interests from './pages/interests';
import Success from './pages/Success';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar /> 

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/success" element={<Success />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        {/* 2. Tambah Footer di sini */}
        <Footer /> 
      </div>
    </AuthProvider>
  );
}

export default App;