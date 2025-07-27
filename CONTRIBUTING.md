# Contributing

Thank you for your interest in contributing to this project!

## Setup

Copy `.env.example` to `.env` and adjust the values if necessary. The default configuration includes the Quran API base URL.

An `.nvmrc` file pins Node.js to version **20**. Run `nvm use` to match this version before contributing.

For a directory overview see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

This project also provides an `.editorconfig` file. Ensure your editor respects
it so that files use UTF-8 encoding, two spaces for indentation, and always end
with a newline.

Install dependencies and initialize Git hooks with:

```bash
npm install
npx husky install
```

## Commit Message Style

This project uses Conventional Commits. Messages are linted automatically by the `commit-msg` hook using commitlint.
The summary line must not exceed **50** characters.

Example:

```text
feat: add audio player
```

Before submitting a pull request, run `npm run check` to lint, type-check and
test your changes. See [AGENTS.md](AGENTS.md) for the full workflow.

## Feature Scaffolding

Use the generator to create a new feature folder with a page component and test:

```bash
npm run generate-feature my-feature
```

This produces `app/features/my-feature/page.tsx` and
`__tests__/MyFeaturePage.test.tsx` ready for further development.
