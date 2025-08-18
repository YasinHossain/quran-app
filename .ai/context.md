# AI Development Context - Quran App

## Project Overview

A modern Quran reading application built with Next.js 15, featuring audio playback, translations, tafsir, bookmarks, and PWA capabilities.

## AI Assistant Guidelines

### Core Principles
1. **Semantic-First**: Always use semantic design tokens over raw colors
2. **Component Reuse**: Leverage existing UI components before creating new ones
3. **Type Safety**: Maintain strict TypeScript compliance
4. **Testing**: Write tests for new features and components
5. **Performance**: Consider accessibility and performance in all implementations

### Key Architecture Patterns

#### Feature Structure
```
app/(features)/[feature-name]/
├── components/          # Feature-specific components
├── hooks/              # Custom hooks for logic
├── __tests__/          # Test files
├── page.tsx            # Route entry point
└── layout.tsx          # Optional layout
```

#### State Management
- **UI State**: Use `useUIState()` for panels, modals, sidebars
- **Settings**: Use `useSettings()` for app configuration
- **Local State**: Use `useState()` for component-specific state

#### Styling System
- **Colors**: `bg-surface`, `text-foreground`, `bg-accent`, `border-border`
- **Components**: `Button`, `Panel`, `TabToggle` from `@/app/shared/ui`
- **Extensions**: Use `className` override or design system extensions

### Common Implementation Patterns

#### Adding a New Feature Panel
```typescript
const { openPanel, closePanel, isPanelOpen } = useUIState();

<Panel
  isOpen={isPanelOpen('feature-name')}
  onClose={() => closePanel('feature-name')}
  title="Feature Name"
  variant="sidebar"
>
  {/* Panel content */}
</Panel>
```

#### Creating Themed Components
```typescript
// Use semantic tokens
<div className="bg-surface text-foreground border border-border">

// Extend with custom styling
<Button 
  variant="primary" 
  className="bg-gradient-to-r from-blue-500 to-purple-600"
>
```

### Development Workflow

1. **Before Coding**: Check existing components and patterns
2. **Implementation**: Follow feature folder structure
3. **Testing**: Add tests in `__tests__/` folders
4. **Quality**: Run `npm run check` before committing
5. **Documentation**: Update relevant AGENTS.md files

### AI-Specific Instructions

- **File Reading**: Always read existing similar components first
- **Component Discovery**: Check `app/shared/ui/` for reusable components
- **Pattern Matching**: Look for existing patterns in similar features
- **Context Awareness**: Use providers from `app/providers/`
- **Testing**: Wrap components with required providers in tests

### Restrictions

❌ **Avoid**:
- Theme conditionals in JSX (`theme === 'dark' ? ... : ...`)
- Hardcoded colors (`#1a202c`, `rgb(26, 32, 44)`)
- Raw utility classes (`bg-gray-100`, `text-slate-800`)
- Creating new global contexts in feature folders

✅ **Prefer**:
- Semantic tokens (`bg-surface`, `text-muted`)
- Component variants (`<Button variant="primary">`)
- Existing UI components
- Feature-scoped custom hooks

### Quick Reference

#### Essential Imports
```typescript
// UI Components
import { Button, Panel, TabToggle } from '@/app/shared/ui';

// State Management
import { useUIState } from '@/app/providers/UIStateContext';
import { useSettings } from '@/app/providers/SettingsContext';

// Testing
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';
```

#### File Locations
- **UI Components**: `app/shared/ui/`
- **Feature Components**: `app/(features)/[feature]/components/`
- **Global Providers**: `app/providers/`
- **Types**: `types/`
- **API Utils**: `lib/api/`
- **Tests**: `__tests__/` folders throughout

This context ensures consistent, maintainable, and AI-friendly development patterns.