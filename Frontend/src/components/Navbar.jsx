import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          PlantAI
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-menu-item">Home</Link>
          <Link to="/about" className="navbar-menu-item">About</Link>
          <Link to="/features" className="navbar-menu-item">Features</Link>
          {isLoggedIn && (
            <Link to="/dashboard" className="navbar-menu-item">Dashboard</Link>
          )}
        </div>

        <div className="navbar-auth">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="btn btn-outline">Dashboard</Link>
              <button onClick={handleLogout} className="btn btn-primary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>

        <div className="navbar-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </div>
      </div>

      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <Link to="/" className="mobile-menu-item">Home</Link>
        <Link to="/about" className="mobile-menu-item">About</Link>
        <Link to="/features" className="mobile-menu-item">Features</Link>
        {isLoggedIn && (
          <>
            <Link to="/dashboard" className="mobile-menu-item">Dashboard</Link>
            <button onClick={handleLogout} className="mobile-menu-item">Logout</button>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Link to="/login" className="mobile-menu-item">Login</Link>
            <Link to="/signup" className="mobile-menu-item">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
