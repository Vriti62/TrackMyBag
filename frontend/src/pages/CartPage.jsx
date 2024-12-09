import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import "../styles/cartpage.css";

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity } = useCart(); // use updateCartQuantity
  const navigate = useNavigate();

  // Calculate total price
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Handle quantity updates
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId); // Remove item if quantity is less than 1
    } else {
      updateCartQuantity(productId, newQuantity); // Correct function for updating quantity
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart-container">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/ProductPage')} className="continue-shopping-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">₹{item.price.toFixed(2)}</p> {/* Changed $ to ₹ */}
              </div>
              
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              
              <div className="item-total">
                ₹{(item.price * item.quantity).toFixed(2)} {/* Changed $ to ₹ */}
              </div>
              
              <button 
                className="remove-item"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{total.toFixed(2)}</span> {/* Changed $ to ₹ */}
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span> {/* Changed $ to ₹ */}
            </div>
          </div>
          
          <div className="cart-actions">
            <button 
              className="continue-shopping"
              onClick={() => navigate('/ProductPage')}
            >
              Continue Shopping
            </button>
            <button 
              className="checkout"
              onClick={() => navigate('/CheckoutPage')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
