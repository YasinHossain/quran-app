App Directory Guidelines
Feature Folders
All user-facing routes live under app/(features)/*. Each folder represents a feature and should be named in lowercase.

Place non-routing, reusable modules (e.g., the player) in app/shared or another shared directory; reserve app/(features) strictly for routed features.

A page.tsx entry file is only required for features with a root page (e.g., /surah). For features that only contain dynamic routes (e.g., /surah/[slug]), this file can be omitted. A layout.tsx is optional. Use [param] syntax for dynamic segments.

Place feature-specific components in a components/ subfolder.

Tests
Feature tests reside in a __tests__/ folder inside the feature directory.

Name test files in PascalCase with a .test.tsx suffix.

Wrap tested components or pages with all required providers (e.g., ThemeProvider, SettingsProvider, SidebarProvider, BookmarkProvider) from app/providers or feature contexts.

Providers
Runtime pages receive ThemeProvider, SettingsProvider, SidebarProvider, and BookmarkProvider via ClientProviders in the root layout.

Features needing additional context must import and apply the relevant provider in their layout or tests.

Audio context is scoped to the player feature; use its AudioProvider only within app/(features)/player layouts or tests.

Avoid creating new global contexts inside feature folders; reuse providers from app/providers or existing feature contexts.

Naming & Structure
Keep component files in PascalCase and feature folder names singular and lowercase.

Use default exports only for Next.js page.tsx and layout.tsx files.

Tests should mirror component or page names (e.g., HomePage.test.tsx).