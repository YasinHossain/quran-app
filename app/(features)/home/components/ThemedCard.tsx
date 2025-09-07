'use client';

import { GlassCard } from '@/app/shared/ui';

import type { ReactNode } from 'react';

interface ThemedCardProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function ThemedCard({ href, children, className }: ThemedCardProps): React.JSX.Element {
  return (
    <GlassCard
      href={href}
      variant="primary"
      size="spacious"
      radius="2xl"
      {...(className && { className })}
    >
      {children}
    </GlassCard>
  );
}
