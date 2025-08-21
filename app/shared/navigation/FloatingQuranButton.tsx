'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IconBook, IconList } from '@tabler/icons-react';

interface FloatingQuranButtonProps {
  onPress: () => void;
  className?: string;
}

const FloatingQuranButton: React.FC<FloatingQuranButtonProps> = ({ onPress, className = '' }) => {
  return (
    <motion.button
      onClick={onPress}
      className={`fixed right-4 bottom-24 z-40 w-14 h-14 bg-gradient-to-tr from-accent to-accent-hover text-on-accent rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center lg:hidden ${className}`}
      style={{ touchAction: 'manipulation' }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 25,
        delay: 0.2,
      }}
    >
      {/* Glowing effect */}
      <div className="absolute inset-0 bg-accent/20 rounded-2xl blur-xl animate-pulse" />

      {/* Icon */}
      <IconList size={24} className="relative z-10 stroke-[2.5]" />
    </motion.button>
  );
};

export default FloatingQuranButton;
