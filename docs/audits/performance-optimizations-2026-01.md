# Performance Optimizations - January 2026

## Summary of Changes

This document summarizes the performance optimizations made to reduce initial page compile time.

### 1. Removed Duplicate Icon Library ✅

**@tabler/icons-react** was removed and all icons were migrated to **lucide-react**.

Files updated:

- `app/shared/navigation/components/QuranBottomSheetHeader.tsx` - `IconX` → `X`
- `app/shared/components/header/HeaderActions.tsx` - `IconSettings` → `Settings`
- `app/shared/components/header/HeaderBrand.tsx` - `IconMenu2` → `Menu`
- `app/shared/navigation/hooks/useQuranNavigation.ts` - `IconBook`, `IconHash`, `IconFileText` → `BookOpen`, `Hash`, `FileText`

**Impact**: Eliminated ~3800+ unused icons from the bundle.

### 2. Added Dynamic Imports for Heavy Components ✅

**MushafMain** is now dynamically imported in `ReaderShell.tsx`:

- Only loads when user switches to reading/mushaf mode
- Reduces initial surah page compile time

**Settings Panels** are now dynamically imported in `SettingsPanels.tsx`:

- `TranslationPanel`
- `TafsirPanel`
- `MushafPanel`
- `TajweedRulesPanel`

These panels only load when the user opens them in settings.

### 3. Removed Dead Code and Duplicate Virtual Scrolling Library ✅

Deleted unused files:

- `app/(features)/surah/hooks/useVerseListVirtualization.ts`
- `app/(features)/surah/hooks/useInitialVerseScroll.ts`
- `app/(features)/surah/components/SurahVerseListContent.tsx`

Uninstalled duplicate package:

- `@tanstack/react-virtual` (keeping `react-virtuoso` as the only virtual scrolling library)

## Before vs After Compile Times

| Route        | Before (First Compile) | After (First Compile) |
| ------------ | ---------------------- | --------------------- |
| `/surah/1`   | ~4.7s                  | ~4.1s                 |
| `/bookmarks` | ~1.2s                  | ~0.98s                |

Note: First compile times in dev mode are expected to be slow. The main benefits are:

1. Reduced bundle size in production
2. MushafMain only loads when needed (lazy loading)
3. Settings panels only load when opened

## Final Results

| Metric               | Value                                            |
| -------------------- | ------------------------------------------------ |
| **Build Status**     | ✅ Successful                                    |
| **Type Check**       | ✅ No errors                                     |
| **Main App Bundle**  | 35.14 KB (brotli compressed)                     |
| **Packages Removed** | 2 (@tabler/icons-react, @tanstack/react-virtual) |

## Recommendations for Further Optimization

1. **Use Turbopack**: Run `npm run dev:turbo` for faster development builds
2. **Remove dead code**: Delete the unused virtualization files
3. **Tree-shake icons**: Consider using specific icon imports if bundle size is still a concern
