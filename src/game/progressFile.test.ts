import { describe, expect, it } from 'vitest';
import { covers, fileNameFor, parseProgress, roomCount, serializeProgress } from './progressFile';
import { LAYOUT } from './migrate';
import type { ProgressData } from './progress.svelte.ts';

const LEVELS = ['I-0', 'I-1', 'I-2', 'I-3', 'I-6', 'I-7', 'I-8', 'II-6', 'II-14'];
const KODEX = ['jiskra', 'svit-stin', 'podoby'];

const sample: ProgressData = {
  version: 1,
  layout: LAYOUT,
  name: 'Jana',
  stats: { 'I-1': { entered: 2, solved: 1, extra: 0, hints: 1, stepHints: 0, quizMistakes: 0 } },
  levels: {
    'I-1': { seals: { solved: true, skill: true, pure: true } },
    'I-2': { seals: { solved: true, skill: false, pure: true } },
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
    // Soubor bez rozvržení je z nejstaršího číslování: Probuzení tehdy bylo I-1, dnes je I-0.
    expect(r.ok && r.data).toEqual({
      version: 1,
      layout: LAYOUT,
      name: '',
      stats: {},
      levels: { 'I-0': { seals: { solved: true, skill: false, pure: true } } },
      kodex: ['jiskra'],
      seen: [],
    });
  });

  it('soubor z doby před rozdělením pater převede na nová čísla komnat', () => {
    const seal = { solved: true, skill: false, pure: true };
    const text = JSON.stringify({
      format: 'svetlo-a-stin-postup',
      verze: 1,
      postup: { version: 1, levels: { 'I-1': { seals: seal, bestMoves: 1 }, 'I-6': { seals: seal }, 'I-7': { seals: seal }, 'I-10': { seals: seal }, 'II-7': { seals: seal }, 'II-10': { seals: seal } }, kodex: [], seen: [] },
    });
    const r = parseProgress(text, LEVELS, KODEX);
    expect(r.ok && Object.keys(r.data.levels).sort()).toEqual(['I-0', 'I-6', 'I-7', 'I-8', 'II-14', 'II-6']);
  });

  it('soubor z doby před nultými komnatami přestěhuje Probuzení z I-1 na I-0', () => {
    const seal = { solved: true, skill: true, pure: true };
    const text = JSON.stringify({
      format: 'svetlo-a-stin-postup',
      postup: { layout: 2, levels: { 'I-1': { seals: seal }, 'I-2': { seals: seal } }, stats: { 'I-1': { entered: 1, solved: 1 } } },
    });
    const r = parseProgress(text, LEVELS, KODEX);
    expect(r.ok && Object.keys(r.data.levels).sort()).toEqual(['I-0', 'I-2']);
    expect(r.ok && Object.keys(r.data.stats)).toEqual(['I-0']);
  });

  it('pozná, jestli soubor obsahuje všechno z tohoto počítače', () => {
    const more: ProgressData = {
      ...sample,
      levels: { ...sample.levels, 'I-3': { seals: { solved: true, skill: true, pure: true } } },
    };
    expect(covers(more, sample)).toBe(true);
    expect(covers(sample, more)).toBe(false);
    const worse: ProgressData = { ...sample, levels: { ...sample.levels, 'I-1': { ...sample.levels['I-1'], seals: { solved: true, skill: false, pure: true } } } };
    expect(covers(worse, sample)).toBe(false);
    expect(roomCount(more)).toBe(3);
  });
});

describe('soubor s postupem: jméno a statistiky', () => {
  it('název souboru nese jméno hráče bez zakázaných znaků', () => {
    expect(fileNameFor('')).toBe('Svetlo-a-Stin-postup.json');
    expect(fileNameFor('Jana Nová')).toBe('Svetlo-a-Stin-postup-Jana-Nová.json');
    expect(fileNameFor('a/b:c')).toBe('Svetlo-a-Stin-postup-abc.json');
  });

  it('statistiky z cizího souboru projdou jen jako nezáporná celá čísla', () => {
    const text = JSON.stringify({
      format: 'svetlo-a-stin-postup',
      postup: { layout: 2, name: '  Petr  ', levels: {}, stats: { 'I-1': { entered: 3.7, solved: -1, extra: 'x' }, 'IX-1': { entered: 1 } } },
    });
    const r = parseProgress(text, LEVELS, KODEX);
    expect(r.ok && r.data.name).toBe('Petr');
    expect(r.ok && r.data.stats).toEqual({ 'I-0': { entered: 3, solved: 0, extra: 0, hints: 0, stepHints: 0, quizMistakes: 0 } });
  });
});
