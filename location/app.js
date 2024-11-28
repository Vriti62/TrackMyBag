const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs"); // Set the view engine to EJS

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  
  socket.on("send-location", (data) => {
    console.log("Location received from client ID:", socket.id, data);
    io.emit("receive-location", { id: socket.id, type: data.type, latitude: data.latitude, longitude: data.longitude });
  });
  

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.render("index"); // Render the "index" view
});

server.listen(3002, () => {
  console.log("Server is running on port 3002");
});
