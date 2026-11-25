import {
  SEO_CONTENT_LAST_MODIFIED,
  SITEMAP_CHILD_IDS,
  sitemapChildUrl,
} from '@/lib/seo/sitemapEntries';
import { SITEMAP_XML_HEADERS, renderSitemapIndexXml } from '@/lib/seo/sitemapXml';

/**
 * Sitemap index at the URL already submitted to Google and Bing (and named in robots.txt). The
 * children live at `/sitemaps/<id>.xml`; see `SITEMAP_CHILD_IDS`.
 */
export const dynamic = 'force-static';

export function GET(): Response {
  const xml = renderSitemapIndexXml(
    SITEMAP_CHILD_IDS.map((id) => ({
      url: sitemapChildUrl(id),
      lastModified: SEO_CONTENT_LAST_MODIFIED,
    }))
  );
  return new Response(xml, { headers: SITEMAP_XML_HEADERS });
}
