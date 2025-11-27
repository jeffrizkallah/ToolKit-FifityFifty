import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@vercel/postgres';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cms-client';

const SESSION_COOKIE_NAME = 'admin_session';

// Valid content types
const VALID_CONTENT_TYPES = ['phases', 'modules', 'resources', 'testimonials', 'settings'];

/**
 * Check if user is authenticated
 */
async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    return !!session?.value;
  } catch {
    return false;
  }
}

/**
 * GET /api/admin/content?type=phases|modules|resources|testimonials|settings
 * Fetch content for admin editing from the database
 */
export async function GET(request: NextRequest) {
  // Check authentication
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const contentType = searchParams.get('type');

  if (!contentType || !VALID_CONTENT_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: `Invalid content type. Valid types: ${VALID_CONTENT_TYPES.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    let data;
    
    switch (contentType) {
      case 'phases': {
        const { rows } = await sql`SELECT * FROM phases ORDER BY "order" ASC`;
        data = { phases: rows };
        break;
      }
      case 'modules': {
        const { rows } = await sql`SELECT * FROM modules ORDER BY "order" ASC`;
        data = { modules: rows };
        break;
      }
      case 'resources': {
        const { rows } = await sql`SELECT * FROM resources ORDER BY "order" ASC`;
        data = { resources: rows };
        break;
      }
      case 'testimonials': {
        const { rows } = await sql`SELECT * FROM testimonials ORDER BY "order" ASC`;
        data = { testimonials: rows };
        break;
      }
      case 'settings': {
        const { rows } = await sql`SELECT * FROM settings LIMIT 1`;
        data = rows[0] || {};
        break;
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error reading ${contentType}:`, error);
    return NextResponse.json(
      { error: `Failed to read ${contentType}` },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/content
 * Create new content in the database
 * Body: { type: string, data: object }
 */
export async function POST(request: NextRequest) {
  // Check authentication
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !VALID_CONTENT_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid content type. Valid types: ${VALID_CONTENT_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      );
    }

    let newId;

    switch (type) {
      case 'phases': {
        const result = await sql`
          INSERT INTO phases (title, title_ar, slug, description, description_ar, "order", phase_number, header_video_url)
          VALUES (
            ${data.title},
            ${data.title_ar || ''},
            ${data.slug},
            ${data.description || null},
            ${data.description_ar || null},
            ${data.order || 1},
            ${data.phase_number || 1},
            ${data.header_video_url || null}
          )
          RETURNING id
        `;
        newId = result.rows[0]?.id;
        break;
      }
      case 'modules': {
        const result = await sql`
          INSERT INTO modules (title, title_ar, slug, summary, summary_ar, video_url, video_subtitle_url_en, video_subtitle_url_ar, key_takeaways, key_takeaways_ar, "order", phase_id)
          VALUES (
            ${data.title},
            ${data.title_ar || ''},
            ${data.slug},
            ${data.summary || null},
            ${data.summary_ar || null},
            ${data.video_url || null},
            ${data.video_subtitle_url_en || null},
            ${data.video_subtitle_url_ar || null},
            ${data.key_takeaways || null},
            ${data.key_takeaways_ar || null},
            ${data.order || 1},
            ${data.phase_id}
          )
          RETURNING id
        `;
        newId = result.rows[0]?.id;
        break;
      }
      case 'resources': {
        const result = await sql`
          INSERT INTO resources (title, title_ar, description, description_ar, file_url, file_type, file_size, "order", module_id)
          VALUES (
            ${data.title},
            ${data.title_ar || ''},
            ${data.description || null},
            ${data.description_ar || null},
            ${data.file_url || null},
            ${data.file_type || 'PDF'},
            ${data.file_size || null},
            ${data.order || 1},
            ${data.module_id}
          )
          RETURNING id
        `;
        newId = result.rows[0]?.id;
        break;
      }
      case 'testimonials': {
        const result = await sql`
          INSERT INTO testimonials (name, name_ar, quote, quote_ar, role, role_ar, photo_url, "order")
          VALUES (
            ${data.name},
            ${data.name_ar || ''},
            ${data.quote},
            ${data.quote_ar || ''},
            ${data.role || null},
            ${data.role_ar || null},
            ${data.photo_url || null},
            ${data.order || 1}
          )
          RETURNING id
        `;
        newId = result.rows[0]?.id;
        break;
      }
      default:
        return NextResponse.json(
          { error: 'Cannot create this content type' },
          { status: 400 }
        );
    }

    // Revalidate the cache for the updated content type
    try {
      revalidateTag(CACHE_TAGS[type as keyof typeof CACHE_TAGS]);
      revalidateTag(CACHE_TAGS.all);
    } catch (revalidateError) {
      console.error('Cache revalidation error:', revalidateError);
    }

    return NextResponse.json({ success: true, id: newId, message: `${type} created successfully` });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/content
 * Update content in the database
 * Body: { type: string, data: object }
 */
export async function PUT(request: NextRequest) {
  // Check authentication
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !VALID_CONTENT_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid content type. Valid types: ${VALID_CONTENT_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'phases': {
        for (const phase of data.phases) {
          await sql`
            UPDATE phases SET
              title = ${phase.title},
              title_ar = ${phase.title_ar},
              slug = ${phase.slug},
              description = ${phase.description || null},
              description_ar = ${phase.description_ar || null},
              "order" = ${phase.order},
              phase_number = ${phase.phase_number},
              header_video_url = ${phase.header_video_url || null},
              updated_at = NOW()
            WHERE id = ${phase.id}
          `;
        }
        break;
      }
      case 'modules': {
        for (const module of data.modules) {
          await sql`
            UPDATE modules SET
              title = ${module.title},
              title_ar = ${module.title_ar},
              slug = ${module.slug},
              summary = ${module.summary || null},
              summary_ar = ${module.summary_ar || null},
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
        break;
      }
      case 'resources': {
        for (const resource of data.resources) {
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
        break;
      }
      case 'testimonials': {
        for (const testimonial of data.testimonials) {
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
        break;
      }
      case 'settings': {
        await sql`
          UPDATE settings SET
            site_title = ${data.site_title},
            site_title_ar = ${data.site_title_ar || null},
            hero_headline = ${data.hero_headline || null},
            hero_headline_ar = ${data.hero_headline_ar || null},
            hero_description = ${data.hero_description || null},
            hero_description_ar = ${data.hero_description_ar || null},
            hero_video_url = ${data.hero_video_url || null},
            footer_text = ${data.footer_text || null},
            footer_text_ar = ${data.footer_text_ar || null},
            social_links = ${JSON.stringify(data.social_links || [])},
            updated_at = NOW()
          WHERE id = 1
        `;
        break;
      }
    }

    // Revalidate the cache for the updated content type
    try {
      revalidateTag(CACHE_TAGS[type as keyof typeof CACHE_TAGS]);
      revalidateTag(CACHE_TAGS.all);
    } catch (revalidateError) {
      console.error('Cache revalidation error:', revalidateError);
    }

    return NextResponse.json({ success: true, message: `${type} updated successfully` });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/content?type=modules|resources|testimonials&id=123
 * Delete content from the database
 */
export async function DELETE(request: NextRequest) {
  // Check authentication
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const contentType = searchParams.get('type');
  const id = searchParams.get('id');

  if (!contentType || !['modules', 'resources', 'testimonials'].includes(contentType)) {
    return NextResponse.json(
      { error: 'Invalid content type for deletion. Can only delete: modules, resources, testimonials' },
      { status: 400 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: 'ID is required for deletion' },
      { status: 400 }
    );
  }

  try {
    switch (contentType) {
      case 'modules': {
        // First delete related resources
        await sql`DELETE FROM resources WHERE module_id = ${parseInt(id)}`;
        // Then delete the module
        await sql`DELETE FROM modules WHERE id = ${parseInt(id)}`;
        break;
      }
      case 'resources': {
        await sql`DELETE FROM resources WHERE id = ${parseInt(id)}`;
        break;
      }
      case 'testimonials': {
        await sql`DELETE FROM testimonials WHERE id = ${parseInt(id)}`;
        break;
      }
    }

    // Revalidate the cache
    try {
      revalidateTag(CACHE_TAGS[contentType as keyof typeof CACHE_TAGS]);
      revalidateTag(CACHE_TAGS.all);
      // Also revalidate resources when deleting modules
      if (contentType === 'modules') {
        revalidateTag(CACHE_TAGS.resources);
      }
    } catch (revalidateError) {
      console.error('Cache revalidation error:', revalidateError);
    }

    return NextResponse.json({ success: true, message: `${contentType} deleted successfully` });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
