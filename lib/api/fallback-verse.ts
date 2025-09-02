import { Verse } from '@/types';

// Fallback verse data for when API is unavailable
// Ayat al-Kursi (2:255) - A well-known verse
export const fallbackVerse: Verse = {
  id: 262,
  verse_key: '2:255',
  text_uthmani:
    'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ',
  translations: [
    {
      id: 20,
      resource_id: 20,
      text: 'Allah - there is no deity except Him, the Ever-Living, the Self-Sustaining. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    },
  ],
  words: [
    { id: 1, uthmani: 'ٱللَّهُ', en: 'Allah' },
    { id: 2, uthmani: 'لَآ', en: 'no' },
    { id: 3, uthmani: 'إِلَٰهَ', en: 'deity' },
    { id: 4, uthmani: 'إِلَّا', en: 'except' },
    { id: 5, uthmani: 'هُوَ', en: 'Him' },
    { id: 6, uthmani: 'ٱلْحَىُّ', en: 'the Ever-Living' },
    { id: 7, uthmani: 'ٱلْقَيُّومُ', en: 'the Self-Sustaining' },
    // Truncated for brevity - in a real implementation, you'd include all words
  ],
};

export const fallbackVerses: Verse[] = [
  fallbackVerse,
  // Add more fallback verses as needed
];
