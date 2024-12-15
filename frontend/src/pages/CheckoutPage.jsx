


import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/checkout.css';

const CheckoutPage = () => {
  const { cart = [] } = useCart(); 
  const location = useLocation();
  const navigate = useNavigate();

  
  const cartItems = location.state?.cartItems || cart; 
  const cartTotal = location.state?.totalAmount || cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0); // Default to cart total if not provided

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    userId: '123',
  });

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0); 

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const order = {
      items: cart,
      amount: Math.round(cartTotal * 100), 
      currency: 'INR',
      customerInfo: formData,
    };

    try {
      const response = await fetch('http://localhost:3000/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const result = await response.json();
        navigate('/productpayment', {
          state: {
            orderId: result.order.id,
            amount: result.order.amount,
          },
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('There was an error processing your order. Please try again.');
    }
  };

  return (
    <main className="checkout-page">
      <div className="content">
        <h1 className="title">Checkout</h1>

        <div className="order-summary">
          <h2>Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="total">
            <strong>Total:</strong>
            <strong>₹{cartTotal.toFixed(2)}</strong>
          </div>
        </div>

        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Shipping Address</label>
            <textarea
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => navigate('/CartPage')}>
              Back to Cart
            </button>
            <button type="submit">Proceed to Payment</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
