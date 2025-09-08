/**
 * Card animation tokens
 */
export const animations = {
  transitions: {
    fast: 'transition-all duration-200',
    normal: 'transition-all duration-300',
    transform: 'transition transform',
    colors: 'transition-colors',
    colorsNormal: 'transition-colors duration-200',
    opacity: 'transition-opacity duration-200',
  },
  hover: {
    scaleSmall: 'hover:scale-[1.02]',
    translateUp: 'hover:-translate-y-1',
    translateUpSmall: 'hover:-translate-y-0.5',
  },
  framer: {
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
    spring: { type: 'spring', stiffness: 400, damping: 25 },
    smooth: { duration: 0.2 },
    medium: { duration: 0.3 },
  },
} as const;
