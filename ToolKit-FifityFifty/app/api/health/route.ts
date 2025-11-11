import { NextResponse } from 'next/server';

/**
 * Health Check API Route
 * 
 * Simple endpoint to verify the application is running.
 * Useful for monitoring and deployment verification.
 */

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}

