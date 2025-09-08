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
    const baseClasses =
      'fixed w-full sm:w-80 lg:w-[20.7rem] bg-background transition-all duration-300 ease-in-out';

    if (position === 'left') {
      return cn(
        baseClasses,
        'left-0 lg:left-16',
        'shadow-modal',
        isHeaderHidden ? 'top-0 h-screen' : 'top-16 h-[calc(100vh-4rem)]',
        'z-50 lg:z-10',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      );
    }
    return cn(
      baseClasses,
      'right-0',
      'shadow-modal',
      isHeaderHidden ? 'top-0 h-screen' : 'top-16 h-[calc(100vh-4rem)]',
      'z-30',
      isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
    );
  };

  return { getPositionClasses };
};
