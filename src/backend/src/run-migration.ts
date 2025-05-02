import "reflect-metadata";
import { AppDataSource } from "./config/database";

/**
 * Direct migration script for inventory management tables
 * 
 * This script directly initializes the database connection and 
 * runs all pending migrations, providing clearer error messages.
 */
async function runMigrations() {
  console.log("Starting database migration process...");
  
  try {
    // Initialize the database connection
    console.log("Initializing database connection...");
    await AppDataSource.initialize();
    console.log("Database connection established successfully");
    
    // Run all pending migrations
    console.log("Running pending migrations...");
    const migrations = await AppDataSource.runMigrations();
    
    console.log(`Successfully executed ${migrations.length} migrations`);
    migrations.forEach((migration, index) => {
      console.log(`${index + 1}. ${migration.name}`);
    });
    
    console.log("Migration process completed successfully");
  } catch (error) {
    console.error("Migration failed with error:", error);
    process.exit(1);
  } finally {
    // Close the connection when done
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Execute the migration function
runMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
