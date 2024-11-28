// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import LuggageTracker from "./pages/TrackLuggagePage";
import UserProfile from "./pages/UserProfile";
import Support from "./components/Support";
import SupportTickets from "./components/SupportTickets";
import { Insurance } from './components/Insurance';
import PaymentPage from "./components/paymentPage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/track-luggage" element={<LuggageTracker />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/Support" element={<Support />} />
        <Route path="/support/tickets" element={<SupportTickets />} />
        <Route path="/Insurance" element={<Insurance />} />
        <Route path="/PaymentPage" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
