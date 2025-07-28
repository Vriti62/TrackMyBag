const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportcontroller');

router.post("/", supportController.createSupportTicket);
router.get("/tickets", supportController.getUserTickets);

module.exports = router;