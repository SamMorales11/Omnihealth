import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Paksa membaca file .env di folder yang sama
dotenv.config({ path: '.env' }); 

export default defineConfig({
  schema: './schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DIRECT_URL!,
  },
});