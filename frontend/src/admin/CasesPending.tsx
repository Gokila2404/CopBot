import React, { useState, useEffect } from "react";
import { FaUserPlus, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import "./admin.css";

interface PendingCase {
  caseId: string;
  area: string;
  submittedDate: string;
  complaintType?: string;
  reporter?: string;
}

const CasesPending: React.FC = () => {
  const [pendingCases, setPendingCases] = useState<PendingCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [assignment, setAssignment] = useState({
    station: "",
    officer: "",
  });

  useEffect(() => {
    // Load pending cases from localStorage or API
    const storedCases = JSON.parse(localStorage.getItem("cases") || "[]");
    const pending = storedCases.filter(
      (c: any) =>
        !c.status ||
        c.status?.toLowerCase().includes("pending") ||
        !c.officer ||
        !c.station
    );
    setPendingCases(pending);
  }, []);

  const handleAssign = (caseId: string) => {
    if (!assignment.station || !assignment.officer) {
      alert("Please select both station and officer");
      return;
    }

    // Update case assignment
    const updatedCases = pendingCases.filter((c) => c.caseId !== caseId);
    setPendingCases(updatedCases);

    // Update localStorage
    const allCases = JSON.parse(localStorage.getItem("cases") || "[]");
    const updatedAllCases = allCases.map((c: any) =>
      c.caseId === caseId
        ? {
            ...c,
            station: assignment.station,
            officer: assignment.officer,
            status: "In Progress",
            assignedDate: new Date().toISOString(),
          }
        : c
    );
    localStorage.setItem("cases", JSON.stringify(updatedAllCases));

    setSelectedCase(null);
    setAssignment({ station: "", officer: "" });
    alert(`Case ${caseId} assigned successfully`);
  };

  // Mock data for stations and officers (in production, fetch from API)
  const stations = ["Station A", "Station B", "Station C", "Station D"];
  const officers = ["Officer John", "Officer Smith", "Officer Brown", "Officer Davis"];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Pending Cases</h2>
        <p className="muted">Unassigned Complaints - Assign police stations and officers to new complaints</p>
      </div>

      <div className="cases-table-wrapper card">
        <div className="table-header">
          <h3>Unassigned Complaints ({pendingCases.length})</h3>
        </div>
        <table className="cases-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Complaint Type</th>
              <th>Area</th>
              <th>Reporter</th>
              <th>Submitted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingCases.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                  No pending cases found
                </td>
              </tr>
            ) : (
              pendingCases.map((caseItem) => (
                <tr key={caseItem.caseId}>
                  <td>
                    <strong>{caseItem.caseId || "#C000"}</strong>
                  </td>
                  <td>{caseItem.complaintType || "Unknown"}</td>
                  <td>
                    <FaMapMarkerAlt style={{ marginRight: 4 }} />
                    {caseItem.area || "N/A"}
                  </td>
                  <td>{caseItem.reporter || "Anonymous"}</td>
                  <td>
                    <FaCalendarAlt style={{ marginRight: 4 }} />
                    {caseItem.submittedDate
                      ? new Date(caseItem.submittedDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <button
                      className="btn primary small"
                      onClick={() => {
                        setSelectedCase(caseItem.caseId);
                        setAssignment({ station: "", officer: "" });
                      }}
                      title="Assign Station and Officer"
                    >
                      <FaUserPlus /> Assign
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Assignment Modal */}
      {selectedCase && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Assign Case {selectedCase}</h3>
            <div className="form-group">
              <label>Police Station</label>
              <select
                value={assignment.station}
                onChange={(e) => setAssignment({ ...assignment, station: e.target.value })}
                className="form-input"
              >
                <option value="">Select Station</option>
                {stations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Officer</label>
              <select
                value={assignment.officer}
                onChange={(e) => setAssignment({ ...assignment, officer: e.target.value })}
                className="form-input"
              >
                <option value="">Select Officer</option>
                {officers.map((officer) => (
                  <option key={officer} value={officer}>
                    {officer}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn outline" onClick={() => setSelectedCase(null)}>
                Cancel
              </button>
              <button
                className="btn primary"
                onClick={() => handleAssign(selectedCase)}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesPending;

