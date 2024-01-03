// NavBar.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // Import the CSS file

function NavBar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    // remove user auth from cache
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to the sign-in/register page
    navigate('/');
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Read user information from cache
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="navbar">
      <Link to="/">
        <img src="temp-logo.png" alt="Home" className="logo" />
      </Link>

      <div className="dropdown-container">
        {user && (
          <button className="dropdown-button" onClick={handleToggleDropdown}>
            {user.username}
          </button>
        )}

        {/* This is the users drop down menu, TODO add more things maybe */}
        {/* When user is logged in display this on top right nav */}
        {user && isDropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={handleLogout}>Logout</button>
            <button onClick={() => navigate('/profile')}>Profile</button>
          </div>
        )}
      </div>

      {/* When user is not logged in display this */}
      {!user && (
        <Link to="/signin-register" style={{ marginRight: '10px', textDecoration: 'none', color: 'white' }}>
          <button>Sign In/Register</button>
        </Link>
      )}
    </nav>
  );
}

export default NavBar;
