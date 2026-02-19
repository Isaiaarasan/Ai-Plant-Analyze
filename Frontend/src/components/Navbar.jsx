import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';


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
    <nav className="sticky top-0 w-full bg-white dark:bg-gray-900 shadow-sm z-50 transition-colors duration-300">
      <div className="container flex justify-between items-center h-[70px] px-4 md:px-8 mx-auto">
        <Link to="/" className="flex items-center text-xl font-bold text-primary">
          PlantAI
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-base font-medium text-text hover:text-primary transition-colors">Home</Link>
          <Link to="/about" className="text-base font-medium text-text hover:text-primary transition-colors">About</Link>
          <Link to="/features" className="text-base font-medium text-text hover:text-primary transition-colors">Features</Link>
          {isLoggedIn && (
            <Link to="/dashboard" className="text-base font-medium text-text hover:text-primary transition-colors">Dashboard</Link>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Toggle */}
        <div className="md:hidden text-2xl cursor-pointer text-text" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed top-[70px] left-0 w-full bg-white dark:bg-gray-900 shadow-md py-4 z-40 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <Link to="/" className="block px-8 py-4 text-base font-medium text-text hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors">Home</Link>
        <Link to="/about" className="block px-8 py-4 text-base font-medium text-text hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors">About</Link>
        <Link to="/features" className="block px-8 py-4 text-base font-medium text-text hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors">Features</Link>
        {isLoggedIn && (
          <>
            <Link to="/dashboard" className="block px-8 py-4 text-base font-medium text-text hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors">Dashboard</Link>
            <button onClick={handleLogout} className="block w-full text-left px-8 py-4 text-base font-medium text-text hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors">Logout</button>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Link to="/login" className="block px-8 py-4 text-base font-medium text-text hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors">Login</Link>
            <Link to="/signup" className="block px-8 py-4 text-base font-medium text-text hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );

};

export default Navbar;
