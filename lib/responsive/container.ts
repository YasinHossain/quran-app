import React from 'react';

export type ContainerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ContainerConfig<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

export const containerClasses = {
  container: '@container',
  containerInline: '@container/inline',
  containerSize: '@container/size',
  xs: '@xs',
  sm: '@sm',
  md: '@md',
  lg: '@lg',
  xl: '@xl',
  '320px': '@[320px]',
  '384px': '@[384px]',
  '640px': '@[640px]',
  '768px': '@[768px]',
  '1024px': '@[1024px]',
  '1280px': '@[1280px]',
} as const;

export const getContainerValue = <T>(config: ContainerConfig<T>, fallback: T): T => {
  return fallback;
};

interface UseContainerResult {
  containerSize: ContainerSize;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  isSmUp: boolean;
  isMdUp: boolean;
  isLgUp: boolean;
}

export const useContainer = (containerRef?: React.RefObject<HTMLElement>): UseContainerResult => {
  const [containerSize, setContainerSize] = React.useState<ContainerSize>('sm');

  React.useEffect(() => {
    if (!containerRef?.current) return;

    const breakpoints: Array<[number, ContainerSize]> = [
      [1280, 'xl'],
      [1024, 'lg'],
      [768, 'md'],
      [384, 'sm'],
    ];

    const getSizeFromWidth = (width: number): ContainerSize => {
      const match = breakpoints.find(([min]) => width >= min);
      return match ? match[1] : 'xs';
    };

    const updateContainerSize = (): void => {
      if (!containerRef.current) return;
      const { width } = containerRef.current.getBoundingClientRect();
      setContainerSize(getSizeFromWidth(width));
    };

    updateContainerSize();

    const resizeObserver = new ResizeObserver(updateContainerSize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return {
    containerSize,
    isXs: containerSize === 'xs',
    isSm: containerSize === 'sm',
    isMd: containerSize === 'md',
    isLg: containerSize === 'lg',
    isXl: containerSize === 'xl',
    isSmUp: ['sm', 'md', 'lg', 'xl'].includes(containerSize),
    isMdUp: ['md', 'lg', 'xl'].includes(containerSize),
    isLgUp: ['lg', 'xl'].includes(containerSize),
  };
};

export const getContainerClasses = (containerName?: string): string => {
  return containerName ? `@container/${containerName}` : '@container';
};
