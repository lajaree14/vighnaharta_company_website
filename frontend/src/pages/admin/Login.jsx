import React, { useState } from 'react';
import logo from '../../assets/images/Company_logo.png';
import './login.css';

// TEMPORARY demo login, used until the Laravel backend exists.
// Matches the admin seeder from earlier: admin@vighnaharta.com / ChangeMe@123
// TODO (backend): replace this with a real POST /api/admin/login call (see AuthController.php)
const DEMO_EMAIL = 'admin@vighnaharta.com';
const DEMO_PASSWORD = 'ChangeMe@123';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    // Small delay so it feels like a real request. Swap this block for an
    // axios call to /api/admin/login once the backend exists.
    setTimeout(() => {
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
        onLogin({ name: 'Admin', email: DEMO_EMAIL });
      } else {
        setError('Invalid email or password.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-brand">
          <img src={logo} alt="logo" className="login-logo" />
          <div>
            <h1>Vighnaharta Construction</h1>
            <p>Sign in to the admin panel</p>
          </div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <div className="form-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vighnaharta.com"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>
            <div className="password-row">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary login-submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="login-hint">
          Demo login: <strong>{DEMO_EMAIL}</strong> / <strong>{DEMO_PASSWORD}</strong>
        </p>
      </form>
    </div>
  );
};

export default Login;