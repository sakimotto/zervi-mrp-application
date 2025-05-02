import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "zervi_mrp",
  synchronize: process.env.NODE_ENV !== "production",
  logging: true, // Enhanced logging for debugging
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates
  },
  entities: ["src/models/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
  // Add PostgreSQL driver-specific options
  extra: {
    ssl: true, // Force SSL mode
    connectionTimeoutMillis: 10000, // Increase connection timeout
    idleTimeoutMillis: 30000 // Set idle timeout
  }
});

export const initializeDatabase = async () => {
  try {
    console.log("Attempting to connect to database with the following parameters:");
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log(`Database: ${process.env.DB_DATABASE}`);
    console.log(`Username: ${process.env.DB_USERNAME}`);
    
    await AppDataSource.initialize();
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Error during database initialization:", error);
    throw error;
  }
};
