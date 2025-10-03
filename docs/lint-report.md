# ESLint Report

Generated: 2025-09-15T17:58:11.673Z

## Summary

- Total problems: 120
- Errors: 60
- Warnings: 60
- Auto-fix opportunities (approx): 0

## Top Rules to Fix

- token-rules/no-raw-color-classes: 37 (errors: 37, warnings: 0)
- max-lines-per-function: 12 (errors: 0, warnings: 12)
- no-console: 12 (errors: 0, warnings: 12)
- @typescript-eslint/no-unused-vars: 11 (errors: 0, warnings: 11)
- @typescript-eslint/no-explicit-any: 8 (errors: 8, warnings: 0)
- max-lines: 8 (errors: 0, warnings: 8)
- @next/next/no-html-link-for-pages: 8 (errors: 8, warnings: 0)
- @typescript-eslint/explicit-function-return-type: 7 (errors: 0, warnings: 7)
- prefer-const: 3 (errors: 3, warnings: 0)
- react/no-unescaped-entities: 3 (errors: 3, warnings: 0)
- max-nested-callbacks: 3 (errors: 0, warnings: 3)
- complexity: 2 (errors: 0, warnings: 2)
- import/order: 2 (errors: 0, warnings: 2)
- @next/next/no-assign-module-variable: 1 (errors: 1, warnings: 0)
- max-depth: 1 (errors: 0, warnings: 1)
- max-params: 1 (errors: 0, warnings: 1)
- import/no-anonymous-default-export: 1 (errors: 0, warnings: 1)

### Rule Status (Items 21–31)

- @typescript-eslint/explicit-function-return-type — PARTIAL
- prefer-const — FIXED
- react/no-unescaped-entities — FIXED
- max-nested-callbacks — UNFIXED
- complexity — UNFIXED
- import/order — FIXED
- @next/next/no-assign-module-variable — FIXED
- max-depth — FIXED
- max-params — FIXED
- import/no-anonymous-default-export — FIXED

## Most Affected Files

- app/offline/page.tsx: 20
- app/shared/components/modal/Modal.stories.tsx: 13
- tests/accessibility/core-pages.test.tsx: 12
- app/shared/components/responsive-image/ResponsiveImage.stories.tsx: 7
- tests/e2e/global-setup.ts: 7
- app/(features)/bookmarks/**tests**/LastReadPage.test.tsx: 6
- app/(features)/surah/hooks/useVerseListing.ts: 6
- tests/e2e/offline-functionality.spec.ts: 6
- app/providers/bookmarks/hooks/useBookmarkData.ts: 5
- app/shared/components/error-boundary/ErrorBoundary.stories.tsx: 5
- tests/setup/msw/server.ts: 4
- app/(features)/surah/hooks/useTranslationOptions.ts: 3
- app/shared/player/utils/audioSegmentPrefetch.ts: 3
- app/shared/player/utils/serviceWorkerAudioCache.ts: 3
- app/(features)/bookmarks/**tests**/Bookmarks.test.tsx: 2
- app/shared/player/hooks/useAudioPrefetch.ts: 2
- app/testUtils/renderWithProviders.tsx: 2
- tests/setup/msw/handlers.ts: 2
- app/(features)/page/**tests**/PagePage.test.tsx: 1
- app/(features)/surah/**tests**/Verse.test.tsx: 1

## Difficulty Buckets (Heuristic)

- Easy: prefer-const, no-console, import/order, react/no-unescaped-entities, import/no-anonymous-default-export, @typescript-eslint/no-unused-vars
- Medium: @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any, @next/next/no-html-link-for-pages, max-params, max-depth, max-lines, max-nested-callbacks
- Hard: token-rules/no-raw-color-classes, max-lines-per-function, complexity, @next/next/no-assign-module-variable

## Issues (Numbered by Difficulty)

_Order: Easy → Medium → Hard; then by file path and line_

1. (easy) [W] @typescript-eslint/no-unused-vars — app/(features)/bookmarks/**tests**/Bookmarks.test.tsx:8:7 — 'mockTag' is assigned a value but never used. — FIXED
2. (easy) [W] @typescript-eslint/no-unused-vars — app/(features)/bookmarks/**tests**/Bookmarks.test.tsx:12:6 — 'MockProps' is defined but never used. — FIXED
3. (easy) [W] @typescript-eslint/no-unused-vars — app/(features)/bookmarks/**tests**/LastReadPage.test.tsx:35:23 — 'whileHover' is defined but never used. — FIXED
4. (easy) [W] @typescript-eslint/no-unused-vars — app/(features)/bookmarks/**tests**/LastReadPage.test.tsx:35:35 — 'whileTap' is defined but never used. — FIXED
5. (easy) [W] @typescript-eslint/no-unused-vars — app/(features)/bookmarks/**tests**/LastReadPage.test.tsx:37:25 — 'whileHover' is defined but never used. — FIXED
6. (easy) [W] @typescript-eslint/no-unused-vars — app/(features)/bookmarks/**tests**/LastReadPage.test.tsx:37:37 — 'whileTap' is defined but never used. — FIXED
7. (easy) [W] @typescript-eslint/no-unused-vars — app/(features)/bookmarks/**tests**/LastReadPage.test.tsx:39:26 — 'whileHover' is defined but never used. — FIXED
8. (easy) [W] @typescript-eslint/no-unused-vars — app/(features)/bookmarks/**tests**/LastReadPage.test.tsx:39:38 — 'whileTap' is defined but never used. — FIXED
9. (easy) [E] prefer-const — app/(features)/surah/hooks/useVerseListing.ts:52:5 — 'isLoading' is never reassigned. Use 'const' instead. — FIXED
10. (easy) [E] prefer-const — app/(features)/surah/hooks/useVerseListing.ts:53:5 — 'isValidating' is never reassigned. Use 'const' instead. — FIXED
11. (easy) [E] prefer-const — app/(features)/surah/hooks/useVerseListing.ts:54:5 — 'isReachingEnd' is never reassigned. Use 'const' instead. — FIXED
12. (easy) [E] react/no-unescaped-entities — app/offline/page.tsx:34:84 — `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`. — FIXED
13. (easy) [E] react/no-unescaped-entities — app/offline/page.tsx:38:16 — `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`. — FIXED
14. (easy) [E] react/no-unescaped-entities — app/offline/page.tsx:126:66 — `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`. — FIXED
15. (easy) [W] @typescript-eslint/no-unused-vars — app/shared/player/utils/audioSegmentPrefetch.ts:4:11 — 'AudioSegment' is defined but never used. — FIXED
16. (easy) [W] @typescript-eslint/no-unused-vars — app/shared/player/utils/serviceWorkerAudioCache.ts:154:18 — 'error' is defined but never used. — FIXED
17. (easy) [W] import/order — app/testUtils/renderWithProviders.tsx:4:1 — There should be no empty line within import group — FIXED
18. (easy) [W] import/order — app/testUtils/renderWithProviders.tsx:4:1 — `@/lib/api/chapters` import should occur after import of `@/app/shared/player/context/AudioContext` — FIXED
19. (easy) [W] no-console — tests/e2e/global-setup.ts:10:3 — Unexpected console statement. Only these console methods are allowed: warn, error. — FIXED
20. (easy) [W] no-console — tests/e2e/global-setup.ts:18:5 — Unexpected console statement. Only these console methods are allowed: warn, error. — FIXED
21. (easy) [W] no-console — tests/e2e/global-setup.ts:29:9 — Unexpected console statement. Only these console methods are allowed: warn, error. — FIXED
22. (easy) [W] no-console — tests/e2e/global-setup.ts:31:9 — Unexpected console statement. Only these console methods are allowed: warn, error. — FIXED
23. (easy) [W] no-console — tests/e2e/global-setup.ts:51:7 — Unexpected console statement. Only these console methods are allowed: warn, error. — FIXED
24. (easy) [W] no-console — tests/e2e/global-setup.ts:53:7 — Unexpected console statement. Only these console methods are allowed: warn, error. — FIXED
25. (easy) [W] no-console — tests/e2e/global-setup.ts:56:5 — Unexpected console statement. Only these console methods are allowed: warn, error. — FIXED
26. (easy) [W] no-console — tests/e2e/offline-functionality.spec.ts:65:7 — Unexpected console statement. Only these console methods are allowed: warn, error. — FIXED
27. (easy) [W] no-console — tests/e2e/offline-functionality.spec.ts:68:7 — Unexpected console statement. Only these console methods are allowed: warn, error. — FIXED
28. (easy) [W] no-console — tests/e2e/offline-functionality.spec.ts:122:9 — Unexpected console statement. Only these console methods are allowed: warn, error. — FIXED
29. (easy) [W] no-console — tests/e2e/offline-functionality.spec.ts:173:7 — Unexpected console statement. Only these console methods are allowed: warn, error. — FIXED
30. (easy) [W] no-console — tests/e2e/offline-functionality.spec.ts:199:7 — Unexpected console statement. Only these console methods are allowed: warn, error. — FIXED
31. (easy) [W] @typescript-eslint/no-unused-vars — tests/setup/msw/handlers.ts:119:11 — 'resourceType' is assigned a value but never used. — FIXED
32. (easy) [W] import/no-anonymous-default-export — tools/scripts/eslint/enforce-architecture-boundaries.mjs:73:1 — Assign object to a variable before exporting as module default — FIXED
33. (medium) [W] @typescript-eslint/explicit-function-return-type — app/(features)/page/**tests**/PagePage.test.tsx:37:23 — Missing return type on function. — FIXED
34. (medium) [W] @typescript-eslint/explicit-function-return-type — app/(features)/surah/**tests**/Verse.test.tsx:19:24 — Missing return type on function. — FIXED
35. (medium) [E] @typescript-eslint/no-explicit-any — app/(features)/surah/hooks/useTranslationOptions.ts:26:50 — Unexpected any. Specify a different type. — FIXED
36. (medium) [E] @typescript-eslint/no-explicit-any — app/(features)/surah/hooks/useTranslationOptions.ts:26:64 — Unexpected any. Specify a different type. — FIXED
37. (medium) [E] @typescript-eslint/no-explicit-any — app/(features)/surah/hooks/useTranslationOptions.ts:29:52 — Unexpected any. Specify a different type. — FIXED
38. (medium) [E] @typescript-eslint/no-explicit-any — app/(features)/surah/hooks/useVerseListing.ts:68:31 — Unexpected any. Specify a different type. — FIXED
39. (medium) [E] @typescript-eslint/no-explicit-any — app/providers/bookmarks/hooks/useBookmarkData.ts:36:31 — Unexpected any. Specify a different type. — FIXED
40. (medium) [E] @typescript-eslint/no-explicit-any — app/providers/bookmarks/hooks/useBookmarkData.ts:37:27 — Unexpected any. Specify a different type. — FIXED
41. (medium) [E] @typescript-eslint/no-explicit-any — app/providers/bookmarks/hooks/useBookmarkData.ts:38:27 — Unexpected any. Specify a different type. — FIXED
42. (medium) [E] @typescript-eslint/no-explicit-any — app/providers/bookmarks/hooks/useBookmarkData.ts:43:41 — Unexpected any. Specify a different type. — FIXED
43. (medium) [W] @typescript-eslint/explicit-function-return-type — app/shared/components/error-boundary/ErrorBoundary.stories.tsx:39:76 — Missing return type on function. — FIXED
44. (medium) [W] max-lines - app/shared/components/error-boundary/ErrorBoundary.stories.tsx:175:1 - File has too many lines (202). Maximum allowed is 150. - FIXED
45. (medium) [W] max-lines - app/shared/components/modal/Modal.stories.tsx:166:1 - File has too many lines (196). Maximum allowed is 150. - FIXED
46. (medium) [W] max-lines - app/shared/components/responsive-image/ResponsiveImage.stories.tsx:175:1 - File has too many lines (200). Maximum allowed is 150. - FIXED
47. (medium) [W] max-lines - app/shared/player/hooks/useAudioPrefetch.ts:154:1 - File has too many lines (181). Maximum allowed is 120. - FIXED
48. (medium) [W] max-lines - app/shared/player/utils/audioSegmentPrefetch.ts:278:1 - File has too many lines (260). Maximum allowed is 200. - FIXED
49. (medium) [W] max-depth - app/shared/player/utils/serviceWorkerAudioCache.ts:142:11 - Blocks are nested too deeply (4). Maximum allowed is 3. - FIXED
50. (medium) [W] max-lines - app/shared/player/utils/serviceWorkerAudioCache.ts:286:1 - File has too many lines (220). Maximum allowed is 200. - FIXED
51. (medium) [W] max-params — app/shared/services/LoggingService.ts:87:3 — Method 'logApiCall' has too many parameters (5). Maximum allowed is 4. - FIXED
52. (medium) [E] @next/next/no-html-link-for-pages — tests/accessibility/core-pages.test.tsx:32:11 — Do not use an `<a>` element to navigate to `/surah/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/no-htm… - FIXED
53. (medium) [E] @next/next/no-html-link-for-pages — tests/accessibility/core-pages.test.tsx:35:11 — Do not use an `<a>` element to navigate to `/juz/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/no-html-… - FIXED
54. (medium) [E] @next/next/no-html-link-for-pages — tests/accessibility/core-pages.test.tsx:41:11 — Do not use an `<a>` element to navigate to `/bookmarks/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/no… - FIXED
55. (medium) [E] @next/next/no-html-link-for-pages — tests/accessibility/core-pages.test.tsx:116:11 — Do not use an `<a>` element to navigate to `/bookmarks/pinned/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/mess… - FIXED
56. (medium) [E] @next/next/no-html-link-for-pages — tests/accessibility/core-pages.test.tsx:119:11 — Do not use an `<a>` element to navigate to `/bookmarks/last-read/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/m… - FIXED
57. (medium) [E] @next/next/no-html-link-for-pages — tests/accessibility/core-pages.test.tsx:122:11 — Do not use an `<a>` element to navigate to `/bookmarks/memorization/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/doc… - FIXED
58. (medium) [E] @next/next/no-html-link-for-pages — tests/accessibility/core-pages.test.tsx:157:11 — Do not use an `<a>` element to navigate to `/tafsir/1/1/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/n… - FIXED
59. (medium) [E] @next/next/no-html-link-for-pages — tests/accessibility/core-pages.test.tsx:160:11 — Do not use an `<a>` element to navigate to `/tafsir/2/1/`. Use `<Link />` from `next/link` instead. See: https://nextjs.org/docs/messages/n… - FIXED
60. (medium) [W] max-nested-callbacks — tests/accessibility/core-pages.test.tsx:223:21 — Too many nested callbacks (4). Maximum allowed is 3. - FIXED
61. (medium) [W] max-nested-callbacks — tests/accessibility/core-pages.test.tsx:232:21 — Too many nested callbacks (4). Maximum allowed is 3. - FIXED
62. (medium) [W] max-nested-callbacks — tests/accessibility/core-pages.test.tsx:242:21 — Too many nested callbacks (4). Maximum allowed is 3. - FIXED
63. (medium) [W] max-lines — tests/setup/msw/handlers.ts:225:1 — File has too many lines (316). Maximum allowed is 200. — FIXED
64. (medium) [W] @typescript-eslint/explicit-function-return-type — tests/setup/msw/server.ts:10:31 — Missing return type on function. — FIXED
65. (medium) [W] @typescript-eslint/explicit-function-return-type — tests/setup/msw/server.ts:11:30 — Missing return type on function. — FIXED
66. (medium) [W] @typescript-eslint/explicit-function-return-type — tests/setup/msw/server.ts:12:33 — Missing return type on function. — FIXED
67. (medium) [W] @typescript-eslint/explicit-function-return-type — tests/setup/msw/server.ts:15:76 — Missing return type on function. — FIXED
68. (medium) [W] max-lines — tests/setup/setupTests.ts:260:1 — File has too many lines (216). Maximum allowed is 200. — FIXED
69. (hard) [E] @next/next/no-assign-module-variable — app/(features)/surah/components/**tests**/SurahView/test-utils.tsx:73:3 — Do not assign to the variable `module`. See: https://nextjs.org/docs/messages/no-assign-module-variable � FIXED
70. (hard) [W] max-lines-per-function — app/(features)/surah/hooks/useVerseListing.ts:23:8 — Function 'useVerseListing' has too many lines (68). Maximum allowed is 50. � FIXED
71. (hard) [W] complexity — app/(features)/surah/hooks/useVerseListing.ts:23:8 — Function 'useVerseListing' has a complexity of 13. Maximum allowed is 10. � FIXED
72. (hard) [W] max-lines-per-function — app/offline/page.tsx:8:16 — Function 'OfflinePage' has too many lines (119). Maximum allowed is 50. � FIXED
73. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:34:25 — Avoid using raw color utility "text-gray-900". Use design tokens instead. � FIXED
74. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:37:24 — Avoid using raw color utility "text-gray-600". Use design tokens instead. � FIXED
75. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:37:24 — Avoid using raw color utility "text-gray-300". Use design tokens instead. � FIXED
76. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:43:26 — Avoid using raw color utility "bg-gray-800". Use design tokens instead. � FIXED
77. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:43:26 — Avoid using raw color utility "border-gray-200". Use design tokens instead. � FIXED
78. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:43:26 — Avoid using raw color utility "border-gray-700". Use design tokens instead. � FIXED
79. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:44:27 — Avoid using raw color utility "text-gray-900". Use design tokens instead. � FIXED
80. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:47:27 — Avoid using raw color utility "text-gray-600". Use design tokens instead. � FIXED
81. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:47:27 — Avoid using raw color utility "text-gray-300". Use design tokens instead. � FIXED
82. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:118:25 — Avoid using raw color utility "bg-gray-100". Use design tokens instead. � FIXED
83. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:118:25 — Avoid using raw color utility "bg-gray-200". Use design tokens instead. � FIXED
84. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:118:25 — Avoid using raw color utility "bg-gray-700". Use design tokens instead. � FIXED
85. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:118:25 — Avoid using raw color utility "bg-gray-600". Use design tokens instead. � FIXED
86. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:118:25 — Avoid using raw color utility "text-gray-900". Use design tokens instead. � FIXED
87. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:125:26 — Avoid using raw color utility "text-gray-500". Use design tokens instead. � FIXED
88. (hard) [E] token-rules/no-raw-color-classes — app/offline/page.tsx:125:26 — Avoid using raw color utility "text-gray-400". Use design tokens instead. � FIXED
89. (hard) [W] max-lines-per-function — app/providers/SettingsContext.tsx:73:33 — Arrow function has too many lines (53). Maximum allowed is 50. — FIXED
90. (hard) [W] max-lines-per-function — app/providers/bookmarks/hooks/useBookmarkData.ts:17:8 — Function 'useBookmarkData' has too many lines (55). Maximum allowed is 50. — FIXED
91. (hard) [W] complexity — app/providers/settingsReducer.ts:16:24 — Arrow function has a complexity of 13. Maximum allowed is 10. — FIXED
92. (hard) [W] max-lines-per-function — app/shared/**tests**/ResponsiveVerseActions/ResponsiveVerseActions.interactions.test.tsx:9:49 — Arrow function has too many lines (64). Maximum allowed is 50. — FIXED
93. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/error-boundary/ErrorBoundary.stories.tsx:28:22 — Avoid using raw color utility "bg-gray-50". Use design tokens instead. — FIXED
94. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/error-boundary/ErrorBoundary.stories.tsx:28:22 — Avoid using raw color utility "bg-gray-900". Use design tokens instead. — FIXED
95. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/error-boundary/ErrorBoundary.stories.tsx:226:22 — Avoid using raw color utility "bg-gray-900". Use design tokens instead. — FIXED
96. (hard) [W] max-lines-per-function — app/shared/components/error-boundary/FeatureErrorBoundary.tsx:17:1 — Function 'FeatureErrorFallback' has too many lines (53). Maximum allowed is 50. — FIXED
97. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/modal/Modal.stories.tsx:28:22 — Avoid using raw color utility "bg-gray-100". Use design tokens instead. — FIXED
98. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/modal/Modal.stories.tsx:28:22 — Avoid using raw color utility "bg-gray-900". Use design tokens instead. — FIXED
99. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/modal/Modal.stories.tsx:43:23 — Avoid using raw color utility "text-gray-900". Use design tokens instead. — FIXED
100. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/modal/Modal.stories.tsx:44:22 — Avoid using raw color utility "text-gray-600". Use design tokens instead. — FIXED
101. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/modal/Modal.stories.tsx:44:22 — Avoid using raw color utility "text-gray-300". Use design tokens instead. — FIXED
102. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/modal/Modal.stories.tsx:91:25 — Avoid using raw color utility "text-gray-900". Use design tokens instead. — FIXED
103. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/modal/Modal.stories.tsx:93:22 — Avoid using raw color utility "text-gray-600". Use design tokens instead. — FIXED
104. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/modal/Modal.stories.tsx:93:22 — Avoid using raw color utility "text-gray-300". Use design tokens instead. — FIXED
105. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/modal/Modal.stories.tsx:126:23 — Avoid using raw color utility "text-gray-900". Use design tokens instead. — FIXED
106. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/modal/Modal.stories.tsx:129:24 — Avoid using raw color utility "text-gray-600". Use design tokens instead. — FIXED
107. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/modal/Modal.stories.tsx:129:24 — Avoid using raw color utility "text-gray-300". Use design tokens instead. — FIXED
108. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/modal/Modal.stories.tsx:210:22 — Avoid using raw color utility "bg-gray-900". Use design tokens instead. — FIXED
109. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/responsive-image/ResponsiveImage.stories.tsx:106:20 — Avoid using raw color utility "bg-gray-100". Use design tokens instead. — FIXED
110. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/responsive-image/ResponsiveImage.stories.tsx:106:20 — Avoid using raw color utility "bg-gray-800". Use design tokens instead. — FIXED
111. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/responsive-image/ResponsiveImage.stories.tsx:151:22 — Avoid using raw color utility "bg-gray-900". Use design tokens instead. — FIXED
112. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/responsive-image/ResponsiveImage.stories.tsx:152:23 — Avoid using raw color utility "text-gray-900". Use design tokens instead. — FIXED
113. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/responsive-image/ResponsiveImage.stories.tsx:153:22 — Avoid using raw color utility "text-gray-600". Use design tokens instead. — FIXED
114. (hard) [E] token-rules/no-raw-color-classes — app/shared/components/responsive-image/ResponsiveImage.stories.tsx:153:22 — Avoid using raw color utility "text-gray-300". Use design tokens instead. — FIXED
115. (hard) [W] max-lines-per-function — app/shared/player/hooks/useAudioPrefetch.ts:25:8 — Function 'useAudioPrefetch' has too many lines (165). Maximum allowed is 50.
116. (hard) [W] max-lines-per-function — app/shared/player/utils/audioSegmentPrefetch.ts:106:3 — Async method 'prefetchAudioList' has too many lines (64). Maximum allowed is 50.
117. (hard) [W] max-lines-per-function — lib/**tests**/mobile-performance/memory-network.test.ts:7:39 — Arrow function has too many lines (52). Maximum allowed is 50.
118. (hard) [W] max-lines-per-function — tests/accessibility/core-pages.test.tsx:167:38 — Arrow function has too many lines (107). Maximum allowed is 50.
119. (hard) [W] max-lines-per-function — tests/e2e/offline-functionality.spec.ts:8:40 — Arrow function has too many lines (108). Maximum allowed is 50.
120. (hard) [W] max-lines-per-function — tests/unit/infrastructure/monitoring/RemoteTransport.flushing.test.ts:9:38 — Arrow function has too many lines (58). Maximum allowed is 50.
