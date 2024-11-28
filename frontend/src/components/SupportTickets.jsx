import React, { useEffect, useState } from 'react';
import '../styles/SupportTickets.css'; // Optional: import custom CSS for styling

function ViewTickets() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/support/tickets');
        if (response.ok) {
          const data = await response.json();
          setTickets(data);
        } else {
          setError('Error fetching tickets');
        }
      } catch (err) {
        setError('There was an error connecting to the server.');
        console.error('Error fetching tickets:', err);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="tickets-container">
      <h2>Support Tickets</h2>
      {error && <p className="error-message">{error}</p>}
      <ul className="ticket-list">
        {tickets.map((ticket) => (
          <li key={ticket.createdAt} className="ticket-item">
            <h3>{ticket.subject}</h3>
            <p><strong>User:</strong> {ticket.userName}</p>
            <p><strong>Message:</strong> {ticket.message}</p>
            <p><strong>Date and time:</strong> {ticket.createdAt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewTickets;
