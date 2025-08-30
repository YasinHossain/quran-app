'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { sanitizeHtml } from '@/lib/text/sanitizeHtml';

export interface TranslationTextProps {
  text: string;
  fontSize?: number;
  className?: string;
  dir?: 'rtl' | 'ltr';
  children?: ReactNode;
}

export const TranslationText = ({
  text,
  fontSize = 16,
  className,
  dir = 'ltr',
  children,
}: TranslationTextProps) => {
  return (
    <p
      dir={dir}
      className={cn('text-left leading-relaxed text-foreground', className)}
      style={{ fontSize: `${fontSize}px` }}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(text) }}
    >
      {children}
    </p>
  );
};
