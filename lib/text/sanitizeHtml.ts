/**
 * Sanitize a string containing HTML and return a safe version.
 *
 * Important:
 * - This must be safe to execute during SSR (Vercel serverless runtime).
 * - Avoid DOM-based sanitizers (e.g. JSDOM) in SSR to prevent runtime module issues.
 *
 * The sanitizer is intentionally conservative:
 * - Only a small allowlist of tags is preserved.
 * - Attributes are stripped except a few safe ones on specific tags.
 * - Inline event handlers are always removed.
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string' || html.length === 0) return '';

  try {
    // 1) Remove dangerous tag bodies entirely.
    let safe = stripDangerousTagBodies(html);

    // 2) Keep only allowlisted tags, with allowlisted/sanitized attributes.
    safe = safe.replace(TAG_REGEX, sanitizeTagMatch);

    return safe;
  } catch {
    return '';
  }
}

const DANGEROUS_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'noscript'] as const;

const TAG_REGEX = /<\/?([a-zA-Z0-9]+)([^>]*)>/g;

const VOID_TAGS = new Set<string>(['br', 'img']);

const ALLOWED_TAGS = new Set<string>([
  'p',
  'br',
  'sup',
  'sub',
  'b',
  'strong',
  'i',
  'em',
  'u',
  'span',
  'img',
  'ul',
  'ol',
  'li',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  img: new Set(['src', 'alt', 'title', 'width', 'height']),
  span: new Set(['class', 'style']),
} as const;

function stripDangerousTagBodies(input: string): string {
  // Remove blocks like: <script ...> ... </script>
  const pattern = new RegExp(
    `<\\s*(${DANGEROUS_TAGS.join('|')})(?:\\s[^>]*)?>[\\s\\S]*?<\\s*\\/\\s*\\1\\s*>`,
    'gi'
  );
  let out = input.replace(pattern, '');

  // Also remove standalone dangerous start/end tags (in case of malformed HTML).
  const singleTag = new RegExp(`<\\/?\\s*(?:${DANGEROUS_TAGS.join('|')})(?:\\s[^>]*)?>`, 'gi');
  out = out.replace(singleTag, '');
  return out;
}

function sanitizeTagMatch(fullMatch: string, rawTagName: string, rawAttrs: string): string {
  const isClosing = fullMatch.startsWith('</');
  const tagName = String(rawTagName || '').toLowerCase();

  if (!ALLOWED_TAGS.has(tagName)) {
    return '';
  }

  if (isClosing) {
    return VOID_TAGS.has(tagName) ? '' : `</${tagName}>`;
  }

  const attrs = sanitizeAttributes(tagName, rawAttrs ?? '');
  return `<${tagName}${attrs}>`;
}

function sanitizeAttributes(tagName: string, rawAttrs: string): string {
  const allowed = ALLOWED_ATTRS[tagName];
  if (!allowed || !rawAttrs) return '';

  const attrs: Array<[string, string]> = [];
  const attrRegex = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const match of rawAttrs.matchAll(attrRegex)) {
    const rawName = match[1];
    if (!rawName) continue;

    const name = rawName.toLowerCase();
    if (name.startsWith('on')) continue;
    if (!allowed.has(name)) continue;

    const value = (match[2] ?? match[3] ?? match[4] ?? '').trim();

    const sanitized =
      name === 'src'
        ? sanitizeUrlAttribute(value)
        : name === 'class'
          ? sanitizeClassAttribute(value)
          : name === 'style'
            ? sanitizeStyleAttribute(value)
            : sanitizeTextAttribute(value);

    if (sanitized) {
      attrs.push([name, sanitized]);
    }
  }

  if (!attrs.length) return '';
  return ` ${attrs.map(([k, v]) => `${k}="${escapeAttr(v)}"`).join(' ')}`;
}

function sanitizeUrlAttribute(value: string): string {
  if (!value) return '';
  const v = value.trim();
  const lower = v.toLowerCase();

  // Disallow javascript: and other active content schemes.
  if (lower.startsWith('javascript:')) return '';
  if (lower.startsWith('data:')) return '';

  // Allow relative URLs and common safe schemes.
  if (lower.startsWith('/') || lower.startsWith('#') || lower.startsWith('.')) return v;
  if (lower.startsWith('https://') || lower.startsWith('http://')) return v;
  if (lower.startsWith('mailto:') || lower.startsWith('tel:')) return v;

  // If it's something else (e.g. "x"), keep it as-is (matches prior DOMPurify behavior).
  return v;
}

function sanitizeClassAttribute(value: string): string {
  if (!value) return '';
  const parts = value
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => /^[a-zA-Z0-9_-]+$/.test(p));
  return parts.length ? parts.join(' ') : '';
}

function sanitizeStyleAttribute(value: string): string {
  if (!value) return '';

  // Allow only `font-family` to support Mushaf fallback glyph wrapping.
  const declarations = value.split(';');
  const kept: string[] = [];

  for (const decl of declarations) {
    const [propRaw, ...rest] = decl.split(':');
    const prop = propRaw?.trim().toLowerCase();
    if (!prop) continue;
    const val = rest.join(':').trim();
    if (!val) continue;

    if (prop !== 'font-family') continue;

    // Keep a conservative set of characters; drop anything suspicious.
    if (!/^[a-zA-Z0-9\s,'"()-]+$/.test(val)) continue;

    kept.push(`font-family: ${val}`);
  }

  return kept.length ? kept.join('; ') : '';
}

function sanitizeTextAttribute(value: string): string {
  return value;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
