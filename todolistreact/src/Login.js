import React, { useState } from 'react';
import { login } from './authService';
import './Auth.css';

const Login = ({ onLogin, onSwitchToRegister, addLog }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    addLog && addLog(`Login attempt for user: ${formData.username}`, 'debug');

    try {
      const response = await login(formData);
      localStorage.setItem('token', response.token);
      addLog && addLog(`Login successful for user: ${formData.username}`, 'success');
      onLogin(response.token);
    } catch (err) {
      setError('Invalid username or password');
      addLog && addLog(`Login failed for user: ${formData.username} - ${err && err.message ? err.message : err}`, 'error');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>🔐 Login</h2>
        
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="auth-input"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !formData.username || !formData.password}
            className="auth-button"
          >
            {loading ? 'Logging in...' : '🚀 Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <button 
            type="button" 
            onClick={onSwitchToRegister}
            className="switch-button"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
