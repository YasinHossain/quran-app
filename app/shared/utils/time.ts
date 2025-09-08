const TIME_UNITS = [
  { label: 'year', seconds: 365 * 24 * 60 * 60 },
  { label: 'month', seconds: 30 * 24 * 60 * 60 },
  { label: 'week', seconds: 7 * 24 * 60 * 60 },
  { label: 'day', seconds: 24 * 60 * 60 },
  { label: 'hour', seconds: 60 * 60 },
  { label: 'minute', seconds: 60 },
];

const pluralize = (value: number, unit: string): string =>
  `${value} ${unit}${value === 1 ? '' : 's'} ago`;

const getTimeAgo = (seconds: number): string => {
  for (const { label, seconds: unitSeconds } of TIME_UNITS) {
    const value = Math.floor(seconds / unitSeconds);
    if (value > 0) return pluralize(value, label);
  }
  return 'Just now';
};

export const formatTimeAgo = (timestamp: number): string => {
  const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);
  return getTimeAgo(diffSeconds);
};
