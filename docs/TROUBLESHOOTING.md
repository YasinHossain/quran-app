# Troubleshooting Guide

## Common Issues & Solutions

### Development Environment

#### Node.js Version Issues
**Problem**: Build fails with Node.js version errors
```bash
Error: Node.js version 18.x is not supported
```

**Solution**:
```bash
# Check current version
node --version

# Install Node.js 20
nvm install 20
nvm use 20

# Or if using package managers
brew install node@20  # macOS
choco install nodejs  # Windows
```

#### Dependency Installation Issues
**Problem**: npm install fails
```bash
npm ERR! peer dep missing
```

**Solution**:
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for exact dependencies
npm ci
```

#### Port Already in Use
**Problem**: Development server won't start
```bash
Error: Port 3000 is already in use
```

**Solution**:
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr 3000   # Windows

# Or use different port
npm run dev -- --port 3001
```

### Build & Deployment Issues

#### TypeScript Errors
**Problem**: Build fails with type errors
```bash
Type 'string | undefined' is not assignable to type 'string'
```

**Solution**:
```typescript
// Add proper type guards
if (typeof value === 'string') {
  // Use value safely
}

// Or use optional chaining
const result = value?.toString() ?? '';

// Update types in types/ directory
interface MyInterface {
  property?: string; // Make optional if needed
}
```

#### ESLint/Prettier Conflicts
**Problem**: Formatting conflicts between tools
```bash
Error: Delete `␊` prettier/prettier
```

**Solution**:
```bash
# Fix formatting
npm run format

# Then run linting
npm run lint --fix

# Check conflicts in config
echo {} | npx eslint-config-prettier
```

#### Build Memory Issues
**Problem**: Build fails with memory errors
```bash
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Solution**:
```bash
# Increase Node.js memory
NODE_OPTIONS='--max-old-space-size=4096' npm run build

# Or add to package.json scripts
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```

### Styling Issues

#### Dark/Light Theme Not Working
**Problem**: Theme toggle doesn't affect components

**Solution**:
```typescript
// ❌ Wrong - theme conditionals in JSX
<div className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>

// ✅ Correct - use semantic tokens
<div className="bg-surface text-foreground">

// ✅ Or use CSS classes
<div className="bg-white dark:bg-gray-800">
```

#### Tailwind Classes Not Applied
**Problem**: Custom classes don't appear

**Solution**:
```bash
# Check if class is in safelist
# Add to tailwind.config.mjs
safelist: [
  'bg-gradient-to-r',
  'from-purple-500',
  'to-pink-500'
]

# Or use dynamic class names properly
const className = `bg-${color}-500`; // ❌ Won't work
const className = color === 'red' ? 'bg-red-500' : 'bg-blue-500'; // ✅ Works
```

#### Design System Tokens Not Working
**Problem**: Custom tokens not available

**Solution**:
```bash
# Regenerate design tokens
npm run generate:tokens

# Check design-system.json structure
# Verify CSS variables are generated
```

### Component Issues

#### Context Provider Errors
**Problem**: useContext throws error
```bash
Error: useSettings must be used within SettingsProvider
```

**Solution**:
```typescript
// Wrap component with providers in tests
import { renderWithProviders } from '@/app/testUtils/renderWithProviders';

// In tests
renderWithProviders(<Component />);

// In app, ensure ClientProviders wraps everything
// layout.tsx
<ClientProviders>
  {children}
</ClientProviders>
```

#### Panel/Modal Not Opening
**Problem**: UI state not updating

**Solution**:
```typescript
// Use UIState context instead of local state
const { openPanel, isPanelOpen } = useUIState();

// Not local state
const [isOpen, setIsOpen] = useState(false); // ❌

// Check panel ID consistency
openPanel('translation-settings'); // Must match
isPanelOpen('translation-settings'); // Same ID
```

#### Component Not Re-rendering
**Problem**: State updates don't trigger re-renders

**Solution**:
```typescript
// Check dependencies in useEffect/useMemo
useEffect(() => {
  // Effect logic
}, [dependency]); // Add missing dependencies

// Avoid object/array dependencies without proper comparison
const memoizedValue = useMemo(() => {
  return expensiveComputation(data);
}, [JSON.stringify(data)]); // Use stable reference
```

### API & Data Issues

#### SWR Not Fetching
**Problem**: Data not loading with SWR

**Solution**:
```typescript
// Check key format
const { data } = useSWR(
  `/api/verses/${surahId}`, // Must be string
  () => fetchVerses(surahId)
);

// Not this
const { data } = useSWR(
  { surahId }, // ❌ Object keys don't work reliably
  fetchVerses
);

// Debug SWR
import { mutate } from 'swr';
mutate('/api/verses/1'); // Force revalidation
```

#### API Response Issues
**Problem**: API returns unexpected data

**Solution**:
```typescript
// Add proper error handling
try {
  const response = await fetch('/api/data');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}

// Validate response structure
if (!data || !Array.isArray(data.verses)) {
  throw new Error('Invalid API response structure');
}
```

### Performance Issues

#### Slow Page Load
**Problem**: Initial page load takes too long

**Solution**:
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for large dependencies
npx bundle-analyzer .next/static/chunks/*.js

# Implement code splitting
const LazyComponent = lazy(() => import('./LazyComponent'));
```

#### Memory Leaks
**Problem**: Browser memory usage increases over time

**Solution**:
```typescript
// Clean up event listeners
useEffect(() => {
  const handleResize = () => {};
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// Clean up timers
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  
  return () => {
    clearInterval(timer);
  };
}, []);
```

### Testing Issues

#### Tests Failing
**Problem**: Tests pass locally but fail in CI

**Solution**:
```bash
# Run tests with same environment
NODE_ENV=test npm test

# Check for async issues
# Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

# Check for race conditions
# Add proper cleanup
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});
```

#### Test Coverage Issues
**Problem**: Coverage below threshold

**Solution**:
```bash
# See uncovered lines
npm run test:coverage -- --verbose

# Add tests for missing coverage
# Focus on:
# - Error handling paths
# - Edge cases
# - User interactions
```

### Audio Player Issues

#### Audio Not Playing
**Problem**: Audio player doesn't start

**Solution**:
```typescript
// Check audio source
const audio = new Audio();
audio.src = audioUrl;
audio.load();

// Handle audio errors
audio.addEventListener('error', (e) => {
  console.error('Audio error:', e);
});

// Check browser autoplay policy
audio.play().catch(error => {
  console.log('Autoplay prevented:', error);
  // Show user interaction required
});
```

#### Audio Synchronization Issues
**Problem**: Audio and highlighting out of sync

**Solution**:
```typescript
// Use audio timeupdate event
audio.addEventListener('timeupdate', () => {
  const currentTime = audio.currentTime;
  // Update highlighting based on currentTime
});

// Check timing data accuracy
// Verify word timing arrays
const wordTimings = [
  { start: 0, end: 1.5, word: 'first' },
  { start: 1.5, end: 3.0, word: 'second' }
];
```

### Font Issues

#### Arabic Fonts Not Loading
**Problem**: Arabic text shows in fallback font

**Solution**:
```css
/* Check font loading in CSS */
@font-face {
  font-family: 'Uthmani';
  src: url('/fonts/KFGQPC-Uthman-Taha.ttf') format('truetype');
  font-display: swap;
}

/* Verify font application */
.arabic-text {
  font-family: 'Uthmani', 'Arial Unicode MS', sans-serif;
}
```

```typescript
// Check font loading status
document.fonts.ready.then(() => {
  console.log('All fonts loaded');
});

// Or use Font Loading API
const font = new FontFace('Uthmani', 'url(/fonts/font.ttf)');
font.load().then(() => {
  document.fonts.add(font);
});
```

### PWA Issues

#### Service Worker Not Updating
**Problem**: App doesn't update with new version

**Solution**:
```javascript
// Force service worker update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.update();
    });
  });
}

// Clear cache
caches.keys().then(names => {
  names.forEach(name => {
    caches.delete(name);
  });
});
```

#### PWA Not Installing
**Problem**: Install prompt doesn't appear

**Solution**:
```javascript
// Check manifest.json
// Ensure HTTPS
// Verify service worker registration

// Listen for install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  // Show custom install button
});
```

## Debug Tools

### Browser DevTools
```javascript
// React DevTools
// Install React Developer Tools extension

// Performance profiling
// Use Profiler tab in React DevTools

// Network analysis
// Check Network tab for failed requests

// Console debugging
console.log('Debug info:', { state, props });
console.table(arrayData);
console.group('Function execution');
```

### Debugging Commands
```bash
# Verbose logging
DEBUG=* npm run dev

# Next.js debug
NEXT_DEBUG=1 npm run dev

# Node debug
node --inspect-brk node_modules/.bin/next dev
```

### Performance Monitoring
```typescript
// Measure performance
const start = performance.now();
// ... operation
const end = performance.now();
console.log(`Operation took ${end - start} milliseconds`);

// Monitor renders
const ProfiledComponent = React.memo(Component);

// Use React Profiler
<Profiler id="ComponentName" onRender={onRenderCallback}>
  <Component />
</Profiler>
```

## Getting Help

### Internal Resources
1. Check AGENTS.md files in relevant directories
2. Review existing similar components
3. Check test files for usage examples
4. Look at CLAUDE.md for project context

### External Resources
1. Next.js documentation
2. React documentation
3. Tailwind CSS documentation
4. TypeScript documentation

### Debugging Checklist
1. ✅ Check browser console for errors
2. ✅ Verify environment variables
3. ✅ Confirm dependencies are installed
4. ✅ Check file paths and imports
5. ✅ Review recent changes
6. ✅ Test in different browsers
7. ✅ Clear cache and rebuild
8. ✅ Check network requests

This troubleshooting guide covers the most common issues and their solutions. When in doubt, start with the basics: check the console, verify your setup, and ensure you're following the established patterns.