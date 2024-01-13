import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';



function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // remove user auth from cache
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to the sign-in/register page
    navigate('/');
  };

  // Read user information from cache
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('User Information:', user);

  return (
    <nav className="navbar">
      <Link to="/" className="link-style">
        <div className="logo-container">
          <img src="https://img.icons8.com/doodle/48/potato--v1.png" alt="Home" className="logo" />
          <h2 className='site-title'>Rotten Potatoes</h2>
        </div>
      </Link>
  
      <nav className='drop-down'>
        <label htmlFor="touch">
          <span className='nav-button' onClick={() => user ? null : navigate('/signin-register')}>
            {user ? (
              <div className="user-profile">
                <CgProfile size={24} style={{ marginRight: '0.5em', verticalAlign: 'middle' }} />
                {user.username}
              </div>
            ) : 'Sign In'}
          </span>
        </label>
  
        {user && (
          <>
            <ul className="slide">
              <li href="#" onClick={() => navigate('/profile')}>Profile</li>
              <li href="#" onClick={handleLogout}>Logout</li>
              {user.isAdmin && (
                <li href="#" onClick={() => navigate('/admin')}>Admin</li>
              )}
            </ul>
          </>
        )}
      </nav>
    </nav>
  );
}

export default NavBar;

