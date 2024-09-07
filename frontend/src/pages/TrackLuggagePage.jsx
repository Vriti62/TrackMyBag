import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/luggage.css";
import { jwtDecode } from "jwt-decode"; // Ensure correct import here

// Utility Function
const fetchData = async (url, method = "GET", body = null) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken); // Use decoded token as needed
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add token to request headers
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  return response.json();
};

const LuggageItem = ({ luggage, onEdit, onDelete }) => (
  <li className="luggage-item">
    <div className="luggage-details">
      <img
        src={`https://static.vecteezy.com/system/resources/thumbnails/000/215/862/small/Red_Luggage_Vector.jpg`}
        alt={luggage.name}
        className="luggage-image"
      />
      <div>
        <h3>{luggage.name}</h3>
        <h4>Status: {luggage.status}</h4>
        <p>
          <i className="fas fa-tag"></i> Location: {luggage.location}
        </p>
        <p>
          <i className="fas fa-location-arrow"></i> Number of Luggage: {luggage.num_lugg}
        </p>
      </div>
    </div>
    <div className="button-group">
      <button className="edit-button" onClick={() => onEdit(luggage)}>
        <i className="fas fa-edit"></i> Edit
      </button>
      <button className="delete-button" onClick={() => onDelete(luggage.id)}>
        <i className="fas fa-trash"></i> Delete
      </button>
    </div>
  </li>
);

const LuggageForm = ({ luggage, onChange, onSubmit, onCancel, isEditing }) => (
  <div
    className={`luggage-form ${
      isEditing ? "edit-luggage-form" : "add-luggage-form"
    }`}
  >
    <h2>{isEditing ? "Edit Luggage" : "Add New Luggage"}</h2>
    
    {!isEditing && (
      <>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={luggage.name}
          onChange={onChange}
        />
        <input
          type="text"
          name="num_lugg"
          placeholder="Number of Luggages"
          value={luggage.num_lugg}
          onChange={onChange}
        />
      </>
    )}
    
    <input
      type="text"
      name="status"
      placeholder="Status"
      value={luggage.status}
      onChange={onChange}
    />
    <input
      type="text"
      name="location"
      placeholder="Location"
      value={luggage.location}
      onChange={onChange}
    />
    
    <button
      className={isEditing ? "update-luggage-button" : "add-luggage-button"}
      onClick={onSubmit}
    >
      <i className={`fas ${isEditing ? "fa-save" : "fa-plus"}`}></i>{" "}
      {isEditing ? "Update Luggage" : "Add Luggage"}
    </button>
    
    {isEditing && (
      <button className="cancel-edit-button" onClick={onCancel}>
        <i className="fas fa-times"></i> Cancel
      </button>
    )}
  </div>
);


function LuggageTracker() {
  const [luggages, setLuggages] = useState([]);
  const [newLuggage, setNewLuggage] = useState({
    name: "",
    status: "",
    location: "",
    num_lugg: "",
  });
  const [editLuggageId, setEditLuggageId] = useState(null);
  const [editLuggage, setEditLuggage] = useState({
    name: "",
    status: "",
    location: "",
    num_lugg: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role !== "admin") {
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Token decoding failed:", error);
      navigate("/login");
      return;
    }

    // Fetch luggage data and use it directly
    fetchData("http://localhost:3000/api/luggage")
      .then((data) => {
        if (Array.isArray(data)) {
          setLuggages(data);
        }
      })
      .catch((err) => {
        setError(err.message);
        if (err.message === "Unauthorized") navigate("/login");
      });
  }, [navigate]);

  const addLuggage = () => {
    fetchData("http://localhost:3000/api/luggage", "POST", newLuggage)
      .then((data) => {
        if (data && data.luggage) {
          setLuggages([...luggages, data.luggage]);
          setNewLuggage({ name: "", status: "", location: "", num_lugg: "" });
        }
      })
      .catch((err) => {
        setError(err.message);
        if (err.message === "Unauthorized") navigate("/login");
      });
  };

  const deleteLuggage = (id) => {
    fetchData(`http://localhost:3000/api/luggage/${id}`, "DELETE")
      .then(() => {
        setLuggages(luggages.filter((luggage) => luggage.id !== id));
      })
      .catch((err) => {
        setError(err.message);
        if (err.message === "Unauthorized") navigate("/login");
      });
  };

  const startEditLuggage = (luggage) => {
    setEditLuggageId(luggage.id);
    setEditLuggage({ ...luggage });
  };

  const updateLuggage = () => {
    fetchData(
      `http://localhost:3000/api/luggage/${editLuggageId}`,
      "PUT",
      editLuggage
    )
      .then((data) => {
        if (data && data.luggage) {
          setLuggages(
            luggages.map((luggage) =>
              luggage.id === editLuggageId ? data.luggage : luggage
            )
          );
          setEditLuggageId(null);
          setEditLuggage({ name: "", status: "", location: "", num_lugg: "" });
        }
      })
      .catch((err) => {
        setError(err.message);
        if (err.message === "Unauthorized") navigate("/login");
      });
  };

  const handleChange = (event, setter) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="luggage-tracker">
      <header className="header">
        <h1>TrackMyBag</h1>
        <div className="header-icons">
          <i className="fas fa-bell"></i>
          <i className="fas fa-user"></i>
        </div>
      </header>

      <main className="main-content">
        <div className="luggage-list-container">
          <ul className="luggage-list">
            {luggages.length > 0 ? (
              luggages.map((luggage) => (
                <LuggageItem
                  key={luggage.id}
                  luggage={luggage}
                  onEdit={startEditLuggage}
                  onDelete={deleteLuggage}
                />
              ))
            ) : (
              <p>No luggage found.</p>
            )}
          </ul>
        </div>

        <div className="form-container">
          <LuggageForm
            luggage={editLuggageId ? editLuggage : newLuggage}
            onChange={(e) =>
              handleChange(e, editLuggageId ? setEditLuggage : setNewLuggage)
            }
            onSubmit={editLuggageId ? updateLuggage : addLuggage}
            onCancel={() => setEditLuggageId(null)}
            isEditing={!!editLuggageId}
          />
        </div>
      </main>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default LuggageTracker;
