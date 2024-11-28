// const express = require("express");
// const app = express();
// const http = require("http");
// const path = require("path");
// const socketio = require("socket.io");
// const server = http.createServer(app);
// const io = socketio(server);

// app.set("view engine", "ejs"); // Set the view engine to EJS

// // Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, "public")));

// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   socket.on("send-location", (data) => {
//     console.log("Location received from client ID:", socket.id, data);
//     io.emit("receive-location", { id: socket.id, type: data.type, latitude: data.latitude, longitude: data.longitude });
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//     io.emit("user-disconnected", socket.id);
//   });
// });

// app.get("/", (req, res) => {
//   res.render("index"); // Render the "index" view
// });

// server.listen(3002, () => {
  
//   console.log("Server is running on port 3002");
// });

const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const ngrok = require("ngrok");

const app = express();
const portBase = 3002; // Base port to start from
const maxUsers = 3; // Maximum number of users (and tunnels)
let currentUserCount = 0; // Keep track of the number of active users

app.set("view engine", "ejs"); // Set the view engine to EJS

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

const createServerInstance = async (userId) => {
  const appInstance = express(); // Create a new Express instance for each user
  const serverInstance = http.createServer(appInstance);
  const io = socketio(serverInstance);
  const userPort = portBase + currentUserCount; // Assign a unique port for each user

  appInstance.set("view engine", "ejs"); // Set the view engine to EJS

  // Serve static files from the "public" directory
  appInstance.use(express.static(path.join(__dirname, "public")));

  io.on("connection", (socket) => {
    console.log(`New client connected for user ${userId}:`, socket.id);

    socket.on("send-location", (data) => {
      console.log(`Location received from user ${userId}, client ID:`, socket.id, data);
      io.emit("receive-location", { id: socket.id, type: data.type, latitude: data.latitude, longitude: data.longitude });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected for user ${userId}:`, socket.id);
      io.emit("user-disconnected", socket.id);
    });
  });

  appInstance.get("/", (req, res) => {
    res.render("index"); // Render the "index" view
  });

  // Start the server instance
  serverInstance.listen(userPort, async () => {
    console.log(`Server instance for user ${userId} is running on port ${userPort}`);
    
    // Start ngrok tunnel
    const ngrokUrl = await startNgrok(userPort);
  });
  
  currentUserCount++; // Increment the user count for the next instance
};

// Method to start ngrok tunnel
const startNgrok = async (userPort) => {
  try {
    const url = await ngrok.connect(userPort); // Create ngrok tunnel for this port
    console.log(`Ngrok tunnel created for user: ${url}`);
    return url;
  } catch (error) {
    console.error('Error creating ngrok tunnel:', error);
  }
};

// Method to add a new user and create a tunnel for them
const addUser = (userId) => {
  if (currentUserCount < maxUsers) {
    createServerInstance(userId); // Create a new server instance for the user
  } else {
    console.log("Maximum number of users reached. Cannot create more tunnels.");
  }
};

// Example: Adding new users (you could replace this with actual user login logic)
setInterval(() => {
  addUser(`user${currentUserCount + 1}`);
}, 10000); // Simulate adding new users every 10 seconds

console.log("Main server is running. Waiting for user connections...");
