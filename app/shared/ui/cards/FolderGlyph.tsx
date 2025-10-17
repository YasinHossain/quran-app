'use client';

import React from 'react';

import { FolderIcon } from '@/app/shared/icons';
import { cn } from '@/lib/utils/cn';

import { applyOpacity, isStyleColor, resolveAccentColor } from './folderColor.utils';

import type { Folder } from '@/types';

type GlyphSize = 'md' | 'lg';

const SIZE_MAP: Record<GlyphSize, { wrapper: string; iconSize: number; defaultShadow: string }> = {
  md: { wrapper: 'h-10 w-10', iconSize: 18, defaultShadow: '0 6px 16px -12px' },
  lg: { wrapper: 'h-12 w-12', iconSize: 20, defaultShadow: '0 10px 24px -18px' },
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
    shadowOpacity ?? 0.5
  )}`;

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-xl text-accent',
        sizeStyles.wrapper,
        !isStyleColor(folder.color) && folder.color ? folder.color : '',
        className
      )}
      style={{
        color: isStyleColor(folder.color) ? folder.color : undefined,
        backgroundColor: applyOpacity(accentColor, backgroundOpacity ?? 0.18),
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
