import { Client } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

async function testConnection() {
  console.log('Attempting to connect to PostgreSQL database...');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Port: ${process.env.DB_PORT}`);
  console.log(`Database: ${process.env.DB_DATABASE}`);
  console.log(`Username: ${process.env.DB_USERNAME}`);
  // Don't log password for security reasons
  
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting...');
    await client.connect();
    console.log('Connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('Current database time:', result.rows[0].current_time);
    
    // Check if we can access tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Available tables:');
    for (const row of tablesResult.rows) {
      console.log(`- ${row.table_name}`);
    }
    
    await client.end();
    console.log('Connection closed successfully');
  } catch (err) {
    console.error('Connection error details:', err);
    
    // More detailed troubleshooting based on error type
    if (err.code === 'ENOTFOUND') {
      console.error('Host not found. Check if the DB_HOST value is correct.');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('Connection refused. Check if database is running and if port is correct.');
    } else if (err.code === '28P01') {
      console.error('Authentication failed. Check if username and password are correct.');
    } else if (err.code === '3D000') {
      console.error('Database does not exist. Check if DB_DATABASE value is correct.');
    }
  }
}

// Run the test
testConnection();
