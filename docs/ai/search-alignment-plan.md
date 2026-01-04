# Search Alignment Implementation Plan

## Executive Summary

This document outlines how to align our Quran app's search functionality with quran.com's behavior. The goal is to match their search experience where:

- **Dropdown** shows exact/navigation matches first
- **Search Page** shows comprehensive partial matches
- **Result counts** match quran.com

---

## Background & Problem Analysis

### The Problem

We observed differences between our search and quran.com:

1. **Dropdown Behavior**: Our dropdown always shows partial matches, while quran.com shows exact/navigation matches first
2. **Result Count Mismatch**:
   - "book of allah": Ours = 2073, Quran.com = ~115
   - "book of wisdom": Ours = 103, Quran.com = ~118
3. **Same Logic for Both**: We use identical search logic for dropdown and search page

### Root Cause

After analyzing both implementations:

| Aspect           | Our Current Implementation        | Quran.com Implementation                                   |
| ---------------- | --------------------------------- | ---------------------------------------------------------- |
| API Endpoint     | `api.qurancdn.com/api/qdc/search` | `api.quran.com/api/v4/search`                              |
| Search Mode      | No mode parameter                 | `mode=quick` for dropdown, `mode=advanced` for search page |
| exactMatchesOnly | Not used                          | Used in advanced mode                                      |
| Dropdown vs Page | Same function call                | Different API calls with different parameters              |

### API Response Comparison

**Our Current API (QDC):**

```
GET https://api.qurancdn.com/api/qdc/search?q=book%20of%20allah&size=10
Response: { result: { navigation: [], verses: [...] }, pagination: { total_records: 2073 } }
```

**Quran.com API (v4):**

```
GET https://api.quran.com/api/v4/search?q=book%20of%20allah&size=10
Response: { search: { query: "...", total_results: 10000, results: [...] } }
```

**Key Insight**: The APIs have different response structures AND different result counts.

---

## Current Code Analysis

### File: `lib/api/client.ts` (Lines 1-10)

```typescript
// Current API base URL
const API_BASE_URL = process.env['QURAN_API_BASE_URL'] ?? 'https://api.qurancdn.com/api/qdc';
```

### File: `lib/api/search.ts` - Current Implementation

```typescript
// Current comprehensiveSearch function (simplified)
export async function comprehensiveSearch(
  query: string,
  options: {
    size?: number;
    page?: number;
    translationId?: number;
    language?: string;
  } = {}
): Promise<SearchResponse> {
  const { size = 10, page = 1, translationId = 20, language = 'en' } = options;

  const data = await apiFetch<ApiSearchResponse>(
    'search',
    {
      q: query.trim(),
      size: size.toString(),
      page: page.toString(),
      translations: translationId.toString(),
      language,
      // ❌ MISSING: mode parameter
      // ❌ MISSING: exactMatchesOnly parameter
    },
    'Search failed'
  );
  // ...
}

// Current quickSearch - just calls comprehensiveSearch with size=20
export async function quickSearch(query: string, translationId = 20): Promise<SearchResponse> {
  return comprehensiveSearch(query, { size: 20, translationId });
}
```

### File: `app/(features)/search/hooks/usePaginatedSearch.ts`

```typescript
// Current usage - same function for search page
const searchResponse = await comprehensiveSearch(query, {
  page,
  size: PAGE_SIZE,
  translationId: settings.translationIds?.[0] ?? 20,
});
```

---

## Quran.com Reference Implementation

From quran.com's frontend repository (`src/utils/search.ts`):

```typescript
// Their SearchMode enum
export enum SearchMode {
  Advanced = 'advanced',
  Quick = 'quick',
}

// Their Quick Search (for dropdown)
export const getQuickSearchQuery = (
  query: string,
  perPage = 10,
  selectedTranslationIds: string[] = []
): SearchRequestParams<SearchMode.Quick> => {
  return {
    mode: SearchMode.Quick,
    query,
    getText: 1,
    highlight: 1,
    perPage,
    translationIds: selectedTranslationIds.join(','),
  };
};

// Their Advanced Search (for search page)
export const getAdvancedSearchQuery = (
  query: string,
  page: number,
  pageSize: number,
  selectedTranslationIds: string[] = []
): SearchRequestParams<SearchMode.Advanced> => {
  return {
    mode: SearchMode.Advanced,
    query,
    size: pageSize,
    page,
    exactMatchesOnly: 0, // 0 = include partial matches
    getText: 1,
    highlight: 1,
    translationIds: selectedTranslationIds.join(','),
  };
};
```

---

## Implementation Steps

### Step 1: Add Search Mode Support to API

**File to modify:** `lib/api/search.ts`

**Current Code (around line 16-43):**

```typescript
export type SearchNavigationType = 'surah' | 'ayah' | 'juz' | 'page' | 'search_page';

export interface SearchNavigationResult {
  resultType: SearchNavigationType;
  key: string | number;
  name: string;
}
```

**Target Code (add after the imports, before SearchNavigationType):**

```typescript
// ============================================================================
// Search Modes (matches quran.com implementation)
// ============================================================================

/**
 * Search mode determines how the API processes the query:
 * - Quick: Optimized for dropdown/autocomplete, favors navigation and exact matches
 * - Advanced: Full text search with partial matching for search results page
 */
export enum SearchMode {
  Quick = 'quick',
  Advanced = 'advanced',
}

export type SearchNavigationType = 'surah' | 'ayah' | 'juz' | 'page' | 'search_page';
// ... rest of types
```

**Update comprehensiveSearch function signature (around line 166-175):**

**Current:**

```typescript
export async function comprehensiveSearch(
  query: string,
  options: {
    size?: number;
    page?: number;
    translationId?: number;
    language?: string;
  } = {}
): Promise<SearchResponse> {
  const { size = 10, page = 1, translationId = 20, language = 'en' } = options;
```

**Target:**

```typescript
export async function comprehensiveSearch(
  query: string,
  options: {
    size?: number;
    page?: number;
    translationId?: number;
    language?: string;
    mode?: SearchMode;
    exactMatchesOnly?: boolean;
  } = {}
): Promise<SearchResponse> {
  const {
    size = 10,
    page = 1,
    translationId = 20,
    language = 'en',
    mode = SearchMode.Quick,
    exactMatchesOnly = false,
  } = options;
```

**Update the API call params (around line 191-201):**

**Current:**

```typescript
const data = await apiFetch<ApiSearchResponse>(
  'search',
  {
    q: query.trim(),
    size: size.toString(),
    page: page.toString(),
    translations: translationId.toString(),
    language,
  },
  'Search failed'
);
```

**Target:**

```typescript
const params: Record<string, string> = {
  q: query.trim(),
  size: size.toString(),
  page: page.toString(),
  translations: translationId.toString(),
  language,
  mode,
};

// Add exactMatchesOnly for advanced mode
if (mode === SearchMode.Advanced) {
  params.exactMatchesOnly = exactMatchesOnly ? '1' : '0';
}

const data = await apiFetch<ApiSearchResponse>('search', params, 'Search failed');
```

**Testing for Step 1:**

```bash
# After implementation, test in browser console or via API call:
# Quick mode should return navigation-focused results
# Advanced mode should return more comprehensive text matches
```

---

### Step 2: Update quickSearch Function

**File to modify:** `lib/api/search.ts`

**Current (around line 248-254):**

```typescript
/**
 * Quick search for autocomplete/dropdown - returns limited results faster.
 */
export async function quickSearch(query: string, translationId = 20): Promise<SearchResponse> {
  return comprehensiveSearch(query, { size: 20, translationId });
}
```

**Target:**

```typescript
/**
 * Quick search for autocomplete/dropdown.
 * Uses Quick mode which prioritizes navigation results and exact matches.
 * This is what appears in the dropdown when typing.
 */
export async function quickSearch(query: string, translationId = 20): Promise<SearchResponse> {
  return comprehensiveSearch(query, {
    size: 20,
    translationId,
    mode: SearchMode.Quick,
  });
}

/**
 * Advanced search for the search results page.
 * Uses Advanced mode with partial matching for comprehensive results.
 * This is what appears on the /search page after pressing Enter.
 */
export async function advancedSearch(
  query: string,
  options: {
    page?: number;
    size?: number;
    translationId?: number;
    language?: string;
  } = {}
): Promise<SearchResponse> {
  const { page = 1, size = 10, translationId = 20, language = 'en' } = options;

  return comprehensiveSearch(query, {
    size,
    page,
    translationId,
    language,
    mode: SearchMode.Advanced,
    exactMatchesOnly: false, // Include partial matches
  });
}
```

**Testing for Step 2:**

- Dropdown should still work with `quickSearch`
- New `advancedSearch` function should be available for search page

---

### Step 3: Update Search Page Hook

**File to modify:** `app/(features)/search/hooks/usePaginatedSearch.ts`

**Current import (line 5):**

```typescript
import { comprehensiveSearch, type SearchVerseResult } from '@/lib/api/search';
```

**Target import:**

```typescript
import { advancedSearch, type SearchVerseResult } from '@/lib/api/search';
```

**Current API call (around line 123-129):**

```typescript
// Get search results from API
const searchResponse = await comprehensiveSearch(query, {
  page,
  size: PAGE_SIZE,
  translationId: settings.translationIds?.[0] ?? 20,
});
```

**Target API call:**

```typescript
// Get search results from API using advanced search mode
// This provides comprehensive partial matching for the search results page
const searchResponse = await advancedSearch(query, {
  page,
  size: PAGE_SIZE,
  translationId: settings.translationIds?.[0] ?? 20,
});
```

**Testing for Step 3:**

- Navigate to `/search?query=book%20of%20allah`
- Result count should be different (closer to quran.com)
- Pagination should still work
- Highlighting should still work

---

### Step 4: Export SearchMode Enum

**File to modify:** `lib/api/search.ts`

Ensure SearchMode is exported at the end of the file for potential use elsewhere:

```typescript
// At the top of exports or in the existing export section
export { SearchMode };
// or if using named exports, it's already exported via the enum declaration
```

---

### Step 5: Verify and Compare Results

Manual testing checklist:

| Test Case            | Expected Dropdown                     | Expected Search Page                                 | Check |
| -------------------- | ------------------------------------- | ---------------------------------------------------- | ----- |
| Type "yasIn"         | Shows "Surah Ya-Sin" navigation first | Shows verses from Ya-Sin                             | ☐     |
| Type "2:255"         | Shows "Ayah 2:255" navigation         | Shows verse 2:255                                    | ☐     |
| Type "book of allah" | Shows ~10-20 most relevant verses     | Shows comprehensive results with count closer to 115 | ☐     |
| Type "juz 1"         | Shows "Juz 1" navigation              | N/A                                                  | ☐     |
| Press Enter on query | Navigates to /search page             | Shows paginated results                              | ☐     |
| Click pagination     | N/A                                   | Next page loads correctly                            | ☐     |

---

## API Response Structure Reference

### QDC API (`api.qurancdn.com/api/qdc/search`)

```typescript
interface QdcApiResponse {
  result: {
    navigation: Array<{
      result_type: string;
      key: string | number;
      name: string;
    }>;
    verses: Array<{
      verse_key: string;
      verse_id?: number;
      words: Array<{ char_type: string; text: string }>;
      translations: Array<{
        text: string;
        resource_id: number;
        resource_name: string;
        language_name: string;
      }>;
    }>;
  };
  pagination: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
  };
}
```

### V4 API (`api.quran.com/api/v4/search`)

```typescript
interface V4ApiResponse {
  search: {
    query: string;
    total_results: number;
    current_page: number;
    total_pages: number;
    results: Array<{
      verse_key: string;
      verse_id: number;
      text: string;
      highlighted: string | null;
      words: Array<{ char_type: string; text: string }>;
      translations: Array<{
        text: string;
        resource_id: number;
        name: string;
        language_name: string;
      }>;
    }>;
  };
}
```

**Note:** The response structures are different. If we switch to V4 API, we'll need to update the response parsing in `comprehensiveSearch`.

---

## Rollback Instructions

If any step causes issues:

### Rollback Step 1-2 (API changes):

1. Remove `SearchMode` enum
2. Remove `mode` and `exactMatchesOnly` from `comprehensiveSearch` options
3. Remove the params building logic, restore simple object

### Rollback Step 3 (Hook changes):

1. Change import back to `comprehensiveSearch`
2. Change function call back to `comprehensiveSearch`

---

## Files Modified Summary

| File                                                | Changes                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------- |
| `lib/api/search.ts`                                 | Add SearchMode enum, update comprehensiveSearch, add advancedSearch |
| `app/(features)/search/hooks/usePaginatedSearch.ts` | Use advancedSearch instead of comprehensiveSearch                   |

---

## Status Tracker

- [x] Step 1: Add Search Mode Support to API
- [x] Step 2: Update quickSearch and Add advancedSearch Functions
- [x] Step 3: Update Search Page Hook
- [ ] Step 4: Export SearchMode Enum
- [ ] Step 5: Verify and Compare Results

---

## Future Considerations

1. **Switch to V4 API**: If result counts still don't match, we may need to switch the base API endpoint from QDC to V4. This requires updating response parsing.

2. **Translation IDs**: Quran.com passes user-selected translation IDs. We could enhance this by passing multiple translations based on user settings.

3. **Client-side Relevance Sorting**: Additional sorting in the dropdown to prioritize exact phrase matches.

---

_Document Created: 2026-01-04_
_Last Updated: 2026-01-04_
_Author: AI Assistant (Gemini)_
