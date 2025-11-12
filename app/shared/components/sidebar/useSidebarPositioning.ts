import { cn } from '@/lib/utils/cn';

interface UseSidebarPositioningOptions {
  position: 'left' | 'right';
  isOpen: boolean;
  isHeaderHidden: boolean;
}

interface UseSidebarPositioningReturn {
  getPositionClasses(): string;
}

export const useSidebarPositioning = ({
  position,
  isOpen,
  isHeaderHidden,
}: UseSidebarPositioningOptions): UseSidebarPositioningReturn => {
  const getPositionClasses = (): string => {
    const baseClasses = cn(
      // Use !fixed to avoid being overridden by any accidental 'relative'
      '!fixed w-full bg-background transition-all duration-300 ease-in-out',
      'sm:w-80',
      position === 'left' ? 'lg:w-reader-sidebar-left' : 'lg:w-reader-sidebar-right'
    );
    const headerAwareClasses = isHeaderHidden
      ? 'top-0 h-screen'
      : 'top-reader-header h-[calc(100vh-var(--reader-header-height))]';

    const shadowClasses = 'shadow-modal lg:shadow-none';

    if (position === 'left') {
      return cn(
        baseClasses,
        'left-0 lg:left-16',
        shadowClasses,
        headerAwareClasses,
        // Ensure the left sidebar overlays the audio player (z-audio-player = 110)
        'z-[120]',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      );
    }
    return cn(
      baseClasses,
      'right-0',
      shadowClasses,
      headerAwareClasses,
      'z-30',
      isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
    );
  };

  return { getPositionClasses };
};
