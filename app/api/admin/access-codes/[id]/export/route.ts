import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  getAccessCodeById,
  getRegistrationsByCodeId 
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
 * GET /api/admin/access-codes/[id]/export
 * Export registrations as CSV
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

    // Generate CSV
    const headers = ['Full Name', 'Age Range', 'Contact Number', 'Email Address', 'Electoral District', 'Current Address', 'Registered At'];
    const rows = registrations.map(reg => [
      reg.full_name,
      reg.age_range,
      reg.contact_number,
      reg.email_address,
      reg.electoral_district,
      reg.current_address.replace(/"/g, '""'), // Escape quotes in address
      new Date(reg.created_at).toISOString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Return as downloadable CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="registrations-${code.code}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting registrations:', error);
    return NextResponse.json(
      { error: 'Failed to export registrations' },
      { status: 500 }
    );
  }
}

