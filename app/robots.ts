import { getSiteUrl } from '@/lib/seo/site';

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Do not block `/_next/`; Google needs JS/CSS assets to render Next.js pages.
        disallow: ['/api/', '/offline'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
