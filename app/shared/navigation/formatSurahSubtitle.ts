import type { Chapter } from '@/types';

type MinimalChapter = Pick<Chapter, 'revelation_place' | 'verses_count'>;

function formatRevelationPlace(place: string | undefined): string {
  if (!place) {
    return '';
  }

  const normalized = place.trim();
  if (!normalized) {
    return '';
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function formatSurahSubtitle(chapter: MinimalChapter): string {
  const placeLabel = formatRevelationPlace(chapter.revelation_place);
  const versesLabel = `${chapter.verses_count} verses`;

  return placeLabel ? `${placeLabel} - ${versesLabel}` : versesLabel;
}
