import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import "./admin.css";

interface Area {
  id: string;
  name: string;
  station: string;
  description?: string;
}

const SettingsAreas: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    station: "",
    description: "",
  });

  useEffect(() => {
    // Load areas from localStorage or API
    const storedAreas = JSON.parse(localStorage.getItem("areas") || "[]");
    if (storedAreas.length === 0) {
      // Mock data
      const mockAreas: Area[] = [
        { id: "A001", name: "Downtown", station: "Station A", description: "Central business district" },
        { id: "A002", name: "Uptown", station: "Station B", description: "Residential area" },
        { id: "A003", name: "Midtown", station: "Station C", description: "Commercial zone" },
      ];
      setAreas(mockAreas);
      localStorage.setItem("areas", JSON.stringify(mockAreas));
    } else {
      setAreas(storedAreas);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.station) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingArea) {
      // Update existing area
      const updatedAreas = areas.map((a) =>
        a.id === editingArea.id
          ? { ...a, name: formData.name, station: formData.station, description: formData.description }
          : a
      );
      setAreas(updatedAreas);
      localStorage.setItem("areas", JSON.stringify(updatedAreas));
      alert("Area updated successfully");
    } else {
      // Add new area
      const newArea: Area = {
        id: `A${String(areas.length + 1).padStart(3, "0")}`,
        name: formData.name,
        station: formData.station,
        description: formData.description,
      };
      const updatedAreas = [...areas, newArea];
      setAreas(updatedAreas);
      localStorage.setItem("areas", JSON.stringify(updatedAreas));
      alert("Area added successfully");
    }

    setShowModal(false);
    setEditingArea(null);
    setFormData({ name: "", station: "", description: "" });
  };

  const handleEdit = (area: Area) => {
    setEditingArea(area);
    setFormData({
      name: area.name,
      station: area.station,
      description: area.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this area?")) {
      const updatedAreas = areas.filter((a) => a.id !== id);
      setAreas(updatedAreas);
      localStorage.setItem("areas", JSON.stringify(updatedAreas));
      alert("Area deleted successfully");
    }
  };

  const stations = ["Station A", "Station B", "Station C", "Station D"];

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Area Management</h2>
        <p className="muted">Manage areas and assign police stations</p>
        <button className="btn primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add Area
        </button>
      </div>

      <div className="cases-table-wrapper card">
        <div className="table-header">
          <h3>Areas ({areas.length})</h3>
        </div>
        <table className="cases-table">
          <thead>
            <tr>
              <th>Area ID</th>
              <th>Area Name</th>
              <th>Assigned Station</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {areas.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                  No areas found. Click "Add Area" to create one.
                </td>
              </tr>
            ) : (
              areas.map((area) => (
                <tr key={area.id}>
                  <td>
                    <strong>{area.id}</strong>
                  </td>
                  <td>
                    <FaMapMarkerAlt style={{ marginRight: 4 }} />
                    {area.name}
                  </td>
                  <td>{area.station}</td>
                  <td>{area.description || "N/A"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn outline small"
                        onClick={() => handleEdit(area)}
                        title="Edit Area"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn danger small"
                        onClick={() => handleDelete(area.id)}
                        title="Delete Area"
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
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingArea(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingArea ? "Edit Area" : "Add New Area"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Area Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>Assign Station *</label>
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
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => {
                    setShowModal(false);
                    setEditingArea(null);
                    setFormData({ name: "", station: "", description: "" });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  {editingArea ? "Update" : "Add"} Area
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsAreas;

