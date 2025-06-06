import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Use named import
// import "../styles/Dashboard.css"; // Make sure the path is correct

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Decode token to get user data
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role); // Set the role from the token
    } catch (error) {
      console.error("Token decoding failed:", error);
      navigate("/login");
    }
  }, [navigate]);

  // Redirect based on role
  if (role === null) {
    return null; // Optionally show a loading spinner or message
  }

  if (role === "admin") {
    return navigate("/admindashboard");
  } else if (role === "user") {
    return navigate("/userdashboard");
  } else {
    // Redirect or show a message for unauthorized roles
    navigate("/login");
    return null;
  }
};

export default Dashboard;
