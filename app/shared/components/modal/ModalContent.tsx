import { motion } from 'framer-motion';

interface ModalContentProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -10 },
};

export const ModalContent = ({
  title,
  description,
  children,
}: ModalContentProps): React.JSX.Element => (
  <motion.div
    variants={modalVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-modal"
  >
    <div
      role="dialog"
      aria-modal="true"
      className="bg-surface border border-border rounded-2xl shadow-modal p-6"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
      <p className="text-foreground mb-6">{description}</p>
      {children}
    </div>
  </motion.div>
);
