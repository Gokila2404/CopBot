import React, { useState } from "react";
import { FaBell, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./admin.css";

interface Props {
  onLogout: () => void;
}

const AdminHeader: React.FC<Props> = ({ onLogout }) => {
  const adminEmail = localStorage.getItem("adminEmail") || "admin@portal.com";
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.classList.toggle("mobile-menu-open");
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="icon-btn mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="portal-logo">🛡️</div>
        <div className="portal-title">Police Admin Portal</div>
      </div>

      <div className="header-center">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input placeholder="Search cases, users, chats..." />
        </div>
      </div>

      <div className="header-right">
        <div className="notification">
          <button className="icon-btn" title="Notifications">
            <FaBell />
            <span className="notif-badge">3</span>
          </button>
        </div>
        <div className="admin-name">{adminEmail}</div>
        <div className="profile-dropdown">
          <button className="profile-btn">Admin ▾</button>
          <div className="profile-menu">
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={() => navigate("/change-password")}>Change Password</button>
            <button className="danger" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
