/**
 * Převod uloženého postupu na nové číslování komnat. Komnaty mají čísla podle glyfu:
 * nultá komnata 0, základní cesta 1–7 (7 = brána), Hlubší síně 8–15.
 */

/**
 * Verze rozvržení komnat, kterou postup používá:
 *  1 (nebo chybí) = původní číslování 1–10,
 *  2 = rozdělení pater na základní cestu 1–7 a Hlubší síně 8–15,
 *  3 = nultá komnata v každém patře, Probuzení se přestěhovalo z I-1 na I-0.
 */
export const LAYOUT = 3;

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
};

/**
 * Přejmenuje komnaty uložené v rozvržení `from` na současné číslování.
 * Vrací nový objekt, původní nemění.
 */
export function migrateLevelIds<T>(levels: Record<string, T>, from: unknown): Record<string, T> {
  let out = levels;
  const start = typeof from === 'number' && from >= 1 ? Math.floor(from) : 1;
  for (let layout = start; layout < LAYOUT; layout++) {
    const renamed = STEPS[layout] ?? {};
    const next: Record<string, T> = {};
    for (const [id, rec] of Object.entries(out)) next[renamed[id] ?? id] = rec;
    out = next;
  }
  return out === levels ? { ...levels } : out;
}
