'use client';

import React, { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils/cn';

interface SlideOverPanelProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export const SlideOverPanel = ({
  isOpen,
  children,
  className,
  testId,
}: SlideOverPanelProps): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRenderChildren, setShouldRenderChildren] = useState(isOpen);
  const rafIdRef = useRef<number | null>(null);
  const exitTimeoutIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (exitTimeoutIdRef.current !== null) {
      window.clearTimeout(exitTimeoutIdRef.current);
      exitTimeoutIdRef.current = null;
    }
    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (isOpen) {
      setShouldRenderChildren(true);
      setIsVisible(false);
      rafIdRef.current = window.requestAnimationFrame(() => {
        setIsVisible(true);
        rafIdRef.current = null;
      });
      return;
    }

    setIsVisible(false);
    exitTimeoutIdRef.current = window.setTimeout(() => {
      setShouldRenderChildren(false);
      exitTimeoutIdRef.current = null;
    }, 300);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (exitTimeoutIdRef.current !== null) {
        window.clearTimeout(exitTimeoutIdRef.current);
        exitTimeoutIdRef.current = null;
      }
    };
  }, []);

  return (
    <div
      data-testid={testId}
      aria-hidden={!isVisible}
      className={cn(
        'absolute inset-0 flex flex-col z-50 bg-background text-foreground',
        'transition-transform duration-300 will-change-transform transform-gpu',
        isVisible
          ? 'translate-x-0 shadow-lg ease-in-out'
          : 'translate-x-full shadow-none ease-in-out pointer-events-none',
        className
      )}
    >
      {shouldRenderChildren ? children : null}
    </div>
  );
};
