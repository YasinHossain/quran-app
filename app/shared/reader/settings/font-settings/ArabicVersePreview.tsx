import React from 'react';

interface ArabicVersePreviewProps {
  fontFamily: string;
  fontSize?: number;
  className?: string;
}

/**
 * A shared component to display a preview of an Arabic verse with a specific font.
 * Used in font settings and font selection panels.
 */
export function ArabicVersePreview({
  fontFamily,
  fontSize = 32,
  className = '',
}: ArabicVersePreviewProps): React.JSX.Element {
  return (
    <div className={className}>
      <p
        dir="rtl"
        className="text-foreground leading-loose text-center"
        style={{
          fontSize: `${fontSize}px`,
          fontFamily,
        }}
      >
        ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ
      </p>
    </div>
  );
}
