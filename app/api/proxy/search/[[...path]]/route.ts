import { createHmac } from 'node:crypto';

import { NextRequest, NextResponse } from 'next/server';

import { logger } from '@/src/infrastructure/monitoring/Logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GATEWAY_URL =
  process.env['QURAN_SEARCH_API_GATEWAY_URL'] ?? process.env['API_GATEWAY_URL'] ?? '';
const SIGNATURE_TOKEN =
  process.env['QURAN_SEARCH_SIGNATURE_TOKEN'] ?? process.env['SIGNATURE_TOKEN'] ?? '';
const INTERNAL_CLIENT_ID =
  process.env['QURAN_SEARCH_INTERNAL_CLIENT_ID'] ?? process.env['INTERNAL_CLIENT_ID'] ?? '';

const HEADER_AUTH_SIGNATURE = 'x-auth-signature';
const HEADER_TIMESTAMP = 'x-timestamp';
const HEADER_INTERNAL_CLIENT = 'x-internal-client';

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

function buildGatewayUrl(pathname: string, search: string): string {
  const normalizedGateway = GATEWAY_URL.replace(/\/$/, '');
  const serviceRoot = normalizedGateway.endsWith('/search')
    ? normalizedGateway
    : `${normalizedGateway}/search`;
  const serviceBase = ensureTrailingSlash(serviceRoot);
  const url = new URL(pathname.replace(/^\//, ''), serviceBase);
  url.search = search;
  return url.toString();
}

function generateSignature(
  url: string,
  token: string,
  timestamp?: string
): {
  signature: string;
  timestamp: string;
} {
  const currentTimestamp = timestamp ?? Date.now().toString();
  const rawString = `${url}.${currentTimestamp}`;
  const signature = createHmac('sha512', token).update(rawString).digest('base64');
  return { signature, timestamp: currentTimestamp };
}

function missingEnv(): string | null {
  if (!GATEWAY_URL) return 'Quran search gateway URL is not configured.';
  if (!SIGNATURE_TOKEN) return 'Quran search signature token is not configured.';
  if (!INTERNAL_CLIENT_ID) return 'Quran search internal client id is not configured.';
  return null;
}

export async function GET(
  request: NextRequest,
  context: { params: { path?: string[] } }
): Promise<NextResponse> {
  const envError = missingEnv();
  if (envError) {
    return NextResponse.json({ error: envError }, { status: 500 });
  }

  const downstreamPath = (context.params.path ?? []).join('/');
  const upstreamUrl = buildGatewayUrl(downstreamPath, request.nextUrl.search);

  try {
    const { signature, timestamp } = generateSignature(upstreamUrl, SIGNATURE_TOKEN);
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: {
        Accept: 'application/json',
        [HEADER_AUTH_SIGNATURE]: signature,
        [HEADER_TIMESTAMP]: timestamp,
        [HEADER_INTERNAL_CLIENT]: INTERNAL_CLIENT_ID,
      },
      cache: 'no-store',
    });

    const bodyText = await upstreamResponse.text();
    const headers = new Headers();
    headers.set(
      'Content-Type',
      upstreamResponse.headers.get('content-type') ?? 'application/json; charset=utf-8'
    );
    headers.set('Cache-Control', upstreamResponse.headers.get('cache-control') ?? 'no-store');

    return new NextResponse(bodyText, {
      status: upstreamResponse.status,
      headers,
    });
  } catch (error) {
    logger.error('Failed to proxy Quran search request', undefined, error as Error);
    return NextResponse.json({ error: 'Failed to reach Quran search service' }, { status: 502 });
  }
}

export async function HEAD(
  request: NextRequest,
  context: { params: { path?: string[] } }
): Promise<NextResponse> {
  const response = await GET(request, context);
  return new NextResponse(null, { status: response.status, headers: response.headers });
}

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET,HEAD' } }
  );
}

export async function PUT(): Promise<NextResponse> {
  return POST();
}

export async function DELETE(): Promise<NextResponse> {
  return POST();
}
