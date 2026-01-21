import React, { memo, useEffect } from 'react';

import { cn } from '@/lib/utils/cn';

export function useCloseOnEscape(enabled: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onClose]);
}

export interface UnifiedModalBackdropProps {
  onClick: () => void;
  layerClassName: string;
  className?: string | undefined;
  isExiting?: boolean;
}

export const UnifiedModalBackdrop = memo(function UnifiedModalBackdrop({
  onClick,
  layerClassName,
  className,
  isExiting = false,
}: UnifiedModalBackdropProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'fixed inset-0 bg-surface-overlay/60 touch-none',
        isExiting ? 'animate-backdrop-out' : 'animate-backdrop-in',
        layerClassName,
        className
      )}
      onClick={onClick}
    />
  );
});

export interface UnifiedModalFrameProps {
  children: React.ReactNode;
  layerClassName: string;
  className?: string | undefined;
  containerClassName?: string | undefined;
  ariaLabel?: string | undefined;
  ariaLabelledBy?: string | undefined;
  ariaDescribedBy?: string | undefined;
  role: 'dialog' | 'alertdialog';
  isExiting?: boolean;
}

export const UnifiedModalFrame = memo(function UnifiedModalFrame({
  children,
  layerClassName,
  className,
  containerClassName,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  role,
  isExiting = false,
}: UnifiedModalFrameProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center p-4 pt-safe pb-safe pointer-events-none',
        layerClassName,
        containerClassName
      )}
    >
      <div
        className={cn(
          'w-full pointer-events-none transform-gpu',
          isExiting ? 'animate-modal-out' : 'animate-modal-in'
        )}
        style={{ willChange: 'transform, opacity' }}
      >
        <div
          role={role}
          aria-modal="true"
          {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
          {...(ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : {})}
          {...(ariaDescribedBy ? { 'aria-describedby': ariaDescribedBy } : {})}
          className={cn(
            'w-full mx-auto pointer-events-auto bg-background rounded-lg shadow-lg text-foreground overflow-hidden',
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
});
