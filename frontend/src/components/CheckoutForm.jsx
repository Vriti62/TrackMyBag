import React from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ cart = [] }) => { 
  const navigate = useNavigate();

  const handleProceedToPayment = () => {
    
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/productpayment');
  };

  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="checkout-form">
      <h2>Checkout</h2>
      <div>
        <h3>Order Summary</h3>
        
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <p>{item.name} - {item.quantity} x {item.price} INR</p>
            </div>
          ))
        )}
      </div>
      
      {cart.length > 0 && (
        <div className="total-amount">
          <p>Total: {calculateTotal()} INR</p>
        </div>
      )}
      <button onClick={handleProceedToPayment} className="btn-proceed">
        Proceed to Payment
      </button>
    </div>
  );
};

export default CheckoutForm;
