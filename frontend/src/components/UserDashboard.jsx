import React, { useEffect, useState } from "react";
import {
  Clipboard,
  ExternalLink,
  LogOut,
  Luggage,
  User,
  Edit,
  X,
  Phone,
  MapPin,
  Shield,
  ShoppingCart,
  Package,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate for redirection
import "../styles/UserDashboard.css";

export default function TrackMyBagDashboard() {
  const [userData, setUserData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation();
  const [userLuggage, setUserLuggage] = useState([]);

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(link);
      setTimeout(() => setCopiedLink(null), 2000);
    });
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
    setEditedData({
      username: userData.username,
      email: userData.email,
      phoneNumber: userData.phoneNumber || "",
      address: userData.address || "",
    });
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setError(null);
  };

  const handleInputChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSaveProfile = async () => {
    if (
      !editedData.username ||
      !editedData.email ||
      !editedData.phoneNumber ||
      !editedData.address
    ) {
      setError("All fields are required.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(editedData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/profile/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            username: editedData.username,
            email: editedData.email,
            phoneNumber: editedData.phoneNumber, // Make sure phoneNumber is null if empty
            address: editedData.address,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const updatedUser = await response.json();
      setUserData(updatedUser.user);
      setSuccessMessage(updatedUser.message);
      setIsEditModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login"); // Redirect to the login page
  };

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      console.log('Uploading profile picture for user:', userData.id);
      const response = await fetch(
        `http://localhost:3000/api/users/${userData.id}/profile-picture`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile picture');
      }

      const data = await response.json();
      console.log('Profile picture update response:', data);
      
      setUserData(prev => ({ 
        ...prev, 
        profilePicture: data.profilePicture 
      }));
      setSuccessMessage('Profile picture updated successfully');
    } catch (error) {
      setError(error.message);
      console.error('Error updating profile picture:', error);
    }
  };

  const refreshUserData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching user data");
      }

      const data = await response.json();
      setUserData(data);
      localStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      setError("Failed to fetch user data.");
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchUserLuggage = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/luggage", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch luggage data");
      }

      const data = await response.json();
      const userLuggageItems = data.filter(item => item.userId === userData.id);
      setUserLuggage(userLuggageItems);
    } catch (error) {
      console.error("Error fetching user luggage:", error);
      setError("Failed to fetch luggage data");
    }
  };

  const renderInsuranceSection = () => (
    <section className="dashboard__section dashboard__insurance-summary">
      <h2 className="dashboard__section-title">
        <Shield className="dashboard__section-icon" />
        Insurance Status
      </h2>
      <p className={`dashboard__insurance-status ${userData?.hasInsurance ? 'claimed' : 'unclaimed'}`}>
        {userData?.hasInsurance ? "Active" : "Inactive"}
      </p>
      <p className="dashboard__insurance-label">
        Insurance Status
      </p>
      {!userData?.hasInsurance && (
        <button 
          onClick={() => navigate('/insurancepayment')} 
          className="dashboard__insurance-btn"
        >
          Buy Insurance
        </button>
      )}
    </section>
  );

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      await refreshUserData();
      await fetchUserLuggage();
      setLoading(false);
    };

    fetchUserData();
  }, [location.state?.refreshData]); // Re-fetch when refreshData changes

  if (loading || !userData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__header-content">
          <div className="dashboard__logo">
            <Luggage className="dashboard__logo-icon" />
            <h1 className="dashboard__title">TrackMyBag</h1>
          </div>
          <div className="dashboard__header-actions">
            <button onClick={() => navigate('/ProductPage')} className="dashboard__shop-btn">
              <ShoppingCart className="dashboard__shop-icon" />
              <span>Shop</span>
            </button>
            <button onClick={handleLogout} className="dashboard__logout-btn">
              <LogOut className="dashboard__logout-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard__main">
        {error && <p className="dashboard__error">{error}</p>}
        {successMessage && (
          <p className="dashboard__success">{successMessage}</p>
        )}
        <div className="dashboard__grid">
          <section className="dashboard__section dashboard__user-info">
            <div className="dashboard__section-header">
              <h2 className="dashboard__section-title">
                <User className="dashboard__section-icon" />
                User Information
              </h2>
              <button
                onClick={handleEditProfile}
                className="dashboard__edit-btn"
              >
                <Edit className="dashboard__edit-icon" />
                Edit Profile
              </button>
            </div>
            <div className="dashboard__profile-picture-container">
              <img
                src={userData.profilePicture 
                  ? `http://localhost:3000${userData.profilePicture}` 
                  : 'https://via.placeholder.com/150'}
                alt="Profile"
                className="dashboard__profile-picture"
                onError={(e) => {
                  console.log('Error loading profile picture, using placeholder');
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <label htmlFor="profile-picture-input" className="dashboard__profile-picture-label">
                <Edit className="dashboard__edit-icon" />
                Change Picture
              </label>
              <input
                type="file"
                id="profile-picture-input"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="dashboard__profile-picture-input"
                style={{ display: 'none' }}
              />
            </div>
            <div className="dashboard__user-details">
              <p>
                <strong>Username:</strong> {userData.username}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p className="dashboard__user-detail">
                <Phone className="dashboard__detail-icon" />
                <strong>Phone:</strong> {userData.phoneNumber || "Not provided"}
              </p>

              <p className="dashboard__user-detail">
                <MapPin className="dashboard__detail-icon" />
                <strong>Address:</strong> {userData.address || "Not provided"}
              </p>
            </div>
          </section>

          <section className="dashboard__section dashboard__tracking-summary">
            <h2 className="dashboard__section-title">
              <Luggage className="dashboard__section-icon" />
              Tracking Summary
            </h2>
            <p className="dashboard__tracking-count">
              {userData.trackingLinks.length}
            </p>
            <p className="dashboard__tracking-label">Active Tracking Links</p>
          </section>

          {renderInsuranceSection()}

          <section className="dashboard__section dashboard__tracking-links">
            <h2 className="dashboard__section-title">
              <ExternalLink className="dashboard__section-icon" />
              Tracking Links
            </h2>
            {userData.trackingLinks.map((link, index) => (
              <div key={index} className="dashboard__link-item">
                <div className="dashboard__link-controls">
                  <input
                    type="text"
                    value={link}
                    readOnly
                    className="dashboard__link-input"
                  />
                  <button
                    onClick={() => copyToClipboard(link)}
                    className="dashboard__copy-btn"
                  >
                    <Clipboard className="dashboard__btn-icon" />
                  </button>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dashboard__open-btn"
                  >
                    <ExternalLink className="dashboard__btn-icon" />
                  </a>
                </div>
                {copiedLink === link && (
                  <p className="dashboard__copied-msg">Copied to clipboard!</p>
                )}
              </div>
            ))}
          </section>

          <section className="dashboard__section dashboard__luggage">
            <h2 className="dashboard__section-title">
              <Package className="dashboard__section-icon" />
              My Luggage
            </h2>
            <div className="dashboard__luggage-list">
              {userLuggage.length > 0 ? (
                userLuggage.map((luggage) => (
                  <div key={luggage.id} className="dashboard__luggage-item">
                    <div className="dashboard__luggage-header">
                      <h3>{luggage.name}</h3>
                      <span className={`dashboard__luggage-status status-${luggage.status.toLowerCase()}`}>
                        {luggage.status}
                      </span>
                    </div>
                    <div className="dashboard__luggage-details">
                      <p><strong>Location:</strong> {luggage.location}</p>
                      <p><strong>Quantity:</strong> {luggage.num_lugg}</p>
                      {luggage.trackingLink && (
                        <a 
                          href={luggage.trackingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="dashboard__track-link"
                        >
                          <ExternalLink size={16} />
                          Track
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="dashboard__no-luggage">No luggage items found</p>
              )}
            </div>
          </section>

        </div>
      </main>

      <footer className="dashboard__footer">
        <p>&copy; 2024 TrackMyBag. All rights reserved.</p>
      </footer>

      {isEditModalOpen && (
        <div className="dashboard__modal-overlay">
          <div className="dashboard__modal">
            <div className="dashboard__modal-header">
              <h2 className="dashboard__modal-title">Edit Profile</h2>
              <button
                onClick={handleCloseModal}
                className="dashboard__modal-close"
              >
                <X className="dashboard__modal-close-icon" />
              </button>
            </div>
            <div className="dashboard__modal-content">
              {["username", "email", "phoneNumber", "address"].map((field) => (
                <div key={field} className="dashboard__form-group">
                  <label htmlFor={field} className="dashboard__form-label">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={editedData[field]}
                    onChange={handleInputChange}
                    className="dashboard__form-input"
                  />
                </div>
              ))}
              {error && <p className="dashboard__error">{error}</p>}
              <button
                onClick={handleSaveProfile}
                className="dashboard__save-btn"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
