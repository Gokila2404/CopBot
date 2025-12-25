import React, { useState, useEffect } from "react";
import { FaFilePdf, FaDownload, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";
import "./admin.css";

interface SolvedCase {
  caseId: string;
  officerName: string;
  resolutionSummary: string;
  closedDate: string;
  complaintType?: string;
  area?: string;
}

const CasesSolved: React.FC = () => {
  const [solvedCases, setSolvedCases] = useState<SolvedCase[]>([]);

  useEffect(() => {
    // Load solved cases from localStorage or API
    const storedCases = JSON.parse(localStorage.getItem("cases") || "[]");
    const solved = storedCases.filter(
      (c: any) =>
        c.status?.toLowerCase().includes("solved") ||
        c.status?.toLowerCase().includes("resolved") ||
        c.status?.toLowerCase().includes("closed")
    );
    setSolvedCases(solved);
  }, []);

  const handleDownloadFIR = (caseId: string) => {
    // Generate or download FIR PDF
    alert(`Downloading FIR for case ${caseId}`);
    // In production, this would trigger a PDF download
  };

  const handleDownloadReport = (caseId: string) => {
    // Generate or download Case Report PDF
    alert(`Downloading Case Report for case ${caseId}`);
    // In production, this would trigger a PDF download
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Solved Cases</h2>
        <p className="muted">Closed Investigation Archive - View and download reports for resolved cases</p>
      </div>

      <div className="cases-table-wrapper card">
        <div className="table-header">
          <h3>Solved Cases ({solvedCases.length})</h3>
        </div>
        <table className="cases-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Complaint Type</th>
              <th>Area</th>
              <th>Officer Name</th>
              <th>Resolution Summary</th>
              <th>Closed Date</th>
              <th>Documents</th>
            </tr>
          </thead>
          <tbody>
            {solvedCases.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                  No solved cases found
                </td>
              </tr>
            ) : (
              solvedCases.map((caseItem) => (
                <tr key={caseItem.caseId}>
                  <td>
                    <strong>{caseItem.caseId || "#C000"}</strong>
                  </td>
                  <td>{caseItem.complaintType || "Unknown"}</td>
                  <td>{caseItem.area || "N/A"}</td>
                  <td>
                    <FaShieldAlt style={{ marginRight: 4 }} />
                    {caseItem.officerName || "N/A"}
                  </td>
                  <td>
                    <div className="resolution-summary">
                      {caseItem.resolutionSummary || "Case resolved successfully"}
                    </div>
                  </td>
                  <td>
                    <FaCalendarAlt style={{ marginRight: 4 }} />
                    {caseItem.closedDate
                      ? new Date(caseItem.closedDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn outline small"
                        onClick={() => handleDownloadFIR(caseItem.caseId)}
                        title="Download FIR"
                      >
                        <FaFilePdf /> FIR
                      </button>
                      <button
                        className="btn primary small"
                        onClick={() => handleDownloadReport(caseItem.caseId)}
                        title="Download Case Report"
                      >
                        <FaDownload /> Report
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CasesSolved;

