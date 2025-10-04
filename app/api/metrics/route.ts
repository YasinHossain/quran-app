import { NextResponse } from 'next/server';

// Simple metrics storage (in production, you'd use a proper metrics system)
let requestCount = 0;
let errorCount = 0;
const startTime = Date.now();

// GET /api/metrics - Basic application metrics
export async function GET(): Promise<NextResponse> {
  try {
    requestCount++;

    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: Date.now() - startTime,
      requests: {
        total: requestCount,
        errors: errorCount,
        success_rate:
          requestCount > 0
            ? (((requestCount - errorCount) / requestCount) * 100).toFixed(2) + '%'
            : '100%',
      },
      memory: getMemoryMetrics(),
      performance: getPerformanceMetrics(),
    };

    return NextResponse.json(metrics, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch {
    errorCount++;
    return NextResponse.json(
      {
        error: 'Failed to generate metrics',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

function getMemoryMetrics(): {
  rss: string;
  heapTotal: string;
  heapUsed: string;
  external: string;
} | null {
  if (typeof process !== 'undefined' && typeof process.memoryUsage === 'function') {
    const memUsage = process.memoryUsage();
    return {
      rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
      external: Math.round(memUsage.external / 1024 / 1024) + 'MB',
    };
  }
  return null;
}

function getPerformanceMetrics(): {
  uptime_seconds: number;
  cpu_usage: NodeJS.CpuUsage;
  event_loop_lag: string;
} | null {
  if (typeof process !== 'undefined' && typeof process.hrtime === 'function') {
    return {
      uptime_seconds: process.uptime(),
      cpu_usage: process.cpuUsage(),
      event_loop_lag: 'N/A', // Would need additional tooling to measure this accurately
    };
  }
  return null;
}

// Note: errorCount is incremented in the GET handler's catch block.
