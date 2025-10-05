import { motion } from 'framer-motion';

interface ModalBackdropProps {
  onClick: () => void;
}

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

export const ModalBackdrop = ({ onClick }: ModalBackdropProps): React.JSX.Element => (
  <motion.div
    variants={backdropVariants}
    initial="hidden"
    animate="visible"
    exit="hidden"
    className="fixed inset-0 bg-surface-overlay/60 backdrop-blur-sm z-modal"
    onClick={onClick}
  />
);
