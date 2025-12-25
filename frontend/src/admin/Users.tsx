import React, { useState, useEffect } from "react";
import { FaUser, FaPhone, FaMapMarkerAlt, FaFileAlt, FaBan, FaEye } from "react-icons/fa";
import "./admin.css";

interface User {
  userId: string;
  name: string;
  mobile: string;
  area: string;
  complaintsFiled: number;
  status: string;
  email?: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Load users from localStorage or API
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (storedUsers.length === 0) {
      // Mock data for demonstration
      const mockUsers: User[] = [
        {
          userId: "U001",
          name: "John Doe",
          mobile: "9876543210",
          area: "Downtown",
          complaintsFiled: 3,
          status: "active",
          email: "john@example.com",
        },
        {
          userId: "U002",
          name: "Jane Smith",
          mobile: "9876543211",
          area: "Uptown",
          complaintsFiled: 1,
          status: "active",
          email: "jane@example.com",
        },
        {
          userId: "U003",
          name: "Bob Johnson",
          mobile: "9876543212",
          area: "Midtown",
          complaintsFiled: 5,
          status: "blocked",
          email: "bob@example.com",
        },
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } else {
      setUsers(storedUsers);
      setFilteredUsers(storedUsers);
    }
  }, []);

  useEffect(() => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.mobile?.includes(searchTerm) ||
          u.userId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((u) => u.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, statusFilter, users]);

  const maskMobile = (mobile: string) => {
    if (!mobile || mobile.length < 4) return mobile;
    return `******${mobile.slice(-4)}`;
  };

  const handleBlockUser = (userId: string) => {
    if (window.confirm("Are you sure you want to block this user?")) {
      const updatedUsers = users.map((u) =>
        u.userId === userId ? { ...u, status: "blocked" } : u
      );
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      alert(`User ${userId} has been blocked`);
    }
  };

  const handleUnblockUser = (userId: string) => {
    const updatedUsers = users.map((u) =>
      u.userId === userId ? { ...u, status: "active" } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert(`User ${userId} has been unblocked`);
  };

  const handleViewHistory = (userId: string) => {
    alert(`Viewing complaint history for user ${userId}`);
    // In production, navigate to user's complaint history page
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Registered Users</h2>
        <p className="muted">Citizen Complaint Registry - Manage registered citizen data securely</p>
      </div>

      {/* Search and Filter */}
      <div className="filter-panel card">
        <div className="filter-grid">
          <div className="filter-group" style={{ flex: 2 }}>
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by name, mobile, or user ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-input"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="cases-table-wrapper card">
        <div className="table-header">
          <h3>Registered Users ({filteredUsers.length})</h3>
        </div>
        <table className="cases-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Area</th>
              <th>Complaints Filed</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.userId}>
                  <td>
                    <strong>{user.userId}</strong>
                  </td>
                  <td>
                    <FaUser style={{ marginRight: 4 }} />
                    {user.name}
                  </td>
                  <td>
                    <FaPhone style={{ marginRight: 4 }} />
                    {maskMobile(user.mobile)}
                  </td>
                  <td>
                    <FaMapMarkerAlt style={{ marginRight: 4 }} />
                    {user.area}
                  </td>
                  <td>
                    <FaFileAlt style={{ marginRight: 4 }} />
                    {user.complaintsFiled}
                  </td>
                  <td>
                    {user.status === "active" ? (
                      <span className="status-badge status-solved">Active</span>
                    ) : (
                      <span className="status-badge status-pending">Blocked</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn outline small"
                        onClick={() => handleViewHistory(user.userId)}
                        title="View Complaint History"
                      >
                        <FaEye /> History
                      </button>
                      {user.status === "active" ? (
                        <button
                          className="btn danger small"
                          onClick={() => handleBlockUser(user.userId)}
                          title="Block User"
                        >
                          <FaBan /> Block
                        </button>
                      ) : (
                        <button
                          className="btn primary small"
                          onClick={() => handleUnblockUser(user.userId)}
                          title="Unblock User"
                        >
                          Unblock
                        </button>
                      )}
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

export default Users;

