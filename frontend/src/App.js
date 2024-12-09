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
import InsurancePaymentPage from "./components/insurancepaymentPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutForm from "./pages/CheckoutPage";
import { CartProvider } from './context/CartContext';
import ProductPaymentPage from "./components/productpaymentPage";




function App() {
  return (
    <CartProvider>
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
          <Route path="/insurancepayment" element={<InsurancePaymentPage />} />
          <Route path="/ProductPage" element={<ProductPage />} />
          <Route path="/CartPage" element={<CartPage />} />
          <Route path="/CheckoutPage" element={<CheckoutForm />} />
          <Route path="/productpayment" element={<ProductPaymentPage />} />
       
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;