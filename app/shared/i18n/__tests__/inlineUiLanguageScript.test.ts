import { buildInlineUiLanguageScript } from '@/app/shared/i18n/inlineUiLanguageScript';
import { ENABLED_LANGUAGE_CODES, RTL_LANGUAGE_CODES } from '@/app/shared/i18n/languageRegistry';

const run = (script: string, pathname: string): void => {
  window.history.replaceState(null, '', pathname);
  new Function(script)();
};

describe('buildInlineUiLanguageScript', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('lang');
    document.documentElement.removeAttribute('dir');
    window.localStorage.clear();
    document.cookie = 'ui-language=; path=/; max-age=0';
    window.history.replaceState(null, '', '/');
  });

  it('applies lang and dir from the URL prefix for every registry language', () => {
    const script = buildInlineUiLanguageScript();

    for (const code of ENABLED_LANGUAGE_CODES) {
      run(script, `/${code}/surah/36`);
      expect(document.documentElement.lang).toBe(code);
      expect(document.documentElement.dir).toBe(RTL_LANGUAGE_CODES.includes(code) ? 'rtl' : 'ltr');
    }
  });

  it('only accepts languages from the given list', () => {
    const script = buildInlineUiLanguageScript(['en', 'xx'], ['xx']);

    run(script, '/xx/surah/1');
    expect(document.documentElement.lang).toBe('xx');
    expect(document.documentElement.dir).toBe('rtl');

    document.documentElement.removeAttribute('lang');
    document.cookie = 'ui-language=; path=/; max-age=0';
    run(script, '/bn/surah/1');
    expect(document.documentElement.getAttribute('lang')).toBeNull();
  });
});
