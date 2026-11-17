import { describe, expect, it } from 'vitest';
import { applyMask, arrive, closestMask, hintBit, initMask, par, toggle, type MaskConfig } from './mask';

describe('Maska', () => {
  const cfg: MaskConfig = {
    bits: 8,
    tasks: [
      { value: 0b10110110, op: 'and', target: 0b00000110 },
      { value: 0b00001111, op: 'or', target: 0b10001111 },
      { value: 0b01010101, op: 'xor', target: 0b10101010 },
      { value: 0b10011010, op: 'xor', key: 0b11011111 },
    ],
  };

  it('AND vybírá, OR rozsvěcí, XOR přepíná', () => {
    expect(applyMask('and', 0b1100, 0b1010)).toBe(0b1000);
    expect(applyMask('or', 0b1100, 0b1010)).toBe(0b1110);
    expect(applyMask('xor', 0b1100, 0b1010)).toBe(0b0110);
  });

  it('nejbližší maska nechá krystaly, na kterých nezáleží', () => {
    // AND: kde nápis mlčí, na masce nezáleží.
    expect(closestMask(cfg.tasks[0], 8, 0b01000000)).toBe(0b01000110);
    expect(closestMask({ value: 0b0011, op: 'and', target: 0b0100 }, 4, 0)).toBeNull();
    expect(closestMask({ value: 0b0011, op: 'or', target: 0b0001 }, 4, 0)).toBeNull();
  });

  it('jde vyřešit podle nápověd v ideálním počtu doteků', () => {
    let st = initMask();
    while (!st.complete) st = toggle(cfg, st, hintBit(cfg, st)!).state;
    expect(st.moves).toBe(par(cfg));
    expect(par(cfg)).toBe(2 + 1 + 8 + 7);
  });
});

describe('maska: klíč zůstává v masce', () => {
  const cfg: MaskConfig = {
    bits: 8,
    tasks: [
      { value: 69, op: 'xor', key: 0b1011, encrypt: true },
      { value: 69 ^ 0b1011, op: 'xor', key: 0b1011, carry: true },
      { value: 67 ^ 0b1011, op: 'xor', key: 0b1011, carry: true },
    ],
  };

  it('po zašifrování zůstane klíč v masce a další úlohy se vyřeší samy', () => {
    let st = initMask();
    for (const b of [3, 1, 0]) st = toggle(cfg, st, b).state;
    expect(st.step).toBe(1);
    expect(st.mask).toBe(0b1011);
    const a = arrive(cfg, st);
    expect(a.events).toContainEqual({ type: 'step', index: 1, result: 69 });
    const b = arrive(cfg, a.state);
    expect(b.events.map((e) => e.type)).toEqual(['step', 'complete']);
  });

  it('ideál nepočítá úlohy, které vyřeší klíč z minulé úlohy', () => {
    expect(par(cfg)).toBe(3);
  });

  it('úloha bez carry se sama nevyřeší', () => {
    expect(arrive(cfg, initMask()).events).toHaveLength(0);
  });
});
