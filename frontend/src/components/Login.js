// src/components/Login.js
import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (!email || !password) {
        alert('Email and Password are required!');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/users/login', {
          email,
          password,
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        console.log(response.data);
        window.location.href = '/';
      } catch (error) {
        console.error('There was an error logging in!', error);
        alert('Invalid credentials or an error occurred. Please try again.');
      }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <div className="input-group">
          <label htmlFor="email" className="login-label">Email</label>
          <input
            type="email"
            id="email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password" className="login-label">Password</label>
          <input
            type="password"
            id="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        <p className="login-footer">
          Don't have an account? <a href="/register" className="register-link">Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
