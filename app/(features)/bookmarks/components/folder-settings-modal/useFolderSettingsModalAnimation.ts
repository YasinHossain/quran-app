'use client';

import { useMemo } from 'react';

export const useFolderSettingsModalAnimation = () => {
  const backdropVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    }),
    []
  );

  const modalVariants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.95, y: -10 },
      visible: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: -10 },
    }),
    []
  );

  return { backdropVariants, modalVariants };
};
