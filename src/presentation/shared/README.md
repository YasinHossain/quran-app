# Shared Components

This directory houses reusable modules that power navigation, playback, and verse utilities throughout the app.

## Navigation

- **`Header.tsx`** – fixed top bar with a search field, settings toggle, and Surah list opener. Uses icons from `app/shared/icons` and responds to theme changes.
- **`IconSidebar.tsx`** – vertical sidebar that links to Home, the first Surah, and bookmarks using minimal icon buttons.
- **`SurahListSidebar.tsx`** – tabbed sidebar for browsing Surahs, Juz, or pages. Includes a search input (currently `SidebarSearch`; replace with shared `SearchInput` when available) and remembers scroll positions via sidebar context.

## Player Modules (`player/`)

Reusable audio player subsystem:

- `QuranAudioPlayer.tsx` – main player UI with timeline, transport controls, playback speed, reciter selection, and repeat options.
- `context/` – `AudioContext` manages playback state, visibility, and active verse tracking.
- `hooks/` – utilities like `useAudioPlayer`, keyboard shortcuts, and playback completion logic.
- `components/` – presentation pieces such as `TrackInfo`, `TransportControls`, and `Timeline`.

## Verse Utilities

- **`VerseArabic.tsx`** – renders Arabic verse text with proper typography.
- **`VerseActions.tsx`** – provides copy, share, and bookmark controls for a verse.
- **`Spinner.tsx`** – simple loading indicator used across features.

## Contributing

Follow the guidelines in [`AGENTS.md`](../../AGENTS.md): use Node 20, run `npm install`, then `npm run format`, `npm run lint`, and `npm run check` before committing.
