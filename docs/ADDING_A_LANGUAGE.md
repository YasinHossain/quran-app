# Adding a Language

The website's languages come from one registry: `app/shared/i18n/languageRegistry.ts`. Routing
(`proxy.ts`), the inline `<html lang/dir>` script, RTL, `hreflang`, canonical URLs, the sitemap, and
the reader's server-rendered defaults all derive from it. Adding a language takes four steps: add a
registry entry, add the JSON files, choose the content ids, and deploy. A new language launches for
users first and is opened to search engines later (step 5).

Example below: Indonesian (`id`).

## 1. Choose the Quran translation and tafsir (website)

Use published, attributed works from the Quran.com API. **Never use machine-translated or
AI-translated scripture or tafsir.**

```bash
# Translations: pick a well-known, complete translation in the language
curl -s 'https://api.quran.com/api/v4/resources/translations' \
  | jq '.translations[] | select(.language_name=="indonesian") | {id, name, author_name}'

# Tafsirs: if none exists in the language, fall back to the English default (169) and say so in a comment
curl -s 'https://api.quran.com/api/v4/resources/tafsirs' \
  | jq '.tafsirs[] | select(.language_name=="indonesian") | {id, name, author_name}'

# Word-by-word languages
curl -s 'https://api.quran.com/api/v4/resources/languages' | jq '.languages[] | {iso_code, name}'
```

Spot-check one verse (for example `2:255`) with the chosen id before committing. Translation
choices for a new language need sign-off from Yasin, and from a scholar when the choice is unclear.

## 2. Registry entry (website)

Add an entry to `LANGUAGE_REGISTRY` in `app/shared/i18n/languageRegistry.ts`:

```ts
{
  code: 'id',             // URL prefix (/id/surah/36), <html lang>, i18next language
  englishName: 'Indonesian',
  nativeName: 'Bahasa Indonesia',
  dir: 'ltr',             // 'rtl' for Arabic-script languages
  hreflang: 'id',
  enabled: true,          // false hides a language (routes, pickers, sitemap) without deleting it
  indexable: false,       // launch unindexed: noindex, no hreflang, not in the sitemap (step 5)
  content: {
    translationIds: [TRANSLATION_ID], // from step 1; [] = Arabic text only
    tafsirIds: [TAFSIR_ID],           // from step 1, or 169 (English) with a comment
    hasOwnTafsir: true,               // false when tafsirIds falls back to another language
    wordLang: 'id',                   // word-by-word language, or 'en' if unsupported
    wordTranslationId: TRANSLATION_ID,
  },
},
```

Language pickers, the proxy, `hreflang`, the sitemap and the reader defaults pick it up. A few
places still need the code by hand:

- Own digits: `DIGIT_MAPS`/`LOCALE_OVERRIDES` in `lib/text/localizeNumbers.ts`.
- Arabic-script languages: the `html[lang=…]` UI font rule in `app/globals.css` and
  `ARABIC_SCRIPT_LANGUAGES` in `app/(features)/surah/[surahId]/about/components/TafsirIntroCard.tsx`.
- A tafsir in the language: the fallback language list in
  `src/infrastructure/repositories/tafsir.utils.ts`.
- Word-by-word: `wordTranslationId` must be the language's id in the WBW selector
  (`app/(features)/surah/components/LanguageList.tsx`), or the selector shows nothing selected.

## 3. Locale JSON (website)

Create `public/locales/<code>/common.json` and `public/locales/<code>/player.json` with every key
from `public/locales/en/`.

- UI strings may be machine-translated first; a native speaker should review them before launch.
- `surah_names` must use the conventional transliteration in that language.
- SEO keys (`seo_*`, `reader_full_text_title*`) become titles, descriptions and the full-text
  section label shown to search engines. Set `seo_default_tafsir_name` to the name of the default
  tafsir chosen in step 1. Keep Arabic religious terms (surah, juz/para, tafsir, Meccan/Medinan) in
  the conventional form for the language.
- Brand name and numbers come from code (`{{siteName}}`, `{{number}}`); keep the placeholders.

## 4. Verify and deploy

```bash
npm run type-check
npx jest app/__tests__/seo-routes.test.ts app/__tests__/proxy.test.ts app/shared/i18n
npm run build && PORT=3125 npm start

UA='Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
curl -s -A "$UA" http://localhost:3125/id/surah/36 | grep -oE '<html[^>]*>|<title>[^<]*|<link rel="(canonical|alternate)"[^>]*>'
curl -s -A "$UA" http://localhost:3125/id/surah/36 | grep -c 'data-verse-key="36:'   # expect ≥ 83
curl -s -A "$UA" http://localhost:3125/id/surah/36 | grep -o '<meta name="robots"[^>]*>'  # noindex, follow
curl -s http://localhost:3125/sitemap.xml | grep -c 'verses-id'                 # expect 0 while unindexed
```

Check that:

- `/id/surah/36` returns 200 with `<html lang="id" dir="…">`, a self canonical
  (`…/id/surah/36`), `noindex, follow`, `hreflang` links for the indexable languages (not `id`)
  plus `x-default`, a localized `<title>`, and the full-text `<details>` with 83 verses in the
  chosen translation.
- `hreflang="id"` appears on no page, and `/sitemap.xml` has no `id` children.
- Unprefixed `/surah/36` with no cookie and no `Accept-Language` still returns 200 in English.
- In a browser (DevTools or Playwright, phone viewport, after network idle) the page keeps the 83
  verses in the full-text section, the console has no hydration errors, and no request refetches
  page 1 of the verses.

Then deploy. The language is live for users but not indexed.

## 5. Open the language to search engines

Once a native speaker has reviewed the UI strings and the Google Search Console check shows the
existing languages indexed:

1. Set `indexable: true` in the registry entry and deploy.
2. Check that `/id/surah/36` no longer has `noindex`, other languages' pages list `hreflang="id"`,
   and `/sitemap.xml` lists `verses-id` (and `tafsir-id` when `hasOwnTafsir: true`; a language
   that falls back to the English tafsir gets no tafsir child, and its tafsir pages stay
   `noindex, follow` and out of tafsir hreflang).
3. Resubmit `sitemap.xml` in Google Search Console and Bing Webmaster Tools.
4. Run `npm run seo:indexnow -- --sitemap --dry-run`, check the URLs, then
   `npm run seo:indexnow -- --sitemap`.

## 6. Mobile app (quran-app-mobile)

The mobile app keeps its own language list; mirror the website entry there.

1. `lib/i18n/uiLanguages.ts`: add `{ code, label, nativeLabel, direction }` to `UI_LANGUAGES`.
   `direction: 'rtl'` drives the layout switch in `lib/i18n/layoutDirection.ts` (`forceRTL` and an
   app reload), so test the switch on a device.
2. `locales/<code>/common.json`: copy the website's `common.json` (the mobile app reads the same
   keys) and add mobile-only keys from `locales/en/common.json`. Grammar and religious terms that
   need a scholar stay out of the file (they fall back to English); track them in
   `docs/scholar-review.md`.
3. `providers/UiLanguageContext.tsx`: import the new JSON and add it to `COMMON_TRANSLATIONS`.
4. `src/data/initial-language-defaults.json`: the default translation id (same as the website
   registry's `translationIds[0]`, or `null` for Arabic text only).
5. `src/data/essential-language-defaults.json`: mushaf pack, tafsir id, and word language.
6. If the language has its own digits, add it to `lib/i18n/localizeNumbers.ts` (and to the
   `٪` check in `app/welcome.tsx` for Arabic-script languages). If counted nouns change form with
   the number (Arabic, Russian), add its rule to `getPluralSuffixes` in `lib/i18n/uiLanguages.ts`.
7. Add the code in the places nothing else derives it from: the welcome copy maps in
   `app/welcome.tsx` (type-check fails until they have it), `PREFIXED_LOCALES` in
   `lib/verse/verseShareUrl.ts` (shared verse links), the search words for "juz", "page" and
   "surah" in `NAVIGATION_KEYWORDS` (`lib/api/search.ts`), and the expected defaults in
   `tests/welcome-resource-setup` and the copy checks in `tests/i18n/locale-keys.test.cjs`.
8. Make sure the offline translation/tafsir packs for the chosen ids exist on the pack CDN, then
   run the welcome flow on a device in the new language.
