import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa"; // Importing user and lock icons
import { AlertCircle } from "lucide-react"; // Importing alert icon
import "../styles/login.css"; // Ensure this points to your updated CSS

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Clear previous errors
    setError(null);
    setLoading(true); // Set loading to true

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
        console.log("Login successful:", result);
        localStorage.setItem("token", result.token);
        navigate("/dashboard"); // Redirect to dashboard after login
    } catch (error) {
        console.error("Login error:", error);
        setError(error.message); // Set error message
    } finally {
        setLoading(false); // Reset loading state
    }
};

  return (
    <div className="login__container">
      <h1 className="login__title">Welcome Back!</h1>
      <p className="login__subtitle">Log in to your account</p>

      <form onSubmit={handleSubmit} className="login__form">
        <div className="login__input-field-container">
          <FaUser className="login__input-icon" /> {/* Username icon */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login__input-field"
            required
          />
        </div>
        <div className="login__input-field-container">
          <FaLock className="login__input-icon" /> {/* Password icon */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login__input-field"
            required
          />
        </div>
        
        {/* Error message display */}
        {error && (
          <div className="login__error-message">
            <AlertCircle className="error-icon" />
            {error}
          </div>
        )}

        {/* Submit button */}
        <button type="submit" className="login__button">Log in</button>
      </form>

      <div className="text-sm text-gray-500 text-center mt-4">
        Don't have an account? <a href="/signup" className="text-purple-600 hover:underline">Sign up</a>
      </div>
    </div>
  );
};

export default Login;
