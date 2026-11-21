import { getVerseCountsServer } from '@/lib/api/server';
import { SITEMAP_CHILD_IDS, buildSitemapChild } from '@/lib/seo/sitemapEntries';
import { SITEMAP_XML_HEADERS, renderSitemapXml } from '@/lib/seo/sitemapXml';

/** Child sitemaps of `/sitemap.xml`, e.g. `/sitemaps/core.xml`, `/sitemaps/verses-bn.xml`. */
export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams(): Array<{ file: string }> {
  return SITEMAP_CHILD_IDS.map((id) => ({ file: `${id}.xml` }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> }
): Promise<Response> {
  const { file } = await params;
  const id = file.replace(/\.xml$/, '');
  // Verse counts come from chapter data; a failed fetch throws (an error, never an empty sitemap).
  const verseCounts = id === 'core' ? [] : await getVerseCountsServer();
  const entries = buildSitemapChild(id, verseCounts);
  if (!entries) return new Response('Not found', { status: 404 });
  return new Response(renderSitemapXml(entries), { headers: SITEMAP_XML_HEADERS });
}
