/**
 * Převod uloženého postupu na nové číslování komnat. Komnaty mají od rozdělení pater
 * čísla podle glyfu: základní cesta 1–7 (7 = brána), Hlubší síně 8–15.
 */

/** Verze rozvržení komnat, kterou postup používá. Bez ní jde o původní číslování 1–10. */
export const LAYOUT = 2;

/** Původní id → nové id (komnaty, které číslo nezměnily, tu nejsou). */
const RENAMED: Record<string, string> = {
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
};

/** Přejmenuje komnaty z původního číslování. Vrací nový objekt, původní nemění. */
export function migrateLevelIds<T>(levels: Record<string, T>): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [id, rec] of Object.entries(levels)) out[RENAMED[id] ?? id] = rec;
  return out;
}
