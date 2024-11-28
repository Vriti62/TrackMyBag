import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  // Fetch user data and plans when component mounts
  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch plans
    fetch("http://localhost:3000/api/plans")
      .then((response) => response.json())
      .then((data) => setPlans(data))
      .catch((error) => console.error("Error fetching plans:", error));

    fetchUserData();
  }, []);

  const handlePayment = async (planId) => {
    if (!userData) {
      setMessage("Please log in to continue");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          userId: userData.id,
          planId 
        }),
      });

      const order = await response.json();

      if (response.ok) {
        const options = {
          key: "rzp_test_igrAjQy1wbOunD",
          amount: order.amount,
          currency: "INR",
          name: "TrackMyBag",
          description: "Insurance Plan",
          order_id: order.id,
          handler: async (paymentResult) => {
            try {
              const verification = await fetch("http://localhost:3000/api/verifyPayment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  order_id: paymentResult.razorpay_order_id,
                  payment_id: paymentResult.razorpay_payment_id,
                  signature: paymentResult.razorpay_signature,
                  planId: planId,
                  userId: userData.id
                }),
              });

              const result = await verification.json();
              console.log("Verification result:", result); // Debug log

              if (result.success) {
                setMessage("Payment Verified Successfully!");
                
                try {
                  // Fetch fresh user data
                  const userResponse = await fetch("http://localhost:3000/api/users/profile", {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  });
                  
                  if (userResponse.ok) {
                    const freshUserData = await userResponse.json();
                    console.log("Fresh user data:", freshUserData); // Debug log
                    
                    // Update localStorage
                    localStorage.setItem('userData', JSON.stringify({
                      ...freshUserData,
                      insuranceClaimed: true
                    }));
                    
                    // Update state
                    setUserData(prevData => ({
                      ...prevData,
                      insuranceClaimed: true
                    }));
                    
                    // Navigate after a short delay
                    setTimeout(() => {
                      navigate('/dashboard', { state: { refreshData: true } });
                    }, 1500);
                  }
                } catch (userError) {
                  console.error("Error fetching updated user data:", userError);
                }
              } else {
                setMessage("Payment Verification Failed: " + result.message);
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
      } else {
        setMessage("Error creating order. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Payment failed. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Select a Plan</h1>
      {message && <p style={{ color: message.includes("Success") ? "green" : "red" }}>{message}</p>}
      {!userData && <p style={{ color: "red" }}>Please log in to purchase insurance</p>}
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div
              key={plan.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "20px",
                margin: "10px",
                width: "250px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
              }}
            >
              <h2>{plan.name}</h2>
              <p>Price: ₹{plan.amount}</p>
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#F37254",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => handlePayment(plan.id)}
                disabled={!userData}
              >
                Buy Now
              </button>
            </div>
          ))
        ) : (
          <p>Loading plans...</p>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
