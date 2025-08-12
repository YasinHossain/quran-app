# Library guidelines

This directory contains shared utilities used across the app. Submodules include:

- **api** – wrappers around the Quran.com API and helpers for fetching chapters, verses, translations and other resources.
- **audio** – utilities for audio playback such as reciter definitions and helpers to build verse audio URLs.
- **tafsir** – helpers for tafsir content, including rendering Arabic fonts and caching fetched tafsir data.
- **text** – text processing helpers like sanitizing or stripping HTML, tajweed colouring and language mappings.

## Adding new utilities

- Choose the appropriate submodule or create a new one if necessary. Keep modules focused on a single concern.
- Export functions and types with explicit TypeScript annotations. Avoid `any` and rely on existing shared types when possible.
- Every new utility should include tests in a sibling `__tests__` folder using Jest.
- Run `npm run format` and `npm run lint` before committing, and ensure `npm run check` passes.

## Tests and typing

- Tests are required for all additions. Place them in `__tests__` with filenames ending in `.test.ts`.
- The project uses strict TypeScript settings. Maintain explicit return types and do not suppress type errors.
