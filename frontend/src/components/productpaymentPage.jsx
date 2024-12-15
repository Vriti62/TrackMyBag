
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/productpaymentpage.css';

const ProductPaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, amount } = location.state || {};

  useEffect(() => {
    if (!orderId || !amount) {
      setError('Invalid order data. Please go back and try again.');
    }
  }, [orderId, amount]);
  const handlePayment = async () => {
    if (!orderId || !amount) {
        setError('Invalid order data. Please go back and try again.');
        return;
    }

    setLoading(true);
    try {
        const response = await axios.post('http://localhost:3000/api/createOrder', {
            amount: parseInt(amount),
            currency: 'INR',
            receipt: orderId,
        });

        const options = {
            key: 'rzp_test_jnFll4vBKCwPho',
            amount: response.data.amount,
            currency: response.data.currency,
            name: 'TrackMyBag',
            description: 'Order Payment',
            order_id: response.data.id,
            handler: async (response) => {
                try {
                    const verificationResponse = await axios.post('http://localhost:3000/api/verifyPayment', {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    });
                    if (verificationResponse.data.success) {
                        alert('Payment successful!');
                        navigate('/userdashboard', { state: { orderId: response.razorpay_order_id } });
                    } else {
                        setError('Payment verification failed.');
                    }
                } catch (err) {
                    console.error('Payment verification error:', err);
                    setError('Payment verification failed.');
                }
            },
            prefill: {
                name: 'yashmit',
                email: 'yashmit@gmail.com',
            },
            theme: {
                color: '#3399cc'
            }
        };

        // Check if Razorpay is loaded
        if (typeof window.Razorpay === 'undefined') {
            console.error('Razorpay SDK not loaded');
            setError('Razorpay SDK not loaded. Please refresh the page.');
            return;
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    } catch (err) {
        console.error('Checkout error:', err);
        setError('Failed to initiate payment. Please try again.');
    } finally {
        setLoading(false);
    }
};

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-payment-page">
      <h1>Complete Your Payment</h1>
      <p>Order ID: {orderId}</p>
      <p>Total Amount: ₹{(parseInt(amount) / 100).toFixed(2)}</p>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default ProductPaymentPage;




