import { MushafWordText } from './MushafWordText';

import type { ReaderSettings } from './MushafMain.types';
import type { MushafLineGroup, MushafWord } from '@/types';
import type React from 'react';

type MushafReflowContentProps = {
    lines: MushafLineGroup[];
    settings: ReaderSettings;
    isQcfMushaf: boolean;
    isQpcHafsMushaf: boolean;
    isIndopakMushaf: boolean;
    qcfVersion: 'v1' | 'v2';
    indopakVersion?: '15' | '16' | null | undefined;
    fontSize: string | number;
    fontFamily: string;
    isFontLoaded: boolean;
};

/**
 * MushafReflowContent - Mobile reflow mode component
 *
 * This component is used ONLY on mobile when the mushaf content would overflow
 * the screen. Instead of keeping the line-by-line structure (which causes
 * single words to appear alone on lines), this flattens ALL words from all
 * lines into a single continuous paragraph-like flow.
 *
 * The words naturally fill each line before wrapping to the next, creating
 * a balanced, readable layout that fills the screen properly.
 */
export const MushafReflowContent = ({
    lines,
    settings,
    isQcfMushaf,
    isQpcHafsMushaf,
    isIndopakMushaf,
    qcfVersion,
    indopakVersion,
    fontSize,
    fontFamily,
    isFontLoaded,
}: MushafReflowContentProps): React.JSX.Element => {
    // Flatten all words from all lines into a single array
    const allWords: { word: MushafWord; lineKey: string; index: number }[] = [];

    lines.forEach((line) => {
        line.words.forEach((word, index) => {
            allWords.push({ word, lineKey: line.key, index });
        });
    });

    return (
        <div
            dir="rtl"
            className="w-full px-4"
            style={{
                fontFamily,
                fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
            }}
        >
            <div
                className="text-right leading-[1.8]"
                style={{
                    // Allow natural text wrapping
                    whiteSpace: 'normal',
                    wordBreak: 'keep-all', // Keep Arabic words intact
                    textAlign: 'justify', // Justify text to fill lines evenly
                    textAlignLast: 'right', // Last line aligned right (RTL)
                }}
                translate="no"
            >
                {allWords.map(({ word, lineKey, index }) => (
                    <MushafWordText
                        key={word.id ?? `${lineKey}-${word.verseKey ?? 'word'}-${word.position}-${index}`}
                        word={word}
                        settings={settings}
                        isQcfMushaf={isQcfMushaf}
                        isQpcHafsMushaf={isQpcHafsMushaf}
                        isIndopakMushaf={isIndopakMushaf}
                        qcfVersion={qcfVersion}
                        isFontLoaded={isFontLoaded}
                    />
                ))}
            </div>
        </div>
    );
};
