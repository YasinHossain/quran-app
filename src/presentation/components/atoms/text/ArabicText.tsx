'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { applyTajweed } from '@/lib/text/tajweed';

export interface ArabicTextProps {
  text: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fontFamily?: string;
  className?: string;
  enableTajweed?: boolean;
  dir?: 'rtl' | 'ltr';
  children?: ReactNode;
}

const sizeClasses = {
  xs: 'text-lg',
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
  '2xl': 'text-5xl',
};

export const ArabicText = ({
  text,
  size = 'md',
  fontFamily = 'Noto Sans Arabic',
  className,
  enableTajweed = false,
  dir = 'rtl',
  children,
}: ArabicTextProps) => {
  const processedText = enableTajweed ? applyTajweed(text) : text;

  return (
    <span
      dir={dir}
      className={cn('font-arabic leading-loose text-foreground', sizeClasses[size], className)}
      style={{
        fontFamily,
        lineHeight: 2.2,
      }}
      {...(enableTajweed
        ? { dangerouslySetInnerHTML: { __html: sanitizeHtml(processedText) } }
        : { children: processedText })}
    >
      {!enableTajweed && children}
    </span>
  );
};
