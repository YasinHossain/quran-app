import { absoluteUrl, getSiteUrl, isProductionDeployment, SITE_DOMAIN } from '../site';

describe('seo/site', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env['NEXT_PUBLIC_SITE_URL'];
    delete process.env['VERCEL_ENV'];
    delete process.env['VERCEL_URL'];
    delete process.env.NODE_ENV;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('detects production deployments using VERCEL_ENV when set', () => {
    process.env['VERCEL_ENV'] = 'preview';
    expect(isProductionDeployment()).toBe(false);
    process.env['VERCEL_ENV'] = 'production';
    expect(isProductionDeployment()).toBe(true);
  });

  it('falls back to NODE_ENV when VERCEL_ENV is not set', () => {
    process.env.NODE_ENV = 'development';
    expect(isProductionDeployment()).toBe(false);
    process.env.NODE_ENV = 'production';
    expect(isProductionDeployment()).toBe(true);
  });

  it('prefers NEXT_PUBLIC_SITE_URL when set', () => {
    process.env['NEXT_PUBLIC_SITE_URL'] = 'https://example.com/some/path';
    expect(getSiteUrl()).toBe('https://example.com');
  });

  it('uses the production domain when in production and NEXT_PUBLIC_SITE_URL is not set', () => {
    process.env['VERCEL_ENV'] = 'production';
    expect(getSiteUrl()).toBe(`https://${SITE_DOMAIN}`);
  });

  it('uses VERCEL_URL on non-production deployments when NEXT_PUBLIC_SITE_URL is not set', () => {
    process.env['VERCEL_ENV'] = 'preview';
    process.env['VERCEL_URL'] = 'preview.example.vercel.app';
    expect(getSiteUrl()).toBe('https://preview.example.vercel.app');
  });

  it('builds absolute URLs from a pathname', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    expect(absoluteUrl('/surah/1')).toBe('https://example.com/surah/1');
    expect(absoluteUrl('surah/1')).toBe('https://example.com/surah/1');
  });
});
