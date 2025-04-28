import "reflect-metadata"; // Required for TypeORM
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import apiRoutes from "./routes/api.routes";
import { initializeDatabase } from "./config/database";

// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();
const port = process.env.PORT || 4000;

// Configure CORS to allow requests from the frontend
// This is important since our frontend and backend are on different ports
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Allow frontend origins
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
}));

// Middleware for parsing request bodies
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route for testing
app.get("/", (req: Request, res: Response) => {
  res.send("Zervi MRP API is running");
});

// API routes - Using /api/v1 to match frontend expectations
app.use("/api/v1", apiRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
const startServer = async () => {
  try {
    // Initialize database connection
    const dbConnected = await initializeDatabase();
    
    if (!dbConnected) {
      console.error("Failed to connect to database. Server will not start.");
      process.exit(1);
    }
    
    // Start Express server with better error handling for port conflicts
    const server = app.listen(port, () => {
      console.log(`✅ Server started successfully!`);
      console.log(`🌐 API available at: http://localhost:${port}/api/v1`);
      console.log(`📝 Documentation at: http://localhost:${port}/`);
      console.log(`⚙️ Running in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Add proper error handling for common server issues
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Error: Port ${port} is already in use.`);
        console.error(`👉 Solution: Change the PORT value in your .env file or close the application using port ${port}.`);
        console.error(`👉 To find which process is using this port, run: netstat -ano | findstr :${port}`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

// Run the server
startServer();
