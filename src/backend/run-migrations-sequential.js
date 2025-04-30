// Comprehensive migration script
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function runMigrations() {
  console.log('🔍 Checking database connection...');
  
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'zervi_mrp',
    user: 'postgres',
    password: 'zervi2025'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database successfully');
    
    // Check existing tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log(`\n📋 Found ${tablesResult.rows.length} existing tables:`);
    tablesResult.rows.forEach(row => console.log(`   - ${row.table_name}`));
    
    // Check if we need to reset migrations table
    if (tablesResult.rows.some(row => row.table_name === 'migrations')) {
      console.log('\n⚠️ Found existing migrations table. Dropping for clean migration...');
      await client.query('DROP TABLE IF EXISTS migrations CASCADE');
      console.log('✅ Migrations table dropped');
    }

    // Close the connection before running migrations
    await client.end();
    
    // Get migration files in order
    console.log('\n📂 Checking migration files...');
    const migrationsDir = path.join(__dirname, 'src', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.ts'))
      .sort();
    
    console.log('📑 Migration files in order:');
    migrationFiles.forEach(file => console.log(`   - ${file}`));
    
    // Run TypeORM migrations directly
    console.log('\n🚀 Running migrations...');
    try {
      // Use direct command execution
      execSync('npx ts-node src/run-migration.ts', { 
        cwd: __dirname,
        stdio: 'inherit' 
      });
      console.log('✅ Migrations completed successfully');
      return true;
    } catch (err) {
      console.error('❌ Migration execution failed:', err.message);
      throw new Error('Migration process failed');
    }
  } catch (err) {
    console.error('❌ Error:', err);
    throw err;
  }
}

// Run the migrations
runMigrations()
  .then(async () => {
    // Verify tables after migration
    const verifyClient = new Client({
      host: 'localhost',
      port: 5432,
      database: 'zervi_mrp',
      user: 'postgres',
      password: 'zervi2025'
    });
    
    await verifyClient.connect();
    const verifyResult = await verifyClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log(`\n🎉 Migration successful! Found ${verifyResult.rows.length} tables:`);
    verifyResult.rows.forEach((row, i) => console.log(`   ${i+1}. ${row.table_name}`));
    
    await verifyClient.end();
    process.exit(0);
  })
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });