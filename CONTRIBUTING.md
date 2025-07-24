# Contributing

Thank you for your interest in contributing to this project!

## Setup

Copy `.env.example` to `.env` and adjust the values if necessary. The default configuration includes the Quran API base URL.

## Running the Development Server

Start the development server with:

```bash
npm run dev
```

You can also use `yarn dev`, `pnpm dev`, or `bun dev`.

## Regenerating Data

Run the following script to download the latest surah and juz metadata:

```bash
npx ts-node scripts/fetchData.ts
```

This updates `data/surahs.json` and `data/juz.json`.

## Formatting and Linting

Before committing, format and lint the code:

```bash
npm run format
npm run lint
```

## Testing

Execute the test suite with:

```bash
npm test
```

## Continuous Integration

GitHub Actions run linting and tests automatically for every push and pull request. See [.github/workflows/ci.yml](.github/workflows/ci.yml) for details.
