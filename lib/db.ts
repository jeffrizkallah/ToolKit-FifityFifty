/**
 * Database Client for Neon PostgreSQL
 * 
 * Uses @vercel/postgres for serverless PostgreSQL connections.
 * This replaces the file-based JSON storage for the admin panel.
 */

import { sql } from '@vercel/postgres';

export { sql };

// ============================================================================
// Phase Database Operations
// ============================================================================

export async function getDBPhases() {
  const { rows } = await sql`
    SELECT * FROM phases ORDER BY "order" ASC
  `;
  return rows;
}

export async function getDBPhaseById(id: number) {
  const { rows } = await sql`
    SELECT * FROM phases WHERE id = ${id}
  `;
  return rows[0] || null;
}

export async function updateDBPhase(phase: {
  id: number;
  title: string;
  title_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  order: number;
  phase_number: number;
  header_video_url?: string;
}) {
  await sql`
    UPDATE phases SET
      title = ${phase.title},
      title_ar = ${phase.title_ar},
      slug = ${phase.slug},
      description = ${phase.description},
      description_ar = ${phase.description_ar},
      "order" = ${phase.order},
      phase_number = ${phase.phase_number},
      header_video_url = ${phase.header_video_url || null},
      updated_at = NOW()
    WHERE id = ${phase.id}
  `;
}

// ============================================================================
// Module Database Operations
// ============================================================================

export async function getDBModules() {
  const { rows } = await sql`
    SELECT * FROM modules ORDER BY "order" ASC
  `;
  return rows;
}

export async function getDBModuleById(id: number) {
  const { rows } = await sql`
    SELECT * FROM modules WHERE id = ${id}
  `;
  return rows[0] || null;
}

export async function getDBModulesByPhaseId(phaseId: number) {
  const { rows } = await sql`
    SELECT * FROM modules WHERE phase_id = ${phaseId} ORDER BY "order" ASC
  `;
  return rows;
}

export async function updateDBModule(module: {
  id: number;
  title: string;
  title_ar: string;
  slug: string;
  summary: string;
  summary_ar: string;
  video_url?: string;
  video_subtitle_url_en?: string;
  video_subtitle_url_ar?: string;
  key_takeaways?: string;
  key_takeaways_ar?: string;
  order: number;
  phase_id: number;
}) {
  await sql`
    UPDATE modules SET
      title = ${module.title},
      title_ar = ${module.title_ar},
      slug = ${module.slug},
      summary = ${module.summary},
      summary_ar = ${module.summary_ar},
      video_url = ${module.video_url || null},
      video_subtitle_url_en = ${module.video_subtitle_url_en || null},
      video_subtitle_url_ar = ${module.video_subtitle_url_ar || null},
      key_takeaways = ${module.key_takeaways || null},
      key_takeaways_ar = ${module.key_takeaways_ar || null},
      "order" = ${module.order},
      phase_id = ${module.phase_id},
      updated_at = NOW()
    WHERE id = ${module.id}
  `;
}

// ============================================================================
// Resource Database Operations
// ============================================================================

export async function getDBResources() {
  const { rows } = await sql`
    SELECT * FROM resources ORDER BY "order" ASC
  `;
  return rows;
}

export async function getDBResourceById(id: number) {
  const { rows } = await sql`
    SELECT * FROM resources WHERE id = ${id}
  `;
  return rows[0] || null;
}

export async function getDBResourcesByModuleId(moduleId: number) {
  const { rows } = await sql`
    SELECT * FROM resources WHERE module_id = ${moduleId} ORDER BY "order" ASC
  `;
  return rows;
}

export async function updateDBResource(resource: {
  id: number;
  title: string;
  title_ar: string;
  description?: string;
  description_ar?: string;
  file_url?: string;
  file_type: string;
  file_size?: string;
  order: number;
  module_id: number;
}) {
  await sql`
    UPDATE resources SET
      title = ${resource.title},
      title_ar = ${resource.title_ar},
      description = ${resource.description || null},
      description_ar = ${resource.description_ar || null},
      file_url = ${resource.file_url || null},
      file_type = ${resource.file_type},
      file_size = ${resource.file_size || null},
      "order" = ${resource.order},
      module_id = ${resource.module_id},
      updated_at = NOW()
    WHERE id = ${resource.id}
  `;
}

// ============================================================================
// Testimonial Database Operations
// ============================================================================

export async function getDBTestimonials() {
  const { rows } = await sql`
    SELECT * FROM testimonials ORDER BY "order" ASC
  `;
  return rows;
}

export async function getDBTestimonialById(id: number) {
  const { rows } = await sql`
    SELECT * FROM testimonials WHERE id = ${id}
  `;
  return rows[0] || null;
}

export async function updateDBTestimonial(testimonial: {
  id: number;
  name: string;
  name_ar: string;
  quote: string;
  quote_ar: string;
  role?: string;
  role_ar?: string;
  photo_url?: string;
  order: number;
}) {
  await sql`
    UPDATE testimonials SET
      name = ${testimonial.name},
      name_ar = ${testimonial.name_ar},
      quote = ${testimonial.quote},
      quote_ar = ${testimonial.quote_ar},
      role = ${testimonial.role || null},
      role_ar = ${testimonial.role_ar || null},
      photo_url = ${testimonial.photo_url || null},
      "order" = ${testimonial.order},
      updated_at = NOW()
    WHERE id = ${testimonial.id}
  `;
}

// ============================================================================
// Settings Database Operations
// ============================================================================

export async function getDBSettings() {
  const { rows } = await sql`
    SELECT * FROM settings LIMIT 1
  `;
  return rows[0] || null;
}

export async function updateDBSettings(settings: {
  site_title: string;
  site_title_ar?: string;
  hero_headline?: string;
  hero_headline_ar?: string;
  hero_description?: string;
  hero_description_ar?: string;
  hero_video_url?: string;
  footer_text?: string;
  footer_text_ar?: string;
  social_links?: Array<{ platform: string; url: string }>;
}) {
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

// ============================================================================
// Database Health Check
// ============================================================================

export async function checkDBConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

