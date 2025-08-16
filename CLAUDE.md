# Quran App v1 - AI Development Context

## Project Overview

A modern Quran reading application built with Next.js 15, featuring audio playback, translations, tafsir (commentary), bookmarks, and progressive web app capabilities.

**Tech Stack:**

- Next.js 15 with App Router
- TypeScript (strict mode)
- Tailwind CSS
- React 19
- SWR for data fetching
- Jest + React Testing Library
- PWA with next-pwa

## Architecture

- **Feature-based structure** under `app/(features)/`
- **Shared utilities** in `lib/` with API wrappers, audio, tafsir, and text processing
- **Type definitions** centralized in `types/`
- **Context providers** in `app/providers/` for global state
- **Comprehensive testing** with `__tests__/` folders throughout

## Development Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build           # Production build
npm run start           # Start production server

# Code Quality
npm run check           # Run all checks (format, lint, typecheck, test)
npm run format          # Format with Prettier
npm run lint            # ESLint
npm run type-check      # TypeScript check
npm run test            # Jest tests
npm run test:coverage   # Test with coverage

# Feature Generation
npm run generate-feature <name>  # Scaffold new feature
```

## Key Features & Areas

1. **Audio Player** (`app/shared/player/`) - Quran recitation with repeat modes
2. **Surah Reading** (`app/(features)/surah/`) - Main reading interface with settings
3. **Tafsir** (`app/(features)/tafsir/`) - Commentary viewing with persistent selections
4. **Search** (`app/(features)/search/`) - Verse search functionality
5. **Bookmarks** (`app/(features)/bookmarks/`) - Saved verses
6. **Navigation** - Juz, Page, and Surah-based browsing

## Data Sources

- **Quran.com API** for verses, translations, and tafsir
- **Local JSON data** for chapters and juz metadata (`data/`)
- **Audio files** from various reciters

## Testing Strategy

- **Unit tests** for utilities and hooks
- **Component tests** with React Testing Library
- **Provider wrapping** required for context-dependent components
- **Coverage tracking** with Jest

## Common Patterns

- **Custom hooks** for feature logic (e.g., `useVerseListing`, `useAudioPlayer`)
- **Context + reducer** pattern for complex state
- **Resource panels** for translations/tafsir selection
- **Responsive design** with mobile-first approach

## Development Notes

- Use `AGENTS.md` files for area-specific guidelines
- Follow feature folder structure with `components/`, `hooks/`, `__tests__/`
- Maintain TypeScript strict mode compliance
- Run `npm run check` before commits
- Use conventional commit messages with `feat:`, `fix:` prefixes

## Recent Updates

- **Tafsir System**: Enhanced with persistent selections, improved UI, and multiple tafsir support
- **Settings Management**: Streamlined panels with better state management and storage
- **UI/UX**: Reduced overlapping sliders and improved panel positioning
