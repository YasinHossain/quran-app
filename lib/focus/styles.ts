export const focusVisibleClasses = {
  base: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
  button:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  input:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent',
  card: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  dark: 'dark:focus-visible:ring-offset-background',
  small: 'focus-visible:ring-1 focus-visible:ring-offset-1',
  large: 'focus-visible:ring-4 focus-visible:ring-offset-4',
} as const;

export const getFocusVisibleClasses = (
  focusStyle: keyof typeof focusVisibleClasses = 'base'
): string => focusVisibleClasses[focusStyle];
