import { describe, expect, it } from 'vitest';
import { covers, parseProgress, roomCount, serializeProgress } from './progressFile';
import type { ProgressData } from './progress.svelte.ts';

const LEVELS = ['I-1', 'I-2', 'I-3'];
const KODEX = ['jiskra', 'svit-stin', 'podoby'];

const sample: ProgressData = {
  version: 1,
  levels: {
    'I-1': { seals: { solved: true, skill: true, pure: true }, bestMoves: 1 },
    'I-2': { seals: { solved: true, skill: false, pure: true }, bestMoves: 6 },
  },
  kodex: ['jiskra', 'svit-stin'],
  seen: ['jiskra'],
};

describe('soubor s postupem', () => {
  it('uložený postup jde znovu načíst beze ztráty', () => {
    const r = parseProgress(serializeProgress(sample), LEVELS, KODEX);
    expect(r).toEqual({ ok: true, data: sample });
  });

  it('odmítne cizí nebo poškozený soubor', () => {
    expect(parseProgress('není json', LEVELS, KODEX)).toMatchObject({ ok: false, reason: 'Soubor se nedá přečíst.' });
    expect(parseProgress('{"jiny": 1}', LEVELS, KODEX)).toMatchObject({ ok: false, reason: expect.stringContaining('není soubor') });
  });

  it('neznámé komnaty a záznamy vynechá, chybné hodnoty opraví', () => {
    const text = JSON.stringify({
      format: 'svetlo-a-stin-postup',
      postup: {
        levels: {
          'I-1': { seals: { skill: 'ano', pure: true }, bestMoves: -3 },
          'IX-9': { seals: { skill: true, pure: true }, bestMoves: 1 },
        },
        kodex: ['jiskra', 'neznamy', 'jiskra'],
        seen: 'nic',
      },
    });
    const r = parseProgress(text, LEVELS, KODEX);
    expect(r.ok && r.data).toEqual({
      version: 1,
      levels: { 'I-1': { seals: { solved: true, skill: false, pure: true }, bestMoves: Number.MAX_SAFE_INTEGER } },
      kodex: ['jiskra'],
      seen: [],
    });
  });

  it('pozná, jestli soubor obsahuje všechno z tohoto počítače', () => {
    const more: ProgressData = {
      ...sample,
      levels: { ...sample.levels, 'I-3': { seals: { solved: true, skill: true, pure: true }, bestMoves: 7 } },
    };
    expect(covers(more, sample)).toBe(true);
    expect(covers(sample, more)).toBe(false);
    const worse: ProgressData = { ...sample, levels: { ...sample.levels, 'I-1': { ...sample.levels['I-1'], seals: { solved: true, skill: false, pure: true } } } };
    expect(covers(worse, sample)).toBe(false);
    expect(roomCount(more)).toBe(3);
  });
});
