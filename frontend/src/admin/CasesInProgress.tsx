import React, { useState, useEffect } from "react";
import { FaArrowUp, FaEdit, FaShieldAlt, FaCalendarAlt } from "react-icons/fa";
import "./admin.css";

interface InProgressCase {
  caseId: string;
  officer: string;
  investigationProgress: number;
  lastUpdate: string;
  complaintType?: string;
  area?: string;
}

const CasesInProgress: React.FC = () => {
  const [inProgressCases, setInProgressCases] = useState<InProgressCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [progressUpdate, setProgressUpdate] = useState<number>(0);

  useEffect(() => {
    // Load in-progress cases from localStorage or API
    const storedCases = JSON.parse(localStorage.getItem("cases") || "[]");
    const inProgress = storedCases.filter(
      (c: any) =>
        c.status?.toLowerCase().includes("progress") ||
        c.status?.toLowerCase().includes("ongoing")
    );
    setInProgressCases(inProgress);
  }, []);

  const handleUpdateProgress = (caseId: string) => {
    if (progressUpdate < 0 || progressUpdate > 100) {
      alert("Progress must be between 0 and 100");
      return;
    }

    // Update case progress
    const updatedCases = inProgressCases.map((c) =>
      c.caseId === caseId
        ? { ...c, investigationProgress: progressUpdate, lastUpdate: new Date().toISOString() }
        : c
    );
    setInProgressCases(updatedCases);

    // Update localStorage
    const allCases = JSON.parse(localStorage.getItem("cases") || "[]");
    const updatedAllCases = allCases.map((c: any) =>
      c.caseId === caseId
        ? { ...c, progress: progressUpdate, lastUpdate: new Date().toISOString() }
        : c
    );
    localStorage.setItem("cases", JSON.stringify(updatedAllCases));

    setSelectedCase(null);
    setProgressUpdate(0);
    alert(`Progress updated for case ${caseId}`);
  };

  const handleEscalate = (caseId: string) => {
    // Escalate case
    alert(`Case ${caseId} escalated to senior officer`);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>In Progress Cases</h2>
        <p className="muted">Active Investigations - Monitor and update investigation progress</p>
      </div>

      <div className="cases-table-wrapper card">
        <div className="table-header">
          <h3>Active Investigations ({inProgressCases.length})</h3>
        </div>
        <table className="cases-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Complaint Type</th>
              <th>Area</th>
              <th>Officer</th>
              <th>Investigation Progress</th>
              <th>Last Update</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inProgressCases.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                  No active investigations found
                </td>
              </tr>
            ) : (
              inProgressCases.map((caseItem) => (
                <tr key={caseItem.caseId}>
                  <td>
                    <strong>{caseItem.caseId || "#C000"}</strong>
                  </td>
                  <td>{caseItem.complaintType || "Unknown"}</td>
                  <td>{caseItem.area || "N/A"}</td>
                  <td>
                    <FaShieldAlt style={{ marginRight: 4 }} />
                    {caseItem.officer || "Unassigned"}
                  </td>
                  <td>
                    <div className="progress-container">
                      <div className="progress-wrap">
                        <div
                          className="progress-bar"
                          style={{ width: `${caseItem.investigationProgress || 0}%` }}
                        />
                      </div>
                      <span className="progress-text">{caseItem.investigationProgress || 0}%</span>
                    </div>
                  </td>
                  <td>
                    <FaCalendarAlt style={{ marginRight: 4 }} />
                    {caseItem.lastUpdate
                      ? new Date(caseItem.lastUpdate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn outline small"
                        onClick={() => {
                          setSelectedCase(caseItem.caseId);
                          setProgressUpdate(caseItem.investigationProgress || 0);
                        }}
                        title="Update Progress"
                      >
                        <FaEdit /> Update
                      </button>
                      <button
                        className="btn primary small"
                        onClick={() => handleEscalate(caseItem.caseId)}
                        title="Escalate Case"
                      >
                        <FaArrowUp /> Escalate
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Progress Update Modal */}
      {selectedCase && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Update Progress - Case {selectedCase}</h3>
            <div className="form-group">
              <label>Investigation Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={progressUpdate}
                onChange={(e) => setProgressUpdate(parseInt(e.target.value) || 0)}
                className="form-input"
              />
            </div>
            <div className="modal-actions">
              <button className="btn outline" onClick={() => setSelectedCase(null)}>
                Cancel
              </button>
              <button
                className="btn primary"
                onClick={() => handleUpdateProgress(selectedCase)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesInProgress;

