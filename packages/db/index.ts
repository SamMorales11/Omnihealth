import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

// Menggunakan koneksi dari environment variable
const connectionString = process.env.DATABASE_URL!;

// Setup postgres client
const client = postgres(connectionString);

// Export db instance yang sudah dilengkapi schema untuk type-safety
export const db = drizzle(client, { schema });