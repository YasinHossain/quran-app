# Quran App Architecture Summary

## Current Status
- Next.js app with audio player, tafsir, bookmarks
- Clean architecture implemented (domain/application/infrastructure layers)
- Mobile-first responsive design
- PWA capabilities

## Quality Commands
```bash
npm run check  # Run all quality checks
npm run dev    # Development server
npm run build  # Production build
```

## Key Patterns
- Components: `memo()` wrapper, responsive classes, TypeScript interfaces
- Hooks: `useCallback`/`useMemo` optimization
- Tests: Provider wrapper pattern
- Architecture: Domain-driven design in `src/`

## File Structure
- `app/(features)/` - Next.js App Router features
- `src/domain/` - Business logic entities and services
- `app/shared/` - Reusable UI components
- `lib/` - Utility functions