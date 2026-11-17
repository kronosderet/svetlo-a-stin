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

/**
 * Předložka v, nebo ve před číslem (i řadovým): ve 2, ve 3. kroku, ve 14, v 5, v 1.
 * Řídí se tím, jak číslo zní: ve dvou, třech, čtyřech, dvaceti… ale v jednom, pěti, sedmi.
 */
export function inNum(n: number): 'v' | 've' {
  if (n >= 100 && n < 200) return 've';
  const head = n >= 200 ? Math.floor(n / 100) : n;
  return [2, 3, 4, 12, 13, 14].includes(head) || (head >= 20 && head < 50) ? 've' : 'v';
}

/**
 * Předložka s, nebo se před číslem v 7. pádě: se 3 vstupy (se třemi), s 5 vstupy (s pěti),
 * se 6 (se šesti), s 8 (s osmi). Řídí se tím, jak číslo zní.
 */
export function withNum(n: number): 's' | 'se' {
  if (n >= 100 && n < 200) return 'se';
  const head = n >= 200 ? Math.floor(n / 100) : n;
  if (head >= 20) return [2, 3, 4, 6, 7].includes(Math.floor(head / 10)) ? 'se' : 's';
  return [2, 3, 4, 6, 7, 12, 13, 14, 16, 17].includes(head) ? 'se' : 's';
}

const NB = '\u00A0';
const ONE_LETTER = /(^|[\s(„‚[])([vszkouaiVSZKOUAI]) (?=\S)/g;
const NUMBER_WORD = /(\d\.?) (?=\p{L})/gu;
const OPERATOR = /(\S) (?=[+−×÷=<>≤≥⇒⇔∧∨⊻/→←↔] \S)/g;

/**
 * Česká sazba: jednopísmenná předložka nebo spojka (v, s, z, k, o, u, a, i) nezůstane na konci
 * řádku, číslo se neodtrhne od slova za ním (8 krystalů, 1. krok) a znaménko ve výrazu zůstane
 * u levého operandu (1 + 1 = 10 se smí zlomit jen za znaménkem, jako v matematické sazbě).
 * Mezery se jen vymění za nezlomitelné, délka textu zůstane stejná.
 */
export function typoCz(text: string): string {
  if (!text.includes(' ')) return text;
  let out = text.replace(NUMBER_WORD, `$1${NB}`).replace(OPERATOR, `$1${NB}`);
  // Dvakrát: dvě jednopísmenná slova za sebou („a v Kaskádě“) sdílí mezeru, kterou první náhrada spotřebuje.
  out = out.replace(ONE_LETTER, `$1$2${NB}`).replace(ONE_LETTER, `$1$2${NB}`);
  return out;
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
      // Šipka zůstane u levého operandu (0 → 1 se smí zlomit jen za šipkou), jako znaménka v typoCz.
      if (mode === 'text' && buf.endsWith(' ')) buf = buf.slice(0, -1) + NB;
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
