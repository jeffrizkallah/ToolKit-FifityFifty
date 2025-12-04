import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  getAccessCodeById,
  updateAccessCodeStatus, 
  deleteAccessCode,
  getRegistrationsByCodeId,
  getCodeStatistics
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
 * GET /api/admin/access-codes/[id]
 * Get a specific access code with registrations
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const codeId = parseInt(id, 10);

    if (isNaN(codeId)) {
      return NextResponse.json({ error: 'Invalid code ID' }, { status: 400 });
    }

    const code = await getAccessCodeById(codeId);
    if (!code) {
      return NextResponse.json({ error: 'Access code not found' }, { status: 404 });
    }

    const registrations = await getRegistrationsByCodeId(codeId);
    const statistics = await getCodeStatistics(codeId);

    return NextResponse.json({ 
      code, 
      registrations,
      statistics
    });
  } catch (error) {
    console.error('Error fetching access code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch access code' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/access-codes/[id]
 * Update access code status (activate/deactivate)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const codeId = parseInt(id, 10);

    if (isNaN(codeId)) {
      return NextResponse.json({ error: 'Invalid code ID' }, { status: 400 });
    }

    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'isActive must be a boolean' }, { status: 400 });
    }

    const success = await updateAccessCodeStatus(codeId, isActive);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update access code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating access code:', error);
    return NextResponse.json(
      { error: 'Failed to update access code' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/access-codes/[id]
 * Delete an access code
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const codeId = parseInt(id, 10);

    if (isNaN(codeId)) {
      return NextResponse.json({ error: 'Invalid code ID' }, { status: 400 });
    }

    const success = await deleteAccessCode(codeId);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete access code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting access code:', error);
    return NextResponse.json(
      { error: 'Failed to delete access code' },
      { status: 500 }
    );
  }
}

