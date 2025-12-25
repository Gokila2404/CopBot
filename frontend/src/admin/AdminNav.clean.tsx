import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaFolderOpen, FaUserShield, FaFileAlt, FaBell, FaChartBar, FaRobot, FaCog, FaSignOutAlt } from "react-icons/fa";
import "./admin.css";

interface AdminNavProps {
  onLogout: () => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  const adminEmail = localStorage.getItem("adminEmail") || "admin@portal.com";
  const adminRole = localStorage.getItem("adminRole") || "admin"; // roles: admin | officer | super | officer_manager

  const hasRole = (allowed?: string[]) => {
    if (!allowed || allowed.length === 0) return true;
    return allowed.includes(adminRole);
  };

  useEffect(() => {
    if (collapsed) document.body.classList.add("admin-collapsed");
    else document.body.classList.remove("admin-collapsed");
    return () => document.body.classList.remove("admin-collapsed");
  }, [collapsed]);

  return (
    <div className={`admin-app-nav ${collapsed ? "collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">Police Complaint Portal</div>
          <button
            className="collapse-btn"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>

        <nav className="sidebar-body">
          <ul className="sidebar-section">
            <li className="section-title">Navigation</li>
            <li className="sidebar-item" title="Dashboard">
              <Link to="dashboard"><FaTachometerAlt style={{ marginRight: 8 }} />Dashboard</Link>
            </li>
          </ul>

          <ul className="sidebar-section">
            <li className="section-title">Case Management</li>
            <li className="sidebar-item" title="All Cases">
              <Link to="dashboard"><FaFolderOpen style={{ marginRight: 8 }} />All Cases</Link>
            </li>
            <li className="sidebar-item" title="New Complaints">New Complaints</li>
            <li className="sidebar-item" title="Under Investigation">Under Investigation</li>
            <li className="sidebar-item" title="Assigned Cases">Assigned Cases</li>
          </ul>

          <ul className="sidebar-section">
            <li className="section-title">Complainants</li>
            <li className="sidebar-item" title="Citizen List">Citizen List</li>
            <li className="sidebar-item" title="Complaint History">Complaint History</li>
          </ul>

          {hasRole(["admin", "super", "officer_manager"]) && (
            <ul className="sidebar-section">
              <li className="section-title">Officer Management</li>
              <li className="sidebar-item" title="Officer List"><FaUserShield style={{ marginRight: 8 }} />Officer List</li>
              <li className="sidebar-item" title="Assign Officer">Assign Officer</li>
            </ul>
          )}

          <ul className="sidebar-section">
            <li className="section-title">Evidence</li>
            <li className="sidebar-item" title="View Evidence"><FaFileAlt style={{ marginRight: 8 }} />View Evidence</li>
            <li className="sidebar-item" title="Chain of Custody">Chain of Custody</li>
          </ul>

          <ul className="sidebar-section">
            <li className="section-title">Notifications</li>
            <li className="sidebar-item" title="New Case Alerts"><FaBell style={{ marginRight: 8 }} />New Case Alerts</li>
          </ul>

          <ul className="sidebar-section">
            <li className="section-title">Reports</li>
            <li className="sidebar-item" title="Reports & Analytics"><FaChartBar style={{ marginRight: 8 }} />Reports</li>
          </ul>

          <ul className="sidebar-section">
            <li className="section-title">Assistant</li>
            <li className="sidebar-item" title="CopBot Assistant"><FaRobot style={{ marginRight: 8 }} />CopBot Assistant</li>
          </ul>

          {hasRole(["admin", "super"]) && (
            <ul className="sidebar-section">
              <li className="section-title">Settings</li>
              <li className="sidebar-item" title="Admin Settings"><FaCog style={{ marginRight: 8 }} />Admin Settings</li>
            </ul>
          )}

          <ul className="sidebar-section">
            <li className="section-title">Audit & Logs</li>
            <li className="sidebar-item" title="Login History">Login History</li>
          </ul>
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
