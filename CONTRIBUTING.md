# Contributing

Thank you for your interest in contributing to this project!

## Setup

Copy `.env.example` to `.env` and adjust the values if necessary. The default configuration includes the Quran API base URL.

An `.nvmrc` file pins Node.js to version **20**. Run `nvm use` to match this version before contributing.

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

Example:

```text
feat: add audio player
```
