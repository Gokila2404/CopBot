import React from "react";
import { Navigate, useNavigate, Route, Routes } from "react-router-dom";
import AdminNav from "./AdminNav"; // left sidebar
import AdminHeader from "./AdminHeader"; // top header
import AdminDashboard from "./AdminDashboard";
import CaseDetails from "./CaseDetails";
import CasesAll from "./CasesAll";
import CasesSolved from "./CasesSolved";
import CasesInProgress from "./CasesInProgress";
import CasesPending from "./CasesPending";
import Users from "./Users";
import SettingsAreas from "./SettingsAreas";
import SettingsStations from "./SettingsStations";
import SettingsOfficers from "./SettingsOfficers";
import SettingsSystem from "./SettingsSystem";
import "./admin.css";

const AdminApp: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove admin session
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminEmail");

    // Redirect to home page
    navigate("/");
  };

  return (
    <div className="admin-app-root">
      <AdminHeader onLogout={handleLogout} />
      <div className="mobile-menu-overlay" onClick={() => {
        document.body.classList.remove("mobile-menu-open");
      }}></div>
      <div className="admin-app">
        <AdminNav onLogout={handleLogout} />

        <main className="admin-main">
          <Routes>
            <Route path="/" element={<Navigate to="home" replace />} />
            <Route path="home" element={<AdminDashboard />} />

            {/* Cases Routes */}
            <Route path="cases/all" element={<CasesAll />} />
            <Route path="cases/solved" element={<CasesSolved />} />
            <Route path="cases/in-progress" element={<CasesInProgress />} />
            <Route path="cases/pending" element={<CasesPending />} />
            <Route path="case/:caseId" element={<CaseDetails />} />

            {/* Users Route */}
            <Route path="users" element={<Users />} />

            {/* Settings Routes */}
            <Route path="settings/areas" element={<SettingsAreas />} />
            <Route path="settings/stations" element={<SettingsStations />} />
            <Route path="settings/officers" element={<SettingsOfficers />} />
            <Route path="settings/system" element={<SettingsSystem />} />
          </Routes>
        </main>
      </div>
      <footer className="admin-footer">© Police Complaint Portal - Confidential System</footer>
    </div>
  );
};

export default AdminApp;
