# Deployment Guide

## Overview

This guide covers deployment strategies for the Quran App, including environment setup, build optimization, and deployment to various platforms.

## Prerequisites

- Node.js 20 or higher
- npm or yarn package manager
- Git for version control

## Environment Variables

Create environment files for different stages:

### `.env.local` (Development)
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.quran.com
NEXT_PUBLIC_ENVIRONMENT=development
ANALYTICS_ID=your-analytics-id
```

### `.env.production` (Production)
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.quran.com
NEXT_PUBLIC_ENVIRONMENT=production
ANALYTICS_ID=your-production-analytics-id
```

## Build Process

### Development Build
```bash
npm run dev
```

### Production Build
```bash
# Install dependencies
npm ci

# Run quality checks
npm run check

# Build for production
npm run build

# Start production server
npm start
```

### Build Optimization

1. **Bundle Analysis**:
   ```bash
   npm run build -- --analyze
   ```

2. **Performance Checks**:
   - Lighthouse CI in GitHub Actions
   - Bundle size monitoring
   - Core Web Vitals tracking

## Deployment Platforms

### Vercel (Recommended)

1. **Setup**:
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Environment Variables**:
   Configure in Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_ENVIRONMENT`
   - `ANALYTICS_ID`

### Netlify

1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: 20

2. **Environment Variables**:
   Set in Netlify dashboard under Site settings > Environment variables

### Docker Deployment

1. **Dockerfile**:
   ```dockerfile
   FROM node:20-alpine AS base
   
   # Install dependencies only when needed
   FROM base AS deps
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci
   
   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app
   
   ENV NODE_ENV production
   
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   
   EXPOSE 3000
   
   ENV PORT 3000
   
   CMD ["node", "server.js"]
   ```

2. **Build and Run**:
   ```bash
   docker build -t quran-app .
   docker run -p 3000:3000 quran-app
   ```

## Performance Optimization

### 1. Image Optimization
- Use Next.js Image component
- Optimize font files
- Compress static assets

### 2. Code Splitting
- Dynamic imports for heavy components
- Route-based splitting (automatic with Next.js)
- Component-level splitting for large features

### 3. Caching Strategy
```javascript
// next.config.ts
const nextConfig = {
  headers: async () => [
    {
      source: '/fonts/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};
```

## CDN Configuration

### CloudFlare
1. Add domain to CloudFlare
2. Configure caching rules:
   - Static assets: 1 year
   - API responses: 5 minutes
   - HTML: No cache

### AWS CloudFront
```json
{
  "Origins": [
    {
      "DomainName": "your-app.vercel.app",
      "Id": "vercel-origin",
      "CustomOriginConfig": {
        "HTTPPort": 443,
        "OriginProtocolPolicy": "https-only"
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "vercel-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "managed-caching-optimized"
  }
}
```

## Monitoring & Analytics

### 1. Error Tracking
```javascript
// lib/monitoring.ts
export const logError = (error: Error, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
    console.error('Error:', error, context);
  }
};
```

### 2. Performance Monitoring
- Web Vitals tracking
- Bundle size monitoring
- API response time tracking

### 3. Analytics Setup
```javascript
// lib/analytics.ts
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties);
  }
};
```

## Security Considerations

### 1. Headers Configuration
```javascript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

### 2. Environment Security
- Never commit secrets to repository
- Use environment-specific configurations
- Rotate API keys regularly
- Implement CSP headers

## Rollback Strategy

### Vercel
1. Use Vercel dashboard to rollback to previous deployment
2. Or redeploy a specific commit:
   ```bash
   vercel --prod --prebuilt
   ```

### Manual Rollback
1. Identify last known good commit
2. Create hotfix branch
3. Deploy through CI/CD pipeline

## Health Checks

### API Health Check
```javascript
// pages/api/health.ts
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
}
```

### Monitoring Endpoints
- `/api/health` - Basic health check
- `/api/metrics` - Performance metrics
- `/api/status` - Detailed system status

## Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Clear cache
   rm -rf .next
   npm run build
   ```

2. **Memory Issues**:
   ```bash
   # Increase Node.js memory
   NODE_OPTIONS='--max-old-space-size=4096' npm run build
   ```

3. **Font Loading Issues**:
   - Check font file paths
   - Verify CORS headers
   - Test font loading in different browsers

### Debugging Production Issues
1. Enable verbose logging
2. Check error tracking service
3. Review performance metrics
4. Analyze user feedback

## Maintenance

### Regular Tasks
1. Update dependencies monthly
2. Monitor performance metrics
3. Review error logs weekly
4. Update security headers
5. Backup deployment configurations

### Scheduled Maintenance
1. Database cleanup (if applicable)
2. Cache invalidation
3. SSL certificate renewal
4. Security patches

This deployment guide ensures reliable, secure, and performant deployments of the Quran App across various platforms.