const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Routes
app.use('/api/luggage', require('./routes/luggageRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('send-location', (data) => {
    console.log('Location received from client ID:', socket.id, data);
    io.emit('receive-location', { id: socket.id, ...data });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    io.emit('user-disconnected', socket.id);
  });
});

// Render the EJS view for the map
app.get('/', (req, res) => {
  res.render('index'); // Ensure you have an EJS template for the map
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
