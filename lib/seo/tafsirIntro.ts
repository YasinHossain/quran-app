/**
 * The opening of a tafsir's commentary on a surah (its text for verse 1), as plain-text blocks for
 * the surah overview page. Tafsir HTML differs per language:
 * - English Ibn Kathir: `<h2>` headings ("The Virtues of Surat Al-Mulk") and short `<p>`s.
 * - Bangla: one long `<p>`.
 * - Urdu/Arabic: `<div>`/`<p>` with inline `<span>`s, sometimes text before the first block.
 * Output is plain text only (React escapes it); no tafsir HTML is rendered.
 */

export interface TafsirIntroBlock {
  kind: 'heading' | 'paragraph';
  text: string;
}

export interface TafsirIntro {
  blocks: TafsirIntroBlock[];
  /** True when the commentary continues beyond the excerpt. */
  truncated: boolean;
}

const HEADING = /<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi;
const BLOCK_BOUNDARY = /<\/?(?:p|div|br|li|ul|ol|blockquote|section|table|tr)\b[^>]*>/gi;
const TAG = /<[^>]+>/g;
const HEADING_MARK = '\u0000H\u0000';
/** Sentence ends in English, Bangla/Hindi (।), Urdu (۔) and Arabic (؟). */
const LEAD_IN = /[:,،؛]\s*$/;
const SENTENCE_END = /[.!?।۔؟](?:["'”’»)\]]*)(?=\s|$)/g;

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const code =
        entity[1] === 'x' || entity[1] === 'X'
          ? Number.parseInt(entity.slice(2), 16)
          : Number(entity.slice(1));
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

const clean = (text: string): string =>
  decodeEntities(text.replace(TAG, '')).replace(/\s+/g, ' ').trim();

/** All blocks of the tafsir text, in order. */
export function toTafsirBlocks(html: string): TafsirIntroBlock[] {
  const marked = html
    .replace(HEADING, (_, inner: string) => `\n\n${HEADING_MARK}${clean(inner)}\n\n`)
    .replace(BLOCK_BOUNDARY, '\n\n');
  return marked
    .split(/\n{2,}/)
    .map((chunk): TafsirIntroBlock | null => {
      const isHeading = chunk.startsWith(HEADING_MARK);
      const text = clean(isHeading ? chunk.slice(HEADING_MARK.length) : chunk);
      if (!text) return null;
      return { kind: isHeading ? 'heading' : 'paragraph', text };
    })
    .filter((block): block is TafsirIntroBlock => block !== null);
}

/** `text` cut to at most `max` characters, at a sentence end when one is close, else a word. */
function cutText(text: string, max: number): string {
  if (text.length <= max) return text;
  let sentenceEnd = 0;
  for (const match of text.matchAll(SENTENCE_END)) {
    const end = (match.index ?? 0) + match[0].length;
    if (end > max) break;
    sentenceEnd = end;
  }
  if (sentenceEnd >= max * 0.5) return text.slice(0, sentenceEnd).trim();
  const space = text.lastIndexOf(' ', max);
  return `${text.slice(0, space > 0 ? space : max).trim()}…`;
}

/**
 * The first `maxChars` characters of paragraph text (headings are kept but not counted), cut at a
 * sentence end. Trailing headings without a paragraph are dropped.
 */
export function buildTafsirIntro(html: string | undefined, maxChars = 1200): TafsirIntro | null {
  if (!html) return null;
  const all = toTafsirBlocks(html);
  const blocks: TafsirIntroBlock[] = [];
  let used = 0;
  let cut = false;
  let next = 0;

  for (; next < all.length; next += 1) {
    const block = all[next]!;
    if (block.kind === 'heading') {
      blocks.push(block);
      continue;
    }
    const room = maxChars - used;
    // Stop rather than add a tiny fragment of the next paragraph.
    if (used > 0 && room < 80) break;
    const text = cutText(block.text, room);
    blocks.push({ kind: 'paragraph', text });
    used += text.length;
    if (text.length < block.text.length) {
      cut = true;
      next += 1;
      break;
    }
  }
  const truncated = cut || all.slice(next).some((block) => block.kind === 'paragraph');

  if (truncated) trimDanglingEnd(blocks, all);
  while (blocks.at(-1)?.kind === 'heading') blocks.pop();
  return blocks.some((block) => block.kind === 'paragraph') ? { blocks, truncated } : null;
}

/**
 * When the excerpt stops early, don't end on something whose continuation was left out:
 * - an Arabic quotation inside a non-Arabic tafsir (its translation follows it in the source);
 * - a lead-in ("…the Messenger of Allah said,"): cut back to the sentence before it, or drop the
 *   block when it has no earlier sentence.
 */
function trimDanglingEnd(blocks: TafsirIntroBlock[], all: ReadonlyArray<TafsirIntroBlock>): void {
  const paragraphs = (): number => blocks.filter((block) => block.kind === 'paragraph').length;
  const arabicTafsir = isMostlyArabic(
    all
      .filter((block) => block.kind === 'paragraph')
      .map((block) => block.text)
      .join(' ')
  );
  for (;;) {
    const last = blocks.at(-1);
    if (!last) return;
    const canDrop = paragraphs() > 1;
    if (last.kind === 'heading') {
      blocks.pop();
      continue;
    }
    if (!arabicTafsir && isMostlyArabic(last.text)) {
      if (!canDrop) return;
      blocks.pop();
      continue;
    }
    if (!LEAD_IN.test(last.text)) return;
    const before = lastSentence(last.text);
    if (before) {
      blocks[blocks.length - 1] = { kind: 'paragraph', text: before };
      return;
    }
    if (!canDrop) return;
    blocks.pop();
  }
}

/** `text` up to (and including) its last sentence end, or `null` when it has none. */
function lastSentence(text: string): string | null {
  let end = 0;
  for (const match of text.matchAll(SENTENCE_END)) end = (match.index ?? 0) + match[0].length;
  return end > 0 ? text.slice(0, end).trim() : null;
}

const ARABIC_LETTER = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
const LETTER = /\p{L}/gu;

/** True when most letters are Arabic script (a quoted hadith or verse inside a non-Arabic tafsir). */
export function isMostlyArabic(text: string): boolean {
  const letters = text.match(LETTER)?.length ?? 0;
  const arabic = text.match(ARABIC_LETTER)?.length ?? 0;
  return letters > 0 && arabic / letters > 0.6;
}
