import { NextRequest, NextResponse } from 'next/server';

// GET /api/health/live - Liveness probe for Kubernetes/Docker
export async function GET(request: NextRequest) {
  try {
    // Basic liveness check - if the app is responding, it's alive
    // This should be a minimal check that doesn't depend on external services

    return NextResponse.json(
      {
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: 'Application is alive',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'dead',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
