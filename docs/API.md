# API Helpers

This document lists the main helpers in `lib/api/` and outlines how Quran.com API data flows into the UI.

## HTTP Client

- `apiFetch(path, params, errorPrefix)` – wraps `fetch` against the base URL `https://api.quran.com/api/v4`.

## Functions and Endpoints

| Function                                      | Endpoint                                                         | Description                              |
| --------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------- |
| `getChapters()`                               | `/chapters?language=en`                                          | Fetch list of chapters.                  |
| `getSurahCoverUrl(surahNumber)`               | `https://api.wikimedia.org/core/v1/commons/file/File:{filename}` | Fetch Surah cover image from Wikimedia.  |
| `getTranslations()`                           | `/resources/translations`                                        | List available translations.             |
| `getWordTranslations()`                       | `/resources/translations?resource_type=word_by_word`             | List word-by-word translation resources. |
| `getVersesByChapter({ id, ... })`             | `/verses/by_chapter/:id`                                         | Fetch verses for a chapter.              |
| `getVersesByJuz({ id, ... })`                 | `/verses/by_juz/:id`                                             | Fetch verses for a juz.                  |
| `getVersesByPage({ id, ... })`                | `/verses/by_page/:id`                                            | Fetch verses for a page.                 |
| `searchVerses(query)`                         | `/search`                                                        | Search verses.                           |
| `getJuz(id)`                                  | `/juzs/:id`                                                      | Fetch metadata for a juz.                |
| `getRandomVerse(translationId)`               | `/verses/random`                                                 | Retrieve a random verse.                 |
| `getVerseById(id, translationIds, wordLang?)` | `/verses/:id`                                                    | Fetch a single verse with full payload.  |
| `getTafsirResources()`                        | `/resources/tafsirs`                                             | List tafsir resources.                   |

## Data Flow from API to UI

### Chapters

`SurahListSidebar` uses SWR to load chapters via `getChapters`. The sidebar relies on `SidebarContext` for selection and scroll state and renders Surah, Juz, or page lists from the fetched data.

### Verses

`useVerseListing` accepts a lookup function such as `getVersesByChapter` or `getVersesByJuz` and uses `useSWRInfinite` for paginated loading. It consults `SettingsContext` for translation and word language preferences and `AudioContext` to manage the active verse for playback. Pages like `app/(features)/surah/[surahId]/page.tsx` invoke this hook to render verses in the UI.
