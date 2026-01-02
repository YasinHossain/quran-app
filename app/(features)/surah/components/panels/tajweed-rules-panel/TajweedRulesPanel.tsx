'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { SlideOverPanel } from '@/app/shared/components/SlideOverPanel';
import { SettingsPanelHeader } from '@/app/shared/resource-panel/components/ResourcePanelHeader';

interface TajweedRule {
    id: string;
    name: string;
    color: string;
    description: string;
    arabicExample?: string;
}

const TAJWEED_RULES: TajweedRule[] = [
    {
        id: 'silent-letter',
        name: 'Silent Letter',
        color: '#A5A5A5', // rgb(165, 165, 165) - gray
        description: 'Letters that are written but not pronounced. These are typically the Alif, Waw, or Ya that serve as elongation markers.',
        arabicExample: 'قَالُوا',
    },
    {
        id: 'normal-madd',
        name: 'Normal Madd (2)',
        color: '#CE9E00', // rgb(206, 158, 0) - orange/gold
        description: 'Natural elongation of 2 counts. This occurs when a long vowel (Alif, Waw, Ya) is not followed by a hamzah or sukun.',
        arabicExample: 'قَالَ',
    },
    {
        id: 'separated-madd',
        name: 'Separated Madd (2/4/6)',
        color: '#FF7B00', // rgb(255, 123, 0) - orange
        description: 'Elongation when a madd letter is followed by a hamzah in a separate word. Can be stretched 2, 4, or 5 counts.',
        arabicExample: 'فِي أَنفُسِهِم',
    },
    {
        id: 'connected-madd',
        name: 'Connected Madd (4/5)',
        color: '#F40000', // rgb(244, 0, 0) - red
        description: 'Elongation when a madd letter is followed by a hamzah in the same word. Stretched 4 to 5 counts.',
        arabicExample: 'جَاءَ',
    },
    {
        id: 'necessary-madd',
        name: 'Necessary Madd (6)',
        color: '#B50000', // rgb(181, 0, 0) - dark red
        description: 'Obligatory elongation of 6 counts. Occurs when a madd letter is followed by a sukun in the same word.',
        arabicExample: 'الْحَاقَّةُ',
    },
    {
        id: 'ghunna',
        name: 'Ghunna/Ikhfa\'',
        color: '#09B000', // rgb(9, 176, 0) - green
        description: 'Nasal sound produced when pronouncing Noon or Meem with shaddah, or during Idgham and Ikhfa rules.',
        arabicExample: 'مِن مَّاء',
    },
    {
        id: 'qalqala',
        name: 'Qalqala (Echo)',
        color: '#2FADFF', // rgb(47, 173, 255) - light blue
        description: 'A slight bouncing or echoing sound when pronouncing the Qalqala letters (ق ط ب ج د) with sukun.',
        arabicExample: 'يَخْلُقْ',
    },
    {
        id: 'tafkhim',
        name: 'Tafkhim (Heavy)',
        color: '#3F48E6', // rgb(63, 72, 230) - blue/purple
        description: 'Heavy or emphatic pronunciation of certain letters. The tongue rises towards the palate creating a fuller sound.',
        arabicExample: 'صَلَاة',
    },
];

interface TajweedRulePanelProps {
    isOpen: boolean;
    onClose: () => void;
    onCloseSidebar?: () => void;
}

const TajweedRuleItem = ({ rule }: { rule: TajweedRule }): React.JSX.Element => {
    return (
        <div className="p-4">
            <div className="flex items-start gap-3">
                {/* Color indicator */}
                <div className="flex-shrink-0 mt-1.5">
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: rule.color }}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium text-foreground">
                            {rule.name}
                        </h3>
                        {rule.arabicExample && (
                            <span
                                className="text-lg text-foreground/80"
                                style={{ fontFamily: 'var(--font-arabic, "Amiri Quran", serif)' }}
                            >
                                {rule.arabicExample}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-foreground/60 leading-relaxed">
                        {rule.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const TajweedRulesPanel = ({
    isOpen,
    onClose,
    onCloseSidebar,
}: TajweedRulePanelProps): React.JSX.Element => {
    const { t } = useTranslation();

    return (
        <SlideOverPanel isOpen={isOpen} testId="tajweed-rules-panel">
            <SettingsPanelHeader
                title={t('tajweed_rules') === 'tajweed_rules' ? 'Tajweed Rules' : t('tajweed_rules')}
                onClose={onClose}
                {...(onCloseSidebar ? { onCloseSidebar } : {})}
                backIconClassName="h-6 w-6 text-foreground"
            />
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto">
                    {/* Quick Reference - at top */}
                    <div className="px-4 pt-4 pb-3">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                Quick Color Reference
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {TAJWEED_RULES.map((rule) => (
                                    <div key={rule.id} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: rule.color }}
                                        />
                                        <span className="text-xs text-foreground/80 truncate">
                                            {rule.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Rules list */}
                    <div className="px-4 pb-6 space-y-2">
                        {TAJWEED_RULES.map((rule) => (
                            <TajweedRuleItem key={rule.id} rule={rule} />
                        ))}
                    </div>
                </div>
            </div>
        </SlideOverPanel>
    );
};

