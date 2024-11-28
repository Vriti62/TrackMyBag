import React, { useState, useEffect } from "react";
import {
  Luggage,
  Users,
  BarChart,
  Search,
  Edit,
  Trash2,
  Plus,
  LogOut,
} from "lucide-react";
import "../styles/admin.css";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [luggageData, setLuggageData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newLuggage, setNewLuggage] = useState({ name: "", status: "", location: "", num_lugg: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", email: "" }); // Assuming you want to edit name and email

  useEffect(() => {
    fetchLuggageData();
    fetchUserData();
  }, []);

  const fetchLuggageData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/luggage");
      if (!response.ok) {
        throw new Error("Failed to fetch luggage data");
      }
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
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      setError("Error fetching user data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLuggage = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/luggage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLuggage),
      });
      if (!response.ok) {
        throw new Error("Failed to add luggage");
      }
      await fetchLuggageData();
      setNewLuggage({ name: "", status: "", location: "", num_lugg: "" });
    } catch (error) {
      setError("Error adding luggage");
      console.error(error);
    }
  };

  const handleUpdateLuggage = async (id, updatedLuggage) => {
    try {
      const response = await fetch(`http://localhost:3000/api/luggage/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLuggage),
      });
      if (!response.ok) {
        throw new Error("Failed to update luggage");
      }
      await fetchLuggageData();
    } catch (error) {
      setError("Error updating luggage");
      console.error(error);
    }
  };

  const handleDeleteLuggage = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/luggage/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete luggage");
      }
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

  const handleEditProfile = () => {
    setModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setModalOpen(false); // Close the modal
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    // Add your profile update logic here (e.g., API call)
    console.log("Profile updated:", profileData);
    setModalOpen(false); // Close the modal after saving
  };

  const filteredLuggage = luggageData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm.toLowerCase())
  );

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
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        <header className="admin-header-section">
          <h1 className="admin-header-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Overview</h1>
          <div className="admin-header-actions">
            <button className="admin-edit-profile-button" onClick={handleEditProfile}>
              <Edit className="admin-icon" /> Edit Profile
            </button>
            <button className="admin-logout-button" onClick={handleLogout}>
              <LogOut className="admin-icon" /> Logout
            </button>
          </div>
        </header>

        {error && <div className="admin-error">{error}</div>}
        {loading && <div className="admin-loading">Loading...</div>}

        {/* Content Based on Active Tab */}
        {activeTab === 'dashboard' && !loading && (
          <div className="admin-content">
            <div className="admin-cards">
              <div className="admin-card">
                <div className="admin-card-header">
                  <span>Total Users</span>
                  <Users className="admin-icon" />
                </div>
                <div className="admin-card-content">
                  <div className="admin-count">{userData.length}</div>
                </div>
              </div>
              <div className="admin-card">
                <div className="admin-card-header">
                  <span>Active Luggages</span>
                  <Luggage className="admin-icon" />
                </div>
                <div className="admin-card-content">
                  <div className="admin-count">{luggageData.length}</div>
                </div>
              </div>
              <div className="admin-card">
                <div className="admin-card-header">
                  <span>Total Trips</span>
                  <BarChart className="admin-icon" />
                </div>
                <div className="admin-card-content">
                  <div className="admin-count">{luggageData.reduce((acc, curr) => acc + parseInt(curr.num_lugg), 0)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'luggage' && !loading && (
          <div className="admin-luggage-management">
            <div className="admin-luggage-header">
              <h2>Luggage Management</h2>
              <p>Track and manage all luggages</p>
            </div>
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
                        className="admin-edit-button"
                        onClick={() => handleUpdateLuggage(item.id, { /* pass updated data */ })}
                      >
                        <Edit className="admin-icon" />
                      </button>
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
      </main>

      {/* Edit Profile Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSaveProfile}>
              <label>
                Name:
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                />
              </label>
              <label>
                phone:
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="modal-save-button">Save</button>
                <button type="button" className="modal-cancel-button" onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
