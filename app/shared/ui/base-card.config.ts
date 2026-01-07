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
      inactive: 'bg-surface dark:bg-surface/60 text-content-primary border border-border/30 dark:border-border/20',
      active: 'bg-accent text-on-accent border border-accent/30',
    },
    hover: {
      effect: 'none',
      value: '',
      duration: '',
    },
    shadow: {
      inactive: 'shadow-md',
      active: 'shadow-lg',
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
      value:
        'hover:-translate-y-1 hover:shadow-lg hover:border-accent/20 hover:bg-interactive-hover',
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
      value:
        'hover:-translate-y-0.5 hover:shadow-md hover:border-accent/30 hover:bg-interactive-hover',
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
      transition: '',
      hover: '',
    },
  },
  folder: {
    type: 'css',
    css: {
      transition: 'transition-transform duration-300 ease-out',
      hover: 'hover:-translate-y-1',
    },
  },
  bookmark: {
    type: 'css',
    css: {
      transition: 'transition-transform duration-200 ease-out',
      hover: 'hover:-translate-y-0.5',
    },
  },
};
