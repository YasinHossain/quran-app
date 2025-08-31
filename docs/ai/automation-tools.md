# AI Automation Tools

AI scripts live in `tools/ai` and help keep documentation and tests in sync with the codebase.

## doc-updater

- **Purpose:** Automatically updates documentation when code changes are detected to keep docs consistent with the latest code.
- **When to use:** Run after making code changes that should be reflected in docs, especially before committing.
- **Sample invocation:**
  ```bash
  node tools/ai/doc-updater.js
  ```

## pre-commit-ai-check

- **Purpose:** Analyzes staged changes and reports issues or suggestions before a commit is created.
- **When to use:** Run before committing to catch problems early or integrate as a git pre-commit hook.
- **Sample invocation:**
  ```bash
  node tools/ai/pre-commit-ai-check.js
  ```

## test-generator

- **Purpose:** Creates test file templates based on a target file's type and location.
- **When to use:** Run after adding new entities, services, components, hooks, or other supported files to scaffold matching tests.
- **Sample invocation:**
  ```bash
  node tools/ai/test-generator.js path/to/file.ts
  # Example
  node tools/ai/test-generator.js src/domain/entities/Verse.ts
  ```
