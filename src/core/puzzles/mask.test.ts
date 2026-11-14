import { describe, expect, it } from 'vitest';
import { applyMask, closestMask, hintBit, initMask, par, toggle, type MaskConfig } from './mask';

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
