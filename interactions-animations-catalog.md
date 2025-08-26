# Card Components Interaction & Animation Catalog

## Interaction Patterns Analysis

### 1. SidebarCard (Navigation Base)

**File**: `app/shared/ui/SidebarCard.tsx`

**Interactions**:

- **Click Handler**: `onClick` prop for navigation
- **Link Navigation**: Next.js `Link` with `href` prop
- **Scroll Control**: `scroll` prop (default: false)
- **Data Attributes**: `data-active` for styling hooks

**States**:

- **Active State**: `isActive` prop controls styling
- **Hover State**: Group hover effects via CSS

**Animations**:

- **Hover**: `hover:scale-[1.02]` (2% scale increase)
- **Transitions**: `transition transform` (CSS transitions)

**Accessibility**:

- Standard link accessibility via Next.js Link
- `aria-label` inherited from Link

### 2. Surah Component Cards

**File**: `app/shared/surah-sidebar/Surah.tsx`

**Interactions**:

- **Multi-State Updates**: onClick updates selectedSurahId, selectedPageId, selectedJuzId
- **Scroll Memory**: `rememberScroll()` call on navigation
- **Path Variants**: Different URLs for tafsir vs surah paths
- **Complex Navigation Logic**: Calculate page and juz from chapter data

**States**:

- **Active Detection**: `String(chapter.id) === selectedSurahId`
- **Color Transitions**: Text color changes on active/inactive states
- **Hover Effects**: Arabic text color change `group-hover:text-accent`

**Animations**:

- **Text Transitions**: `transition-colors` on multiple text elements
- **Inherited**: Scale hover from SidebarCard

**Accessibility**:

- List structure with `ul` and `li`
- Semantic navigation structure

### 3. Juz Component Cards

**File**: `app/shared/surah-sidebar/Juz.tsx`

**Interactions**:

- **Similar Multi-State**: Updates juzId, pageId, surahId
- **Page Calculation**: Uses `JUZ_START_PAGES` lookup
- **Surah Resolution**: `getSurahByPage(page, chapters)` logic

**States**:

- **Active Detection**: `String(juz.number) === selectedJuzId`
- **Same Color Pattern**: As Surah but with `text-on-accent/90` variation

**Animations**:

- **Same as Surah**: `transition-colors` pattern
- **Inherited**: Scale hover from SidebarCard

### 4. Page Component Cards

**File**: `app/shared/surah-sidebar/Page.tsx`

**Interactions**:

- **Same Multi-State Pattern**: Updates all three state values
- **Reverse Resolution**: Calculate juz and surah from page number

**States**:

- **Active Detection**: `String(p) === selectedPageId`
- **Simplified Colors**: Only primary text, no secondary info

**Animations**:

- **Minimal**: Only primary text transition
- **Inherited**: Scale hover from SidebarCard

### 5. FolderCard (Bookmark Folders)

**File**: `app/(features)/bookmarks/components/FolderCard.tsx`

**Interactions**:

- **Primary Click**: `onClick` for folder navigation
- **Context Menu**: Multiple action handlers (edit, delete, rename, colorChange)
- **Keyboard Support**: Enter/Space key handling
- **Event Prevention**: Context menu stops propagation

**States**:

- **Multiple Hover States**: Icon container, title text, overall card
- **Dynamic Content**: Progress bar based on bookmark count
- **Timestamp Display**: Dynamic "last added" or "empty folder"

**Animations**:

- **Framer Motion**:
  - Layout animation
  - **Entry**: `opacity: 0 → 1, scale: 0.95 → 1`
  - **Exit**: `opacity: 1 → 0, scale: 1 → 0.95`
  - **Spring**: `stiffness: 400, damping: 25`
- **CSS Transitions**:
  - `hover:-translate-y-1` (upward movement)
  - `transition-all duration-300`
  - Icon gradient transitions: `duration-300`
  - Text color transitions: `duration-200`
- **Progress Bar**:
  - **Delayed Animation**: `delay: 0.2, duration: 0.6`
  - **Width Animation**: 0 → 100% or 25%

**Accessibility**:

- **Role**: `button` with `tabIndex={0}`
- **ARIA Label**: Descriptive folder info
- **Focus Management**: `focus-visible:ring-2`
- **Keyboard Events**: Full Enter/Space support

### 6. BookmarkCard (Individual Bookmarks)

**File**: `app/(features)/bookmarks/components/BookmarkCard.tsx`

**Interactions**:

- **Primary Navigation**: Click to navigate to verse
- **Audio Controls**: Play/pause toggle
- **Bookmark Management**: Remove bookmark action
- **Action Menu**: ResponsiveVerseActions component
- **Event Management**: Stop propagation for action buttons

**States**:

- **Loading States**: Multiple loading conditions for verse data
- **Audio States**: Playing, loading audio indicators
- **Bookmark Status**: Dynamic bookmark state checking
- **Hover Reveal**: Actions appear on hover

**Animations**:

- **Framer Motion**:
  - **Entry**: `opacity: 0 → 1, y: 20 → 0` (upward slide)
  - **No Exit**: Static once rendered
- **CSS Transitions**:
  - **Hover**: `hover:-translate-y-0.5` (subtle lift)
  - **Border/Background**: `transition-all duration-200`
  - **Action Reveal**: `opacity-0 group-hover:opacity-100`
  - **Action Transition**: `transition-opacity duration-200`

**Complex Interactions**:

- **Audio Player Integration**: Complex state management
- **Router Navigation**: Programmatic navigation with hash
- **Dynamic Content**: Time formatting, verse formatting
- **Conditional Rendering**: Error states, loading states

**Accessibility**:

- **Role**: `article` with descriptive aria-label
- **Loading States**: Proper loading indicators
- **Error States**: Error message display
- **Action Accessibility**: Stop propagation with keyboard support

## Animation System Differences

### CSS Transitions (Navigation Cards)

- **Simple**: `transition transform`
- **Hover**: Scale effects
- **Color**: Basic color transitions
- **Performance**: Lightweight, hardware accelerated

### Framer Motion (Bookmark Cards)

- **Complex**: Layout animations, spring physics
- **Entry/Exit**: Sophisticated animation states
- **Spring Physics**: Natural motion curves
- **Performance**: More overhead, but smoother complex animations

### Mixed Systems (Current State)

- **Inconsistent**: Different animation libraries
- **Timing**: Different durations and easings
- **Effects**: Different hover behaviors (scale vs translate)

## Behavioral Patterns to Preserve

### Navigation State Management

- **Multi-state Updates**: All navigation cards update multiple selection states
- **Scroll Memory**: Remember scroll position on navigation
- **URL Synchronization**: Keep URL in sync with selections

### Bookmark Interactions

- **Audio Integration**: Complex audio player state management
- **Dynamic Content**: Real-time content loading and formatting
- **Action Layering**: Hover-revealed actions with proper event handling

### Accessibility Requirements

- **Keyboard Navigation**: All cards support keyboard interaction
- **Screen Reader**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators
- **State Communication**: Clear active/inactive state indication

## Standardization Strategy

### Preserve All Current Behaviors

1. **Interaction Patterns**: Keep all click handlers and state management
2. **Animation Preferences**: Allow choosing CSS vs Framer Motion per use case
3. **Accessibility**: Maintain all current ARIA and keyboard support
4. **Complex Logic**: Preserve all calculation and resolution logic

### Unify Where Possible

1. **Hover Effects**: Standardize lift/scale approach
2. **Color Transitions**: Unified timing and easing
3. **Focus States**: Consistent focus ring appearance
4. **Loading States**: Standardized loading indicators

### Create Flexible Foundation

1. **Animation Variants**: Support both CSS and Framer Motion
2. **Interaction Slots**: Flexible action button placement
3. **State Management**: Unified active/hover/focus state handling
4. **Content Layouts**: Support all current layout patterns
