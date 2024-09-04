// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // We'll create this CSS file for Navbar-specific styles

function Navbar() {
  const isAuthenticated = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MySocialApp
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links button">
              Home
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/create-post" className="nav-links button">
                  Create Post
                </Link>
              </li>
              <li className="nav-item">
                <Link to={`/profile/${username}`} className="nav-links button">
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-links logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links button">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links button">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
