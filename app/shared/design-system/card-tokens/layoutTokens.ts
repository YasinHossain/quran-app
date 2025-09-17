/**
 * Card layout tokens
 */
export const layout = {
  // Heights
  height: {
    fixed: 'h-[80px]',
    auto: 'h-auto',
  },

  // Flex configurations
  flex: {
    row: 'flex items-center',
    column: 'flex flex-col',
    spaceBetween: 'flex items-center justify-between',
    grow: 'flex-grow min-w-0',
    shrink: 'flex-shrink-0',
    alignStart: 'items-start',
    alignCenter: 'items-center',
    justifyBetween: 'justify-between',
  },

  // Special patterns
  patterns: {
    navigationContent: 'flex-grow min-w-0',
    iconContainer: 'flex-shrink-0 p-3 rounded-lg',
    progressBar: 'w-full h-1.5 bg-surface-hover rounded-full overflow-hidden',
    progressFill: 'h-full bg-gradient-to-r from-accent to-accent/80 rounded-full',
  },
} as const;

export default layout;
