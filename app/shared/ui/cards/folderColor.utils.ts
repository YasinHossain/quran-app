'use client';

import type { Folder } from '@/types';

const isHexShort = (value: string): boolean => value.length === 4;

export const isStyleColor = (value?: string): boolean =>
  !!value && (/^#/.test(value) || /^rgb/.test(value) || /^hsl/.test(value) || /^var\(/.test(value));

export const resolveAccentColor = (color?: string): string =>
  isStyleColor(color) ? (color as string) : 'rgb(var(--color-accent))';

const expandHex = (hex: string): string =>
  `#${hex
    .slice(1)
    .split('')
    .map((char) => (isHexShort(hex) ? `${char}${char}` : char))
    .join('')}`;

export const applyOpacity = (color: string, alpha: number): string => {
  if (color.startsWith('#')) {
    const normalizedHex = expandHex(color);
    const intVal = parseInt(normalizedHex.slice(1), 16);
    const r = (intVal >> 16) & 255;
    const g = (intVal >> 8) & 255;
    const b = intVal & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (color.startsWith('rgba(')) {
    return color.replace(/rgba\(([^)]+)\)/, (_, values) => {
      const parts = values.split(',').slice(0, 3).join(',').trim();
      return `rgba(${parts}, ${alpha})`;
    });
  }

  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
  }

  if (color.startsWith('hsla(')) {
    return color.replace(/hsla\(([^)]+)\)/, (_, values) => {
      const parts = values.split(',').slice(0, 3).join(',').trim();
      return `hsla(${parts}, ${alpha})`;
    });
  }

  if (color.startsWith('hsl(')) {
    return color.replace('hsl(', 'hsla(').replace(')', `, ${alpha})`);
  }

  if (color.startsWith('var(')) {
    return `rgb(${color} / ${alpha})`;
  }

  return `rgb(var(--color-accent) / ${alpha})`;
};

export const getFolderGlyph = (folder: Pick<Folder, 'name' | 'icon'>): string => {
  const trimmedIcon = folder.icon?.trim();
  if (trimmedIcon) return trimmedIcon;
  return folder.name.charAt(0).toUpperCase();
};
