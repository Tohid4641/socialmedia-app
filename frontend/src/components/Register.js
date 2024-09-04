// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !email || !password) {
      alert('All fields are required!');
      return;
    }
  
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        username,
        email,
        password,
      });
      console.log(response.data);
      window.location.href = '/login';
    } catch (error) {
      console.error('There was an error registering!', error);
      alert('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-title">Register</h2>
        <div className="input-group">
          <label htmlFor="username" className="register-label">Username</label>
          <input
            type="text"
            id="username"
            className="register-input"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email" className="register-label">Email</label>
          <input
            type="email"
            id="email"
            className="register-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password" className="register-label">Password</label>
          <input
            type="password"
            id="password"
            className="register-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="register-button">Register</button>
        <p className="register-footer">
          Already have an account? <a href="/login" className="login-link">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
