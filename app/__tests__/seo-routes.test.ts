jest.mock('@/lib/api/server', () => ({
  getJuzInitialDataServer: jest.fn(),
}));

import { generateMetadata as generateJuzMetadata } from '@/app/(features)/juz/[juzId]/page';
import { metadata as juzIndexMetadata } from '@/app/(features)/juz/page';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';

describe('SEO routes', () => {
  it('keeps Next.js assets crawlable in robots.txt', () => {
    const config = robots();
    const firstRule = Array.isArray(config.rules) ? config.rules[0] : config.rules;

    expect(firstRule).toBeDefined();
    expect(firstRule?.disallow).not.toEqual(expect.arrayContaining(['/_next/']));
  });

  it('includes the juz index in the sitemap', () => {
    const entries = sitemap();

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: 'http://localhost:3000/juz',
        }),
      ])
    );
  });

  it('keeps juz routes indexable with descriptive metadata', async () => {
    expect(juzIndexMetadata.robots).toBeUndefined();

    const metadata = await generateJuzMetadata({
      params: Promise.resolve({ juzId: '1' }),
    });

    expect(metadata.robots).toBeUndefined();
    expect(metadata.description).toContain('Juz 1');
    expect(metadata.description).toContain('Al-Faatiha');
    expect(metadata.alternates?.canonical).toBe('http://localhost:3000/juz/1');
  });
});
