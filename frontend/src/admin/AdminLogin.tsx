import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./admin.css";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  // Default admin credentials
  const ADMIN_EMAIL = "admin@example.com";
  const ADMIN_PASSWORD = "admin123";

  useEffect(() => {
    // Check if already logged in
    if (localStorage.getItem("adminLoggedIn") === "true") {
      navigate("/admin/home");
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("adminEmail", email);
      const from = location.state?.from?.pathname || "/admin/home";
      navigate(from);
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
          />
        </div>
        <form onSubmit={handleLogin}>
          <button type="submit" className="btn primary-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
