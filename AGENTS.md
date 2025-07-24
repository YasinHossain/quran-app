# Contributor Guidelines

## Setup

Make sure you are using Node.js 20. Run `nvm use` to load the version specified in `.nvmrc`.

Run the following commands before pushing changes:

```bash
npm install
npm audit --omit=dev
npm run check
```

## Commit Messages

- Use a short summary in the imperative mood ("Add feature" not "Added" or "Adds").
- Keep the first line under 50 characters.
- Separate the summary from any additional details with a blank line.

## Code Style

- Follow the project's ESLint configuration. Run `npm run format` followed by `npm run lint` and fix warnings when possible.
- Use two spaces for indentation.
- Write clear, descriptive variable and function names.
