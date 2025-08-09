export interface Reciter {
  id: number;
  name: string;
  path: string;
}

export const RECITERS: Reciter[] = [
  { id: 2, name: 'Abdul Basit (Murattal)', path: 'AbdulBaset/Murattal' },
  { id: 1, name: 'Abdul Basit (Mujawwad)', path: 'AbdulBaset/Mujawwad' },
  { id: 7, name: 'Mishari Rashid Alafasy', path: 'Alafasy' },
  { id: 3, name: 'Abdurrahman as-Sudais', path: 'Sudais' },
  { id: 4, name: 'Abu Bakr al-Shatri', path: 'Shatri' },
];

export function buildAudioUrl(verseKey: string, reciterPath: string): string {
  const [surah, ayah] = verseKey.split(':').map((s) => s.padStart(3, '0'));
  if (reciterPath.startsWith('http') || reciterPath.startsWith('//')) {
    return `${reciterPath}${surah}${ayah}.mp3`;
  }
  return `https://verses.quran.com/${reciterPath}/mp3/${surah}${ayah}.mp3`;
}
