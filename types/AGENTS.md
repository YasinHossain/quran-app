# Types Guidelines

## Naming

- Use PascalCase for interfaces and type aliases.
- Use singular, kebab-case file names matching the type (e.g., `verse.ts` for `Verse`).

## Exports

- Declare each interface or type in its own file within this directory.
- Export it from the file using named exports.
- Re-export all public types through `types/index.ts` so they can be imported from a single entry point.

## Documentation

- Add TSDoc comments (`/** ... */`) for every public type or interface.
