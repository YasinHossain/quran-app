/**
 * Tiny event channel for the top-of-page route progress bar.
 *
 * `RouteProgressBar` listens here and finishes the bar itself when the pathname or search params
 * change. Anything that starts a client navigation outside a plain link click (for example
 * `router.push`) calls `startRouteProgress(href)`; `useProgressRouter` does that for you.
 */

type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeRouteProgress(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The part of a URL that identifies a page for the progress bar; the hash is ignored. */
export function routeKey(url: URL | Location): string {
  return `${url.pathname}${url.search}`;
}

/**
 * Whether going to `href` would load a different in-app page, so the bar should show.
 * Hash-only changes, other origins and unparsable hrefs return false.
 */
export function isRouteChange(href: string): boolean {
  if (typeof window === 'undefined') return false;
  let target: URL;
  try {
    target = new URL(href, window.location.href);
  } catch {
    return false;
  }
  if (target.origin !== window.location.origin) return false;
  return routeKey(target) !== routeKey(window.location);
}

/** Show the bar for a navigation to `href`, unless it stays on the current page. */
export function startRouteProgress(href?: string): void {
  if (href !== undefined && !isRouteChange(href)) return;
  listeners.forEach((listener) => listener());
}
