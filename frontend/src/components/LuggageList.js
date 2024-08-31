import React, { useContext } from 'react';
import { LuggageContext } from '../contexts/LuggageContext';

const LuggageList = () => {
  const { luggage, loading, error } = useContext(LuggageContext);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Luggage List</h2>
      <ul>
        {luggage.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - Status: {item.status}, Location: {item.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LuggageList;
