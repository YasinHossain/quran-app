import { NextRequest, NextResponse } from 'next/server';

// GET /api/health/ready - Readiness probe for Kubernetes/Docker
export async function GET(request: NextRequest) {
  try {
    // Check if the application is ready to serve requests
    // This is a simple check - in a more complex app you might check:
    // - Database connections
    // - External service dependencies
    // - Required configuration

    const isReady = true; // For now, if the app is running, it's ready

    if (isReady) {
      return NextResponse.json(
        {
          status: 'ready',
          timestamp: new Date().toISOString(),
          message: 'Application is ready to serve requests',
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: 'not_ready',
          timestamp: new Date().toISOString(),
          message: 'Application is not ready to serve requests',
        },
        { status: 503 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
