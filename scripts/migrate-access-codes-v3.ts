/**
 * Migration Script for Access Codes Tables v3
 * Updates the schema with:
 * - age (integer) instead of age_range
 * - governorate field (new)
 * - electoral_district (kept as dropdown)
 * Run with: npx tsx scripts/migrate-access-codes-v3.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { sql } from '@vercel/postgres';

async function migrate() {
  console.log('🚀 Starting migration v3 for access codes tables...\n');

  try {
    // Drop existing tables (will lose any existing data)
    console.log('📦 Dropping existing tables...');
    await sql`DROP TABLE IF EXISTS access_registrations`;
    await sql`DROP TABLE IF EXISTS access_codes`;
    console.log('✅ Existing tables dropped\n');

    // Create access_codes table
    console.log('📦 Creating access_codes table...');
    await sql`
      CREATE TABLE IF NOT EXISTS access_codes (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        description VARCHAR(255),
        max_uses INTEGER,
        is_active BOOLEAN DEFAULT true,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ access_codes table created\n');

    // Create access_registrations table with NEW fields (v3)
    console.log('📦 Creating access_registrations table with new fields (v3)...');
    await sql`
      CREATE TABLE IF NOT EXISTS access_registrations (
        id SERIAL PRIMARY KEY,
        code_id INTEGER REFERENCES access_codes(id) ON DELETE CASCADE,
        full_name VARCHAR(255) NOT NULL,
        age INTEGER NOT NULL,
        contact_number VARCHAR(50) NOT NULL,
        email_address VARCHAR(255) NOT NULL,
        governorate VARCHAR(100) NOT NULL,
        electoral_district VARCHAR(100) NOT NULL,
        current_address TEXT NOT NULL,
        privacy_consent BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ access_registrations table created\n');

    // Create indexes
    console.log('📦 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_access_codes_is_active ON access_codes(is_active)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_registrations_code_id ON access_registrations(code_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_registrations_email ON access_registrations(email_address)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_registrations_governorate ON access_registrations(governorate)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_registrations_district ON access_registrations(electoral_district)`;
    console.log('✅ Indexes created\n');

    // Create the default access code
    console.log('📦 Creating default access code (TOOLKIT-FF-2025)...');
    await sql`
      INSERT INTO access_codes (code, description, is_active)
      VALUES ('TOOLKIT-FF-2025', 'FiftyFifty Toolkit 2025 Access Code', true)
      ON CONFLICT (code) DO NOTHING
    `;
    console.log('✅ Default access code created\n');

    console.log('🎉 Migration v3 completed successfully!');
    console.log('\nRegistration fields:');
    console.log('  - Full Name (الاسم الكامل)');
    console.log('  - Age (العمر) - exact number, not range');
    console.log('  - Contact Number (رقم الهاتف)');
    console.log('  - Email Address (البريد الالكتروني)');
    console.log('  - Governorate (المحافظة النفوس) - dropdown');
    console.log('  - Electoral District (دائرة النفوس) - dropdown');
    console.log('  - Current Address (مكان السكن الحالي)');
    console.log('\nDefault access code: TOOLKIT-FF-2025');
    console.log('\nYou can now test the updated form.\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrate();

