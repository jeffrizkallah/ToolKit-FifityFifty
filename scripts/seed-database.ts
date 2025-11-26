/**
 * Database Seed Script
 * 
 * Migrates existing JSON data from /content directory to the Neon PostgreSQL database.
 * 
 * Usage:
 * 1. Make sure your .env.local has the POSTGRES_URL environment variable
 * 2. Run: npx tsx scripts/seed-database.ts
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

import { sql } from '@vercel/postgres';

// Import existing JSON data
import phasesData from '../content/phases.json';
import modulesData from '../content/modules.json';
import resourcesData from '../content/resources.json';
import testimonialsData from '../content/testimonials.json';
import settingsData from '../content/settings.json';

interface Phase {
  id: number;
  title: string;
  title_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  order: number;
  phase_number: number;
  header_video_url: string;
}

interface Module {
  id: number;
  title: string;
  title_ar: string;
  slug: string;
  summary: string;
  summary_ar: string;
  video_url: string;
  video_subtitle_url_en: string;
  video_subtitle_url_ar: string;
  key_takeaways: string;
  key_takeaways_ar: string;
  order: number;
  phase_id: number;
}

interface Resource {
  id: number;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  file_url: string;
  file_type: string;
  file_size: string;
  order: number;
  module_id: number;
}

interface Testimonial {
  id: number;
  name: string;
  name_ar: string;
  quote: string;
  quote_ar: string;
  role: string;
  role_ar: string;
  photo_url: string;
  order: number;
}

interface Settings {
  site_title: string;
  site_title_ar: string;
  hero_headline: string;
  hero_headline_ar: string;
  hero_description: string;
  hero_description_ar: string;
  hero_video_url: string;
  footer_text: string;
  footer_text_ar: string;
  social_links: Array<{ platform: string; url: string }>;
}

async function seedPhases() {
  console.log('Seeding phases...');
  const phases = (phasesData as { phases: Phase[] }).phases;
  
  for (const phase of phases) {
    await sql`
      INSERT INTO phases (id, title, title_ar, slug, description, description_ar, "order", phase_number, header_video_url)
      VALUES (
        ${phase.id}, 
        ${phase.title}, 
        ${phase.title_ar}, 
        ${phase.slug}, 
        ${phase.description}, 
        ${phase.description_ar}, 
        ${phase.order}, 
        ${phase.phase_number}, 
        ${phase.header_video_url || null}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        title_ar = EXCLUDED.title_ar,
        slug = EXCLUDED.slug,
        description = EXCLUDED.description,
        description_ar = EXCLUDED.description_ar,
        "order" = EXCLUDED."order",
        phase_number = EXCLUDED.phase_number,
        header_video_url = EXCLUDED.header_video_url,
        updated_at = NOW()
    `;
  }
  
  // Reset the sequence to be after the max id
  await sql`SELECT setval('phases_id_seq', (SELECT MAX(id) FROM phases))`;
  
  console.log(`✓ Seeded ${phases.length} phases`);
}

async function seedModules() {
  console.log('Seeding modules...');
  const modules = (modulesData as { modules: Module[] }).modules;
  
  for (const module of modules) {
    await sql`
      INSERT INTO modules (id, title, title_ar, slug, summary, summary_ar, video_url, video_subtitle_url_en, video_subtitle_url_ar, key_takeaways, key_takeaways_ar, "order", phase_id)
      VALUES (
        ${module.id}, 
        ${module.title}, 
        ${module.title_ar}, 
        ${module.slug}, 
        ${module.summary}, 
        ${module.summary_ar}, 
        ${module.video_url || null},
        ${module.video_subtitle_url_en || null},
        ${module.video_subtitle_url_ar || null},
        ${module.key_takeaways || null},
        ${module.key_takeaways_ar || null},
        ${module.order}, 
        ${module.phase_id}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        title_ar = EXCLUDED.title_ar,
        slug = EXCLUDED.slug,
        summary = EXCLUDED.summary,
        summary_ar = EXCLUDED.summary_ar,
        video_url = EXCLUDED.video_url,
        video_subtitle_url_en = EXCLUDED.video_subtitle_url_en,
        video_subtitle_url_ar = EXCLUDED.video_subtitle_url_ar,
        key_takeaways = EXCLUDED.key_takeaways,
        key_takeaways_ar = EXCLUDED.key_takeaways_ar,
        "order" = EXCLUDED."order",
        phase_id = EXCLUDED.phase_id,
        updated_at = NOW()
    `;
  }
  
  // Reset the sequence
  await sql`SELECT setval('modules_id_seq', (SELECT MAX(id) FROM modules))`;
  
  console.log(`✓ Seeded ${modules.length} modules`);
}

async function seedResources() {
  console.log('Seeding resources...');
  const resources = (resourcesData as { resources: Resource[] }).resources;
  
  for (const resource of resources) {
    await sql`
      INSERT INTO resources (id, title, title_ar, description, description_ar, file_url, file_type, file_size, "order", module_id)
      VALUES (
        ${resource.id}, 
        ${resource.title}, 
        ${resource.title_ar}, 
        ${resource.description || null}, 
        ${resource.description_ar || null}, 
        ${resource.file_url || null}, 
        ${resource.file_type}, 
        ${resource.file_size || null}, 
        ${resource.order}, 
        ${resource.module_id}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        title_ar = EXCLUDED.title_ar,
        description = EXCLUDED.description,
        description_ar = EXCLUDED.description_ar,
        file_url = EXCLUDED.file_url,
        file_type = EXCLUDED.file_type,
        file_size = EXCLUDED.file_size,
        "order" = EXCLUDED."order",
        module_id = EXCLUDED.module_id,
        updated_at = NOW()
    `;
  }
  
  // Reset the sequence
  await sql`SELECT setval('resources_id_seq', (SELECT MAX(id) FROM resources))`;
  
  console.log(`✓ Seeded ${resources.length} resources`);
}

async function seedTestimonials() {
  console.log('Seeding testimonials...');
  const testimonials = (testimonialsData as { testimonials: Testimonial[] }).testimonials;
  
  for (const testimonial of testimonials) {
    await sql`
      INSERT INTO testimonials (id, name, name_ar, quote, quote_ar, role, role_ar, photo_url, "order")
      VALUES (
        ${testimonial.id}, 
        ${testimonial.name}, 
        ${testimonial.name_ar}, 
        ${testimonial.quote}, 
        ${testimonial.quote_ar}, 
        ${testimonial.role || null}, 
        ${testimonial.role_ar || null}, 
        ${testimonial.photo_url || null}, 
        ${testimonial.order}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        name_ar = EXCLUDED.name_ar,
        quote = EXCLUDED.quote,
        quote_ar = EXCLUDED.quote_ar,
        role = EXCLUDED.role,
        role_ar = EXCLUDED.role_ar,
        photo_url = EXCLUDED.photo_url,
        "order" = EXCLUDED."order",
        updated_at = NOW()
    `;
  }
  
  // Reset the sequence
  await sql`SELECT setval('testimonials_id_seq', (SELECT MAX(id) FROM testimonials))`;
  
  console.log(`✓ Seeded ${testimonials.length} testimonials`);
}

async function seedSettings() {
  console.log('Seeding settings...');
  const settings = settingsData as Settings;
  
  // Check if settings row exists
  const { rows } = await sql`SELECT id FROM settings WHERE id = 1`;
  
  if (rows.length === 0) {
    // Insert new settings
    await sql`
      INSERT INTO settings (id, site_title, site_title_ar, hero_headline, hero_headline_ar, hero_description, hero_description_ar, hero_video_url, footer_text, footer_text_ar, social_links)
      VALUES (
        1,
        ${settings.site_title}, 
        ${settings.site_title_ar || null}, 
        ${settings.hero_headline || null}, 
        ${settings.hero_headline_ar || null}, 
        ${settings.hero_description || null}, 
        ${settings.hero_description_ar || null}, 
        ${settings.hero_video_url || null}, 
        ${settings.footer_text || null}, 
        ${settings.footer_text_ar || null}, 
        ${JSON.stringify(settings.social_links || [])}
      )
    `;
  } else {
    // Update existing settings
    await sql`
      UPDATE settings SET
        site_title = ${settings.site_title},
        site_title_ar = ${settings.site_title_ar || null},
        hero_headline = ${settings.hero_headline || null},
        hero_headline_ar = ${settings.hero_headline_ar || null},
        hero_description = ${settings.hero_description || null},
        hero_description_ar = ${settings.hero_description_ar || null},
        hero_video_url = ${settings.hero_video_url || null},
        footer_text = ${settings.footer_text || null},
        footer_text_ar = ${settings.footer_text_ar || null},
        social_links = ${JSON.stringify(settings.social_links || [])},
        updated_at = NOW()
      WHERE id = 1
    `;
  }
  
  console.log('✓ Seeded settings');
}

async function main() {
  console.log('🚀 Starting database seed...\n');
  
  try {
    // Test database connection
    await sql`SELECT 1`;
    console.log('✓ Database connection successful\n');
    
    // Seed all tables in order (respecting foreign key constraints)
    await seedPhases();
    await seedModules();
    await seedResources();
    await seedTestimonials();
    await seedSettings();
    
    console.log('\n✅ Database seeding complete!');
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

main();

