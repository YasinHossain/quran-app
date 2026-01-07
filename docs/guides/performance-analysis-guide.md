# Performance Analysis Guide

This guide explains how to practically analyze and optimize performance for end users.

## 🔧 Quick Commands

```bash
# Build with bundle analysis (opens visual treemap)
npm run analyze

# Run Lighthouse audit (generates HTML report)
npm run preview  # First, build and start prod server
npm run lighthouse  # Then run audit

# Type check
npm run type-check

# Check bundle sizes against limits
npm run size-limit
```

## 📊 Performance Analysis Tools

### 1. Bundle Analyzer (`npm run analyze`)

This builds your app and opens an interactive visualization showing:

- Which packages contribute to bundle size
- Chunk splitting effectiveness
- Unused code opportunities

**What to look for:**

- Large packages that could be lazy-loaded
- Duplicate dependencies
- Packages you don't need

### 2. Lighthouse (`npm run lighthouse`)

Generates a comprehensive report with scores for:

- **Performance** (0-100) - Load times, responsiveness
- **Accessibility** (0-100) - WCAG compliance
- **Best Practices** (0-100) - Security, modern APIs
- **SEO** (0-100) - Search engine optimization
- **PWA** - Progressive Web App checklist

**Key metrics:**

- **LCP** (Largest Contentful Paint) - Target: < 2.5s
- **FID** (First Input Delay) - Target: < 100ms
- **CLS** (Cumulative Layout Shift) - Target: < 0.1

### 3. Chrome DevTools Performance

1. Open Chrome DevTools (F12)
2. Go to **Performance** tab
3. Click Record, interact with your app, stop recording
4. Analyze:
   - **Main thread** - JavaScript blocking time
   - **Bottom-up** - Which functions take longest
   - **Call tree** - Function call hierarchy

### 4. Chrome DevTools Network

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Check "Disable cache"
4. Reload the page
5. Analyze:
   - **Size** - Total transferred vs. actual size
   - **Waterfall** - Load order and blocking resources
   - **Slow requests** - Red/yellow items

### 5. Size Limit (`npm run size-limit`)

Your project has size budgets configured in `package.json`:

- Surah Feature Bundle: 50 KB limit
- Shared Components: 30 KB limit
- Providers: 25 KB limit
- Bookmarks Feature: 45 KB limit

This prevents accidental bundle size increases.

## 🎯 Key Performance Optimizations

### Already Implemented:

1. ✅ **Dynamic imports** for MushafMain, TafsirPanel, etc.
2. ✅ **Single icon library** (lucide-react)
3. ✅ **React Virtuoso** for long lists
4. ✅ **Next.js Image optimization**
5. ✅ **Code splitting** via Next.js app router

### Future Opportunities:

1. 🔄 **framer-motion** - Consider lazy loading for animations
2. 🔄 **Font optimization** - Subset Arabic fonts if possible
3. 🔄 **API caching** - Add SWR cache headers
4. 🔄 **Service Worker** - Cache static assets (PWA)

## 📈 Monitoring in Production

### Web Vitals Tracking

Your app includes `web-vitals` package. Consider sending metrics to:

- Google Analytics
- Vercel Analytics
- Custom endpoint

### Real User Monitoring (RUM)

For production insights, consider:

- Vercel Analytics (built-in with Vercel hosting)
- Sentry Performance
- DataDog RUM

## 🧪 Testing Performance Changes

Before deploying:

1. Run `npm run build` and check for warnings
2. Run `npm run size-limit` to ensure budget compliance
3. Run `npm run lighthouse` to compare scores
4. Test on slow network (DevTools → Network → Slow 3G)
5. Test on low-end device emulation
