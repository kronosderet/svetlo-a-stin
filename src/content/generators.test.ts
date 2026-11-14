import { describe, expect, it } from 'vitest';
import { popcount } from '../core/bits';
import { answer } from '../core/puzzles/cascade';
import { distance } from '../core/puzzles/tide';
import { genI10, genI5, genI6, genI7, genII10, genII2, genII3, genII4, genII5, genII6, genII8, genII9 } from './generators';
import { seeded } from './random';

/** Echo komentuje konkrétní pozice úloh; vylosované úlohy proto musí tyhle podmínky splnit vždy. */
const forSeeds = (fn: (seed: number) => void) => {
  for (let seed = 1; seed <= 200; seed++) fn(seed);
};

describe('losované úlohy sedí na repliky Echa', () => {
  it('I-5 začíná devítkou (odhalí váhu osmičky)', () => {
    forSeeds((s) => {
      const goal = genI5(seeded(s)).goal;
      expect(goal.kind === 'value' && goal.targets[0]).toBe(9);
    });
  });

  it('I-6: čtvrtý cíl potřebuje pátý krystal', () => {
    forSeeds((s) => {
      const goal = genI6(seeded(s)).goal;
      expect(goal.kind === 'value' && goal.targets[3]).toBeGreaterThanOrEqual(16);
    });
  });

  it('I-7 začíná lehkým nápisem se dvěma světly', () => {
    forSeeds((s) => {
      const first = genI7(seeded(s)).tasks[0];
      expect(first.value).toBeLessThan(8);
      expect(popcount(first.value)).toBe(2);
    });
  });

  it('I-10 střídá zápis a čtení a končí nejtěžším světlem 63', () => {
    forSeeds((s) => {
      const tasks = genI10(seeded(s)).tasks;
      expect(tasks.map((t) => t.dir)).toEqual(['write', 'read', 'write', 'read', 'write']);
      expect(tasks[4].value).toBe(63);
    });
  });

  it('II-2 nikdy nepotřebuje přenos', () => {
    forSeeds((s) => {
      const cfg = genII2(seeded(s));
      cfg.tasks.forEach((t) => expect(answer(cfg, t).carries).toBe(0));
    });
  });

  it('II-3: ukázka 3 + 1, třetí úloha má tři světla v jednom sloupci, poslední přeteče do pátého krystalu', () => {
    forSeeds((s) => {
      const cfg = genII3(seeded(s));
      expect(cfg.tasks[0].operands).toEqual([3, 1]);
      expect(answer(cfg, cfg.tasks[2]).inflow).toContain(3);
      expect(answer(cfg, cfg.tasks[3]).result).toBeGreaterThanOrEqual(16);
    });
  });

  it('II-4 začíná 31 + 1 a končí 63 + 63', () => {
    forSeeds((s) => {
      const tasks = genII4(seeded(s)).tasks;
      expect(tasks[0].operands).toEqual([31, 1]);
      expect(tasks[3].operands).toEqual([63, 63]);
    });
  });

  it('II-5: první se vejde, druhá přeteče, poslední je 15 + 1', () => {
    forSeeds((s) => {
      const cfg = genII5(seeded(s));
      expect(answer(cfg, cfg.tasks[0]).spilled).toBe(0);
      expect(answer(cfg, cfg.tasks[1]).spilled).toBe(1);
      expect(cfg.tasks[3].operands).toEqual([15, 1]);
    });
  });

  it('II-6: ukázka bez výpůjčky, pak samé výpůjčky, ve třetí úloze víc než jedna', () => {
    forSeeds((s) => {
      const cfg = genII6(seeded(s));
      expect(answer(cfg, cfg.tasks[0]).carries).toBe(0);
      cfg.tasks.slice(1).forEach((t) => expect(answer(cfg, t).carries).not.toBe(0));
      expect(popcount(answer(cfg, cfg.tasks[2]).carries)).toBeGreaterThanOrEqual(2);
    });
  });

  it('II-8 začíná šestkou a cesty se prodlužují', () => {
    forSeeds((s) => {
      const cfg = genII8(seeded(s));
      expect(cfg.tasks[0].target).toBe(6);
      const d = cfg.tasks.map((t) => distance(cfg, 1, t.target));
      for (let k = 2; k < d.length; k++) expect(d[k]).toBeGreaterThanOrEqual(d[k - 1]);
    });
  });

  it('II-9 začíná ukázkou 5 × 3', () => {
    forSeeds((s) => expect(genII9(seeded(s)).tasks[0].operands).toEqual([5, 3]));
  });

  it('II-10: čtyři vyvážení na tři tahy a poslední na čtyři', () => {
    forSeeds((s) => {
      const cfg = genII10(seeded(s));
      expect(cfg.tasks.map((t) => distance(cfg, t.start!, t.target))).toEqual([3, 3, 3, 3, 4]);
    });
  });
});
