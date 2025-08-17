# Contributor Guidelines

## Setup

Make sure you are using Node.js 20. Run `nvm use` to load the version specified in `.nvmrc`.

Run the following commands before pushing changes:

```bash
npm install
npm run check
```

Security audits run in CI. Optionally run `npm audit --omit=dev` locally to check for vulnerabilities before pushing.

## Commit Messages

- Use a short summary in the imperative mood ("Add feature" not "Added" or "Adds").
- Prefix the summary with a type such as `feat:` or `fix:` (for example, `feat: add audio player`).
- Keep the first line under 50 characters.
- Separate the summary from any additional details with a blank line.
- Commit messages are automatically checked by Husky's `commit-msg` hook using commitlint.
- To bypass this check when necessary, set `SKIP_COMMITLINT=1` before committing.

## Code Style

- Follow the project's ESLint configuration. Run `npm run format` followed by `npm run lint` and fix warnings when possible.
- Use two spaces for indentation.
- Write clear, descriptive variable and function names.

## Design Tokens & Utilities

- Use semantic token classes instead of hardcoded colors. Prefer `text-primary`, `text-muted`, and `bg-surface` over `text-gray-*` or `bg-white`. These classes adapt to light and dark themes automatically.
- Reusable layout helpers live in `app/globals.css` under `@layer components`:
  - `.section` provides standard page padding.
  - `.card` applies surface background, padding, rounded corners, and a shadow for basic card layouts.
