import { buildAudioUrl } from '@/lib/audio/reciters';

describe('buildAudioUrl', () => {
  it('builds correct URL for standard reciter paths', () => {
    const url = buildAudioUrl('1:1', 'AbdulBaset/Murattal');
    expect(url).toBe('https://verses.quran.com/AbdulBaset/Murattal/mp3/001001.mp3');
  });

  it('builds correct URL for fully-qualified reciter paths', () => {
    const url = buildAudioUrl('1:1', 'https://example.com/recitations/');
    expect(url).toBe('https://example.com/recitations/001001.mp3');
  });
});
