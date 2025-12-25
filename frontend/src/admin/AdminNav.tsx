import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaFolderOpen, FaUserShield, FaCog, FaSignOutAlt } from "react-icons/fa";
import "./admin.css";

interface AdminNavProps {
  onLogout: () => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const adminEmail = localStorage.getItem("adminEmail") || "admin@portal.com";
  const adminRole = localStorage.getItem("adminRole") || "admin"; // roles: admin | officer | super | officer_manager

  const hasRole = (allowed?: string[]) => {
    if (!allowed || allowed.length === 0) return true;
    return allowed.includes(adminRole);
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    // Handle home route specially - match /admin or /admin/home
    if (path === "home") {
      return currentPath === "/admin" || currentPath === "/admin/" || currentPath === "/admin/home";
    }
    // For other routes, check exact match or starts with
    return currentPath === `/admin/${path}` || currentPath.startsWith(`/admin/${path}/`);
  };

  useEffect(() => {
    if (collapsed) document.body.classList.add("admin-collapsed");
    else document.body.classList.remove("admin-collapsed");
    return () => document.body.classList.remove("admin-collapsed");
  }, [collapsed]);

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    if (window.innerWidth <= 968) {
      document.body.classList.remove("mobile-menu-open");
    }
  };

  return (
    <div className={`admin-app-nav ${collapsed ? "collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div>
            <div className="logo">🛡️ Police Admin</div>
            <div className="logo-sub">Case Management System</div>
          </div>
          <button
            className="collapse-btn"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        <nav className="sidebar-body">
          <ul className="sidebar-section">
            <li className="section-title">Main</li>
            <li className={`sidebar-item ${isActive("home") ? "active" : ""}`} title="Home">
              <Link to="home" onClick={handleLinkClick}><FaTachometerAlt style={{ marginRight: 8 }} />Home</Link>
            </li>
          </ul>

          <ul className="sidebar-section">
            <li className="section-title">Cases</li>
            <li className={`sidebar-item ${isActive("cases/all") ? "active" : ""}`} title="All Cases"><Link to="cases/all" onClick={handleLinkClick}><FaFolderOpen style={{ marginRight: 8 }} />All Cases</Link></li>
            <li className={`sidebar-item ${isActive("cases/solved") ? "active" : ""}`} title="Solved Cases"><Link to="cases/solved" onClick={handleLinkClick}>Solved Cases</Link></li>
            <li className={`sidebar-item ${isActive("cases/in-progress") ? "active" : ""}`} title="In Progress"><Link to="cases/in-progress" onClick={handleLinkClick}>In Progress</Link></li>
            <li className={`sidebar-item ${isActive("cases/pending") ? "active" : ""}`} title="Pending"><Link to="cases/pending" onClick={handleLinkClick}>Pending</Link></li>
          </ul>

          <ul className="sidebar-section">
            <li className="section-title">Users</li>
            <li className={`sidebar-item ${isActive("users") ? "active" : ""}`} title="Registered Users"><Link to="users" onClick={handleLinkClick}><FaUserShield style={{ marginRight: 8 }} />Registered Users</Link></li>
          </ul>

          {hasRole(["admin", "super"]) && (
            <ul className="sidebar-section">
              <li className="section-title">Settings</li>
              <li className={`sidebar-item ${isActive("settings/areas") ? "active" : ""}`} title="Areas"><Link to="settings/areas" onClick={handleLinkClick}><FaCog style={{ marginRight: 8 }} />Areas</Link></li>
              <li className={`sidebar-item ${isActive("settings/stations") ? "active" : ""}`} title="Stations"><Link to="settings/stations" onClick={handleLinkClick}>Stations</Link></li>
              <li className={`sidebar-item ${isActive("settings/officers") ? "active" : ""}`} title="Officers"><Link to="settings/officers" onClick={handleLinkClick}>Officers</Link></li>
              <li className={`sidebar-item ${isActive("settings/system") ? "active" : ""}`} title="System Settings"><Link to="settings/system" onClick={handleLinkClick}>System</Link></li>
            </ul>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <div className="admin-email">{adminEmail}</div>
            <div className="admin-role" style={{ fontSize: 12, color: '#9aa9bd' }}>{adminRole}</div>
          </div>
          <div className="logout-actions">
            <button className="btn logout-btn" onClick={onLogout} title="Logout">
              <FaSignOutAlt style={{ marginRight: 6 }} />Logout
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AdminNav;

