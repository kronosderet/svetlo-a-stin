import { describe, expect, it } from 'vitest';
import { seeded, shuffleOptions } from './random';

describe('kvíz v náhodném pořadí', () => {
  const q = { question: 'Kolik je 1 + 1?', options: ['2', '10', '11', '1'], correct: 1, hint: '', explain: '' };

  it('správná odpověď zůstane správná', () => {
    for (let s = 1; s <= 50; s++) {
      const r = shuffleOptions(q, seeded(s));
      expect([...r.options].sort()).toEqual([...q.options].sort());
      expect(r.options[r.correct]).toBe('10');
    }
  });

  it('správná odpověď není pořád na stejném místě', () => {
    const places = new Set(Array.from({ length: 40 }, (_, s) => shuffleOptions(q, seeded(s + 1)).correct));
    expect(places.size).toBe(4);
  });
});
