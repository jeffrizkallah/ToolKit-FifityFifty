import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  getAllAccessCodes, 
  createAccessCode, 
  getRegistrationCount 
} from '@/lib/access-codes';

const ADMIN_SESSION_COOKIE = 'admin_session';

/**
 * Check if admin is authenticated
 */
async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  return !!session?.value;
}

/**
 * GET /api/admin/access-codes
 * Get all access codes with usage counts
 */
export async function GET() {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const codes = await getAllAccessCodes();
    
    // Add usage count to each code
    const codesWithUsage = await Promise.all(
      codes.map(async (code) => ({
        ...code,
        usage_count: await getRegistrationCount(code.id),
      }))
    );

    return NextResponse.json({ codes: codesWithUsage });
  } catch (error) {
    console.error('Error fetching access codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch access codes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/access-codes
 * Create a new access code
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { description, maxUses, expiresAt } = body;

    const result = await createAccessCode(
      description,
      maxUses ? parseInt(maxUses, 10) : undefined,
      expiresAt ? new Date(expiresAt) : undefined
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create access code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      code: result.code 
    });
  } catch (error) {
    console.error('Error creating access code:', error);
    return NextResponse.json(
      { error: 'Failed to create access code' },
      { status: 500 }
    );
  }
}

