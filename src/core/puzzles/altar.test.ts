import { describe, expect, it } from 'vitest';
import { currentTarget, hintBit, initAltar, par, toggle, type AltarConfig, type AltarState } from './altar';

function play(cfg: AltarConfig, bits: number[]): AltarState {
  let st = initAltar(cfg);
  for (const b of bits) st = toggle(cfg, st, b).state;
  return st;
}

describe('oltář: cílové hodnoty', () => {
  const cfg: AltarConfig = { bits: 3, goal: { kind: 'value', targets: [5, 3] }, reveal: 'never' };

  it('postupuje po cílech a dokončí level', () => {
    let st = initAltar(cfg);
    expect(currentTarget(cfg, st)).toBe(5);
    st = toggle(cfg, st, 2).state;
    const r = toggle(cfg, st, 0);
    expect(r.events.map((e) => e.type)).toContain('step');
    expect(currentTarget(cfg, r.state)).toBe(3);
    const done = play(cfg, [2, 0, 2, 1]);
    expect(done.complete).toBe(true);
    expect(done.moves).toBe(4);
  });

  it('par je součet hammingových vzdáleností', () => {
    expect(par(cfg)).toBe(2 + 2);
  });

  it('po dokončení už nic nepřepne', () => {
    const done = play(cfg, [2, 0, 2, 1]);
    const r = toggle(cfg, done, 0);
    expect(r.events).toHaveLength(0);
    expect(r.state).toBe(done);
  });

  it('ignoruje neplatnou pozici', () => {
    const st = initAltar(cfg);
    expect(toggle(cfg, st, 5).events).toHaveLength(0);
  });
});

describe('oltář: odhalování vah', () => {
  const cfg: AltarConfig = { bits: 3, goal: { kind: 'value', targets: [7] }, reveal: 'solo' };

  it('odhalí váhu, když krystal svítí sám', () => {
    const r = toggle(cfg, initAltar(cfg), 1);
    expect(r.events).toContainEqual({ type: 'reveal', bit: 1, allRevealed: false, source: 'solo' });
    expect(r.state.revealed).toBe(0b010);
  });

  it('neodhalí nic, když svítí víc neznámých krystalů', () => {
    // Cíl 7 by váhy odhalil sám, proto tu oltář žádá jinou váhu.
    const cfg6: AltarConfig = { ...cfg, goal: { kind: 'value', targets: [4] } };
    const st = { ...initAltar(cfg6), mask: 0b011 };
    const r = toggle(cfg6, st, 2);
    expect(r.events.some((e) => e.type === 'reveal')).toBe(false);
  });

  it('dopočítá váhu, když je ze svítících neznámý jen jeden (6 − 2 = 4)', () => {
    const st = play(cfg, [1]);
    const r = toggle(cfg, st, 2);
    expect(r.events).toContainEqual({ type: 'reveal', bit: 2, allRevealed: false, source: 'deduce', known: 0b010 });
    expect(r.state.revealed).toBe(0b110);
  });

  it('ohlásí odhalení všech vah', () => {
    const st = play(cfg, [0, 0, 1, 1]);
    const r = toggle(cfg, st, 2);
    expect(r.events).toContainEqual({ type: 'reveal', bit: 2, allRevealed: true, source: 'solo' });
  });

  it('přijatá váha odhalí váhy zúčastněných krystalů', () => {
    const cfg5: AltarConfig = { bits: 3, goal: { kind: 'value', targets: [7] }, reveal: 'solo' };
    const st = { ...initAltar(cfg5), mask: 0b011 };
    const r = toggle(cfg5, st, 2);
    expect(r.events).toContainEqual({ type: 'reveal', bit: 2, allRevealed: false, source: 'altar' });
    expect(r.state.revealed).toBe(0b111);
  });

  it('always odhalí vše hned', () => {
    expect(initAltar({ ...cfg, reveal: 'always' }).revealed).toBe(0b111);
  });
});

describe('oltář: všechny kombinace', () => {
  const cfg: AltarConfig = { bits: 3, goal: { kind: 'all' }, reveal: 'never' };

  it('počáteční tma je první nalezená kombinace', () => {
    expect(initAltar(cfg).found).toEqual([0]);
  });

  it('opakovaná kombinace vyvolá repeat', () => {
    const st = play(cfg, [0]);
    const r = toggle(cfg, st, 0);
    expect(r.events).toContainEqual({ type: 'repeat', pattern: 0 });
  });

  it('Grayův průchod najde vše za 7 doteků', () => {
    const st = play(cfg, [0, 1, 0, 2, 0, 1, 0]);
    expect(st.complete).toBe(true);
    expect(st.found).toHaveLength(8);
    expect(par(cfg)).toBe(7);
  });
});

describe('oltář: nápověda', () => {
  const configs: AltarConfig[] = [
    { bits: 2, goal: { kind: 'pattern', targets: [1, 2, 3, 0] }, reveal: 'never' },
    { bits: 4, goal: { kind: 'value', targets: [9, 12, 15, 6, 13] }, reveal: 'solo' },
    { bits: 3, goal: { kind: 'all' }, reveal: 'never' },
    { bits: 4, goal: { kind: 'all' }, reveal: 'never' },
  ];

  for (const cfg of configs) {
    it(`dovede k řešení v ideálním počtu tahů (${cfg.goal.kind}, ${cfg.bits} b)`, () => {
      let st = initAltar(cfg);
      let guard = 0;
      while (!st.complete && guard++ < 100) {
        const b = hintBit(cfg, st);
        expect(b).not.toBeNull();
        st = toggle(cfg, st, b!).state;
      }
      expect(st.complete).toBe(true);
      expect(st.moves).toBe(par(cfg));
    });
  }

  it('po dokončení nic nedoporučí', () => {
    const cfg = configs[0];
    expect(hintBit(cfg, play(cfg, [0, 0, 1, 0, 0, 1]))).toBeNull();
  });
});

describe('oltář: pořadí nápovědy', () => {
  const base: AltarConfig = { bits: 4, goal: { kind: 'value', targets: [3, 4] }, reveal: 'never' };

  it('high vede od nejtěžšího krystalu', () => {
    const st = play(base, [1, 0]);
    expect(hintBit(base, st)).toBe(2);
  });

  it('low vede zprava, jako přenos při přičítání jedničky', () => {
    const cfg: AltarConfig = { ...base, hintOrder: 'low' };
    const st = play(cfg, [1, 0]);
    expect(hintBit(cfg, st)).toBe(0);
  });
});

describe('oltář: tichý krok (Grayův kód)', () => {
  const cfg: AltarConfig = { bits: 3, goal: { kind: 'all' }, reveal: 'never', strict: true };

  it('návrat na známou kombinaci cestu přeruší a vrátí krystaly na začátek', () => {
    const r = toggle(cfg, play(cfg, [0]), 0);
    expect(r.events.map((e) => e.type)).toEqual(['toggle', 'repeat', 'reset']);
    expect(r.state.mask).toBe(0);
    expect(r.state.found).toEqual([0]);
    expect(r.state.moves).toBe(2);
  });

  it('nápověda vede cestou bez slepé uličky', () => {
    for (const bits of [3, 4]) {
      const c: AltarConfig = { ...cfg, bits };
      let st = initAltar(c);
      while (!st.complete) st = toggle(c, st, hintBit(c, st)!).state;
      expect(st.moves).toBe(par(c));
    }
  });

  it('i z rozjeté cesty nápověda dojde do konce', () => {
    const c: AltarConfig = { ...cfg, bits: 4 };
    let st = play(c, [0, 1, 0]);
    let guard = 0;
    while (!st.complete && guard++ < 40) st = toggle(c, st, hintBit(c, st)!).state;
    expect(st.complete).toBe(true);
  });
});

describe('oltář: skupiny čísel (Sudé a liché)', () => {
  const all = Array.from({ length: 16 }, (_, v) => v);
  const cfg: AltarConfig = {
    bits: 4,
    goal: {
      kind: 'class',
      targets: [
        { say: 'Liché', values: all.filter((v) => v % 2 === 1) },
        { say: 'Dělitelné osmi', values: [8] },
      ],
    },
    reveal: 'never',
  };

  it('přijme kterékoli číslo skupiny a zapamatuje si ho', () => {
    const r = toggle(cfg, initAltar(cfg), 0);
    expect(r.events).toContainEqual({ type: 'step', index: 0, target: 1 });
    expect(r.state.found).toEqual([1]);
  });

  it('nápověda dovede k řešení v ideálu (1, pak 8 = dva doteky)', () => {
    let st = initAltar(cfg);
    for (let guard = 0; !st.complete && guard < 20; guard++) st = toggle(cfg, st, hintBit(cfg, st)!).state;
    expect(st.complete).toBe(true);
    expect(st.moves).toBe(par(cfg));
    expect(par(cfg)).toBe(3);
  });
});
