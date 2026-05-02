import { useState } from 'react';
import parkingAPI from '../api/parkingApi';
import './Login.css';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await parkingAPI.getToken(username, password);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-icon">🅿️</div>
            <h1>Smart Parking</h1>
            <p className="subtitle">Reserve your spot in seconds</p>
          </div>

          {error && <div className="error-message">
            <span className="error-icon">⚠️</span> {error}
          </div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              <span className="btn-icon">→</span>
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <a href="#">Sign up here</a></p>
          </div>
        </div>

        <div className="login-side">
          <div className="feature">
            <span className="feature-icon">⚡</span>
            <h3>Fast Booking</h3>
            <p>Reserve parking in seconds</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📍</span>
            <h3>Real-time Updates</h3>
            <p>Live slot availability</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💳</span>
            <h3>Easy Payment</h3>
            <p>Secure transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
