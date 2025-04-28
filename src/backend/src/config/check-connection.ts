import { AppDataSource } from "./database";

/**
 * A simple script to check the database connection
 * 
 * This can be run separately to verify the database connection
 * before starting the full application.
 */
const checkDatabaseConnection = async () => {
  try {
    // Initialize the data source
    await AppDataSource.initialize();
    console.log("✅ Successfully connected to the database!");
    
    // List some tables to verify schema access
    const tableQuery = await AppDataSource.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' LIMIT 10;"
    );
    
    console.log("\nAvailable tables:");
    tableQuery.forEach((row: any) => {
      console.log(`- ${row.table_name}`);
    });
    
    console.log("\nDatabase connection is working correctly!");
    
    // Close the connection
    await AppDataSource.destroy();
    console.log("Connection closed.");
  } catch (error) {
    console.error("❌ Error connecting to the database:", error);
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  checkDatabaseConnection();
}

export default checkDatabaseConnection;
