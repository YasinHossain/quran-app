/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import React from 'react';

import { HybridVerseMarker, VerseMarker } from '@/app/shared/components/verse-marker/VerseMarker';

describe('VerseMarker', () => {
  it('returns null when the current font has a native ornament', () => {
    const { container } = render(<VerseMarker verseNumber={1} fontFamily="UthmanicHafs1Ver18" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the native marker for QPC Uthmani Hafs', () => {
    render(<HybridVerseMarker verseNumber={1} fontFamily="UthmanicHafs1Ver18" />);
    expect(screen.getByText('١')).toBeInTheDocument();
  });

  it('renders a lightweight text marker without SVG for non-native fonts', () => {
    const { container } = render(
      <HybridVerseMarker verseNumber={12} fontFamily="Scheherazade New" />
    );

    expect(screen.getByLabelText('Verse 12')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeNull();
    expect(container.textContent).toContain('١٢');
  });
});
