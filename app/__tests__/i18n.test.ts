import { createI18nWithResources } from '@/app/i18n';
import commonBn from '@/public/locales/bn/common.json';
import playerBn from '@/public/locales/bn/player.json';
import commonEn from '@/public/locales/en/common.json';
import playerEn from '@/public/locales/en/player.json';

import type { Resource } from 'i18next';

describe('i18n initialization', () => {
  const resources: Resource = {
    en: { translation: commonEn, player: playerEn },
    bn: { translation: commonBn, player: playerBn },
  };

  it('initializes synchronously with the requested language', () => {
    const i18n = createI18nWithResources('bn', resources);
    expect(i18n.language).toBe('bn');
    expect(i18n.t('page_not_found')).toBe('পৃষ্ঠা পাওয়া যায় নি');
  });

  it('falls back to English for unknown languages', () => {
    const i18n = createI18nWithResources('xx', resources);
    expect(i18n.language).toBe('en');
    expect(i18n.t('page_not_found')).toBe('Page not found');
  });
});
