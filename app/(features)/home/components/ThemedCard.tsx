'use client';

import Link from 'next/link';
import { useTheme } from '@/app/providers/ThemeContext';
import type { ReactNode } from 'react';

interface ThemedCardProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function ThemedCard({ href, children, className = '' }: ThemedCardProps) {
  const { theme } = useTheme();

  return (
    <Link
      href={href}
      className={`group p-4 sm:p-5 rounded-2xl backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 content-visibility-auto animate-fade-in-up ${theme === 'light' ? 'bg-white/60' : 'bg-slate-800/40'} ${className}`}
    >
      {children}
    </Link>
  );
}
