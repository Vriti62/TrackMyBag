import React, { useState } from 'react';
import { Shield, AlertTriangle, Zap, CreditCard } from 'lucide-react';
import '../styles/insurance.css';

const insuranceTiers = [
  { 
    id: 'basic', 
    name: 'Basic', 
    description: 'Covers lost or delayed luggage', 
    price: 750,
    icon: <Shield className="icon" />
  },
  { 
    id: 'standard', 
    name: 'Standard', 
    description: 'Covers lost, delayed, or damaged luggage', 
    price: 1500,
    icon: <AlertTriangle className="icon" />
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    description: 'Covers lost, delayed, damaged luggage, and trip disruptions like theft', 
    price: 2250,
    icon: <Zap className="icon" />
  },
];

export function Insurance() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedTier) {
      setShowPayment(true);
    }
  };

  return (
    <div className="insurance-form">
      <h2>Luggage Insurance Selection</h2>
      <p className="subtitle">Choose an insurance plan for your luggage</p>
      <form onSubmit={handleSubmit}>
        <div className="form-content">
          <div className="insurance-options">
            <label className="section-label">Insurance Coverage</label>
            <div className="tier-grid">
              {insuranceTiers.map((tier) => (
                <div key={tier.id} className="tier-card">
                  <input
                    type="radio"
                    id={tier.id}
                    name="insuranceTier"
                    value={tier.id}
                    checked={selectedTier === tier.id}
                    onChange={() => setSelectedTier(tier.id)}
                    className="tier-input"
                  />
                  <label htmlFor={tier.id} className="tier-label">
                    <div className="tier-header">
                      <span className="tier-name">{tier.name}</span>
                      {tier.icon}
                    </div>
                    <span className="tier-price">₹{tier.price.toLocaleString()}</span>
                    <p className="tier-description">{tier.description}</p>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {selectedTier && !showPayment && (
            <div className="selected-insurance">
              <h3>Selected Insurance</h3>
              <p className="selected-name">{insuranceTiers.find(tier => tier.id === selectedTier).name}</p>
              <p className="selected-description">
                {insuranceTiers.find(tier => tier.id === selectedTier).description}
              </p>
              <p className="selected-price">
                Price: ₹{insuranceTiers.find(tier => tier.id === selectedTier).price.toLocaleString()}
              </p>
            </div>
          )}

          {showPayment && (
            <div className="payment-form">
              <h3>Payment Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cardName">Name on Card</label>
                  <input id="cardName" type="text" placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input id="cardNumber" type="text" placeholder="1234 5678 9012 3456" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryMonth">Expiry Month</label>
                  <select id="expiryMonth" required>
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month.toString().padStart(2, '0')}>
                        {month.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="expiryYear">Expiry Year</label>
                  <select id="expiryYear" required>
                    <option value="">Year</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input id="cvv" type="text" placeholder="123" required />
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className={`submit-button ${!selectedTier ? 'disabled' : ''}`}
          disabled={!selectedTier}
        >
          {showPayment ? (
            <>
              <CreditCard className="button-icon" />
              Pay Now
            </>
          ) : (
            <>
              <Shield className="button-icon" />
              Select Insurance Plan
            </>
          )}
        </button>
      </form>
    </div>
  );
}

