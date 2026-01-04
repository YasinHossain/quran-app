const TOTAL_QURAN_VERSES = 6236;

interface EstimateVerseTotalOptions {
  totalPages: number;
  pageSize: number;
  reportedTotal?: number;
  currentPage?: number;
  currentPageCount?: number;
}

export function estimateVerseTotal({
  totalPages,
  pageSize,
  reportedTotal = 0,
  currentPage,
  currentPageCount,
}: EstimateVerseTotalOptions): number {
  if (!Number.isFinite(totalPages) || totalPages <= 0) return 0;
  if (!Number.isFinite(pageSize) || pageSize <= 0) return 0;

  let totalFromPages = totalPages * pageSize;

  if (
    typeof currentPage === 'number' &&
    typeof currentPageCount === 'number' &&
    currentPage === totalPages &&
    currentPageCount >= 0
  ) {
    totalFromPages = (totalPages - 1) * pageSize + currentPageCount;
  }

  let total = totalFromPages;
  if (reportedTotal > 0 && reportedTotal <= totalFromPages) {
    total = reportedTotal;
  }

  return Math.min(total, TOTAL_QURAN_VERSES);
}
