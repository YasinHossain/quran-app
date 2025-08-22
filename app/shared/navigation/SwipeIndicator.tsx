'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconChevronLeft, IconChevronRight, IconArrowDown } from '@tabler/icons-react';
import { useBreakpoint } from '@/lib/responsive';

interface SwipeIndicatorProps {
  show?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const SwipeIndicator: React.FC<SwipeIndicatorProps> = ({
  show = true,
  autoHide = true,
  autoHideDelay = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (autoHide && show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, show]);

  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile' || breakpoint === 'tablet';

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed left-4 right-4 z-30"
          style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom))' }}
          onClick={() => setIsVisible(false)}
        >
          <div className="bg-black/70 backdrop-blur-sm text-white rounded-2xl p-4 mx-auto max-w-sm">
            <div className="text-center mb-3">
              <p className="text-sm font-medium">Navigation Gestures</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Horizontal swipes */}
              <div className="flex items-center gap-2">
                <IconChevronLeft size={16} />
                <span>Previous</span>
              </div>
              <div className="flex items-center gap-2">
                <IconChevronRight size={16} />
                <span>Next</span>
              </div>

              {/* Vertical swipes */}
              <div className="flex items-center gap-2 col-span-2 justify-center">
                <IconArrowDown size={16} />
                <span>Swipe down for Quran selector</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/20 text-center">
              <p className="text-xs text-white/70">Tap anywhere to dismiss</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SwipeIndicator;
