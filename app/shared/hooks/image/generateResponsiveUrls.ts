interface ResponsiveImageSources {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  fallback: string;
}

interface GenerateOptions {
  widths: number[];
  format?: string;
  quality?: number;
}

/**
 * Utility for generating responsive image URLs (e.g., for different CDN sizes)
 */
export const generateResponsiveUrls = (
  baseUrl: string,
  options: GenerateOptions
): ResponsiveImageSources => {
  const { widths, format = 'webp', quality = 80 } = options;

  // This is a generic implementation - adjust based on your CDN/image service
  const generateUrl = (width: number): string => {
    return `${baseUrl}?w=${width}&f=${format}&q=${quality}`;
  };

  return {
    mobile: generateUrl(widths[0] || 640),
    tablet: generateUrl(widths[1] || 1024),
    desktop: generateUrl(widths[2] || 1920),
    fallback: baseUrl,
  };
};
