import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (!nationalId) {
      setMessage('Enter your National ID first.');
      return;
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    setMessage(`OTP sent successfully! (Demo OTP: ${newOtp})`);
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true);
      setMessage('National ID verified successfully!');
    } else {
      setMessage('Invalid OTP. Please try again.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerified) {
      setMessage('Verify your National ID before registering.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({ name, email, phone, password, nationalId });
    localStorage.setItem('users', JSON.stringify(users));

    setMessage('Registration successful!');
    navigate('/profile'); // redirect to profile after registration
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>National ID</label>
            <input type="text" value={nationalId} onChange={e => setNationalId(e.target.value)} required disabled={otpVerified} />
          </div>

          {!otpVerified && (
            <>
              {!otpSent ? (
                <button type="button" className="auth-btn" onClick={handleSendOtp}>Send OTP</button>
              ) : (
                <div className="input-group">
                  <label>Enter OTP</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required />
                  <button type="button" className="auth-btn" onClick={handleVerifyOtp}>Verify OTP</button>
                </div>
              )}
            </>
          )}

          <button type="submit" className="auth-btn" disabled={!otpVerified}>Register</button>
        </form>

        {message && <p className="auth-footer">{message}</p>}
      </div>
    </div>
  );
};

export default Register;
