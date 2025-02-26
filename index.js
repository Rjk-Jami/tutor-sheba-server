const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDatabase = require("./database/connectDatabase");
require("dotenv").config();

const app = express();
const port = process.env.SERVER_PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Fallback Route
app.get("/", (req, res) => res.send("Express on Vercel"));

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error("Error occurred:", error.stack);
  const message = error.message || "Server Error Occurred";
  const status = error.status || 500;
  res.status(status).json({ success: false, message });
});

// Database Connection and Server Start
(async () => {
  try {
    await connectDatabase();
    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
})();

module.exports = app;
