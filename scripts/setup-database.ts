/**
 * Database Setup Script
 * 
 * Creates all necessary tables in the Neon PostgreSQL database.
 * 
 * Usage: npx tsx scripts/setup-database.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

import { sql } from '@vercel/postgres';

async function createTables() {
  console.log('🔧 Creating database tables...\n');

  // Create phases table
  console.log('Creating phases table...');
  await sql`
    CREATE TABLE IF NOT EXISTS phases (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      title_ar VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      description_ar TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      phase_number INTEGER NOT NULL,
      header_video_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log('✓ phases table created');

  // Create modules table
  console.log('Creating modules table...');
  await sql`
    CREATE TABLE IF NOT EXISTS modules (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      title_ar VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      summary TEXT,
      summary_ar TEXT,
      video_url VARCHAR(500),
      video_subtitle_url_en VARCHAR(500),
      video_subtitle_url_ar VARCHAR(500),
      key_takeaways TEXT,
      key_takeaways_ar TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      phase_id INTEGER REFERENCES phases(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log('✓ modules table created');

  // Create resources table
  console.log('Creating resources table...');
  await sql`
    CREATE TABLE IF NOT EXISTS resources (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      title_ar VARCHAR(255) NOT NULL,
      description TEXT,
      description_ar TEXT,
      file_url VARCHAR(500),
      file_type VARCHAR(50) NOT NULL DEFAULT 'PDF',
      file_size VARCHAR(50),
      "order" INTEGER NOT NULL DEFAULT 0,
      module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log('✓ resources table created');

  // Create testimonials table
  console.log('Creating testimonials table...');
  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      name_ar VARCHAR(255) NOT NULL,
      quote TEXT NOT NULL,
      quote_ar TEXT NOT NULL,
      role VARCHAR(255),
      role_ar VARCHAR(255),
      photo_url VARCHAR(500),
      "order" INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log('✓ testimonials table created');

  // Create settings table
  console.log('Creating settings table...');
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      site_title VARCHAR(255) NOT NULL,
      site_title_ar VARCHAR(255),
      hero_headline VARCHAR(500),
      hero_headline_ar VARCHAR(500),
      hero_description TEXT,
      hero_description_ar TEXT,
      hero_video_url VARCHAR(500),
      footer_text TEXT,
      footer_text_ar TEXT,
      social_links JSONB DEFAULT '[]',
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log('✓ settings table created');

  // Create indexes
  console.log('\nCreating indexes...');
  
  try {
    await sql`CREATE INDEX IF NOT EXISTS idx_phases_order ON phases("order")`;
    await sql`CREATE INDEX IF NOT EXISTS idx_phases_slug ON phases(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_modules_order ON modules("order")`;
    await sql`CREATE INDEX IF NOT EXISTS idx_modules_slug ON modules(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_modules_phase_id ON modules(phase_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_resources_order ON resources("order")`;
    await sql`CREATE INDEX IF NOT EXISTS idx_resources_module_id ON resources(module_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials("order")`;
    console.log('✓ All indexes created');
  } catch (error) {
    console.log('⚠ Some indexes may already exist (this is fine)');
  }

  console.log('\n✅ All database tables created successfully!');
}

async function main() {
  try {
    // Test connection first
    console.log('Testing database connection...');
    await sql`SELECT 1`;
    console.log('✓ Database connection successful\n');

    await createTables();
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

main();

