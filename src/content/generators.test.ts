import { describe, expect, it } from 'vitest';
import { popcount } from '../core/bits';
import { answer } from '../core/puzzles/cascade';
import { distance } from '../core/puzzles/tide';
import { genI5, genI6, genI7, genI8, genII10, genII14, genII2, genII3, genII4, genII5, genII7Cascade, genII7Tide, genII8, genII9 } from './generators';
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

  it('I-8: čtvrtý cíl potřebuje pátý krystal', () => {
    forSeeds((s) => {
      const goal = genI8(seeded(s)).goal;
      expect(goal.kind === 'value' && goal.targets[3]).toBeGreaterThanOrEqual(16);
    });
  });

  it('I-6 začíná lehkým nápisem se dvěma světly', () => {
    forSeeds((s) => {
      const first = genI6(seeded(s)).tasks[0];
      expect(first.value).toBeLessThan(8);
      expect(popcount(first.value)).toBe(2);
    });
  });

  it('brána I-7 střídá zápis a čtení na čtyřech krystalech a končí nejtěžším světlem 15', () => {
    forSeeds((s) => {
      const cfg = genI7(seeded(s));
      expect(cfg.bits).toBe(4);
      expect(cfg.tasks.map((t) => t.dir)).toEqual(['write', 'read', 'write', 'read', 'write']);
      expect(cfg.tasks[4].value).toBe(15);
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

  it('II-4 má tři úlohy: začíná 31 + 1 a končí 63 + 63', () => {
    forSeeds((s) => {
      const tasks = genII4(seeded(s)).tasks;
      expect(tasks).toHaveLength(3);
      expect(tasks[0].operands).toEqual([31, 1]);
      expect(tasks[2].operands).toEqual([63, 63]);
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

  it('brána II-7: tři součty s přenosy, poslední přeteče do šestého krystalu', () => {
    forSeeds((s) => {
      const cfg = genII7Cascade(seeded(s));
      cfg.tasks.forEach((t) => expect(popcount(answer(cfg, t).carries)).toBeGreaterThanOrEqual(2));
      expect(answer(cfg, cfg.tasks[2]).result).toBeGreaterThanOrEqual(32);
      expect(cfg.tasks.some((t) => answer(cfg, t).inflow.includes(3))).toBe(true);
    });
  });

  it('brána II-7: páky zdvojují, půlí a jednou něco spadne přes okraj', () => {
    forSeeds((s) => {
      const cfg = genII7Tide(seeded(s));
      const [up, down, lossy] = cfg.tasks;
      expect(up.target).toBeGreaterThan(up.start!);
      expect(down.target).toBeLessThan(down.start!);
      expect(down.target * 2 ** distance(cfg, down.start!, down.target)).toBe(down.start);
      expect(lossy.target * 2 ** distance(cfg, lossy.start!, lossy.target)).toBeLessThan(lossy.start!);
      cfg.tasks.forEach((t) => expect(distance(cfg, t.start!, t.target)).toBeLessThanOrEqual(3));
    });
  });

  it('II-8: ukázka bez výpůjčky, pak samé výpůjčky, ve třetí úloze víc než jedna', () => {
    forSeeds((s) => {
      const cfg = genII8(seeded(s));
      expect(answer(cfg, cfg.tasks[0]).carries).toBe(0);
      cfg.tasks.slice(1).forEach((t) => expect(answer(cfg, t).carries).not.toBe(0));
      expect(popcount(answer(cfg, cfg.tasks[2]).carries)).toBeGreaterThanOrEqual(2);
    });
  });

  it('II-9 začíná šestkou a cesty se prodlužují', () => {
    forSeeds((s) => {
      const cfg = genII9(seeded(s));
      expect(cfg.tasks[0].target).toBe(6);
      const d = cfg.tasks.map((t) => distance(cfg, 1, t.target));
      for (let k = 2; k < d.length; k++) expect(d[k]).toBeGreaterThanOrEqual(d[k - 1]);
    });
  });

  it('II-10 začíná ukázkou 5 × 3', () => {
    forSeeds((s) => expect(genII10(seeded(s)).tasks[0].operands).toEqual([5, 3]));
  });

  it('II-14: čtyři vyvážení na tři tahy a poslední na čtyři', () => {
    forSeeds((s) => {
      const cfg = genII14(seeded(s));
      expect(cfg.tasks.map((t) => distance(cfg, t.start!, t.target))).toEqual([3, 3, 3, 3, 4]);
    });
  });
});
