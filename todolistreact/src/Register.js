import React, { useState } from 'react';
import { register } from './authService';
import './Auth.css';

const Register = ({ onRegister, onSwitchToLogin, addLog }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
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

    addLog && addLog(`Registration attempt for user: ${formData.username}`, 'debug');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      addLog && addLog('Registration failed: Passwords do not match', 'error');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      addLog && addLog('Registration failed: Password too short', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await register({
        username: formData.username,
        password: formData.password
      });
      localStorage.setItem('token', response.token);
      addLog && addLog(`Registration successful for user: ${formData.username}`, 'success');
      onRegister(response.token);
    } catch (err) {
      setError('Registration failed. Username might already exist.');
      addLog && addLog(`Registration failed for user: ${formData.username} - ${err && err.message ? err.message : err}`, 'error');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>📝 Register</h2>
        
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
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              className="auth-input"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !formData.username || !formData.password || !formData.confirmPassword}
            className="auth-button"
          >
            {loading ? 'Creating Account...' : '✨ Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={onSwitchToLogin}
            className="switch-button"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
