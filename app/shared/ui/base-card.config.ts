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
      inactive:
        'bg-surface-navigation text-content-primary border border-border/30 dark:border-border/20',
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
      // Removing glass effect and matching Surah card color (bg-surface-navigation)
      inactive:
        'bg-surface-navigation text-content-primary border border-border/30 dark:border-border/20',
      active:
        'bg-surface-navigation text-content-primary border border-border/30 dark:border-border/20',
    },
    hover: {
      effect: 'none',
      value: 'hover:shadow-lg hover:border-accent/20 hover:bg-interactive-hover',
      duration: '',
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
      effect: 'none',
      value: 'hover:shadow-md hover:border-accent/30 hover:bg-interactive-hover',
      duration: '',
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
      transition: '',
      hover: '',
    },
  },
  bookmark: {
    type: 'css',
    css: {
      transition: '',
      hover: '',
    },
  },
};
