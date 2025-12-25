import React, { useState } from "react";
import { FaSave, FaLock, FaRobot, FaUserShield, FaCog } from "react-icons/fa";
import "./admin.css";

const SettingsSystem: React.FC = () => {
  const [settings, setSettings] = useState({
    casePriorityRules: "high",
    autoAssignment: true,
    roleBasedAccess: true,
    auditLogging: true,
    dataRetention: "365",
    aiEscalationThreshold: "3",
    otpEnabled: true,
    loginSecurity: "strict",
  });

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    localStorage.setItem("systemSettings", JSON.stringify(settings));
    alert("System settings saved successfully");
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>System Settings</h2>
        <p className="muted">Common Police System Controls</p>
      </div>

      <div className="settings-sections">
        {/* Case Priority Rules */}
        <div className="settings-section card">
          <div className="settings-header">
            <FaCog style={{ marginRight: "8px" }} />
            <h3>Case Priority Rules</h3>
          </div>
          <div className="settings-content">
            <div className="form-group">
              <label>Default Priority Level</label>
              <select
                value={settings.casePriorityRules}
                onChange={(e) => handleChange("casePriorityRules", e.target.value)}
                className="form-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Auto Assignment */}
        <div className="settings-section card">
          <div className="settings-header">
            <FaCog style={{ marginRight: "8px" }} />
            <h3>Auto Assignment</h3>
          </div>
          <div className="settings-content">
            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={settings.autoAssignment}
                  onChange={(e) => handleChange("autoAssignment", e.target.checked)}
                />
                Enable automatic assignment (Area → Station → Officer)
              </label>
            </div>
          </div>
        </div>

        {/* Role-Based Access */}
        <div className="settings-section card">
          <div className="settings-header">
            <FaUserShield style={{ marginRight: "8px" }} />
            <h3>Role-Based Access Control</h3>
          </div>
          <div className="settings-content">
            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={settings.roleBasedAccess}
                  onChange={(e) => handleChange("roleBasedAccess", e.target.checked)}
                />
                Enable role-based access control
              </label>
            </div>
          </div>
        </div>

        {/* Audit Logging */}
        <div className="settings-section card">
          <div className="settings-header">
            <FaLock style={{ marginRight: "8px" }} />
            <h3>Audit Logging</h3>
          </div>
          <div className="settings-content">
            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={settings.auditLogging}
                  onChange={(e) => handleChange("auditLogging", e.target.checked)}
                />
                Enable full audit trail logging
              </label>
            </div>
          </div>
        </div>

        {/* Data Retention */}
        <div className="settings-section card">
          <div className="settings-header">
            <FaLock style={{ marginRight: "8px" }} />
            <h3>Data Retention</h3>
          </div>
          <div className="settings-content">
            <div className="form-group">
              <label>Retention Period (days)</label>
              <input
                type="number"
                value={settings.dataRetention}
                onChange={(e) => handleChange("dataRetention", e.target.value)}
                className="form-input"
                min="30"
                max="3650"
              />
            </div>
          </div>
        </div>

        {/* AI Chatbot Escalation */}
        <div className="settings-section card">
          <div className="settings-header">
            <FaRobot style={{ marginRight: "8px" }} />
            <h3>AI Chatbot Escalation Thresholds</h3>
          </div>
          <div className="settings-content">
            <div className="form-group">
              <label>Escalation Threshold (failed attempts)</label>
              <input
                type="number"
                value={settings.aiEscalationThreshold}
                onChange={(e) => handleChange("aiEscalationThreshold", e.target.value)}
                className="form-input"
                min="1"
                max="10"
              />
              <small style={{ color: "var(--muted)", fontSize: "12px" }}>
                Number of failed AI responses before escalating to human officer
              </small>
            </div>
          </div>
        </div>

        {/* OTP & Login Security */}
        <div className="settings-section card">
          <div className="settings-header">
            <FaLock style={{ marginRight: "8px" }} />
            <h3>OTP & Login Security</h3>
          </div>
          <div className="settings-content">
            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  checked={settings.otpEnabled}
                  onChange={(e) => handleChange("otpEnabled", e.target.checked)}
                />
                Enable OTP authentication
              </label>
            </div>
            <div className="form-group">
              <label>Login Security Level</label>
              <select
                value={settings.loginSecurity}
                onChange={(e) => handleChange("loginSecurity", e.target.value)}
                className="form-input"
              >
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="strict">Strict</option>
                <option value="maximum">Maximum</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn primary" onClick={handleSave}>
          <FaSave style={{ marginRight: "8px" }} />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsSystem;
