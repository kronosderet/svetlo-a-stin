import { describe, expect, it } from 'vitest';
import { extraTaskFor, pickExtraTask } from './extraTask';
import { LEVELS, instantiate, isGateRoom, partsOf } from '../content/levels';
import { seeded } from '../content/random';
import type { PuzzleLevel } from '../content/types';

describe('zkouška navíc v bráně', () => {
  const read = (value: number) => ({ dir: 'read' as const, value });
  const write = (value: number) => ({ dir: 'write' as const, value });

  it('vybere úlohu stejného druhu, přednostně ze stejného místa', () => {
    const existing = [write(11), read(6), write(13)];
    expect(pickExtraTask(existing, [write(9), read(3), write(7)], 1)).toEqual(read(3));
    expect(pickExtraTask(existing, [read(5), write(9), write(7)], 2)).toEqual(write(7));
  });

  it('nevybere úlohu, která už v části je', () => {
    const existing = [read(6), read(9)];
    expect(pickExtraTask(existing, [read(6), read(9), read(12)], 0)).toEqual(read(12));
    expect(pickExtraTask(existing, [read(6), read(9)], 0)).toBeNull();
  });

  it('masku pozná podle runy', () => {
    const and = { value: 0b1010, op: 'and', target: 0b0010, say: '' };
    const xor = { value: 0b1010, op: 'xor', target: 0b0110, say: '' };
    const or = { value: 0b0011, op: 'or', target: 0b1011, say: '' };
    expect(pickExtraTask([and, xor], [or, xor, { ...xor, value: 0b0101 }], 1)).toEqual({ ...xor, value: 0b0101 });
  });

  it('úloha Přílivu potřebuje vlastní začátek', () => {
    const existing: object[] = [{ start: 3, target: 24 }];
    expect(pickExtraTask(existing, [{ target: 12 }, { start: 5, target: 40 }], 0)).toEqual({ start: 5, target: 40 });
    expect(pickExtraTask(existing, [{ target: 12 }], 0)).toBeNull();
  });

  it('když nic nového nepadne, zopakuje úlohu stejného druhu', () => {
    const existing = [read(6), write(9)];
    expect(extraTaskFor(existing, () => [read(6), write(9)], 1)).toEqual(write(9));
    expect(extraTaskFor(existing, () => [write(3)], 0)).toEqual(read(6));
  });

  it('bez rozpracované úlohy nic nepřidá', () => {
    expect(pickExtraTask([read(6)], [read(7)], 3)).toBeNull();
  });

  // Každá část brány s losováním a seznamem úloh umí zkoušku navíc přidat u kterékoli úlohy.
  const gateParts = LEVELS.filter((l) => isGateRoom(l.id))
    .flatMap((l) => partsOf(l))
    .filter((p) => p.generate && Array.isArray((p.config as { tasks?: unknown }).tasks));

  it('brány s losováním existují ve všech patrech', () => {
    expect(new Set(gateParts.map((p) => p.id))).toEqual(new Set(['I-7', 'I-15', 'II-7', 'II-15', 'III-7', 'III-15', 'IV-7', 'IV-15']));
  });

  for (const part of gateParts) {
    it(`${part.id} ${part.title}: zkouška navíc se najde u každé úlohy`, () => {
      let repeats = 0;
      for (let seed = 1; seed <= 40; seed++) {
        const rng = seeded(seed);
        const level = instantiate(part, rng) as PuzzleLevel;
        const tasks = (level.config as { tasks: object[] }).tasks;
        const generate = () => (part.generate!(rng) as { tasks: object[] }).tasks;
        tasks.forEach((task, step) => {
          const extra = extraTaskFor(tasks, generate, step);
          expect(extra, `seed ${seed}, úloha ${step}`).not.toBeNull();
          if (JSON.stringify(extra) === JSON.stringify(task)) repeats++;
        });
      }
      // Generátory bran mají dost variant, takže zkouška navíc nikdy jen neopakuje starou úlohu.
      expect(repeats).toBe(0);
    });
  }
});
