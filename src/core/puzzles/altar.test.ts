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

  it('neodhalí nic, když svítí víc krystalů', () => {
    const st = play(cfg, [1]);
    const r = toggle(cfg, st, 2);
    expect(r.events.some((e) => e.type === 'reveal')).toBe(false);
  });

  it('ohlásí odhalení všech vah', () => {
    const st = play(cfg, [0, 0, 1, 1]);
    const r = toggle(cfg, st, 2);
    expect(r.events).toContainEqual({ type: 'reveal', bit: 2, allRevealed: true, source: 'solo' });
  });

  it('přijatá váha odhalí váhy zúčastněných krystalů', () => {
    const cfg5: AltarConfig = { bits: 3, goal: { kind: 'value', targets: [5, 7] }, reveal: 'solo' };
    const st = play(cfg5, [0]);
    const r = toggle(cfg5, st, 2);
    expect(r.events).toContainEqual({ type: 'reveal', bit: 2, allRevealed: false, source: 'altar' });
    expect(r.state.revealed).toBe(0b101);
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
