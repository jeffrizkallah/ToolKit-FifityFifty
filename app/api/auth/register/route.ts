import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  verifyAccessCode, 
  registerWithCode, 
  validatePhoneNumber,
  validateEmail,
  validateAge,
  GOVERNORATES,
  ELECTORAL_DISTRICTS
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
      age, 
      contactNumber, 
      emailAddress, 
      governorate,
      electoralDistrict, 
      currentAddress, 
      privacyConsent 
    } = body;

    // Validate required fields
    if (!code || !fullName || age === undefined || !contactNumber || !emailAddress || !governorate || !electoralDistrict || !currentAddress) {
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

    // Validate age
    const ageNum = typeof age === 'number' ? age : parseInt(age, 10);
    if (!validateAge(ageNum)) {
      return NextResponse.json(
        { error: 'Please enter a valid age (16-120)' },
        { status: 400 }
      );
    }

    // Validate governorate
    const validGovernorate = GOVERNORATES.some(g => g.value === governorate);
    if (!validGovernorate) {
      return NextResponse.json(
        { error: 'Please select a valid governorate' },
        { status: 400 }
      );
    }

    // Validate electoral district
    const validDistrict = ELECTORAL_DISTRICTS.some(d => d.value === electoralDistrict);
    if (!validDistrict) {
      return NextResponse.json(
        { error: 'Please select a valid electoral district' },
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
      ageNum,
      contactNumber.trim(),
      emailAddress.trim().toLowerCase(),
      governorate,
      electoralDistrict,
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
