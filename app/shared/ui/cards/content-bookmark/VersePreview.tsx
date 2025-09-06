import React, { memo } from 'react';

import { sanitizeHtml } from '@/lib/text/sanitizeHtml';
import { applyTajweed } from '@/lib/text/tajweed';

interface VersePreviewProps {
  verseText?: string;
  translation?: string;
  arabicFontFace: string;
  arabicFontSize: number;
  tajweed?: boolean;
}

export const VersePreview = memo(function VersePreview({
  verseText,
  translation,
  arabicFontFace,
  arabicFontSize,
  tajweed = false,
}: VersePreviewProps) {
  return (
    <div className="space-y-2">
      {verseText && (
        <div className="text-right">
          <p
            dir="rtl"
            className="text-foreground leading-relaxed text-lg line-clamp-2"
            style={{
              fontFamily: arabicFontFace,
              fontSize: `${Math.min(arabicFontSize, 20)}px`,
              lineHeight: 1.8,
            }}
            dangerouslySetInnerHTML={{
              __html: tajweed ? sanitizeHtml(applyTajweed(verseText)) : sanitizeHtml(verseText),
            }}
          />
        </div>
      )}
      {translation && (
        <div>
          <p
            className="text-left leading-relaxed text-muted line-clamp-2 text-sm"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(translation) }}
          />
        </div>
      )}
    </div>
  );
});
