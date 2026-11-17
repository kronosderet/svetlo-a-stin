/**
 * Převod uloženého postupu na nové číslování komnat. Komnaty mají čísla podle glyfu:
 * nultá komnata 0, základní cesta 1–7 (7 = brána), Hlubší síně 8–15.
 */

/**
 * Verze rozvržení komnat, kterou postup používá:
 *  1 (nebo chybí) = původní číslování 1–10,
 *  2 = rozdělení pater na základní cestu 1–7 a Hlubší síně 8–15,
 *  3 = nultá komnata v každém patře, Probuzení se přestěhovalo z I-1 na I-0,
 *  4 = Počítadlo poutníků z I-9 do II-1, Soutok a Dvě řady sloučené do II-2, v I-9 nové Sudé a liché.
 */
export const LAYOUT = 4;

/** Kroky převodu: z rozvržení k na k + 1 (komnaty, které číslo nezměnily, tu nejsou). */
const STEPS: Record<number, Record<string, string>> = {
  1: {
    'I-6': 'I-8',
    'I-7': 'I-6',
    'I-8': 'I-9',
    'I-9': 'I-10',
    'I-10': 'I-7',
    'II-6': 'II-8',
    'II-7': 'II-6',
    'II-8': 'II-9',
    'II-9': 'II-10',
    'II-10': 'II-14',
  },
  2: { 'I-1': 'I-0' },
  // Soutok (II-1) i Dvě řady (II-2) jsou teď jedna komnata II-2: záznamy se sloučí (viz merge).
  3: { 'I-9': 'II-1', 'II-1': 'II-2' },
};

/** Záznamy Kodexu, které zanikly sloučením komnat: přeložený záznam přejde na nový. */
export const KODEX_RENAMED: Record<string, string> = { proudy: 'soutok' };

/** Přejmenuje přeložené záznamy Kodexu po sloučení komnat (bez duplicit). */
export function migrateKodexIds(ids: string[]): string[] {
  return [...new Set(ids.map((id) => KODEX_RENAMED[id] ?? id))];
}

/**
 * Přejmenuje komnaty uložené v rozvržení `from` na současné číslování.
 * Když se dvě komnaty sloučí do jedné, záznamy spojí merge (bez něj vyhraje ten pozdější).
 * Vrací nový objekt, původní nemění.
 */
export function migrateLevelIds<T>(levels: Record<string, T>, from: unknown, merge?: (a: T, b: T) => T): Record<string, T> {
  let out = levels;
  const start = typeof from === 'number' && from >= 1 ? Math.floor(from) : 1;
  for (let layout = start; layout < LAYOUT; layout++) {
    const renamed = STEPS[layout] ?? {};
    const next: Record<string, T> = {};
    for (const [id, rec] of Object.entries(out)) {
      const to = renamed[id] ?? id;
      next[to] = to in next && merge ? merge(next[to], rec) : rec;
    }
    out = next;
  }
  return out === levels ? { ...levels } : out;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Sloučená komnata (záznam pečetí): otevřená, když byla otevřená aspoň jedna část; pečetě jen za obě. */
export function mergeSeals<T>(a: T, b: T): T {
  const sa = isObj(a) && isObj(a.seals) ? a.seals : null;
  const sb = isObj(b) && isObj(b.seals) ? b.seals : null;
  if (!sa || !sb) return b ?? a;
  return { ...a, seals: { solved: true, skill: sa.skill === true && sb.skill === true, pure: sa.pure === true && sb.pure === true } };
}

/** Sloučená komnata (statistiky): počty se sečtou. */
export function mergeCounts<T>(a: T, b: T): T {
  if (!isObj(a) || !isObj(b)) return b ?? a;
  const out: Record<string, unknown> = { ...a };
  for (const [k, v] of Object.entries(b)) if (typeof v === 'number' && typeof out[k] === 'number') out[k] = (out[k] as number) + v;
  return out as T;
}
