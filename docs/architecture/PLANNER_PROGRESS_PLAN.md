# Planner Card Progress: Spec and Implementation Plan

This document defines the desired behaviour for the Planner Card when tracking progress across a group of consecutive surahs (e.g. Surah 1–5) and outlines the implementation used in the app.

Goals

- Correct “Currently at” display for single- and multi‑surah plans.
- Proper Completed/Remaining metrics and progress bar for grouped plans.
- Daily Focus (sessions) computed across the entire group using estimated days.

Definitions

- Plan: A single-surah entry (surahId, targetVerses, completedVerses, estimatedDays, …).
- Plan Group: A sequence of plans with the same display name and consecutive surah IDs.
- Aggregated Plan (virtual): Sum of target/completed across plans in a group, used for progress/statistics and daily focus.

1. Currently At

- Semantics: “Currently at” shows the last completed verse, not the next verse to start.
- Single plan: current = max(1, min(completedVerses, targetVerses)).
- Grouped plan: Use the aggregated completed count mapped onto the correct surah/verse:
  - Compute aggregated currentVerse (clamped as above).
  - Map that global verse number to a (surahId, verse) position inside the group for display purposes.
- Secondary details: Page/Juz are derived from the current position using the group’s page range when available.

Implemented in

- Current metrics: `app/(features)/bookmarks/planner/utils/plannerCard/progress.ts`
- Group details: `app/(features)/bookmarks/planner/utils/buildPlannerGroupCard.ts`

2. Completed / Remaining / Progress

- Grouped plans display totals across the group:
  - target = sum of targetVerses for all plans in the group.
  - completed = sum of min(completedVerses, targetVerses) per plan.
  - percent = round((completed / target) \* 100), clamped [0..100].
- Pages and Juz are estimated proportionally from verses using the group’s combined page bounds when available.

User Action Semantics

- When saving a verse from a surah inside a group (e.g., Surah 2:75 for group 1–5):
  - All earlier surahs in the group are implicitly complete (completedVerses = targetVerses).
  - The selected surah is set to the saved verse (clamped to targetVerses).
  - Later surahs remain unchanged.
- This matches the mental model: “I have completed up to this verse across the plan range.”

Implemented in

- Save cascade: `app/shared/verse-planner-modal/AddToPlannerModal.tsx` (find containing group; update earlier plans + the selected plan).

3. Today’s Focus (Fixed Sessions)

- Daily Focus is computed across the aggregated plan using fixed session boundaries:
  - estimatedDays: If any plan in the group has a positive `estimatedDays`, we normalize and use it for the group; otherwise fallback to default.
  - versesPerDay = ceil(aggregatedTargetVerses / estimatedDays) when both are positive.
  - Define sessions as buckets of size `versesPerDay`: [1..vpd], [vpd+1..2vpd], …
  - Daily goal window is the remainder of the current session:
    - start = completed + 1 (next verse after the last completed)
    - end = min(target, ceil(start / vpd) \* vpd)
  - Highlight details: page/juz labels derived from group’s page range resolver; verse count shows remaining verses in the session.
  - Remaining/Ends at: computed from remaining verses and `versesPerDay` across the group.
- Labeling: If the daily window spans multiple surahs, show a cross-surah label (e.g., “Al‑Baqarah 2:76 – Ali ‘Imran 3:10”).

Implemented in

- Aggregated focus: `app/(features)/bookmarks/planner/utils/buildPlannerGroupCard.ts` (uses `getEstimatedDays`, `getVersesPerDay`, `buildDailyGoalWindow` with the aggregated plan and group page metrics; formats the label using the group-aware formatter).

Edge Cases

- Zero targets: Show 0% and “No progress tracked”.
- Missing page metadata: Page/Juz labels may be null; UI hides null values cleanly.
- All complete: Daily Focus shows “All daily goals completed”.

Example: Surah 1–5 over 10 days

- Suppose total verses across 1–5 is T and estimatedDays = 10.
- versesPerDay = ceil(T / 10).
- If the user saves Surah 2:75, then:
  - Surah 1 is marked fully complete.
  - Surah 2 is marked up to 75.
  - Completed = verses(1) + 75.
  - Remaining = T − Completed.
  - Daily Focus shows the remainder of the current fixed session bucket from the aggregated position.

Validation Checklist

- Currently At reflects last completed verse across the group.
- Completed/Remaining and % update after a single save (cascade earlier surahs).
- Daily Focus range shows a single-surah or cross‑surah span as needed.
- Progress bar and stats match aggregated totals.
