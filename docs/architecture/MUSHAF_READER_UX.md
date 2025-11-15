# Mushaf Reader — UX & Layout Spec

Authoritative description of how the Mushaf reading experience should behave in the Surah/Juz/Page reader.  
This document is written so that a future implementation can follow it directly without re‑designing the UX.

The goal is to:

- Add a **Mushaf reading mode** (page‑style Arabic view, no verse cards).
- Keep the **center column clean** (no always‑visible heavy controls).
- Re‑use the **existing settings sidebar patterns** (tabs, sections, slide‑in lists).
- Make it easy to **plug in actual mushaf data later** (Unicode, image‑based, etc.).

---

## 1. High‑Level Concept

### 1.1 Modes

- The reader has two high‑level modes for Surah/Juz/Page routes:
  - **Verse mode** – current experience: verse cards with translations, wbw, audio, etc.
  - **Mushaf mode** – page‑view of the Quran text only (Unicode mushaf initially).
- Only **one mode is active at a time**.
- Mode affects **only the center column content**, not navigation rails or global layout.

### 1.2 Where Mushaf lives

- Mushaf is treated as a **reading preference**, not navigation.
- All selection and configuration for Mushaf live in the **right settings sidebar**, inside:
  - A `Mushaf settings` section.
  - A `Select mushaf` field that opens a full list panel, similar to Translations.
- The center column shows:
  - Verse cards in Verse mode.
  - Page‑style Mushaf view in Mushaf mode.

---

## 2. Layout Overview (Desktop & Mobile)

The Mushaf experience must obey the three‑column system described in  
`docs/architecture/THREE_COLUMN_LAYOUT_GUIDE.md`.

### 2.1 Desktop

- **Left column**: `SurahWorkspaceNavigation`
  - Surah/Juz/Page navigation, search, last‑read, etc.
  - Unchanged by Mushaf mode.

- **Center column**: main reading content
  - Verse mode: `SurahMain` (existing verse cards).
  - Mushaf mode: `MushafMain` (new page‑view component, added later).

- **Right column**: `SettingsSidebarContent` (desktop settings panel)
  - Hosts `SettingsSidebarContent` for desktop (no overlay).
  - Contains tabs: `Translation` | `Mushaf`.
  - Under `Mushaf` tab, the Mushaf settings live at the very top.

### 2.2 Mobile

- **Left overlay**: `SurahListSidebar` (unchanged).
- **Right overlay**: `SettingsSidebar`
  - Opens via the existing header/settings entry point.
  - Contains the same `Translation` | `Mushaf` tabs and sections as desktop.

Mushaf mode **does not change how sidebars mount**; it only changes what the center column renders and what appears inside the right rail.

---

## 3. User Flows

### 3.1 Entering Mushaf mode

1. User is on a Surah/Juz/Page route in **Verse mode**.
2. User opens the **Settings panel** (via the existing header “Settings” trigger).
3. In the Settings sidebar, user switches from the **`Translation` tab** to the **`Mushaf` tab**.
4. When the `Mushaf` tab becomes active:
   - The center column **immediately switches to Mushaf mode**.
   - The visible mushaf in the center is either:
     - The **previously selected mushaf**, if the user has chosen one before; or
     - A **default mushaf** (e.g. “Unicode – Uthmani 15‑line”).
5. The Mushaf tab content shows the `Mushaf settings` section (see 4.1), including the `Select mushaf` field.

Notes:

- `useSettingsTabState` already exposes `onReadingPanelOpen`.  
  In Mushaf mode, this callback should:
  - Set the **reader mode** to `'mushaf'`.
  - Trigger any necessary data loading for Mushaf view.

### 3.2 Returning to Verse mode

There are two ways to go back to verse cards:

1. **Header mode switch (recommended)**  
   - A simple toggle in the reader header: `Verse | Mushaf`.
   - Selecting `Verse`:
     - Sets reader mode to `'verse'`.
     - Leaves the Settings tab unchanged (user can still be on the Mushaf tab while viewing verse cards).

2. **Optional coupling with tabs (secondary)**  
   - When the user switches back to the `Translation` tab in the Settings sidebar,  
     the implementation may optionally:
     - Set reader mode back to `'verse'`.
   - Whether this coupling is enabled should be a deliberate choice during implementation.

### 3.3 Selecting a Mushaf

1. User is in **Mushaf mode** (center shows Mushaf view).
2. Settings sidebar is open and the **`Mushaf` tab** is active.
3. At the top of the Mushaf tab, user sees:
   - `Mushaf settings` accordion (expanded by default on first open).
   - Inside it, a `Select mushaf` field with:
     - A label (e.g. “Mushaf”).
     - A **box showing the currently selected mushaf name**,  
       matching the style of Translation / Word‑by‑Word selectors.
4. User taps/clicks the **select box**.
5. A **slide‑in panel from the right** appears:
   - Title: “Select mushaf”.
   - Body: a scrollable list of mushaf options (see 5.2).
   - Single‑selection (radio buttons).
6. User picks one mushaf:
   - The selection is **immediately applied**:
     - Center column re‑renders the new mushaf.
     - `Settings.selectedMushafId` (or equivalent) is updated.
   - The slide‑in panel closes.
   - The `Select mushaf` box now shows the new mushaf name.

### 3.4 Persisted choice

- The last selected mushaf should be **remembered between sessions**,  
  using the same persistence mechanism as other `Settings` fields (local storage / API).
- On first load for a user with no mushaf preference:
  - Use a **single default mushaf**, e.g. `unicode-default`.

---

## 4. Settings Sidebar Structure

### 4.1 Tabs

- Tabs are driven by `useSettingsTabState`:
  - `value: 'translation'` → label `Translation`
  - `value: 'reading'` → label `Mushaf`
- Behaviour:
  - Initial tab: `translation`.
  - When the tab changes to `'reading'`, `onReadingPanelOpen` is called and **reader mode is set to `'mushaf'`**.

### 4.2 Translation tab (unchanged)

Inside `Translation` tab, keep the current order:

1. Translation settings section:
   - Translation selector (opens translation list panel).
   - Word‑by‑Word language selector.
2. Tafsir settings section (optional per page).
3. Font settings section.

No Mushaf controls appear in this tab.

### 4.3 Mushaf tab (new content)

When `activeTab === 'reading'`, instead of the current placeholder text, the content becomes:

1. **`Mushaf settings` accordion section**
   - Expanded by default when entering the tab.
   - Contains:
     - `Select mushaf` field
       - Label: “Mushaf”.
       - Value box:
         - Shows `selectedMushafName` (e.g. “Unicode – IndoPak 16‑line”).
         - Matches styling of translation/word‑by‑word boxes (semantic tokens only).
         - Clicking opens the Mushaf list slide‑in panel (single‑select, like the Word‑by‑Word language selector).

2. **Future sub‑settings (later)**
   - These are not implemented immediately but the section should leave room for:
     - Line layout (e.g. 15‑line vs 16‑line) when a mushaf supports variants.
     - Optional toggles (e.g. “Show tajweed colors” for Unicode mushaf).
   - The structure should not prevent adding those controls underneath the selector.

Note: For MVP, only the top `Mushaf settings` accordion with `Select mushaf` is required.

---

## 5. Data & State Model (Implementation‑Oriented)

> This section is for the future implementation. It describes **where** new state should live so the code stays aligned with the rest of the reader architecture.

### 5.1 Types

- Extend `Settings` with Mushaf fields:

```ts
// types/settings.ts (future)
export interface Settings {
  // existing fields...
  tajweed: boolean;

  // new fields
  mushafId?: string; // e.g. 'unicode-default', 'unicode-indopak-16'
}
```

- Introduce a `MushafOption` type:

```ts
export interface MushafOption {
  id: string; // stable id, used in Settings.mushafId
  name: string; // display name, shown in selectors
  description?: string; // optional short description
  script?: 'uthmani' | 'indopak' | 'tajweed' | string;
  lines?: 15 | 16 | number;
  // more metadata can be added later (e.g., source, assets, isUnicode)
}
```

### 5.2 Mushaf options source

- Similar to the Word‑by‑Word language options:
  - A **static list** or fetched configuration that maps to `MushafOption[]`.
  - The list should be owned by the Surah feature (e.g. under `data/` or `src/domain`), not hard‑coded inside components.
- For the first implementation, it is enough to have:
  - One Unicode mushaf option (e.g. `unicode-default`).
  - Additional options can be appended later without changing the UI contracts.

### 5.3 Reader mode state

- Introduce a simple view mode in the reader:

```ts
type ReaderMode = 'verse' | 'mushaf';
```

- Recommended ownership:
  - `useVerseListing` remains responsible for **verse data + settings**.
  - A thin wrapper (e.g. inside `useReaderView`) owns:
    - `mode: ReaderMode`
    - `setMode(mode: ReaderMode)`
  - `ReaderShell` passes `mode` down to the center content so it can render:
    - `SurahMain` for `'verse'`.
    - `MushafMain` for `'mushaf'` (to be implemented later).

- Connection to the sidebar:
  - `useSettingsTabState` uses `onReadingPanelOpen` to call `setMode('mushaf')`.
  - Header mode toggle (when added) calls `setMode('verse' | 'mushaf')` directly.

### 5.4 Panels state for Mushaf selector

- Extend `useSurahPanels` with Mushaf data later:
  - `selectedMushafName: string`
  - `mushafOptions: MushafOption[]` (or read from verse listing / settings context).
  - `isMushafPanelOpen: boolean`
  - `openMushafPanel`, `closeMushafPanel`
  - `onMushafChange(id: string)`

- `SettingsSidebar` (mobile overlay) and `SettingsSidebarContent` (desktop column) pass these down so:
  - `SettingsContent` in Mushaf tab can show:
    - The `Select mushaf` box with `selectedMushafName`.
  - `SettingsPanels` can render a `MushafSelectionPanel` slide‑in with:
    - `isMushafPanelOpen`
    - `onMushafChange`
    - `onClose`

Implementation detail: the Mushaf list slide‑in should mirror the patterns used for the Word‑by‑Word language selection panel (same animation, dismiss behaviour, and single‑select behaviour).

---

## 6. Visual & Interaction Notes

- **Single mushaf at a time**
  - Only one mushaf is active. The slide‑in list uses **radio buttons**, not checkboxes.

- **Immediate feedback**
  - Changing the mushaf in the list instantly updates the center view, even before the panel is closed (though the panel should close automatically after selection).

- **Accessibility**
  - Slide‑in mushaf panel:
    - `role="dialog"` with `aria-modal="true"`.
    - Focus should move into the panel when it opens and return to the `Select mushaf` field when it closes.
  - Keyboard:
    - Up/Down arrows navigate the list.
    - Enter/Space activates the selected option.
    - Esc closes the panel without changing selection.

- **Styling**
  - Use semantic tokens only (`bg-surface`, `text-foreground`, `border-border`, etc.).
  - The `Select mushaf` box should visually match the existing translation/word‑by‑word selector components for consistency.

---

## 7. Open Questions / Future Enhancements

These are intentionally left for later iterations and **should not block** the initial integration:

- Exact visual representation of mushaf options in the list:
  - Plain text vs. small thumbnail preview.
  - Showing script/line info as secondary text.
- Support for **image‑based mushaf pages** vs. Unicode‑only initial release.
- Per‑mushaf overrides:
  - Some mushaf types may lock certain settings (e.g., line count, font size).
- Sharing mode/mushaf choice across routes:
  - Whether selecting Mushaf in Surah view should also apply to Juz/Page views automatically.

The implementation should follow this spec closely so these enhancements can be added without breaking the structure.
