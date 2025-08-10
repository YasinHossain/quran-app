# Architecture Overview

This document explains the main folders in the repository and how pages use the React contexts provided in `app/context`. It also lists steps for adding new features.

## Directory Purpose

- **`app/`** – Next.js app directory with route segments, shared components and context providers. Feature pages live under `app/features/*`.
- **`lib/`** – Utility modules and API helpers.
- **`types/`** – TypeScript type definitions shared across the project.
- **`scripts/`** – Stand-alone Node.js scripts such as `fetchData.ts` used for data preparation.
- **`__tests__/`** – Test suite powered by Jest and React Testing Library.

## Feature Pages and Contexts

Pages inside `app/features/` define user-facing routes. Many of these routes wrap their content with providers from `app/context` such as `AudioProvider` or `SettingsProvider`. The root `app/layout.tsx` applies `ThemeProvider`, `SettingsProvider` and `SidebarProvider` so any component can access theme, settings and sidebar state via the corresponding hooks.

Feature components typically reside in a `components` subfolder. They import hooks like `useSettings`, `useAudio` or `useSidebar` to read and update context values.

## Adding a New Feature

1. Create a folder under `app/features/` for the route. Add `page.tsx` and optionally `layout.tsx` inside it. Use `[param]` syntax for dynamic segments.
2. Place any feature specific components in a `components` directory within that folder.
3. Add new utilities to `lib/` and shared types to `types/` when appropriate.
4. Write tests in `__tests__/` mirroring the feature name. Wrap tested components with any required providers from `app/context`.

You can also run `npm run generate-feature <name>` to scaffold a feature folder and matching test automatically.

Following this structure keeps the application organized and ensures new pages work smoothly with the existing contexts.
