export const capitalizeLanguageName = (lang: string): string =>
  lang
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
