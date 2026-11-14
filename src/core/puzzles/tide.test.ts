import { describe, expect, it } from 'vitest';
import { applyOp, bestOp, distance, initTide, par, pull, taskLimit, taskStart, type TideConfig } from './tide';

describe('Příliv: páky', () => {
  it('posun vlevo zdvojí, horní světlo přeteče přes okraj', () => {
    expect(applyOp('shl', 5, 4)).toEqual({ value: 10, spill: null });
    expect(applyOp('shl', 0b1100, 4)).toEqual({ value: 0b1000, spill: 'left' });
  });

  it('posun vpravo půlí, dolní světlo se ztratí', () => {
    expect(applyOp('shr', 12, 4)).toEqual({ value: 6, spill: null });
    expect(applyOp('shr', 13, 4)).toEqual({ value: 6, spill: 'right' });
  });

  it('+1 a −1 se na okrajích přetočí', () => {
    expect(applyOp('inc', 15, 4)).toEqual({ value: 0, spill: 'wrap' });
    expect(applyOp('dec', 0, 4)).toEqual({ value: 15, spill: 'wrap' });
    expect(applyOp('inc', 7, 4).value).toBe(8);
  });
});

describe('Příliv: cesty', () => {
  const doubling: TideConfig = { bits: 5, ops: ['shl', 'inc'], tasks: [{ start: 1, target: 11 }] };

  it('nejkratší cesta ×2 a +1 kopíruje dvojkový zápis', () => {
    // 11 = 1011: ×2, ×2, +1, ×2, +1
    expect(distance(doubling, 1, 11)).toBe(5);
    expect(distance(doubling, 1, 27)).toBe(7);
    expect(par(doubling)).toBe(5);
  });

  it('nedosažitelný cíl má nekonečnou vzdálenost', () => {
    expect(distance({ bits: 4, ops: ['shl'], tasks: [] }, 3, 5)).toBe(Infinity);
  });

  it('zkouška bez startu navazuje na předchozí cíl', () => {
    const cfg: TideConfig = { bits: 6, ops: ['shl', 'shr'], tasks: [{ start: 3, target: 6 }, { target: 24 }] };
    expect(taskStart(cfg, 1)).toBe(6);
    expect(par(cfg)).toBe(3);
  });

  it('nápověda vede nejkratší cestou', () => {
    let st = initTide(doubling);
    const trail = [];
    while (!st.complete) {
      const op = bestOp(doubling, st)!;
      trail.push(op);
      st = pull(doubling, st, op).state;
    }
    expect(trail).toEqual(['shl', 'shl', 'inc', 'shl', 'inc']);
    expect(st.moves).toBe(5);
  });
});

describe('Příliv: průběh', () => {
  const cfg: TideConfig = { bits: 6, ops: ['shl', 'shr'], tasks: [{ start: 3, target: 12 }, { start: 13, target: 6 }] };

  it('splněný cíl otevře další zkoušku od jejího startu', () => {
    let r = pull(cfg, initTide(cfg), 'shl');
    expect(r.state.value).toBe(6);
    r = pull(cfg, r.state, 'shl');
    expect(r.events.map((e) => e.type)).toEqual(['pull', 'step']);
    expect(r.state).toMatchObject({ step: 1, value: 13, taskMoves: 0, trail: [], moves: 2 });
  });

  it('nepovolená páka nic neudělá', () => {
    expect(pull(cfg, initTide(cfg), 'inc').events).toHaveLength(0);
  });

  it('ztracené světlo ohlásí událost', () => {
    const st = { ...initTide(cfg), step: 1, value: 13 };
    const r = pull(cfg, st, 'shr');
    expect(r.events[0]).toMatchObject({ type: 'pull', from: 13, to: 6, spill: 'right' });
    expect(r.state.complete).toBe(true);
  });
});

describe('Příliv: Váhy Osudu', () => {
  const cfg: TideConfig = { bits: 6, ops: ['shl', 'shr', 'inc', 'dec'], tasks: [{ start: 7, target: 30 }], strict: true };

  it('dovolí jen ideální počet tahů', () => {
    // 7 → 14 → 15 → 30
    expect(taskLimit(cfg, initTide(cfg))).toBe(3);
  });

  it('po vyčerpání tahů se vrátí na začátek zkoušky', () => {
    let st = initTide(cfg);
    st = pull(cfg, st, 'inc').state;
    st = pull(cfg, st, 'inc').state;
    const r = pull(cfg, st, 'inc');
    expect(r.events.map((e) => e.type)).toEqual(['pull', 'reset']);
    expect(r.state).toMatchObject({ value: 7, taskMoves: 0, trail: [], resets: 1, moves: 3 });
  });

  it('ideální cesta projde', () => {
    let st = initTide(cfg);
    for (const op of ['shl', 'inc', 'shl'] as const) st = pull(cfg, st, op).state;
    expect(st.complete).toBe(true);
    expect(st.resets).toBe(0);
  });
});
