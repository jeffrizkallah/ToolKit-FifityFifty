import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * GET /api/admin/health
 * Health check endpoint to verify database connection and data
 */
export async function GET() {
  try {
    // Test database connection
    const connectionTest = await sql`SELECT 1 as connected`;
    
    // Get counts from all tables
    const phasesCount = await sql`SELECT COUNT(*) as count FROM phases`;
    const modulesCount = await sql`SELECT COUNT(*) as count FROM modules`;
    const resourcesCount = await sql`SELECT COUNT(*) as count FROM resources`;
    const testimonialsCount = await sql`SELECT COUNT(*) as count FROM testimonials`;
    const settingsCount = await sql`SELECT COUNT(*) as count FROM settings`;
    
    // Get first phase as a sample
    const samplePhase = await sql`SELECT * FROM phases LIMIT 1`;

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      counts: {
        phases: Number(phasesCount.rows[0]?.count || 0),
        modules: Number(modulesCount.rows[0]?.count || 0),
        resources: Number(resourcesCount.rows[0]?.count || 0),
        testimonials: Number(testimonialsCount.rows[0]?.count || 0),
        settings: Number(settingsCount.rows[0]?.count || 0),
      },
      samplePhase: samplePhase.rows[0] || null,
      environment: {
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        nodeEnv: process.env.NODE_ENV,
      }
    }, { status: 500 });
  }
}

