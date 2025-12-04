import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  verifyAccessCode, 
  registerWithCode, 
  validatePhoneNumber,
  validateEmail,
  AGE_RANGES
} from '@/lib/access-codes';

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
 * POST /api/auth/register
 * Register a user with an access code and create session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      code, 
      fullName, 
      ageRange, 
      contactNumber, 
      emailAddress, 
      electoralDistrict, 
      currentAddress, 
      privacyConsent 
    } = body;

    // Validate required fields
    if (!code || !fullName || !ageRange || !contactNumber || !emailAddress || !electoralDistrict || !currentAddress) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate privacy consent
    if (!privacyConsent) {
      return NextResponse.json(
        { error: 'Privacy consent is required' },
        { status: 400 }
      );
    }

    // Validate age range
    if (!AGE_RANGES.includes(ageRange)) {
      return NextResponse.json(
        { error: 'Please select a valid age range' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(emailAddress)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!validatePhoneNumber(contactNumber)) {
      return NextResponse.json(
        { error: 'Please enter a valid contact number' },
        { status: 400 }
      );
    }

    // Verify the access code
    const codeResult = await verifyAccessCode(code);
    if (!codeResult.valid || !codeResult.codeData) {
      return NextResponse.json(
        { error: codeResult.error || 'Invalid access code' },
        { status: 400 }
      );
    }

    // Register the user
    const registerResult = await registerWithCode(
      codeResult.codeData.id,
      fullName.trim(),
      ageRange,
      contactNumber.trim(),
      emailAddress.trim().toLowerCase(),
      electoralDistrict.trim(),
      currentAddress.trim(),
      privacyConsent
    );

    if (!registerResult.success) {
      return NextResponse.json(
        { error: registerResult.error || 'Registration failed' },
        { status: 500 }
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
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
