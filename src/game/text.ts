const GARBLED = /\{\{(.+?)\}\}/g;

/** Délka repliky bez značek {{…}} (pro postupné vypisování). */
export function plainLength(text: string): number {
  return text.replace(GARBLED, '$1').length;
}

/** Text pro čtečku obrazovky. */
export function plainText(text: string): string {
  return text.replace(GARBLED, '(nečitelné)');
}

export type Segment = { kind: 'text' | 'glyph'; value: string; start: number };

/** Rozdělí repliku na čitelné části a nečitelná slova. */
export function segments(text: string): Segment[] {
  const out: Segment[] = [];
  const re = new RegExp(GARBLED);
  let pos = 0;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) {
      const value = text.slice(last, m.index);
      out.push({ kind: 'text', value, start: pos });
      pos += value.length;
    }
    out.push({ kind: 'glyph', value: m[1], start: pos });
    pos += m[1].length;
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ kind: 'text', value: text.slice(last), start: pos });
  return out;
}

/** České skloňování podle počtu: 1 tah, 2 tahy, 5 tahů. */
export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return few;
  return many;
}

const SUB = '₀₁₂₃₄₅₆₇₈₉';
const SUP: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  'ⁿ': 'n',
  'ⁱ': 'i',
  'ᵏ': 'k',
};

export type RichPart = { kind: 'text' | 'sub' | 'sup'; value: string } | { kind: 'arrow'; dir: 'left' | 'right' };

/**
 * Rozloží text na části pro sazbu. Fonty hry nemají indexy (₂, ⁿ, ⁸…) ani šipky, takže by je
 * prohlížeč vzal z náhradního písma. Indexy se proto sázejí jako <sub>/<sup> stejným písmem
 * a šipky jako obrázek.
 */
export function richParts(text: string): RichPart[] {
  const out: RichPart[] = [];
  let mode: 'text' | 'sub' | 'sup' = 'text';
  let buf = '';
  const flush = () => {
    if (buf) out.push({ kind: mode, value: buf });
    buf = '';
  };
  for (const ch of text) {
    if (ch === '→' || ch === '←') {
      flush();
      out.push({ kind: 'arrow', dir: ch === '→' ? 'right' : 'left' });
      continue;
    }
    const sub = SUB.indexOf(ch);
    const kind = sub >= 0 ? 'sub' : ch in SUP ? 'sup' : 'text';
    if (kind !== mode) {
      flush();
      mode = kind;
    }
    buf += kind === 'sub' ? String(sub) : kind === 'sup' ? SUP[ch] : ch;
  }
  flush();
  return out;
}
