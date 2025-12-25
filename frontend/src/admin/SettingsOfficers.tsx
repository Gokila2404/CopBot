import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaShieldAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./admin.css";

interface Officer {
  id: string;
  name: string;
  rank: string;
  station: string;
  area: string;
  activeCases: number;
  status: string;
}

const SettingsOfficers: React.FC = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    rank: "",
    station: "",
    area: "",
  });

  useEffect(() => {
    // Load officers from localStorage or API
    const storedOfficers = JSON.parse(localStorage.getItem("officers") || "[]");
    if (storedOfficers.length === 0) {
      // Mock data
      const mockOfficers: Officer[] = [
        {
          id: "O001",
          name: "Officer John",
          rank: "Inspector",
          station: "Station A",
          area: "Downtown",
          activeCases: 5,
          status: "active",
        },
        {
          id: "O002",
          name: "Officer Smith",
          rank: "Sub-Inspector",
          station: "Station B",
          area: "Uptown",
          activeCases: 3,
          status: "active",
        },
        {
          id: "O003",
          name: "Officer Brown",
          rank: "Constable",
          station: "Station C",
          area: "Midtown",
          activeCases: 0,
          status: "inactive",
        },
      ];
      setOfficers(mockOfficers);
      localStorage.setItem("officers", JSON.stringify(mockOfficers));
    } else {
      setOfficers(storedOfficers);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rank || !formData.station || !formData.area) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingOfficer) {
      // Update existing officer
      const updatedOfficers = officers.map((o) =>
        o.id === editingOfficer.id
          ? {
              ...o,
              name: formData.name,
              rank: formData.rank,
              station: formData.station,
              area: formData.area,
            }
          : o
      );
      setOfficers(updatedOfficers);
      localStorage.setItem("officers", JSON.stringify(updatedOfficers));
      alert("Officer updated successfully");
    } else {
      // Add new officer
      const newOfficer: Officer = {
        id: `O${String(officers.length + 1).padStart(3, "0")}`,
        name: formData.name,
        rank: formData.rank,
        station: formData.station,
        area: formData.area,
        activeCases: 0,
        status: "active",
      };
      const updatedOfficers = [...officers, newOfficer];
      setOfficers(updatedOfficers);
      localStorage.setItem("officers", JSON.stringify(updatedOfficers));
      alert("Officer added successfully");
    }

    setShowModal(false);
    setEditingOfficer(null);
    setFormData({ name: "", rank: "", station: "", area: "" });
  };

  const handleEdit = (officer: Officer) => {
    setEditingOfficer(officer);
    setFormData({
      name: officer.name,
      rank: officer.rank,
      station: officer.station,
      area: officer.area,
    });
    setShowModal(true);
  };

  const handleToggleStatus = (id: string) => {
    const updatedOfficers = officers.map((o) =>
      o.id === id ? { ...o, status: o.status === "active" ? "inactive" : "active" } : o
    );
    setOfficers(updatedOfficers);
    localStorage.setItem("officers", JSON.stringify(updatedOfficers));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this officer?")) {
      const updatedOfficers = officers.filter((o) => o.id !== id);
      setOfficers(updatedOfficers);
      localStorage.setItem("officers", JSON.stringify(updatedOfficers));
      alert("Officer deleted successfully");
    }
  };

  const stations = ["Station A", "Station B", "Station C", "Station D"];
  const areas = ["Downtown", "Uptown", "Midtown"];
  const ranks = ["Constable", "Head Constable", "Sub-Inspector", "Inspector", "Deputy Superintendent"];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Police Officers Management</h2>
        <p className="muted">Manage police officers and their assignments</p>
        <button className="btn primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Officer
        </button>
      </div>

      <div className="officers-grid">
        {officers.length === 0 ? (
          <div className="card" style={{ padding: "40px", textAlign: "center" }}>
            <p>No officers found. Click "Add Officer" to create one.</p>
          </div>
        ) : (
          officers.map((officer) => (
            <div key={officer.id} className="officer-card card">
              <div className="officer-header">
                <div className="officer-avatar">
                  <FaShieldAlt />
                </div>
                <div className="officer-info">
                  <h3>{officer.name}</h3>
                  <p className="officer-rank">{officer.rank}</p>
                </div>
                <div className={`officer-status ${officer.status}`}>
                  {officer.status === "active" ? <FaCheckCircle /> : <FaTimesCircle />}
                </div>
              </div>
              <div className="officer-details">
                <div className="detail-item">
                  <strong>Station:</strong> {officer.station}
                </div>
                <div className="detail-item">
                  <strong>Area:</strong> {officer.area}
                </div>
                <div className="detail-item">
                  <strong>Active Cases:</strong> {officer.activeCases}
                </div>
              </div>
              <div className="officer-actions">
                <button
                  className="btn outline small"
                  onClick={() => handleEdit(officer)}
                  title="Edit Officer"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className={`btn small ${officer.status === "active" ? "danger" : "primary"}`}
                  onClick={() => handleToggleStatus(officer.id)}
                  title={officer.status === "active" ? "Deactivate" : "Activate"}
                >
                  {officer.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  className="btn danger small"
                  onClick={() => handleDelete(officer.id)}
                  title="Delete Officer"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingOfficer(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingOfficer ? "Edit Officer" : "Add New Officer"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Officer Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Rank *</label>
                <select
                  value={formData.rank}
                  onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                  className="form-input"
                  required
                >
                  <option value="">Select Rank</option>
                  {ranks.map((rank) => (
                    <option key={rank} value={rank}>
                      {rank}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Station *</label>
                <select
                  value={formData.station}
                  onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                  className="form-input"
                  required
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
                <label>Area *</label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="form-input"
                  required
                >
                  <option value="">Select Area</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => {
                    setShowModal(false);
                    setEditingOfficer(null);
                    setFormData({ name: "", rank: "", station: "", area: "" });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  {editingOfficer ? "Update" : "Add"} Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsOfficers;

