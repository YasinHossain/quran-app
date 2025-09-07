import { NextResponse } from 'next/server';

import { getRandomVerse } from '@/lib/api/verses';
import { logger } from '@/src/infrastructure/monitoring/Logger';

// Ensure Node.js runtime and disable caching for dynamic data
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const translationIdParam = searchParams.get('translationId');
    const translationId = Number(translationIdParam ?? '20');

    if (!Number.isFinite(translationId) || translationId <= 0) {
      return NextResponse.json({ error: 'Invalid translationId' }, { status: 400 });
    }

    const verse = await getRandomVerse(translationId);
    return NextResponse.json(verse);
  } catch (error: unknown) {
    // As a resilience measure, return the local fallback verse with a 200
    // and annotate the response, instead of bubbling an error to the client.
    logger.error('random verse route error:', undefined, error as Error);
    const { fallbackVerse } = await import('@/lib/api/fallback-verse');
    return new NextResponse(JSON.stringify(fallbackVerse), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
        'x-fallback': '1',
      },
    });
  }
}
