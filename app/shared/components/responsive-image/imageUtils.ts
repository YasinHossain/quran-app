import type { ResponsiveImageSources, ResponsiveImageSizes } from './types';

export const pickImageSource = (
  src: string | ResponsiveImageSources,
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide'
): string => {
  if (typeof src === 'string') return src;

  const priority: Record<typeof breakpoint, Array<keyof ResponsiveImageSources>> = {
    mobile: ['mobile', 'fallback'],
    tablet: ['tablet', 'mobile', 'fallback'],
    desktop: ['desktop', 'tablet', 'fallback'],
    wide: ['desktop', 'tablet', 'fallback'],
  };

  for (const key of priority[breakpoint]) {
    const candidate = src[key];
    if (candidate) return candidate as string;
  }
  return src.fallback;
};

export const buildSizes = (sizes?: ResponsiveImageSizes | string): string => {
  if (!sizes) return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
  if (typeof sizes === 'string') return sizes;

  const sizeQueries: string[] = [];
  if (sizes.mobile) sizeQueries.push(`(max-width: 767px) ${sizes.mobile}`);
  if (sizes.tablet) sizeQueries.push(`(max-width: 1023px) ${sizes.tablet}`);
  if (sizes.desktop) sizeQueries.push(`(min-width: 1024px) ${sizes.desktop}`);
  sizeQueries.push(sizes.default);

  return sizeQueries.join(', ');
};

export const buildFallbackSvg = (): string =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n` +
      `  <rect width="100%" height="100%" fill="rgb(var(--color-surface))"/>\n` +
      `  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="rgb(var(--color-muted))" font-family="system-ui" font-size="14">\n` +
      `    Image\n` +
      `  </text>\n` +
      `</svg>`
  );
