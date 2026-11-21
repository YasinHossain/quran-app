# Quran metadata

This directory stores static Quranic metadata used by the app.

- `juz.json` defines the 30 juz divisions and the surah/ayah ranges they cover.
- `verse-word-counts.json` holds the number of words in every verse (one array per surah, index 0 = surah 1). It was taken on 2026-11-21 from Quran.com's word-by-word data (`verses/by_chapter/{s}?words=true`), counting words whose `char_type_name` is `word`, so verse-end markers and pause signs are not counted. The total is 77,430. Splitting the Uthmani text on spaces gives different counts for 8:6, 13:37 and 37:130, so always use this file. The surah overview pages use it.

Surah information is fetched from the Quran.com API at runtime and is no longer bundled with the app.

## Regenerating data

Run `npx ts-node scripts/fetchData.ts` to rebuild `juz.json`. The script gathers metadata from the `quran-meta` package and writes the updated file.

## Tests

Consistency checks for this data live in `data/__tests__`. Execute `npm test` to run them.
