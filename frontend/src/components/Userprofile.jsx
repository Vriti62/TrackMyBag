import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode"; // Corrected the import
import "../styles/userprofile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editValues, setEditValues] = useState({
    username: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const trackStatus = () => {
    window.location.href = "http://localhost:3002";
  };
  
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching user profile:", errorData);
        throw new Error(errorData.error || "Error fetching user profile");
      }

      const userData = await response.json();
      setUser(userData);
      setEditValues({
        username: userData.username,
        email: userData.email,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      return;
    }
  
    const userId = user?.id;
  
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editValues),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error saving profile:", errorData);
        throw new Error(errorData.error || "Error updating profile");
      }
  
      await fetchUserProfile(); // Re-fetch the profile data to ensure it updates
      setIsModalOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };
    
  return (
    <div className="profile-container">
      {/* Profile Section */}
      <div className="profile-section">
        <h1>Your Profile</h1>
        <div className="profile-card">
          <img
            src="https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg"
            alt="User"
            className="profile-image"
          />
          <div className="profile-info">
            <h2>{user?.username || "Loading..."}</h2>
            <p>{user?.email || "Loading..."}</p>
            <button
              className="edit-button"
              onClick={() => setIsModalOpen(true)}
              disabled={loading}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Conditionally Render Luggage Section */}
      {user?.role === "user" && (
        <div className="luggage-section">
          <h2>Luggage Tracking</h2>
          <button className="track-status-button" onClick={trackStatus}>
            Track Status
          </button>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Profile</h2>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={editValues.username}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={editValues.email}
                onChange={handleEditChange}
              />
            </div>
        
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
            <button
              className="cancel-button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
