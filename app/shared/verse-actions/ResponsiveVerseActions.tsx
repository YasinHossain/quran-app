'use client';

import { memo } from 'react';

import { useResponsiveState } from '@/lib/responsive';

import { DesktopVerseActions } from './DesktopVerseActions';
import { MobileVerseActions } from './MobileVerseActions';
import { VerseActionsProps } from './types';

export const ResponsiveVerseActions = memo(function ResponsiveVerseActions(
  props: VerseActionsProps
): React.JSX.Element {
  const { variant } = useResponsiveState();

  if (variant === 'compact') {
    return <MobileVerseActions {...props} />;
  }

  return <DesktopVerseActions {...props} />;
});
