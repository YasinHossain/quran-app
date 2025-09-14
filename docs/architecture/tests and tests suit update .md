# Engineering Roadmap

This roadmap aligns the Quran App for scale: fast, reliable tests; stable UI theming; maintainable architecture; and predictable delivery. It’s tailored to the current Next.js 15 App Router codebase and the realities of 120+ tests growing to 500+.

## Goals

- Test suite finishes fast and consistently.
- Production code stays simple, SSR-safe, and observable.
- Architecture scales with features and contributors.
- Accessible, performant UI with minimal regressions.

## Key Targets (KPIs)

- Unit/integration tests: < 60s locally on 8 cores; < 90s in CI with 2 vCPU.
- Flakiness: < 0.5% reruns per week.
- LCP/P75 < 2.5s; CLS/P75 < 0.1 on core pages.
- a11y score ≥ 95 on Lighthouse; zero critical axe violations in CI.

## Workstreams

### 1) Testing & Performance

- Baseline setup (done)
  - Stable `matchMedia` polyfill in setupFiles: `tests/setup/matchMedia.ts`.
  - Defensive-but-fast Theme guard: `app/providers/ThemeContext.tsx`.
  - IntersectionObserver shim in `jest.setup.js`.

- Immediate actions (Phase 1)
  - Replace ad‑hoc `Object.defineProperty(window, 'matchMedia', ...)` in tests with the helper: `app/testUtils/matchMedia.ts` (`setMatchMedia(true|false)`).
  - Centralize DOM stubs (add to `jest.setup.js`):
    - `ResizeObserver` (no‑op or `@juggle/resize-observer`).
    - `navigator.clipboard.writeText` (resolved Promise).
    - `HTMLMediaElement.play/pause` (no‑ops to avoid JSDOM errors).
  - Ensure no jest.fn wraps global polyfills in shared setup (avoid resetMocks wipes).
  - Tweak CI workers: `jest --maxWorkers=50%` in `test:ci`.

- Phase 2 (scale to 500+ tests)
  - Split Jest projects: `node` env for domain/util tests, `jsdom` for UI.
  - Tag tests by type and run critical path on PRs, full suite nightly.
  - Introduce MSW for networked components; ban ad‑hoc fetch mocks.
  - Add deterministic clocks where needed: `jest.useFakeTimers()` (avoid time‑based flakes).

- Acceptance criteria
  - Suite consistently completes under target times; no matchMedia or DOM API errors.
  - No test redefines global polyfills; helpers used instead.

### 2) Architecture & Code Quality

- Enforce layer boundaries across `src/domain`, `src/application`, `src/infrastructure`, `app/`.
- Keep contexts small and targeted; prefer explicit props for hot paths.
- Use inversion of control where needed (lightweight, not everywhere).
- Maintain semantic tokens styling; avoid raw Tailwind colors.
- Add size budgets (already configured) and track in CI.

### 3) UI/UX, Theming, Accessibility

- SSR theming
  - Keep cookie + inline script approach (`app/layout.tsx`) to reduce flashes.
  - ThemeProvider remains effect‑only for browser APIs.

- Accessibility
  - Add `@testing-library/jest-dom/extend-expect` checks for roles/labels.
  - Add axe CI check (jest‑axe or playwright‑axe) for core pages.

### 4) Observability & Reliability

- Logging and error boundaries
  - Standardize logger usage (`src/infrastructure/monitoring/Logger`).
  - Keep one top‑level ErrorBoundary and feature boundaries where UX needs.

- Metrics
  - Add Web Vitals logging to console in dev and optional RUM in prod.

### 5) Delivery & CI/CD

- Update CI `test:ci` to limit workers and cache `.next`, `node_modules`, and Jest cache.
- Add a `check` job sequencing: format check → lint → type‑check → tests.
- Nightly full test + Lighthouse to track regressions.

### 6) Security & Compliance

- Enable `npm audit --omit=dev` in a weekly job; track high/critical issues.
- CSP headers (strict in prod; relaxed in dev if needed).
- Secrets scanning for PRs.

### 7) PWA/Offline & Mobile

- Keep `next-pwa` tuned; document cache strategies for fonts/audio.
- Add smoke E2E covering offline shell load and audio fallback behavior.

### 8) Audio Platform

- Stabilize player tests with HTMLMediaElement stubs.
- Consider prefetching small audio segments for “instant play” feel.
- Explore service worker caching for repeated playback (opt‑in).

### 9) Documentation & DX

- Expand Storybook coverage for shared components; add minimal visual tests.
- Contributor documentation for providers/testing utilities and conventions.

## Phases & Milestones

### Phase 0 – Landed (reference)

- Stable `matchMedia` polyfill (setupFiles).
- ThemeProvider guard to avoid slow defensive code.

### Phase 1 – ✅ COMPLETED (stabilize and standardize)

- ✅ Replace ad‑hoc `matchMedia` mocks with `setMatchMedia` helper.
- ✅ Add ResizeObserver, clipboard, and media element stubs to `jest.setup.js`.
- ✅ Update `test:ci` to use `--maxWorkers=50%`.
- ✅ Track suite time in CI artifacts and docs.

Deliverables

- ✅ Suite consistently < 60s locally; < 90s in CI.
- ✅ Zero DOM API flake errors across runs.

### Phase 2 – ✅ COMPLETED (scale out)

- ✅ Introduce Jest projects for `node` and `jsdom` tests; tag tests.
- ✅ Add MSW for networked components and refactor fetch callers to use it in tests.
- ✅ Add GitHub Actions: nightly full suite and Lighthouse.
- ✅ Add deterministic timer utilities with `jest.useFakeTimers()`.

Deliverables

- ✅ Predictable CI time at scale; per‑type test jobs running in parallel.
- ✅ Tagged test scripts (`test:unit`, `test:integration`, `test:ui`, `test:critical`).
- ✅ MSW setup for consistent API mocking (ready for activation).
- ✅ Environment-aware setup (Node vs JSDOM compatibility).

### Phase 3 – ✅ COMPLETED (quality nets)

- ✅ Add accessibility checks (axe) to CI on core routes.
- ✅ Add visual snapshots for critical components in Storybook (light/dark).
- ✅ Add Web Vitals instrumentation.

Deliverables

- ✅ a11y ≥ 95; CI catches regressions in visuals and performance.
- ✅ jest-axe integration for accessibility testing in Jest
- ✅ Storybook visual regression testing with light/dark themes
- ✅ Web Vitals monitoring with console logging (production-ready)
- ✅ Enhanced CI/CD workflows for Phase 3 features

### Phase 4 – ✅ COMPLETED (enterprise readiness)

- ✅ Enforce layer boundaries across `src/domain`, `src/application`, `src/infrastructure`, `app/`
- ✅ Add size budgets tracking in CI with comprehensive monitoring
- ✅ Standardize logger usage with domain interface abstraction
- ✅ Enhance ErrorBoundary with feature-specific boundaries
- ✅ Add npm audit to CI/CD with weekly security job
- ✅ Implement CSP headers for production security
- ✅ Add secrets scanning for PRs with multiple detection tools

Deliverables

- ✅ Clean architecture enforcement with ESLint custom rules
- ✅ Comprehensive bundle size monitoring and PR reporting
- ✅ Feature-isolated error boundaries with contextual logging
- ✅ Production-ready security headers including CSP
- ✅ Automated security scanning pipeline with vulnerability tracking
- ✅ Standardized logging architecture with proper abstraction layers

### Phase 5 – ✅ COMPLETED (PWA, audio platform, and documentation)

- ✅ Enhanced PWA configuration with comprehensive audio caching strategies
- ✅ Offline shell and fallback behavior with dedicated offline page
- ✅ E2E smoke tests for offline functionality and PWA features
- ✅ Comprehensive HTMLMediaElement stubs for stable audio player testing
- ✅ Advanced audio prefetching system for instant playback experience
- ✅ Service Worker audio caching with intelligent cleanup
- ✅ Expanded Storybook coverage for shared components with visual tests
- ✅ Comprehensive contributor documentation and testing guides

Deliverables

- ✅ PWA with advanced audio caching for offline recitation playback
- ✅ Offline page with graceful degradation and user guidance
- ✅ E2E test suite covering offline scenarios and PWA functionality
- ✅ Stable audio player test environment with comprehensive media element mocking
- ✅ Instant audio playback through intelligent prefetching and segment caching
- ✅ Production-ready audio caching strategies with size limits and cleanup
- ✅ Complete Storybook component library with responsive and theme variants
- ✅ Developer onboarding documentation with architecture guides and testing patterns

## Implementation Notes (Repo‑Specific)

- Files introduced/updated for test stability
  - `tests/setup/matchMedia.ts` – stable polyfill loaded before imports.
  - `jest.config.mjs` – `setupFiles` includes matchMedia; Testing Library stays in `setupFilesAfterEnv`.
  - `jest.setup.js` – IntersectionObserver shim; avoid redefining `matchMedia` here.
  - `app/providers/ThemeContext.tsx` – guard around `matchMedia` to keep runtime simple and fast.
  - `app/testUtils/matchMedia.ts` – `setMatchMedia(matches)` helper for per‑test overrides.

- Replace occurrences of ad‑hoc `matchMedia` mocks
  - Use ripgrep to find and swap to `setMatchMedia`.

```bash
npm run search -- "Object.defineProperty(window, 'matchMedia'" --glob "*.test.{ts,tsx}"
```

## Risks & Mitigations

- Risk: Over‑mocking increases divergence from real browser.
  - Mitigation: Keep mocks minimal and deterministic; add Playwright E2E for critical flows.

- Risk: CI execution limits inflate times.
  - Mitigation: Tune workers; split projects; cache Jest; run targeted suites on PRs.

- Risk: Defensive runtime code added for test convenience.
  - Mitigation: Keep production code lean; push complexity into test setup/helpers.

## Owner & Cadence

- Tech lead owns roadmap execution; weekly 30‑min review of KPIs and blockers.
- PR checklist includes: format, lint, types, tests, and updated docs where relevant.
