import { describe, expect, it } from 'vitest';
import { popcount } from '../core/bits';
import { answer } from '../core/puzzles/cascade';
import { distance } from '../core/puzzles/tide';
import {
  genI13,
  genI14,
  genI5,
  genI6,
  genI7,
  genI8,
  genII10,
  genII11,
  genII12,
  genII13Add,
  genII13Negate,
  genII14,
  genII15Fate,
  genII2,
  genII3,
  genII4,
  genII5,
  genII7Cascade,
  genII7Tide,
  genII8,
  genII9,
} from './generators';
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

  it('I-8: pátý krystal potřebuje až čtvrtý cíl, po zmizení součtu (nález kontroly 0.4.4)', () => {
    forSeeds((s) => {
      const goal = genI8(seeded(s)).goal;
      if (goal.kind !== 'value') throw new Error('I-8');
      expect(goal.targets[3]).toBeGreaterThanOrEqual(16);
      expect(goal.targets.slice(0, 3).every((v) => v < 16), goal.targets.join(', ')).toBe(true);
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

  it('II-2: pevné 5 + 1, 2 + 2 a 8 + 8, pak jedna dvojice (součet do 15) a dvě dvojice; vlevo od dvojice vždy volno', () => {
    forSeeds((s) => {
      const cfg = genII2(seeded(s));
      expect(cfg.tasks.slice(0, 3).map((t) => t.operands)).toEqual([
        [0b0101, 0b0001],
        [0b0010, 0b0010],
        [0b1000, 0b1000],
      ]);
      cfg.tasks.forEach((t) => {
        const [a, b] = t.operands;
        expect(((a & b) << 1) & (a | b)).toBe(0);
        expect(Math.max(...answer(cfg, t).inflow)).toBeLessThanOrEqual(2);
      });
      const [a4, b4] = cfg.tasks[3].operands;
      expect(popcount(a4 & b4)).toBe(1);
      expect(a4 & b4 & 0b0110).toBe(a4 & b4);
      expect(a4 ^ b4).not.toBe(0);
      expect(a4 + b4).toBeLessThan(16);
      const [a5, b5] = cfg.tasks[4].operands;
      expect(popcount(a5 & b5)).toBe(2);
      expect(a5 & b5 & 0b1000).toBe(0b1000);
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

  it('I-13 a I-14: glyfy s písmeny A–F se objevují často', () => {
    forSeeds((s) => {
      expect(genI13(seeded(s)).tasks.filter((t) => t.value >= 10).length).toBeGreaterThanOrEqual(3);
      const pairs = genI14(seeded(s)).tasks;
      expect(pairs.filter((t) => t.value >> 4 >= 10 || (t.value & 15) >= 10).length).toBeGreaterThanOrEqual(3);
    });
  });

  it('II-10 nechá kopie vybrat hráče', () => {
    forSeeds((s) => expect(genII10(seeded(s)).pickCopies).toBe(true));
  });

  it('II-11: dělení 4, 8, 2 a 16; první zbytek nenulový, jedno dělení beze zbytku', () => {
    forSeeds((s) => {
      const cfg = genII11(seeded(s));
      expect(cfg.tasks.map((t) => t.show)).toEqual(['÷ 4', '÷ 8', '÷ 2', '÷ 16']);
      const rems = cfg.tasks.map((t, k) => t.start! % [4, 8, 2, 16][k]);
      expect(rems[0]).not.toBe(0);
      expect(rems.filter((r) => r === 0)).toHaveLength(1);
      cfg.tasks.forEach((t, k) => expect(t.target).toBe(Math.floor(t.start! / [4, 8, 2, 16][k])));
    });
  });

  it('II-12: druhá trojice pošle světlo o dvě místa, poslední je 15 + 15 + 15', () => {
    forSeeds((s) => {
      const cfg = genII12(seeded(s));
      expect(answer(cfg, cfg.tasks[0]).far).toBe(0);
      expect(answer(cfg, cfg.tasks[1]).far).not.toBe(0);
      expect(cfg.tasks[2].operands).toEqual([15, 15, 15]);
    });
  });

  it('II-13: doplněk je převrácení a jedna navíc, odčítání vždy přeteče do přepadu', () => {
    forSeeds((s) => {
      genII13Negate(seeded(s)).tasks.forEach((t) => {
        expect((t.start! + t.target) % 16).toBe(0);
        expect(t.show).toBe(`−${t.start}`);
      });
      const cfg = genII13Add(seeded(s));
      cfg.tasks.forEach((t) => {
        const ans = answer(cfg, t);
        expect(ans.spilled).toBe(1);
        expect(ans.result).toBe((t.operands[0] + t.operands[1]) % 16);
      });
    });
  });

  it('II-15: Váhy Osudu na tři a na čtyři tahy', () => {
    forSeeds((s) => {
      const cfg = genII15Fate(seeded(s));
      expect(cfg.tasks.map((t) => distance(cfg, t.start!, t.target))).toEqual([3, 4]);
    });
  });

  it('II-14: čtyři vyvážení na tři tahy a poslední na čtyři', () => {
    forSeeds((s) => {
      const cfg = genII14(seeded(s));
      expect(cfg.tasks.map((t) => distance(cfg, t.start!, t.target))).toEqual([3, 3, 3, 3, 4]);
    });
  });
});
