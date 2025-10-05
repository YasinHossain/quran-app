/**
 * Card state tokens
 */
export const states = {
  opacity: {
    hidden: 'opacity-0',
    visible: 'opacity-100',
    hover: 'opacity-0 group-hover:opacity-100',
  },
  interactive: {
    cursor: 'cursor-pointer',
    touchManipulation: 'touch-manipulation',
    focusRing:
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
  },
  content: {
    truncate: 'truncate',
    clamp2: 'line-clamp-2',
    whitespaceNowrap: 'whitespace-nowrap',
  },
} as const;
