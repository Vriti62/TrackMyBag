

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const InsurancePaymentPage = () => {
  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchPlans = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/plans");
        setPlans(response.data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchUserData();
    fetchPlans();
  }, []);

  const handlePayment = async (planId) => {
    if (!userData) {
      setMessage("Please log in to continue");
      return;
    }

    try {
      const selectedPlan = plans.find(plan => plan.id === planId);
      const orderResponse = await axios.post("http://localhost:3000/api/createOrder", {
        amount: selectedPlan.amount,
        currency: "INR",
        receipt: `receipt_${userData.id}_${planId}`,
      });

      const options = {
        key: "rzp_test_jnFll4vBKCwPho",
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: "TrackMyBag",
        description: "Insurance Plan",
        order_id: orderResponse.data.id,
        handler: async (paymentResult) => {
          try {
            const verificationResponse = await axios.post("http://localhost:3000/api/verifyPayment", {
              razorpay_order_id: paymentResult.razorpay_order_id,
              razorpay_payment_id: paymentResult.razorpay_payment_id,
              razorpay_signature: paymentResult.razorpay_signature,
              userId: userData.id,
              planId: planId,
              amount: selectedPlan.amount,
              paymentType: 'insurance'
            });

            if (verificationResponse.data.success) {
              setMessage("Payment Verified Successfully!");
              navigate('/dashboard', { 
                state: { 
                  refreshData: Date.now()
                } 
              });
            } else {
              setMessage("Payment Verification Failed: " + verificationResponse.data.message);
            }
          } catch (error) {
            console.error("Verification error:", error);
            setMessage("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function() {
            setMessage("Payment cancelled by user");
          }
        },
        prefill: {
          name: userData.username,
          email: userData.email,
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Payment failed. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Premium Protection Plan</h1>
      {message && <p style={{ color: message.includes("Success") ? "green" : "red" }}>{message}</p>}
      {!userData && <p style={{ color: "red" }}>Please log in to purchase insurance</p>}
      
      <div className="plan-card" style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "2rem",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        maxWidth: "600px",
        margin: "0 auto",
        border: "1px solid #e0e0e0"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ 
            fontSize: "3rem", 
            margin: "0",
            color: "#2d3748",
            fontWeight: "bold" 
          }}>
            ₹500
          </h2>
          <p style={{ 
            color: "#718096",
            fontSize: "1.1rem",
            marginTop: "0.5rem" 
          }}>
            One-time payment
          </p>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          {[
            {
              title: "Quick Replacements",
              description: "Damaged sensors replaced within 3–5 business days.",
              icon: "🔄"
            },
            {
              title: "Exclusive Sensor Coverage",
              description: "Insurance covers accidental damage or malfunction of your luggage tracking sensor.",
              icon: "🛡️"
            },
            {
              title: "Instant Activation",
              description: "Activate your policy with one click and enjoy immediate protection.",
              icon: "⚡"
            },
            {
              title: "Eco-Friendly Recycling",
              description: "Return damaged sensors for sustainable disposal and recycling.",
              icon: "♻️"
            }
          ].map((feature, index) => (
            <div key={index} style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "1.5rem",
              gap: "1rem"
            }}>
              <span style={{ 
                fontSize: "1.5rem",
                lineHeight: "1.5rem" 
              }}>
                {feature.icon}
              </span>
              <div>
                <h3 style={{ 
                  margin: "0 0 0.25rem 0",
                  fontSize: "1.1rem",
                  color: "#2d3748"
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  margin: "0",
                  color: "#718096",
                  fontSize: "0.95rem",
                  lineHeight: "1.4"
                }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          style={{
            width: "100%",
            padding: "1rem",
            backgroundColor: "#F37254",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1.1rem",
            fontWeight: "600",
            transition: "background-color 0.2s ease",
          }}
          onClick={() => handlePayment(plans[0]?.id)}
          disabled={!userData}
        >
          Get Protected Now
        </button>
      </div>
    </div>
  );
};

export default InsurancePaymentPage;

