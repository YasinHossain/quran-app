export const SITE_DOMAIN = 'appquran.com';
export const SITE_NAME = 'AppQuran';

export const SITE_DESCRIPTION =
  'AppQuran is a fast, modern Quran app to read, listen, and study the Holy Quran with translations, tafsir, and audio recitations.';

export const SITE_KEYWORDS: ReadonlyArray<string> = [
  'AppQuran',
  'Quran',
  'Al Quran',
  'Quran app',
  'Read Quran online',
  'Quran translation',
  'Quran tafsir',
  'Quran audio',
  'Quran recitation',
  'Holy Quran',
];

export function isProductionDeployment(): boolean {
  // Vercel sets VERCEL_ENV to: 'production' | 'preview' | 'development'
  const vercelEnv = process.env['VERCEL_ENV'];
  if (vercelEnv) return vercelEnv === 'production';
  return process.env.NODE_ENV === 'production';
}

function normalizeOrigin(url: string): string {
  const raw = String(url || '').trim();
  if (!raw) return '';
  const withProtocol = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
  const parsed = new URL(withProtocol);
  return `${parsed.protocol}//${parsed.host}`;
}

export function getSiteUrl(): string {
  const envUrl = process.env['NEXT_PUBLIC_SITE_URL'];
  const normalizedEnv = envUrl ? normalizeOrigin(envUrl) : '';
  if (normalizedEnv) return normalizedEnv;

  if (isProductionDeployment()) return `https://${SITE_DOMAIN}`;

  const vercelUrl = process.env['VERCEL_URL'];
  if (vercelUrl) return normalizeOrigin(`https://${vercelUrl}`);

  return 'http://localhost:3000';
}

export function absoluteUrl(pathname: string): string {
  const baseUrl = getSiteUrl();
  const path = String(pathname || '/').startsWith('/') ? String(pathname || '/') : `/${pathname}`;
  return new URL(path, baseUrl).toString();
}
