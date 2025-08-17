# Quran metadata

This directory stores static Quranic metadata used by the app.

- `juz.json` defines the 30 juz divisions and the surah/ayah ranges they cover.

Surah information is fetched from the Quran.com API at runtime and is no longer bundled with the app.

## Regenerating data

Run `npx ts-node scripts/fetchData.ts` to rebuild `juz.json`. The script gathers metadata from the `quran-meta` package and writes the updated file.

## Tests

Consistency checks for this data live in `data/__tests__`. Execute `npm test` to run them.
