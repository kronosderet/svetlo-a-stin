/**
 * Čistá logika práce s bity. Žádné UI, žádný stav.
 * Konvence: pozice 0 je nejpravější krystal (nejnižší váha).
 */

/** Váha pozice i: 1, 2, 4, 8… */
export const weightOf = (i: number): number => 2 ** i;

/** Počet rozsvícených krystalů (jedniček). */
export function popcount(n: number): number {
  let count = 0;
  let x = n >>> 0;
  while (x) {
    x &= x - 1;
    count++;
  }
  return count;
}

/** Počet pozic, ve kterých se dvě kombinace liší. */
export const hamming = (a: number, b: number): number => popcount(a ^ b);

/** Počet různých kombinací n krystalů: 2ⁿ. */
export const combinations = (bits: number): number => 2 ** bits;

/** Největší hodnota z n krystalů: 2ⁿ − 1. */
export const maxValue = (bits: number): number => 2 ** bits - 1;

export const isBitSet = (mask: number, i: number): boolean => ((mask >>> i) & 1) === 1;

export const flipBit = (mask: number, i: number): number => (mask ^ (1 << i)) >>> 0;

/** Zápis od nejvyšší pozice, např. toBinaryString(5, 4) === "0101". */
export function toBinaryString(mask: number, bits: number): string {
  return (mask >>> 0).toString(2).padStart(bits, '0').slice(-bits);
}

/** Rozklad na váhy od největší: 13 → [8, 4, 1]. */
export function decompose(value: number): number[] {
  const out: number[] = [];
  for (let i = 30; i >= 0; i--) {
    if (isBitSet(value, i)) out.push(weightOf(i));
  }
  return out;
}

export interface Notation {
  binary: string;
  terms: number[];
  value: number;
}

/** Podklad pro zápis „1101₂ = 8 + 4 + 1 = 13“. */
export function notationParts(mask: number, bits: number): Notation {
  return { binary: toBinaryString(mask, bits), terms: decompose(mask), value: mask };
}

/** Slovní popis kombinace od nejvyšší pozice, např. „světlo, stín, světlo“. */
export function patternWords(mask: number, bits: number): string {
  const words: string[] = [];
  for (let i = bits - 1; i >= 0; i--) words.push(isBitSet(mask, i) ? 'světlo' : 'stín');
  return words.join(', ');
}

/** Grayův kód: sousední hodnoty se liší právě v jednom bitu. */
export const gray = (i: number): number => (i ^ (i >>> 1)) >>> 0;
