import React, { useState, useEffect } from "react";
import {
  Luggage,
  BarChart,
  Search,
  Edit,
  Trash2,
  Plus,
  LogOut,
  Link,
  Users,
} from "lucide-react";
import "../styles/admin.css";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [luggageData, setLuggageData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newLuggage, setNewLuggage] = useState({ 
    name: "", 
    status: "", 
    location: "", 
    num_lugg: "" 
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({ 
    name: "", 
    email: "", 
    phone: "" 
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [trackingLink, setTrackingLink] = useState("");
  const [selectedLuggage, setSelectedLuggage] = useState(null);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'admin') {
      localStorage.clear();
      window.location.href = '/login';
      return;
    }
    
    fetchLuggageData();
    fetchUserData();
  }, []);

  const fetchLuggageData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/luggage", {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Failed to fetch luggage data");
      const data = await response.json();
      setLuggageData(data);
    } catch (error) {
      setError("Error fetching luggage data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users", {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      setError("Error fetching user data");
      console.error(error);
    }
  };

  const handleAddLuggage = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/luggage", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newLuggage),
      });
      if (!response.ok) throw new Error("Failed to add luggage");
      await fetchLuggageData();
      setNewLuggage({ name: "", status: "", location: "", num_lugg: "" });
    } catch (error) {
      setError("Error adding luggage");
      console.error(error);
    }
  };

  const handleDeleteLuggage = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/luggage/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Failed to delete luggage");
      await fetchLuggageData();
    } catch (error) {
      setError("Error deleting luggage");
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const filteredLuggage = luggageData.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm.toLowerCase())
  );

  const handleAssignLuggage = async (userId, luggageId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/luggage`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ luggageId }),
      });
      
      if (!response.ok) throw new Error("Failed to assign luggage");
      
      await fetchLuggageData();
      await fetchUserData();
      setAssignModalOpen(false);
      setSelectedUser(null);
      setSelectedLuggage(null);
    } catch (error) {
      setError("Error assigning luggage");
      console.error(error);
    }
  };

  const handleAddTrackingLink = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/tracking-links`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ link: trackingLink }),
      });
      
      if (!response.ok) throw new Error("Failed to add tracking link");
      
      await fetchUserData();
      setTrackingLink("");
      setAssignModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      setError("Error adding tracking link");
      console.error(error);
    }
  };

  return (
    <div className="admin-panel">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Luggage className="admin-icon" />
          <span className="admin-title">Admin Panel</span>
        </div>
        <nav className="admin-nav">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <BarChart className="admin-icon" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('luggage')}
            className={`admin-nav-item ${activeTab === 'luggage' ? 'active' : ''}`}
          >
            <Luggage className="admin-icon" />
            Luggage
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
          >
            <Users className="admin-icon" />
            Users
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <header className="admin-header-section">
          <h1 className="admin-header-title">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Overview
          </h1>
          <button className="admin-logout-button" onClick={handleLogout}>
            <LogOut className="admin-icon" /> Logout
          </button>
        </header>

        {error && <div className="admin-error">{error}</div>}
        {loading && <div className="admin-loading">Loading...</div>}

        {/* Dashboard View */}
        {activeTab === 'dashboard' && !loading && (
          <div className="admin-content">
            <div className="admin-cards">
              <div className="admin-card">
                <div className="admin-card-header">
                  <span>Total Users</span>
                </div>
                <div className="admin-card-content">
                  <div className="admin-count">{userData.length}</div>
                </div>
              </div>
              <div className="admin-card">
                <div className="admin-card-header">
                  <span>Active Luggages</span>
                </div>
                <div className="admin-card-content">
                  <div className="admin-count">{luggageData.length}</div>
                </div>
              </div>
              <div className="admin-card">
                <div className="admin-card-header">
                  <span>Total Items</span>
                </div>
                <div className="admin-card-content">
                  <div className="admin-count">
                    {luggageData.reduce((acc, curr) => acc + parseInt(curr.num_lugg), 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Luggage Management View */}
        {activeTab === 'luggage' && !loading && (
          <div className="admin-luggage-management">
            <div className="admin-luggage-controls">
              <input
                type="text"
                placeholder="Search luggage..."
                className="admin-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="admin-search-button">
                <Search className="admin-icon" /> Search
              </button>
            </div>

            <form onSubmit={handleAddLuggage} className="admin-add-luggage-form">
              <input
                type="text"
                placeholder="Luggage Name"
                value={newLuggage.name}
                onChange={(e) => setNewLuggage({...newLuggage, name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Status"
                value={newLuggage.status}
                onChange={(e) => setNewLuggage({...newLuggage, status: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={newLuggage.location}
                onChange={(e) => setNewLuggage({...newLuggage, location: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Number of Luggages"
                value={newLuggage.num_lugg}
                onChange={(e) => setNewLuggage({...newLuggage, num_lugg: e.target.value})}
                required
              />
              <button type="submit" className="admin-add-luggage-button">
                <Plus className="admin-icon" /> Add Luggage
              </button>
            </form>

            <table className="admin-luggage-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLuggage.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.status}</td>
                    <td>{item.location}</td>
                    <td>
                      <button
                        className="admin-delete-button"
                        onClick={() => handleDeleteLuggage(item.id)}
                      >
                        <Trash2 className="admin-icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Management View */}
        {activeTab === 'users' && !loading && (
          <div className="admin-user-management">
            <h2>User Management</h2>
            <table className="admin-user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Assigned Luggage</th>
                  <th>Tracking Links</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.luggage?.length || 0} items</td>
                    <td>{user.trackingLinks?.length || 0} links</td>
                    <td>
                      <button
                        className="admin-assign-button"
                        onClick={() => {
                          setSelectedUser(user);
                          setAssignModalOpen(true);
                        }}
                      >
                        <Plus className="admin-icon" /> Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Assignment Modal */}
            {assignModalOpen && selectedUser && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Assign to {selectedUser.username}</h3>
                  
                  <div className="form-group">
                    <h4>Assign Luggage</h4>
                    <select
                      value={selectedLuggage || ""}
                      onChange={(e) => setSelectedLuggage(e.target.value)}
                    >
                      <option value="">Select Luggage</option>
                      {luggageData.map((luggage) => (
                        <option key={luggage.id} value={luggage.id}>
                          {luggage.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAssignLuggage(selectedUser.id, selectedLuggage)}
                      disabled={!selectedLuggage}
                    >
                      Assign Luggage
                    </button>
                  </div>

                  <div className="form-group">
                    <h4>Add Tracking Link</h4>
                    <input
                      type="text"
                      placeholder="Enter tracking link"
                      value={trackingLink}
                      onChange={(e) => setTrackingLink(e.target.value)}
                    />
                    <button
                      onClick={() => handleAddTrackingLink(selectedUser.id)}
                      disabled={!trackingLink}
                    >
                      Add Link
                    </button>
                  </div>

                  <div className="modal-actions">
                    <button
                      className="modal-cancel-button"
                      onClick={() => {
                        setAssignModalOpen(false);
                        setSelectedUser(null);
                        setSelectedLuggage(null);
                        setTrackingLink("");
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
