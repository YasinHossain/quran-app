# AI Development Context (Lean)

## Core Patterns

**Components:** Always use `memo()`, responsive classes `space-y-4 md:space-y-0 md:flex`, proper TypeScript interfaces

**Hooks:** Use `useCallback`/`useMemo` for performance, proper cleanup with `useEffect`

**Tests:** Wrap with `SettingsProvider` > `AudioProvider` > `BookmarkProvider`

## Quality Commands

```bash
npm run check  # Format, lint, typecheck, test (AI runs this automatically)
```

## File Structure

- `app/(features)/` - Next.js routes
- `src/domain/` - Business logic
- `app/shared/` - Reusable UI
- `lib/` - Utilities

## Common Violations to Avoid

- Missing `memo()` wrapper
- Hardcoded breakpoints instead of responsive classes
- Missing context providers in tests
- No TypeScript interfaces

## Component Template

```typescript
export const Component = memo(function Component({ id }: { id: string }) {
  const { settings } = useSettings();

  const data = useMemo(() => processData(settings), [settings]);
  const handleClick = useCallback(() => {}, []);

  return (
    <div className="space-y-4 md:space-y-0 md:flex">
      <button className="h-11 px-4" onClick={handleClick}>
        Action
      </button>
    </div>
  );
});
```

Keep it simple.
