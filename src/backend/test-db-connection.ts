import { AppDataSource } from './config/database';

async function testConnection() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection successful!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

testConnection();
