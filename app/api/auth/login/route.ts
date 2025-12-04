import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sql } from '@vercel/postgres';
import { validateEmail } from '@/lib/access-codes';

const SESSION_COOKIE_NAME = 'site_access_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Generate a session token
 */
function generateSessionToken(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const random2 = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}-${random2}`;
}

/**
 * POST /api/auth/login
 * Login for returning users with email and access code
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Validate required fields
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and access code are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Find the access code
    const { rows: codeRows } = await sql`
      SELECT id, is_active, expires_at FROM access_codes 
      WHERE code = ${code.toUpperCase().trim()}
    `;

    if (codeRows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid access code' },
        { status: 400 }
      );
    }

    const accessCode = codeRows[0];

    // Check if code is active
    if (!accessCode.is_active) {
      return NextResponse.json(
        { error: 'This access code has been disabled' },
        { status: 400 }
      );
    }

    // Check if code has expired
    if (accessCode.expires_at && new Date(accessCode.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'This access code has expired' },
        { status: 400 }
      );
    }

    // Check if user has registered with this email and code
    const { rows: regRows } = await sql`
      SELECT id, full_name FROM access_registrations 
      WHERE code_id = ${accessCode.id} 
      AND LOWER(email_address) = ${email.toLowerCase().trim()}
    `;

    if (regRows.length === 0) {
      return NextResponse.json(
        { error: 'No registration found with this email and access code. Please register first.' },
        { status: 400 }
      );
    }

    // Create session
    const token = generateSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    return NextResponse.json({ 
      success: true,
      message: `Welcome back, ${regRows[0].full_name}!`
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

