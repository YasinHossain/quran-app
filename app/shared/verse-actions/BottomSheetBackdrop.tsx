'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

interface BottomSheetBackdropProps {
  onClick: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const BottomSheetBackdrop = memo(function BottomSheetBackdrop({
  onClick,
}: BottomSheetBackdropProps): React.JSX.Element {
  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-modal touch-none"
      onClick={onClick}
    />
  );
});
