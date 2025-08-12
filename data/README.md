# Quran metadata

This directory stores static Quranic metadata used by the app.

- `surahs.json` lists every surah with its number, Arabic and English names, verse count and meaning.
- `juz.json` defines the 30 juz divisions and the surah/ayah ranges they cover.

## Regenerating data

Run `npx ts-node scripts/fetchData.ts` to rebuild both files. The script gathers metadata from the `quran-meta` package and writes updated `surahs.json` and `juz.json` files.

## Tests

Consistency checks for this data live in `data/__tests__`. Execute `npm test` to run them.
