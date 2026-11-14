import { describe, expect, it } from 'vitest';
import * as Q from './quizzes';
import { seeded } from './random';

const generators = Object.entries(Q).filter(([, v]) => typeof v === 'function') as [string, (r: () => number) => { options: string[]; correct: number; question: string }][];

describe('kvízy s losovanými čísly', () => {
  it.each(generators)('%s: vždy čtyři různé možnosti a správná mezi nimi', (_, gen) => {
    for (let s = 1; s <= 400; s++) {
      const q = gen(seeded(s));
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.options[q.correct]).toBeDefined();
    }
  });

  it.each(generators)('%s: čísla se losují (otázky se liší)', (_, gen) => {
    const texts = new Set(Array.from({ length: 40 }, (_, s) => gen(seeded(s + 1)).question + gen(seeded(s + 1)).options[0]));
    expect(texts.size).toBeGreaterThan(1);
  });

  it('správné odpovědi opravdu sedí', () => {
    for (let s = 1; s <= 100; s++) {
      const neg = Q.qNegative(seeded(s));
      const b = Number(neg.question.match(/−(\d+)/)![1]);
      expect(parseInt(neg.options[neg.correct], 2)).toBe((16 - b) & 15);
      const rem = Q.qRemainder(seeded(s));
      const [, v, d] = rem.question.match(/\((\d+)\) (šestnácti|osmi)/)!;
      expect(Number(rem.options[rem.correct].match(/\((\d+)\)/)![1])).toBe(Number(v) % (d === 'osmi' ? 8 : 16));
      const sub = Q.qSubtract(seeded(s));
      const [x, y] = sub.question.match(/[01]{4}/g)!.map((t) => parseInt(t, 2));
      expect(parseInt(sub.options[sub.correct], 2)).toBe(x - y);
    }
  });
});
