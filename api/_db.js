/* ========================================
   DATABASE CONNECTION HELPER
   Handles env var naming differences between
   Vercel Postgres and Neon integrations
   ======================================== */

// Vercel Postgres uses POSTGRES_URL, Neon uses DATABASE_URL
// Set fallback before @vercel/postgres initializes its pool
if (!process.env.POSTGRES_URL && process.env.DATABASE_URL) {
  process.env.POSTGRES_URL = process.env.DATABASE_URL;
}

export { sql } from '@vercel/postgres';
