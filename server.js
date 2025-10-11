require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require('http');

// database connection
const connectDB = require("./config/db");

// require the api requests routes controller
const apiRoutes = require("./routes/apiRoutes");

// create the app
const app = express();
const server = http.createServer(app);
const io = require('./utils/socket').init(server);

// middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://food-delivery-app-558s-aoh7ka6pz.vercel.app"
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-type", "Authorization"],
    credentials: true,
  })
);

// serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

// mount the request
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 5000;

// export connectDB so routes can use it
module.exports = { connectDB };

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
