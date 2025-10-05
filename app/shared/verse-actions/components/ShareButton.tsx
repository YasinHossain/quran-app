'use client';

import { memo } from 'react';

import { ShareIcon } from '@/app/shared/icons';
import { touchClasses } from '@/lib/responsive';
import { cn } from '@/lib/utils/cn';

interface ShareButtonProps {
  onShare: () => void;
}

export const ShareButton = memo(function ShareButton({
  onShare,
}: ShareButtonProps): React.JSX.Element {
  return (
    <button
      aria-label="Share"
      title="Share"
      onClick={onShare}
      className={cn(
        'p-1.5 rounded-full hover:bg-accent/10 hover:text-accent transition',
        touchClasses.focus
      )}
    >
      <ShareIcon size={18} />
    </button>
  );
});
