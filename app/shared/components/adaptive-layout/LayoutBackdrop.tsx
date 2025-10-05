import { AnimatePresence, motion } from 'framer-motion';

interface LayoutBackdropProps {
  show: boolean;
  onClose?: () => void;
}

export const LayoutBackdrop = ({
  show,
  onClose,
}: LayoutBackdropProps): React.JSX.Element | null => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-surface-overlay/60 z-40"
      />
    )}
  </AnimatePresence>
);
