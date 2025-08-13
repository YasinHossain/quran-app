# App Directory Guidelines

## Feature Folders

- All user-facing routes live under `app/(features)/*`. Each folder represents a feature and should be named in lowercase.
- Place non-routing, reusable modules (e.g., the player) in `app/shared` or another shared directory; reserve `app/(features)` strictly for routed features.
- Every feature folder must include a `page.tsx` entry file and may include a `layout.tsx`. Use `[param]` syntax for dynamic segments.
- Place feature-specific components in a `components/` subfolder.

## Tests

- Feature tests reside in a `__tests__/` folder inside the feature directory.
- Name test files in PascalCase with a `.test.tsx` suffix.
- Wrap tested components or pages with all required providers (e.g., `ThemeProvider`, `SettingsProvider`, `SidebarProvider`, `AudioProvider`) from `app/providers` or feature contexts.

## Providers

- Runtime pages receive `ThemeProvider`, `SettingsProvider`, and `SidebarProvider` via `ClientProviders` in the root layout.
- Features needing additional context must import and apply the relevant provider in their layout or tests.
- Avoid creating new global contexts inside feature folders; reuse providers from `app/providers` or existing feature contexts.

## Naming & Structure

- Keep component files in PascalCase and feature folder names singular and lowercase.
- Use default exports only for Next.js `page.tsx` and `layout.tsx` files.
- Tests should mirror component or page names (e.g., `HomePage.test.tsx`).
