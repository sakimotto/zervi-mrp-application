const { Client } = require('pg');
require('dotenv').config();

// Create a simple client with your connection details
const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'zervi2025',
  database: process.env.DB_DATABASE || 'zervi_mrp'
});

async function testConnection() {
  try {
    // Connect to the database
    await client.connect();
    console.log('✅ Successfully connected to PostgreSQL!');
    
    // Run a simple query
    const res = await client.query('SELECT NOW() as time');
    console.log('Current database time:', res.rows[0].time);
    
    // Close the connection
    await client.end();
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    // More detailed error information
    if (err.code) {
      console.error('Error code:', err.code);
      
      // Common error codes and explanations
      const errorCodes = {
        'ECONNREFUSED': 'The database server is not running or the connection details are incorrect',
        'ETIMEDOUT': 'Connection timed out - check network or firewall settings',
        '28P01': 'Invalid password authentication',
        '3D000': 'Database does not exist',
        '42P01': 'Table does not exist'
      };
      
      if (errorCodes[err.code]) {
        console.error('Explanation:', errorCodes[err.code]);
      }
    }
  }
}

testConnection();
