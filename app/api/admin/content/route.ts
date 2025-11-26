import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');
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
 * Fetch content for admin editing
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
    const filePath = path.join(CONTENT_DIR, `${contentType}.json`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

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
 * PUT /api/admin/content
 * Update content
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

    const filePath = path.join(CONTENT_DIR, `${type}.json`);
    
    // Write the updated content
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ success: true, message: `${type} updated successfully` });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

