export const defaultShare = () => {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  if (navigator.share) {
    navigator.share({ title: 'Quran', url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).catch(() => {});
  }
};
