import { getSurahNavigationListServer } from '@/lib/api/server';
import { buildLlmsTxt } from '@/lib/seo/llmsTxt';

/** `/llms.txt`: Markdown overview for AI assistants (https://llmstxt.org). */
export const revalidate = 86400;

export async function GET(): Promise<Response> {
  const surahs = await getSurahNavigationListServer();
  const names = new Map(surahs.map((surah) => [surah.number, surah.name]));
  return new Response(buildLlmsTxt(names), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
