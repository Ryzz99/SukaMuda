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
import Notifications from './pages/Notifications';
import Write from './pages/Write';
import WriteSuccess from './pages/WriteSuccess';
import Rules from './pages/Rules';
import Terms from './pages/Terms';
import Help from './pages/Help'; // 2. Tambah import ini

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
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/write" element={<Write />} />
          <Route path="/write-success" element={<WriteSuccess />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/help" element={<Help />} /> {/* 3. Tambah route ini */}
        </Routes>

        <Footer /> 
      </div>
    </AuthProvider>
  );
}

export default App;