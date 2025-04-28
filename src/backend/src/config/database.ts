import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create and export the TypeORM DataSource (connection)
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "zervi_mrp",
  synchronize: false, // Set to false in production to avoid accidental schema changes
  logging: process.env.NODE_ENV === "development",
  entities: [__dirname + "/../models/**/*.{js,ts}"],
  subscribers: [],
  migrations: [],
});

// Function to initialize the database connection
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established successfully");
    return true;
  } catch (error) {
    console.error("Error connecting to database:", error);
    return false;
  }
};
