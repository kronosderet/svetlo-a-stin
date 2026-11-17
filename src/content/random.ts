/**
 * Losování úloh pro komnaty, kde se procvičuje nebo zkouší: každý hráč (a každý nový pokus)
 * dostane jiné příklady, takže se nedají naučit nazpaměť ani napovědět sousedovi.
 */
import type { QuizQuestion } from './types';

export type Rng = () => number;

/** Rychlý generátor s pevným semínkem (pro testy a opakovatelné ladění). */
export function seeded(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Celé číslo od lo do hi včetně. */
export const int = (rng: Rng, lo: number, hi: number): number => lo + Math.floor(rng() * (hi - lo + 1));

export const pick = <T>(rng: Rng, list: readonly T[]): T => list[Math.floor(rng() * list.length)];

/** Kopie seznamu v náhodném pořadí (Fisher–Yates). */
export function shuffled<T>(rng: Rng, list: readonly T[]): T[] {
  const out = [...list];
  for (let k = out.length - 1; k > 0; k--) {
    const j = Math.floor(rng() * (k + 1));
    [out[k], out[j]] = [out[j], out[k]];
  }
  return out;
}

/** Losuje, dokud výsledek nesplní podmínku. */
export function until<T>(make: () => T, ok: (v: T) => boolean, tries = 5000): T {
  for (let k = 0; k < tries; k++) {
    const v = make();
    if (ok(v)) return v;
  }
  throw new Error('Generátor nenašel úlohu, která splní podmínky.');
}

/**
 * Posloupnost n hodnot: každá splní podmínku pro svou pozici a žádná se neopakuje
 * (porovnává se podle klíče, třeba u dvojic sčítanců).
 */
export function sequence<T>(
  rng: Rng,
  n: number,
  make: (k: number) => T,
  ok: (v: T, k: number, prev: T[]) => boolean = () => true,
  key: (v: T) => string = (v) => JSON.stringify(v),
): T[] {
  return until(
    () => {
      const out: T[] = [];
      for (let k = 0; k < n; k++) {
        const v = until(
          () => make(k),
          (c) => ok(c, k, out) && !out.some((p) => key(p) === key(c)),
          400,
        );
        out.push(v);
      }
      return out;
    },
    () => true,
  );
}

/** Otázka kvízu s možnostmi v náhodném pořadí (index správné odpovědi se přepočítá). */
export function shuffleOptions(q: QuizQuestion, rng: Rng = Math.random): QuizQuestion {
  const order = shuffled(rng, q.options.map((_, k) => k));
  return {
    ...q,
    options: order.map((k) => q.options[k]),
    correct: order.indexOf(q.correct),
    ...(q.why ? { why: order.map((k) => q.why![k] ?? '') } : {}),
  };
}
