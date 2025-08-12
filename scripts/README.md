# Scripts

This directory contains helper scripts used in development.

## fetchData.ts

Generates metadata files for every surah and juz of the Qur'an and writes them to `data/surahs.json` and `data/juz.json`.

Run from the project root:

```bash
npx ts-node scripts/fetchData.ts
```

## generateFeature.ts

Scaffolds a new feature page along with empty folders and a basic test under `app/(features)/`.

Use the provided npm script and supply the feature name in kebab-case:

```bash
npm run generate-feature <name>
```
