/**
 * Cleanup Script - Remove extra phases from database
 * 
 * This script removes phases 4, 5, 6 and their associated modules/resources
 * 
 * Usage: npx tsx scripts/cleanup-phases.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { sql } from '@vercel/postgres';

async function cleanup() {
  console.log('🧹 Starting cleanup of extra phases...\n');

  try {
    // Test database connection
    await sql`SELECT 1`;
    console.log('✓ Database connection successful\n');

    // Delete phases with id > 3 (this will cascade to modules and resources)
    const result = await sql`DELETE FROM phases WHERE id > 3 RETURNING id, title`;
    
    if (result.rows.length > 0) {
      console.log('Deleted phases:');
      result.rows.forEach(row => {
        console.log(`  - Phase ${row.id}: ${row.title}`);
      });
    } else {
      console.log('No extra phases found to delete.');
    }

    // Also clean up any orphaned modules (just in case)
    const modulesResult = await sql`DELETE FROM modules WHERE phase_id > 3 RETURNING id, title`;
    if (modulesResult.rows.length > 0) {
      console.log('\nDeleted orphaned modules:');
      modulesResult.rows.forEach(row => {
        console.log(`  - Module ${row.id}: ${row.title}`);
      });
    }

    console.log('\n✅ Cleanup complete!');
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup();

