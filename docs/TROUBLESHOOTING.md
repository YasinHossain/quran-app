# Troubleshooting Guide

## Development Environment

### Safari Can't Connect To Dev Server

- **Clear service worker**: Safari > Develop > Service Workers > Unregister for `localhost:3000`
- **LAN access**: `npm run dev:lan`, find IP with `ipconfig getifaddr en0`, open `http://<ip>:3000`
- **Port issues**: Try `npm run dev -- --port 3001`, hard refresh Safari

### Node.js Version Issues

```bash
# Check version
node --version

# Install Node.js 20
nvm install 20 && nvm use 20
# Or: brew install node@20
```

### Dependency Issues

```bash
# Clear and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

## Build & Deployment

### TypeScript Errors

- Check strict null checks: use optional chaining `?.` or null assertions `!`
- Run `npm run type-check` to identify issues
- Ensure all imports have proper types

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Full clean rebuild
npm run clean && npm install && npm run build
```

### PWA/Service Worker Issues

- **Dev**: Auto-unregistered in development
- **Production**: Clear browser data, force refresh
- **iPhone**: Settings > Safari > Clear History and Website Data

## Audio Player

### Audio Won't Play

1. Check browser autoplay policy (user interaction required)
2. Verify audio URL accessibility
3. Test with different reciter
4. Check network connectivity

### Playback Issues

- **Stuttering**: Check network speed, try different quality
- **Won't stop**: Force reload page, check for multiple instances
- **Wrong timing**: Verify verse timing data

## API Issues

### Quran.com API Errors

```bash
# Check API status
curl https://api.quran.com/api/v4/chapters

# Common fixes
- Verify internet connection
- Check CORS settings
- Try different API endpoints
```

### Rate Limiting

- Implement request caching
- Add delays between requests
- Use local data when possible

## UI/UX Issues

### Font Loading Problems

- **Arabic fonts not showing**: Check font files in `/public/fonts/`
- **Layout shifts**: Ensure font-display: swap in CSS
- **iOS font issues**: Test on device, check font format support

### Responsive Issues

- **Mobile layout broken**: Check mobile-first CSS classes
- **Touch targets too small**: Ensure minimum 44px touch areas
- **Sidebar won't close**: Check z-index and overlay handlers

### Performance Issues

```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
- Open DevTools > Memory tab
- Take heap snapshots
- Look for detached DOM nodes
```

- **Verse of the Day slow to appear (dev only)**: We now default to the local fallback verse to avoid slow API retries. Set `NEXT_PUBLIC_ENABLE_RANDOM_VERSE_API=true` in `.env.local` if you need to exercise the live random-verse API during development.

## Testing Issues

### Jest Tests Failing

```bash
# Clear Jest cache
npx jest --clearCache

# Run specific test
npm test -- ComponentName.test.tsx

# Debug mode
npm test -- --detectOpenHandles --forceExit
```

### Testing Library Issues

- Wrap components with providers in tests
- Use `waitFor` for async operations
- Mock external dependencies

## Quick Fixes

### Emergency Reset

```bash
# Nuclear option - reset everything
git stash
git clean -fdx
npm install
npm run dev
```

### Cache Issues

```bash
# Clear all caches
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Next.js debug
NEXT_DEBUG=1 npm run dev
```

## Platform-Specific

### macOS

- Firewall: System Settings > Network > Firewall
- Permissions: Give Terminal/VS Code full disk access if needed

### Windows

- Use PowerShell or WSL for better compatibility
- Check Windows Defender firewall settings
- Use `npx` prefix for commands if PATH issues

### iOS/Safari

- Enable Web Inspector: Settings > Safari > Advanced
- Test PWA installation and functionality
- Check for iOS-specific CSS issues
