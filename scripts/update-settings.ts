/**
 * Update Settings Script - Fix hero description for 3 phases
 * 
 * Usage: npx tsx scripts/update-settings.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { sql } from '@vercel/postgres';

async function updateSettings() {
  console.log('🔧 Updating hero description...\n');

  try {
    // First, let's see the current settings
    const { rows } = await sql`SELECT hero_description, hero_description_ar FROM settings LIMIT 1`;
    console.log('Current English description:', rows[0]?.hero_description);
    console.log('Current Arabic description:', rows[0]?.hero_description_ar);

    // Update English description
    await sql`
      UPDATE settings SET 
        hero_description = 'A practical toolkit designed to help women run effective election campaigns. Explore the 3 key phases, from deciding to run, to pre-campaign, to the campaign itself, with step-by-step guidance, short videos, and ready-to-use resources.',
        updated_at = NOW()
      WHERE id = 1
    `;

    console.log('\n✅ Settings updated!');

    // Verify the update
    const { rows: updated } = await sql`SELECT hero_description FROM settings LIMIT 1`;
    console.log('\nNew description:', updated[0].hero_description);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateSettings();

