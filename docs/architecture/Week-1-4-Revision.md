# Week 1-4 Revision: Architecture Compliance Fixes

## Status Overview

- **Week 1:** ✅ Complete (Foundation solid)
- **Week 2:** 🟡 Needs architecture compliance
- **Week 3:** ✅ Complete (Structure excellent)
- **Week 4:** 🔴 Critical gaps - 60+ components missing patterns

## Critical Issues Identified

### 🚨 **High Priority: memo() Violations**

60+ components missing `memo()` wrappers (only 8 found compliant)

### 🚨 **Medium Priority: Context Integration**

Many components not using Settings/Audio/Bookmarks contexts

### 🚨 **Medium Priority: Mobile-First Design**

Components using desktop-first instead of mobile-first responsive patterns

## Task List

### **Phase 1: Week 4 Architecture Compliance**

#### Task 1: Add memo() to Critical Components

```bash
# Fix these components first:
app/(features)/home/components/HomeHeader.tsx
app/(features)/home/components/HomePage.tsx
app/(features)/page/[pageId]/components/PageContent.tsx
app/(features)/surah/[surahId]/page.tsx
app/(features)/home/components/HomeSearch.tsx
app/(features)/home/components/VerseOfDay.tsx
```

#### Task 2: Apply Mobile-First Patterns

Replace desktop-first classes with mobile-first:

```typescript
// ❌ Wrong
<div className="flex space-x-4">

// ✅ Correct
<div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
```

#### Task 3: Add Context Integration

Add missing context hooks:

```typescript
const { settings } = useSettings();
const { currentTrack, isPlaying } = useAudio();
const { bookmarkedVerses } = useBookmarks();
```

#### Task 4: Performance Optimization

Add `useCallback` and `useMemo` where missing.

### **Phase 2: Week 2 Architecture Updates**

#### Task 5: Update Split Components

Apply architecture patterns to all components split in Week 2.

#### Task 6: Fix Export Patterns

Ensure all `index.ts` files export properly memo() wrapped components.

### **Phase 3: Validation**

#### Task 7: Run Quality Checks

```bash
npm run check  # Must pass with no warnings
```

#### Task 8: Test Architecture Compliance

Verify all components follow established patterns.

## Template Reference

Every component must follow this pattern:

```typescript
import { memo, useCallback } from 'react';
import { useSettings } from '@/app/providers/SettingsContext';

interface ComponentProps {
  // props interface
}

export const ComponentName = memo(function ComponentName(props: ComponentProps) {
  const { settings } = useSettings();

  const handleAction = useCallback(() => {
    // memoized handler
  }, []);

  return (
    <div className="space-y-4 md:space-y-0 md:flex">
      {/* mobile-first responsive content */}
    </div>
  );
});

export default ComponentName;
```

## Success Criteria

- [ ] All components have `memo()` wrapper
- [ ] All components use mobile-first responsive design
- [ ] Context integration added where needed
- [ ] Performance optimizations applied
- [ ] `npm run check` passes without warnings
- [ ] Architecture patterns consistent across codebase

## Execution Notes

Work through tasks sequentially. After each task, run `npm run check` to ensure no regressions. Focus on one component at a time to maintain quality.
