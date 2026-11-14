import { describe, expect, it } from 'vitest';
import {
  combinations,
  decompose,
  flipBit,
  gray,
  hamming,
  maxValue,
  notationParts,
  patternWords,
  popcount,
  toBinaryString,
} from './bits';

describe('bits', () => {
  it('popcount spočítá jedničky', () => {
    expect(popcount(0)).toBe(0);
    expect(popcount(0b1011)).toBe(3);
    expect(popcount(255)).toBe(8);
  });

  it('hammingova vzdálenost', () => {
    expect(hamming(0b0101, 0b0011)).toBe(2);
    expect(hamming(7, 7)).toBe(0);
  });

  it('kombinace a maximum', () => {
    expect(combinations(3)).toBe(8);
    expect(combinations(8)).toBe(256);
    expect(maxValue(4)).toBe(15);
    expect(maxValue(8)).toBe(255);
  });

  it('flipBit přepne jednu pozici', () => {
    expect(flipBit(0b0000, 2)).toBe(0b0100);
    expect(flipBit(0b0100, 2)).toBe(0);
  });

  it('binární zápis s doplněním nul', () => {
    expect(toBinaryString(5, 4)).toBe('0101');
    expect(toBinaryString(0, 3)).toBe('000');
    expect(toBinaryString(15, 4)).toBe('1111');
  });

  it('rozklad na váhy', () => {
    expect(decompose(13)).toEqual([8, 4, 1]);
    expect(decompose(0)).toEqual([]);
  });

  it('podklad pro zápis', () => {
    expect(notationParts(5, 3)).toEqual({ binary: '101', terms: [4, 1], value: 5 });
  });

  it('slovní popis obrazce', () => {
    expect(patternWords(0b10, 2)).toBe('světlo, stín');
  });

  it('sousední hodnoty Grayova kódu se liší v jednom bitu', () => {
    for (let i = 0; i < 15; i++) expect(hamming(gray(i), gray(i + 1))).toBe(1);
  });
});
