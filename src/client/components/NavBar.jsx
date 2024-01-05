import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

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
  console.log('User Information:', user);

  return (
    <nav className="navbar">
      <Link to="/" className="link-style">
        <div className="logo-container">
          <img src="https://img.icons8.com/doodle/48/potato--v1.png" alt="Home" className="logo" />
          <h2>Rotten Potatoes</h2>
        </div>
      </Link>


      <div className="dropdown-container">
        {user && (
          <button className="dropdown-button-main" onClick={handleToggleDropdown}>
            {user.username}
          </button>
        )}

        {/* This is the users drop-down menu */}
        {user && isDropdownOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-button" onClick={() => navigate('/profile')}>Profile</button>
            <button className="dropdown-button" onClick={handleLogout}>Logout</button>
            {user.isAdmin && (
              <Link to="/admin">
                <button className="dropdown-button">Admin</button>
              </Link>
            )}
          </div>
        )}

        {/* When user is not logged in display this */}
        {!user && (
          <Link to="/signin-register">
            <button className="dropdown-button-main">Sign In</button>
          </Link>
        )}
      </div>


    </nav>
  );
}

export default NavBar;

