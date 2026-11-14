/**
 * Runy Zahrady Bran: logická hradla. Každá runa vezme jedno nebo dvě světla a pustí dál
 * světlo, nebo stín. Řádky pravdivostní tabulky se číslují jako dvojkové číslo ze vstupů,
 * první vstup (A) je nejvyšší bit: pro dva vstupy 00, 01, 10, 11.
 */

export type Rune = 'id' | 'not' | 'and' | 'or' | 'xor' | 'nand' | 'nor';

/** Kolik světel runa bere. */
export const ARITY: Record<Rune, 1 | 2> = { id: 1, not: 1, and: 2, or: 2, xor: 2, nand: 2, nor: 2 };

export function applyRune(rune: Rune, a: number, b = 0): number {
  switch (rune) {
    case 'id':
      return a;
    case 'not':
      return a ? 0 : 1;
    case 'and':
      return a & b;
    case 'or':
      return a | b;
    case 'xor':
      return a ^ b;
    case 'nand':
      return a & b ? 0 : 1;
    case 'nor':
      return a | b ? 0 : 1;
  }
}

/** Hodnota vstupu číslo i (0 = A) v řádku tabulky pro n vstupů. */
export const inputBit = (row: number, i: number, n: number): number => (row >> (n - 1 - i)) & 1;

/** Počet řádků tabulky pro n vstupů. */
export const rowCount = (n: number): number => 2 ** n;

/** Pravdivostní tabulka samotné runy (výstup pro každý řádek). */
export function runeTable(rune: Rune): number[] {
  const n = ARITY[rune];
  return Array.from({ length: rowCount(n) }, (_, r) => applyRune(rune, inputBit(r, 0, n), n === 2 ? inputBit(r, 1, n) : 0));
}

/** Dvě tabulky jsou stejné. */
export const sameTable = (a: number[], b: number[]): boolean => a.length === b.length && a.every((v, k) => v === b[k]);
