const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");

// Load environment variables
dotenv.config();

// Import routes
const { router: authRouter } = require("./routes/auth");
const galleryRoutes = require("./routes/gallery");
const blogRoutes = require("./routes/blog");
const productRoutes = require("./routes/products");

const app = express();

// Make sure this comes BEFORE your route definitions
app.use(
  cors({
    origin: "*", // Allow all origins temporarily for testing
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Middleware
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Increase payload size limit for file uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Add simple test endpoint for connection testing
app.get("/api/test", (req, res) => {
  res.json({ message: "API connection successful!" });
});

// Connect to MongoDB with better error handling
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/odaville", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.log(
      "Check that MongoDB service is running and connection string is correct."
    );
  });

// Routes
app.use("/api/auth", authRouter);
app.use("/api/gallery", galleryRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/products", productRoutes);

// Improved error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);

  // Handle specific error types
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ message: "File upload error: " + err.message });
  }

  if (err.name === "MongoError") {
    return res.status(500).json({ message: "Database error: " + err.message });
  }

  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Add favicon route to prevent 404 errors
app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // No content response
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
