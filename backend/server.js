const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Simple Route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running on Railway!");
});

// MongoDB Connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Ensure Railway detects the failure
  });

// Handle Unexpected Errors
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Start the Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
