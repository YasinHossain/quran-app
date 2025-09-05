'use client';

import { useResponsiveState } from '@/lib/responsive';

import { DesktopVerseActions } from './DesktopVerseActions';
import { MobileVerseActions } from './MobileVerseActions';
import { VerseActionsProps } from './types';

export const ResponsiveVerseActions = (props: VerseActionsProps): JSX.Element => {
  const { variant } = useResponsiveState();

  if (variant === 'compact') {
    return <MobileVerseActions {...props} />;
  }

  return <DesktopVerseActions {...props} />;
};
