import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./config/database";

// Import routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import divisionRoutes from "./routes/division.routes";
import itemRoutes from "./routes/item.routes";
import bomRoutes from "./routes/bom.routes";
import inventoryRoutes from "./routes/inventory.routes";
import manufacturingRoutes from "./routes/manufacturing.routes";
import operationRoutes from "./routes/operation.routes";

// Initialize environment variables
dotenv.config();

// Create Express application
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/divisions", divisionRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/boms", bomRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/manufacturing", manufacturingRoutes);
app.use("/api/operations", operationRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
