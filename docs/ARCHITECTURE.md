# Architecture Overview

This document explains the main folders in the repository and how pages use the React contexts provided in `app/providers`. It also lists steps for adding new features.

## Directory Purpose

- **`app/`** – Next.js app directory with route segments, shared components and context providers. Feature pages live under `app/(features)/*`.
- **`lib/`** – Utility modules and API helpers.
- **`types/`** – TypeScript type definitions shared across the project.
- **`scripts/`** – Stand-alone Node.js scripts such as `fetchData.ts` used for data preparation.
- **Tests** – Jest and React Testing Library suites live in `__tests__` folders next to their code (for example, `app/__tests__`, `app/(features)/*/__tests__`, `data/__tests__` and `lib/*/__tests__`).

## Feature Pages and Contexts

Pages inside `app/(features)/` define user-facing routes. Many of these routes wrap their content with providers from `app/providers` such as `BookmarkProvider`, `TranslationProvider`, or `SettingsProvider`. Audio-related context lives under `app/(features)/player` rather than in `app/providers`. The root `app/layout.tsx` applies `TranslationProvider` and `ClientProviders` (which sets up `ThemeProvider`, `SettingsProvider`, `SidebarProvider`, and `BookmarkProvider`) so any component can access translation, theme, settings, sidebar, and bookmark state via the corresponding hooks.

Feature components typically reside in a `components` subfolder. They import hooks like `useSettings`, `useAudio` or `useSidebar` to read and update context values.

## Adding a New Feature

1. Create a folder under `app/(features)/` for the route. Add `page.tsx` and optionally `layout.tsx` inside it. Use `[param]` syntax for dynamic segments.
2. Place any feature specific components in a `components` directory within that folder.
3. Add new utilities to `lib/` and shared types to `types/` when appropriate.
4. Write tests in the relevant `__tests__` folder mirroring the feature name (for example, `app/(features)/<feature>/__tests__/`). Wrap tested components with any required providers from `app/providers`.

You can also run `npm run generate-feature <name>` to scaffold a feature folder and matching test automatically.

Following this structure keeps the application organized and ensures new pages work smoothly with the existing contexts.
