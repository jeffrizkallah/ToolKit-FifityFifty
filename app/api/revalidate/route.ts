/**
 * Revalidation Webhook API Route
 * 
 * Handles on-demand revalidation requests from the CMS.
 * When content is published/updated in Strapi, this endpoint
 * triggers Next.js ISR revalidation for affected pages.
 * 
 * Security: Uses secret token authentication to prevent unauthorized revalidation.
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Get secret from environment variable
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

// Log environment check (for debugging)
const isConfigured = Boolean(REVALIDATE_SECRET);

/**
 * POST /api/revalidate
 * 
 * Triggers on-demand revalidation for specified paths or tags.
 * 
 * Query Parameters:
 * - secret (required): Secret token for authentication
 * - path (optional): Specific path to revalidate (e.g., "/en", "/ar/phases/discovery")
 * - tag (optional): Cache tag to revalidate (e.g., "phases", "modules")
 * - model (optional): Content model that changed (phase, module, resource, testimonial, setting)
 * - slug (optional): Slug of the specific entity that changed
 * - locale (optional): Locale of the content (en, ar, or "all")
 * 
 * Example Requests:
 * POST /api/revalidate?secret=xxx&model=phase&slug=discovery&locale=en
 * POST /api/revalidate?secret=xxx&tag=phases
 * POST /api/revalidate?secret=xxx&path=/en/phases/discovery
 */
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');
  const tag = searchParams.get('tag');
  const model = searchParams.get('model');
  const slug = searchParams.get('slug');
  const locale = searchParams.get('locale') || 'all';

  // Log request for debugging
  console.log('[Revalidation] Webhook received:', {
    hasSecret: Boolean(secret),
    path,
    tag,
    model,
    slug,
    locale,
    timestamp: new Date().toISOString(),
  });

  // Check if revalidation is configured
  if (!isConfigured) {
    console.error('[Revalidation] Error: REVALIDATE_SECRET not configured');
    return NextResponse.json(
      { 
        error: 'Revalidation not configured', 
        message: 'REVALIDATE_SECRET environment variable is not set' 
      },
      { status: 500 }
    );
  }

  // Verify secret token
  if (secret !== REVALIDATE_SECRET) {
    console.error('[Revalidation] Error: Invalid secret token');
    return NextResponse.json(
      { error: 'Invalid secret token' },
      { status: 401 }
    );
  }

  try {
    const revalidated: string[] = [];

    // Revalidate by specific path
    if (path) {
      revalidatePath(path);
      revalidated.push(`path: ${path}`);
      console.log(`[Revalidation] Revalidated path: ${path}`);
    }

    // Revalidate by cache tag
    if (tag) {
      revalidateTag(tag);
      revalidated.push(`tag: ${tag}`);
      console.log(`[Revalidation] Revalidated tag: ${tag}`);
    }

    // Revalidate based on content model
    if (model) {
      const paths = getPathsForModel(model, slug, locale);
      paths.forEach((p) => {
        revalidatePath(p);
        revalidated.push(`path: ${p}`);
        console.log(`[Revalidation] Revalidated path: ${p}`);
      });
    }

    // If nothing was revalidated, return error
    if (revalidated.length === 0) {
      console.error('[Revalidation] Error: No revalidation target specified');
      return NextResponse.json(
        { 
          error: 'No revalidation target specified',
          message: 'Please provide path, tag, or model parameter'
        },
        { status: 400 }
      );
    }

    console.log(`[Revalidation] Success: Revalidated ${revalidated.length} target(s)`);
    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Revalidation] Error:', error);
    return NextResponse.json(
      { 
        error: 'Revalidation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/revalidate
 * 
 * Health check endpoint to verify the revalidation API is working.
 * Does not require authentication for health checks.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    configured: isConfigured,
    message: isConfigured 
      ? 'Revalidation webhook is ready' 
      : 'REVALIDATE_SECRET not configured',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Helper function to determine which paths to revalidate based on content model
 */
function getPathsForModel(
  model: string,
  slug: string | null,
  locale: string
): string[] {
  const paths: string[] = [];
  const locales = locale === 'all' ? ['en', 'ar'] : [locale];

  switch (model) {
    case 'phase':
      // Revalidate landing page (shows all phases)
      locales.forEach((loc) => {
        paths.push(`/${loc}`);
        // If slug is provided, revalidate specific phase page
        if (slug) {
          paths.push(`/${loc}/phases/${slug}`);
        }
      });
      break;

    case 'module':
      // Revalidate all module-related pages
      locales.forEach((loc) => {
        paths.push(`/${loc}`); // Landing page may show module info
        if (slug) {
          paths.push(`/${loc}/modules/${slug}`);
        }
      });
      break;

    case 'resource':
      // Revalidate module pages that may show resources
      locales.forEach((loc) => {
        if (slug) {
          paths.push(`/${loc}/modules/${slug}`);
        }
      });
      break;

    case 'testimonial':
      // Revalidate landing page (shows testimonials)
      locales.forEach((loc) => {
        paths.push(`/${loc}`);
      });
      break;

    case 'setting':
      // Revalidate all pages (settings affect header/footer everywhere)
      locales.forEach((loc) => {
        paths.push(`/${loc}`);
        paths.push(`/${loc}/phases`);
        paths.push(`/${loc}/modules`);
      });
      break;

    default:
      console.warn(`[Revalidation] Unknown model: ${model}`);
  }

  return paths;
}

