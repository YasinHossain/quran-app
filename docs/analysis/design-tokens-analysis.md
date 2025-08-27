# Card Component Design Token Analysis

## Current Card Components Analysis

### 1. SidebarCard (Navigation Base)

**Location**: `app/shared/ui/SidebarCard.tsx`

**Design Tokens Extracted:**

- **Dimensions**: `h-[80px]` (fixed height)
- **Spacing**: `p-4 gap-4` (padding and gap)
- **Border Radius**: `rounded-xl`
- **Background States**:
  - Active: `bg-accent text-on-accent shadow-lg shadow-accent/30`
  - Inactive: `bg-surface text-foreground shadow`
- **Hover Effects**: `hover:scale-[1.02]`
- **Transitions**: `transition transform`
- **Layout**: `flex items-center`

### 2. Surah Component Cards

**Location**: `app/shared/surah-sidebar/Surah.tsx`

**Design Tokens Extracted:**

- **Layout**: Complex 3-part layout (NumberBadge + content div + Arabic text)
- **Content Container**: `flex-grow min-w-0`
- **Typography**:
  - Primary: `font-bold` (Surah name)
  - Secondary: `text-xs` (details)
  - Arabic: `font-amiri text-xl font-bold`
- **Color Variations**:
  - Active: `text-on-accent`, `text-on-accent/80`
  - Inactive: `text-foreground`, `text-muted`
  - Hover: `group-hover:text-accent`
- **Spacing**: `ml-2` (list margin), `space-y-2` (list spacing)

### 3. Juz Component Cards

**Location**: `app/shared/surah-sidebar/Juz.tsx`

**Design Tokens Extracted:**

- **Layout**: 2-part layout (NumberBadge + content div)
- **Content Container**: Plain `div` (no flex properties)
- **Typography**:
  - Primary: `font-semibold` (different from Surah)
  - Secondary: `text-xs`
- **Color Variations**:
  - Active: `text-on-accent`, `text-on-accent/90`
  - Inactive: `text-foreground`, `text-muted`
- **Spacing**: Same as Surah (`ml-2`, `space-y-2`)

### 4. Page Component Cards

**Location**: `app/shared/surah-sidebar/Page.tsx`

**Design Tokens Extracted:**

- **Layout**: Simplest layout (NumberBadge + single text)
- **Content Container**: No wrapper div
- **Typography**:
  - Primary: `font-semibold` (matches Juz)
  - No secondary text
- **Color Variations**: Same pattern as Juz
- **Spacing**: Same as others (`ml-2`, `space-y-2`)

### 5. FolderCard (Bookmark Folders)

**Location**: `app/(features)/bookmarks/components/FolderCard.tsx`

**Design Tokens Extracted:**

- **Dimensions**: `p-6` (larger padding than navigation)
- **Border Radius**: `rounded-xl` (consistent)
- **Background**: `bg-surface border border-border`
- **Animations**:
  - Framer Motion: `scale: 0.95 → 1`
  - Spring: `stiffness: 400, damping: 25`
- **Hover Effects**:
  - `hover:shadow-lg hover:border-accent/20`
  - `hover:-translate-y-1` (different from navigation scale)
- **Complex Layout**: Icon container + content + context menu + progress bar + metadata
- **Icon Container**: `p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5`
- **Typography**:
  - Title: `font-bold text-lg`
  - Subtitle: `text-sm text-muted font-medium`
  - Metadata: `text-xs text-muted`

### 6. BookmarkCard (Individual Bookmarks)

**Location**: `app/(features)/bookmarks/components/BookmarkCard.tsx`

**Design Tokens Extracted:**

- **Dimensions**: `p-5 mb-4` (different padding)
- **Border Radius**: `rounded-xl` (consistent)
- **Background**: `bg-surface border border-border`
- **Animations**: Framer Motion `y: 20 → 0`
- **Hover Effects**:
  - `hover:border-accent/30 hover:bg-surface-hover`
  - `hover:shadow-md hover:-translate-y-0.5`
- **Complex Layout**: Header + verse preview (Arabic + translation)
- **Typography**:
  - Verse ref: `text-accent font-semibold text-sm`
  - Surah name: `text-muted text-sm`
  - Timestamp: `text-xs text-muted`
  - Arabic: Dynamic font size, `text-lg`
  - Translation: `text-sm text-muted`

## Design Inconsistencies Found

### Spacing Variations

- Navigation cards: `p-4`
- Folder cards: `p-6`
- Bookmark cards: `p-5`

### Typography Inconsistencies

- Surah: `font-bold` vs Juz/Page: `font-semibold`
- Various text sizes and weights not standardized

### Hover Effects Variations

- Navigation: `hover:scale-[1.02]`
- Folders: `hover:-translate-y-1`
- Bookmarks: `hover:-translate-y-0.5`

### Layout Structure Differences

- Surah: 3-part complex layout
- Juz: 2-part layout
- Page: Simple layout
- Folders: Multi-section layout
- Bookmarks: Content-heavy layout

### Animation Systems

- Navigation: CSS transitions
- Folders: Framer Motion with springs
- Bookmarks: Framer Motion with linear

## Standardization Opportunities

1. **Unified Spacing System**: Consistent padding and gaps
2. **Standardized Typography Scale**: Consistent font weights and sizes
3. **Unified Hover System**: Choose one hover effect pattern
4. **Layout Framework**: Flexible system supporting all current layouts
5. **Animation Consistency**: Single animation system choice
6. **Color Token Unification**: Consistent active/inactive/hover states
