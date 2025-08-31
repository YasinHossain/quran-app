import { NextRequest, NextResponse } from 'next/server';
import { container } from '../../../src/shared/config/container';
import { TYPES } from '../../../src/shared/config/container';
import { ErrorTrackingService } from '../../../src/infrastructure/error-tracking/ErrorTrackingService';

// POST /api/errors - Report an error
export async function POST(request: NextRequest) {
  try {
    const errorTrackingService = container.get<ErrorTrackingService>(TYPES.ErrorTrackingService);
    const body = await request.json();

    const { name, message, stack, context, severity } = body;

    if (!name || !message) {
      return NextResponse.json(
        {
          error: 'Missing required fields: name and message are required',
        },
        { status: 400 }
      );
    }

    const error = new Error(message);
    error.name = name;
    if (stack) {
      error.stack = stack;
    }

    const errorId = errorTrackingService.reportError(error, context || {}, severity || 'medium');

    return NextResponse.json(
      {
        success: true,
        errorId,
        message: 'Error reported successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to report error:', error);
    return NextResponse.json(
      {
        error: 'Failed to report error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/errors - Get error statistics (for admin/debugging)
export async function GET(request: NextRequest) {
  try {
    const errorTrackingService = container.get<ErrorTrackingService>(TYPES.ErrorTrackingService);
    const stats = errorTrackingService.getErrorStats();

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to retrieve error statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/errors - Clear error history (for admin)
export async function DELETE(request: NextRequest) {
  try {
    const errorTrackingService = container.get<ErrorTrackingService>(TYPES.ErrorTrackingService);
    errorTrackingService.clearErrorHistory();

    return NextResponse.json(
      {
        success: true,
        message: 'Error history cleared successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to clear error history',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
