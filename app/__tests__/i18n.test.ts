import { createI18n } from '@/app/i18n';

describe('i18n initialization', () => {
  it('initializes synchronously with the requested language', () => {
    const i18n = createI18n('bn');
    expect(i18n.language).toBe('bn');
    expect(i18n.t('page_not_found')).toBe('পৃষ্ঠা পাওয়া যায় নি');
  });

  it('falls back to English for unknown languages', () => {
    const i18n = createI18n('xx');
    expect(i18n.language).toBe('en');
    expect(i18n.t('page_not_found')).toBe('Page not found');
  });
});
