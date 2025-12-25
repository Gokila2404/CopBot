import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const loggedIn = isLoggedIn;
  const adminLoggedIn = !!localStorage.getItem('adminAuth'); // ✅ check admin login

  const handleLogout = () => {
    if (adminLoggedIn) {
      localStorage.removeItem('adminAuth');
      navigate('/admin/login');
    } else {
      // use context logout so state updates and components re-render
      logout();
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="CopBotChatBox" className="logo-img" />CopBot
        </Link>
      </div>

      <ul className="nav-links">
        {!adminLoggedIn && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/complaint-register">Register Complaint</Link></li>
            <li><Link to="/track-case">Track Case</Link></li>
            <li><Link to="/chatbot">Chatbot</Link></li>
            {loggedIn && (
              <>
                <li><Link to="/profile">Profile</Link></li>
              </>
            )}
          </>
        )}

        {/* ✅ Admin Navigation Links */}
        {adminLoggedIn && (
          <>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/manage-users">Manage Users</Link></li>
            <li><Link to="/admin/reports">Reports</Link></li>
          </>
        )}
      </ul>

      <div className="auth-buttons">
        {/* Normal user buttons */}
        {!loggedIn && !adminLoggedIn && (
          <>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Register</Link>
            <Link to="/admin" className="admin-btn">Admin Login</Link> {/* ✅ Added */}
          </>
        )}

        {/* Logged-in user or admin logout */}
        {(loggedIn || adminLoggedIn) && (
          <button onClick={handleLogout} className="register-btn">
            Logout
          </button>
        )}

        
      </div>
    </nav>
  );
};

export default Navbar;
