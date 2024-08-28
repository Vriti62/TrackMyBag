import React, { useState, useEffect } from 'react';
import { getLuggageStatus } from '../utils/api';

const LuggageTracker = () => {
  const [luggage, setLuggage] = useState(null);

  useEffect(() => {
    const fetchLuggageStatus = async () => {
      const data = await getLuggageStatus();
      setLuggage(data);
    };
    fetchLuggageStatus();
  }, []);

  return (
    <div>
      <h1>Luggage Tracker</h1>
      {luggage ? (
        <div>
          <h2>{luggage.name}</h2>
          <p>Status: {luggage.status}</p>
          <p>Location: {luggage.location}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LuggageTracker;
