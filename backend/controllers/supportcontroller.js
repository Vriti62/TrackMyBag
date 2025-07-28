const SupportTicket = require('../models/SupportTicket');

// Create a support ticket
exports.createSupportTicket = async (req, res) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    const { subject, message } = req.body;
    if (!userId || !subject || !message)
      return res.status(400).json({ error: 'All fields are required.' });

    const ticket = new SupportTicket({ userId, subject, message });
    await ticket.save();

    res.status(201).json({ message: 'Support ticket created.', ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create support ticket.' });
  }
};

// Get all support tickets for a user
exports.getUserTickets = async (req, res) => {
  try {
    const userId = req.user?.userId || req.query.userId;
    if (!userId) return res.status(400).json({ error: 'User ID required.' });

    const tickets = await SupportTicket.find({ userId });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch support tickets.' });
  }
};