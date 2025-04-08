const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Log environment variables for debugging
if (!process.env.MONGO_URI) {
    console.error("ERROR: MONGO_URI is not defined in environment variables.");
    process.exit(1); // Stop the server
}


app.use(express.json());
app.use(cors());

// Connect to MongoDB before starting the server
connectDB().then(() => {
    // Define a test route for Railway
    app.get("/", (req, res) => {
        res.send("Backend is running on Railway!");
    });

    // API Routes
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/water", require("./routes/waterRoutes"));

    // Start the server only after DB is connected
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit process if DB fails
});
