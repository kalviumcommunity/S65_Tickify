const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const userRoutes = require("./routes/userRoute");
const checklistRoutes = require("./routes/checklistRoutes"); // Fixed naming

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // Allow only the specified frontend
    credentials: true, // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
); // Enable CORS for frontend communication

// Routes
app.use("/api/users", userRoutes);
app.use("/api/checklists", checklistRoutes); // Add Checklist API

// Root Route
app.get("/", (req, res) => {
  res.status(200).send("Backend is running Successfully...");
});

// Start Server with DB Connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
  }
};

startServer();