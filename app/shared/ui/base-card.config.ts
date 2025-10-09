export interface CardVariant {
  padding: string;
  height?: string;
  borderRadius: string;
  background: {
    inactive: string;
    active: string;
  };
  hover: {
    effect: 'scale' | 'translate' | 'none';
    value: string;
    duration: string;
  };
  shadow: {
    inactive: string;
    active: string;
  };
}

export interface AnimationConfig {
  type: 'css' | 'framer';
  css?: {
    transition: string;
    hover: string;
  };
  framer?: {
    initial: Record<string, string | number>;
    animate: Record<string, string | number>;
    exit?: Record<string, string | number>;
    transition: Record<string, string | number>;
    hover?: Record<string, string | number>;
  };
}

export const CARD_VARIANTS: Record<string, CardVariant> = {
  navigation: {
    padding: 'p-4',
    height: 'h-[80px]',
    borderRadius: 'rounded-xl',
    background: {
      inactive: 'bg-surface-glass/70 backdrop-blur-xl text-content-primary border border-border/20',
      active: 'bg-accent text-on-accent backdrop-blur-xl border border-accent/30',
    },
    hover: {
      effect: 'none',
      value: 'hover:shadow-xl',
      duration: 'transition-all duration-300',
    },
    shadow: {
      inactive: 'shadow-lg',
      active: 'shadow-xl shadow-accent/40',
    },
  },
  folder: {
    padding: 'p-6',
    borderRadius: 'rounded-xl',
    background: {
      // Align folder cards with the look used in BookmarkFolderCard
      // Slightly translucent surface with subtle blur and lighter border
      inactive: 'bg-surface/80 backdrop-blur-sm border border-border/40',
      active: 'bg-surface/80 backdrop-blur-sm border border-border/40',
    },
    hover: {
      effect: 'translate',
      // Add hover background to better surface elevation changes
      value: 'hover:-translate-y-1 hover:shadow-lg hover:border-accent/20 hover:bg-surface-hover',
      duration: 'transition-all duration-300',
    },
    shadow: {
      inactive: 'shadow-sm',
      active: 'shadow-sm',
    },
  },
  bookmark: {
    padding: 'p-5',
    borderRadius: 'rounded-xl',
    background: {
      inactive: 'bg-surface border border-border',
      active: 'bg-surface border border-border',
    },
    hover: {
      effect: 'translate',
      value: 'hover:-translate-y-0.5 hover:shadow-md hover:border-accent/30 hover:bg-surface-hover',
      duration: 'transition-all duration-200',
    },
    shadow: {
      inactive: '',
      active: '',
    },
  },
};

export const ANIMATION_CONFIGS: Record<string, AnimationConfig> = {
  navigation: {
    type: 'css',
    css: {
      transition: 'transition-all duration-300',
      hover: 'hover:shadow-xl',
    },
  },
  folder: {
    type: 'framer',
    framer: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
  },
  bookmark: {
    type: 'framer',
    framer: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.2 },
    },
  },
};
