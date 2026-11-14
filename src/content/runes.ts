import type { Rune } from '../core/logic';

/** Jména run, jak jim říkali Lumenité. */
export const RUNE_NAME: Record<Rune, string> = {
  id: 'Průchod',
  not: 'Obraceč',
  and: 'Pouto',
  or: 'Rozcestí',
  xor: 'Výluka',
  nand: 'Zlomené pouto',
  nor: 'Zavřené rozcestí',
};

/** Moderní značka (ukáže se, až Kodex runy přeloží). */
export const RUNE_MODERN: Record<Rune, string> = {
  id: '',
  not: 'NOT',
  and: 'AND',
  or: 'OR',
  xor: 'XOR',
  nand: 'NAND',
  nor: 'NOR',
};

/** Tahy runy na mřížce 24 × 24: znaky výrokové logiky ¬ ∧ ∨ ⊻, jak je Lumenité tesali. */
export const RUNE_PATH: Record<Rune, string> = {
  id: 'M4 12H20',
  not: 'M5 9H18V16',
  and: 'M5 18L12 6L19 18',
  or: 'M5 6L12 18L19 6',
  xor: 'M5 4L12 15L19 4 M6 20H18',
  nand: 'M5 20L12 9L19 20 M6 4H18',
  nor: 'M5 8L12 19L19 8 M6 4H18',
};

/** Záznam Kodexu, který runu „přeloží“ (pak se pod ní ukáže i moderní značka). */
export const RUNE_KODEX: Record<Rune, string | null> = {
  id: null,
  not: 'obracec',
  and: 'pouto',
  or: 'rozcesti',
  xor: 'vyluka',
  nand: 'retezy',
  nor: 'retezy',
};
