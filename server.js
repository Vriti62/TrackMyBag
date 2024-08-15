const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const luggageRoutes = require('./routes/luggageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// TODO: Initialize Express application
const app = express();

// TODO: Connect to the database
connectDB();

// TODO: Initialize middleware (e.g., body parser, logger)
app.use(express.json());

// TODO: Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/luggage', luggageRoutes);
app.use('/api/notifications', notificationRoutes);

// TODO: Set up error handling middleware
app.use(require('./middleware/errorMiddleware'));

// TODO: Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
