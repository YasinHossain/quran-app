import { NextRequest, NextResponse } from 'next/server';
import { container } from '../../../src/shared/config/container';
import { HealthCheckService } from '../../../src/infrastructure/monitoring/HealthCheckService';

// GET /api/health - Basic health check
export async function GET(request: NextRequest) {
  try {
    const healthCheckService = container.get<HealthCheckService>(HealthCheckService);
    const healthCheck = await healthCheckService.performHealthCheck();

    // Set appropriate HTTP status based on health
    const status =
      healthCheck.status === 'healthy' ? 200 : healthCheck.status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthCheck, {
      status,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  }
}
