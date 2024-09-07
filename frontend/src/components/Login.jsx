// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error logging in");
      }

      const result = await response.json();
      console.log("Login successful:", result); // Debugging line
      localStorage.setItem("token", result.token);
      navigate("/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      console.error("Login error:", error); // Debugging line
      setError(error.message);
    }
  };
  return (
    <div className="login-container">
      <h1>Welcome Back!</h1>
      <p>Log in to your account</p>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
