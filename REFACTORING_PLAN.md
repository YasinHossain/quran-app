# Refactoring Plan - ESLint Complexity Violations

## Overview
152 complexity violations found across ~100 files. Focus on breaking large components into smaller, more maintainable pieces.

## Priority Files (Immediate Action Needed)

### 🔴 Critical - Extremely Complex
1. **`app/shared/ui/BaseCard.tsx`** - 97-line function, complexity 26, 268 lines
2. **`app/shared/navigation/QuranBottomSheet.tsx`** - 249-line function, 269 lines  
3. **`app/shared/player/QuranAudioPlayer.tsx`** - 213-line function, complexity 17, 241 lines
4. **`app/providers/bookmarks/BookmarkProvider.tsx`** - 204-line function, 233 lines
5. **`app/shared/components/AdaptiveNavigation.tsx`** - Multiple 50+ line functions, 220 lines

### 🟡 High Priority  
- `app/(features)/bookmarks/components/FolderSettingsModal.tsx`
- `app/shared/verse-actions/MobileBottomSheet.tsx`
- `app/shared/ui/SettingsPanel.tsx`
- `app/shared/bookmark-modal/BookmarkModal.tsx`

## Areas Most Affected
- **Bookmarks feature** - 25+ files
- **Shared UI components** - 20+ files  
- **Audio player system** - 10+ files
- **Surah/Tafsir features** - 15+ files
- **Navigation components** - 8+ files

## ESLint Rules (Keep These)
- `max-lines-per-function: 50` ✅
- `complexity: 10` ✅  
- `max-lines: 150-200` ✅
- `max-params: 4` ✅
- `max-depth: 3` ✅

## Action Plan
1. Start with top 5 critical files
2. Break large functions into smaller components/hooks
3. Extract complex logic into custom hooks
4. Use composition over large monolithic components
5. Run `npm run lint` after each refactor to track progress

## Commands
```bash
# Check specific file
npx eslint "path/to/file.tsx" --no-fix

# Check progress  
npm run lint

# Run all checks
npm run check
```