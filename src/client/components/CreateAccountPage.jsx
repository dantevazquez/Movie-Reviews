import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignInRegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/auth/login', { username, password });
      const { token, user } = response.data;
      console.log(response.data);

      // Save token and user information to cache
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to the home page
      window.alert('User succesfully logged in!')
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      window.alert('Login unsuccessful. Please check your credentials and try again.');
    }
  };

  return (
    <div>
      <h2>Sign In / Register</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>

      <p>Don't have an account? <Link to="/create-account">Create Account</Link></p>
    </div>
  );
}

export default SignInRegisterPage;
