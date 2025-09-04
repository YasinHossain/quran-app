'use client';

import { useResponsiveState } from '@/lib/responsive';
import { MobileVerseActions } from './MobileVerseActions';
import { DesktopVerseActions } from './DesktopVerseActions';
import { VerseActionsProps } from './types';

export const ResponsiveVerseActions = (props: VerseActionsProps): JSX.Element => {
  const { variant } = useResponsiveState();

  if (variant === 'compact') {
    return <MobileVerseActions {...props} />;
  }

  return <DesktopVerseActions {...props} />;
};
