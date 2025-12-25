import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { AuthContext } from '../context/AuthContext';

interface User {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Send OTP to user
  const handleSendOtp = () => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      setMessage('Invalid email or password.');
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    setMessage(`OTP sent successfully! (Demo OTP: ${newOtp})`);
  };

  // Verify OTP and login
  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find(u => u.email === email);

      if (currentUser) {
        login(currentUser); // Update AuthContext state
        setOtpVerified(true);
        setMessage('Login successful! Redirecting to home...');

        // ✅ Redirect directly to home page
        setTimeout(() => navigate('/'), 1000);
      }
    } else {
      setMessage('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={otpSent && !otpVerified}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={otpSent && !otpVerified}
            placeholder="Enter your password"
            required
          />
        </div>

        {!otpSent && (
          <button
            type="button"
            className="auth-btn"
            onClick={handleSendOtp}
            disabled={!email || !password}
          >
            Send OTP
          </button>
        )}

        {otpSent && !otpVerified && (
          <>
            <div className="input-group">
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
            </div>
            <button
              type="button"
              className="auth-btn"
              onClick={handleVerifyOtp}
              disabled={!otp}
            >
              Verify OTP
            </button>
          </>
        )}

        {message && <p className="auth-footer">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
