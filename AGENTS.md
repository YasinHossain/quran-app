# Repository Guidelines

## Project Structure & Module Organization

- Source: Next.js App Router in `app/` (layouts, pages, components). Shared utilities in `lib/`, types in `types/`, static assets in `public/`, app data in `data/`.
- Config: `next.config.ts`, `tailwind.config.mjs`, `eslint.config.mjs`, `tsconfig.json`.
- Tooling: Scripts in `scripts/`, Storybook in `.storybook/`, custom Rollup plugin in `packages/rollup-plugin-terser/`.
- Tests: Unit/integration under `tests/` (or co-located `*.test.tsx`).

## Build, Test, and Development Commands

- Dev: `npm run dev` — start the app locally with Turbopack.
- Build/Serve: `npm run build` then `npm start` — production build and serve.
- Tests: `npm run test`, `npm run test:watch`, `npm run test:coverage`.
- Lint/Format: `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`.
- Types/CI: `npm run type-check`, `npm run check` (format, lint, types, tests).
- Storybook: `npm run storybook` — component explorer at `http://localhost:6006`.

## Coding Style & Naming Conventions

- Language: TypeScript with two-space indentation.
- Lint/Format: ESLint + Prettier using project configs.
- Components: PascalCase files/folders (e.g., `PlayerControls.tsx`).
- Styling: Use semantic tokens (e.g., `text-primary`, `bg-surface`, `border-border`). Avoid raw Tailwind color utilities and `dark:` classes; don’t use `useTheme` for colors. See `SEMANTIC_TOKENS.md` and `STYLING.md`.

## Testing Guidelines

- Frameworks: Jest (`jest-environment-jsdom`) + Testing Library.
- Location/Names: Place tests in `tests/` or co-locate as `Component.test.tsx`.
- Expectations: Prefer user-focused queries; avoid testing implementation details.
- Commands: Run `npm run test` locally; use `npm run test:ci` in pipelines when applicable.

## Commit & Pull Request Guidelines

- Commits: Conventional style; subject ≤ 50 chars, imperative mood. Example: `feat: add audio player`. To bypass lint in rare cases: `SKIP_COMMITLINT=1`.
- PRs: Provide a clear description, link issues (e.g., `Closes #123`), include UI screenshots, and note any breaking changes. Run `npm run check` before opening.

## Security & Configuration Tips

- Runtime: Node.js 20 (`nvm use`).
- Env: Copy `.env.example` to `.env` for local development.
- Audits: Optionally run `npm audit --omit=dev` locally.

