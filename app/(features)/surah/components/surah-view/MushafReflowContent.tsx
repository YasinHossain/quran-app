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
 * MushafReflowContent - Mobile reflow mode component (quran.com style)
 *
 * Based on quran.com's approach: when text would overflow on mobile,
 * use centered text with words displayed inline. Words flow naturally
 * and wrap to fill the screen.
 */
export const MushafReflowContent = ({
    lines,
    settings,
    isQcfMushaf,
    isQpcHafsMushaf,
    isIndopakMushaf,
    qcfVersion,
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
            className="w-full"
            style={{
                fontFamily,
                fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
            }}
        >
            {/* Container with centered text - like quran.com's .mobileCenterText */}
            <div
                className="leading-[1.8] mx-auto"
                style={{
                    textAlign: 'center',
                    direction: 'rtl',
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



