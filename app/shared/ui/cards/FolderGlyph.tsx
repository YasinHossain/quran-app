'use client';

import React from 'react';

import { FolderIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';

import { applyOpacity, resolveAccentColor } from './folderColor.utils';

import type { Folder } from '@/types';

type GlyphSize = 'md' | 'lg';

const SIZE_MAP: Record<GlyphSize, { wrapper: string; iconSize: number; defaultShadow: string }> = {
  md: { wrapper: 'h-10 w-10', iconSize: 20, defaultShadow: '0 8px 18px -12px' },
  lg: { wrapper: 'h-12 w-12', iconSize: 24, defaultShadow: '0 12px 24px -16px' },
};

interface FolderGlyphProps {
  folder: Pick<Folder, 'name' | 'icon' | 'color'>;
  size?: GlyphSize;
  className?: string;
  glyphClassName?: string;
  backgroundOpacity?: number;
  shadowOpacity?: number;
  shadowOverride?: string;
  children?: React.ReactNode;
}

/**
 * Shared glyph badge used to render folder icons consistently across cards and sidebars.
 * Handles Tailwind token classes (e.g., "text-accent") as well as direct color values (#hex, rgb, etc.).
 */
export const FolderGlyph = ({
  folder,
  size = 'lg',
  className,
  glyphClassName,
  backgroundOpacity,
  shadowOpacity,
  shadowOverride,
  children,
}: FolderGlyphProps): React.JSX.Element => {
  const accentColor = resolveAccentColor(folder.color);
  const sizeStyles = SIZE_MAP[size];
  const inlineShadow = `${shadowOverride ?? sizeStyles.defaultShadow} ${applyOpacity(
    accentColor,
    shadowOpacity ?? 0.35
  )}`;

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-full text-on-accent',
        sizeStyles.wrapper,
        className
      )}
      style={{
        color: 'rgb(var(--color-on-accent))',
        backgroundColor: applyOpacity(accentColor, backgroundOpacity ?? 1),
        boxShadow: inlineShadow,
      }}
      aria-hidden="true"
    >
      <FolderIcon
        size={sizeStyles.iconSize}
        className={cn('text-current', glyphClassName)}
        aria-hidden="true"
      />
      {children}
    </div>
  );
};
