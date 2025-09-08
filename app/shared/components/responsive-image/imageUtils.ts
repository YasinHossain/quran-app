import type { ResponsiveImageSources, ResponsiveImageSizes } from './types';

export const pickImageSource = (
  src: string | ResponsiveImageSources,
  breakpoint: 'mobile' | 'tablet' | 'desktop' | 'wide'
) => {
  if (typeof src === 'string') return src;

  switch (breakpoint) {
    case 'mobile':
      return src.mobile || src.fallback;
    case 'tablet':
      return src.tablet || src.mobile || src.fallback;
    case 'desktop':
    case 'wide':
      return src.desktop || src.tablet || src.fallback;
    default:
      return src.fallback;
  }
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

export const buildFallbackSvg = () =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n` +
      `  <rect width="100%" height="100%" fill="rgb(var(--color-surface))"/>\n` +
      `  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="rgb(var(--color-muted))" font-family="system-ui" font-size="14">\n` +
      `    Image\n` +
      `  </text>\n` +
      `</svg>`
  );
