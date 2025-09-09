'use client';

import { IconChevronLeft, IconChevronRight, IconArrowDown } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

import { useBreakpoint } from '@/lib/responsive';

interface SwipeIndicatorProps {
  show?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export const SwipeIndicator = ({
  show = true,
  autoHide = true,
  autoHideDelay = 5000,
}: SwipeIndicatorProps): React.JSX.Element | null => {
  const { isMobile } = useMobileBreakpoint();
  const { isVisible, hide } = useAutoHideVisibility({ show, autoHide, autoHideDelay });

  if (!isMobile) return null;

  return (
    <AnimatePresence>{isVisible && <SwipeIndicatorContent onDismiss={hide} />}</AnimatePresence>
  );
};

function useAutoHideVisibility({ show, autoHide, autoHideDelay }: Required<SwipeIndicatorProps>): {
  isVisible: boolean;
  hide: () => void;
} {
  const [isVisible, setIsVisible] = useState(show);
  useEffect(() => {
    if (autoHide && show) {
      const timer = setTimeout(() => setIsVisible(false), autoHideDelay);
      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, show]);
  const hide = useCallback(() => setIsVisible(false), []);
  return { isVisible, hide } as const;
}

function useMobileBreakpoint(): { isMobile: boolean } {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile' || breakpoint === 'tablet';
  return { isMobile } as const;
}

function SwipeIndicatorContent({ onDismiss }: { onDismiss: () => void }): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed left-4 right-4 z-30 bottom-nav-offset"
      onClick={onDismiss}
    >
      <div className="bg-surface-overlay/70 backdrop-blur-sm text-foreground rounded-2xl p-4 mx-auto max-w-sm">
        <div className="text-center mb-3">
          <p className="text-sm font-medium">Navigation Gestures</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <IconChevronLeft size={16} />
            <span>Previous</span>
          </div>
          <div className="flex items-center gap-2">
            <IconChevronRight size={16} />
            <span>Next</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 justify-center">
            <IconArrowDown size={16} />
            <span>Swipe down for Quran selector</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border/20 text-center">
          <p className="text-xs text-muted">Tap anywhere to dismiss</p>
        </div>
      </div>
    </motion.div>
  );
}
