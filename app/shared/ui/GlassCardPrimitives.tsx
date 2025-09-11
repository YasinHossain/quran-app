'use client';
import Link from 'next/link';
import React, { memo } from 'react';

import { cn } from '@/lib/utils/cn';

interface GlassCardLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className: string;
  children: React.ReactNode;
  href: string;
}

export const GlassCardLink = memo(
  React.forwardRef<HTMLAnchorElement, GlassCardLinkProps>(function GlassCardLink(
    { className, children, ...props },
    ref
  ) {
    return (
      <Link ref={ref} className={cn('group', className)} {...props}>
        {children}
      </Link>
    );
  })
);
GlassCardLink.displayName = 'GlassCardLink';

interface GlassCardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className: string;
  children: React.ReactNode;
}

export const GlassCardButton = memo(
  React.forwardRef<HTMLButtonElement, GlassCardButtonProps>(function GlassCardButton(
    { className, children, ...props },
    ref
  ) {
    return (
      <button ref={ref} className={cn('group text-left', className)} {...props}>
        {children}
      </button>
    );
  })
);
GlassCardButton.displayName = 'GlassCardButton';
