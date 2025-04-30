// Simple PostgreSQL connection test script
const { Client } = require('pg');

async function testConnection() {
  console.log('Testing PostgreSQL connection...');
  
  // Connection with no SSL (configuration 1)
  const client1 = new Client({
    host: 'localhost',
    port: 5432,
    database: 'zervi_mrp',
    user: 'postgres',
    password: 'zervi2025'
  });

  // Connection with SSL rejection disabled (configuration 2)
  const client2 = new Client({
    host: 'localhost',
    port: 5432,
    database: 'zervi_mrp',
    user: 'postgres',
    password: 'zervi2025',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Trying connection without SSL...');
    await client1.connect();
    console.log('SUCCESS: Connected without SSL!');
    await client1.end();
  } catch (err) {
    console.error('FAILED: Connection without SSL failed:', err.message);
  }

  try {
    console.log('\nTrying connection with SSL (rejectUnauthorized: false)...');
    await client2.connect();
    console.log('SUCCESS: Connected with SSL (rejectUnauthorized: false)!');
    await client2.end();
  } catch (err) {
    console.error('FAILED: Connection with SSL failed:', err.message);
  }
}

testConnection().catch(err => {
  console.error('Unhandled error:', err);
});