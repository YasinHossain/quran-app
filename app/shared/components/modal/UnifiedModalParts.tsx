import { motion } from 'framer-motion';
import React, { memo, useEffect } from 'react';

import { cn } from '@/lib/utils/cn';

const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const MODAL_VARIANTS = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
};

const MODAL_TRANSITION = { type: 'spring', damping: 25, stiffness: 350, mass: 0.8 } as const;

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
}

export const UnifiedModalBackdrop = memo(function UnifiedModalBackdrop({
  onClick,
  layerClassName,
  className,
}: UnifiedModalBackdropProps): React.JSX.Element {
  return (
    <motion.div
      variants={BACKDROP_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
      className={cn('fixed inset-0 bg-surface-overlay/60 touch-none', layerClassName, className)}
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
}: UnifiedModalFrameProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center p-4 pt-safe pb-safe pointer-events-none',
        layerClassName,
        containerClassName
      )}
    >
      <motion.div
        variants={MODAL_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={MODAL_TRANSITION}
        style={{ willChange: 'transform, opacity' }}
        className="w-full pointer-events-none transform-gpu"
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
      </motion.div>
    </div>
  );
});
