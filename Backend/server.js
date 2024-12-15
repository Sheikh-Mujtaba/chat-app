

const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000", // Adjust origin if needed
    origin :"https://chatapp-type.netlify.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Listen for 'send_message' event
  socket.on("send_message", (data) => {
    console.log("Message from client:", data);

    // Emit message to all connected clients
    io.emit("receive_message", data);// Use the correct event name
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

server.listen(8081, () => {
  console.log("Server working on port 8081");
});


