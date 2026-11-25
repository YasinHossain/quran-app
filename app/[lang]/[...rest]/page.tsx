import { notFound } from 'next/navigation';

// Rendered per request: caching one 404 per unknown URL would grow the cache without bound.
export const dynamic = 'force-dynamic';

/**
 * Paths that match no route. `proxy.ts` sends every page URL to `/[lang]/...`, so without this the
 * 404 would skip the `[lang]` layout; here it renders `[lang]/not-found.tsx` in the URL's language.
 */
export default function UnknownPage(): never {
  notFound();
}
