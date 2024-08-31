import React, { useState } from 'react';
import axios from 'axios';

const LuggageForm = () => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/luggage', { name, status, location });
      setName('');
      setStatus('');
      setLocation('');
    } catch (error) {
      console.error('Error adding luggage:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Luggage</h2>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Status:</label>
        <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} required />
      </div>
      <div>
        <label>Location:</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <button type="submit">Add Luggage</button>
    </form>
  );
};

export default LuggageForm;
