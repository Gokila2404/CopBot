import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import "./admin.css";

interface Station {
  id: string;
  name: string;
  areaCovered: string;
  contact: string;
  address?: string;
}

const SettingsStations: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    areaCovered: "",
    contact: "",
    address: "",
  });

  useEffect(() => {
    // Load stations from localStorage or API
    const storedStations = JSON.parse(localStorage.getItem("stations") || "[]");
    if (storedStations.length === 0) {
      // Mock data
      const mockStations: Station[] = [
        {
          id: "S001",
          name: "Station A",
          areaCovered: "Downtown, Midtown",
          contact: "123-456-7890",
          address: "123 Main St",
        },
        {
          id: "S002",
          name: "Station B",
          areaCovered: "Uptown",
          contact: "123-456-7891",
          address: "456 Oak Ave",
        },
        {
          id: "S003",
          name: "Station C",
          areaCovered: "Midtown",
          contact: "123-456-7892",
          address: "789 Pine Rd",
        },
      ];
      setStations(mockStations);
      localStorage.setItem("stations", JSON.stringify(mockStations));
    } else {
      setStations(storedStations);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.areaCovered || !formData.contact) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingStation) {
      // Update existing station
      const updatedStations = stations.map((s) =>
        s.id === editingStation.id
          ? {
              ...s,
              name: formData.name,
              areaCovered: formData.areaCovered,
              contact: formData.contact,
              address: formData.address,
            }
          : s
      );
      setStations(updatedStations);
      localStorage.setItem("stations", JSON.stringify(updatedStations));
      alert("Station updated successfully");
    } else {
      // Add new station
      const newStation: Station = {
        id: `S${String(stations.length + 1).padStart(3, "0")}`,
        name: formData.name,
        areaCovered: formData.areaCovered,
        contact: formData.contact,
        address: formData.address,
      };
      const updatedStations = [...stations, newStation];
      setStations(updatedStations);
      localStorage.setItem("stations", JSON.stringify(updatedStations));
      alert("Station added successfully");
    }

    setShowModal(false);
    setEditingStation(null);
    setFormData({ name: "", areaCovered: "", contact: "", address: "" });
  };

  const handleEdit = (station: Station) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      areaCovered: station.areaCovered,
      contact: station.contact,
      address: station.address || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this station?")) {
      const updatedStations = stations.filter((s) => s.id !== id);
      setStations(updatedStations);
      localStorage.setItem("stations", JSON.stringify(updatedStations));
      alert("Station deleted successfully");
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Police Stations Management</h2>
        <p className="muted">Manage police stations and their coverage areas</p>
        <button className="btn primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Station
        </button>
      </div>

      <div className="cases-table-wrapper card">
        <div className="table-header">
          <h3>Police Stations ({stations.length})</h3>
        </div>
        <table className="cases-table">
          <thead>
            <tr>
              <th>Station ID</th>
              <th>Station Name</th>
              <th>Area Covered</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stations.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                  No stations found. Click "Add Station" to create one.
                </td>
              </tr>
            ) : (
              stations.map((station) => (
                <tr key={station.id}>
                  <td>
                    <strong>{station.id}</strong>
                  </td>
                  <td>{station.name}</td>
                  <td>
                    <FaMapMarkerAlt style={{ marginRight: 4 }} />
                    {station.areaCovered}
                  </td>
                  <td>
                    <FaPhone style={{ marginRight: 4 }} />
                    {station.contact}
                  </td>
                  <td>{station.address || "N/A"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn outline small"
                        onClick={() => handleEdit(station)}
                        title="Edit Station"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn danger small"
                        onClick={() => handleDelete(station.id)}
                        title="Delete Station"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingStation(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingStation ? "Edit Station" : "Add New Station"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Station Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Area Covered *</label>
                <input
                  type="text"
                  value={formData.areaCovered}
                  onChange={(e) => setFormData({ ...formData, areaCovered: e.target.value })}
                  className="form-input"
                  placeholder="e.g., Downtown, Midtown"
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact *</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="form-input"
                  placeholder="Phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="form-input"
                  placeholder="Station address"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStation(null);
                    setFormData({ name: "", areaCovered: "", contact: "", address: "" });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  {editingStation ? "Update" : "Add"} Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsStations;

