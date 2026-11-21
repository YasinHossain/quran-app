# Repository Guidelines

## Project Structure & Module Organization

- Source: Next.js App Router in `app/` (pages, layouts, components). Shared utilities in `lib/`, types in `types/`, assets in `public/`, data in `data/`.
- Core layers: Clean Architecture modules in `src/` — `domain/`, `application/`, `infrastructure/`, and `presentation/`.
- Tests: Unit/integration tests in `tests/` (Jest + Testing Library).
- Configuration: `next.config.ts`, `tailwind.config.mjs`, `eslint.config.mjs`, `tsconfig.json`.
- Tooling: Scripts in `scripts/`, Storybook in `.storybook/`.

## Build, Test, and Development Commands

- `npm run dev`: Start the app locally with Turbopack.
- `npm run build` / `npm start`: Production build and serve.
- `npm run test` | `test:watch` | `test:coverage`: Run Jest tests.
- `npm run lint` | `lint:fix`: ESLint check/fix.
- `npm run format`: Prettier write.
- `npm run type-check`: TypeScript validation.
- `npm run check`: CI-style suite (format, lint, type-check, tests).
- `npm run storybook`: Run component explorer at http://localhost:6006.

## Coding Style & Naming Conventions

- Language: TypeScript with two-space indentation.
- Lint/Format: ESLint + Prettier (use project configs).
- Components: PascalCase file/folder names (e.g., `PlayerControls.tsx`).
- Design: you have full creative freedom over visual design. Existing screens and older docs are not templates; build modern, considered pages, and redesign or add components and tokens when it improves the result. Keep light/dark themes, accessibility, RTL and Quran-text rules intact. See `docs/architecture/DESIGN_SYSTEM.md`.
- Styling mechanics: theme variables in `app/globals.css` (`bg-surface`, `text-accent/60`, …). Raw palette classes and theme conditionals fail lint because they ignore the theme. See `docs/development/STYLING.md`.

## Testing Guidelines

- Framework: Jest with `jest-environment-jsdom` and Testing Library.
- Location/Names: Place tests in `tests/` or co-locate as `Component.test.tsx`.
- Expectations: Prefer user-focused queries and avoid testing implementation details.
- Commands: `npm run test` locally; `npm run test:ci` in pipelines.

## Commit & Pull Request Guidelines

- Commits: Conventional style (e.g., `feat: add audio player`). Keep subject under 50 chars; imperative mood. Separate body with a blank line. To bypass commit linting in rare cases: `SKIP_COMMITLINT=1`.
- PRs: Provide a clear description, link issues (`Closes #123`), include screenshots for UI, and note any breaking changes. Run `npm run check` before opening.

## Security & Configuration Tips

- Runtime: Node.js 20 (`nvm use`). Example env: copy `.env.example` to `.env`.
- Audits: CI runs security checks; optionally run `npm audit --omit=dev` locally.
