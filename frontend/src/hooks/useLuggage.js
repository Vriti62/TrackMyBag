import { useState, useEffect } from 'react';
import axios from 'axios';

// Custom hook to fetch and manage luggage data
const useLuggage = () => {
  const [luggage, setLuggage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLuggage = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/luggage');
        setLuggage(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLuggage();
  }, []);

  return { luggage, loading, error };
};

export default useLuggage;
