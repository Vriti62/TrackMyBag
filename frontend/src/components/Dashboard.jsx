import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css'; // Ensure the path is correct

const Dashboard = () => {
  const navigate = useNavigate();

  // Sample data, replace with actual data fetching logic
  const userMetrics = {
    luggageCount: 5,
    recentActivity: 'No recent activity',
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to Your Dashboard</h1>
      <div className="overview-widgets">
        <div className="widget">
          <h2>Luggage Count</h2>
          <p>{userMetrics.luggageCount}</p>
        </div>
        <div className="widget">
          <h2>Recent Activity</h2>
          <p>{userMetrics.recentActivity}</p>
        </div>
      </div>
      <div className="navigation-links">
        <button onClick={() => navigate('/track-luggage')} className="nav-button">Track Luggage</button>
        <button onClick={() => navigate('/profile')} className="nav-button">View Profile</button>
        <button onClick={handleLogout} className="nav-button logout-button">Logout</button> {/* Logout button */}
      </div>
    </div>
  );
};

export default Dashboard;
