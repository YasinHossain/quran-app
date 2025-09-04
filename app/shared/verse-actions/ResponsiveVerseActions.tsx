'use client';

import React from 'react';
import { useResponsiveState } from '@/lib/responsive';
import { MobileVerseActions } from './MobileVerseActions';
import { DesktopVerseActions } from './DesktopVerseActions';
import { VerseActionsProps } from './types';

export const ResponsiveVerseActions: React.FC<VerseActionsProps> = (props) => {
  const { variant } = useResponsiveState();

  if (variant === 'compact') {
    return <MobileVerseActions {...props} />;
  }

  return <DesktopVerseActions {...props} />;
};
