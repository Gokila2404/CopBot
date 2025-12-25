import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaMapMarkerAlt, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";
import "./admin.css";

interface Case {
  caseId: string;
  complaintType: string;
  area: string;
  station: string;
  officer: string;
  status: string;
  filedDate: string;
  reporter?: string;
}

const CasesAll: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [filters, setFilters] = useState({
    area: "",
    station: "",
    caseType: "",
    dateFrom: "",
    dateTo: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Load cases from localStorage or API
    const storedCases = JSON.parse(localStorage.getItem("cases") || "[]");
    setCases(storedCases);
    setFilteredCases(storedCases);
  }, []);

  useEffect(() => {
    let filtered = [...cases];

    if (filters.area) {
      filtered = filtered.filter((c) => c.area?.toLowerCase().includes(filters.area.toLowerCase()));
    }
    if (filters.station) {
      filtered = filtered.filter((c) => c.station?.toLowerCase().includes(filters.station.toLowerCase()));
    }
    if (filters.caseType) {
      filtered = filtered.filter((c) => c.complaintType?.toLowerCase().includes(filters.caseType.toLowerCase()));
    }
    if (filters.dateFrom) {
      filtered = filtered.filter((c) => c.filedDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((c) => c.filedDate <= filters.dateTo);
    }

    setFilteredCases(filtered);
  }, [filters, cases]);

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("solved") || statusLower.includes("resolved")) {
      return <span className="status-badge status-solved">Solved</span>;
    }
    if (statusLower.includes("progress")) {
      return <span className="status-badge status-in-progress">In Progress</span>;
    }
    if (statusLower.includes("pending")) {
      return <span className="status-badge status-pending">Pending</span>;
    }
    return <span className="status-badge status-pending">{status || "Pending"}</span>;
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>All Cases</h2>
        <p className="muted">Central Police Case Register - Manage and track all registered complaints</p>
      </div>

      {/* Advanced Filter Panel */}
      <div className="filter-panel card">
        <h3>Filters</h3>
        <div className="filter-grid">
          <div className="filter-group">
            <label>Area</label>
            <input
              type="text"
              placeholder="Filter by area"
              value={filters.area}
              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Police Station</label>
            <input
              type="text"
              placeholder="Filter by station"
              value={filters.station}
              onChange={(e) => setFilters({ ...filters, station: e.target.value })}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Case Type</label>
            <input
              type="text"
              placeholder="Filter by type"
              value={filters.caseType}
              onChange={(e) => setFilters({ ...filters, caseType: e.target.value })}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Date From</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Date To</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <button
              className="btn outline"
              onClick={() => setFilters({ area: "", station: "", caseType: "", dateFrom: "", dateTo: "" })}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="cases-table-wrapper card">
        <div className="table-header">
          <h3>Cases ({filteredCases.length})</h3>
        </div>
        <table className="cases-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Complaint Type</th>
              <th>Area</th>
              <th>Station</th>
              <th>Officer</th>
              <th>Status</th>
              <th>Filed Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                  No cases found
                </td>
              </tr>
            ) : (
              filteredCases.map((caseItem) => (
                <tr key={caseItem.caseId}>
                  <td>
                    <strong>{caseItem.caseId || "#C000"}</strong>
                  </td>
                  <td>{caseItem.complaintType || "Unknown"}</td>
                  <td>
                    <FaMapMarkerAlt style={{ marginRight: 4 }} />
                    {caseItem.area || "N/A"}
                  </td>
                  <td>{caseItem.station || "Unassigned"}</td>
                  <td>
                    <FaShieldAlt style={{ marginRight: 4 }} />
                    {caseItem.officer || "Unassigned"}
                  </td>
                  <td>{getStatusBadge(caseItem.status)}</td>
                  <td>
                    <FaCalendarAlt style={{ marginRight: 4 }} />
                    {caseItem.filedDate ? new Date(caseItem.filedDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn outline small"
                        onClick={() => navigate(`case/${caseItem.caseId}`)}
                        title="View Case"
                      >
                        <FaEye /> View
                      </button>
                      <button
                        className="btn primary small"
                        onClick={() => {
                          // Handle reassign
                          alert("Reassign officer functionality");
                        }}
                        title="Reassign Officer"
                      >
                        Reassign
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

export default CasesAll;

