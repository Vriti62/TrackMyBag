import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Support.css'; // Import the CSS file

function Support() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    subject: '',
    message: '',
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage('Your message has been sent successfully.');
        console.log('Form submitted:', data);
      } else {
        setResponseMessage('There was an error sending your message.');
        console.error('Error submitting form:', response.statusText);
      }
    } catch (error) {
      setResponseMessage('There was an error connecting to the server.');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="support-container">
      <h2>Support</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userName">UserName:</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">
          Submit
        </button>

        <button type="button" onClick={() => navigate('/')}>
          Go back to homepage
        </button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default Support;