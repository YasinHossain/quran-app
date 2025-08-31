# Tests Directory Guidelines

- **Framework**: Use Jest with Testing Library for all unit and integration tests.
- **Provider Wrappers**: Wrap components using `renderWithProviders` from `app/testUtils/renderWithProviders`, which applies `ThemeProvider`, `SettingsProvider`, `SidebarProvider`, `BookmarkProvider`, `AudioProvider`, and an `SWRConfig` with an isolated cache.
- **File Naming**: Name test files in PascalCase following the pattern `ComponentName.test.tsx`.
- **Commands**: Run `npm run test` before committing to verify all tests pass.

