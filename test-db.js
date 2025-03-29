import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function testConnection() {
  try {
    // Try a simple query
    const result = await sql`SELECT NOW()`;
    console.log('Database connection successful!');
    console.log('Current timestamp from DB:', result[0].now);
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
}

testConnection(); 