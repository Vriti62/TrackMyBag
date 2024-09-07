const SupportModel = require('../models/supportModel');// Import the functions directly

// Create a support ticket
exports.createSupportTicket = (req, res) => {
  const { userName, subject, message } = req.body;

  try {
    const tickets = SupportModel.getAllTickets(); // Use SupportModel function
    const newTicket = {
      userName : userName,
      subject: subject,
      message: message,
      status: 'open', // Default status when a ticket is created
      createdAt: new Date().toISOString()
    };

    SupportModel.addTicket(newTicket); // Use SupportModel function

    res.status(201).json({ message: 'Support ticket created successfully', ticket: newTicket });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all support tickets for a user
exports.getUserTickets = (req, res) => {

  try {
    const tickets = SupportModel.getAllTickets(); // Use SupportModel function
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};