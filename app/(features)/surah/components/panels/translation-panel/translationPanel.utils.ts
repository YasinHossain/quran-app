import { RefObject } from 'react';

export const capitalizeLanguageName = (lang: string): string =>
  lang
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

export const loadSelectedTranslations = (): number[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('selected-translations');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveSelectedTranslations = (ids: number[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('selected-translations', JSON.stringify(ids));
  } catch {
    // ignore storage errors
  }
};

export const scrollTabs = (
  ref: RefObject<HTMLDivElement | null>,
  direction: 'left' | 'right',
  amount = 200
) => {
  if (ref.current) {
    ref.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  }
};

export const updateScrollState = (
  ref: RefObject<HTMLDivElement | null>,
  setLeft: (v: boolean) => void,
  setRight: (v: boolean) => void
) => {
  if (!ref.current) return;
  const { scrollLeft, scrollWidth, clientWidth } = ref.current;
  setLeft(scrollLeft > 0);
  setRight(scrollLeft < scrollWidth - clientWidth - 1);
};

export const scrollToTab = (
  ref: RefObject<HTMLDivElement | null>,
  languages: string[],
  targetLang: string
) => {
  if (!ref.current) return;
  const container = ref.current;
  const index = languages.indexOf(targetLang);
  if (index === -1) return;
  const button = container.querySelector(`button:nth-child(${index + 1})`) as HTMLElement | null;
  if (button) {
    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const isOutsideLeft = buttonRect.left < containerRect.left;
    const isOutsideRight = buttonRect.right > containerRect.right;
    if (isOutsideLeft || isOutsideRight) {
      const targetScrollLeft = button.offsetLeft - containerRect.width / 2 + buttonRect.width / 2;
      container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
    }
  }
};
