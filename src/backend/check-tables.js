// Simple script to check if tables were created
const { Client } = require('pg');

async function checkTables() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'zervi_mrp',
    user: 'postgres',
    password: 'zervi2025'
  });

  try {
    await client.connect();
    console.log('Connected to database successfully');
    
    // Check which tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log(`\nFound ${result.rows.length} tables:`);
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    
  } catch (err) {
    console.error('Error checking tables:', err);
  } finally {
    await client.end();
  }
}

checkTables();