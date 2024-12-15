import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CheckoutForm = ({ cart = [] }) => { 
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [user, navigate]);

  const handleProceedToPayment = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/productpayment');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <div className="checkout-form">
      <h2>Checkout</h2>
      
      <div className="user-details">
        <h3>Delivery Details</h3>
        <div className="user-info">
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone || 'Not provided'}</p>
          <p>Address: {user.address || 'Not provided'}</p>
        </div>
      </div>

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
