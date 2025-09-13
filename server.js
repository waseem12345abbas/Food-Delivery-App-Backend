require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http"); // ⬅ import http
const { Server } = require("socket.io"); // ⬅ import socket.io

// database connection
const connectDB = require("./config/db");

// require the api requests routes controller
const apiRoutes = require("./routes/apiRoutes");

// create the app
const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // client URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-type", "Authorization"],
    credentials: true,
  })
);

// mount the request
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 5000;

// create server instance
const server = http.createServer(app);

// create socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // same frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// handle socket.io connections
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on("joinOrder", (orderId) => {
    socket.join(orderId);
    console.log(`User joined room for order: ${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// helper function to notify users
const notifyOrderUpdate = (orderId, updatedOrder) => {
  io.to(orderId).emit("orderUpdated", updatedOrder);
};

// export notifyOrderUpdate so routes can use it
module.exports = { server, connectDB, notifyOrderUpdate };

// start the server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize the server", err);
  });
