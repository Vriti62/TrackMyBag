const fs = require('fs');
const path = require('path');
const supportFilePath = path.join(__dirname, '../data/support_tickets.json'); // Path to your support tickets file

// Read support tickets from file
const readTicketsFromFile = () => {
  if (!fs.existsSync(supportFilePath)) {
    return [];
  }
  const data = fs.readFileSync(supportFilePath, 'utf8'); // Specify encoding to ensure proper reading
  return JSON.parse(data);
};

// Write support tickets to file
const writeTicketsToFile = (tickets) => {
  fs.writeFileSync(supportFilePath, JSON.stringify(tickets, null, 2), 'utf8'); // Specify encoding to ensure proper writing
};

// Static methods for managing support tickets
const getAllTickets = () => {
  return readTicketsFromFile();
};

const addTicket = (newTicket) => {
  const tickets = readTicketsFromFile();
  tickets.push(newTicket);
  writeTicketsToFile(tickets);
};

module.exports = {
  getAllTickets,
  addTicket,
};