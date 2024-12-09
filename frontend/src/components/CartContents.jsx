import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartContents() {
  const { cart, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  // Calculate total amount
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Update quantity directly
  const updateCartQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      addToCart(updatedCart);
    }
  };

  // Handle checkout navigation
  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/CheckoutPage');
  };

  // Render empty cart message
  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <p className="empty-cart-message">Your cart is empty.</p>
        <button
          onClick={() => navigate('/')}
          className="continue-shopping"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <div className="item-image">
            <img src={item.image} alt={item.name} />
          </div>
          <div className="item-details">
            <h3 className="item-name">{item.name}</h3>
            <p className="item-price">₹{item.price.toFixed(2)}</p>
          </div>
          <div className="quantity-controls">
            <button
              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
              className="quantity-decrease"
            >
              -
            </button>
            <span className="quantity-display">{item.quantity}</span>
            <button
              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
              className="quantity-increase"
            >
              +
            </button>
          </div>
          <button
            className="remove-item"
            onClick={() => removeFromCart(item.id)}
          >
            Remove
          </button>
        </div>
      ))}

      <div className="cart-summary">
        <p className="total-amount">Total: ₹{total.toFixed(2)}</p>
        <div className="cart-actions">
          <button
            onClick={() => navigate('/')}
            className="continue-shopping"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleProceedToCheckout}
            className="checkout"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
